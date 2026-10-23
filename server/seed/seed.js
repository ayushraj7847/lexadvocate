const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User');
const AdvocateProfile = require('../src/models/AdvocateProfile');
const ConsultationBooking = require('../src/models/ConsultationBooking');
const Case = require('../src/models/Case');
const Review = require('../src/models/Review');
const CaseDocument = require('../src/models/CaseDocument');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lexadvocate';

const advocateSeedData = [
  {
    user: {
      name: 'Adv. Priya Sharma',
      email: 'priya.sharma@lexadvocate.com',
      password: 'Password123!',
      role: 'advocate',
      phone: '+91 98112 34567',
    },
    profile: {
      barCouncilNumber: 'D/1428/2012',
      designation: 'Senior High Court Advocate',
      bio: 'Senior criminal defense advocate with 14+ years of courtroom experience in the Delhi High Court and Supreme Court. Specialized in white-collar crimes, bail jurisprudence, and complex economic litigation.',
      practiceAreas: ['Criminal Law', 'Civil Law', 'Constitutional Law'],
      experience: 14,
      education: [
        { degree: 'B.A. LL.B. (Hons)', institution: 'National Law School of India University, Bengaluru', year: 2010 },
        { degree: 'LL.M. in Criminal Jurisprudence', institution: 'University of Delhi', year: 2012 }
      ],
      languages: ['English', 'Hindi', 'Punjabi'],
      location: { city: 'New Delhi', state: 'Delhi', country: 'India' },
      consultationFee: 1500,
      consultationTypes: ['audio', 'video', 'in-person'],
      rating: 4.9,
      totalReviews: 124,
      totalCases: 380,
      court: 'Delhi High Court',
      isProfileComplete: true,
      isVerified: true,
      availability: [
        { day: 'Monday', startTime: '10:00', endTime: '18:00', isAvailable: true },
        { day: 'Tuesday', startTime: '10:00', endTime: '18:00', isAvailable: true },
        { day: 'Wednesday', startTime: '10:00', endTime: '18:00', isAvailable: true },
        { day: 'Thursday', startTime: '10:00', endTime: '18:00', isAvailable: true },
        { day: 'Friday', startTime: '10:00', endTime: '18:00', isAvailable: true },
      ],
    }
  },
  {
    user: {
      name: 'Adv. Vikramaditya Singhania',
      email: 'vikram.singhania@lexadvocate.com',
      password: 'Password123!',
      role: 'advocate',
      phone: '+91 98200 45678',
    },
    profile: {
      barCouncilNumber: 'MAH/2045/2008',
      designation: 'Corporate Law Partner',
      bio: 'Specialized corporate and commercial law practitioner advising Fortune 500 enterprises, tech startups, and PE funds on cross-border M&A, regulatory compliance, and arbitration.',
      practiceAreas: ['Corporate Law', 'Intellectual Property', 'Tax Law'],
      experience: 16,
      education: [
        { degree: 'LL.B.', institution: 'Government Law College, Mumbai', year: 2008 },
        { degree: 'LL.M. in Corporate Law', institution: 'London School of Economics', year: 2010 }
      ],
      languages: ['English', 'Hindi', 'Gujarati', 'Marathi'],
      location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
      consultationFee: 2500,
      consultationTypes: ['video', 'audio', 'in-person'],
      rating: 4.8,
      totalReviews: 98,
      totalCases: 290,
      court: 'Bombay High Court & NCLT',
      isProfileComplete: true,
      isVerified: true,
      availability: [
        { day: 'Monday', startTime: '11:00', endTime: '19:00', isAvailable: true },
        { day: 'Wednesday', startTime: '11:00', endTime: '19:00', isAvailable: true },
        { day: 'Friday', startTime: '11:00', endTime: '19:00', isAvailable: true },
      ],
    }
  },
  {
    user: {
      name: 'Adv. Meenakshi Sundaram',
      email: 'meenakshi.s@lexadvocate.com',
      password: 'Password123!',
      role: 'advocate',
      phone: '+91 94440 12389',
    },
    profile: {
      barCouncilNumber: 'TN/892/2015',
      designation: 'Family & Matrimonial Advocate',
      bio: 'Dedicated family law advocate with deep empathy and proven dispute resolution skills. Handling mutual and contested divorces, child custody, alimony, and domestic violence protections.',
      practiceAreas: ['Family Law', 'Civil Law'],
      experience: 9,
      education: [
        { degree: 'B.Com B.L. (Hons)', institution: 'Tamil Nadu Dr. Ambedkar Law University', year: 2015 }
      ],
      languages: ['English', 'Tamil', 'Malayalam'],
      location: { city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
      consultationFee: 1200,
      consultationTypes: ['video', 'audio', 'in-person'],
      rating: 4.9,
      totalReviews: 142,
      totalCases: 215,
      court: 'Madras High Court & Family Courts',
      isProfileComplete: true,
      isVerified: true,
      availability: [
        { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
        { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
        { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
        { day: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      ],
    }
  },
  {
    user: {
      name: 'Adv. Rajeshwar Deshmukh',
      email: 'rajeshwar.d@lexadvocate.com',
      password: 'Password123!',
      role: 'advocate',
      phone: '+91 97654 32190',
    },
    profile: {
      barCouncilNumber: 'KAR/3421/2013',
      designation: 'Property & Real Estate Specialist',
      bio: 'Expert in real estate title verification, builder disputes under RERA, agricultural land acquisitions, and partition suits. Providing clear, litigation-proof property due diligence.',
      practiceAreas: ['Property Law', 'Consumer Law', 'Civil Law'],
      experience: 11,
      education: [
        { degree: 'B.A. LL.B.', institution: 'ILS Law College, Pune', year: 2013 }
      ],
      languages: ['English', 'Kannada', 'Hindi', 'Marathi'],
      location: { city: 'Bengaluru', state: 'Karnataka', country: 'India' },
      consultationFee: 1800,
      consultationTypes: ['audio', 'video', 'in-person'],
      rating: 4.7,
      totalReviews: 88,
      totalCases: 310,
      court: 'Karnataka High Court & RERA Tribunal',
      isProfileComplete: true,
      isVerified: true,
      availability: [
        { day: 'Monday', startTime: '10:00', endTime: '18:00', isAvailable: true },
        { day: 'Wednesday', startTime: '10:00', endTime: '18:00', isAvailable: true },
        { day: 'Saturday', startTime: '10:00', endTime: '14:00', isAvailable: true },
      ],
    }
  },
  {
    user: {
      name: 'Adv. Ananya Roy',
      email: 'ananya.roy@lexadvocate.com',
      password: 'Password123!',
      role: 'advocate',
      phone: '+91 98301 98765',
    },
    profile: {
      barCouncilNumber: 'WB/154/2016',
      designation: 'Consumer Rights & Civil Advocate',
      bio: 'Championing consumer fairness against medical negligence, banking fraud, telecom malpractice, and insurance claim denials in State and National Consumer Commissions.',
      practiceAreas: ['Consumer Law', 'Civil Law', 'Labour Law'],
      experience: 8,
      education: [
        { degree: 'B.Sc. LL.B.', institution: 'NUJS Kolkata', year: 2016 }
      ],
      languages: ['English', 'Bengali', 'Hindi'],
      location: { city: 'Kolkata', state: 'West Bengal', country: 'India' },
      consultationFee: 1000,
      consultationTypes: ['video', 'audio'],
      rating: 4.8,
      totalReviews: 76,
      totalCases: 195,
      court: 'Calcutta High Court & NCDRC',
      isProfileComplete: true,
      isVerified: true,
      availability: [
        { day: 'Tuesday', startTime: '10:00', endTime: '18:00', isAvailable: true },
        { day: 'Thursday', startTime: '10:00', endTime: '18:00', isAvailable: true },
        { day: 'Saturday', startTime: '11:00', endTime: '16:00', isAvailable: true },
      ],
    }
  },
  {
    user: {
      name: 'Rohit kumar',
      email: 'rohit@lexadvocate.com',
      password: 'Password123!',
      role: 'advocate',
      phone: '+91 9419478541',
    },
    profile: {
      barCouncilNumber: 'UP/6712/2011',
      designation: 'Constitutional & Criminal Litigator',
      bio: 'Distinguished litigator focusing on fundamental rights enforcement, writ petitions under Article 226/32, appellate criminal matters, and preventive detention challenges.',
      practiceAreas: ['Constitutional Law', 'Criminal Law', 'Labour Law'],
      experience: 13,
      education: [
        { degree: 'B.A. LL.B. (Hons)', institution: 'Aligarh Muslim University', year: 2011 },
        { degree: 'LL.M.', institution: 'National Law University, Delhi', year: 2013 }
      ],
      languages: ['English', 'Hindi', 'Urdu'],
      location: { city: 'Lucknow', state: 'Uttar Pradesh', country: 'India' },
      consultationFee: 1400,
      consultationTypes: ['video', 'audio', 'in-person'],
      rating: 4.6,
      totalReviews: 61,
      totalCases: 240,
      court: 'Allahabad High Court (Lucknow Bench)',
      isProfileComplete: true,
      isVerified: true,
      availability: [
        { day: 'Monday', startTime: '10:00', endTime: '17:00', isAvailable: true },
        { day: 'Wednesday', startTime: '10:00', endTime: '17:00', isAvailable: true },
        { day: 'Friday', startTime: '10:00', endTime: '17:00', isAvailable: true },
      ],
    }
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    // Clear previous seed data
    await User.deleteMany({});
    await AdvocateProfile.deleteMany({});
    await ConsultationBooking.deleteMany({});
    await Case.deleteMany({});
    await Review.deleteMany({});
    await CaseDocument.deleteMany({});
    console.log('Cleaned up previous database collections.');

    // 1. Create Demo Clients
    const clientUser1 = await User.create({
      name: 'Rohan Verma',
      email: 'client@lexadvocate.com',
      password: 'Password123!',
      role: 'client',
      phone: '+91 99887 76655',
      isVerified: true,
    });

    const clientUser2 = await User.create({
      name: 'Sunita Mehra',
      email: 'sunita.mehra@example.com',
      password: 'Password123!',
      role: 'client',
      phone: '+91 91234 56780',
      isVerified: true,
    });

    console.log(`Created 2 demo clients (Primary client login: client@lexadvocate.com / Password123!)`);

    // 2. Create Advocates & Profiles
    const createdAdvocates = [];
    for (const item of advocateSeedData) {
      const user = await User.create(item.user);
      const profile = await AdvocateProfile.create({
        ...item.profile,
        user: user._id,
      });
      createdAdvocates.push({ user, profile });
      console.log(`Created advocate: ${user.name} (${user.email})`);
    }

    // 3. Create sample Bookings
    const adv1 = createdAdvocates[0]; // Priya Sharma
    const adv2 = createdAdvocates[1]; // Vikram Singhania

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);

    const booking1 = await ConsultationBooking.create({
      client: clientUser1._id,
      advocate: adv1.user._id,
      advocateProfile: adv1.profile._id,
      consultationDate: tomorrow,
      timeSlot: '11:00 - 11:30 AM',
      consultationType: 'video',
      issueDescription: 'Need urgent consultation regarding anticipatory bail in a commercial supplier dispute.',
      practiceArea: 'Criminal Law',
      status: 'confirmed',
      amount: adv1.profile.consultationFee,
      paymentStatus: 'paid',
      meetingLink: 'https://meet.google.com/lex-adv-demo',
      bookingReference: 'BK-2026-CRIM-001',
    });

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5);

    const booking2 = await ConsultationBooking.create({
      client: clientUser1._id,
      advocate: adv2.user._id,
      advocateProfile: adv2.profile._id,
      consultationDate: pastDate,
      timeSlot: '03:00 - 03:30 PM',
      consultationType: 'audio',
      issueDescription: 'Review of software SaaS licensing agreement and indemnity clauses.',
      practiceArea: 'Corporate Law',
      status: 'completed',
      amount: adv2.profile.consultationFee,
      paymentStatus: 'paid',
      bookingReference: 'BK-2026-CORP-002',
    });

    console.log('Created sample consultation bookings.');

    // 4. Create sample Case Records
    const case1 = await Case.create({
      caseReference: 'CASE-2026-DL-8841',
      title: 'Verma vs. Apex Logistics Infra Pvt Ltd',
      caseType: 'Criminal Law',
      client: clientUser1._id,
      advocate: adv1.user._id,
      booking: booking1._id,
      courtName: 'Tis Hazari District Court, Courtroom 4',
      courtLocation: 'Delhi',
      filingDate: new Date('2026-08-14'),
      nextHearingDate: new Date('2026-11-12'),
      status: 'active',
      description: 'Anticipatory bail petition and defense against criminal breach of trust allegations.',
      notes: 'Initial notice challenged; waiting for verification report from IO on the next hearing date.',
      progressTimeline: [
        {
          stage: 'Case Filed',
          description: 'Formal bail petition drafted and registered with the filing counter.',
          date: new Date('2026-08-14'),
          updatedBy: adv1.user._id,
        },
        {
          stage: 'Documents Verified',
          description: 'Bank statements and transaction receipts submitted and verified by counsel.',
          date: new Date('2026-08-20'),
          updatedBy: adv1.user._id,
        },
        {
          stage: 'Hearing Scheduled',
          description: 'Notice issued to respondent; hearing fixed before the Sessions Judge.',
          date: new Date('2026-09-05'),
          updatedBy: adv1.user._id,
        },
      ],
    });

    const case2 = await Case.create({
      caseReference: 'CASE-2026-MH-4120',
      title: 'NexGen Technologies Founders Shareholders Agreement',
      caseType: 'Corporate Law',
      client: clientUser1._id,
      advocate: adv2.user._id,
      booking: booking2._id,
      courtName: 'High Court Arbitration Bench',
      courtLocation: 'Mumbai',
      filingDate: new Date('2026-05-10'),
      nextHearingDate: new Date('2026-12-01'),
      status: 'active',
      description: 'Resolution of minority shareholder rights and valuation impasse under Section 9.',
      notes: 'Arbitrator appointed; initial preliminary conference concluded.',
      progressTimeline: [
        {
          stage: 'Case Filed',
          description: 'Application for interim protective orders submitted.',
          date: new Date('2026-05-10'),
          updatedBy: adv2.user._id,
        },
        {
          stage: 'Hearing Completed',
          description: 'Interim status quo granted on share transfer pending arbitration award.',
          date: new Date('2026-06-18'),
          updatedBy: adv2.user._id,
        },
      ],
    });

    console.log('Created sample cases with progress timelines.');

    // 5. Create Reviews
    await Review.create({
      client: clientUser1._id,
      advocate: adv2.user._id,
      advocateProfile: adv2.profile._id,
      booking: booking2._id,
      rating: 5,
      comment: 'Advocate Vikramaditya is exceptional. He pinpointed dangerous liability clauses in our contracts in 20 minutes.',
      isVerified: true,
    });

    await Review.create({
      client: clientUser2._id,
      advocate: adv1.user._id,
      advocateProfile: adv1.profile._id,
      rating: 5,
      comment: 'Adv. Priya Sharma has a commanding presence and gave us clear legal strategy for our bail petition. Highly recommended!',
      isVerified: true,
    });

    console.log('Created sample verified reviews.');

    console.log('\n======================================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('Default Client Credentials:');
    console.log('  Email:    client@lexadvocate.com');
    console.log('  Password: Password123!');
    console.log('------------------------------------------------------');
    console.log('Default Advocate Credentials:');
    console.log('  Email:    priya.sharma@lexadvocate.com');
    console.log('  Password: Password123!');
    console.log('  (Other advocates use: vikram.singhania@lexadvocate.com, meenakshi.s@lexadvocate.com)');
    console.log('======================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDatabase();
