import type { 
  UserProfile, 
  DoctorProfile, 
  AvailabilitySlot, 
  Appointment, 
  Prescription, 
  MedicineReminder, 
  Checkin, 
  RecoveryMetrics, 
  Disorder, 
  EmergencyContact, 
  ChatMessage 
} from '../types/database';

export const INITIAL_DOCTORS: (DoctorProfile & { profile: UserProfile })[] = [
  {
    user_id: 'doc-1',
    specialization: 'Cardiologist',
    license_number: 'MCI-2012-84920',
    experience_years: 14,
    bio: 'Senior Consultant Cardiologist specializing in preventive heart health, hypertension management, and lifestyle cardiology. Trained at AIIMS New Delhi.',
    languages: ['English', 'Hindi', 'Punjabi'],
    consultation_fee: 800,
    verified: true,
    rating: 4.95,
    hospital_affiliation: 'Apollo Heart Institute, New Delhi',
    profile: {
      id: 'doc-1',
      role: 'doctor',
      full_name: 'Dr. Ananya Sharma',
      avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
      phone: '+91 98112 34567',
      is_anonymous: false,
      created_at: '2024-01-15T09:00:00Z',
    }
  },
  {
    user_id: 'doc-2',
    specialization: 'General Physician & Diabetologist',
    license_number: 'KMC-2006-44192',
    experience_years: 18,
    bio: 'Family physician passionate about holistic metabolic health, chronic disease reversal, and long-term vitality. Compassionate, attentive listener.',
    languages: ['English', 'Hindi', 'Telugu'],
    consultation_fee: 500,
    verified: true,
    rating: 4.88,
    hospital_affiliation: 'Fortis Healthcare, Bengaluru',
    profile: {
      id: 'doc-2',
      role: 'doctor',
      full_name: 'Dr. Rajesh Varma',
      avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
      phone: '+91 98450 12389',
      is_anonymous: false,
      created_at: '2024-02-10T10:30:00Z',
    }
  },
  {
    user_id: 'doc-3',
    specialization: 'Psychiatrist & Mental Health',
    license_number: 'MMC-2015-77211',
    experience_years: 11,
    bio: 'NIMHANS alumna dedicated to empathetic, evidence-based care for anxiety, stress-induced burnout, mood disorders, and emotional recovery.',
    languages: ['English', 'Hindi', 'Malayalam'],
    consultation_fee: 900,
    verified: true,
    rating: 4.98,
    hospital_affiliation: 'MindCare Institute, Mumbai',
    profile: {
      id: 'doc-3',
      role: 'doctor',
      full_name: 'Dr. Priya Nair',
      avatar_url: 'https://images.unsplash.com/photo-1594824813583-4927b58c70d4?auto=format&fit=crop&q=80&w=400',
      phone: '+91 98200 65432',
      is_anonymous: false,
      created_at: '2024-03-01T11:00:00Z',
    }
  },
  {
    user_id: 'doc-4',
    specialization: 'Pulmonologist & Chest Specialist',
    license_number: 'DMC-2013-19340',
    experience_years: 13,
    bio: 'Expert in adult and pediatric asthma, allergies, chronic bronchitis, and post-viral pulmonary rehabilitation.',
    languages: ['English', 'Hindi', 'Bengali'],
    consultation_fee: 750,
    verified: true,
    rating: 4.85,
    hospital_affiliation: 'Max Super Speciality Hospital, Saket',
    profile: {
      id: 'doc-4',
      role: 'doctor',
      full_name: 'Dr. Siddharth Mehra',
      avatar_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
      phone: '+91 98101 98765',
      is_anonymous: false,
      created_at: '2024-03-12T08:00:00Z',
    }
  },
  {
    user_id: 'doc-5',
    specialization: 'Dermatologist & Trichologist',
    license_number: 'TNC-2017-91023',
    experience_years: 9,
    bio: 'Passionate about gentle clinical dermatology, eczema, acne management, and allergen identification with minimal medication.',
    languages: ['English', 'Hindi', 'Tamil'],
    consultation_fee: 650,
    verified: true,
    rating: 4.92,
    hospital_affiliation: 'SkinCare Excellence Clinic, Chennai',
    profile: {
      id: 'doc-5',
      role: 'doctor',
      full_name: 'Dr. Kavita Iyer',
      avatar_url: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=400',
      phone: '+91 98402 33445',
      is_anonymous: false,
      created_at: '2024-04-05T14:00:00Z',
    }
  },
  {
    user_id: 'doc-6',
    specialization: 'Infectious Disease & HIV/AIDS Specialist',
    license_number: 'MCI-2009-67219',
    experience_years: 16,
    bio: 'Lead Infectious Disease consultant specializing in HIV viral suppression, Pre/Post-Exposure Prophylaxis (PrEP/PEP), Opportunistic Infections, and Antiretroviral Therapy (ART). Compassionate, confidential care.',
    languages: ['English', 'Hindi', 'Bengali'],
    consultation_fee: 0,
    verified: true,
    rating: 4.97,
    hospital_affiliation: 'Institute of Infectious Diseases & Virology, New Delhi',
    profile: {
      id: 'doc-6',
      role: 'doctor',
      full_name: 'Dr. Vikram Sen',
      avatar_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
      phone: '+91 98111 22334',
      is_anonymous: false,
      created_at: '2024-01-20T10:00:00Z',
    }
  },
  {
    user_id: 'doc-7',
    specialization: 'Hepatologist & Liver Specialist',
    license_number: 'KMC-2011-38190',
    experience_years: 15,
    bio: 'Senior Hepatologist with deep clinical expertise in chronic Hepatitis B & C eradication, fatty liver disease, viral hepatitis viral load monitoring, and cirrhosis prevention.',
    languages: ['English', 'Hindi', 'Malayalam', 'Kannada'],
    consultation_fee: 0,
    verified: true,
    rating: 4.96,
    hospital_affiliation: 'Institute of Liver & Biliary Sciences (ILBS), Bengaluru',
    profile: {
      id: 'doc-7',
      role: 'doctor',
      full_name: 'Dr. Meera Nambiar',
      avatar_url: 'https://images.unsplash.com/photo-1594824813583-4927b58c70d4?auto=format&fit=crop&q=80&w=400',
      phone: '+91 98451 99887',
      is_anonymous: false,
      created_at: '2024-02-18T11:30:00Z',
    }
  },
  {
    user_id: 'doc-8',
    specialization: 'Addiction Psychiatrist & De-addiction Specialist',
    license_number: 'MMC-2010-55120',
    experience_years: 14,
    bio: 'NIMHANS-trained addiction medicine psychiatrist focused on medically supervised alcohol and drug detoxification, relapse prevention, motivational interviewing, and family reintegration.',
    languages: ['English', 'Hindi', 'Marathi', 'Gujarati'],
    consultation_fee: 0,
    verified: true,
    rating: 4.98,
    hospital_affiliation: 'National Center for Addiction Medicine, Mumbai',
    profile: {
      id: 'doc-8',
      role: 'doctor',
      full_name: 'Dr. Kabir Anand',
      avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
      phone: '+91 98205 77665',
      is_anonymous: false,
      created_at: '2024-03-05T09:15:00Z',
    }
  }
];

