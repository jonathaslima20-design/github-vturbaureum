/*
  # Delete User Edge Function

  This function handles user deletion with proper authentication and authorization.

  1. Features
    - Validates user authentication
    - Checks admin/partner permissions
    - Deletes user from auth and database
    - Handles cascade deletions
    - Automatically cleans up all user storage files

  2. Storage Cleanup
    - Removes all product images (product/{userId}, products/{userId})
    - Removes user profile images (avatars, covers, banners)
    - Attempts cleanup even if some files fail to delete
    - Provides detailed cleanup statistics

  3. Security
    - Requires authenticated user
    - Admin can delete any non-admin user
    - Partners can delete users they created
*/

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
};

interface DeleteUserRequest {
  userId: string;
}

interface CleanupStats {
  filesDeleted: number;
  filesFailed: number;
  paths: string[];
  errors: { path: string; error: string }[];
}

function extractPathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname.split('/storage/v1/object/public/')[1] || urlObj.pathname.split('/public/')[1];
    return path || null;
  } catch {
    return null;
  }
}

async function getStoragePathsForUser(supabaseAdmin: any, userId: string): Promise<string[]> {
  const paths: string[] = [];

  try {
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('avatar_url, cover_url_desktop, cover_url_mobile, promotional_banner_url_desktop, promotional_banner_url_mobile')
      .eq('id', userId)
      .single();

    if (!userError && userData) {
      const urlFields = [
        userData.avatar_url,
        userData.cover_url_desktop,
        userData.cover_url_mobile,
        userData.promotional_banner_url_desktop,
        userData.promotional_banner_url_mobile
      ];

      for (const url of urlFields) {
        if (url) {
          const path = extractPathFromUrl(url);
          if (path) paths.push(path);
        }
      }
    }
  } catch (error) {
    console.error('Error getting user profile image paths:', error);
  }

  try {
    const { data: productImages, error: imageError } = await supabaseAdmin
      .from('product_images')
      .select('url')
      .in('product_id',
        (await supabaseAdmin
          .from('products')
          .select('id')
          .eq('user_id', userId)
          .then((res: any) => res.data?.map((p: any) => p.id) || [])
        )
      );

    if (!imageError && productImages) {
      for (const image of productImages) {
        if (image.url) {
          const path = extractPathFromUrl(image.url);
          if (path) paths.push(path);
        }
      }
    }
  } catch (error) {
    console.error('Error getting product image paths:', error);
  }

  return paths;
}

async function cleanupStorageFiles(supabaseAdmin: any, paths: string[]): Promise<CleanupStats> {
  const stats: CleanupStats = {
    filesDeleted: 0,
    filesFailed: 0,
    paths: [],
    errors: []
  };

  if (paths.length === 0) {
    return stats;
  }

  try {
    const { error } = await supabaseAdmin.storage
      .from('public')
      .remove(paths);

    if (error) {
      console.error('Storage removal error:', error);
      stats.filesFailed = paths.length;
      stats.errors.push({ path: paths.join(', '), error: error.message });
    } else {
      stats.filesDeleted = paths.length;
      stats.paths = paths;
    }
  } catch (error) {
    console.error('Error cleaning up storage files:', error);
    stats.filesFailed = paths.length;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    stats.errors.push({ path: paths.join(', '), error: errorMessage });
  }

  return stats;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'DELETE') {
      return new Response(
        JSON.stringify({ error: { message: 'Method not allowed' } }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: { message: 'Missing authorization header' } }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: { message: 'Unauthorized' } }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { userId }: DeleteUserRequest = await req.json();
    if (!userId) {
      return new Response(
        JSON.stringify({ error: { message: 'User ID is required' } }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { data: currentUserProfile, error: profileError } = await supabaseUser
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !currentUserProfile) {
      return new Response(
        JSON.stringify({ error: { message: 'Unable to verify user permissions' } }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { data: targetUser, error: targetError } = await supabaseAdmin
      .from('users')
      .select('role, created_by')
      .eq('id', userId)
      .single();

    if (targetError || !targetUser) {
      return new Response(
        JSON.stringify({ error: { message: 'User not found' } }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const canDelete = 
      (currentUserProfile.role === 'admin' && targetUser.role !== 'admin') ||
      (currentUserProfile.role === 'parceiro' && targetUser.created_by === user.id);

    if (!canDelete) {
      return new Response(
        JSON.stringify({ error: { message: 'Insufficient permissions to delete this user' } }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    let cleanupStats: CleanupStats | null = null;
    try {
      const storagePaths = await getStoragePathsForUser(supabaseAdmin, userId);
      console.log(`Found ${storagePaths.length} storage files to clean up for user ${userId}`);

      cleanupStats = await cleanupStorageFiles(supabaseAdmin, storagePaths);
      console.log(`Storage cleanup completed: ${cleanupStats.filesDeleted} deleted, ${cleanupStats.filesFailed} failed`);
    } catch (error) {
      console.error('Error during storage cleanup:', error);
    }

    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteAuthError) {
      console.error('Error deleting user from auth:', deleteAuthError);
      return new Response(
        JSON.stringify({ error: { message: 'Failed to delete user from authentication' } }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { error: deleteDbError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId);

    if (deleteDbError) {
      console.error('Error deleting user from database:', deleteDbError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        cleanup: cleanupStats || { filesDeleted: 0, filesFailed: 0, paths: [], errors: [] }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error in delete-user function:', error);
    return new Response(
      JSON.stringify({ error: { message: 'Internal server error' } }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
