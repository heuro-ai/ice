/*
  # Create Logistics Management Schema

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `company` (text)
      - `address` (text)
      - `status` (text, default 'active')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `shipments`
      - `id` (uuid, primary key)
      - `reference` (text, unique)
      - `customer_id` (uuid, foreign key)
      - `origin` (text)
      - `destination` (text)
      - `status` (text)
      - `type` (text)
      - `value` (numeric)
      - `weight` (numeric)
      - `estimated_delivery` (date)
      - `actual_delivery` (date)
      - `carrier` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `activities`
      - `id` (uuid, primary key)
      - `type` (text)
      - `title` (text)
      - `description` (text)
      - `shipment_id` (uuid, foreign key, optional)
      - `customer_id` (uuid, foreign key, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  company text,
  address text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text UNIQUE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  origin text NOT NULL,
  destination text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in-transit', 'customs', 'delivered', 'delayed')),
  type text DEFAULT 'import' CHECK (type IN ('import', 'export')),
  value numeric DEFAULT 0,
  weight numeric DEFAULT 0,
  estimated_delivery date,
  actual_delivery date,
  carrier text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('shipment', 'customer', 'document', 'alert', 'completion')),
  title text NOT NULL,
  description text,
  shipment_id uuid REFERENCES shipments(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create policies for customers
CREATE POLICY "Users can view all customers"
  ON customers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert customers"
  ON customers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update customers"
  ON customers
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete customers"
  ON customers
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for shipments
CREATE POLICY "Users can view all shipments"
  ON shipments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert shipments"
  ON shipments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update shipments"
  ON shipments
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete shipments"
  ON shipments
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for activities
CREATE POLICY "Users can view all activities"
  ON activities
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert activities"
  ON activities
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shipments_customer_id ON shipments(customer_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_type ON shipments(type);
CREATE INDEX IF NOT EXISTS idx_activities_shipment_id ON activities(shipment_id);
CREATE INDEX IF NOT EXISTS idx_activities_customer_id ON activities(customer_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipments_updated_at
  BEFORE UPDATE ON shipments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();