export const generateSampleSlots = (doctorIds: string[]): AvailabilitySlot[] => {
  const slots: AvailabilitySlot[] = [];
  const times = [
    { start: '10:00:00', end: '10:30:00' },
    { start: '11:00:00', end: '11:30:00' },
    { start: '14:00:00', end: '14:30:00' },
    { start: '15:30:00', end: '16:00:00' },
    { start: '17:00:00', end: '17:30:00' },
    { start: '18:30:00', end: '19:00:00' },
  ];

  const now = new Date();

  doctorIds.forEach((docId) => {
    // Generate slots for today and next 5 days
    for (let dayOffset = 0; dayOffset <= 5; dayOffset++) {
      const date = new Date(now);
      date.setDate(now.getDate() + dayOffset);
      const dateStr = date.toISOString().split('T')[0];

      times.forEach((t, idx) => {
        slots.push({
          id: `slot-${docId}-${dayOffset}-${idx}`,
          doctor_id: docId,
          start_time: `${dateStr}T${t.start}+05:30`,
          end_time: `${dateStr}T${t.end}+05:30`,
          is_booked: (dayOffset === 0 && idx === 1), // small realistic booking
        });
      });
    }
  });

  return slots;
};

export const INITIAL_DISORDERS: Disorder[] = [
  {
    id: 'dis-1',
    name: 'Type 2 Diabetes',
    category: 'Endocrine & Metabolic',
    overview: 'A metabolic condition affecting how the body utilizes glucose. Characterized by insulin resistance and fluctuating sugar levels.',
    symptoms: ['Frequent urination at night', 'Excessive unquenchable thirst', 'Unexplained fatigue', 'Blurred vision', 'Slow healing cuts'],
    when_to_see_doctor: 'If you have persistent extreme thirst, numbness in fingertips/feet, or repeated elevated fasting blood sugar > 126 mg/dL.',
    suggested_specialization: 'General Physician & Diabetologist',
  },
  {
    id: 'dis-2',
    name: 'Hypertension (High Blood Pressure)',
    category: 'Cardiovascular',
    overview: 'Long-term elevation of systemic arterial blood pressure. Often called a silent condition because early stages have few symptoms.',
    symptoms: ['Morning temple headaches', 'Dizziness or lightheadedness', 'Shortness of breath on exertion', 'Occasional nosebleeds'],
    when_to_see_doctor: 'When blood pressure readings exceed 140/90 mmHg on three consecutive checks or if accompanied by chest heaviness.',
    suggested_specialization: 'Cardiologist',
  },
  {
    id: 'dis-3',
    name: 'Bronchial Asthma',
    category: 'Respiratory',
    overview: 'Airways become inflamed, narrowed, and swollen with extra mucus, causing bouts of wheezing, chest tightness, and breathlessness.',
    symptoms: ['Wheezing sound during exhalation', 'Dry or phlegmy cough at night', 'Shortness of breath after mild exertion', 'Chest tightness'],
    when_to_see_doctor: 'If breathlessness wakes you from sleep, your quick-relief inhaler is needed more than twice weekly, or speaking full sentences is difficult.',
    suggested_specialization: 'Pulmonologist & Chest Specialist',
  },
  {
    id: 'dis-4',
    name: 'Generalized Anxiety Disorder (GAD)',
    category: 'Mental Health',
    overview: 'Persistent, excessive, and unrealistic worry about daily life events, health, or work, leading to physical and emotional exhaustion.',
    symptoms: ['Restlessness and feeling on edge', 'Uncontrollable racing thoughts', 'Muscle tension in neck and shoulders', 'Sleep disruptions', 'Palpitations'],
    when_to_see_doctor: 'If anxiety or panic episodes disrupt your relationships, work productivity, or peace of mind for more than two consecutive weeks.',
    suggested_specialization: 'Psychiatrist & Mental Health',
  },
  {
    id: 'dis-5',
    name: 'Major Depressive Disorder',
    category: 'Mental Health',
    overview: 'A persistent mood condition causing prolonged feelings of sadness, low energy, and loss of interest in activities you usually enjoy.',
    symptoms: ['Deep sadness or emotional numbness', 'Fatigue despite sleep', 'Changes in appetite and sleep cycles', 'Difficulty concentrating', 'Hopelessness'],
    when_to_see_doctor: 'If feelings of sadness or emptiness persist beyond two weeks, or if you ever experience thoughts of self-harm.',
    suggested_specialization: 'Psychiatrist & Mental Health',
  },
  {
    id: 'dis-6',
    name: 'Hypothyroidism',
    category: 'Endocrine & Metabolic',
    overview: 'Underactive thyroid gland fails to synthesize sufficient thyroid hormone, causing a general slowdown of metabolic processes.',
    symptoms: ['Chronic fatigue & sluggishness', 'Heightened cold sensitivity', 'Dry brittle hair and skin', 'Puffy face', 'Unexplained weight gain'],
    when_to_see_doctor: 'When unexplainable fatigue lasts for weeks or TSH lab values come back elevated.',
    suggested_specialization: 'General Physician & Diabetologist',
  },
  {
    id: 'dis-7',
    name: 'Migraine & Chronic Headaches',
    category: 'Neurology',
    overview: 'Neurological disorder characterized by recurrent moderate-to-severe throbbing head pain, often unilateral, with sensory sensitivities.',
    symptoms: ['Throbbing pain on one side of head', 'Aura (visual zigzag flashes)', 'Sensitivity to sound and bright light', 'Nausea and vomiting'],
    when_to_see_doctor: 'If migraines strike more than 2-3 times per month, or fail to respond to mild analgesics.',
    suggested_specialization: 'Neurologist',
  },
  {
    id: 'dis-8',
    name: 'Atopic Dermatitis & Eczema',
    category: 'Dermatology',
    overview: 'Chronic inflammatory skin disease causing sensitive, dry, erythematous, and severely itchy skin patches prone to flare-ups.',
    symptoms: ['Intensely itchy dry skin patches', 'Reddish-brown plaques on elbows and knees', 'Cracking or oozing lesions', 'Sleep loss from scratching'],
    when_to_see_doctor: 'If itching disrupts sleep, lesions show yellowish honey-colored crusts (infection), or over-the-counter moisturizers offer no relief.',
    suggested_specialization: 'Dermatologist & Trichologist',
  },
  {
    id: 'dis-9',
    name: 'Gastroesophageal Reflux (GERD)',
    category: 'Gastroenterology',
    overview: 'Backward flow of gastric acid into the esophagus caused by transient lower esophageal sphincter relaxation.',
    symptoms: ['Burning chest pain (heartburn) after eating', 'Regurgitation of sour liquid', 'Difficulty swallowing', 'Morning hoarseness'],
    when_to_see_doctor: 'If heartburn strikes more than twice weekly, requires daily antacids, or causes difficulty swallowing solid food.',
    suggested_specialization: 'General Physician & Diabetologist',
  },
  {
    id: 'dis-10',
    name: 'Tuberculosis (TB & Pulmonary Infection)',
    category: 'Infectious & Pulmonary',
    overview: 'An airborne infectious bacterial disease caused by Mycobacterium tuberculosis that primarily attacks the lungs, but can spread to other organs. Highly curable with proper directly observed multi-drug therapy (DOTS).',
    symptoms: ['Cough persisting for > 2 weeks', 'Coughing up blood or rust-colored sputum', 'Drenching night sweats', 'Unexplained rapid weight loss', 'Evening low-grade fever with chills', 'Chest pain when breathing or coughing'],
    when_to_see_doctor: 'Immediately seek medical evaluation and sputum AFB/GeneXpert testing if your cough lasts more than 14 days, you cough blood, or you experience night sweats.',
    suggested_specialization: 'Pulmonologist & Chest Specialist',
  },
  {
    id: 'dis-11',
    name: 'HIV Infection & AIDS Support',
    category: 'Infectious & Immunology',
    overview: 'Human Immunodeficiency Virus (HIV) targets CD4 immune cells. Left untreated, it advances to AIDS. Modern Antiretroviral Therapy (ART) suppresses viral load to undetectable levels (U=U), ensuring a normal life expectancy and zero sexual transmission risk.',
    symptoms: ['Recurrent unexplained fever and night sweats', 'Rapid significant weight loss (wasting syndrome)', 'Persistent swollen lymph nodes in neck or armpits', 'Chronic diarrhea lasting over a month', 'Oral candidiasis (white tongue patches)', 'Recurrent opportunistic infections'],
    when_to_see_doctor: 'Get tested immediately following any high-risk exposure for Post-Exposure Prophylaxis (PEP must be started within 72 hours), or if experiencing persistent unexplained fevers and weight loss.',
    suggested_specialization: 'Infectious Disease & HIV/AIDS Specialist',
  },
  {
    id: 'dis-12',
    name: 'Hepatitis B Virus (HBV)',
    category: 'Hepatology & Viral Infections',
    overview: 'A viral liver infection transmitted through blood and body fluids that can lead to chronic active hepatitis, cirrhosis, and liver cancer. Effective antiviral oral therapies (Tenofovir/Entecavir) control viral replication, while immunization protects against infection.',
    symptoms: ['Jaundice (yellow discoloration of eyes and skin)', 'Dark tea-colored urine', 'Clay-colored pale stools', 'Extreme fatigue & weakness', 'Right upper abdominal pain and liver tenderness', 'Persistent loss of appetite and nausea'],
    when_to_see_doctor: 'Consult a hepatologist promptly if you notice yellowing of your eyes or skin, dark urine, or have a positive HBsAg surface antigen test report.',
    suggested_specialization: 'Hepatologist & Liver Specialist',
  },
  {
    id: 'dis-13',
    name: 'Hepatitis C Virus (HCV)',
    category: 'Hepatology & Viral Infections',
    overview: 'A blood-borne viral infection causing chronic liver inflammation. Often called a "silent epidemic" because 80% of individuals have no early symptoms until advanced fibrosis develops. Today, HCV is over 95% curable with an 8-to-12-week course of Direct-Acting Antivirals (DAAs).',
    symptoms: ['Usually asymptomatic in early stages', 'Unexplained chronic fatigue and brain fog', 'Muscle and joint aching (arthralgia)', 'Easy bruising and prolonged bleeding', 'Itchy skin without rash (pruritus)', 'Fluid accumulation in abdomen (ascites) in late stages'],
    when_to_see_doctor: 'Get tested if you have had past blood transfusions, dental procedures, tattoos, or elevated ALT/AST liver enzymes on routine health check-ups.',
    suggested_specialization: 'Hepatologist & Liver Specialist',
  },
  {
    id: 'dis-14',
    name: 'Drug & Substance Abuse De-addiction',
    category: 'De-addiction & Mental Health',
    overview: 'A complex, treatable medical and neurobiological disorder characterized by compulsive drug seeking and use (opioids, cannabis, stimulants, sedatives, prescription pills) despite devastating physical, emotional, and social consequences. Compassionate medical detox, counseling, and relapse prevention restore autonomy.',
    symptoms: ['Compulsive substance cravings and loss of control', 'Physical withdrawal symptoms (profuse sweating, shaking, nausea, intense anxiety)', 'Requiring increasingly higher doses to feel effects (tolerance)', 'Neglecting career, academic, and family commitments', 'Engaging in risky behaviors to obtain substances'],
    when_to_see_doctor: 'Seek compassionate medical detox immediately when withdrawal symptoms become distressing, daily functioning deteriorates, or to explore evidence-based substitution therapy safely.',
    suggested_specialization: 'Addiction Psychiatrist & De-addiction Specialist',
  },
  {
    id: 'dis-15',
    name: 'Alcohol Addiction & Liver Rehabilitation',
    category: 'De-addiction & Hepatology',
    overview: 'Alcohol Use Disorder (AUD) involves physiological and psychological dependence on alcohol, leading to alcoholic fatty liver, hepatitis, or cirrhosis. Medically supervised detoxification prevents life-threatening delirium tremens and triggers dramatic liver cell regeneration.',
    symptoms: ['Morning tremors (shakes) alleviated only by alcohol', 'Inability to limit drinking once started', 'Blackouts and memory lapses after drinking episodes', 'Withdrawal hallucinations, severe agitation, or seizures', 'Elevated GGT and bilirubin liver enzymes', 'Physical cravings and social isolation'],
    when_to_see_doctor: 'Seek immediate clinical care if you experience morning tremors, confusion, or visual distortions when not drinking, or if liver blood tests show acute inflammation.',
    suggested_specialization: 'Addiction Psychiatrist & De-addiction Specialist',
  }
];

