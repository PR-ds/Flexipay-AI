-- FlexiPay AI Database Schema & Seed Data (SQLite)

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS scam_patterns;
DROP TABLE IF EXISTS government_schemes;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS bank_accounts;

-- 1. Bank Accounts Table
CREATE TABLE bank_accounts (
    account_number TEXT PRIMARY KEY,
    account_holder_name TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    balance REAL NOT NULL DEFAULT 0.0,
    kcc_limit REAL DEFAULT 0.0,
    kcc_balance REAL DEFAULT 0.0,
    language_preference TEXT DEFAULT 'hi-IN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Contacts Phonebook
CREATE TABLE contacts (
    contact_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_phone TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    upi_id TEXT NOT NULL,
    relationship TEXT,
    is_verified INTEGER DEFAULT 1,
    FOREIGN KEY(user_phone) REFERENCES bank_accounts(phone_number)
);

-- 3. Government Scheme Eligibility Database
CREATE TABLE government_schemes (
    scheme_id TEXT PRIMARY KEY,
    scheme_name TEXT NOT NULL,
    scheme_name_hi TEXT NOT NULL,
    category TEXT NOT NULL, -- KCC, Subsidy, Insurance, Pension
    max_land_acres REAL,
    min_land_acres REAL,
    occupation TEXT,
    max_annual_income REAL,
    benefit_description TEXT NOT NULL,
    benefit_description_hi TEXT NOT NULL,
    max_financial_aid REAL NOT NULL
);

-- 4. Common Fraud & Scam Heuristic Patterns
CREATE TABLE scam_patterns (
    pattern_id INTEGER PRIMARY KEY AUTOINCREMENT,
    phrase_pattern TEXT NOT NULL,
    language TEXT NOT NULL,
    risk_weight REAL NOT NULL,
    category TEXT NOT NULL -- URGENCY, LOTTERY, VISHING, UNKNOWN_VPA
);

-- 5. Audit Log Table
CREATE TABLE audit_logs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_phone TEXT,
    intent_type TEXT,
    raw_transcript TEXT,
    risk_level TEXT,
    threat_category TEXT,
    amount REAL,
    status TEXT
);

-- SEED DATA

-- Bank Accounts
INSERT INTO bank_accounts (account_number, account_holder_name, phone_number, balance, kcc_limit, kcc_balance, language_preference) VALUES
('10982345671', 'Ramesh Kumar', '+919876543210', 12450.50, 160000.00, 45000.00, 'hi-IN'),
('10982345672', 'Suresh Patel', '+919876543211', 8920.00, 200000.00, 10000.00, 'hi-IN'),
('10982345673', 'Anita Devi', '+919876543212', 25600.00, 150000.00, 0.00, 'mr-IN');

-- Contacts
INSERT INTO contacts (user_phone, contact_name, contact_phone, upi_id, relationship) VALUES
('+919876543210', 'Suresh Seeds', '+919876543211', 'suresh@upi', 'Supplier'),
('+919876543210', 'Ramesh Kaka', '+919811122233', 'rameshkaka@sbi', 'Neighbor'),
('+919876543210', 'Gram Panchayat', '+919800001111', 'panchayat@gov', 'Official'),
('+919876543210', 'Sunita Sister', '+919822233344', 'sunita@paytm', 'Family');

-- Government Schemes
INSERT INTO government_schemes (scheme_id, scheme_name, scheme_name_hi, category, max_land_acres, min_land_acres, occupation, max_annual_income, benefit_description, benefit_description_hi, max_financial_aid) VALUES
('PM_KCC_01', 'PM Kisan Credit Card', 'प्रधानमंत्री किसान क्रेडिट कार्ड', 'LOAN', 10.0, 0.1, 'Farmer', 300000, 'Collateral-free agricultural loan at 4% subsidized interest rate up to ₹1.6 Lakhs.', '4% रियायती ब्याज दर पर ₹1.6 लाख तक बिना गारंटी कृषि ऋण।', 160000.00),
('PM_KISAN_SAMMAN', 'PM Kisan Samman Nidhi', 'पीएम किसान सम्मान निधि', 'SUBSIDY', 5.0, 0.0, 'Farmer', 200000, 'Direct income support of ₹6,000 per year in three equal installments.', 'प्रतिवर्ष ₹6,000 की सीधी आय सहायता 3 किस्तों में।', 6000.00),
('PM_FASAL_BIMA', 'PM Fasal Bima Yojana', 'प्रधानमंत्री फसल बीमा योजना', 'INSURANCE', 20.0, 0.0, 'Farmer', 500000, 'Comprehensive crop insurance against natural calamities at low premium (1.5% - 2%).', 'प्राकृतिक आपदाओं के विरुद्ध कम प्रीमियम (1.5% - 2%) पर व्यापक फसल बीमा।', 100000.00),
('PM_KRISHI_SINCHAYEE', 'PM Krishi Sinchayee Yojana', 'प्रधानमंत्री कृषि सिंचाई योजना', 'EQUIPMENT', 15.0, 0.5, 'Farmer', 400000, 'Up to 55% subsidy on drip & sprinkler micro-irrigation systems.', 'ड्रिप और स्प्रिंकलर सूक्ष्म सिंचाई प्रणालियों पर 55% तक सब्सिडी।', 45000.00);

-- Scam Patterns
INSERT INTO scam_patterns (phrase_pattern, language, risk_weight, category) VALUES
('lottery', 'en', 0.9, 'LOTTERY'),
('prize money', 'en', 0.85, 'LOTTERY'),
('account block', 'en', 0.95, 'URGENCY'),
('urgent transfer', 'en', 0.8, 'URGENCY'),
('share otp', 'en', 1.0, 'VISHING'),
('लॉटरी', 'hi', 0.9, 'LOTTERY'),
('खाता बंद', 'hi', 0.95, 'URGENCY'),
('ओटीपी बताओ', 'hi', 1.0, 'VISHING'),
('इनाम मिला है', 'hi', 0.85, 'LOTTERY'),
('तुरंत पैसे भेजो', 'hi', 0.85, 'URGENCY'),
('लॉटरी जिंकला', 'mr', 0.9, 'LOTTERY'),
('खाते बंद होईल', 'mr', 0.95, 'URGENCY');
