import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://icuzcrkzounyemsxjpzf.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljdXpjcmt6b3VueWVtc3hqcHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MjQ1MTQsImV4cCI6MjEwNjEwMDUxNH0.EkigKTnQYJUl2azJeAT3XBJwHfHm_kaPxhsts7TNI9c';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CLINIC_BRANCHES = ['HSR Layout', 'Ayyappa nagara', 'KR Puram'];

const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
const UPPER_LEFT = [21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];
const LOWER_LEFT = [31, 32, 33, 34, 35, 36, 37, 38];

interface Appointment {
  id: string;
  date: string;
  time: string;
  patientName: string;
  doctorName: string;
  status: 'Scheduled' | 'Waiting' | 'Engaged' | 'Done' | 'Missed' | 'Cancelled';
  phone: string;
  branch: string;
}

interface Patient {
  id: string;
  regNumber: string;
  opdNumber: string;
  name: string;
  age: string;
  gender: string;
  dob: string;
  phone: string;
  email: string;
  address: string;
  branch: string;
  lastVisit: string;
}

interface TreatmentLineItem {
  treatmentName: string;
  date: string;
  amount: string;
}

interface PrescriptionMedication {
  id: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface Invoice {
  id: string;
  patientName: string;
  items: TreatmentLineItem[];
  totalAmount: string;
  status: 'Paid' | 'Pending';
  paymentMode?: string;
  paymentDate?: string;
  transactionId?: string;
}

interface Receipt {
  id: string;
  invoiceId: string;
  patientName: string;
  amount: string;
  mode: string;
  date: string;
  transactionId?: string;
  items?: TreatmentLineItem[];
}

interface ProgressNote {
  id: string;
  date: string;
  doctor: string;
  note: string;
}

interface InvestigationReport {
  id: string;
  date: string;
  testName: string;
  findings: string;
}

interface AttachedFile {
  id: string;
  fileName: string;
  uploadDate: string;
  fileType: string;
}

interface Doctor {
  id: string;
  prefix: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  regNumber: string;
  bio: string;
  badgeColor: string;
  photoUrl: string;
  signatureUrl: string;
}

interface PaymentModeOption {
  id: string;
  name: string;
  details: string;
  isActive: boolean;
}

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);

  const [activeBranch, setActiveBranch] = useState(CLINIC_BRANCHES[0]);
  const [activeTab, setActiveTab] = useState<
    'calendar' | 'patients' | 'billing' | 'settings'
  >('calendar');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);

  const [settingsSubTab, setSettingsSubTab] = useState<
    'messaging' | 'print' | 'admin' | 'treatment' | 'payments' | 'medications'
  >('messaging');

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientFileTab, setPatientFileTab] = useState<
    | 'info'
    | 'prescription'
    | 'timeline'
    | 'invoice'
    | 'receipt'
    | 'progress'
    | 'investigation'
    | 'files'
    | 'dentalChart'
  >('info');

  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([46, 14]);

  const [rxDoctor, setRxDoctor] = useState('Dr. Nakul BK MDS');
  const [rxChiefComplaint, setRxChiefComplaint] = useState(
    'Pain in lower right back tooth since 3 days'
  );
  const [rxDiagnosis, setRxDiagnosis] = useState(
    'Irreversible Pulpitis wrt Tooth #46'
  );
  const [rxTreatmentPlanned, setRxTreatmentPlanned] = useState(
    'Root Canal Treatment followed by Zirconia Crown'
  );
  const [rxTreatmentDone, setRxTreatmentDone] = useState(
    'Access cavity opened, working length determined, instrumentation complete.'
  );
  const [rxAdditionalNotes, setRxAdditionalNotes] = useState(
    'Follow up in 3 days.'
  );

  const [clinicMedications, setClinicMedications] = useState([
    {
      id: 'm-1',
      name: 'Tab. Augmentin',
      defaultStrength: '625 mg',
      defaultFrequency: '1 - 0 - 1 (Twice daily)',
      defaultDuration: '5 Days',
    },
    {
      id: 'm-2',
      name: 'Tab. Ketorol DT',
      defaultStrength: '10 mg',
      defaultFrequency: '1 - 0 - 1 (SOS for pain)',
      defaultDuration: '3 Days',
    },
    {
      id: 'm-3',
      name: 'Tab. Pantocid',
      defaultStrength: '40 mg',
      defaultFrequency: '1 - 0 - 0 (Before breakfast)',
      defaultDuration: '5 Days',
    },
    {
      id: 'm-4',
      name: 'Cap. Amoxicillin',
      defaultStrength: '500 mg',
      defaultFrequency: '1 - 1 - 1 (Thrice daily)',
      defaultDuration: '5 Days',
    },
    {
      id: 'm-5',
      name: 'Tab. Ibuprofen + Paracetamol',
      defaultStrength: '400/325 mg',
      defaultFrequency: '1 - 0 - 1 after food',
      defaultDuration: '3 Days',
    },
    {
      id: 'm-6',
      name: 'Chlorhexidine Mouthwash',
      defaultStrength: '0.2%',
      defaultFrequency: 'Rinse twice daily',
      defaultDuration: '7 Days',
    },
  ]);

  const [newMedName, setNewMedName] = useState('');
  const [newMedStrength, setNewMedStrength] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('');
  const [newMedDur, setNewMedDur] = useState('');

  const [prescriptionMeds, setPrescriptionMeds] = useState<
    PrescriptionMedication[]
  >([
    {
      id: 'pm-1',
      drugName: 'Tab. Augmentin',
      dosage: '625 mg',
      frequency: '1 - 0 - 1 (Twice daily)',
      duration: '5 Days',
      instructions: 'After food',
    },
    {
      id: 'pm-2',
      drugName: 'Tab. Ketorol DT',
      dosage: '10 mg',
      frequency: '1 - 0 - 1 (SOS)',
      duration: '3 Days',
      instructions: 'For acute pain',
    },
  ]);

  const [selectedMedToAdd, setSelectedMedToAdd] = useState('');

  const handleAddMedicationToRx = () => {
    const found = clinicMedications.find((m) => m.name === selectedMedToAdd);
    const newMed: PrescriptionMedication = {
      id: 'med-' + Date.now(),
      drugName: found ? found.name : selectedMedToAdd || 'Tablet',
      dosage: found ? found.defaultStrength : '500 mg',
      frequency: found ? found.defaultFrequency : '1 - 0 - 1',
      duration: found ? found.defaultDuration : '5 Days',
      instructions: 'After food',
    };
    setPrescriptionMeds([...prescriptionMeds, newMed]);
  };

  const handleRemoveMedFromRx = (id: string) => {
    setPrescriptionMeds(prescriptionMeds.filter((m) => m.id !== id));
  };

  const handleRxMedChange = (
    id: string,
    field: keyof PrescriptionMedication,
    value: string
  ) => {
    setPrescriptionMeds(
      prescriptionMeds.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const [bookingTemplate, setBookingTemplate] = useState(
    "Hello {patientName},\n\nYour appointment has been successfully booked at THE DEN+IST'S DENTAL CLINIC ({branch}).\n\n📅 Date: {date}\n⏰ Time: {time}\n👨‍⚕ Doctor: {doctor}\n\nPlease arrive 10 minutes prior. We look forward to seeing you!"
  );
  const [reminderTemplate, setReminderTemplate] = useState(
    "Hello {patientName},\n\nReminder: You have a dental appointment scheduled at THE DEN+IST'S DENTAL CLINIC ({branch}) on {date} at {time}.\n\nKindly confirm your availability or reply if you need to reschedule. See you soon!"
  );
  const [reviewTemplate, setReviewTemplate] = useState(
    "Hello {patientName},\n\nThank you for visiting THE DEN+IST'S DENTAL CLINIC today! We hope you had a comfortable experience.\n\nCould you please take a moment to share your feedback or leave us a review? Your smile means the world to us! ⭐\n\n[Google Review Link: https://g.page/r/thedentist]"
  );

  const [rxHeaderTitle, setRxHeaderTitle] = useState(
    "THE DEN+IST'S DENTAL CLINIC"
  );
  const [rxDoctorName, setRxDoctorName] = useState(
    'Dr. Nakul BK MDS & Associates'
  );
  const [rxContactNumber, setRxContactNumber] = useState(
    'Contact: 9620100245 / 9972405050'
  );
  const [rxFooterSecondaryBranch, setRxFooterSecondaryBranch] = useState(
    'Other Branches: KR Puram & Ayyappa Nagar | Sterile & Disposable Instruments Used'
  );
  const [clinicLogoUrl, setClinicLogoUrl] = useState(
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=150'
  );

  const [clinicFontFamily, setClinicFontFamily] = useState(
    "'Inter', sans-serif"
  );
  const [clinicFontWeight, setClinicFontWeight] = useState('700');
  const [clinicFontColor, setClinicFontColor] = useState('#0f172a');

  const [invoicePrefixSetting, setInvoicePrefixSetting] = useState('INV-2026-');
  const [defaultGstinSetting, setDefaultGstinSetting] =
    useState('29AAAAA0000A1Z5');

  const [defaultTreatments, setDefaultTreatments] = useState([
    { id: 't-1', name: 'Root Canal Treatment (RCT)', standardFee: '4500' },
    { id: 't-2', name: 'Dental Crown (Zirconia)', standardFee: '6000' },
    { id: 't-3', name: 'Composite Restoration (Filling)', standardFee: '1500' },
    { id: 't-4', name: 'Dental Implants', standardFee: '25000' },
    { id: 't-5', name: 'Scaling & Polishing', standardFee: '1200' },
  ]);

  const [newTreatmentNameInput, setNewTreatmentNameInput] = useState('');
  const [newTreatmentFeeInput, setNewTreatmentFeeInput] = useState('');

  const [paymentModes, setPaymentModes] = useState<PaymentModeOption[]>([
    {
      id: 'pm-1',
      name: 'Online UPI / GPay',
      details: 'thedentist@okaxis / 9620100245@upi',
      isActive: true,
    },
    {
      id: 'pm-2',
      name: 'Credit / Debit Card',
      details: 'Wireless POS Terminal Available',
      isActive: true,
    },
    {
      id: 'pm-3',
      name: 'Net Banking',
      details: 'HDFC A/c: 50200012345678 | IFSC: HDFC0001234',
      isActive: true,
    },
    {
      id: 'pm-4',
      name: 'Cash',
      details: 'Cash counter collection',
      isActive: true,
    },
  ]);

  const [newPaymentModeName, setNewPaymentModeName] = useState('');
  const [newPaymentModeDetails, setNewPaymentModeDetails] = useState('');

  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: 'doc-1',
      prefix: 'Dr.',
      name: 'Nakul BK',
      specialty: 'Oral Medicine and Radiology (MDS)',
      phone: '9620100245',
      email: 'bknakul@gmail.com',
      regNumber: 'KSDC-12345',
      bio: 'Associate Professor & Senior Consultant Dentist with extensive clinical experience since 2016.',
      badgeColor: '#2563eb',
      photoUrl:
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
      signatureUrl:
        'https://images.unsplash.com/photo-1594732891172-35a0925439a3?w=150',
    },
    {
      id: 'doc-2',
      prefix: 'Dr.',
      name: 'Swathi',
      specialty: 'Conservative Dentistry & Endodontics',
      phone: '9972405050',
      email: 'swathi@thedentist.co.in',
      regNumber: 'KSDC-67890',
      bio: 'Specialist in root canal treatments, aesthetic dental restorations, and smile makeovers.',
      badgeColor: '#7c3aed',
      photoUrl:
        'https://images.unsplash.com/photo-1594824813576-904d9c79f323?w=150',
      signatureUrl:
        'https://images.unsplash.com/photo-1594732891172-35a0925439a3?w=150',
    },
  ]);

  const [newDocPrefix, setNewDocPrefix] = useState('Dr.');
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState('');
  const [newDocPhone, setNewDocPhone] = useState('');
  const [newDocEmail, setNewDocEmail] = useState('');
  const [newDocRegNumber, setNewDocRegNumber] = useState('');
  const [newDocBio, setNewDocBio] = useState('');
  const [newDocBadgeColor, setNewDocBadgeColor] = useState('#0d9488');
  const [newDocPhotoFile, setNewDocPhotoFile] = useState<File | null>(null);
  const [newDocSignatureFile, setNewDocSignatureFile] = useState<File | null>(
    null
  );

  const [newInvoicePatient, setNewInvoicePatient] = useState('');
  const [invoiceLineItems, setInvoiceLineItems] = useState<TreatmentLineItem[]>(
    [
      {
        treatmentName: 'Root Canal Treatment (RCT)',
        date: new Date().toISOString().split('T')[0],
        amount: '4500',
      },
    ]
  );

  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [invoicePaymentMode, setInvoicePaymentMode] =
    useState('Online UPI / GPay');
  const [invoiceTransactionId, setInvoiceTransactionId] = useState('');

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      regNumber: 'REG-2026-001',
      opdNumber: 'OPD-101',
      name: 'Rahul Sharma',
      age: '32',
      gender: 'Male',
      dob: '1994-05-12',
      phone: '+919876543210',
      email: 'rahul.sharma@gmail.com',
      address: '#42, 1st Cross, HSR Layout, Bangalore',
      branch: 'HSR Layout',
      lastVisit: '2026-09-15',
    },
    {
      id: '2',
      regNumber: 'REG-2026-002',
      opdNumber: 'OPD-102',
      name: 'Ananya Rao',
      age: '28',
      gender: 'Female',
      dob: '1998-11-20',
      phone: '+919876543211',
      email: 'ananya.rao@gmail.com',
      address: '#12, Outer Ring Road, KR Puram, Bangalore',
      branch: 'KR Puram',
      lastVisit: '2026-09-20',
    },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      date: '2026-10-04',
      time: '10:00 AM',
      patientName: 'Rahul Sharma',
      doctorName: 'Dr. Nakul BK MDS',
      status: 'Waiting',
      phone: '+919876543210',
      branch: 'HSR Layout',
    },
    {
      id: '2',
      date: '2026-10-04',
      time: '11:30 AM',
      patientName: 'Ananya Rao',
      doctorName: 'Dr. Swathi',
      status: 'Scheduled',
      phone: '+919876543211',
      branch: 'HSR Layout',
    },
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV-1001',
      patientName: 'Rahul Sharma',
      items: [
        {
          treatmentName: 'Root Canal Treatment (RCT)',
          date: '2026-09-15',
          amount: '4500',
        },
      ],
      totalAmount: '₹4,500',
      status: 'Paid',
      paymentMode: 'Online UPI / GPay',
      paymentDate: '2026-09-15',
      transactionId: 'UPI/925410883421',
    },
    {
      id: 'INV-1002',
      patientName: 'Rahul Sharma',
      items: [
        {
          treatmentName: 'Dental Crown (Zirconia)',
          date: '2026-10-01',
          amount: '6000',
        },
      ],
      totalAmount: '₹6,000',
      status: 'Pending',
    },
  ]);

  const [receipts, setReceipts] = useState<Receipt[]>([
    {
      id: 'REC-501',
      invoiceId: 'INV-1001',
      patientName: 'Rahul Sharma',
      amount: '₹4,500',
      mode: 'Online UPI / GPay',
      date: '2026-09-15',
      transactionId: 'UPI/925410883421',
      items: [
        {
          treatmentName: 'Root Canal Treatment (RCT)',
          date: '2026-09-15',
          amount: '4500',
        },
      ],
    },
  ]);

  const [progressNotes, setProgressNotes] = useState<ProgressNote[]>([
    {
      id: 'PN-1',
      date: '2026-09-15',
      doctor: 'Dr. Nakul BK MDS',
      note: 'Access cavity prepared under local anesthesia. Working length determined.',
    },
  ]);

  const [investigations, setInvestigations] = useState<InvestigationReport[]>([
    {
      id: 'INV-REP-1',
      date: '2026-09-15',
      testName: 'Digital Intraoral Periapical (IOPA) Radiograph',
      findings:
        'Periapical radiolucency noted around mesial root of tooth #46.',
    },
  ]);

  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([
    {
      id: 'FILE-1',
      fileName: 'Tooth_46_Preop_Xray.jpg',
      uploadDate: '2026-09-15',
      fileType: 'Image/Radiograph',
    },
  ]);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookDate, setBookDate] = useState('2026-10-04');
  const [bookTime, setBookTime] = useState('10:00 AM');
  const [bookPatientInput, setBookPatientInput] = useState('');
  const [bookDoctor, setBookDoctor] = useState('Dr. Nakul BK MDS');

  // Edit Appointment Modal State
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editDoctor, setEditDoctor] = useState('');
  const [editStatus, setEditStatus] =
    useState<Appointment['status']>('Scheduled');

  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [newProgressNoteText, setNewProgressNoteText] = useState('');

  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [newTestName, setNewTestName] = useState('');
  const [newTestFindings, setNewTestFindings] = useState('');

  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  const [regNumber, setRegNumber] = useState('REG-2026-003');
  const [opdNumber, setOpdNumber] = useState('OPD-103');
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newGender, setNewGender] = useState('Male');
  const [newDob, setNewDob] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const [notificationMsg, setNotificationMsg] = useState('');

  const toggleTooth = (num: number) => {
    if (selectedTeeth.includes(num)) {
      setSelectedTeeth(selectedTeeth.filter((t) => t !== num));
    } else {
      setSelectedTeeth([...selectedTeeth, num]);
    }
  };

  const updateAppointmentStatus = (
    id: string,
    newStatus: Appointment['status'],
    patientName: string
  ) => {
    if (newStatus === 'Cancelled') {
      setAppointments(appointments.filter((app) => app.id !== id));
      setNotificationMsg(`Appointment cancelled for ${patientName}.`);
    } else {
      setAppointments(
        appointments.map((app) =>
          app.id === id ? { ...app, status: newStatus } : app
        )
      );
      if (newStatus === 'Done') {
        setNotificationMsg(
          `Appointment completed for ${patientName}! You can now send a Review Request via WhatsApp.`
        );
        setTimeout(() => setNotificationMsg(''), 6000);
      } else if (newStatus === 'Missed') {
        setNotificationMsg(`Appointment marked as missed for ${patientName}.`);
        setTimeout(() => setNotificationMsg(''), 4000);
      }
    }
  };

  const handleOpenEditModal = (app: Appointment) => {
    setEditingAppointment(app);
    setEditDate(app.date);
    setEditTime(app.time);
    setEditDoctor(app.doctorName);
    setEditStatus(app.status);
  };

  const handleSaveEditAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAppointment) return;

    setAppointments(
      appointments.map((app) =>
        app.id === editingAppointment.id
          ? {
              ...app,
              date: editDate,
              time: editTime,
              doctorName: editDoctor,
              status: editStatus,
            }
          : app
      )
    );

    setNotificationMsg(
      `Appointment successfully updated for ${editingAppointment.patientName}!`
    );
    setEditingAppointment(null);
    setTimeout(() => setNotificationMsg(''), 4000);
  };

  const handleCancelAppointment = (id: string, patientName: string) => {
    if (
      window.confirm(
        `Are you sure you want to cancel the appointment for ${patientName}?`
      )
    ) {
      setAppointments(appointments.filter((app) => app.id !== id));
      setNotificationMsg(`Appointment cancelled for ${patientName}.`);
      setTimeout(() => setNotificationMsg(''), 4000);
    }
  };

  const formatTemplate = (
    template: string,
    vars: {
      patientName: string;
      date: string;
      time: string;
      doctor: string;
      branch: string;
    }
  ) => {
    return template
      .replace(/{patientName}/g, vars.patientName)
      .replace(/{date}/g, vars.date)
      .replace(/{time}/g, vars.time)
      .replace(/{doctor}/g, vars.doctor)
      .replace(/{branch}/g, vars.branch);
  };

  const handleSendWhatsAppBooking = (
    patientName: string,
    phone: string,
    date: string,
    time: string,
    doctor: string,
    branch: string
  ) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const parsedText = formatTemplate(bookingTemplate, {
      patientName,
      date,
      time,
      doctor,
      branch,
    });
    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(parsedText)}`,
      '_blank'
    );
    setNotificationMsg(
      `💬 WhatsApp Booking Confirmation opened for ${patientName}!`
    );
    setTimeout(() => setNotificationMsg(''), 4000);
  };

  const handleSendWhatsAppReminder = (
    patientName: string,
    phone: string,
    date: string,
    time: string,
    doctor: string,
    branch: string
  ) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const parsedText = formatTemplate(reminderTemplate, {
      patientName,
      date,
      time,
      doctor,
      branch,
    });
    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(parsedText)}`,
      '_blank'
    );
    setNotificationMsg(`💬 WhatsApp Reminder opened for ${patientName}!`);
    setTimeout(() => setNotificationMsg(''), 4000);
  };

  const handleSendWhatsAppReview = (
    patientName: string,
    phone: string,
    date: string,
    time: string,
    doctor: string,
    branch: string
  ) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const parsedText = formatTemplate(reviewTemplate, {
      patientName,
      date,
      time,
      doctor,
      branch,
    });
    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(parsedText)}`,
      '_blank'
    );
    setNotificationMsg(`💬 WhatsApp Review Request opened for ${patientName}!`);
    setTimeout(() => setNotificationMsg(''), 4000);
  };

  const handleOpenPatientFile = (patientName: string) => {
    const found = patients.find(
      (p) => p.name.toLowerCase() === patientName.toLowerCase()
    );
    if (found) {
      setSelectedPatient(found);
      setPatientFileTab('info');
      setActiveTab('patients');
    } else {
      const tempPatient: Patient = {
        id: 'temp-' + Date.now(),
        regNumber: 'REG-2026-999',
        opdNumber: 'OPD-999',
        name: patientName,
        age: '30',
        gender: 'Other',
        dob: '1995-01-01',
        phone: '+919999999999',
        email: 'patient@gmail.com',
        address: 'Bangalore',
        branch: activeBranch,
        lastVisit: 'Today',
      };
      setSelectedPatient(tempPatient);
      setPatientFileTab('info');
      setActiveTab('patients');
    }
  };

  const handleInvoicePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const txId =
      invoiceTransactionId ||
      'TXN-' + Math.floor(100000 + Math.random() * 900000);

    setInvoices(
      invoices.map((inv) =>
        inv.id === payingInvoice.id
          ? {
              ...inv,
              status: 'Paid',
              paymentMode: invoicePaymentMode,
              paymentDate: todayStr,
              transactionId: txId,
            }
          : inv
      )
    );

    const newRec: Receipt = {
      id: 'REC-' + Math.floor(100 + Math.random() * 900),
      invoiceId: payingInvoice.id,
      patientName: payingInvoice.patientName,
      amount: payingInvoice.totalAmount,
      mode: invoicePaymentMode,
      date: todayStr,
      transactionId: txId,
      items: payingInvoice.items,
    };
    setReceipts([newRec, ...receipts]);
    setNotificationMsg(
      `Payment of ${payingInvoice.totalAmount} recorded via ${invoicePaymentMode} (Txn ID: ${txId}) for invoice ${payingInvoice.id}!`
    );
    setPayingInvoice(null);
    setInvoiceTransactionId('');
    setTimeout(() => setNotificationMsg(''), 5000);
  };

  const formatClinicHeaderHtml = (titleText: string) => {
    const cleanTitle = titleText.replace(/DEN\+IST/g, 'DENIST');
    const plusHtml = `<span style="display: inline-flex; align-items: center; justify-content: center; color: #dc2626; font-size: 1.15em; font-weight: 900; margin: 0 2px; vertical-align: middle; line-height: 1;">+</span>`;
    const formattedTitle = cleanTitle.replace(/DENIST/g, `DEN${plusHtml}IST`);

    return `<span style="font-family: ${clinicFontFamily}; font-weight: ${clinicFontWeight}; color: ${clinicFontColor};">${formattedTitle}</span>`;
  };

  const handlePrintPrescription = (patient: Patient) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const matchedDoc = doctors.find(
      (d) => `${d.prefix} ${d.name}` === rxDoctor || d.name === rxDoctor
    );
    const docSignUrl = matchedDoc
      ? matchedDoc.signatureUrl
      : 'https://images.unsplash.com/photo-1594732891172-35a0925439a3?w=150';
    const docRegNum = matchedDoc ? matchedDoc.regNumber : 'KSDC-12345';

    const formattedHeader = formatClinicHeaderHtml(rxHeaderTitle);

    const htmlContent = `
      <html>
        <head>
          <title></title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Playfair+Display:wght@600;700&family=Poppins:wght@500;700&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 25px 35px; color: #1e293b; background: #fff; line-height: 1.5; }
            .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 14px; margin-bottom: 18px; position: relative; }
            .clinic-logo { position: absolute; left: 0; top: 0; width: 60px; height: 60px; object-fit: contain; border-radius: 6px; }
            .clinic-name { font-size: 24px; margin: 0 0 2px 0; letter-spacing: 0.5px; text-transform: uppercase; display: inline-block; }
            .clinic-details { font-size: 12px; color: #475569; margin: 2px 0; }
            .doc-details { font-size: 14px; font-weight: 700; color: #1d4ed8; margin-top: 4px; }
            
            .patient-box { display: flex; justify-content: space-between; margin-bottom: 18px; font-size: 12px; background: #f8fafc; padding: 10px 14px; border-radius: 6px; border: 1px solid #e2e8f0; }
            .patient-box div span { font-weight: 600; color: #475569; }
            
            .section { margin-bottom: 12px; }
            .section-title { font-size: 10px; font-weight: 700; color: #2563eb; text-transform: uppercase; margin-bottom: 3px; letter-spacing: 1px; border-bottom: 1px solid #e2e8f0; padding-bottom: 2px; }
            .section-content { font-size: 13px; color: #0f172a; padding: 4px 0; font-weight: 500; }
            
            .rx-symbol { font-size: 18px; font-weight: 700; color: #1d4ed8; margin-top: 10px; margin-bottom: 6px; }
            
            table { width: 100%; border-collapse: collapse; margin-top: 6px; margin-bottom: 16px; }
            th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; font-size: 12px; }
            th { background: #f1f5f9; color: #0f172a; font-weight: 600; }

            .signature-area { margin-top: 25px; text-align: right; float: right; }
            .signature-img { height: 42px; object-fit: contain; display: block; margin-left: auto; margin-bottom: 2px; }
            
            .footer { clear: both; margin-top: 30px; text-align: center; font-size: 10px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            ${
              clinicLogoUrl
                ? `<img src="${clinicLogoUrl}" class="clinic-logo" alt="Clinic Logo" />`
                : ''
            }
            <h1 class="clinic-name">${formattedHeader}</h1>
            <div class="clinic-details"><strong>Branch Location:</strong> ${activeBranch}</div>
            <div class="doc-details">Consulting Doctor: ${rxDoctor} &nbsp;|&nbsp; Reg No: ${docRegNum}</div>
            <div class="clinic-details" style="margin-top: 3px;">${rxContactNumber}</div>
          </div>

          <div class="patient-box">
            <div>
              <div><span>Patient Name:</span> ${patient.name}</div>
              <div style="margin-top: 2px;"><span>Contact Number:</span> ${
                patient.phone
              }</div>
            </div>
            <div style="text-align: right;">
              <div><span>Reg No / OPD No:</span> ${patient.regNumber} / ${
      patient.opdNumber || 'OPD-001'
    }</div>
              <div style="margin-top: 2px;"><span>Date:</span> ${new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Chief Complaint</div>
            <div class="section-content">${
              rxChiefComplaint || 'None recorded'
            }</div>
          </div>

          <div class="section">
            <div class="section-title">Clinical Diagnosis</div>
            <div class="section-content">${rxDiagnosis || 'None recorded'}</div>
          </div>

          <div class="section">
            <div class="section-title">Treatment Planned</div>
            <div class="section-content">${
              rxTreatmentPlanned || 'None recorded'
            }</div>
          </div>

          <div class="section">
            <div class="section-title">Treatment Done</div>
            <div class="section-content">${
              rxTreatmentDone || 'None recorded'
            }</div>
          </div>

          <div class="rx-symbol">℞ Medication & Dosage</div>
          <table>
            <thead>
              <tr>
                <th style="width: 35%;">Medication Name & Strength</th>
                <th style="width: 25%;">Frequency</th>
                <th style="width: 15%;">Duration</th>
                <th style="width: 25%;">Instructions</th>
              </tr>
            </thead>
            <tbody>
              ${
                prescriptionMeds.length > 0
                  ? prescriptionMeds
                      .map(
                        (med) => `
                <tr>
                  <td><strong>${med.drugName}</strong> (${med.dosage})</td>
                  <td>${med.frequency}</td>
                  <td><strong>${med.duration}</strong></td>
                  <td>${med.instructions}</td>
                </tr>
              `
                      )
                      .join('')
                  : `<tr><td colspan="4" style="text-align: center; color: #64748b;">No medications prescribed.</td></tr>`
              }
            </tbody>
          </table>

          <div class="section">
            <div class="section-title">Additional Clinical Notes</div>
            <div class="section-content" style="white-space: pre-wrap;">${
              rxAdditionalNotes || 'None recorded'
            }</div>
          </div>

          <div class="signature-area">
            <img src="${docSignUrl}" class="signature-img" alt="Doctor Signature" />
            <div style="font-size: 13px; font-weight: 700; color: #0f172a;">${rxDoctor}</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 1px;">Authorized Signature & Seal</div>
          </div>

          <div class="footer">
            <p>${rxFooterSecondaryBranch}</p>
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handlePrintInvoice = (inv: Invoice) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const formattedHeader = formatClinicHeaderHtml(rxHeaderTitle);

    const htmlContent = `
      <html>
        <head>
          <title></title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Playfair+Display:wght@600;700&family=Poppins:wght@500;700&display=swap');
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; color: #1e293b; background: #fff; line-height: 1.4; }
            .header { text-align: center; border-bottom: 2px solid #cbd5e1; padding-bottom: 14px; margin-bottom: 18px; position: relative; }
            .clinic-logo { position: absolute; left: 0; top: 0; width: 60px; height: 60px; object-fit: contain; border-radius: 6px; }
            .clinic-name { font-size: 22px; margin: 0 0 4px 0; letter-spacing: 0.5px; display: inline-block; }
            .clinic-details { font-size: 12px; color: #475569; margin: 2px 0; }
            .doc-details { font-size: 12px; font-weight: 600; color: #334155; margin-top: 3px; }
            .details-grid { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 12px; background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; font-size: 12px; }
            th { background: #f1f5f9; color: #0f172a; font-weight: 600; }
            .total-section { text-align: right; font-size: 15px; font-weight: 700; color: #0f172a; margin-top: 12px; }
            .footer { margin-top: 35px; text-align: center; font-size: 10px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px; }
            .status-paid { color: #16a34a; font-weight: 700; }
            .status-pending { color: #d97706; font-weight: 700; }
          </style>
        </head>
        <body>
          <div class="header">
            ${
              clinicLogoUrl
                ? `<img src="${clinicLogoUrl}" class="clinic-logo" alt="Clinic Logo" />`
                : ''
            }
            <h1 class="clinic-name">${formattedHeader}</h1>
            <div class="clinic-details"><strong>Branch Location:</strong> ${activeBranch}</div>
            <div class="doc-details">${rxDoctorName}</div>
            <div class="clinic-details">${rxContactNumber} | <strong>GSTIN:</strong> ${defaultGstinSetting}</div>
          </div>
          <div class="details-grid">
            <div>
              <strong>Patient Name:</strong> ${inv.patientName}<br/>
              <strong>Invoice ID:</strong> ${inv.id}
            </div>
            <div style="text-align: right;">
              <strong>Date:</strong> ${new Date().toLocaleDateString()}<br/>
              <strong>Payment Status:</strong> <span class="${
                inv.status === 'Paid' ? 'status-paid' : 'status-pending'
              }">${inv.status}</span>
              ${
                inv.paymentMode
                  ? `<br/><strong>Payment Mode:</strong> ${inv.paymentMode}`
                  : ''
              }
              ${
                inv.transactionId
                  ? `<br/><strong>Transaction ID:</strong> ${inv.transactionId}`
                  : ''
              }
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 40px;">#</th>
                <th>Treatment Procedure</th>
                <th style="width: 100px;">Date</th>
                <th style="width: 110px; text-align: right;">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${inv.items
                .map(
                  (item, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${item.treatmentName}</td>
                  <td>${item.date}</td>
                  <td style="text-align: right;">₹${item.amount}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          <div class="total-section">
            Total Amount Due: ${inv.totalAmount}
          </div>
          <div class="footer">
            <p>${rxFooterSecondaryBranch}</p>
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handlePrintReceipt = (rec: Receipt) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const formattedHeader = formatClinicHeaderHtml(rxHeaderTitle);
    const itemsToPrint = rec.items || [
      {
        treatmentName: 'Dental Consultation / Treatment',
        date: rec.date,
        amount: rec.amount.replace(/[^0-9]/g, ''),
      },
    ];

    const htmlContent = `
      <html>
        <head>
          <title></title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Playfair+Display:wght@600;700&family=Poppins:wght@500;700&display=swap');
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; color: #1e293b; background: #fff; line-height: 1.4; }
            .header { text-align: center; border-bottom: 2px solid #cbd5e1; padding-bottom: 14px; margin-bottom: 18px; position: relative; }
            .clinic-logo { position: absolute; left: 0; top: 0; width: 60px; height: 60px; object-fit: contain; border-radius: 6px; }
            .clinic-name { font-size: 22px; margin: 0 0 4px 0; letter-spacing: 0.5px; display: inline-block; }
            .receipt-badge { font-size: 13px; font-weight: 600; color: #16a34a; margin-top: 3px; text-transform: uppercase; letter-spacing: 1px; }
            .clinic-details { font-size: 12px; color: #475569; margin: 2px 0; }
            .doc-details { font-size: 12px; font-weight: 600; color: #334155; margin-top: 3px; }
            .details-grid { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 12px; background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; font-size: 12px; }
            th { background: #f1f5f9; color: #0f172a; font-weight: 600; }
            .total-section { text-align: right; font-size: 15px; font-weight: 700; color: #16a34a; margin-top: 12px; }
            .footer { margin-top: 35px; text-align: center; font-size: 10px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            ${
              clinicLogoUrl
                ? `<img src="${clinicLogoUrl}" class="clinic-logo" alt="Clinic Logo" />`
                : ''
            }
            <h1 class="clinic-name">${formattedHeader}</h1>
            <div class="receipt-badge">Payment Receipt</div>
            <div class="clinic-details" style="margin-top: 4px;"><strong>Branch Location:</strong> ${activeBranch}</div>
            <div class="doc-details">${rxDoctorName}</div>
            <div class="clinic-details">${rxContactNumber} | <strong>GSTIN:</strong> ${defaultGstinSetting}</div>
          </div>
          <div class="details-grid">
            <div>
              <strong>Patient Name:</strong> ${rec.patientName}<br/>
              <strong>Receipt ID:</strong> ${rec.id}<br/>
              <strong>Invoice Ref:</strong> ${rec.invoiceId}
            </div>
            <div style="text-align: right;">
              <strong>Payment Date:</strong> ${rec.date}<br/>
              <strong>Payment Mode:</strong> ${rec.mode}<br/>
              <strong>Transaction ID:</strong> ${rec.transactionId || 'N/A'}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 40px;">#</th>
                <th>Treatment Procedure</th>
                <th style="width: 100px;">Date</th>
                <th style="width: 120px; text-align: right;">Amount Paid (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${itemsToPrint
                .map(
                  (item, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${item.treatmentName}</td>
                  <td>${item.date}</td>
                  <td style="text-align: right;">₹${item.amount}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          <div class="total-section">
            Total Amount Received: ${rec.amount} (PAID)
          </div>
          <div class="footer">
            <p>${rxFooterSecondaryBranch}</p>
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleAddProgressNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgressNoteText) return;
    const note: ProgressNote = {
      id: 'PN-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      doctor: rxDoctor,
      note: newProgressNoteText,
    };
    setProgressNotes([note, ...progressNotes]);
    setNewProgressNoteText('');
    setIsProgressModalOpen(false);
  };

  const handleAddInvestigation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName) return;
    const inv: InvestigationReport = {
      id: 'INV-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      testName: newTestName,
      findings: newTestFindings || 'Normal limits',
    };
    setInvestigations([inv, ...investigations]);
    setNewTestName('');
    setNewTestFindings('');
    setIsInvestModalOpen(false);
  };

  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName) return;
    const file: AttachedFile = {
      id: 'FILE-' + Date.now(),
      fileName: newFileName,
      uploadDate: new Date().toISOString().split('T')[0],
      fileType: 'Document / Scan',
    };
    setAttachedFiles([file, ...attachedFiles]);
    setNewFileName('');
    setIsFileModalOpen(false);
  };

  const handleAddLineItem = () => {
    setInvoiceLineItems([
      ...invoiceLineItems,
      {
        treatmentName: defaultTreatments[0]?.name || 'Consultation',
        date: new Date().toISOString().split('T')[0],
        amount: defaultTreatments[0]?.standardFee || '500',
      },
    ]);
  };

  const handleRemoveLineItem = (index: number) => {
    if (invoiceLineItems.length === 1) return;
    setInvoiceLineItems(invoiceLineItems.filter((_, idx) => idx !== index));
  };

  const handleLineItemChange = (
    index: number,
    field: keyof TreatmentLineItem,
    value: string
  ) => {
    const updated = [...invoiceLineItems];
    updated[index][field] = value;
    if (field === 'treatmentName') {
      const found = defaultTreatments.find((t) => t.name === value);
      if (found) {
        updated[index].amount = found.standardFee;
      }
    }
    setInvoiceLineItems(updated);
  };

  const handleCreateMultiTreatmentInvoice = (
    e: React.FormEvent,
    patientNameOverride?: string
  ) => {
    e.preventDefault();
    const targetPatient = patientNameOverride || newInvoicePatient;
    if (!targetPatient) return;
    const totalSum = invoiceLineItems.reduce(
      (acc, curr) => acc + (parseFloat(curr.amount) || 0),
      0
    );
    const newInv: Invoice = {
      id: invoicePrefixSetting + Math.floor(1000 + Math.random() * 9000),
      patientName: targetPatient,
      items: [...invoiceLineItems],
      totalAmount: '₹' + totalSum.toLocaleString('en-IN'),
      status: 'Pending',
    };
    setInvoices([newInv, ...invoices]);
    setNewInvoicePatient('');
    setInvoiceLineItems([
      {
        treatmentName: defaultTreatments[0]?.name || 'Consultation',
        date: new Date().toISOString().split('T')[0],
        amount: defaultTreatments[0]?.standardFee || '500',
      },
    ]);
    setNotificationMsg(
      `Multi-treatment invoice ${newInv.id} generated for ${targetPatient}!`
    );
    setTimeout(() => setNotificationMsg(''), 5000);
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookPatientInput) return;

    const matchedPatient = patients.find(
      (p) =>
        p.name.toLowerCase() === bookPatientInput.toLowerCase() ||
        p.regNumber.toLowerCase() === bookPatientInput.toLowerCase() ||
        p.opdNumber?.toLowerCase() === bookPatientInput.toLowerCase() ||
        p.phone === bookPatientInput
    );

    const finalPatientName = matchedPatient
      ? matchedPatient.name
      : bookPatientInput;
    const finalPhone = matchedPatient ? matchedPatient.phone : '+919999999999';

    const newApp: Appointment = {
      id: Date.now().toString(),
      date: bookDate,
      time: bookTime,
      patientName: finalPatientName,
      doctorName: bookDoctor,
      status: 'Scheduled',
      phone: finalPhone,
      branch: activeBranch,
    };
    setAppointments([...appointments, newApp]);
    setBookPatientInput('');
    setIsBookingOpen(false);
    setNotificationMsg(
      `Appointment successfully booked for ${newApp.patientName} on ${newApp.date} at ${newApp.time}`
    );
    setTimeout(() => setNotificationMsg(''), 4000);
  };

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    const patient: Patient = {
      id: Date.now().toString(),
      regNumber: regNumber || `REG-2026-00${patients.length + 1}`,
      opdNumber: opdNumber || `OPD-${100 + patients.length + 1}`,
      name: newName,
      age: newAge || '30',
      gender: newGender,
      dob: newDob || '1995-01-01',
      phone: newPhone || '+910000000000',
      email: newEmail || 'patient@gmail.com',
      address: newAddress || 'Bangalore',
      branch: activeBranch,
      lastVisit: new Date().toISOString().split('T')[0],
    };
    setPatients([patient, ...patients]);
    setNewName('');
    setNewAge('');
    setNewDob('');
    setNewPhone('');
    setNewEmail('');
    setNewAddress('');
    setRegNumber(`REG-2026-00${patients.length + 3}`);
    setOpdNumber(`OPD-${100 + patients.length + 3}`);
    setNotificationMsg(
      `Successfully registered patient: ${patient.name} (${patient.regNumber} | ${patient.opdNumber})`
    );
    setTimeout(() => setNotificationMsg(''), 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAuth(true);
    setAuthError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailInput,
      password: passwordInput,
    });

    if (error) {
      setAuthError(error.message);
    } else {
      setSession(data.session);
    }
    setLoadingAuth(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-slate-100">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              THE DEN
              <span
                className="text-red-600 inline-flex items-center justify-center font-black text-3xl align-middle mx-0.5"
                style={{ lineHeight: 1 }}
              >
                +
              </span>
              IST'S DENTAL CLINIC
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Authorized Staff Login Portal
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Staff Email Address
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-sm sm:text-base"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-sm sm:text-base"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingAuth}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              {loadingAuth ? 'Signing in...' : 'Sign In to CRM'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const today = new Date();
  const formattedDateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getDayBadgeColor = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const dayOfWeek = d.getDay();
      switch (dayOfWeek) {
        case 0:
          return 'bg-rose-100 text-rose-700 border-rose-200';
        case 1:
          return 'bg-blue-100 text-blue-700 border-blue-200';
        case 2:
          return 'bg-purple-100 text-purple-700 border-purple-200';
        case 3:
          return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        case 4:
          return 'bg-amber-100 text-amber-800 border-amber-200';
        case 5:
          return 'bg-indigo-100 text-indigo-700 border-indigo-200';
        case 6:
          return 'bg-teal-100 text-teal-700 border-teal-200';
        default:
          return 'bg-slate-100 text-slate-700 border-slate-200';
      }
    } catch {
      return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getDayName = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <datalist id="patient-lookup-list">
        {patients.map((p) => (
          <React.Fragment key={p.id}>
            <option
              value={p.name}
            >{`Name: ${p.name} | Reg: ${p.regNumber} | OPD: ${p.opdNumber} | Ph: ${p.phone}`}</option>
            <option
              value={p.regNumber}
            >{`Reg: ${p.regNumber} | OPD: ${p.opdNumber} | Name: ${p.name}`}</option>
            <option
              value={p.opdNumber}
            >{`OPD: ${p.opdNumber} | Name: ${p.name}`}</option>
            <option
              value={p.phone}
            >{`Phone: ${p.phone} | Name: ${p.name}`}</option>
          </React.Fragment>
        ))}
      </datalist>

      <datalist id="medication-suggestions-list">
        {clinicMedications.map((m) => (
          <option
            key={m.id}
            value={m.name}
          >{`${m.name} (${m.defaultStrength}) - ${m.defaultFrequency}, ${m.defaultDuration}`}</option>
        ))}
      </datalist>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
          <span className="font-bold text-sm text-blue-600">
            THE DEN
            <span
              className="text-red-600 inline-flex items-center justify-center font-black text-xl align-middle mx-0.5"
              style={{ lineHeight: 1 }}
            >
              +
            </span>
            IST CRM
          </span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-slate-500 hover:text-slate-700 p-1"
          >
            ✕
          </button>
        </div>

        <nav className="p-4 space-y-1 flex-1">
          <button
            onClick={() => {
              setActiveTab('calendar');
              setSelectedPatient(null);
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'calendar'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            📊 Calendar & Queue
          </button>
          <button
            onClick={() => {
              setActiveTab('patients');
              setSelectedPatient(null);
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'patients'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            👥 Patients Registry & Rx
          </button>
          <button
            onClick={() => {
              setActiveTab('billing');
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'billing'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            📄 Billing & Invoices
          </button>
          <button
            onClick={() => {
              setActiveTab('settings');
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            ⚙️ Clinic Settings
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-md transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-slate-600 p-1 text-lg"
            >
              ☰
            </button>

            <div className="relative">
              <button
                onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-md text-xs sm:text-sm font-medium text-slate-700 transition-colors"
              >
                <span>📍</span>
                <span className="truncate max-w-[120px] sm:max-w-none">
                  {activeBranch}
                </span>
                <span className="text-[10px]">▼</span>
              </button>

              {isBranchDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50">
                  {CLINIC_BRANCHES.map((branch) => (
                    <button
                      key={branch}
                      onClick={() => {
                        setActiveBranch(branch);
                        setIsBranchDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      {branch}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-medium text-slate-600 truncate max-w-[150px] sm:max-w-none">
              {session.user.email}
            </span>
          </div>
        </header>

        <main className="p-4 sm:p-6 flex-1">
          {notificationMsg && (
            <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg shadow-sm flex items-center justify-between">
              <span>{notificationMsg}</span>
              <span className="text-xs font-bold uppercase bg-emerald-200 px-2 py-1 rounded">
                Live Notification
              </span>
            </div>
          )}

          {/* TAB 1: CALENDAR & APPOINTMENTS */}
          {activeTab === 'calendar' && (
            <div>
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                    Appointment Calendar
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Branch: {activeBranch}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm font-semibold text-blue-600">
                    📅 {formattedDateString}
                  </div>
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm shadow-sm transition-colors flex items-center gap-2"
                  >
                    <span>+</span> Book Appointment
                  </button>
                </div>
              </div>

              {/* Edit Appointment Modal */}
              {editingAppointment && (
                <div className="mb-6 bg-white p-6 rounded-xl shadow-md border border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-800">
                      Edit Appointment for {editingAppointment.patientName}
                    </h3>
                    <button
                      onClick={() => setEditingAppointment(null)}
                      className="text-slate-400 hover:text-slate-600 text-lg"
                    >
                      ✕
                    </button>
                  </div>
                  <form
                    onSubmit={handleSaveEditAppointment}
                    className="grid grid-cols-1 sm:grid-cols-5 gap-4"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        Appointment Date
                      </label>
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm text-slate-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        Time Slot (12-hr)
                      </label>
                      <select
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm bg-white text-slate-800 font-semibold"
                        required
                      >
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="09:30 AM">09:30 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="10:30 AM">10:30 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="11:30 AM">11:30 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="12:30 PM">12:30 PM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="02:30 PM">02:30 PM</option>
                        <option value="03:00 PM">03:00 PM</option>
                        <option value="03:30 PM">03:30 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                        <option value="04:30 PM">04:30 PM</option>
                        <option value="05:00 PM">05:00 PM</option>
                        <option value="05:30 PM">05:30 PM</option>
                        <option value="06:00 PM">06:00 PM</option>
                        <option value="06:30 PM">06:30 PM</option>
                        <option value="07:00 PM">07:00 PM</option>
                        <option value="07:30 PM">07:30 PM</option>
                        <option value="08:00 PM">08:00 PM</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        Assigned Doctor
                      </label>
                      <select
                        value={editDoctor}
                        onChange={(e) => setEditDoctor(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm bg-white text-slate-800"
                      >
                        {doctors.map((d) => (
                          <option
                            key={d.id}
                            value={`${d.prefix} ${d.name}`}
                          >{`${d.prefix} ${d.name} (${d.specialty})`}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        Status
                      </label>
                      <select
                        value={editStatus}
                        onChange={(e) =>
                          setEditStatus(e.target.value as Appointment['status'])
                        }
                        className="w-full px-3 py-2 border rounded-md text-sm bg-white text-slate-800 font-semibold"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Waiting">Waiting</option>
                        <option value="Engaged">Engaged</option>
                        <option value="Done">Done</option>
                        <option value="Missed">Missed</option>
                      </select>
                    </div>
                    <div className="flex items-end gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-xs shadow-sm"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingAppointment(null)}
                        className="px-3 py-2 bg-slate-200 text-slate-700 rounded-md text-xs font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-5 rounded-xl border border-blue-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-blue-900">
                    🌐 Public Appointment Booking Link (for Website & Google
                    Business)
                  </h3>
                  <p className="text-xs text-blue-700 mt-0.5">
                    Share this direct link on your website (
                    <code className="bg-white px-1 py-0.5 rounded text-blue-800">
                      thedentist.co.in
                    </code>
                    ) and Google Business Profile to let patients book
                    appointments instantly.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://thedentist.co.in/book?branch=${encodeURIComponent(
                      activeBranch
                    )}`}
                    className="px-3 py-1.5 bg-white border border-blue-300 rounded text-xs text-slate-700 font-mono w-full sm:w-72"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `https://thedentist.co.in/book?branch=${encodeURIComponent(
                          activeBranch
                        )}`
                      );
                      setNotificationMsg(
                        '📋 Public Booking Link copied to clipboard! Paste it into your Google Business Profile & website.'
                      );
                      setTimeout(() => setNotificationMsg(''), 4000);
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-sm whitespace-nowrap"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              {isBookingOpen && (
                <div className="mb-6 bg-white p-6 rounded-xl shadow-md border border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-800">
                      Book New Appointment ({activeBranch})
                    </h3>
                    <button
                      onClick={() => setIsBookingOpen(false)}
                      className="text-slate-400 hover:text-slate-600 text-lg"
                    >
                      ✕
                    </button>
                  </div>
                  <form
                    onSubmit={handleBookAppointment}
                    className="grid grid-cols-1 sm:grid-cols-5 gap-4"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        Appointment Date
                      </label>
                      <input
                        type="date"
                        value={bookDate}
                        onChange={(e) => setBookDate(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm text-slate-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        Time Slot (12-hr AM/PM)
                      </label>
                      <select
                        value={bookTime}
                        onChange={(e) => setBookTime(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm bg-white text-slate-800 font-semibold"
                        required
                      >
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="09:30 AM">09:30 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="10:30 AM">10:30 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="11:30 AM">11:30 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="12:30 PM">12:30 PM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="02:30 PM">02:30 PM</option>
                        <option value="03:00 PM">03:00 PM</option>
                        <option value="03:30 PM">03:30 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                        <option value="04:30 PM">04:30 PM</option>
                        <option value="05:00 PM">05:00 PM</option>
                        <option value="05:30 PM">05:30 PM</option>
                        <option value="06:00 PM">06:00 PM</option>
                        <option value="06:30 PM">06:30 PM</option>
                        <option value="07:00 PM">07:00 PM</option>
                        <option value="07:30 PM">07:30 PM</option>
                        <option value="08:00 PM">08:00 PM</option>
                      </select>
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        Patient (Name/Reg/OPD/Ph)
                      </label>
                      <input
                        type="text"
                        list="patient-lookup-list"
                        value={bookPatientInput}
                        onChange={(e) => setBookPatientInput(e.target.value)}
                        placeholder="Type name, reg, opd or phone"
                        className="w-full px-3 py-2 border rounded-md text-sm text-slate-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        Assigned Doctor
                      </label>
                      <select
                        value={bookDoctor}
                        onChange={(e) => setBookDoctor(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm bg-white text-slate-800"
                      >
                        {doctors.map((d) => (
                          <option
                            key={d.id}
                            value={`${d.prefix} ${d.name}`}
                          >{`${d.prefix} ${d.name} (${d.specialty})`}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md text-sm shadow-sm"
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-800">
                    Bookings & Live Queue
                  </h3>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">
                    {
                      appointments.filter((a) => a.branch === activeBranch)
                        .length
                    }{' '}
                    Bookings
                  </span>
                </div>

                <div className="divide-y divide-slate-100 overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[950px]">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                        <th className="p-4">Day & Date</th>
                        <th className="p-4">Time Slot</th>
                        <th className="p-4">Patient Name & Call</th>
                        <th className="p-4">Assigned Doctor</th>
                        <th className="p-4">Live Status</th>
                        <th className="p-4 text-right">
                          Actions (WhatsApp, Edit, Cancel)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                      {appointments
                        .filter((app) => app.branch === activeBranch)
                        .map((app) => {
                          const matchedDoc = doctors.find(
                            (d) =>
                              `${d.prefix} ${d.name}` === app.doctorName ||
                              app.doctorName.includes(d.name)
                          );
                          const docBadgeColor = matchedDoc
                            ? matchedDoc.badgeColor
                            : '#334155';

                          return (
                            <tr
                              key={app.id}
                              className="hover:bg-slate-50/60 transition-colors"
                            >
                              <td className="p-4">
                                <span
                                  className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold border ${getDayBadgeColor(
                                    app.date
                                  )}`}
                                >
                                  {getDayName(app.date)}
                                </span>
                                <span className="block text-[11px] text-slate-400 mt-0.5">
                                  {app.date}
                                </span>
                              </td>
                              <td className="p-4 font-semibold text-blue-600">
                                {app.time}
                              </td>
                              <td className="p-4 font-medium text-slate-900">
                                <button
                                  onClick={() =>
                                    handleOpenPatientFile(app.patientName)
                                  }
                                  className="text-blue-600 hover:text-blue-800 hover:underline font-semibold text-left flex items-center gap-1"
                                >
                                  <span>👤</span> {app.patientName}
                                </button>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-slate-400">
                                    {app.phone}
                                  </span>
                                  <a
                                    href={`tel:${app.phone}`}
                                    className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-[11px] font-bold shadow-sm"
                                    title="Make a Call"
                                  >
                                    📞 Call
                                  </a>
                                </div>
                              </td>
                              <td className="p-4">
                                <span
                                  className="inline-block px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                                  style={{ backgroundColor: docBadgeColor }}
                                >
                                  {app.doctorName}
                                </span>
                              </td>
                              <td className="p-4">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                    app.status === 'Waiting'
                                      ? 'bg-amber-50 text-amber-600 border border-amber-200'
                                      : app.status === 'Engaged'
                                      ? 'bg-purple-50 text-purple-600 border border-purple-200'
                                      : app.status === 'Done'
                                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                      : app.status === 'Missed'
                                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {app.status}
                                </span>
                              </td>
                              <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() =>
                                    handleSendWhatsAppBooking(
                                      app.patientName,
                                      app.phone,
                                      app.date,
                                      app.time,
                                      app.doctorName,
                                      app.branch
                                    )
                                  }
                                  className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-xs font-semibold shadow-sm"
                                  title="Send WhatsApp Booking"
                                >
                                  💬 Booking
                                </button>
                                <button
                                  onClick={() =>
                                    handleSendWhatsAppReminder(
                                      app.patientName,
                                      app.phone,
                                      app.date,
                                      app.time,
                                      app.doctorName,
                                      app.branch
                                    )
                                  }
                                  className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded text-xs font-semibold shadow-sm"
                                  title="Send WhatsApp Reminder"
                                >
                                  🔔 Reminder
                                </button>
                                {app.status === 'Done' && (
                                  <button
                                    onClick={() =>
                                      handleSendWhatsAppReview(
                                        app.patientName,
                                        app.phone,
                                        app.date,
                                        app.time,
                                        app.doctorName,
                                        app.branch
                                      )
                                    }
                                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-sm animate-pulse"
                                    title="Send Google Review Request"
                                  >
                                    ⭐ Review
                                  </button>
                                )}
                                <button
                                  onClick={() => handleOpenEditModal(app)}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold shadow-sm"
                                  title="Edit Appointment"
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleCancelAppointment(
                                      app.id,
                                      app.patientName
                                    )
                                  }
                                  className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-xs font-semibold shadow-sm"
                                  title="Cancel Appointment"
                                >
                                  ❌ Cancel
                                </button>
                                <select
                                  value={app.status}
                                  onChange={(e) =>
                                    updateAppointmentStatus(
                                      app.id,
                                      e.target.value as Appointment['status'],
                                      app.patientName
                                    )
                                  }
                                  className="text-xs border border-slate-300 rounded px-1.5 py-1 bg-white text-slate-700"
                                >
                                  <option value="Scheduled">Scheduled</option>
                                  <option value="Waiting">Waiting</option>
                                  <option value="Engaged">Engaged</option>
                                  <option value="Done">Done (Review)</option>
                                  <option value="Missed">Missed</option>
                                  <option value="Cancelled">Cancel</option>
                                </select>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PATIENTS REGISTRY & COMPREHENSIVE PATIENT FILE */}
          {activeTab === 'patients' && !selectedPatient && (
            <div>
              <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                  Patients Registry & Clinical Files
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Branch: {activeBranch} — Click any row to open comprehensive
                  patient file and prescription pad
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-base font-semibold text-slate-800 mb-4">
                    Register New Patient
                  </h3>
                  <form onSubmit={handleAddPatient} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase">
                          Registration No
                        </label>
                        <input
                          type="text"
                          value={regNumber}
                          onChange={(e) => setRegNumber(e.target.value)}
                          className="w-full mt-0.5 px-3 py-1.5 border rounded-md text-xs bg-slate-50 text-slate-700 font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase">
                          OPD Number
                        </label>
                        <input
                          type="text"
                          value={opdNumber}
                          onChange={(e) => setOpdNumber(e.target.value)}
                          className="w-full mt-0.5 px-3 py-1.5 border rounded-md text-xs bg-slate-50 text-slate-700 font-mono font-bold text-blue-600"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase">
                        Patient Full Name
                      </label>
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Enter full name"
                        className="w-full mt-0.5 px-3 py-1.5 border rounded-md text-sm text-slate-800"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase">
                          Age
                        </label>
                        <input
                          type="number"
                          value={newAge}
                          onChange={(e) => setNewAge(e.target.value)}
                          placeholder="Years"
                          className="w-full mt-0.5 px-3 py-1.5 border rounded-md text-sm text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase">
                          Gender
                        </label>
                        <select
                          value={newGender}
                          onChange={(e) => setNewGender(e.target.value)}
                          className="w-full mt-0.5 px-3 py-1.5 border rounded-md text-sm bg-white text-slate-800"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase">
                        Date of Birth (DOB)
                      </label>
                      <input
                        type="date"
                        value={newDob}
                        onChange={(e) => setNewDob(e.target.value)}
                        className="w-full mt-0.5 px-3 py-1.5 border rounded-md text-sm text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="+91..."
                        className="w-full mt-0.5 px-3 py-1.5 border rounded-md text-sm text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="patient@gmail.com"
                        className="w-full mt-0.5 px-3 py-1.5 border rounded-md text-sm text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase">
                        Residential Address
                      </label>
                      <textarea
                        rows={2}
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        placeholder="Enter street address"
                        className="w-full mt-0.5 px-3 py-1.5 border rounded-md text-sm text-slate-800"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-sm shadow-sm"
                    >
                      Save Patient Record
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-800">
                      Registered Patients Directory
                    </h3>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                      {patients.length} Total
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                          <th className="p-3">Reg & OPD No</th>
                          <th className="p-3">Patient Name</th>
                          <th className="p-3">Age/Gender</th>
                          <th className="p-3">Contact</th>
                          <th className="p-3">Email</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                        {patients.map((p) => (
                          <tr
                            key={p.id}
                            onClick={() => setSelectedPatient(p)}
                            className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                          >
                            <td className="p-3 font-mono text-xs font-semibold">
                              <span className="text-blue-600">
                                {p.regNumber}
                              </span>
                              <span className="block text-[11px] text-emerald-600 font-bold">
                                {p.opdNumber || 'OPD-001'}
                              </span>
                            </td>
                            <td className="p-3 font-semibold text-slate-900">
                              {p.name}
                            </td>
                            <td className="p-3">
                              {p.age} yrs / {p.gender}
                            </td>
                            <td className="p-3 text-slate-600">{p.phone}</td>
                            <td className="p-3 text-slate-500 text-xs">
                              {p.email}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPatient(p);
                                  setPatientFileTab('prescription');
                                }}
                                className="px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-xs font-semibold"
                              >
                                View File & Rx →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COMPREHENSIVE PATIENT FILE VIEW */}
          {activeTab === 'patients' && selectedPatient && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded">
                      {selectedPatient.regNumber}
                    </span>
                    <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded">
                      {selectedPatient.opdNumber || 'OPD-001'}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-800 mt-1">
                    {selectedPatient.name}
                  </h1>
                  <p className="text-sm text-slate-500">
                    📞 {selectedPatient.phone} • {selectedPatient.age} yrs •{' '}
                    {selectedPatient.gender}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm font-medium"
                  >
                    ← Back to List
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-6 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setPatientFileTab('prescription')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    patientFileTab === 'prescription'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  📋 Prescription Pad
                </button>
                <button
                  onClick={() => setPatientFileTab('info')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    patientFileTab === 'info'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  ℹ Info
                </button>
                <button
                  onClick={() => setPatientFileTab('timeline')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    patientFileTab === 'timeline'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  ⏳ Timeline
                </button>
                <button
                  onClick={() => setPatientFileTab('invoice')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    patientFileTab === 'invoice'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  📄 Invoice & Billing
                </button>
                <button
                  onClick={() => setPatientFileTab('receipt')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    patientFileTab === 'receipt'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  🧾 Receipt & Payments
                </button>
                <button
                  onClick={() => setPatientFileTab('progress')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    patientFileTab === 'progress'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  📝 Progress Note
                </button>
                <button
                  onClick={() => setPatientFileTab('investigation')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    patientFileTab === 'investigation'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  🔬 Investigation Report
                </button>
                <button
                  onClick={() => setPatientFileTab('files')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    patientFileTab === 'files'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  📁 Add File
                </button>
                <button
                  onClick={() => setPatientFileTab('dentalChart')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    patientFileTab === 'dentalChart'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  🦷 Dental Chart
                </button>
              </div>

              {patientFileTab === 'prescription' && (
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                    <h3 className="text-sm font-bold uppercase text-slate-800 border-b pb-2">
                      Patient Details (Auto-filled)
                    </h3>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase">
                        Patient Name & Number
                      </label>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">
                        {selectedPatient.name} ({selectedPatient.phone})
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase">
                        Registration & OPD Number
                      </label>
                      <div className="text-xs font-mono font-bold text-blue-600 mt-0.5">
                        {selectedPatient.regNumber} |{' '}
                        <span className="text-emerald-700">
                          {selectedPatient.opdNumber || 'OPD-001'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                        Consulting Doctor
                      </label>
                      <select
                        value={rxDoctor}
                        onChange={(e) => setRxDoctor(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-xs bg-white font-semibold text-slate-800"
                      >
                        {doctors.map((d) => (
                          <option
                            key={d.id}
                            value={`${d.prefix} ${d.name} ${
                              d.specialty.includes('MDS') ? 'MDS' : ''
                            }`}
                          >{`${d.prefix} ${d.name} (${d.specialty})`}</option>
                        ))}
                      </select>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                          Digital Signature
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {rxDoctor}
                        </span>
                      </div>
                      <img
                        src={
                          doctors.find(
                            (d) =>
                              `${d.prefix} ${d.name}` === rxDoctor ||
                              d.name === rxDoctor
                          )?.signatureUrl ||
                          'https://images.unsplash.com/photo-1594732891172-35a0925439a3?w=150'
                        }
                        alt="Signature"
                        className="w-20 h-8 object-contain border bg-white rounded p-0.5"
                      />
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => handlePrintPrescription(selectedPatient)}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md text-xs shadow-sm"
                      >
                        🖨️ Print Prescription
                      </button>
                      <button
                        onClick={() =>
                          handleSendWhatsAppReminder(
                            selectedPatient.name,
                            selectedPatient.phone,
                            '2026-10-04',
                            '10:00 AM',
                            rxDoctor,
                            activeBranch
                          )
                        }
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md text-xs shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <span>💬</span> Send Rx / Reminder via WhatsApp
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-2 bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                    <h3 className="text-sm font-bold uppercase text-slate-800 border-b pb-2">
                      Clinical Findings & Treatment Notes
                    </h3>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Chief Complaint
                      </label>
                      <input
                        type="text"
                        value={rxChiefComplaint}
                        onChange={(e) => setRxChiefComplaint(e.target.value)}
                        placeholder="e.g. Pain in lower right tooth"
                        className="w-full px-3 py-2 border rounded text-sm bg-white text-slate-800 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Diagnosis
                      </label>
                      <input
                        type="text"
                        value={rxDiagnosis}
                        onChange={(e) => setRxDiagnosis(e.target.value)}
                        placeholder="e.g. Irreversible Pulpitis"
                        className="w-full px-3 py-2 border rounded text-sm bg-white text-slate-800 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Treatment Planned
                      </label>
                      <input
                        type="text"
                        value={rxTreatmentPlanned}
                        onChange={(e) => setRxTreatmentPlanned(e.target.value)}
                        placeholder="e.g. Root Canal Treatment & Crown"
                        className="w-full px-3 py-2 border rounded text-sm bg-white text-slate-800 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Treatment Done
                      </label>
                      <textarea
                        rows={2}
                        value={rxTreatmentDone}
                        onChange={(e) => setRxTreatmentDone(e.target.value)}
                        placeholder="Procedures performed today..."
                        className="w-full px-3 py-2 border rounded text-sm bg-white text-slate-800 font-medium"
                      ></textarea>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-semibold text-slate-600 uppercase">
                          💊 Medications (Rx)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            list="medication-suggestions-list"
                            value={selectedMedToAdd}
                            onChange={(e) =>
                              setSelectedMedToAdd(e.target.value)
                            }
                            placeholder="Select or type medicine suggestion..."
                            className="px-2.5 py-1 border rounded text-xs bg-white w-52"
                          />
                          <button
                            type="button"
                            onClick={handleAddMedicationToRx}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700"
                          >
                            + Add Med
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {prescriptionMeds.map((med) => (
                          <div
                            key={med.id}
                            className="grid grid-cols-1 sm:grid-cols-5 gap-2 bg-white p-3 rounded border border-slate-200 items-center shadow-sm"
                          >
                            <div className="sm:col-span-1">
                              <label className="block text-[9px] font-semibold text-slate-400 uppercase">
                                Medication Name
                              </label>
                              <input
                                type="text"
                                value={med.drugName}
                                onChange={(e) =>
                                  handleRxMedChange(
                                    med.id,
                                    'drugName',
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 border rounded text-xs font-bold text-slate-800 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-semibold text-slate-400 uppercase">
                                Strength
                              </label>
                              <input
                                type="text"
                                value={med.dosage}
                                onChange={(e) =>
                                  handleRxMedChange(
                                    med.id,
                                    'dosage',
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 border rounded text-xs text-slate-800 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-semibold text-slate-400 uppercase">
                                Frequency
                              </label>
                              <input
                                type="text"
                                value={med.frequency}
                                onChange={(e) =>
                                  handleRxMedChange(
                                    med.id,
                                    'frequency',
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 border rounded text-xs text-slate-800 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-semibold text-slate-400 uppercase">
                                Duration (Days)
                              </label>
                              <input
                                type="text"
                                value={med.duration}
                                onChange={(e) =>
                                  handleRxMedChange(
                                    med.id,
                                    'duration',
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 border rounded text-xs font-bold text-blue-600 bg-white"
                              />
                            </div>
                            <div className="flex items-end justify-between sm:justify-end gap-2 pt-1 sm:pt-0">
                              <div className="flex-1 sm:flex-none">
                                <label className="block text-[9px] font-semibold text-slate-400 uppercase">
                                  Instructions
                                </label>
                                <input
                                  type="text"
                                  value={med.instructions}
                                  onChange={(e) =>
                                    handleRxMedChange(
                                      med.id,
                                      'instructions',
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border rounded text-xs text-slate-800 bg-white"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveMedFromRx(med.id)}
                                className="px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-bold self-center"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Additional Clinical Notes
                      </label>
                      <textarea
                        rows={2}
                        value={rxAdditionalNotes}
                        onChange={(e) => setRxAdditionalNotes(e.target.value)}
                        placeholder="Follow-up instructions..."
                        className="w-full px-3 py-2 border rounded text-sm bg-white text-slate-800 font-medium"
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {patientFileTab === 'info' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-2">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase">
                      Contact Information
                    </h4>
                    <p className="text-sm text-slate-800">
                      📞{' '}
                      <span className="font-medium">
                        {selectedPatient.phone}
                      </span>
                    </p>
                    <p className="text-sm text-slate-800">
                      ✉️{' '}
                      <span className="font-medium">
                        {selectedPatient.email}
                      </span>
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          handleSendWhatsAppBooking(
                            selectedPatient.name,
                            selectedPatient.phone,
                            '2026-10-04',
                            '10:00 AM',
                            rxDoctor,
                            selectedPatient.branch
                          )
                        }
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold"
                      >
                        💬 Booking
                      </button>
                      <button
                        onClick={() =>
                          handleSendWhatsAppReview(
                            selectedPatient.name,
                            selectedPatient.phone,
                            '2026-10-04',
                            '10:00 AM',
                            rxDoctor,
                            selectedPatient.branch
                          )
                        }
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-semibold"
                      >
                        ⭐ Review
                      </button>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-2">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase">
                      Residential Address
                    </h4>
                    <p className="text-sm text-slate-800">
                      🏠 {selectedPatient.address}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-2">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase">
                      Clinic Branch
                    </h4>
                    <p className="text-sm text-blue-600 font-semibold">
                      📍 {selectedPatient.branch}
                    </p>
                  </div>
                </div>
              )}

              {patientFileTab === 'timeline' && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-base font-semibold text-slate-800">
                    Patient Visit & Treatment Timeline
                  </h3>
                  <div className="border-l-2 border-blue-500 pl-4 space-y-6 ml-2">
                    <div className="relative">
                      <div className="absolute -left-[21px] top-0 w-3 h-3 bg-blue-600 rounded-full"></div>
                      <span className="text-xs font-mono text-blue-600 font-semibold">
                        September 15, 2026
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 mt-0.5">
                        Root Canal Treatment Initiated
                      </h4>
                      <p className="text-xs text-slate-600">
                        Performed access cavity preparation and placed temporary
                        filling. Handled by Dr. Nakul BK MDS.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {patientFileTab === 'invoice' && (
                <div className="mt-6 space-y-8">
                  {payingInvoice && (
                    <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl shadow-md">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-emerald-900">
                          Record Payment for Invoice:{' '}
                          <span className="font-mono">{payingInvoice.id}</span>{' '}
                          ({payingInvoice.patientName})
                        </h3>
                        <button
                          onClick={() => setPayingInvoice(null)}
                          className="text-slate-400 hover:text-slate-700 text-lg"
                        >
                          ✕
                        </button>
                      </div>
                      <form
                        onSubmit={handleInvoicePaymentSubmit}
                        className="grid grid-cols-1 sm:grid-cols-4 gap-4"
                      >
                        <div>
                          <label className="block text-xs font-semibold text-emerald-800 uppercase mb-1">
                            Total Due Amount
                          </label>
                          <input
                            type="text"
                            value={payingInvoice.totalAmount}
                            disabled
                            className="w-full px-3 py-2 border rounded-md text-sm bg-white font-bold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-emerald-800 uppercase mb-1">
                            Payment Mode
                          </label>
                          <select
                            value={invoicePaymentMode}
                            onChange={(e) =>
                              setInvoicePaymentMode(e.target.value)
                            }
                            className="w-full px-3 py-2 border rounded-md text-sm bg-white text-slate-800"
                          >
                            {paymentModes
                              .filter((m) => m.isActive)
                              .map((m) => (
                                <option key={m.id} value={m.name}>
                                  {m.name}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-emerald-800 uppercase mb-1">
                            Transaction ID / Ref No.
                          </label>
                          <input
                            type="text"
                            value={invoiceTransactionId}
                            onChange={(e) =>
                              setInvoiceTransactionId(e.target.value)
                            }
                            placeholder="e.g. UPI/2049182390"
                            className="w-full px-3 py-2 border rounded-md text-sm bg-white text-slate-800 font-mono"
                            required
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <button
                            type="submit"
                            className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md text-xs shadow-sm"
                          >
                            Confirm Payment
                          </button>
                          <button
                            type="button"
                            onClick={() => setPayingInvoice(null)}
                            className="px-3 py-2 bg-slate-200 text-slate-700 rounded-md text-xs font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-base font-bold text-slate-800 mb-4">
                      Create New Multi-Treatment Bill & Invoice for{' '}
                      {selectedPatient.name}
                    </h3>
                    <form
                      onSubmit={(e) =>
                        handleCreateMultiTreatmentInvoice(
                          e,
                          selectedPatient.name
                        )
                      }
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-600 uppercase">
                          Patient:{' '}
                          <strong className="text-blue-600">
                            {selectedPatient.name} ({selectedPatient.regNumber})
                          </strong>
                        </span>
                        <button
                          type="button"
                          onClick={handleAddLineItem}
                          className="py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-md border border-slate-300 shadow-sm"
                        >
                          + Add Treatment Row
                        </button>
                      </div>

                      <div className="space-y-3 pt-2">
                        {invoiceLineItems.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm"
                          >
                            <div className="flex-1 w-full">
                              <label className="block text-[10px] font-semibold text-slate-400 uppercase">
                                Treatment / Procedure
                              </label>
                              <select
                                value={item.treatmentName}
                                onChange={(e) =>
                                  handleLineItemChange(
                                    idx,
                                    'treatmentName',
                                    e.target.value
                                  )
                                }
                                className="w-full mt-0.5 px-3 py-1.5 border rounded text-xs bg-white text-slate-800"
                              >
                                {defaultTreatments.map((t) => (
                                  <option key={t.id} value={t.name}>
                                    {t.name} (₹{t.standardFee})
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="w-full sm:w-44">
                              <label className="block text-[10px] font-semibold text-slate-400 uppercase">
                                Treatment Date
                              </label>
                              <input
                                type="date"
                                value={item.date}
                                onChange={(e) =>
                                  handleLineItemChange(
                                    idx,
                                    'date',
                                    e.target.value
                                  )
                                }
                                className="w-full mt-0.5 px-3 py-1.5 border rounded text-xs bg-white text-slate-800"
                                required
                              />
                            </div>
                            <div className="w-full sm:w-36">
                              <label className="block text-[10px] font-semibold text-slate-400 uppercase">
                                Fee (₹)
                              </label>
                              <input
                                type="number"
                                value={item.amount}
                                onChange={(e) =>
                                  handleLineItemChange(
                                    idx,
                                    'amount',
                                    e.target.value
                                  )
                                }
                                className="w-full mt-0.5 px-3 py-1.5 border rounded text-xs bg-white text-slate-800 font-bold text-blue-600"
                                required
                              />
                            </div>
                            <div className="flex items-end pt-4 sm:pt-0">
                              {invoiceLineItems.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveLineItem(idx)}
                                  className="px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-bold"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 flex justify-end">
                        <button
                          type="submit"
                          className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-sm"
                        >
                          Generate Bill & Invoice
                        </button>
                      </div>
                    </form>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-slate-800 mb-4">
                      Patient Invoice Records
                    </h3>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                            <th className="p-3">Invoice ID</th>
                            <th className="p-3">Treatments & Dates</th>
                            <th className="p-3">Total Amount</th>
                            <th className="p-3">Status & Payment Info</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                          {invoices.filter(
                            (inv) =>
                              inv.patientName.toLowerCase() ===
                              selectedPatient.name.toLowerCase()
                          ).length > 0 ? (
                            invoices
                              .filter(
                                (inv) =>
                                  inv.patientName.toLowerCase() ===
                                  selectedPatient.name.toLowerCase()
                              )
                              .map((inv) => (
                                <tr key={inv.id}>
                                  <td className="p-3 font-mono font-semibold text-blue-600">
                                    {inv.id}
                                  </td>
                                  <td className="p-3">
                                    {inv.items.map((item, idx) => (
                                      <div key={idx} className="text-xs py-0.5">
                                        •{' '}
                                        <span className="font-semibold">
                                          {item.treatmentName}
                                        </span>{' '}
                                        ({item.date}) —{' '}
                                        <span className="text-slate-500">
                                          ₹{item.amount}
                                        </span>
                                      </div>
                                    ))}
                                  </td>
                                  <td className="p-3 font-bold text-slate-900">
                                    {inv.totalAmount}
                                  </td>
                                  <td className="p-3">
                                    <span
                                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                                        inv.status === 'Paid'
                                          ? 'bg-emerald-50 text-emerald-600'
                                          : 'bg-amber-50 text-amber-600'
                                      }`}
                                    >
                                      {inv.status}
                                    </span>
                                    {inv.paymentMode && (
                                      <span className="block text-[11px] text-slate-500 mt-0.5">
                                        {inv.paymentMode}
                                      </span>
                                    )}
                                    {inv.transactionId && (
                                      <span className="block font-mono text-[10px] text-blue-600">
                                        Txn: {inv.transactionId}
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-3 text-right space-x-1">
                                    <button
                                      onClick={() => handlePrintInvoice(inv)}
                                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
                                    >
                                      🖨 Print Bill
                                    </button>
                                    {inv.status === 'Pending' && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setPayingInvoice(inv);
                                        }}
                                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold cursor-pointer"
                                      >
                                        💳 Pay & Settle
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))
                          ) : (
                            <tr>
                              <td
                                colSpan={5}
                                className="p-6 text-center text-slate-400 text-sm"
                              >
                                No invoices found for {selectedPatient.name}.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {patientFileTab === 'receipt' && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-slate-800">
                      Payment Receipts
                    </h3>
                    <span className="text-xs text-slate-500">
                      Includes online transaction references & print bill
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                          <th className="p-3">Receipt ID</th>
                          <th className="p-3">Invoice Ref</th>
                          <th className="p-3">Amount Received</th>
                          <th className="p-3">Payment Mode & Txn ID</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                        {receipts.filter(
                          (r) =>
                            r.patientName.toLowerCase() ===
                            selectedPatient.name.toLowerCase()
                        ).length > 0 ? (
                          receipts
                            .filter(
                              (r) =>
                                r.patientName.toLowerCase() ===
                                selectedPatient.name.toLowerCase()
                            )
                            .map((rec) => (
                              <tr key={rec.id}>
                                <td className="p-3 font-mono font-semibold text-blue-600">
                                  {rec.id}
                                </td>
                                <td className="p-3 font-mono text-xs text-slate-600">
                                  {rec.invoiceId}
                                </td>
                                <td className="p-3 font-bold text-emerald-600">
                                  {rec.amount}
                                </td>
                                <td className="p-3 text-slate-600">
                                  <div>{rec.mode}</div>
                                  {rec.transactionId && (
                                    <div className="font-mono text-xs text-blue-600">
                                      Txn: {rec.transactionId}
                                    </div>
                                  )}
                                </td>
                                <td className="p-3 text-right">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handlePrintReceipt(rec);
                                    }}
                                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold shadow-sm cursor-pointer"
                                  >
                                    🖨️ Print Bill
                                  </button>
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="p-6 text-center text-slate-400 text-sm"
                            >
                              No payment receipts found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {patientFileTab === 'progress' && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-slate-800">
                      Clinical Progress Notes
                    </h3>
                    <button
                      onClick={() => setIsProgressModalOpen(true)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium shadow-sm hover:bg-blue-700"
                    >
                      + Add Progress Note
                    </button>
                  </div>

                  {isProgressModalOpen && (
                    <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <h4 className="text-sm font-bold text-slate-800 mb-2">
                        New Progress Note
                      </h4>
                      <form
                        onSubmit={handleAddProgressNote}
                        className="space-y-3"
                      >
                        <textarea
                          rows={3}
                          value={newProgressNoteText}
                          onChange={(e) =>
                            setNewProgressNoteText(e.target.value)
                          }
                          placeholder="Type clinical progress notes here..."
                          className="w-full px-3 py-2 border rounded text-sm bg-white"
                          required
                        ></textarea>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="px-4 py-1.5 bg-blue-600 text-white rounded text-xs font-medium"
                          >
                            Save Note
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsProgressModalOpen(false)}
                            className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="space-y-3">
                    {progressNotes.map((pn) => (
                      <div
                        key={pn.id}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                          <span className="font-semibold text-blue-600">
                            {pn.doctor}
                          </span>
                          <span>{pn.date}</span>
                        </div>
                        <p className="text-sm text-slate-800">{pn.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {patientFileTab === 'investigation' && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-slate-800">
                      Investigation & Lab Reports
                    </h3>
                    <button
                      onClick={() => setIsInvestModalOpen(true)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium shadow-sm hover:bg-blue-700"
                    >
                      + Add Investigation Report
                    </button>
                  </div>

                  {isInvestModalOpen && (
                    <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                      <h4 className="text-sm font-bold text-slate-800">
                        New Investigation Report
                      </h4>
                      <form
                        onSubmit={handleAddInvestigation}
                        className="space-y-3"
                      >
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 uppercase">
                            Test / Radiograph Name
                          </label>
                          <input
                            type="text"
                            value={newTestName}
                            onChange={(e) => setNewTestName(e.target.value)}
                            placeholder="e.g. OPG X-ray / CBCT scan"
                            className="w-full px-3 py-1.5 border rounded text-sm bg-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 uppercase">
                            Findings & Notes
                          </label>
                          <textarea
                            rows={2}
                            value={newTestFindings}
                            onChange={(e) => setNewTestFindings(e.target.value)}
                            placeholder="Radiographic or lab findings..."
                            className="w-full px-3 py-1.5 border rounded text-sm bg-white"
                          ></textarea>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="px-4 py-1.5 bg-blue-600 text-white rounded text-xs font-medium"
                          >
                            Save Report
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsInvestModalOpen(false)}
                            className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                          <th className="p-3">Test / Radiograph</th>
                          <th className="p-3">Findings</th>
                          <th className="p-3 text-right">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                        {investigations.map((inv) => (
                          <tr key={inv.id}>
                            <td className="p-3 font-semibold text-slate-900">
                              {inv.testName}
                            </td>
                            <td className="p-3 text-slate-600">
                              {inv.findings}
                            </td>
                            <td className="p-3 text-right text-slate-500">
                              {inv.date}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {patientFileTab === 'files' && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-slate-800">
                      Attached Patient Files & Documents
                    </h3>
                    <button
                      onClick={() => setIsFileModalOpen(true)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium shadow-sm hover:bg-blue-700"
                    >
                      + Upload File
                    </button>
                  </div>

                  {isFileModalOpen && (
                    <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                      <h4 className="text-sm font-bold text-slate-800">
                        Attach Document / Scan
                      </h4>
                      <form onSubmit={handleAddFile} className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 uppercase">
                            File Name
                          </label>
                          <input
                            type="text"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            placeholder="e.g. ConeBeamCT_Scan.pdf"
                            className="w-full px-3 py-1.5 border rounded text-sm bg-white"
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="px-4 py-1.5 bg-blue-600 text-white rounded text-xs font-medium"
                          >
                            Upload File
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsFileModalOpen(false)}
                            className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="space-y-2">
                    {attachedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">📄</span>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-800">
                              {file.fileName}
                            </h4>
                            <span className="text-xs text-slate-400">
                              Uploaded on {file.uploadDate} • {file.fileType}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => alert('Downloading file...')}
                          className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-medium hover:bg-slate-100"
                        >
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {patientFileTab === 'dentalChart' && (
                <div className="mt-6">
                  <h3 className="text-base font-semibold text-slate-800 mb-4">
                    Patient Odontogram Chart
                  </h3>
                  <div className="space-y-4 mb-6 overflow-x-auto pb-2 bg-slate-50 p-4 rounded-lg border">
                    <div className="min-w-[480px]">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Upper Arch
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {UPPER_RIGHT.map((num) => (
                          <button
                            key={num}
                            onClick={() => toggleTooth(num)}
                            className={`w-9 h-9 sm:w-10 sm:h-10 border rounded-md text-xs font-semibold transition-colors ${
                              selectedTeeth.includes(num)
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                        <span className="mx-2 self-center text-slate-300">
                          |
                        </span>
                        {UPPER_LEFT.map((num) => (
                          <button
                            key={num}
                            onClick={() => toggleTooth(num)}
                            className={`w-9 h-9 sm:w-10 sm:h-10 border rounded-md text-xs font-semibold transition-colors ${
                              selectedTeeth.includes(num)
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="min-w-[480px]">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Lower Arch
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {LOWER_RIGHT.map((num) => (
                          <button
                            key={num}
                            onClick={() => toggleTooth(num)}
                            className={`w-9 h-9 sm:w-10 sm:h-10 border rounded-md text-xs font-semibold transition-colors ${
                              selectedTeeth.includes(num)
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                        <span className="mx-2 self-center text-slate-300">
                          |
                        </span>
                        {LOWER_LEFT.map((num) => (
                          <button
                            key={num}
                            onClick={() => toggleTooth(num)}
                            className={`w-9 h-9 sm:w-10 sm:h-10 border rounded-md text-xs font-semibold transition-colors ${
                              selectedTeeth.includes(num)
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 font-medium bg-white p-4 rounded-lg border border-slate-200">
                    Marked Odontogram Teeth for {selectedPatient.name}:{' '}
                    <span className="text-blue-600 font-bold">
                      {selectedTeeth.join(', ') || 'None'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GLOBAL BILLING & INVOICES */}
          {activeTab === 'billing' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                  Billing & Multi-Treatment Invoices
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Branch: {activeBranch} — Generate multi-treatment bills,
                  record online card/UPI payments with transaction IDs, and
                  print bills.
                </p>
              </div>

              {payingInvoice && (
                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-emerald-900">
                      Record Payment for Invoice:{' '}
                      <span className="font-mono">{payingInvoice.id}</span> (
                      {payingInvoice.patientName})
                    </h3>
                    <button
                      onClick={() => setPayingInvoice(null)}
                      className="text-slate-400 hover:text-slate-700 text-lg"
                    >
                      ✕
                    </button>
                  </div>
                  <form
                    onSubmit={handleInvoicePaymentSubmit}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-4"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-emerald-800 uppercase mb-1">
                        Total Due Amount
                      </label>
                      <input
                        type="text"
                        value={payingInvoice.totalAmount}
                        disabled
                        className="w-full px-3 py-2 border rounded-md text-sm bg-white font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-emerald-800 uppercase mb-1">
                        Payment Mode
                      </label>
                      <select
                        value={invoicePaymentMode}
                        onChange={(e) => setInvoicePaymentMode(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm bg-white text-slate-800"
                      >
                        {paymentModes
                          .filter((m) => m.isActive)
                          .map((m) => (
                            <option key={m.id} value={m.name}>
                              {m.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-emerald-800 uppercase mb-1">
                        Transaction ID / Ref No.
                      </label>
                      <input
                        type="text"
                        value={invoiceTransactionId}
                        onChange={(e) =>
                          setInvoiceTransactionId(e.target.value)
                        }
                        placeholder="e.g. UPI/2049182390"
                        className="w-full px-3 py-2 border rounded-md text-sm bg-white text-slate-800 font-mono"
                        required
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md text-xs shadow-sm"
                      >
                        Confirm Payment
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayingInvoice(null)}
                        className="px-3 py-2 bg-slate-200 text-slate-700 rounded-md text-xs font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-base font-bold text-slate-800 mb-4">
                  Create New Multi-Treatment Bill & Invoice
                </h3>
                <form
                  onSubmit={(e) => handleCreateMultiTreatmentInvoice(e)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        Patient Name (Lookup)
                      </label>
                      <input
                        type="text"
                        list="patient-lookup-list"
                        value={newInvoicePatient}
                        onChange={(e) => setNewInvoicePatient(e.target.value)}
                        placeholder="Select or type patient name"
                        className="w-full px-3 py-2 border rounded-md text-sm text-slate-800"
                        required
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleAddLineItem}
                        className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-md border border-slate-300"
                      >
                        + Add Treatment Row
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-semibold text-slate-500 uppercase">
                      Treatment Procedure Entries & Dates
                    </label>
                    {invoiceLineItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200"
                      >
                        <div className="flex-1 w-full">
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase">
                            Treatment / Procedure
                          </label>
                          <select
                            value={item.treatmentName}
                            onChange={(e) =>
                              handleLineItemChange(
                                idx,
                                'treatmentName',
                                e.target.value
                              )
                            }
                            className="w-full mt-0.5 px-3 py-1.5 border rounded text-xs bg-white text-slate-800"
                          >
                            {defaultTreatments.map((t) => (
                              <option key={t.id} value={t.name}>
                                {t.name} (₹{t.standardFee})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="w-full sm:w-44">
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase">
                            Treatment Date
                          </label>
                          <input
                            type="date"
                            value={item.date}
                            onChange={(e) =>
                              handleLineItemChange(idx, 'date', e.target.value)
                            }
                            className="w-full mt-0.5 px-3 py-1.5 border rounded text-xs bg-white text-slate-800"
                            required
                          />
                        </div>
                        <div className="w-full sm:w-36">
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase">
                            Fee (₹)
                          </label>
                          <input
                            type="number"
                            value={item.amount}
                            onChange={(e) =>
                              handleLineItemChange(
                                idx,
                                'amount',
                                e.target.value
                              )
                            }
                            className="w-full mt-0.5 px-3 py-1.5 border rounded text-xs bg-white text-slate-800 font-bold text-blue-600"
                            required
                          />
                        </div>
                        <div className="flex items-end pt-4 sm:pt-0">
                          {invoiceLineItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveLineItem(idx)}
                              className="px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-bold"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="submit"
                      className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-sm"
                    >
                      Generate Bill & Invoice
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-800">
                    Generated Invoices & Bills
                  </h3>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                    {invoices.length} Invoices
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[750px]">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                        <th className="p-4">Invoice ID</th>
                        <th className="p-4">Patient Name</th>
                        <th className="p-4">Included Treatments & Dates</th>
                        <th className="p-4">Total Amount</th>
                        <th className="p-4">Status & Payment Info</th>
                        <th className="p-4 text-right">
                          Actions (Print / Pay)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                      {invoices.map((inv) => (
                        <tr
                          key={inv.id}
                          className="hover:bg-slate-50/60 align-top"
                        >
                          <td className="p-4 font-mono font-semibold text-blue-600">
                            {inv.id}
                          </td>
                          <td className="p-4 font-bold text-slate-900">
                            {inv.patientName}
                          </td>
                          <td className="p-4 space-y-1">
                            {inv.items.map((item, i) => (
                              <div
                                key={i}
                                className="text-xs bg-slate-50 p-1.5 rounded border border-slate-100 flex items-center justify-between"
                              >
                                <span>
                                  🦷{' '}
                                  <strong className="text-slate-800">
                                    {item.treatmentName}
                                  </strong>{' '}
                                  ({item.date})
                                </span>
                                <span className="font-semibold text-blue-600">
                                  ₹{item.amount}
                                </span>
                              </div>
                            ))}
                          </td>
                          <td className="p-4 font-bold text-slate-900">
                            {inv.totalAmount}
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                                inv.status === 'Paid'
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-600 border border-amber-200'
                              }`}
                            >
                              {inv.status}
                            </span>
                            {inv.paymentMode && (
                              <span className="block text-[11px] text-slate-600 mt-1">
                                {inv.paymentMode}
                              </span>
                            )}
                            {inv.transactionId && (
                              <span className="block font-mono text-[10px] text-blue-600 mt-0.5">
                                Txn: {inv.transactionId}
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right space-x-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePrintInvoice(inv);
                              }}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold shadow-sm cursor-pointer"
                            >
                              🖨 Print
                            </button>
                            {inv.status === 'Pending' && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setPayingInvoice(inv);
                                }}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-sm cursor-pointer"
                              >
                                💳 Pay & Settle
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLINIC SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                  Clinic Settings & Configuration
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Manage all system preferences, communication templates, print
                  formats, and customizable treatment fees.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setSettingsSubTab('messaging')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                    settingsSubTab === 'messaging'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  💬 SMS & WhatsApp Editing
                </button>
                <button
                  onClick={() => setSettingsSubTab('print')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                    settingsSubTab === 'print'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  🖨️ Print Settings (Rx, Bill & Invoice)
                </button>
                <button
                  onClick={() => setSettingsSubTab('admin')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                    settingsSubTab === 'admin'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  🔐 Admin Settings & Doctors
                </button>
                <button
                  onClick={() => setSettingsSubTab('treatment')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                    settingsSubTab === 'treatment'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  🦷 Treatment Plan Settings
                </button>
                <button
                  onClick={() => setSettingsSubTab('medications')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                    settingsSubTab === 'medications'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  💊 Medications & Suggestions
                </button>
                <button
                  onClick={() => setSettingsSubTab('payments')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                    settingsSubTab === 'payments'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  💳 Payment Modes Setup
                </button>
              </div>

              {settingsSubTab === 'messaging' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">
                      SMS & WhatsApp Message Templates
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Customize templates for automated patient triggers
                      including booking, reminders, and Google Review requests.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Appointment Booking Template
                      </label>
                      <textarea
                        rows={4}
                        value={bookingTemplate}
                        onChange={(e) => setBookingTemplate(e.target.value)}
                        className="w-full p-3 border rounded-md text-sm font-mono text-slate-800"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Appointment Reminder Template
                      </label>
                      <textarea
                        rows={4}
                        value={reminderTemplate}
                        onChange={(e) => setReminderTemplate(e.target.value)}
                        className="w-full p-3 border rounded-md text-sm font-mono text-slate-800"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        ⭐ Google Review Request Template
                      </label>
                      <textarea
                        rows={4}
                        value={reviewTemplate}
                        onChange={(e) => setReviewTemplate(e.target.value)}
                        className="w-full p-3 border rounded-md text-sm font-mono text-slate-800"
                      ></textarea>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setNotificationMsg(
                        '✅ Message templates and Google Review template saved successfully!'
                      );
                      setTimeout(() => setNotificationMsg(''), 4000);
                    }}
                    className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md text-xs shadow-sm"
                  >
                    Save Messaging Templates
                  </button>
                </div>
              )}

              {settingsSubTab === 'print' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">
                      Professional Print Layout Configuration & Styling
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Customize clinic name, font family, weight, text color,
                      logo, and footer details.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-50 p-4 rounded-lg border">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Clinic Logo (Prescriptions & Invoices)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const url = URL.createObjectURL(e.target.files[0]);
                            setClinicLogoUrl(url);
                            setNotificationMsg(
                              '🖼️ Clinic logo uploaded successfully!'
                            );
                            setTimeout(() => setNotificationMsg(''), 4000);
                          }
                        }}
                        className="w-full px-2 py-1.5 border rounded text-xs bg-white file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500">
                        Current Logo Preview:
                      </span>
                      {clinicLogoUrl ? (
                        <img
                          src={clinicLogoUrl}
                          alt="Clinic Logo"
                          className="w-14 h-14 object-contain border rounded bg-white p-1 shadow-sm"
                        />
                      ) : (
                        <span className="text-xs text-slate-400">
                          No logo uploaded
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg border">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Header Font Family
                      </label>
                      <select
                        value={clinicFontFamily}
                        onChange={(e) => setClinicFontFamily(e.target.value)}
                        className="w-full p-2 border rounded text-xs bg-white text-slate-800 font-medium"
                      >
                        <option value="'Inter', sans-serif">
                          Inter (Modern Sans)
                        </option>
                        <option value="'Roboto', sans-serif">Roboto</option>
                        <option value="'Poppins', sans-serif">Poppins</option>
                        <option value="'Playfair Display', serif">
                          Playfair Display (Serif)
                        </option>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="Georgia, serif">Georgia</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Font Weight (Bold / Normal)
                      </label>
                      <select
                        value={clinicFontWeight}
                        onChange={(e) => setClinicFontWeight(e.target.value)}
                        className="w-full p-2 border rounded text-xs bg-white text-slate-800 font-medium"
                      >
                        <option value="400">Normal (Regular)</option>
                        <option value="500">Medium</option>
                        <option value="600">Semi-Bold</option>
                        <option value="700">Bold</option>
                        <option value="900">Black / Extra Bold</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Header Font Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={clinicFontColor}
                          onChange={(e) => setClinicFontColor(e.target.value)}
                          className="w-10 h-8 border rounded cursor-pointer bg-white p-0.5"
                        />
                        <input
                          type="text"
                          value={clinicFontColor}
                          onChange={(e) => setClinicFontColor(e.target.value)}
                          className="w-full p-2 border rounded text-xs font-mono text-slate-800 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Clinic Name Header Text
                      </label>
                      <input
                        type="text"
                        value={rxHeaderTitle}
                        onChange={(e) => setRxHeaderTitle(e.target.value)}
                        className="w-full p-2.5 border rounded-md text-sm text-slate-800 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Consulting Doctor & Credentials
                      </label>
                      <input
                        type="text"
                        value={rxDoctorName}
                        onChange={(e) => setRxDoctorName(e.target.value)}
                        className="w-full p-2.5 border rounded-md text-sm text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Contact Phone Numbers
                      </label>
                      <input
                        type="text"
                        value={rxContactNumber}
                        onChange={(e) => setRxContactNumber(e.target.value)}
                        className="w-full p-2.5 border rounded-md text-sm text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                        Footer Secondary Branch Details & Notes
                      </label>
                      <input
                        type="text"
                        value={rxFooterSecondaryBranch}
                        onChange={(e) =>
                          setRxFooterSecondaryBranch(e.target.value)
                        }
                        className="w-full p-2.5 border rounded-md text-sm text-slate-800"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setNotificationMsg(
                        '✅ Print layout, font styles, and logo settings saved successfully!'
                      );
                      setTimeout(() => setNotificationMsg(''), 4000);
                    }}
                    className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-xs shadow-sm"
                  >
                    Save Print Layout Settings
                  </button>
                </div>
              )}

              {settingsSubTab === 'admin' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">
                        Admin Controls & Doctor Directory
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Add new doctors, assign badge colors, and upload digital
                        signatures.
                      </p>
                    </div>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-semibold">
                      {doctors.length} Doctors
                    </span>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                    <h4 className="text-xs font-bold uppercase text-slate-700 mb-3">
                      Add New Doctor Profile, Badge Color & Digital Signature
                    </h4>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newDocName || !newDocSpecialty) return;

                        const photoUrl = newDocPhotoFile
                          ? URL.createObjectURL(newDocPhotoFile)
                          : 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150';
                        const signatureUrl = newDocSignatureFile
                          ? URL.createObjectURL(newDocSignatureFile)
                          : 'https://images.unsplash.com/photo-1594732891172-35a0925439a3?w=150';

                        const newDoctorObj: Doctor = {
                          id: 'doc-' + Date.now(),
                          prefix: newDocPrefix || 'Dr.',
                          name: newDocName,
                          specialty: newDocSpecialty,
                          phone: newDocPhone || '9620100245',
                          email: newDocEmail || 'doctor@thedentist.co.in',
                          regNumber: newDocRegNumber || 'KSDC-99999',
                          bio: newDocBio || 'Specialist Consultant',
                          badgeColor: newDocBadgeColor || '#2563eb',
                          photoUrl,
                          signatureUrl,
                        };

                        setDoctors([...doctors, newDoctorObj]);
                        setNewDocName('');
                        setNewDocSpecialty('');
                        setNewDocPhone('');
                        setNewDocEmail('');
                        setNewDocRegNumber('');
                        setNewDocBio('');
                        setNewDocBadgeColor('#0d9488');
                        setNewDocPhotoFile(null);
                        setNewDocSignatureFile(null);
                        setNotificationMsg(
                          `Successfully added doctor: ${newDoctorObj.prefix} ${newDoctorObj.name}!`
                        );
                        setTimeout(() => setNotificationMsg(''), 4000);
                      }}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                    >
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                          Prefix & Name
                        </label>
                        <div className="flex gap-2 mt-1">
                          <select
                            value={newDocPrefix}
                            onChange={(e) => setNewDocPrefix(e.target.value)}
                            className="px-2 py-1.5 border rounded text-xs bg-white text-slate-800"
                          >
                            <option value="Dr.">Dr.</option>
                            <option value="Prof. Dr.">Prof. Dr.</option>
                          </select>
                          <input
                            type="text"
                            value={newDocName}
                            onChange={(e) => setNewDocName(e.target.value)}
                            placeholder="e.g. Rahul Verma"
                            className="w-full px-3 py-1.5 border rounded text-xs bg-white text-slate-800 font-semibold"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                          Specialty & Degree
                        </label>
                        <input
                          type="text"
                          value={newDocSpecialty}
                          onChange={(e) => setNewDocSpecialty(e.target.value)}
                          placeholder="e.g. Orthodontics (MDS)"
                          className="w-full mt-1 px-3 py-1.5 border rounded text-xs bg-white text-slate-800"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                          Doctor Badge Color
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="color"
                            value={newDocBadgeColor}
                            onChange={(e) =>
                              setNewDocBadgeColor(e.target.value)
                            }
                            className="w-10 h-8 border rounded cursor-pointer bg-white p-0.5"
                          />
                          <input
                            type="text"
                            value={newDocBadgeColor}
                            onChange={(e) =>
                              setNewDocBadgeColor(e.target.value)
                            }
                            className="w-full px-2 py-1.5 border rounded text-xs font-mono text-slate-800 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                          KSDC Registration Number
                        </label>
                        <input
                          type="text"
                          value={newDocRegNumber}
                          onChange={(e) => setNewDocRegNumber(e.target.value)}
                          placeholder="e.g. KSDC-44556"
                          className="w-full mt-1 px-3 py-1.5 border rounded text-xs bg-white text-slate-800 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={newDocPhone}
                          onChange={(e) => setNewDocPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full mt-1 px-3 py-1.5 border rounded text-xs bg-white text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={newDocEmail}
                          onChange={(e) => setNewDocEmail(e.target.value)}
                          placeholder="doctor@thedentist.co.in"
                          className="w-full mt-1 px-3 py-1.5 border rounded text-xs bg-white text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                          Upload Profile Photo
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            e.target.files &&
                            setNewDocPhotoFile(e.target.files[0])
                          }
                          className="w-full mt-1 px-2 py-1 border rounded text-xs bg-white text-slate-700 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                          Upload Digital Signature (for Prescription Pad)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            e.target.files &&
                            setNewDocSignatureFile(e.target.files[0])
                          }
                          className="w-full mt-1 px-2 py-1 border rounded text-xs bg-white text-slate-700 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-xs shadow-sm"
                        >
                          + Save Doctor Profile
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {doctors.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={doc.photoUrl}
                            alt={doc.name}
                            className="w-14 h-14 object-cover rounded-full border shadow-sm"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900">
                                {doc.prefix} {doc.name}
                              </h4>
                              <span
                                className="w-3 h-3 rounded-full inline-block border shadow-sm"
                                style={{
                                  backgroundColor: doc.badgeColor || '#2563eb',
                                }}
                                title="Assigned Doctor Badge Color"
                              ></span>
                            </div>
                            <span className="text-xs text-blue-600 font-medium block">
                              {doc.specialty}
                            </span>
                            <span className="text-xs text-slate-500 block">
                              Reg: {doc.regNumber} • Ph: {doc.phone}
                            </span>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-[10px] text-slate-400 font-semibold uppercase">
                                Badge Color:
                              </span>
                              <input
                                type="color"
                                value={doc.badgeColor || '#2563eb'}
                                onChange={(e) => {
                                  const newColor = e.target.value;
                                  setDoctors(
                                    doctors.map((d) =>
                                      d.id === doc.id
                                        ? { ...d, badgeColor: newColor }
                                        : d
                                    )
                                  );
                                }}
                                className="w-8 h-6 border rounded cursor-pointer bg-white p-0.5"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end pt-2 border-t border-slate-200">
                          <button
                            onClick={() =>
                              setDoctors(doctors.filter((d) => d.id !== doc.id))
                            }
                            className="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-bold"
                          >
                            Remove Doctor
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {settingsSubTab === 'treatment' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">
                        Manage Treatment Options & Default Standard Pricing
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Add new dental procedures or update standard fees.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="text-xs font-bold uppercase text-slate-700 mb-3">
                      Add New Treatment Procedure
                    </h4>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newTreatmentNameInput || !newTreatmentFeeInput)
                          return;
                        const newT = {
                          id: 't-' + Date.now(),
                          name: newTreatmentNameInput,
                          standardFee: newTreatmentFeeInput,
                        };
                        setDefaultTreatments([...defaultTreatments, newT]);
                        setNewTreatmentNameInput('');
                        setNewTreatmentFeeInput('');
                        setNotificationMsg(
                          `Successfully added new treatment: ${newT.name}`
                        );
                        setTimeout(() => setNotificationMsg(''), 4000);
                      }}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                    >
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                          Treatment Name
                        </label>
                        <input
                          type="text"
                          value={newTreatmentNameInput}
                          onChange={(e) =>
                            setNewTreatmentNameInput(e.target.value)
                          }
                          placeholder="e.g. Teeth Whitening"
                          className="w-full mt-1 px-3 py-1.5 border rounded text-xs bg-white text-slate-800"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                          Standard Fee (₹)
                        </label>
                        <input
                          type="number"
                          value={newTreatmentFeeInput}
                          onChange={(e) =>
                            setNewTreatmentFeeInput(e.target.value)
                          }
                          placeholder="e.g. 5000"
                          className="w-full mt-1 px-3 py-1.5 border rounded text-xs bg-white text-slate-800 font-bold"
                          required
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="w-full py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-xs shadow-sm"
                        >
                          + Add Treatment
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                          <th className="p-3">Treatment / Procedure Name</th>
                          <th className="p-3">Standard Fee (₹)</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                        {defaultTreatments.map((t) => (
                          <tr key={t.id}>
                            <td className="p-3 font-semibold text-slate-900">
                              {t.name}
                            </td>
                            <td className="p-3">
                              <input
                                type="text"
                                value={t.standardFee}
                                onChange={(e) => {
                                  const updatedFees = defaultTreatments.map(
                                    (item) =>
                                      item.id === t.id
                                        ? {
                                            ...item,
                                            standardFee: e.target.value,
                                          }
                                        : item
                                  );
                                  setDefaultTreatments(updatedFees);
                                }}
                                className="w-28 px-2 py-1 border rounded text-xs font-bold text-blue-600 bg-white"
                              />
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() =>
                                  setDefaultTreatments(
                                    defaultTreatments.filter(
                                      (item) => item.id !== t.id
                                    )
                                  )
                                }
                                className="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-bold"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {settingsSubTab === 'medications' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">
                      Manage Medication Suggestions & Defaults
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Add frequently prescribed dental medicines, default
                      dosages, frequency, and duration to quick-suggest during
                      prescriptions.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="text-xs font-bold uppercase text-slate-700 mb-3">
                      Add New Medication Suggestion
                    </h4>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newMedName) return;
                        const newMedObj = {
                          id: 'med-' + Date.now(),
                          name: newMedName,
                          defaultStrength: newMedStrength || '500 mg',
                          defaultFrequency: newMedFreq || '1 - 0 - 1',
                          defaultDuration: newMedDur || '5 Days',
                        };
                        setClinicMedications([...clinicMedications, newMedObj]);
                        setNewMedName('');
                        setNewMedStrength('');
                        setNewMedFreq('');
                        setNewMedDur('');
                        setNotificationMsg(
                          `Successfully added medication: ${newMedObj.name}`
                        );
                        setTimeout(() => setNotificationMsg(''), 4000);
                      }}
                      className="grid grid-cols-1 sm:grid-cols-5 gap-3"
                    >
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                          Medicine Name
                        </label>
                        <input
                          type="text"
                          value={newMedName}
                          onChange={(e) => setNewMedName(e.target.value)}
                          placeholder="e.g. Tab. Amoxicillin"
                          className="w-full mt-1 px-3 py-1.5 border rounded text-xs bg-white text-slate-800 font-semibold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                          Strength
                        </label>
                        <input
                          type="text"
                          value={newMedStrength}
                          onChange={(e) => setNewMedStrength(e.target.value)}
                          placeholder="e.g. 500 mg"
                          className="w-full mt-1 px-3 py-1.5 border rounded text-xs bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                          Default Frequency
                        </label>
                        <input
                          type="text"
                          value={newMedFreq}
                          onChange={(e) => setNewMedFreq(e.target.value)}
                          placeholder="e.g. 1 - 0 - 1"
                          className="w-full mt-1 px-3 py-1.5 border rounded text-xs bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                          Default Duration
                        </label>
                        <input
                          type="text"
                          value={newMedDur}
                          onChange={(e) => setNewMedDur(e.target.value)}
                          placeholder="e.g. 5 Days"
                          className="w-full mt-1 px-3 py-1.5 border rounded text-xs bg-white text-slate-800 font-bold"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="w-full py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-xs shadow-sm"
                        >
                          + Add Medicine
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                          <th className="p-3">Medicine Name</th>
                          <th className="p-3">Strength</th>
                          <th className="p-3">Frequency</th>
                          <th className="p-3">Duration</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                        {clinicMedications.map((m) => (
                          <tr key={m.id}>
                            <td className="p-3 font-semibold text-slate-900">
                              {m.name}
                            </td>
                            <td className="p-3 text-slate-600">
                              {m.defaultStrength}
                            </td>
                            <td className="p-3 text-slate-600">
                              {m.defaultFrequency}
                            </td>
                            <td className="p-3 font-bold text-blue-600">
                              {m.defaultDuration}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() =>
                                  setClinicMedications(
                                    clinicMedications.filter(
                                      (item) => item.id !== m.id
                                    )
                                  )
                                }
                                className="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-bold"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {settingsSubTab === 'payments' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">
                      Manage Payment Modes & Gateways
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Add custom payment options or UPI handles for billing.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="text-xs font-bold uppercase text-slate-700 mb-3">
                      Add New Payment Mode
                    </h4>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newPaymentModeName) return;
                        const newPm = {
                          id: 'pm-' + Date.now(),
                          name: newPaymentModeName,
                          details:
                            newPaymentModeDetails || 'Custom payment method',
                          isActive: true,
                        };
                        setPaymentModes([...paymentModes, newPm]);
                        setNewPaymentModeName('');
                        setNewPaymentModeDetails('');
                        setNotificationMsg(
                          `Successfully added payment mode: ${newPm.name}`
                        );
                        setTimeout(() => setNotificationMsg(''), 4000);
                      }}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                    >
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                          Payment Mode Name
                        </label>
                        <input
                          type="text"
                          value={newPaymentModeName}
                          onChange={(e) =>
                            setNewPaymentModeName(e.target.value)
                          }
                          placeholder="e.g. PhonePe / Paytm UPI"
                          className="w-full mt-1 px-3 py-1.5 border rounded text-xs bg-white text-slate-800"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                          Account / UPI Details
                        </label>
                        <input
                          type="text"
                          value={newPaymentModeDetails}
                          onChange={(e) =>
                            setNewPaymentModeDetails(e.target.value)
                          }
                          placeholder="e.g. 9620100245@ybl"
                          className="w-full mt-1 px-3 py-1.5 border rounded text-xs bg-white text-slate-800 font-mono"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="w-full py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-xs shadow-sm"
                        >
                          + Add Payment Mode
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                          <th className="p-3">Payment Mode</th>
                          <th className="p-3">Account / UPI Details</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                        {paymentModes.map((pm) => (
                          <tr key={pm.id}>
                            <td className="p-3 font-semibold text-slate-900">
                              {pm.name}
                            </td>
                            <td className="p-3 font-mono text-xs text-slate-600">
                              {pm.details}
                            </td>
                            <td className="p-3">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                                  pm.isActive
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {pm.isActive ? 'Active' : 'Disabled'}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setPaymentModes(
                                    paymentModes.map((m) =>
                                      m.id === pm.id
                                        ? { ...m, isActive: !m.isActive }
                                        : m
                                    )
                                  );
                                }}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
                              >
                                {pm.isActive ? 'Disable' : 'Enable'}
                              </button>
                              <button
                                onClick={() =>
                                  setPaymentModes(
                                    paymentModes.filter((m) => m.id !== pm.id)
                                  )
                                }
                                className="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-bold"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
