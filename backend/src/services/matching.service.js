const Opportunity = require('../models/Opportunity.model');
const SkillProfile = require('../models/SkillProfile.model');

const MATCH_THRESHOLD = 60;

const getMatchesForStudent = async (studentId) => {
  // Fetch student profile
  const profile = await SkillProfile.findOne({ student: studentId });
  if (!profile || profile.skills.length === 0) {
    return [];
  }

  // Fetch all active opportunities
  const opportunities = await Opportunity.find({ isActive: true }).populate('industryPartner', 'companyName logoUrl');

  const matches = [];

  for (const opp of opportunities) {
    // 1. Hard skill filtering (mocking a weighted score based on exact skill matches)
    let score = 0;
    let maxScore = opp.requiredSkills.length > 0 ? opp.requiredSkills.length * 100 : 100;
    
    if (opp.requiredSkills.length > 0) {
      opp.requiredSkills.forEach(reqSkill => {
        const studentSkill = profile.skills.find(s => s.name.toLowerCase() === reqSkill.skillName.toLowerCase());
        if (studentSkill) {
          score += studentSkill.score;
        }
      });
    } else {
      // If no explicit skills required, base score
      score = 70;
    }

    const matchPercentage = (score / maxScore) * 100;

    // 2. Threshold check
    if (matchPercentage >= MATCH_THRESHOLD) {
      matches.push({
        opportunity: opp,
        matchScore: Math.round(matchPercentage),
        matchReason: `Matches ${Math.round(matchPercentage)}% of the required technical criteria.`
      });
    }
  }

  // Sort by highest match score
  return matches.sort((a, b) => b.matchScore - a.matchScore);
};

module.exports = {
  getMatchesForStudent,
};
