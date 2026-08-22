const getGapAnalysis = async (profile, targetRole) => {
  // Mock logic: compares student profile against static target role requirements
  const mockRequirements = {
    'Full Stack Developer': [
      { name: 'JavaScript', requiredScore: 80 },
      { name: 'React', requiredScore: 70 },
      { name: 'Node.js', requiredScore: 70 }
    ]
  };

  const requirements = mockRequirements[targetRole] || [];
  const gaps = requirements.map(req => {
    const userSkill = profile.skills.find(s => s.name.toLowerCase() === req.name.toLowerCase());
    const currentScore = userSkill ? userSkill.score : 0;
    return {
      skill: req.name,
      currentScore,
      requiredScore: req.requiredScore,
      gap: Math.max(0, req.requiredScore - currentScore),
    };
  });

  return gaps;
};

module.exports = {
  getGapAnalysis,
};
