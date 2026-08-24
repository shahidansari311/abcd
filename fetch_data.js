const mongoose = require('mongoose');

async function fetchRealData() {
  await mongoose.connect('mongodb+srv://vaishshobhit9_db_user:Wruf6YJRAhl8nkTg@sih.33sqpbx.mongodb.net/?appName=Sih');
  
  const User = require('./backend/src/models/User.model');
  const Student = require('./backend/src/models/Student.model');
  const SkillProfile = require('./backend/src/models/SkillProfile.model');
  
  const student = await Student.findOne({ email: { $exists: true } });
  if (!student) {
    console.log("No student found");
    return;
  }
  
  const skillProfile = await SkillProfile.findOne({ student: student._id });
  
  console.log("---- STUDENT PROFILE ----");
  console.log(JSON.stringify(student, null, 2));
  
  console.log("---- SKILL PROFILE ----");
  console.log(JSON.stringify(skillProfile, null, 2));
  
  mongoose.disconnect();
}

fetchRealData().catch(console.error);
