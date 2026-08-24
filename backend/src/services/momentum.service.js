const Student = require('../models/Student.model');

const getStartOfWeek = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).setHours(0, 0, 0, 0);
};

const calculateWeeklyPace = async (studentId) => {
  const student = await Student.findById(studentId);
  if (!student) return 50;

  let basePace = 50;
  if (student.readinessScore > 70) basePace = 80;
  else if (student.readinessScore > 40) basePace = 65;

  // If they have a roadmap, slightly increase pace
  if (student.careerRoadmap && student.careerRoadmap.length > 0) {
    basePace += 10;
  }

  return basePace;
};

const getMomentum = async (studentId) => {
  const student = await Student.findById(studentId);
  if (!student) throw new Error('Student not found');

  const startOfWeek = getStartOfWeek();
  let updated = false;

  // Check if we need to reset for a new week
  if (!student.lastMomentumUpdate || student.lastMomentumUpdate < startOfWeek) {
    // If they missed a week, check shields
    const weeksMissed = student.lastMomentumUpdate ? 
      Math.floor((startOfWeek - student.lastMomentumUpdate.getTime()) / (7 * 24 * 60 * 60 * 1000)) : 0;

    if (weeksMissed > 0) {
      if (student.momentumShields >= weeksMissed) {
        student.momentumShields -= weeksMissed;
      } else {
        student.momentumStreak = 0; // Lost streak
      }
    }

    student.weeklyPaceProgress = 0;
    student.weeklyPaceGoal = await calculateWeeklyPace(studentId);
    student.lastMomentumUpdate = new Date();
    updated = true;
  }

  if (updated) {
    await student.save();
  }

  let multiplier = 1;
  if (student.weeklyPaceProgress > student.weeklyPaceGoal * 1.5) {
    multiplier = 1.5; // Hot streak!
  } else if (student.weeklyPaceProgress > student.weeklyPaceGoal) {
    multiplier = 1.2;
  }

  return {
    streak: student.momentumStreak || 0,
    shields: student.momentumShields || 0,
    progress: student.weeklyPaceProgress || 0,
    goal: student.weeklyPaceGoal || 50,
    multiplier,
  };
};

const addMomentum = async (studentId, points) => {
  const student = await Student.findById(studentId);
  if (!student) return;

  // Ensure current week logic is applied
  await getMomentum(studentId); 
  
  const studentAfterRefresh = await Student.findById(studentId);
  
  const wasBelowGoal = studentAfterRefresh.weeklyPaceProgress < studentAfterRefresh.weeklyPaceGoal;
  
  studentAfterRefresh.weeklyPaceProgress += points;
  studentAfterRefresh.lastMomentumUpdate = new Date();

  // If they just crossed the goal this week
  if (wasBelowGoal && studentAfterRefresh.weeklyPaceProgress >= studentAfterRefresh.weeklyPaceGoal) {
    studentAfterRefresh.momentumStreak = (studentAfterRefresh.momentumStreak || 0) + 1;
    
    // Award shield every 4 weeks of streak
    if (studentAfterRefresh.momentumStreak % 4 === 0) {
      studentAfterRefresh.momentumShields = (studentAfterRefresh.momentumShields || 0) + 1;
    }
  }

  await studentAfterRefresh.save();
  return getMomentum(studentId);
};

module.exports = {
  calculateWeeklyPace,
  getMomentum,
  addMomentum
};
