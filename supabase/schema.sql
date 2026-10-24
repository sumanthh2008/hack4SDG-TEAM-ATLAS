-- ============================================================================
-- SANKALP: Complete PostgreSQL Database Schema with RLS & Seed Data
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('patient', 'doctor', 'guest', 'admin')),
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Doctor Profiles Table
CREATE TABLE IF NOT EXISTS public.doctor_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    specialization TEXT NOT NULL,
    license_number TEXT NOT NULL,
    experience_years INTEGER NOT NULL DEFAULT 1,
    bio TEXT,
    languages TEXT[] DEFAULT '{"English", "Hindi"}',
    consultation_fee NUMERIC NOT NULL DEFAULT 500,
    verified BOOLEAN DEFAULT FALSE,
    rating NUMERIC DEFAULT 4.9,
    hospital_affiliation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Availability Slots Table
CREATE TABLE IF NOT EXISTS public.availability_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    slot_id UUID REFERENCES public.availability_slots(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')),
    decline_reason TEXT,
    video_link TEXT,
    scheduled_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Prescriptions Table
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    diagnosis TEXT NOT NULL,
    advice TEXT,
    follow_up_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Prescription Items Table
CREATE TABLE IF NOT EXISTS public.prescription_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_id UUID NOT NULL REFERENCES public.prescriptions(id) ON DELETE CASCADE,
    medicine_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    timing TEXT NOT NULL, -- e.g., 'Before Food', 'After Food'
    duration_days INTEGER NOT NULL DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Medicine Reminders Table
CREATE TABLE IF NOT EXISTS public.medicine_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_item_id UUID REFERENCES public.prescription_items(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    medicine_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    remind_at TEXT NOT NULL, -- e.g. "08:00 AM", "01:30 PM", "08:30 PM"
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'taken', 'skipped', 'snoozed')),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Daily Checkins Table
CREATE TABLE IF NOT EXISTS public.checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE SET NULL,
    mood TEXT NOT NULL, -- 'Better', 'Same', 'Worse'
    severity INTEGER NOT NULL CHECK (severity BETWEEN 1 AND 10),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Chat Messages Table (AI Follow-up)
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'bot')),
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Recovery Metrics Table
CREATE TABLE IF NOT EXISTS public.recovery_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE CASCADE,
    recovery_rate NUMERIC NOT NULL DEFAULT 0,
    health_score INTEGER NOT NULL DEFAULT 70 CHECK (health_score BETWEEN 0 AND 100),
    estimated_days_left INTEGER NOT NULL DEFAULT 7,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('appointment_pending', 'appointment_accepted', 'appointment_declined', 'medicine_reminder', 'checkin_request', 'escalation', 'system')),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Disorders Library Table
CREATE TABLE IF NOT EXISTS public.disorders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    overview TEXT NOT NULL,
    symptoms TEXT[] NOT NULL,
    when_to_see_doctor TEXT NOT NULL,
    suggested_specialization TEXT DEFAULT 'General Physician',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Emergency Contacts Table
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    number TEXT NOT NULL,
    category TEXT NOT NULL,
    region TEXT NOT NULL DEFAULT 'India',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Support Tickets Table
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    category TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Error Reports Table
CREATE TABLE IF NOT EXISTS public.error_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    screenshot_url TEXT,
    page_url TEXT,
    device_info TEXT,
    status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'investigating', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recovery_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disorders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_reports ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view verified doctor profiles; users can view/edit their own profile
CREATE POLICY "Public can view basic profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Doctor Profiles: Public can view verified doctors; doctors can update their own
CREATE POLICY "Public can view verified doctors" ON public.doctor_profiles FOR SELECT USING (verified = true OR auth.uid() = user_id);
CREATE POLICY "Doctors can update own profile" ON public.doctor_profiles FOR ALL USING (auth.uid() = user_id);

-- Availability Slots: Public view, Doctor manage
CREATE POLICY "Anyone can view available slots" ON public.availability_slots FOR SELECT USING (true);
CREATE POLICY "Doctors manage own slots" ON public.availability_slots FOR ALL USING (auth.uid() = doctor_id);

-- Appointments: Patients view their own; Doctors view appointments assigned to them
CREATE POLICY "Users view own appointments" ON public.appointments FOR SELECT 
    USING (auth.uid() = patient_id OR auth.uid() = doctor_id);
