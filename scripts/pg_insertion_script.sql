-- ==========================================
-- DUMMY DATA INSERTION SCRIPT
-- RsquareSoft IT Asset & Facility Management
-- Run AFTER pg_creation_script.sql
-- ==========================================
-- Roles (1=super_admin, 2=it_admin, 3=facility_admin, 4=employee)
-- already seeded by pg_creation_script.sql


-- ==========================================
-- 1. Categories
-- ==========================================
-- IDs 1-10 → IT | IDs 11-20 → Facility
INSERT INTO categories (name, type, description, is_active) VALUES
('Laptop',              'IT',       'Portable personal computers',              TRUE),
('Desktop',             'IT',       'Fixed workstation computers',              TRUE),
('Monitor',             'IT',       'Display screens and monitors',             TRUE),
('Keyboard & Mouse',    'IT',       'Input peripherals',                        TRUE),
('Printer',             'IT',       'Printing and scanning devices',            TRUE),
('Network Equipment',   'IT',       'Routers, switches and access points',      TRUE),
('UPS',                 'IT',       'Uninterruptible power supply units',       TRUE),
('Mobile Phone',        'IT',       'Company issued smartphones',               TRUE),
('Headset',             'IT',       'Audio headsets and earphones',             TRUE),
('Docking Station',     'IT',       'Laptop docking and port replicators',      TRUE),
('Chair',               'Facility', 'Office seating',                           TRUE),
('Desk',                'Facility', 'Office workstation desks',                 TRUE),
('Conference Table',    'Facility', 'Meeting room tables',                      TRUE),
('Whiteboard',          'Facility', 'Wall-mounted writing boards',              TRUE),
('Projector',           'Facility', 'Presentation projectors',                  TRUE),
('Air Conditioner',     'Facility', 'Cooling and HVAC units',                   TRUE),
('Coffee Machine',      'Facility', 'Pantry coffee and beverage machines',      TRUE),
('Filing Cabinet',      'Facility', 'Document storage cabinets',                TRUE),
('Sofa',                'Facility', 'Lounge and reception seating',             TRUE),
('Locker',              'Facility', 'Personal storage lockers',                 TRUE);


-- ==========================================
-- 2. Vendors
-- ==========================================
-- IDs 1-10
INSERT INTO vendors (name, contact_person, email, phone, address, gst_no, is_active) VALUES
('Dell Technologies India',     'Rajesh Sharma',    'rajesh.sharma@dell.com',       '+91-9823401001', 'DLF Cyber City, Gurugram, Haryana 122002',                     '06AABCD1234E1ZV', TRUE),
('HP India Pvt Ltd',            'Priya Mehta',      'priya.mehta@hp.com',           '+91-9823401002', 'Embassy Golf Links, Bengaluru, Karnataka 560071',              '29AABCE5678F1ZR', TRUE),
('Lenovo India Pvt Ltd',        'Amit Verma',       'amit.verma@lenovo.com',        '+91-9823401003', 'World Trade Center, Pune, Maharashtra 411014',                 '27AABCF9012G1ZS', TRUE),
('Apple India Pvt Ltd',         'Neha Singh',       'neha.singh@apple.com',         '+91-9823401004', 'Infinity Tower, BKC, Mumbai, Maharashtra 400051',              '27AABCG3456H1ZT', TRUE),
('Logitech India Pvt Ltd',      'Suresh Nair',      'suresh.nair@logitech.com',     '+91-9823401005', 'Prestige Tech Park, Bengaluru, Karnataka 560066',              '29AABCH7890I1ZU', TRUE),
('Samsung India Electronics',   'Kavita Reddy',     'kavita.reddy@samsung.com',     '+91-9823401006', 'Cyber Hub, Gurugram, Haryana 122001',                          '06AABCI2345J1ZW', TRUE),
('LG Electronics India',        'Vikram Joshi',     'vikram.joshi@lg.com',          '+91-9823401007', 'Udyog Vihar, Gurugram, Haryana 122016',                        '06AABCJ6789K1ZX', TRUE),
('Cisco Systems India',         'Ananya Patel',     'ananya.patel@cisco.com',       '+91-9823401008', 'Cessna Business Park, Bengaluru, Karnataka 560037',            '29AABCK1234L1ZY', TRUE),
('Epson India Pvt Ltd',         'Rohan Gupta',      'rohan.gupta@epson.com',        '+91-9823401009', 'Velachery Main Road, Chennai, Tamil Nadu 600042',              '33AABCL5678M1ZZ', TRUE),
('Godrej Interio',              'Sanjana Pillai',   'sanjana.pillai@godrej.com',    '+91-9823401010', 'Pirojshanagar, Vikhroli, Mumbai, Maharashtra 400079',          '27AABCM9012N1ZA', TRUE);


