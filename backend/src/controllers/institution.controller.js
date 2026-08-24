const SkillProfile = require('../models/SkillProfile.model');
const Opportunity = require('../models/Opportunity.model');
const Student = require('../models/Student.model');
const Industry = require('../models/Industry.model');
const Application = require('../models/Application.model');
const Institution = require('../models/Institution.model');
const Intervention = require('../models/Intervention.model');
const apiResponse = require('../utils/apiResponse');

// ─── Profile ──────────────────────────────────────────────────────────────────

const getProfile = async (req, res) => {
  const institution = await Institution.findById(req.user.id).select('-passwordHash');
  if (!institution) return apiResponse(res, 404, false, 'Institution not found');
  return apiResponse(res, 200, true, 'Profile fetched', { institution });
};

const updateProfile = async (req, res) => {
  const { institutionName, type, website, accreditationBody, departments } = req.body;
  const institution = await Institution.findByIdAndUpdate(
    req.user.id,
    { institutionName, type, website, accreditationBody, departments },
    { new: true, runValidators: true }
  ).select('-passwordHash');
  return apiResponse(res, 200, true, 'Profile updated', { institution });
};

// ─── Skill Gaps ───────────────────────────────────────────────────────────────

const getSkillGaps = async (req, res) => {
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

  for (const skill in studentSkillAverages) {
    studentSkillAverages[skill] = studentSkillAverages[skill].total / studentSkillAverages[skill].count;
  }

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

  const gaps = [];
  for (const skill in industryDemand) {
    const requiredScore = industryDemand[skill].maxRequired;
    const currentScore = studentSkillAverages[skill] || 0;
    const gap = Math.max(0, requiredScore - currentScore);
    gaps.push({
      skill,
      requiredProficiency: requiredScore,
      studentProficiency: Math.round(currentScore),
      gap: Math.round(gap),
      urgency: gap > 30 ? 'High' : gap > 15 ? 'Medium' : 'Low'
    });
  }
  gaps.sort((a, b) => b.gap - a.gap);

  return apiResponse(res, 200, true, 'Skill gaps calculated successfully', { gaps });
};

// ─── Intervention ─────────────────────────────────────────────────────────────

const recordIntervention = async (req, res) => {
  const { interventionType, targetSkill, expectedImpact } = req.body;
  
  if (!interventionType || !targetSkill || !expectedImpact) {
    return apiResponse(res, 400, false, 'Missing required fields');
  }

  const intervention = await Intervention.create({
    institution: req.user.id,
    interventionType,
    targetSkill,
    expectedImpact
  });

  return apiResponse(res, 201, true, 'Intervention recorded successfully', {
    intervention
  });
};

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

const getDashboardStats = async (req, res) => {
  const students = await Student.find();
  const totalStudents = students.length;
  const avgReadiness = totalStudents > 0
    ? students.reduce((acc, s) => acc + (s.readinessScore || 0), 0) / totalStudents
    : 0;

  const industryPartners = await Industry.countDocuments({ role: 'industry' });
  const hiredCount = await Application.countDocuments({ status: 'Hired' });
  const placementRate = totalStudents > 0 ? Math.round((hiredCount / totalStudents) * 100) : 0;

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

// ─── Students ─────────────────────────────────────────────────────────────────

const getStudents = async (req, res) => {
  const students = await Student.find().select('firstName lastName major graduationYear readinessScore location');
  const applications = await Application.find().populate('opportunity');

  const mapped = students.map(s => {
    const readiness = s.readinessScore || 0;
    const studentApps = applications.filter(a => a.student.toString() === s._id.toString());

    let status = 'Available';
    let placement = '-';

    const hiredApp = studentApps.find(a => a.status === 'Hired');
    if (hiredApp) {
      status = 'Placed';
      placement = hiredApp.opportunity?.title || hiredApp.company || 'Partner Corp';
    } else if (studentApps.some(a => ['Interview', 'Offer'].includes(a.status))) {
      status = 'Interviewing';
    }

    return {
      id: s._id,
      name: `${s.firstName} ${s.lastName}`,
      department: s.major || 'Unknown',
      year: s.graduationYear ? s.graduationYear.toString() : 'N/A',
      readiness,
      status,
      placement
    };
  });

  return apiResponse(res, 200, true, 'Students fetched', mapped);
};

// ─── Heatmap ──────────────────────────────────────────────────────────────────

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

  const rows = Object.keys(deptSkillMap).length > 0 ? Object.keys(deptSkillMap) : ['General'];

  const colsSet = new Set();
  skillProfiles.forEach(p => p.skills.forEach(s => colsSet.add(s.name)));
  let cols = Array.from(colsSet).slice(0, 8);

  if (cols.length === 0) {
    cols = ['Technical', 'Communication', 'Problem Solving'];
  }

  const data = rows.map(dept => {
    return cols.map(col => {
      const stats = deptSkillMap[dept]?.[col];
      return stats ? Math.round(stats.sum / stats.count) : 0;
    });
  });

  return apiResponse(res, 200, true, 'Heatmap fetched', { rows, cols, data });
};