export const INITIAL_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'em-1',
    name: 'National Emergency Number',
    number: '112',
    category: 'All Emergencies',
    region: 'Pan-India',
    description: 'Unified single number for police, fire, and medical emergency assistance across all states.',
  },
  {
    id: 'em-2',
    name: 'National Ambulance Helpline',
    number: '108',
    category: 'Medical & Ambulance',
    region: 'Pan-India',
    description: '24x7 emergency medical technician support and immediate ambulance dispatch to your location.',
  },
  {
    id: 'em-3',
    name: 'Alternate Emergency Ambulance',
    number: '102',
    category: 'Maternity & Medical',
    region: 'Pan-India',
    description: 'Specialized maternity, neonatal, and primary transport ambulance services.',
  },
  {
    id: 'em-4',
    name: 'Tele-MANAS Mental Health Support',
    number: '14416',
    category: 'Mental Health & Crisis',
    region: 'Pan-India',
    description: 'Government of India 24x7 toll-free national tele-mental health helpline staffed with professional counselors in 20+ languages.',
  },
  {
    id: 'em-5',
    name: 'Tele-MANAS Toll-Free (Alternate)',
    number: '1800-891-4416',
    category: 'Mental Health & Crisis',
    region: 'Pan-India',
    description: 'Alternate toll-free number for Tele-MANAS comprehensive tele-psychological intervention.',
  },
  {
    id: 'em-6',
    name: 'Women in Distress Helpline',
    number: '181',
    category: 'Women Safety',
    region: 'Pan-India',
    description: '24-hour emergency counseling, rescue, legal aid, and medical referral for women in distress.',
  },
  {
    id: 'em-7',
    name: 'Childline Emergency Services',
    number: '1098',
    category: 'Child Protection',
    region: 'Pan-India',
    description: 'Toll-free 24-hour nationwide emergency service for children in need of medical care or protection.',
  },
  {
    id: 'em-8',
    name: 'KIRAN Mental Health Support',
    number: '1800-599-0019',
    category: 'Psychological First Aid',
    region: 'Pan-India',
    description: 'Department of Empowerment of Persons with Disabilities 24/7 mental health rehabilitation helpline.',
  },
  {
    id: 'em-9',
    name: 'National Poison Information Centre',
    number: '1800-116-117',
    category: 'Toxicology & Poison',
    region: 'Pan-India',
    description: 'AIIMS New Delhi 24-hour toxic exposure triage and immediate clinical first aid advice.',
  },
  {
    id: 'em-10',
    name: 'National AIDS Control Helpline (NACO)',
    number: '1097',
    category: 'HIV / AIDS Support',
    region: 'Pan-India',
    description: 'Government of India 24x7 toll-free confidential helpline for HIV/AIDS information, testing centers, and ART counseling.',
  },
  {
    id: 'em-11',
    name: 'National Drug & Alcohol De-addiction Helpline',
    number: '1800-11-0031',
    category: 'De-addiction & Rehab',
    region: 'Pan-India',
    description: 'Ministry of Social Justice & Empowerment 24/7 toll-free helpline for substance abuse counseling, rehabilitation, and referral.',
  },
  {
    id: 'em-12',
    name: 'National Tuberculosis (Nikshay) Helpline',
    number: '1800-11-6666',
    category: 'TB Care & Support',
    region: 'Pan-India',
    description: 'Central TB Division toll-free helpline providing treatment support, DOTS clinic locator, and free diagnostics guidance.',
  }
];