-- ==========================================
-- 3. Employees
-- ==========================================
-- role_id: 1=super_admin, 2=it_admin, 3=facility_admin, 4=employee
INSERT INTO employees (emp_id, full_name, email, department, designation, join_date, role_id, is_active) VALUES
('EMP1001', 'Aum Khamar',           'aum.khamar@rsquaresoft.com',           'Management',       'CEO',                      '2020-01-15', 1, TRUE),
('EMP1002', 'Ravi Patil',           'ravi.patil@rsquaresoft.com',           'IT',               'IT Administrator',         '2020-03-01', 2, TRUE),
('EMP1003', 'Sunita Joshi',         'sunita.joshi@rsquaresoft.com',         'Operations',       'Facility Manager',         '2020-03-15', 3, TRUE),
('EMP1004', 'Arjun Desai',          'arjun.desai@rsquaresoft.com',          'Engineering',      'Senior Software Engineer', '2021-01-10', 4, TRUE),
('EMP1005', 'Pooja Nair',           'pooja.nair@rsquaresoft.com',           'Engineering',      'Software Engineer',        '2021-06-01', 4, TRUE),
('EMP1006', 'Karan Mehta',          'karan.mehta@rsquaresoft.com',          'Engineering',      'Full Stack Developer',     '2022-02-14', 4, TRUE),
('EMP1007', 'Divya Sharma',         'divya.sharma@rsquaresoft.com',         'Human Resources',  'HR Manager',               '2020-07-01', 4, TRUE),
('EMP1008', 'Nikhil Rao',           'nikhil.rao@rsquaresoft.com',           'Finance',          'Finance Analyst',          '2021-09-01', 4, TRUE),
('EMP1009', 'Meera Iyer',           'meera.iyer@rsquaresoft.com',           'Sales',            'Sales Executive',          '2022-04-01', 4, TRUE),
('EMP1010', 'Siddharth Kulkarni',   'siddharth.kulkarni@rsquaresoft.com',   'Engineering',      'DevOps Engineer',          '2021-11-15', 4, TRUE),
('EMP1011', 'Anisha Patel',         'anisha.patel@rsquaresoft.com',         'Marketing',        'Marketing Executive',      '2023-01-09', 4, TRUE),
('EMP1012', 'Rahul Bose',           'rahul.bose@rsquaresoft.com',           'Engineering',      'QA Engineer',              '2022-08-22', 4, TRUE);


-- ==========================================
-- 4. Users
-- ==========================================
-- username = part before @ in employee email
-- employee_id 1-12 matches EMP1001-EMP1012 insertion order above
INSERT INTO users (employee_id, username, password, is_active) VALUES
(1,  'aum.khamar',         '1234', TRUE),
(2,  'ravi.patil',         '1234', TRUE),
(3,  'sunita.joshi',       '1234', TRUE),
(4,  'arjun.desai',        '1234', TRUE),
(5,  'pooja.nair',         '1234', TRUE),
(6,  'karan.mehta',        '1234', TRUE),
(7,  'divya.sharma',       '1234', TRUE),
(8,  'nikhil.rao',         '1234', TRUE),
(9,  'meera.iyer',         '1234', TRUE),
(10, 'siddharth.kulkarni', '1234', TRUE),
(11, 'anisha.patel',       '1234', TRUE),
(12, 'rahul.bose',         '1234', TRUE);


