require('dotenv').config();
const mongoose = require('mongoose');
const env = require('./src/config/env');
const User = require('./src/models/User.model');
const Student = require('./src/models/Student.model');
const Industry = require('./src/models/Industry.model');
const Institution = require('./src/models/Institution.model');
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

    // 2. Create Institution User
    const institutionUser = await Institution.create({
      email: 'admin@stateuniversity.edu',
      passwordHash: 'password123',
      role: 'institution',
      isEmailVerified: true,
      institutionName: 'State University',
      type: 'university',
      website: 'https://stateuniversity.edu',
      accreditationBody: 'NAAC A+',
      departments: ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Data Science'],
      isVerified: true,
    });
    console.log('Institution user created:', institutionUser.email);

    // 3. Create Student Demo User
    const studentUser = await Student.create({
      email: 'demo@skillbridge.com',
      passwordHash: 'password123',
      role: 'student',
      isEmailVerified: true,
      firstName: 'Maya',
      lastName: 'Patel',
      degree: 'B.S. Computer Science',
      major: 'Computer Science',
      location: 'Bengaluru, India',
      graduationYear: 2025,
      readinessScore: 74,
      institution: institutionUser._id,
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
    // Demo Assessments
    const demoAssessment1 = await Assessment.create({
      title: 'General Aptitude Demo',
      description: 'Test your general problem-solving and logical reasoning skills.',
      type: 'aptitude',
      targetRole: 'demo',
      durationMinutes: 15,
      isActive: true,
      questions: [
        { text: 'If you have 3 apples and you take away 2, how many do you have?', options: ['1', '2', '3', 'None'], correctAnswer: '2', points: 10 },
        { text: 'Which number comes next in the sequence: 2, 4, 8, 16, ...?', options: ['24', '32', '64', '128'], correctAnswer: '32', points: 10 }
      ]
    });

    const demoAssessment2 = await Assessment.create({
      title: 'Basic Communication Demo',
      description: 'Evaluate your fundamental professional communication skills.',
      type: 'soft_skill',
      targetRole: 'demo',
      durationMinutes: 20,
      isActive: true,
      questions: [
        { text: 'What is the most important aspect of active listening?', options: ['Interrupting to agree', 'Formulating your reply', 'Giving full attention', 'Nodding constantly'], correctAnswer: 'Giving full attention', points: 10 }
      ]
    });

    // Roadmap-Specific Assessments
    const assessment1 = await Assessment.create({
      title: 'Data Science Fundamentals',
      description: 'Test your knowledge of basic Data Science concepts and statistics.',
      type: 'technical',
      targetRole: 'Data Scientist',
      durationMinutes: 30,
      isActive: true,
      questions: [
        { text: 'What is the difference between supervised and unsupervised learning?', options: ['Supervised uses labeled data', 'Unsupervised uses labeled data', 'They are the same', 'Neither uses labeled data'], correctAnswer: 'Supervised uses labeled data', points: 10 },
        { text: 'Which metric is best for evaluating imbalanced classification?', options: ['Accuracy', 'F1-Score', 'Mean Absolute Error', 'R-Squared'], correctAnswer: 'F1-Score', points: 10 }
      ]
    });

    const assessment2 = await Assessment.create({
      title: 'Machine Learning Basics',
      description: 'Evaluate your proficiency with basic Machine Learning algorithms.',
      type: 'technical',
      targetRole: 'Data Scientist',
      durationMinutes: 45,
      isActive: true,
      questions: [
        { text: 'What does a decision tree do?', options: ['Sorts arrays', 'Splits data based on feature values', 'Performs neural processing', 'Clusters unsupervised data'], correctAnswer: 'Splits data based on feature values', points: 10 },
        { text: 'What is overfitting?', options: ['Model is too simple', 'Model memorizes training data but fails on new data', 'Model works perfectly', 'Data is too large'], correctAnswer: 'Model memorizes training data but fails on new data', points: 10 }
      ]
    });

    // 5. Create Opportunities
    await Opportunity.create({
      title: 'Junior Data Analyst',
      industryPartner: industryUser._id,
      description: 'Looking for a data analyst with SQL and Python skills.',
      type: 'job',
      location: 'Remote',
      requiredSkills: [
        { skillName: 'SQL', minimumScore: 70 },
        { skillName: 'Python', minimumScore: 65 },
        { skillName: 'Data Visualization', minimumScore: 60 }
      ],
      status: 'Open'
    });

    await Opportunity.create({
      title: 'Software Engineering Intern',
      industryPartner: industryUser._id,
      description: 'Summer internship for backend development.',
      type: 'internship',
      location: 'New York, NY',
      requiredSkills: [
        { skillName: 'Node.js', minimumScore: 60 },
        { skillName: 'Express', minimumScore: 50 },
        { skillName: 'MongoDB', minimumScore: 50 }
      ],
      status: 'Open'
    });

    console.log('Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();
