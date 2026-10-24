/**
 * Authentic Indian Clinical Dataset
 * Formatted with real Indian medications, national medical institutes,
 * verified doctors, and INR (₹) health expenditure records.
 */

export const INDIAN_PATIENT_PROFILE = {
  uid: 'demo_patient_aarav',
  displayName: 'Aarav Sharma',
  email: 'demo@medilens.in',
  photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  age: 38,
  gender: 'Male',
  bloodGroup: 'B+',
  phone: '+91 98765 43210',
  city: 'Bengaluru, Karnataka',
  state: 'Karnataka',
  country: 'India',
  pinCode: '560038',
  allergies: ['Penicillin', 'Sulfa Drugs'],
  chronicConditions: ['Type 2 Diabetes', 'Primary Hypertension (Controlled)'],
  emergencyContact: 'Priya Sharma (Spouse) - +91 98765 43211',
  insuranceProvider: 'Star Health Premier Gold (#SH-IND-884920)',
  sumInsured: '₹10,00,000',
  primaryPhysician: 'Dr. Rajesh Sharma, MD (AIIMS New Delhi)',
  isDemo: true,
  role: 'patient',
  createdAt: '2024-01-15'
};

export const INDIAN_MEDICINES = [
  {
    id: 'med_telma40',
    name: 'Telma 40 (Telmisartan)',
    brand: 'Glenmark Pharmaceuticals',
    dosage: '40mg',
    frequency: 'Once daily',
    scheduleTimes: ['08:00 AM'],
    category: 'Cardiovascular / Blood Pressure',
    instructions: 'Take 1 tablet every morning after breakfast with warm water',
    startDate: '2024-01-10',
    endDate: '2025-12-31',
    remainingPills: 24,
    totalPills: 30,
    cost: 185,
    prescribedBy: 'Dr. Rajesh Sharma, MD (AIIMS)',
    active: true,
  },
  {
    id: 'med_glycomet500',
    name: 'Glycomet 500 SR (Metformin)',
    brand: 'USV Private Limited',
    dosage: '500mg SR',
    frequency: 'Twice daily',
    scheduleTimes: ['08:30 AM', '08:30 PM'],
    category: 'Endocrinology / Anti-diabetic',
    instructions: 'Take immediately after morning and evening meals to prevent GI upset',
    startDate: '2023-11-05',
    endDate: '2025-12-31',
    remainingPills: 42,
    totalPills: 60,
    cost: 95,
    prescribedBy: 'Dr. Priya Nair, MD (Apollo Hospitals)',
    active: true,
  },
  {
    id: 'med_pan40',
    name: 'Pan 40 (Pantoprazole)',
    brand: 'Alkem Laboratories',
    dosage: '40mg',
    frequency: 'Once daily',
    scheduleTimes: ['07:00 AM'],
    category: 'Gastroenterology / Antacid',
    instructions: 'Take 1 tablet on an empty stomach at least 30 minutes before tea/breakfast',
    startDate: '2024-03-01',
    endDate: '2025-06-30',
    remainingPills: 18,
    totalPills: 30,
    cost: 165,
    prescribedBy: 'Dr. Suresh Patel, MBBS (Manipal Hospital)',
    active: true,
  },
  {
    id: 'med_rosuvas10',
    name: 'Rosuvas 10 (Rosuvastatin)',
    brand: 'Sun Pharmaceutical Industries',
    dosage: '10mg',
    frequency: 'Once daily',
    scheduleTimes: ['10:00 PM'],
    category: 'Lipid Management / Statin',
    instructions: 'Take 1 tablet at night before going to bed',
    startDate: '2024-02-15',
    endDate: '2025-12-31',
    remainingPills: 20,
    totalPills: 30,
    cost: 290,
    prescribedBy: 'Dr. Rajesh Sharma, MD (AIIMS)',
    active: true,
  },
  {
    id: 'med_dolo650',
    name: 'Dolo 650 (Paracetamol)',
    brand: 'Micro Labs Limited',
    dosage: '650mg',
    frequency: 'As needed (SOS)',
    scheduleTimes: ['As needed'],
    category: 'Analgesic & Antipyretic',
    instructions: 'Take 1 tablet in case of body ache, fever, or mild headache (Max 3/day)',
    startDate: '2024-04-01',
    endDate: '2026-04-01',
    remainingPills: 15,
    totalPills: 15,
    cost: 32,
    prescribedBy: 'Dr. Rajesh Sharma, MD',
    active: true,
  },
  {
    id: 'med_montairlc',
    name: 'Montair LC (Montelukast + Levocetirizine)',
    brand: 'Cipla Limited',
    dosage: '10mg + 5mg',
    frequency: 'Once daily (Night)',
    scheduleTimes: ['09:30 PM'],
    category: 'Pulmonology / Antiallergic',
    instructions: 'Take 1 tablet at bedtime for seasonal allergic rhinitis',
    startDate: '2024-05-10',
    endDate: '2024-08-10',
    remainingPills: 8,
    totalPills: 30,
    cost: 240,
    prescribedBy: 'Dr. Ananya Mukherjee, MD (Medanta)',
    active: true,
  }
];

