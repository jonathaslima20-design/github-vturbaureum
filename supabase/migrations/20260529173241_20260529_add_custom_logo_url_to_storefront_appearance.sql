/*
  # Add custom_logo_url to storefront_appearance

  ## Summary
  Adds a nullable `custom_logo_url` column to the `storefront_appearance` table,
  allowing annual-plan users to upload their own brand logo that replaces the
  VitrineTurbo logo and "Crie sua Vitrine Digital" text in the storefront footer.

  ## Changes
  - `storefront_appearance`: new column `custom_logo_url TEXT NULL`

  ## Notes
  - NULL means no custom logo — the default VitrineTurbo branding is shown
  - Only writable by users with an active annual billing cycle (enforced in the frontend)
  - No RLS change needed; existing owner-only UPDATE policy already covers this column
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'storefront_appearance' AND column_name = 'custom_logo_url'
  ) THEN
    ALTER TABLE storefront_appearance ADD COLUMN custom_logo_url TEXT NULL;
  END IF;
END $$;
