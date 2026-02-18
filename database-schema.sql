-- =============================================
-- MADRASA STUDENT MANAGEMENT SYSTEM
-- Complete Database Schema
-- =============================================

-- Drop existing tables if needed (be careful in production!)
-- DROP TABLE IF EXISTS fee_reminders CASCADE;
-- DROP TABLE IF EXISTS fee_payments CASCADE;
-- DROP TABLE IF EXISTS student_documents CASCADE;
-- DROP TABLE IF EXISTS students CASCADE;

-- =============================================
-- 1. STUDENTS TABLE (Updated)
-- =============================================
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Information
    full_name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255) NOT NULL,
    guardian_name VARCHAR(255),
    
    -- Contact Information
    phone VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    address TEXT,
    email VARCHAR(255),
    
    -- Academic Information
    date_of_joining DATE NOT NULL DEFAULT CURRENT_DATE,
    academic_year VARCHAR(20) NOT NULL,
    class_level VARCHAR(100) NOT NULL,
    roll_number SERIAL,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'left', 'completed')),
    
    -- Fee Information
    monthly_fee_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    admission_fee_amount DECIMAL(10,2) DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. FEE PAYMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS fee_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    
    -- Fee Details
    fee_type VARCHAR(20) NOT NULL CHECK (fee_type IN ('monthly', 'admission', 'other')),
    amount DECIMAL(10,2) NOT NULL,
    
    -- Period
    month_name VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    
    -- Payment Details
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending', 'partial')),
    payment_date DATE,
    payment_mode VARCHAR(20) CHECK (payment_mode IN ('cash', 'online', 'bank_transfer', 'cheque')),
    
    -- Additional
    partial_amount DECIMAL(10,2) DEFAULT 0,
    remarks TEXT,
    receipt_number VARCHAR(50),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint to prevent duplicate entries for same month/year
    UNIQUE(student_id, fee_type, month_name, year)
);

-- =============================================
-- 3. FEE REMINDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS fee_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES fee_payments(id) ON DELETE SET NULL,
    
    -- Reminder Details
    reminder_type VARCHAR(20) NOT NULL CHECK (reminder_type IN ('sms', 'email', 'manual')),
    sent_to VARCHAR(255) NOT NULL,
    message TEXT,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. ACADEMIC YEARS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year_name VARCHAR(20) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 5. CLASS LEVELS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS class_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    monthly_fee DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 6. NOTICES TABLE (For Public Website)
-- =============================================
CREATE TABLE IF NOT EXISTS notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true,
    publish_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. CONTACT INQUIRIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 8. REMINDER SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS reminder_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reminder_frequency VARCHAR(20) DEFAULT 'monthly' CHECK (reminder_frequency IN ('weekly', 'monthly', 'manual')),
    sms_enabled BOOLEAN DEFAULT true,
    email_enabled BOOLEAN DEFAULT false,
    reminder_day INTEGER DEFAULT 5, -- Day of month to send reminders
    reminder_message_template TEXT DEFAULT 'Dear Parent, Fee for {month} {year} is pending for {student_name}. Amount: Rs. {amount}. Please pay at the earliest.',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR BETTER PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_students_full_name ON students(full_name);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_level);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_academic_year ON students(academic_year);
CREATE INDEX IF NOT EXISTS idx_students_phone ON students(phone);

CREATE INDEX IF NOT EXISTS idx_payments_student ON fee_payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON fee_payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_month_year ON fee_payments(month_name, year);
CREATE INDEX IF NOT EXISTS idx_payments_date ON fee_payments(payment_date);

CREATE INDEX IF NOT EXISTS idx_reminders_student ON fee_reminders(student_id);
CREATE INDEX IF NOT EXISTS idx_reminders_sent_at ON fee_reminders(sent_at);

CREATE INDEX IF NOT EXISTS idx_notices_published ON notices(is_published, publish_date);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_settings ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users (Admin)
CREATE POLICY "Enable all for authenticated" ON students FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated" ON fee_payments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated" ON fee_reminders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated" ON academic_years FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated" ON class_levels FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated" ON reminder_settings FOR ALL USING (auth.role() = 'authenticated');

