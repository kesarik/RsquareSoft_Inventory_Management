-- ==========================================
-- 1. Create Custom Enums
-- ==========================================
CREATE TYPE category_type AS ENUM ('IT', 'Facility');
CREATE TYPE asset_status AS ENUM ('Available', 'Allocated', 'Under Maintenance', 'Damaged', 'Scrap', 'Replaced');
CREATE TYPE asset_condition AS ENUM ('New', 'Good', 'Fair', 'Poor');

-- ==========================================
-- 2. Create Independent Tables
-- ==========================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type category_type NOT NULL,
    description TEXT,                                               -- NEW
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,  -- NEW
    is_active BOOLEAN DEFAULT TRUE                                  -- NEW
);

CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,                                                   -- NEW
    gst_no VARCHAR(50),                                             -- NEW
    is_active BOOLEAN DEFAULT TRUE                                  -- NEW
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    emp_id VARCHAR(50) UNIQUE NOT NULL,  
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(100),
    designation VARCHAR(100),                                       -- NEW
    join_date DATE,                                                 -- NEW
    role VARCHAR(50),                                               -- NEW
    is_active BOOLEAN DEFAULT TRUE
);

-- ==========================================
-- 3. Create Dependent Tables (Inventory)
-- ==========================================
CREATE TABLE it_assets (                                            -- RENAMED (was assets)
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    vendor_id INTEGER NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    model_name VARCHAR(255) NOT NULL,
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    purchase_date DATE,
    warranty_expiry DATE,
    status asset_status NOT NULL DEFAULT 'Available',
    condition asset_condition NOT NULL DEFAULT 'New',
    specifications JSONB
);

CREATE TABLE facility_items (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    item_name VARCHAR(255) NOT NULL,
    total_quantity INTEGER NOT NULL DEFAULT 0,
    available_quantity INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER NOT NULL DEFAULT 5,
    unit VARCHAR(50) NOT NULL 
);

-- ==========================================
-- 4. Create Transaction Tables (Allocations)
-- ==========================================
CREATE TABLE asset_allocations (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER NOT NULL REFERENCES it_assets(id) ON DELETE RESTRICT, -- UPDATED REFERENCE
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    allocation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actual_return_date TIMESTAMP WITH TIME ZONE,
    digital_ack_status BOOLEAN DEFAULT FALSE,
    remarks TEXT
    -- expected_return_date REMOVED
);