const SkillProfile = require('../models/SkillProfile.model');
const Opportunity = require('../models/Opportunity.model');
const Student = require('../models/Student.model');
const Industry = require('../models/Industry.model');
const Application = require('../models/Application.model');
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

const getDashboardStats = async (req, res) => {
  const students = await Student.find();
  const totalStudents = students.length;
  const avgReadiness = totalStudents > 0 
    ? students.reduce((acc, s) => acc + (s.readinessScore || 0), 0) / totalStudents 
    : 0;

  const industryPartners = await Industry.countDocuments({ role: 'industry' });
  const hiredCount = await Application.countDocuments({ status: 'Hired' });
  const placementRate = totalStudents > 0 ? Math.round((hiredCount / totalStudents) * 100) : 0;

  // Readiness by Dept
  const deptMap = {};
  students.forEach(s => {
    const dept = s.major || 'Unknown';
    if (!deptMap[dept]) deptMap[dept] = { total: 0, count: 0 };
    deptMap[dept].total += (s.readinessScore || 0);
    deptMap[dept].count += 1;
  });

  const readinessByDept = Object.keys(deptMap).map(label => ({
    label,
    value: Math.round(deptMap[label].total / deptMap[label].count)
  }));

  return apiResponse(res, 200, true, 'Stats fetched', {
    totalStudents,
    avgReadiness: Math.round(avgReadiness),
    industryPartners,
    readinessByDept,
    placementRate
  });
};

const getStudents = async (req, res) => {
  const students = await Student.find().select('firstName lastName major graduationYear readinessScore');
  const applications = await Application.find().populate('opportunity');
  
  const mapped = students.map(s => {
    const readiness = s.readinessScore || 0;
    
    // Find applications for this student
    const studentApps = applications.filter(a => a.student.toString() === s._id.toString());
    
    let status = "Available";
    let placement = "-";
    
    const hiredApp = studentApps.find(a => a.status === 'Hired');
    if (hiredApp) {
      status = "Placed";
      placement = hiredApp.opportunity?.title || hiredApp.company || "Partner Corp";
    } else if (studentApps.some(a => ['Interview', 'Offer'].includes(a.status))) {
      status = "Interviewing";
    }

    return {
      id: s._id,
      name: `${s.firstName} ${s.lastName}`,
      department: s.major || "Unknown",
      year: s.graduationYear ? s.graduationYear.toString() : "N/A",
      readiness,
      status,
      placement
    };
  });

  return apiResponse(res, 200, true, 'Students fetched', mapped);
};

const getHeatmap = async (req, res) => {
  const students = await Student.find();
  const skillProfiles = await SkillProfile.find();
  
  const deptSkillMap = {}; 
  
  students.forEach(s => {
    const dept = s.major || 'Unknown';
    if (!deptSkillMap[dept]) deptSkillMap[dept] = {};
    
    const profile = skillProfiles.find(p => p.student.toString() === s._id.toString());
    if (profile && profile.skills) {
      profile.skills.forEach(skill => {
        if (!deptSkillMap[dept][skill.name]) {
          deptSkillMap[dept][skill.name] = { sum: 0, count: 0 };
        }
        deptSkillMap[dept][skill.name].sum += skill.score;
        deptSkillMap[dept][skill.name].count += 1;
      });
    }
  });
  
  const rows = Object.keys(deptSkillMap).length > 0 ? Object.keys(deptSkillMap) : ["General"];
  
  // Get all unique skills as columns
  const colsSet = new Set();
  skillProfiles.forEach(p => p.skills.forEach(s => colsSet.add(s.name)));
  let cols = Array.from(colsSet).slice(0, 8); 
  
  if (cols.length === 0) {
    cols = ["Technical", "Communication", "Problem Solving"]; // Fallback if DB empty
  }

  const data = rows.map(dept => {
    return cols.map(col => {
      const stats = deptSkillMap[dept]?.[col];
      return stats ? Math.round(stats.sum / stats.count) : 0; 
    });
  });

  return apiResponse(res, 200, true, 'Heatmap fetched', { rows, cols, data });
};

const getPartners = async (req, res) => {
  const industries = await Industry.find({ role: 'industry' });
  const opportunities = await Opportunity.find();
  const applications = await Application.find({ status: 'Hired' });

  const partners = industries.map(ind => {
    const indOpps = opportunities.filter(o => o.industryPartner.toString() === ind._id.toString());
    const indHires = applications.filter(a => {
      const opp = indOpps.find(o => o._id.toString() === a.opportunity?.toString());
      return !!opp;
    }).length;

    // Get unique roles
    const roles = Array.from(new Set(indOpps.map(o => o.title)));

    return {
      name: ind.companyName || ind.firstName,
      sector: ind.industryType || "Tech",
      roles: roles.length > 0 ? roles : ["Various Roles"],
      hires: indHires,
      mou: ind.isVerified ? "Active" : "Pending"
    };
  });

  const requests = industries.filter(ind => !ind.isVerified).map(ind => ({
    name: ind.companyName || ind.firstName,
    sector: ind.industryType || "Tech",
    roles: opportunities.filter(o => o.industryPartner.toString() === ind._id.toString()).length
  }));

  return apiResponse(res, 200, true, 'Partners fetched', { partners, requests });
};

const getPlacementAnalytics = async (req, res) => {
  const applications = await Application.find().populate('opportunity');
  const students = await Student.find();
  
  const registeredCount = students.length;
  const eligibleCount = students.filter(s => s.readinessScore > 50).length; // Baseline for eligible
  const interviewedCount = new Set(applications.filter(a => ['Interview', 'Offer', 'Hired'].includes(a.status)).map(a => a.student.toString())).size;
  const placedCount = new Set(applications.filter(a => a.status === 'Hired').map(a => a.student.toString())).size;

  const funnel = [
    { label: "Registered", value: registeredCount },
    { label: "Eligible", value: eligibleCount },
    { label: "Interviewed", value: interviewedCount },
    { label: "Placed", value: placedCount },
  ];

  // Offers by sector
  const sectorCounts = {};
  applications.filter(a => a.status === 'Hired' || a.status === 'Offer').forEach(a => {
    // If opportunity doesn't exist, fallback
    const sector = 'Core Engineering'; // Fallback for now since opp might not have sector
    sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
  });
  
  const offersBySector = Object.keys(sectorCounts).map(k => ({ label: k, value: sectorCounts[k] }));
  if (offersBySector.length === 0) {
    offersBySector.push({ label: "Tech / Analytics", value: placedCount });
  }

  const placementTrend = [0, 0, 0, 0, 0, placedCount]; // Mock historical + actual current

  return apiResponse(res, 200, true, 'Placements fetched', { placementTrend, offersBySector, funnel });
};

module.exports = {
  getSkillGaps,
  recordIntervention,
  getDashboardStats,
  getStudents,
  getHeatmap,
  getPartners,
  getPlacementAnalytics,
};