export const INDIAN_DOCTORS = [
  {
    id: 'doc_rajesh',
    name: 'Dr. Rajesh Sharma, MD, DM',
    type: 'Cardiologist',
    hospital: 'AIIMS New Delhi, Ansari Nagar',
    phone: '+91 11 2658 8500',
    email: 'dr.rajesh.sharma@aiims.edu',
    address: 'Cardiology OPD, AIIMS Hospital, New Delhi - 110029',
    rating: 4.9,
    experience: '18+ Years Experience',
    availability: 'Mon, Wed, Fri (09:00 AM - 02:00 PM)',
    consultationFee: '₹500',
    notes: 'Primary cardiologist overseeing blood pressure regulation and ECG telemetry.'
  },
  {
    id: 'doc_priya',
    name: 'Dr. Priya Nair, MBBS, MD, FRCP',
    type: 'Endocrinologist',
    hospital: 'Apollo Hospitals, Greams Road, Chennai',
    phone: '+91 44 2829 0200',
    email: 'dr.priyanair@apollohospitals.com',
    address: 'Institute of Endocrinology, Apollo Hospitals, Chennai - 600006',
    rating: 4.8,
    experience: '15+ Years Experience',
    availability: 'Tue, Thu, Sat (10:00 AM - 03:00 PM)',
    consultationFee: '₹1,000',
    notes: 'Specialist for Type 2 Diabetes reversal program, HbA1c control, and diet planning.'
  },
  {
    id: 'doc_vikram',
    name: 'Dr. Vikram Malhotra, MBBS, DNB',
    type: 'Neurologist',
    hospital: 'Fortis Memorial Research Institute, Gurugram',
    phone: '+91 124 492 1021',
    email: 'vikram.malhotra@fortishealthcare.com',
    address: 'Sector 44, Opposite HUDA City Centre, Gurugram - 122002',
    rating: 4.9,
    experience: '14+ Years Experience',
    availability: 'Mon to Fri (11:00 AM - 04:00 PM)',
    consultationFee: '₹1,200',
    notes: 'Neurological evaluation, headache management, and autonomic nerve assessments.'
  },
  {
    id: 'doc_ananya',
    name: 'Dr. Ananya Mukherjee, MBBS, MD',
    type: 'Pulmonologist',
    hospital: 'Medanta The Medicity, Sector 38, Gurugram',
    phone: '+91 124 414 1414',
    email: 'ananya.mukherjee@medanta.org',
    address: 'CH Bakhtawar Singh Road, Sector 38, Gurugram - 122001',
    rating: 4.8,
    experience: '12+ Years Experience',
    availability: 'Mon, Wed, Sat (09:30 AM - 01:30 PM)',
    consultationFee: '₹1,100',
    notes: 'Specializes in allergy management, seasonal asthma, and lung capacity monitoring.'
  },
  {
    id: 'doc_suresh',
    name: 'Dr. Suresh Patel, MBBS, MS, MCh',
    type: 'General Physician',
    hospital: 'Manipal Hospital, HAL Airport Road, Bengaluru',
    phone: '+91 80 2502 4444',
    email: 'dr.suresh.patel@manipalhospitals.com',
    address: '98 HAL Old Airport Rd, Kodihalli, Bengaluru - 560017',
    rating: 4.9,
    experience: '20+ Years Experience',
    availability: 'Mon to Sat (08:30 AM - 05:00 PM)',
    consultationFee: '₹750',
    notes: 'Family doctor and routine annual clinical physical examinations.'
  },
  {
    id: 'doc_kavita',
    name: 'Dr. Kavita Reddy, MBBS, MD',
    type: 'Dermatologist',
    hospital: 'Yashoda Hospitals, Somajiguda, Hyderabad',
    phone: '+91 40 4567 4567',
    email: 'kavita.reddy@yashodamail.com',
    address: 'Raj Bhavan Road, Somajiguda, Hyderabad - 500082',
    rating: 4.7,
    experience: '11+ Years Experience',
    availability: 'Tue, Fri, Sun (11:00 AM - 04:00 PM)',
    consultationFee: '₹800',
    notes: 'Skin wellness, drug hypersensitivity screenings, and allergen testing.'
  }
];

