require('dotenv').config();
const mongoose = require('mongoose');
const env = require('./src/config/env');

const User = require('./src/models/User.model');
if (!User.discriminators || !User.discriminators['super_admin']) {
  User.discriminator('super_admin', new mongoose.Schema({}));
}

const Student = require('./src/models/Student.model');
const Industry = require('./src/models/Industry.model');
const Institution = require('./src/models/Institution.model');
const Academician = require('./src/models/Academician.model');
const SkillProfile = require('./src/models/SkillProfile.model');
const Assessment = require('./src/models/Assessment.model');
const AssessmentResult = require('./src/models/AssessmentResult.model');
const Opportunity = require('./src/models/Opportunity.model');
const Application = require('./src/models/Application.model');

const seedDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    // ---- Clear DB ----
    await User.deleteMany({});
    await SkillProfile.deleteMany({});
    await Assessment.deleteMany({});
    await AssessmentResult.deleteMany({});
    await Opportunity.deleteMany({});
    await Application.deleteMany({});
    console.log('Cleared existing data.');

    // =========================================================
    // 1. INSTITUTIONS (role: institution_admin)
    // =========================================================
    const institutions = await Institution.create([
      {
        email: 'admin.iiit@skillbridge.com',
        passwordHash: 'password123',
        isEmailVerified: true,
        institutionName: 'Indian Institute of Information Technology',
        type: 'university',
        website: 'https://iiit.skillbridge.com',
        accreditationBody: 'NAAC',
        departments: ['Computer Science', 'Electronics', 'Mechanical'],
        isVerified: true,
      },
      {
        email: 'admin.rungta@skillbridge.com',
        passwordHash: 'password123',
        isEmailVerified: true,
        institutionName: 'Rungta College of Engineering & Technology',
        type: 'college',
        website: 'https://rungta.skillbridge.com',
        accreditationBody: 'AICTE',
        departments: ['Computer Science', 'Information Technology', 'Civil'],
        isVerified: true,
      },
      {
        email: 'admin.globaltech@skillbridge.com',
        passwordHash: 'password123',
        isEmailVerified: true,
        institutionName: 'Global Institute of Technology',
        type: 'training_institute',
        website: 'https://globaltech.skillbridge.com',
        accreditationBody: 'ISO 9001',
        departments: ['Data Science', 'Web Development', 'AI & ML'],
        isVerified: false,
      },
    ]);
    const [iiit, rungta, globalTech] = institutions;
    console.log(`Created ${institutions.length} institutions.`);

    // =========================================================
    // 2. ACADEMICIANS (role: academician)
    // =========================================================
    const academicians = await Academician.create([
      {
        email: 'prof.sharma@skillbridge.com',
        passwordHash: 'password123',
        isEmailVerified: true,
        firstName: 'Anil',
        lastName: 'Sharma',
        institution: iiit._id,
        department: 'Computer Science',
        designation: 'Professor',
        expertiseAreas: ['Data Structures', 'Machine Learning', 'Cloud Computing'],
      },
      {
        email: 'prof.mehta@skillbridge.com',
        passwordHash: 'password123',
        isEmailVerified: true,
        firstName: 'Priya',
        lastName: 'Mehta',
        institution: rungta._id,
        department: 'Information Technology',
        designation: 'Associate Professor',
        expertiseAreas: ['Web Development', 'Databases', 'Software Engineering'],
      },
      {
        email: 'prof.rao@skillbridge.com',
        passwordHash: 'password123',
        isEmailVerified: true,
        firstName: 'Suresh',
        lastName: 'Rao',
        institution: globalTech._id,
        department: 'Data Science',
        designation: 'Assistant Professor',
        expertiseAreas: ['Artificial Intelligence', 'Statistics', 'Data Visualization'],
      },
    ]);
    console.log(`Created ${academicians.length} academicians.`);

    // =========================================================
    // 3. INDUSTRIES (role: industry)
    // =========================================================
    const industries = await Industry.create([
      {
        email: 'techcorp.hr@skillbridge.com',
        passwordHash: 'password123',
        isEmailVerified: true,
        companyName: 'TechCorp',
        industryType: 'Technology',
        website: 'https://techcorp.skillbridge.com',
        contactPerson: 'Neha Kapoor',
        isVerified: true,
      },
      {
        email: 'infosync.hr@skillbridge.com',
        passwordHash: 'password123',
        isEmailVerified: true,
        companyName: 'InfoSync Solutions',
        industryType: 'IT Services',
        website: 'https://infosync.skillbridge.com',
        contactPerson: 'Rakesh Malhotra',
        isVerified: true,
      },
      {
        email: 'wipronext.hr@skillbridge.com',
        passwordHash: 'password123',
        isEmailVerified: true,
        companyName: 'WiproNext Digital',
        industryType: 'Consulting',
        website: 'https://wipronext.skillbridge.com',
        contactPerson: 'Sonal Bhatt',
        isVerified: false,
      },
      {
        email: 'clouddrive.hr@skillbridge.com',
        passwordHash: 'password123',
        isEmailVerified: true,
        companyName: 'CloudDrive Systems',
        industryType: 'Cloud & Infrastructure',
        website: 'https://clouddrive.skillbridge.com',
        contactPerson: 'Vikram Nair',
        isVerified: true,
      },
    ]);
    const [techCorp, infoSync, wiproNext, cloudDrive] = industries;
    console.log(`Created ${industries.length} industries.`);

    // =========================================================
    // 4. STUDENTS (role: student)
    // =========================================================
    const studentSeedData = [
      { firstName: 'Shahid', lastName: 'Ansari', email: 'shahid.ansari@skillbridge.com', degree: 'B.Tech Computer Science', graduationYear: 2026, institution: iiit._id, readinessScore: 82 },
      { firstName: 'Shobhit Kumar', lastName: 'Vaish', email: 'shobhit.vaish@skillbridge.com', degree: 'B.Tech Information Technology', graduationYear: 2026, institution: rungta._id, readinessScore: 76 },
      { firstName: 'Shreyansh', lastName: 'Sahu', email: 'shreyansh.sahu@skillbridge.com', degree: 'B.Sc Data Science', graduationYear: 2025, institution: globalTech._id, readinessScore: 88 },
      { firstName: 'Shivam', lastName: 'Chaurasiya', email: 'shivam.chaurasiya@skillbridge.com', degree: 'B.Tech Computer Science', graduationYear: 2027, institution: iiit._id, readinessScore: 65 },
      { firstName: 'Rimjhim', lastName: 'Madaan', email: 'rimjhim.madaan@skillbridge.com', degree: 'B.Tech Electronics', graduationYear: 2026, institution: rungta._id, readinessScore: 71 },
      { firstName: 'Rajshree', lastName: 'Bhuyan', email: 'rajshree.bhuyan@skillbridge.com', degree: 'BCA', graduationYear: 2025, institution: globalTech._id, readinessScore: 79 },
      { firstName: 'Maya', lastName: 'Patel', email: 'demo@skillbridge.com', degree: 'B.S. Computer Science', graduationYear: 2025, institution: iiit._id, readinessScore: 74 },
      { firstName: 'Ananya', lastName: 'Singh', email: 'ananya.singh@skillbridge.com', degree: 'B.Tech Artificial Intelligence', graduationYear: 2026, institution: globalTech._id, readinessScore: 91 },
      { firstName: 'Rohit', lastName: 'Sharma', email: 'rohit.sharma@skillbridge.com', degree: 'B.Tech Mechanical', graduationYear: 2027, institution: rungta._id, readinessScore: 58 },
    ];

    const students = [];
    for (const s of studentSeedData) {
      const student = await Student.create({
        email: s.email,
        passwordHash: 'password123',
        isEmailVerified: true,
        firstName: s.firstName,
        lastName: s.lastName,
        institution: s.institution,
        degree: s.degree,
        graduationYear: s.graduationYear,
        readinessScore: s.readinessScore,
        readinessHistory: [
          { score: Math.max(s.readinessScore - 15, 0), date: new Date('2025-06-01') },
          { score: Math.max(s.readinessScore - 6, 0), date: new Date('2025-12-01') },
          { score: s.readinessScore, date: new Date() },
        ],
        headline: `Aspiring ${s.degree} professional`,
        experience: [{
          company: 'Tech Innovators Inc.',
          title: 'Software Engineering Intern',
          startDate: new Date('2024-05-01'),
          endDate: new Date('2024-08-01'),
          description: 'Developed REST APIs using Node.js and Express.'
        }],
        education: [{
          institution: 'SkillBridge University',
          degree: s.degree,
          fieldOfStudy: 'Computer Science',
          startDate: new Date('2022-08-01'),
          endDate: new Date('2026-05-01')
        }],
        certifications: ['AWS Certified Cloud Practitioner', 'MongoDB Basics'],
        projects: [{
          title: 'E-commerce Platform',
          description: 'Full-stack application using MERN stack.',
          link: 'https://github.com/example/ecommerce'
        }],
        github: `https://github.com/${s.firstName.toLowerCase()}`,
        linkedin: `https://linkedin.com/in/${s.firstName.toLowerCase()}-${s.lastName.toLowerCase()}`,
        portfolio: `https://${s.firstName.toLowerCase()}.dev`,
        preferredRoles: ['Software Engineer', 'Data Analyst', 'Frontend Developer'],
        preferredLocations: ['Bengaluru', 'Remote', 'Pune'],
        availability: 'Immediate',
        targetRole: 'Software Engineer',
      });

      // Skill profile per student (deterministic spread based on readiness score)
      const skillProfile = await SkillProfile.create({
        student: student._id,
        skills: [
          { name: 'Technical', score: 50 + (student.readinessScore % 45), confidence: 0.85, isVerified: true },
          { name: 'Analytics', score: 45 + (student.readinessScore % 40), confidence: 0.8, isVerified: true },
          { name: 'Communication', score: 55 + (student.readinessScore % 35), confidence: 0.9, isVerified: false },
          { name: 'Design', score: 40 + (student.readinessScore % 30), confidence: 0.65, isVerified: false },
          { name: 'Leadership', score: 35 + (student.readinessScore % 25), confidence: 0.6, isVerified: false },
          { name: 'Domain', score: 50 + (student.readinessScore % 38), confidence: 0.82, isVerified: true },
        ],
      });

      student.skillProfileRef = skillProfile._id;
      await student.save();
      students.push(student);
    }
    console.log(`Created ${students.length} students with skill profiles.`);

    // =========================================================
    // 5. ASSESSMENTS
    // =========================================================
    const assessment1 = await Assessment.create({
      title: 'Programming Fundamentals',
      description: 'Test your knowledge of basic programming constructs, logic, and data structures.',
      type: 'technical',
      targetRole: 'Software Engineer',
      durationMinutes: 30,
      isActive: true,
      createdBy: academicians[0]._id,
      questions: [
        { text: 'Which data structure uses LIFO?', options: ['Queue', 'Stack', 'Array', 'Tree'], correctAnswer: 'Stack', points: 10 },
        { text: 'What does OOP stand for?', options: ['Object Oriented Programming', 'Only Output Processing', 'Object Overload Protocol', 'Over Output Processing'], correctAnswer: 'Object Oriented Programming', points: 10 },
      ],
    });

    const assessment2 = await Assessment.create({
      title: 'Databases & SQL',
      description: 'Evaluate your proficiency with relational databases and SQL queries.',
      type: 'technical',
      targetRole: 'Data Analyst',
      durationMinutes: 45,
      isActive: true,
      createdBy: academicians[1]._id,
      questions: [
        { text: 'Which SQL clause is used to filter groups created by GROUP BY?', options: ['WHERE', 'HAVING', 'FILTER', 'ORDER BY'], correctAnswer: 'HAVING', points: 10 },
        { text: 'Which join returns only matching rows from both tables?', options: ['LEFT JOIN', 'FULL OUTER JOIN', 'INNER JOIN', 'CROSS JOIN'], correctAnswer: 'INNER JOIN', points: 10 },
      ],
    });

    const assessment3 = await Assessment.create({
      title: 'Workplace Communication & Aptitude',
      description: 'Assess soft skills, logical reasoning, and workplace communication readiness.',
      type: 'soft_skill',
      targetRole: 'Any Entry-Level Role',
      durationMinutes: 20,
      isActive: true,
      createdBy: academicians[2]._id,
      questions: [
        { text: 'A colleague disagrees with your approach in a meeting. What is the best response?', options: ['Ignore them', 'Ask for their reasoning and discuss', 'Argue immediately', 'Report to manager'], correctAnswer: 'Ask for their reasoning and discuss', points: 10 },
        { text: 'If train A leaves at 60km/h and train B leaves 1hr later at 90km/h on the same route, when does B catch A?', options: ['2 hrs', '3 hrs', '1.5 hrs', '4 hrs'], correctAnswer: '2 hrs', points: 10 },
      ],
    });
    console.log('Created 3 assessments.');

    // =========================================================
    // 6. ASSESSMENT RESULTS (sample subset of students)
    // =========================================================
    const resultConfigs = [
      { student: students[0], assessment: assessment1, score: 20, max: 20 },
      { student: students[1], assessment: assessment2, score: 15, max: 20 },
      { student: students[2], assessment: assessment1, score: 18, max: 20 },
      { student: students[2], assessment: assessment3, score: 20, max: 20 },
      { student: students[5], assessment: assessment3, score: 12, max: 20 },
      { student: students[7], assessment: assessment2, score: 20, max: 20 },
    ];
    for (const r of resultConfigs) {
      await AssessmentResult.create({
        student: r.student._id,
        assessment: r.assessment._id,
        score: r.score,
        maxScore: r.max,
        percentage: Math.round((r.score / r.max) * 100),
        status: 'completed',
      });
    }
    console.log(`Created ${resultConfigs.length} assessment results.`);

    // =========================================================
    // 7. OPPORTUNITIES (fields match Opportunity schema: requiredSkills, isActive)
    // =========================================================
    const opportunities = await Opportunity.create([
      {
        title: 'Junior Data Analyst',
        industryPartner: techCorp._id,
        description: 'Looking for a data analyst with SQL and Python skills.',
        type: 'job',
        location: 'Remote',
        requiredSkills: [
          { skillName: 'SQL', minimumScore: 60 },
          { skillName: 'Analytics', minimumScore: 55 },
        ],
        isActive: true,
      },
      {
        title: 'Software Engineering Intern',
        industryPartner: techCorp._id,
        description: 'Summer internship for backend development with Node.js and MongoDB.',
        type: 'internship',
        location: 'New York, NY',
        requiredSkills: [
          { skillName: 'Technical', minimumScore: 50 },
          { skillName: 'Domain', minimumScore: 40 },
        ],
        isActive: true,
      },
      {
        title: 'Frontend Developer',
        industryPartner: infoSync._id,
        description: 'Build responsive UIs using React and modern CSS.',
        type: 'job',
        location: 'Bengaluru, India',
        requiredSkills: [
          { skillName: 'Technical', minimumScore: 55 },
          { skillName: 'Design', minimumScore: 45 },
        ],
        isActive: true,
      },
      {
        title: 'Cloud Infrastructure Intern',
        industryPartner: cloudDrive._id,
        description: 'Assist in managing AWS infrastructure and CI/CD pipelines.',
        type: 'internship',
        location: 'Remote',
        requiredSkills: [
          { skillName: 'Technical', minimumScore: 60 },
        ],
        isActive: true,
      },
      {
        title: 'Business Analyst Project',
        industryPartner: wiproNext._id,
        description: 'Short-term project analyzing client workflows and proposing digital solutions.',
        type: 'project',
        location: 'Pune, India',
        requiredSkills: [
          { skillName: 'Communication', minimumScore: 50 },
          { skillName: 'Analytics', minimumScore: 45 },
        ],
        isActive: false,
      },
    ]);
    console.log(`Created ${opportunities.length} opportunities.`);

    // =========================================================
    // 8. APPLICATIONS
    // =========================================================
    const applications = await Application.create([
      { student: students[0]._id, company: 'TechCorp', role: 'Software Engineering Intern', status: 'Interview' },
      { student: students[1]._id, company: 'InfoSync Solutions', role: 'Frontend Developer', status: 'Applied' },
      { student: students[2]._id, company: 'CloudDrive Systems', role: 'Cloud Infrastructure Intern', status: 'Offer' },
      { student: students[5]._id, company: 'WiproNext Digital', role: 'Business Analyst Project', status: 'Screening' },
      { student: students[7]._id, company: 'TechCorp', role: 'Junior Data Analyst', status: 'Applied' },
    ]);
    console.log(`Created ${applications.length} applications.`);

    // =========================================================
    // 9. SUPER ADMIN (no discriminator model exists, use base User)
    // =========================================================
    await User.create({
      email: 'admin@skillbridge.com',
      passwordHash: 'password123',
      role: 'super_admin',
      isEmailVerified: true,
      status: 'active',
    });
    console.log('Created 1 super_admin.');

    console.log('\n✅ Database successfully seeded!');
    console.log('----------------------------------------------------');
    console.log('Login credentials (password for ALL accounts: password123)');
    console.log('Super Admin:      admin@skillbridge.com');
    console.log('Institutions:     admin.iiit@skillbridge.com, admin.rungta@skillbridge.com, admin.globaltech@skillbridge.com');
    console.log('Academicians:     prof.sharma@skillbridge.com, prof.mehta@skillbridge.com, prof.rao@skillbridge.com');
    console.log('Industries:       techcorp.hr@skillbridge.com, infosync.hr@skillbridge.com, wipronext.hr@skillbridge.com, clouddrive.hr@skillbridge.com');
    console.log('Students:         shahid.ansari@skillbridge.com, shobhit.vaish@skillbridge.com, shreyansh.sahu@skillbridge.com,');
    console.log('                  shivam.chaurasiya@skillbridge.com, rimjhim.madaan@skillbridge.com, rajshree.bhuyan@skillbridge.com,');
    console.log('                  demo@skillbridge.com, ananya.singh@skillbridge.com, rohit.sharma@skillbridge.com');
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();