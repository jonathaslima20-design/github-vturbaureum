import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.46.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const now = new Date();
    const sevenDaysFromNow = new Date(
      now.getTime() + 7 * 24 * 60 * 60 * 1000
    );
    const todayStr = now.toISOString().split("T")[0];
    const futureStr = sevenDaysFromNow.toISOString().split("T")[0];

    // Find users with subscriptions expiring in the next 7 days
    const { data: expiringUsers, error: queryError } = await supabase
      .from("users")
      .select("id, name, subscription_end_date, plan_status")
      .in("plan_status", ["active"])
      .gte("subscription_end_date", todayStr)
      .lte("subscription_end_date", futureStr);

    if (queryError) throw queryError;

    let created = 0;
    let skipped = 0;

    for (const user of expiringUsers || []) {
      // Check if we already sent an expiry notification for this period
      const { data: existing } = await supabase
        .from("notifications")
        .select("id")
        .eq("user_id", user.id)
        .eq("type", "subscription_expiring")
        .gte(
          "created_at",
          new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
        )
        .limit(1);

      if (existing && existing.length > 0) {
        skipped++;
        continue;
      }

      const endDate = new Date(user.subscription_end_date);
      const daysLeft = Math.ceil(
        (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      const { error: insertError } = await supabase
        .from("notifications")
        .insert({
          user_id: user.id,
          type: "subscription_expiring",
          title: "Assinatura expirando",
          message:
            daysLeft <= 1
              ? "Sua assinatura expira hoje! Renove para manter sua vitrine ativa."
              : `Sua assinatura expira em ${daysLeft} dias. Renove para manter sua vitrine ativa.`,
          related_entity_type: "subscription",
        });

      if (insertError) {
        console.error(
          `Failed to notify user ${user.id}:`,
          insertError.message
        );
      } else {
        created++;
      }
    }

    // Also check for already expired subscriptions
    const { data: expiredUsers, error: expiredError } = await supabase
      .from("users")
      .select("id, name, subscription_end_date, plan_status")
      .in("plan_status", ["active"])
      .lt("subscription_end_date", todayStr);

    if (!expiredError) {
      for (const user of expiredUsers || []) {
        const { data: existing } = await supabase
          .from("notifications")
          .select("id")
          .eq("user_id", user.id)
          .eq("type", "subscription_expired")
          .gte(
            "created_at",
            new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
          )
          .limit(1);

        if (existing && existing.length > 0) {
          skipped++;
          continue;
        }

        const { error: insertError } = await supabase
          .from("notifications")
          .insert({
            user_id: user.id,
            type: "subscription_expired",
            title: "Assinatura expirada",
            message:
              "Sua assinatura expirou. Renove agora para continuar usando todos os recursos.",
            related_entity_type: "subscription",
          });

        if (!insertError) created++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        expiring_users_found: expiringUsers?.length || 0,
        expired_users_found: expiredUsers?.length || 0,
        notifications_created: created,
        notifications_skipped: skipped,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("check-expiring-subscriptions error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
