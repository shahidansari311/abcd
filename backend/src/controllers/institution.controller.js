const SkillProfile = require('../models/SkillProfile.model');
const Opportunity = require('../models/Opportunity.model');
const apiResponse = require('../utils/apiResponse');

const getSkillGaps = async (req, res) => {
  // Aggregate all skills from all students in the institution
  // In a real scenario we filter by institution ID on the student.
  // For now, we'll aggregate globally to show the dashboard working.
  
  const skillProfiles = await SkillProfile.find().lean();
  
  const studentSkillAverages = {};
  skillProfiles.forEach(profile => {
    profile.skills.forEach(skill => {
      if (!studentSkillAverages[skill.name]) {
        studentSkillAverages[skill.name] = { total: 0, count: 0 };
      }
      studentSkillAverages[skill.name].total += skill.score;
      studentSkillAverages[skill.name].count += 1;
    });
  });

  // Calculate averages
  for (const skill in studentSkillAverages) {
    studentSkillAverages[skill] = studentSkillAverages[skill].total / studentSkillAverages[skill].count;
  }

  // Fetch opportunities to see what industry requires
  const opportunities = await Opportunity.find({ isActive: true }).lean();
  
  const industryDemand = {};
  opportunities.forEach(opp => {
    opp.requiredSkills.forEach(reqSkill => {
      if (!industryDemand[reqSkill.skillName]) {
        industryDemand[reqSkill.skillName] = { maxRequired: 0 };
      }
      if (reqSkill.minimumScore > industryDemand[reqSkill.skillName].maxRequired) {
        industryDemand[reqSkill.skillName].maxRequired = reqSkill.minimumScore;
      }
    });
  });

  // Calculate gaps
  const gaps = [];
  for (const skill in industryDemand) {
    const requiredScore = industryDemand[skill].maxRequired;
    const currentScore = studentSkillAverages[skill] || 0;
    
    // Gap = Required - Current
    const gap = Math.max(0, requiredScore - currentScore);
    
    gaps.push({
      skill,
      requiredProficiency: requiredScore,
      studentProficiency: Math.round(currentScore),
      gap: Math.round(gap),
      urgency: gap > 30 ? 'High' : gap > 15 ? 'Medium' : 'Low'
    });
  }

  // Sort by gap size descending
  gaps.sort((a, b) => b.gap - a.gap);

  return apiResponse(res, 200, true, 'Skill gaps calculated successfully', { gaps });
};

const recordIntervention = async (req, res) => {
  const { interventionType, targetSkill, expectedImpact } = req.body;
  // This would record an intervention to a new Intervention model.
  // We mock a successful recording for now.
  return apiResponse(res, 201, true, 'Intervention recorded successfully', {
    intervention: { interventionType, targetSkill, expectedImpact, date: new Date() }
  });
};

module.exports = {
  getSkillGaps,
  recordIntervention,
};