-- ==========================================
-- 5. IT Assets
-- ==========================================
-- category_id reference:
--   1=Laptop  2=Desktop  3=Monitor  4=Keyboard & Mouse
--   5=Printer  6=Network Equipment  7=UPS  8=Mobile Phone
--   9=Headset  10=Docking Station
-- vendor_id reference:
--   1=Dell  2=HP  3=Lenovo  4=Apple  5=Logitech
--   6=Samsung  7=LG  8=Cisco  9=Epson  10=Godrej

INSERT INTO it_assets (category_id, vendor_id, model_name, serial_number, purchase_date, warranty_expiry, status, condition, specifications) VALUES

-- Laptops
(1, 1, 'Dell Latitude 5540',           'DL-LAT54-2024-001', '2024-01-10', '2027-01-10', 'Allocated',        'Good', '{"processor": "Intel Core i5-1335U", "ram": "16GB DDR4", "storage": "512GB SSD", "display": "15.6 inch FHD"}'),
(1, 1, 'Dell Latitude 5540',           'DL-LAT54-2024-002', '2024-01-10', '2027-01-10', 'Allocated',        'Good', '{"processor": "Intel Core i5-1335U", "ram": "16GB DDR4", "storage": "512GB SSD", "display": "15.6 inch FHD"}'),
(1, 1, 'Dell Latitude 5540',           'DL-LAT54-2024-003', '2024-01-10', '2027-01-10', 'Available',        'New',  '{"processor": "Intel Core i5-1335U", "ram": "16GB DDR4", "storage": "512GB SSD", "display": "15.6 inch FHD"}'),
(1, 3, 'Lenovo ThinkPad T14 Gen 4',    'LN-T14G4-2023-001', '2023-06-15', '2026-06-15', 'Allocated',        'Good', '{"processor": "AMD Ryzen 5 PRO 7540U", "ram": "16GB DDR5", "storage": "512GB SSD", "display": "14 inch FHD IPS"}'),
(1, 3, 'Lenovo ThinkPad T14 Gen 4',    'LN-T14G4-2023-002', '2023-06-15', '2026-06-15', 'Available',        'Good', '{"processor": "AMD Ryzen 5 PRO 7540U", "ram": "16GB DDR5", "storage": "512GB SSD", "display": "14 inch FHD IPS"}'),
(1, 4, 'Apple MacBook Pro 14 M3 Pro',  'AP-MBP14-2024-001', '2024-03-20', '2027-03-20', 'Allocated',        'New',  '{"processor": "Apple M3 Pro", "ram": "18GB Unified", "storage": "512GB SSD", "display": "14.2 inch Liquid Retina XDR"}'),
(1, 4, 'Apple MacBook Air 15 M2',      'AP-MBA15-2023-001', '2023-09-01', '2026-09-01', 'Allocated',        'Good', '{"processor": "Apple M2", "ram": "8GB Unified", "storage": "256GB SSD", "display": "15.3 inch Liquid Retina"}'),
(1, 2, 'HP EliteBook 840 G10',         'HP-ELB840-2023-001','2023-04-12', '2026-04-12', 'Available',        'Good', '{"processor": "Intel Core i7-1355U", "ram": "16GB DDR4", "storage": "512GB SSD", "display": "14 inch FHD IPS"}'),
(1, 2, 'HP EliteBook 840 G10',         'HP-ELB840-2023-002','2023-04-12', '2026-04-12', 'Under Maintenance','Fair', '{"processor": "Intel Core i7-1355U", "ram": "16GB DDR4", "storage": "512GB SSD", "display": "14 inch FHD IPS"}'),

-- Desktops
(2, 1, 'Dell OptiPlex 7010 Tower',     'DL-OPX70-2023-001', '2023-02-20', '2026-02-20', 'Allocated',        'Good', '{"processor": "Intel Core i5-13500", "ram": "16GB DDR4", "storage": "1TB HDD + 256GB SSD", "form_factor": "Tower"}'),
(2, 2, 'HP ProDesk 600 G9 MT',         'HP-PRD600-2022-001','2022-11-05', '2025-11-05', 'Available',        'Fair', '{"processor": "Intel Core i5-12500", "ram": "8GB DDR4",  "storage": "512GB SSD", "form_factor": "Micro Tower"}'),
(2, 3, 'Lenovo ThinkCentre M70t',      'LN-M70T-2022-001',  '2022-08-18', '2025-08-18', 'Allocated',        'Fair', '{"processor": "Intel Core i5-12400", "ram": "8GB DDR4",  "storage": "256GB SSD + 1TB HDD", "form_factor": "Tower"}'),