export const INITIAL_SAMPLE_PRESCRIPTION: Prescription = {
  id: 'pres-demo-1',
  appointment_id: 'app-demo-1',
  doctor_id: 'doc-2',
  patient_id: 'patient-demo',
  diagnosis: 'Acute Upper Respiratory Tract Infection with Mild Bronchospasm',
  advice: 'Steam inhalation twice daily for 5-7 minutes. Stay well hydrated with warm fluids. Avoid cold or iced beverages. Maintain adequate vocal rest.',
  follow_up_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  items: [
    {
      id: 'item-1',
      prescription_id: 'pres-demo-1',
      medicine_name: 'Amoxicillin-Clavulanate 625mg',
      dosage: '1 Tablet',
      frequency: 'Twice a day (1-0-1)',
      timing: 'After Food (Breakfast & Dinner)',
      duration_days: 5,
    },
    {
      id: 'item-2',
      prescription_id: 'pres-demo-1',
      medicine_name: 'Levocetirizine + Montelukast',
      dosage: '1 Tablet',
      frequency: 'Once a day (0-0-1)',
      timing: 'Before Bedtime',
      duration_days: 7,
    },
    {
      id: 'item-3',
      prescription_id: 'pres-demo-1',
      medicine_name: 'Paracetamol 650mg',
      dosage: '1 Tablet',
      frequency: 'SOS (As needed for fever/headache)',
      timing: 'After Food (Min 6 hrs interval)',
      duration_days: 3,
    }
  ],
  doctor: INITIAL_DOCTORS[1]
};