CREATE POLICY "Patients can create appointments" ON public.appointments FOR INSERT 
    WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Participants can update appointments" ON public.appointments FOR UPDATE 
    USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- Prescriptions & Items: Doctor created, patient & doctor view
CREATE POLICY "Prescription access" ON public.prescriptions FOR SELECT 
    USING (auth.uid() = patient_id OR auth.uid() = doctor_id);
CREATE POLICY "Doctors insert prescriptions" ON public.prescriptions FOR INSERT 
    WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Prescription items access" ON public.prescription_items FOR SELECT 
    USING (EXISTS (SELECT 1 FROM public.prescriptions p WHERE p.id = prescription_items.prescription_id AND (p.patient_id = auth.uid() OR p.doctor_id = auth.uid())));

-- Reminders, Checkins, Chat, Metrics: Patient only
CREATE POLICY "Patient reminders" ON public.medicine_reminders FOR ALL USING (auth.uid() = patient_id);
CREATE POLICY "Patient checkins" ON public.checkins FOR ALL USING (auth.uid() = patient_id);
CREATE POLICY "Patient chat" ON public.chat_messages FOR ALL USING (auth.uid() = patient_id);
CREATE POLICY "Patient recovery metrics" ON public.recovery_metrics FOR ALL USING (auth.uid() = patient_id);

-- Notifications: User only
CREATE POLICY "User notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- Public Knowledge Tables: Read-only for all
CREATE POLICY "Public read disorders" ON public.disorders FOR SELECT USING (true);
CREATE POLICY "Public read emergency contacts" ON public.emergency_contacts FOR SELECT USING (true);

-- Support & Error reports: Created by authenticated/guest user, view own
CREATE POLICY "User manage support" ON public.support_tickets FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "User manage errors" ON public.error_reports FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

-- ============================================================================
-- SEED DATA: Verified Doctors, Disorders, and Emergency Contacts
-- ============================================================================

INSERT INTO public.emergency_contacts (name, number, category, region, description) VALUES
('National Emergency Number', '112', 'General Emergency', 'India', 'All-in-one emergency response for police, fire, and health'),
('National Ambulance Helpline', '102 / 108', 'Medical Emergency', 'India', '24x7 emergency medical technician & ambulance dispatch'),
('Tele-MANAS Mental Health', '14416', 'Mental Health', 'India', 'Toll-free 24/7 tele-mental health counseling service (Ministry of Health)'),
('Tele-MANAS Alternate Toll-Free', '1800-891-4416', 'Mental Health', 'India', 'National Tele Mental Health Programme of India'),
('Women Helpline (Domestic/Distress)', '181', 'Women Safety', 'India', '24 hours emergency and non-emergency support for women'),
('Childline Emergency Services', '1098', 'Child Safety', 'India', '24-hour free emergency phone outreach service for children in need'),
('KIRAN Mental Health Helpline', '1800-599-0019', 'Psychological Support', 'India', '24/7 toll-free helpline providing psychological support'),
('National Poison Information Centre', '1800-116-117', 'Poison & Toxic Exposure', 'India', 'AIIMS New Delhi toll-free round-the-clock poison advice'),
('National AIDS Control Helpline (NACO)', '1097', 'HIV / AIDS Support', 'India', 'Government of India 24x7 toll-free confidential helpline for HIV/AIDS counseling and testing centers'),
('National Drug & Alcohol De-addiction Helpline', '1800-11-0031', 'De-addiction & Rehab', 'India', 'Ministry of Social Justice & Empowerment 24/7 toll-free helpline for substance abuse counseling and rehabilitation'),
('National Tuberculosis (Nikshay) Helpline', '1800-11-6666', 'TB Care & Support', 'India', 'Central TB Division toll-free helpline providing treatment support and DOTS clinic locator')
ON CONFLICT DO NOTHING;