-- Monitors
(3, 6, 'Samsung 27" S27B800T 4K',      'SM-S27B8-2023-001', '2023-07-01', '2026-07-01', 'Allocated',        'Good', '{"size": "27 inch", "resolution": "3840x2160 UHD", "panel": "IPS", "ports": "HDMI 2.0, DisplayPort 1.4, USB-C 90W"}'),
(3, 6, 'Samsung 27" S27B800T 4K',      'SM-S27B8-2023-002', '2023-07-01', '2026-07-01', 'Allocated',        'Good', '{"size": "27 inch", "resolution": "3840x2160 UHD", "panel": "IPS", "ports": "HDMI 2.0, DisplayPort 1.4, USB-C 90W"}'),
(3, 6, 'Samsung 24" F24T450F FHD',     'SM-F24T4-2022-001', '2022-05-10', '2025-05-10', 'Available',        'Fair', '{"size": "24 inch", "resolution": "1920x1080 FHD", "panel": "IPS", "ports": "HDMI, DisplayPort"}'),
(3, 7, 'LG 27UK850 27" 4K',            'LG-27UK8-2023-001', '2023-01-18', '2026-01-18', 'Allocated',        'Good', '{"size": "27 inch", "resolution": "3840x2160 UHD", "panel": "IPS", "ports": "HDMI 2.0, DisplayPort 1.4, USB-C"}'),
(3, 7, 'LG 24MK430H 24" FHD',         'LG-24MK4-2022-001', '2022-03-22', '2025-03-22', 'Damaged',          'Poor', '{"size": "24 inch", "resolution": "1920x1080 FHD", "panel": "IPS", "ports": "HDMI, D-Sub"}'),

-- Keyboards & Mice
(4, 5, 'Logitech MK270 Wireless Combo','LG-MK270-2023-001', '2023-09-05', '2025-09-05', 'Available',        'Good', '{"type": "Wireless combo", "layout": "Full size", "battery": "AAA batteries", "range": "10m"}'),
(4, 5, 'Logitech MK270 Wireless Combo','LG-MK270-2023-002', '2023-09-05', '2025-09-05', 'Allocated',        'Good', '{"type": "Wireless combo", "layout": "Full size", "battery": "AAA batteries", "range": "10m"}'),
(4, 5, 'Logitech MK270 Wireless Combo','LG-MK270-2023-003', '2023-09-05', '2025-09-05', 'Allocated',        'Good', '{"type": "Wireless combo", "layout": "Full size", "battery": "AAA batteries", "range": "10m"}'),

-- Printers
(5, 9, 'Epson EcoTank L3250',          'EP-L3250-2023-001', '2023-03-25', '2026-03-25', 'Available',        'Good', '{"type": "Inkjet MFP", "functions": "Print, Scan, Copy", "connectivity": "Wi-Fi, USB", "ppm_black": 10}'),
(5, 2, 'HP LaserJet Pro M428fdw',      'HP-M428F-2022-001', '2022-08-14', '2025-08-14', 'Available',        'Good', '{"type": "Laser MFP", "functions": "Print, Scan, Copy, Fax", "connectivity": "Wi-Fi, Ethernet, USB", "ppm_black": 38}'),

-- Network Equipment
(6, 8, 'Cisco Catalyst 2960-X 24-Port','CS-C296X-2022-001', '2022-04-01', '2025-04-01', 'Available',        'Good', '{"ports": "24x GigE + 4x SFP+", "managed": true, "layer": 2}'),
(6, 8, 'Cisco RV340 Dual WAN Router',  'CS-RV340-2022-001', '2022-04-01', '2025-04-01', 'Available',        'Good', '{"wan_ports": 2, "lan_ports": 4, "vpn": true, "throughput_mbps": 900}'),

