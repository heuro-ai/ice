/*
  # Seed Initial Data

  1. Insert sample customers
  2. Insert sample shipments
  3. Insert sample activities
*/

-- Insert sample customers
INSERT INTO customers (name, email, phone, company, address) VALUES
('John Smith', 'john@globaltrade.com', '+1-555-0123', 'Global Trade Inc.', '123 Harbor St, Los Angeles, CA'),
('Sarah Chen', 'sarah@techsolutions.com', '+1-555-0456', 'Tech Solutions Ltd.', '456 Innovation Ave, San Francisco, CA'),
('Michael Rodriguez', 'michael@manufacturing.com', '+1-555-0789', 'Manufacturing Corp.', '789 Industrial Blvd, Houston, TX'),
('Emily Johnson', 'emily@retailpartners.com', '+1-555-0321', 'Retail Partners', '321 Commerce St, Miami, FL'),
('David Wilson', 'david@fooddist.com', '+1-555-0654', 'Food Distributors', '654 Supply Chain Ave, Seattle, WA'),
('Lisa Anderson', 'lisa@electronics.com', '+1-555-0987', 'Electronics Inc.', '987 Tech Park Dr, Austin, TX');

-- Insert sample shipments
INSERT INTO shipments (reference, customer_id, origin, destination, status, type, value, weight, estimated_delivery, carrier) VALUES
('SH-2024-001', (SELECT id FROM customers WHERE email = 'john@globaltrade.com'), 'Shanghai', 'Los Angeles', 'in-transit', 'import', 145000, 12500, '2024-12-15', 'Maersk Line'),
('SH-2024-002', (SELECT id FROM customers WHERE email = 'sarah@techsolutions.com'), 'Hamburg', 'New York', 'customs', 'import', 89000, 8500, '2024-12-12', 'COSCO'),
('SH-2024-003', (SELECT id FROM customers WHERE email = 'michael@manufacturing.com'), 'Los Angeles', 'Tokyo', 'pending', 'export', 210000, 15000, '2024-12-20', 'MSC'),
('SH-2024-004', (SELECT id FROM customers WHERE email = 'emily@retailpartners.com'), 'Rotterdam', 'Miami', 'delivered', 'import', 67000, 5500, '2024-12-08', 'Hapag-Lloyd'),
('SH-2024-005', (SELECT id FROM customers WHERE email = 'david@fooddist.com'), 'Singapore', 'Vancouver', 'delayed', 'import', 125000, 9800, '2024-12-14', 'ONE'),
('SH-2024-006', (SELECT id FROM customers WHERE email = 'lisa@electronics.com'), 'Seoul', 'Seattle', 'in-transit', 'import', 178000, 11200, '2024-12-18', 'Hyundai Merchant Marine');

-- Insert sample activities
INSERT INTO activities (type, title, description, shipment_id) VALUES
('shipment', 'New shipment created', 'SH-2024-001 from Shanghai to Los Angeles', (SELECT id FROM shipments WHERE reference = 'SH-2024-001')),
('completion', 'Shipment delivered', 'SH-2024-004 successfully delivered to customer', (SELECT id FROM shipments WHERE reference = 'SH-2024-004')),
('alert', 'Customs delay', 'SH-2024-005 delayed at customs for inspection', (SELECT id FROM shipments WHERE reference = 'SH-2024-005')),
('shipment', 'Shipment in transit', 'SH-2024-006 departed from Seoul port', (SELECT id FROM shipments WHERE reference = 'SH-2024-006'));

INSERT INTO activities (type, title, description, customer_id) VALUES
('customer', 'New customer registered', 'Global Trade Inc. completed registration', (SELECT id FROM customers WHERE email = 'john@globaltrade.com')),
('document', 'Documents uploaded', 'Bill of lading and invoice submitted', (SELECT id FROM customers WHERE email = 'sarah@techsolutions.com'));