INSERT INTO public.disorders (name, category, overview, symptoms, when_to_see_doctor, suggested_specialization) VALUES
('Type 2 Diabetes', 'Endocrine & Metabolic', 'A chronic condition affecting the way the body processes blood sugar (glucose), leading to elevated blood glucose levels.', ARRAY['Increased thirst', 'Frequent urination', 'Unexplained weight loss', 'Fatigue', 'Blurred vision', 'Slow-healing sores'], 'If you notice persistent excessive thirst, frequent nighttime urination, or unexplained weight loss.', 'Endocrinologist'),
('Hypertension (High Blood Pressure)', 'Cardiovascular', 'A common condition where the long-term force of the blood against your artery walls is high enough that it may eventually cause heart issues.', ARRAY['Usually symptomless', 'Morning headaches', 'Dizziness', 'Shortness of breath in severe cases'], 'Routine screening is recommended; see a doctor immediately if blood pressure reading is >= 140/90 repeatedly or above 180 systolic.', 'Cardiologist'),
('Bronchial Asthma', 'Respiratory', 'A chronic condition in which airways narrow, swell, and produce extra mucus, causing difficulty in breathing.', ARRAY['Shortness of breath', 'Chest tightness or pain', 'Wheezing when exhaling', 'Coughing attacks triggered by cold or exercise'], 'If coughing or wheezing disrupts sleep or normal daily activities, or if rescue inhaler use increases.', 'Pulmonologist'),
('Generalized Anxiety Disorder (GAD)', 'Mental Health', 'Persistent and excessive worry about various different things that interferes with daily life and emotional well-being.', ARRAY['Restlessness or feeling on edge', 'Easily fatigued', 'Difficulty concentrating', 'Muscle tension', 'Sleep disturbances'], 'When worry and nervousness interfere with work, relationships, or personal peace for over two weeks.', 'Psychiatrist'),
('Major Depressive Disorder', 'Mental Health', 'A mood disorder causing a persistent feeling of sadness, loss of interest, and energy depletion.', ARRAY['Persistent sad or empty mood', 'Loss of interest in hobbies', 'Changes in appetite/weight', 'Feelings of worthlessness', 'Fatigue'], 'Whenever feelings of sadness, numbness, or despair persist for two weeks or more, or if thoughts of self-harm arise.', 'Psychiatrist'),
('Hypothyroidism', 'Endocrine & Metabolic', 'The thyroid gland does not produce enough thyroid hormone, slowing down metabolic functions.', ARRAY['Extreme fatigue', 'Increased sensitivity to cold', 'Constipation', 'Dry skin', 'Unexplained weight gain', 'Muscle weakness'], 'If you feel constantly exhausted for no obvious reason or experience unusual weight gain with dry skin.', 'Endocrinologist'),
('Migraine & Chronic Headaches', 'Neurology', 'A neurological condition that causes intense, throbbing headaches, often accompanied by sensory disturbances.', ARRAY['Throbbing pain on one or both sides', 'Extreme sensitivity to light and sound', 'Nausea and vomiting', 'Visual aura (zigzag lines)'], 'If headaches are severe, occur more than 2-3 times a month, or do not respond to over-the-counter pain relief.', 'Neurologist'),
('Atopic Dermatitis & Eczema', 'Dermatology', 'A condition that makes your skin red, inflamed, dry, and intensely itchy, frequently seen in flare-ups.', ARRAY['Dry, cracked skin', 'Itchiness, especially at night', 'Red to brownish-gray patches', 'Small raised bumps leaking fluid'], 'If the skin becomes painful, shows yellow crusting/infection, or prevents you from sleeping comfortably.', 'Dermatologist'),
('Gastroesophageal Reflux Disease (GERD)', 'Gastroenterology', 'A digestive disorder occurring when acidic stomach juices repeatedly flow back into the tube connecting your mouth and stomach.', ARRAY['Heartburn (burning chest sensation)', 'Regurgitation of food or sour liquid', 'Difficulty swallowing', 'Sensation of lump in throat'], 'If you experience severe acid reflux more than twice a week or have difficulty or pain when swallowing.', 'Gastroenterologist'),
('Tuberculosis (TB & Pulmonary Infection)', 'Infectious & Pulmonary', 'An airborne infectious disease caused by Mycobacterium tuberculosis that primarily attacks the lungs. Highly curable with proper directly observed multi-drug therapy (DOTS).', ARRAY['Cough persisting for > 2 weeks', 'Coughing up blood or rust-colored sputum', 'Drenching night sweats', 'Unexplained rapid weight loss', 'Evening low-grade fever with chills', 'Chest pain when breathing'], 'Immediately seek medical evaluation and sputum AFB/GeneXpert testing if your cough lasts more than 14 days, you cough blood, or you experience night sweats.', 'Pulmonologist & Chest Specialist'),
('HIV Infection & AIDS Support', 'Infectious & Immunology', 'Human Immunodeficiency Virus (HIV) targets CD4 immune cells. Left untreated, it advances to AIDS. Modern Antiretroviral Therapy (ART) suppresses viral load to undetectable levels (U=U), ensuring a normal life expectancy and zero sexual transmission risk.', ARRAY['Recurrent unexplained fever and night sweats', 'Rapid significant weight loss (wasting syndrome)', 'Persistent swollen lymph nodes in neck or armpits', 'Chronic diarrhea lasting over a month', 'Oral candidiasis (white tongue patches)', 'Recurrent opportunistic infections'], 'Get tested immediately following any high-risk exposure for Post-Exposure Prophylaxis (PEP must be started within 72 hours), or if experiencing persistent unexplained fevers and weight loss.', 'Infectious Disease & HIV/AIDS Specialist'),
('Hepatitis B Virus (HBV)', 'Hepatology & Viral Infections', 'A viral liver infection transmitted through blood and body fluids that can lead to chronic active hepatitis, cirrhosis, and liver cancer. Effective antiviral oral therapies (Tenofovir/Entecavir) control viral replication, while immunization protects against infection.', ARRAY['Jaundice (yellow discoloration of eyes and skin)', 'Dark tea-colored urine', 'Clay-colored pale stools', 'Extreme fatigue & weakness', 'Right upper abdominal pain and liver tenderness', 'Persistent loss of appetite and nausea'], 'Consult a hepatologist promptly if you notice yellowing of your eyes or skin, dark urine, or have a positive HBsAg surface antigen test report.', 'Hepatologist & Liver Specialist'),
('Hepatitis C Virus (HCV)', 'Hepatology & Viral Infections', 'A blood-borne viral infection causing chronic liver inflammation. Often called a silent epidemic because 80% of individuals have no early symptoms until advanced fibrosis develops. Today, HCV is over 95% curable with an 8-to-12-week course of Direct-Acting Antivirals (DAAs).', ARRAY['Usually asymptomatic in early stages', 'Unexplained chronic fatigue and brain fog', 'Muscle and joint aching (arthralgia)', 'Easy bruising and prolonged bleeding', 'Itchy skin without rash (pruritus)', 'Fluid accumulation in abdomen (ascites) in late stages'], 'Get tested if you have had past blood transfusions, dental procedures, tattoos, or elevated ALT/AST liver enzymes on routine health check-ups.', 'Hepatologist & Liver Specialist'),
('Drug & Substance Abuse De-addiction', 'De-addiction & Mental Health', 'A complex, treatable medical and neurobiological disorder characterized by compulsive drug seeking and use (opioids, cannabis, stimulants, sedatives, prescription pills) despite devastating physical, emotional, and social consequences. Compassionate medical detox, counseling, and relapse prevention restore autonomy.', ARRAY['Compulsive substance cravings and loss of control', 'Physical withdrawal symptoms (profuse sweating, shaking, nausea, intense anxiety)', 'Requiring increasingly higher doses to feel effects (tolerance)', 'Neglecting career, academic, and family commitments', 'Engaging in risky behaviors to obtain substances'], 'Seek compassionate medical detox immediately when withdrawal symptoms become distressing, daily functioning deteriorates, or to explore evidence-based substitution therapy safely.', 'Addiction Psychiatrist & De-addiction Specialist'),
('Alcohol Addiction & Liver Rehabilitation', 'De-addiction & Hepatology', 'Alcohol Use Disorder (AUD) involves physiological and psychological dependence on alcohol, leading to alcoholic fatty liver, hepatitis, or cirrhosis. Medically supervised detoxification prevents life-threatening delirium tremens and triggers dramatic liver cell regeneration.', ARRAY['Morning tremors (shakes) alleviated only by alcohol', 'Inability to limit drinking once started', 'Blackouts and memory lapses after drinking episodes', 'Withdrawal hallucinations, severe agitation, or seizures', 'Elevated GGT and bilirubin liver enzymes', 'Physical cravings and social isolation'], 'Seek immediate clinical care if you experience morning tremors, confusion, or visual distortions when not drinking, or if liver blood tests show acute inflammation.', 'Addiction Psychiatrist & De-addiction Specialist')
ON CONFLICT (name) DO NOTHING;