export const INDIAN_EXPENSES = [
  {
    id: 'exp_1',
    name: 'Chronic Medication Pack (Telma 40 + Glycomet SR)',
    category: 'Prescription',
    cost: 840,
    date: new Date(Date.now() - 86400000 * 3),
    pharmacy: 'Apollo Pharmacy 24x7, Indiranagar',
    receiptId: 'APO-BLR-904128'
  },
  {
    id: 'exp_2',
    name: 'Quarterly HbA1c & Fasting Glucose Panel',
    category: 'Lab Tests',
    cost: 1450,
    date: new Date(Date.now() - 86400000 * 8),
    pharmacy: 'Dr. Lal PathLabs, 100ft Road',
    receiptId: 'LAL-DIAG-481902'
  },
  {
    id: 'exp_3',
    name: 'Cardiology Review & Routine Resting ECG',
    category: 'Consultation',
    cost: 750,
    date: new Date(Date.now() - 86400000 * 14),
    pharmacy: 'AIIMS New Delhi OPD',
    receiptId: 'AIIMS-OPD-7721'
  },
  {
    id: 'exp_4',
    name: '2D Echocardiogram Doppler Screening',
    category: 'Diagnostics',
    cost: 2600,
    date: new Date(Date.now() - 86400000 * 22),
    pharmacy: 'Manipal Hospital Diagnostics',
    receiptId: 'MAN-RAD-30911'
  },
  {
    id: 'exp_5',
    name: 'Calcirol D3 60K Sachets & Montair-LC',
    category: 'Prescription',
    cost: 580,
    date: new Date(Date.now() - 86400000 * 27),
    pharmacy: 'Tata 1mg Health Hub',
    receiptId: '1MG-ORD-554201'
  },
  {
    id: 'exp_6',
    name: 'Omron Digital Blood Pressure Monitor HEM-7120',
    category: 'Medical Device',
    cost: 2190,
    date: new Date(Date.now() - 86400000 * 45),
    pharmacy: 'MedPlus Chemist',
    receiptId: 'MED-DEV-11928'
  }
];

export const INDIAN_DOCUMENTS = [
  {
    id: 'doc_aiims_cardio',
    name: 'AIIMS_Cardiology_Clinical_Summary_2024.pdf',
    type: 'Clinical Summary',
    size: '1.8 MB',
    date: '2024-04-18',
    doctor: 'Dr. Rajesh Sharma, MD (AIIMS)',
    tags: ['Cardiology', 'ECG Normal', 'Verified'],
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'doc_drlal_hba1c',
    name: 'DrLalPathLabs_HbA1c_LipidProfile_Report.pdf',
    type: 'Diagnostic Report',
    size: '720 KB',
    date: '2024-04-10',
    doctor: 'Dr. Lal PathLabs India',
    tags: ['HbA1c 6.4%', 'Lipids Optimal', 'Lab'],
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'doc_apollo_rx',
    name: 'Apollo_Hospitals_Prescription_Dr_Priya_Nair.pdf',
    type: 'Official Prescription',
    size: '510 KB',
    date: '2024-03-24',
    doctor: 'Dr. Priya Nair, MD (Apollo Hospitals)',
    tags: ['Endocrinology', 'Active Regimen', 'Rx'],
    url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'doc_manipal_echo',
    name: 'Manipal_Hospital_Echocardiography_Doppler.pdf',
    type: 'Cardio Imaging',
    size: '2.4 MB',
    date: '2024-02-14',
    doctor: 'Manipal Heart Institute',
    tags: ['Echo LVEF 62%', 'Normal Anatomy'],
    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80'
  }
];

export const INDIAN_VITALS_DATA = {
  bloodPressure: {
    systolic: 122,
    diastolic: 82,
    unit: 'mmHg',
    status: 'Optimal',
    trend: 'Stable over 30 days',
    lastRecorded: 'Today, 08:15 AM'
  },
  restingHeartRate: {
    value: 72,
    unit: 'bpm',
    status: 'Normal Sinus',
    trend: '-3 bpm this week',
    lastRecorded: 'Today, 08:15 AM'
  },
  fastingGlucose: {
    value: 98,
    unit: 'mg/dL',
    status: 'In Range (<100)',
    trend: 'Down from 112 mg/dL',
    lastRecorded: 'Today, 07:15 AM'
  },
  bloodOxygen: {
    value: 99,
    unit: '% SpO2',
    status: 'Normal',
    trend: '98-100% stable',
    lastRecorded: 'Today, 08:15 AM'
  },
  bodyTemperature: {
    value: 98.4,
    unit: '°F',
    status: 'Normal',
    trend: 'Apyretic',
    lastRecorded: 'Today, 08:15 AM'
  },
  adherenceRate: 94, // %
  currentStreakDays: 14,
  bestStreakDays: 32
};