-- UPS
(7, 2, 'HP R/T3000 G5 UPS',            'HP-RT30G5-2023-001','2023-05-20', '2026-05-20', 'Available',        'Good', '{"capacity_va": 3000, "capacity_w": 2700, "type": "Line Interactive", "runtime_min": 10}'),
(7, 2, 'HP R/T3000 G5 UPS',            'HP-RT30G5-2023-002','2023-05-20', '2026-05-20', 'Available',        'Good', '{"capacity_va": 3000, "capacity_w": 2700, "type": "Line Interactive", "runtime_min": 10}'),

-- Mobile Phones
(8, 4, 'Apple iPhone 15 Pro',           'AP-IP15P-2024-001', '2024-01-05', '2026-01-05', 'Allocated',        'New',  '{"storage": "256GB", "color": "Natural Titanium", "os": "iOS 17"}'),
(8, 6, 'Samsung Galaxy S24',            'SM-S24-2024-001',   '2024-02-10', '2026-02-10', 'Allocated',        'New',  '{"storage": "256GB", "color": "Marble Gray", "os": "Android 14"}'),

-- Headsets
(9, 5, 'Logitech H390 USB Headset',    'LG-H390-2023-001',  '2023-08-10', '2025-08-10', 'Allocated',        'Good', '{"type": "Wired USB", "microphone": "Noise-cancelling", "controls": "Inline volume & mute"}'),
(9, 5, 'Logitech H390 USB Headset',    'LG-H390-2023-002',  '2023-08-10', '2025-08-10', 'Allocated',        'Good', '{"type": "Wired USB", "microphone": "Noise-cancelling", "controls": "Inline volume & mute"}'),
(9, 5, 'Logitech H390 USB Headset',    'LG-H390-2023-003',  '2023-08-10', '2025-08-10', 'Available',        'Good', '{"type": "Wired USB", "microphone": "Noise-cancelling", "controls": "Inline volume & mute"}'),

-- Docking Stations
(10, 1, 'Dell WD19S 130W Dock',        'DL-WD19S-2024-001', '2024-02-15', '2027-02-15', 'Allocated',        'New',  '{"ports": "3x USB-A, 2x USB-C, HDMI, 2x DisplayPort, RJ45, Audio", "power_delivery_w": 130, "max_displays": 3}'),
(10, 1, 'Dell WD19S 130W Dock',        'DL-WD19S-2024-002', '2024-02-15', '2027-02-15', 'Available',        'New',  '{"ports": "3x USB-A, 2x USB-C, HDMI, 2x DisplayPort, RJ45, Audio", "power_delivery_w": 130, "max_displays": 3}');


-- ==========================================
-- 6. Facility Items
-- ==========================================
-- category_id reference:
--   11=Chair  12=Desk  13=Conference Table  14=Whiteboard
--   15=Projector  16=Air Conditioner  17=Coffee Machine
--   18=Filing Cabinet  19=Sofa  20=Locker

INSERT INTO facility_items (category_id, item_name, total_quantity, available_quantity, low_stock_threshold, unit) VALUES
(11, 'Godrej Interio Ergonomic Office Chair',   50, 38, 10, 'piece'),
(11, 'Godrej Interio Visitor Chair',            20, 15,  5, 'piece'),
(12, 'Workstation Desk 4ft x 2ft',              40, 28,  8, 'piece'),
(12, 'Height-Adjustable Standing Desk',         10,  7,  3, 'piece'),
(13, '10-Seater Conference Table',               3,  3,  1, 'piece'),
(13, '20-Seater Boardroom Table',                1,  1,  1, 'piece'),
(14, 'Magnetic Whiteboard 4ft x 3ft',            8,  6,  2, 'piece'),
(14, 'Whiteboard Marker Set (4 colours)',        30, 12, 10, 'set'),
(15, 'Epson EB-X51 XGA Projector',               4,  3,  1, 'piece'),
(16, 'LG 1.5 Ton Dual Inverter Split AC',       12, 11,  2, 'piece'),
(17, 'Nescafe Alegria A510 Coffee Machine',      3,  3,  1, 'piece'),
(18, 'Godrej Interio 4-Drawer Filing Cabinet',  15, 10,  3, 'piece'),
(19, '3-Seater Lounge Sofa',                     4,  4,  1, 'piece'),
(20, 'Single-Door Personal Locker',             60, 48, 10, 'piece');
