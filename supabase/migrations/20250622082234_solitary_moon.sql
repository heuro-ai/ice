/*
  # Fix shipment-customer foreign key relationship

  1. Database Changes
    - Drop existing foreign key constraint if it exists
    - Recreate the foreign key constraint between shipments.customer_id and customers.id
    - Ensure the relationship is properly recognized by Supabase

  2. Security
    - No changes to RLS policies needed
*/

-- Drop the existing foreign key constraint if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'shipments_customer_id_fkey' 
    AND table_name = 'shipments'
  ) THEN
    ALTER TABLE public.shipments DROP CONSTRAINT shipments_customer_id_fkey;
  END IF;
END $$;

-- Recreate the foreign key constraint
ALTER TABLE public.shipments
ADD CONSTRAINT shipments_customer_id_fkey
FOREIGN KEY (customer_id)
REFERENCES public.customers(id)
ON DELETE CASCADE;

-- Create an index on customer_id if it doesn't exist (helps with join performance)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'shipments' 
    AND indexname = 'idx_shipments_customer_id'
  ) THEN
    CREATE INDEX idx_shipments_customer_id ON public.shipments(customer_id);
  END IF;
END $$;