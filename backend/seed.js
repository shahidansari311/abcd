require('dotenv').config();
const mongoose = require('mongoose');
const env = require('./src/config/env');
const User = require('./src/models/User.model');
const Student = require('./src/models/Student.model');
const Industry = require('./src/models/Industry.model');
const SkillProfile = require('./src/models/SkillProfile.model');
const Assessment = require('./src/models/Assessment.model');
const AssessmentResult = require('./src/models/AssessmentResult.model');
const Opportunity = require('./src/models/Opportunity.model');

const seedDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    // Clear DB
    await User.deleteMany({});
    await SkillProfile.deleteMany({});
    await Assessment.deleteMany({});
    await AssessmentResult.deleteMany({});
    await Opportunity.deleteMany({});
    console.log('Cleared existing data.');

    // 1. Create Industry User
    const industryUser = await Industry.create({
      email: 'recruiter@techcorp.com',
      passwordHash: 'password123', // Will be hashed by pre-save hook
      role: 'industry',
      isEmailVerified: true,
      companyName: 'TechCorp',
      industrySector: 'Technology',
      website: 'https://techcorp.com'
    });

    // 2. Create Student Demo User
    const studentUser = await Student.create({
      email: 'demo@skillbridge.com',
      passwordHash: 'password123',
      role: 'student',
      isEmailVerified: true,
      firstName: 'Maya',
      lastName: 'Patel',
      degree: 'B.S. Computer Science',
      graduationYear: 2025,
      readinessScore: 74
    });

    // 3. Create Skill Profile for Student
    const skillProfile = await SkillProfile.create({
      student: studentUser._id,
      skills: [
        { name: 'Technical', score: 78, confidence: 0.9, isVerified: true },
        { name: 'Analytics', score: 64, confidence: 0.8, isVerified: true },
        { name: 'Communication', score: 82, confidence: 0.95, isVerified: false },
        { name: 'Design', score: 55, confidence: 0.7, isVerified: false },
        { name: 'Leadership', score: 48, confidence: 0.6, isVerified: false },
        { name: 'Domain', score: 70, confidence: 0.85, isVerified: true }
      ]
    });

    studentUser.skillProfileRef = skillProfile._id;
    await studentUser.save();

    // 4. Create Assessments
    const assessment1 = await Assessment.create({
      title: 'Programming Fundamentals',
      description: 'Test your knowledge of basic programming constructs, logic, and data structures.',
      type: 'technical',
      durationMinutes: 30,
      isActive: true,
      questions: [
        { text: 'Which data structure uses LIFO?', options: ['Queue', 'Stack', 'Array', 'Tree'], correctAnswer: 'Stack', points: 10 },
        { text: 'What does OOP stand for?', options: ['Object Oriented Programming', 'Only Output Processing', 'Object Overload Protocol', 'Over Output Processing'], correctAnswer: 'Object Oriented Programming', points: 10 }
      ]
    });

    const assessment2 = await Assessment.create({
      title: 'Databases & SQL',
      description: 'Evaluate your proficiency with relational databases and SQL queries.',
      type: 'technical',
      durationMinutes: 45,
      isActive: true,
      questions: [
        { text: 'Which SQL clause is used to filter groups created by GROUP BY?', options: ['WHERE', 'HAVING', 'FILTER', 'ORDER BY'], correctAnswer: 'HAVING', points: 10 },
        { text: 'Which join returns only matching rows from both tables?', options: ['LEFT JOIN', 'FULL OUTER JOIN', 'INNER JOIN', 'CROSS JOIN'], correctAnswer: 'INNER JOIN', points: 10 }
      ]
    });

    // 5. Create Opportunities
    await Opportunity.create({
      title: 'Junior Data Analyst',
      industryPartner: industryUser._id,
      description: 'Looking for a data analyst with SQL and Python skills.',
      type: 'job',
      location: 'Remote',
      requirements: ['SQL', 'Python', 'Data Visualization'],
      status: 'open'
    });

    await Opportunity.create({
      title: 'Software Engineering Intern',
      industryPartner: industryUser._id,
      description: 'Summer internship for backend development.',
      type: 'internship',
      location: 'New York, NY',
      requirements: ['Node.js', 'Express', 'MongoDB'],
      status: 'open'
    });

    console.log('Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();