// ─── Partners ─────────────────────────────────────────────────────────────────

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

    const roles = Array.from(new Set(indOpps.map(o => o.title)));

    return {
      id: ind._id,
      name: ind.companyName || ind.firstName,
      sector: ind.industryType || 'Tech',
      website: ind.website || '',
      roles: roles.length > 0 ? roles : ['Various Roles'],
      hires: indHires,
      mou: ind.isVerified ? 'Active' : 'Pending'
    };
  });

  const requests = industries.filter(ind => !ind.isVerified).map(ind => ({
    id: ind._id,
    name: ind.companyName || ind.firstName,
    sector: ind.industryType || 'Tech',
    website: ind.website || '',
    roles: opportunities.filter(o => o.industryPartner.toString() === ind._id.toString()).length
  }));

  return apiResponse(res, 200, true, 'Partners fetched', { partners, requests });
};

const getPartnerById = async (req, res) => {
  const { id } = req.params;
  const ind = await Industry.findById(id).select('-passwordHash');
  if (!ind) return apiResponse(res, 404, false, 'Partner not found');

  const opportunities = await Opportunity.find({ industryPartner: id });
  const applications = await Application.find({
    opportunity: { $in: opportunities.map(o => o._id) }
  });

  const hires = applications.filter(a => a.status === 'Hired').length;
  const totalApps = applications.length;

  return apiResponse(res, 200, true, 'Partner fetched', {
    id: ind._id,
    name: ind.companyName || ind.firstName,
    sector: ind.industryType || 'Tech',
    website: ind.website || '',
    email: ind.email,
    isVerified: ind.isVerified,
    opportunities: opportunities.map(o => ({
      id: o._id,
      title: o.title,
      type: o.type,
      location: o.location,
      status: o.status,
      requiredSkills: o.requiredSkills,
    })),
    stats: { hires, totalApps, openRoles: opportunities.filter(o => o.status === 'Open').length },
  });
};

// ─── Placement Analytics (full real data) ────────────────────────────────────

const getPlacementAnalytics = async (req, res) => {
  const applications = await Application.find().populate('opportunity');
  const students = await Student.find();

  // ── Stat card values ──
  const registeredCount = students.length;
  const eligibleCount = students.filter(s => s.readinessScore > 50).length;
  const interviewedCount = new Set(
    applications.filter(a => ['Interview', 'Offer', 'Hired'].includes(a.status))
      .map(a => a.student.toString())
  ).size;
  const placedStudentIds = new Set(
    applications.filter(a => a.status === 'Hired').map(a => a.student.toString())
  );
  const placedCount = placedStudentIds.size;

  // Offers extended = Offer + Hired
  const offersExtended = applications.filter(a => ['Offer', 'Hired'].includes(a.status)).length;

  // Unique companies that posted any opportunity with at least one application
  const companiesVisited = new Set(
    applications.map(a => a.company).filter(Boolean)
  ).size;

  // Salary stats for placed students (from opportunity if available)
  const hiredOpps = applications
    .filter(a => a.status === 'Hired' && a.opportunity?.salary)
    .map(a => a.opportunity.salary);

  const medianPackage = hiredOpps.length > 0
    ? (() => {
      const sorted = [...hiredOpps].sort((x, y) => x - y);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    })()
    : 0;

  const highestPackage = hiredOpps.length > 0 ? Math.max(...hiredOpps) : 0;

  // ── Placement funnel ──
  const funnel = [
    { label: 'Registered', value: registeredCount },
    { label: 'Eligible', value: eligibleCount },
    { label: 'Interviewed', value: interviewedCount },
    { label: 'Placed', value: placedCount },
  ];

  // ── Placement trend (last 6 months) ──
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

  const monthlyHires = await Application.aggregate([
    { $match: { status: 'Hired', createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // Build 6-month trend array
  const placementTrend = Array(6).fill(0);
  const now = new Date();
  monthlyHires.forEach(m => {
    const date = new Date(m._id.year, m._id.month - 1);
    const diffMonths = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
    const idx = 5 - diffMonths;
    if (idx >= 0 && idx < 6) placementTrend[idx] = m.count;
  });

  // ── Offers by sector (using opportunity type) ──
  const sectorAgg = await Application.aggregate([
    { $match: { status: { $in: ['Hired', 'Offer'] }, opportunity: { $exists: true, $ne: null } } },
    {
      $lookup: {
        from: 'opportunities',
        localField: 'opportunity',
        foreignField: '_id',
        as: 'opp'
      }
    },
    { $unwind: { path: '$opp', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: { $ifNull: ['$opp.type', 'Other'] },
        count: { $sum: 1 }
      }
    }
  ]);

  const offersBySector = sectorAgg.length > 0
    ? sectorAgg.map(s => ({ label: s._id, value: s.count }))
    : [{ label: 'No offers yet', value: 0 }];

  return apiResponse(res, 200, true, 'Placements fetched', {
    placementTrend,
    offersBySector,
    funnel,
    medianPackage,
    highestPackage,
    offersExtended,
    companiesVisited
  });
};

module.exports = {
  getProfile,
  updateProfile,
  getSkillGaps,
  recordIntervention,
  getDashboardStats,
  getStudents,
  getHeatmap,
  getPartners,
  getPartnerById,
  getPlacementAnalytics,
};