export const INITIAL_SAMPLE_REMINDERS: MedicineReminder[] = [
  {
    id: 'rem-1',
    prescription_item_id: 'item-1',
    patient_id: 'patient-demo',
    medicine_name: 'Amoxicillin-Clavulanate 625mg',
    dosage: '1 Tablet (Morning)',
    remind_at: '08:30 AM',
    status: 'taken',
    updated_at: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: 'rem-2',
    prescription_item_id: 'item-1',
    patient_id: 'patient-demo',
    medicine_name: 'Amoxicillin-Clavulanate 625mg',
    dosage: '1 Tablet (Evening)',
    remind_at: '08:30 PM',
    status: 'pending',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'rem-3',
    prescription_item_id: 'item-2',
    patient_id: 'patient-demo',
    medicine_name: 'Levocetirizine + Montelukast',
    dosage: '1 Tablet (Night)',
    remind_at: '10:00 PM',
    status: 'pending',
    updated_at: new Date().toISOString(),
  }
];

export const INITIAL_SAMPLE_CHECKINS: Checkin[] = [
  {
    id: 'chk-1',
    patient_id: 'patient-demo',
    prescription_id: 'pres-demo-1',
    mood: 'Same',
    severity: 7,
    notes: 'Sore throat still persistent, slight dry cough at night.',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'chk-2',
    patient_id: 'patient-demo',
    prescription_id: 'pres-demo-1',
    mood: 'Better',
    severity: 4,
    notes: 'Throat pain decreased noticeably after warm salt water gargle and antibiotics.',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'chk-3',
    patient_id: 'patient-demo',
    prescription_id: 'pres-demo-1',
    mood: 'Better',
    severity: 2,
    notes: 'Fever has resolved, breathing comfortably, appetite is returning.',
    created_at: new Date().toISOString(),
  }
];