-- Public read access for notices
CREATE POLICY "Enable read for all" ON notices FOR SELECT USING (is_published = true);
CREATE POLICY "Enable all for authenticated" ON notices FOR ALL USING (auth.role() = 'authenticated');

-- Public can submit contact inquiries
CREATE POLICY "Enable insert for all" ON contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable all for authenticated" ON contact_inquiries FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fee_payments_updated_at BEFORE UPDATE ON fee_payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- View: Students with pending dues
CREATE OR REPLACE VIEW students_with_pending_dues AS
SELECT 
    s.id,
    s.full_name,
    s.father_name,
    s.phone,
    s.class_level,
    s.monthly_fee_amount,
    COUNT(fp.id) as pending_months,
    SUM(CASE WHEN fp.payment_status = 'pending' THEN fp.amount 
             WHEN fp.payment_status = 'partial' THEN (fp.amount - COALESCE(fp.partial_amount, 0))
             ELSE 0 END) as total_pending_amount
FROM students s
LEFT JOIN fee_payments fp ON s.id = fp.student_id AND fp.payment_status IN ('pending', 'partial')
WHERE s.status = 'active'
GROUP BY s.id, s.full_name, s.father_name, s.phone, s.class_level, s.monthly_fee_amount
HAVING COUNT(fp.id) > 0 OR SUM(CASE WHEN fp.payment_status = 'pending' THEN fp.amount 
             WHEN fp.payment_status = 'partial' THEN (fp.amount - COALESCE(fp.partial_amount, 0))
             ELSE 0 END) > 0;

-- View: Monthly collections summary
CREATE OR REPLACE VIEW monthly_collections AS
SELECT 
    month_name,
    year,
    COUNT(DISTINCT student_id) as students_paid,
    SUM(CASE WHEN payment_status = 'paid' THEN amount ELSE partial_amount END) as total_collected,
    SUM(CASE WHEN payment_status = 'pending' THEN amount 
             WHEN payment_status = 'partial' THEN (amount - COALESCE(partial_amount, 0))
             ELSE 0 END) as total_pending
FROM fee_payments
GROUP BY month_name, year
ORDER BY year DESC, 
    CASE month_name 
        WHEN 'January' THEN 1 WHEN 'February' THEN 2 WHEN 'March' THEN 3
        WHEN 'April' THEN 4 WHEN 'May' THEN 5 WHEN 'June' THEN 6
        WHEN 'July' THEN 7 WHEN 'August' THEN 8 WHEN 'September' THEN 9
        WHEN 'October' THEN 10 WHEN 'November' THEN 11 WHEN 'December' THEN 12
    END DESC;

-- =============================================
-- SAMPLE DATA (Optional - Remove in Production)
-- =============================================

-- Insert default class levels
INSERT INTO class_levels (name, description, order_index, monthly_fee) VALUES
('Nursery', 'Nursery Level', 1, 500),
('Hifz Year 1', 'First Year of Hifz', 2, 800),
('Hifz Year 2', 'Second Year of Hifz', 3, 800),
('Hifz Year 3', 'Third Year of Hifz', 4, 800),
('Aalim Year 1', 'First Year Aalim Course', 5, 1000),
('Aalim Year 2', 'Second Year Aalim Course', 6, 1000),
('Aalim Year 3', 'Third Year Aalim Course', 7, 1000)
ON CONFLICT (name) DO NOTHING;

-- Insert current academic year
INSERT INTO academic_years (year_name, start_date, end_date, is_current) VALUES
('2025-2026', '2025-04-01', '2026-03-31', true)
ON CONFLICT (year_name) DO NOTHING;

-- Insert default reminder settings
INSERT INTO reminder_settings (reminder_frequency, sms_enabled, email_enabled, reminder_day)
VALUES ('monthly', true, false, 5)
ON CONFLICT DO NOTHING;