export const INITIAL_RECOVERY_METRICS: RecoveryMetrics = {
  id: 'met-1',
  patient_id: 'patient-demo',
  prescription_id: 'pres-demo-1',
  recovery_rate: 78,
  health_score: 84,
  estimated_days_left: 3,
  updated_at: new Date().toISOString(),
};

export const INITIAL_SAMPLE_APPOINTMENT: Appointment = {
  id: 'app-demo-1',
  patient_id: 'patient-demo',
  doctor_id: 'doc-2',
  slot_id: 'slot-doc-2-0-1',
  reason: 'Sore throat, fever for 2 days, chest congestion',
  status: 'completed',
  video_link: 'https://meet.jit.si/sankalp-consult-room-78129',
  scheduled_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  doctor: INITIAL_DOCTORS[1]
};

export const INITIAL_SAMPLE_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    patient_id: 'patient-demo',
    sender: 'bot',
    message: 'Namaste! I am your Sankalp Care Companion. Dr. Rajesh Varma submitted your prescription for Acute Upper Respiratory Tract Infection. I have set up your medicine reminders and will be here to track your recovery every step of the way.',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'msg-2',
    patient_id: 'patient-demo',
    sender: 'bot',
    message: 'How is your throat and energy feeling today? You can choose a quick update or tell me in your own words.',
    metadata: {
      quickOptions: ['Feeling Better', 'About the Same', 'Feeling Worse'],
    },
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'msg-3',
    patient_id: 'patient-demo',
    sender: 'user',
    message: 'Feeling much better today! Fever is gone, just a little cough left.',
    created_at: new Date(Date.now() - 1 * 86400000 + 300000).toISOString(),
  },
  {
    id: 'msg-4',
    patient_id: 'patient-demo',
    sender: 'bot',
    message: 'That is wonderful news! Keep taking the antibiotics for the full 5 days as prescribed, even if you feel completely healthy, to prevent bacteria from lingering. Keep drinking plenty of warm water.',
    created_at: new Date(Date.now() - 1 * 86400000 + 360000).toISOString(),
  }
];
