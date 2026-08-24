const industryService = require('../services/industry.service');
const apiResponse = require('../utils/apiResponse');

const Opportunity = require('../models/Opportunity.model');
const Application = require('../models/Application.model');
const SkillProfile = require('../models/SkillProfile.model');
const Student = require('../models/Student.model');

// ─── Profile ──────────────────────────────────────────────────────────────────

const getProfile = async (req, res) => {
  const industry = await industryService.getProfile(req.user.id);
  return apiResponse(res, 200, true, 'Profile fetched successfully', { industry });
};

const updateProfile = async (req, res) => {
  const industry = await industryService.updateProfile(req.user.id, req.body);
  return apiResponse(res, 200, true, 'Profile updated successfully', { industry });
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

const getDashboardStats = async (req, res) => {
  const activePostings = await Opportunity.countDocuments({ industryPartner: req.user.id, status: 'Open' });

  const opportunities = await Opportunity.find({ industryPartner: req.user.id }).select('_id');
  const opportunityIds = opportunities.map(o => o._id);

  const pipelineCount = await Application.countDocuments({ opportunity: { $in: opportunityIds } });
  const interviewsCount = await Application.countDocuments({
    opportunity: { $in: opportunityIds },
    status: 'Interview'
  });
  const hiresCount = await Application.countDocuments({
    opportunity: { $in: opportunityIds },
    status: 'Hired'
  });

  // Real monthly applications trend (last 12 months)
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);

  const monthlyApps = await Application.aggregate([
    { $match: { opportunity: { $in: opportunityIds }, createdAt: { $gte: twelveMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const applicationsTrend = Array(12).fill(0);
  const now = new Date();
  monthlyApps.forEach(m => {
    const date = new Date(m._id.year, m._id.month - 1);
    const diffMonths = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
    const idx = 11 - diffMonths;
    if (idx >= 0 && idx < 12) applicationsTrend[idx] = m.count;
  });

  return apiResponse(res, 200, true, 'Dashboard stats fetched', {
    activePostings,
    pipelineCount,
    interviewsCount,
    hiresCount,
    applicationsTrend,
  });
};

// ─── Pipeline ─────────────────────────────────────────────────────────────────

const getPipeline = async (req, res) => {
  const opportunities = await Opportunity.find({ industryPartner: req.user.id }).select('_id');
  const opportunityIds = opportunities.map(o => o._id);

  const applications = await Application.find({ opportunity: { $in: opportunityIds } })
    .populate('student', 'firstName lastName')
    .sort({ createdAt: -1 });

  return apiResponse(res, 200, true, 'Pipeline fetched', applications);
};

const updatePipelineStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const application = await Application.findById(id).populate('opportunity');
  if (!application || application.opportunity.industryPartner.toString() !== req.user.id.toString()) {
    return apiResponse(res, 404, false, 'Application not found or unauthorized');
  }

  application.status = status;
  await application.save();
  return apiResponse(res, 200, true, 'Status updated', application);
};

// ─── Candidates (real data) ───────────────────────────────────────────────────

const searchCandidates = async (req, res) => {
  const skillProfiles = await SkillProfile.find()
    .populate('student', 'firstName lastName major graduationYear readinessScore location institution')
    .lean();

  const candidates = skillProfiles
    .filter(p => p.student) // skip orphaned profiles
    .map(p => ({
      _id: p._id,
      student: p.student,
      skills: p.skills || [],
      matchScore: p.student.readinessScore || 0,
      degree: p.student.major
        ? `${p.student.major} Student`
        : (p.student.degree || 'Student'),
      location: p.student.location || 'Remote',
    }));

  return apiResponse(res, 200, true, 'Candidates fetched', candidates);
};

const getCandidateById = async (req, res) => {
  const { id } = req.params;
  const profile = await SkillProfile.findOne({ student: id })
    .populate('student', 'firstName lastName email major graduationYear bio location readinessScore');
  if (!profile) {
    return apiResponse(res, 404, false, 'Candidate profile not found');
  }
  return apiResponse(res, 200, true, 'Candidate fetched', profile);
};

// ─── Analytics (real data) ────────────────────────────────────────────────────

const getAnalytics = async (req, res) => {
  const opportunities = await Opportunity.find({ industryPartner: req.user.id }).select('_id type');
  const oppIds = opportunities.map(o => o._id);
  const oppTypeMap = {};
  opportunities.forEach(o => { oppTypeMap[o._id.toString()] = o.type; });

  const applications = await Application.find({ opportunity: { $in: oppIds } })
    .populate('student', 'institution')
    .lean();

  // ── Stat cards ──
  const totalApplications = applications.length;
  const hiredApps = applications.filter(a => a.status === 'Hired');
  const offerApps = applications.filter(a => ['Hired', 'Offer'].includes(a.status));
  const offerAcceptRate = offerApps.length > 0
    ? Math.round((hiredApps.length / offerApps.length) * 100)
    : 0;

  // Time-to-hire: approximation using updatedAt - createdAt for Hired apps
  const ttHDays = hiredApps.map(a => {
    const diff = new Date(a.updatedAt) - new Date(a.createdAt);
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
  });
  const avgTimeToHire = ttHDays.length > 0
    ? Math.round(ttHDays.reduce((a, b) => a + b, 0) / ttHDays.length)
    : 0;

  // ── Monthly time-to-hire trend (last 12 months) ──
  const now = new Date();
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);

  const monthlyHired = await Application.aggregate([
    { $match: { opportunity: { $in: oppIds }, status: 'Hired', createdAt: { $gte: twelveMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        avgDays: {
          $avg: {
            $divide: [
              { $subtract: ['$updatedAt', '$createdAt'] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const timeToHireTrend = Array(12).fill(avgTimeToHire);
  monthlyHired.forEach(m => {
    const date = new Date(m._id.year, m._id.month - 1);
    const diffMonths = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
    const idx = 11 - diffMonths;
    if (idx >= 0 && idx < 12) timeToHireTrend[idx] = Math.round(m.avgDays) || avgTimeToHire;
  });

  // ── Applications by source ──
  const universityCount = applications.filter(a => a.student?.institution).length;
  const platformCount = applications.length - universityCount;
  const applicationsBySource = [
    { label: 'University partners', value: universityCount },
    { label: 'Platform matches', value: platformCount },
  ].filter(s => s.value > 0);

  // ── Recruitment funnel ──
  const statusOrder = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];
  const statusCounts = { Applied: 0, Screening: 0, Interview: 0, Offer: 0, Hired: 0 };
  applications.forEach(a => {
    if (statusCounts[a.status] !== undefined) statusCounts[a.status]++;
  });
  const maxFunnelCount = Math.max(...Object.values(statusCounts), 1);
  const recruitmentFunnel = statusOrder.map(label => ({
    label,
    count: statusCounts[label],
    value: Math.round((statusCounts[label] / maxFunnelCount) * 100)
  }));

  // ── Hiring heatmap (opp type × last 6 months) ──
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

  const heatAgg = await Application.aggregate([
    { $match: { opportunity: { $in: oppIds }, createdAt: { $gte: sixMonthsAgo } } },
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
        _id: {
          type: { $ifNull: ['$opp.type', 'other'] },
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    }
  ]);

  // Build heatmap rows and columns
  const heatRows = ['job', 'internship', 'project'];
  const heatColMonths = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    heatColMonths.push({
      label: d.toLocaleString('default', { month: 'short' }),
      month: d.getMonth() + 1,
      year: d.getFullYear()
    });
  }

  const heatData = heatRows.map(row =>
    heatColMonths.map(col => {
      const entry = heatAgg.find(h =>
        h._id.type === row && h._id.month === col.month && h._id.year === col.year
      );
      return entry ? entry.count : 0;
    })
  );

  const heatCols = heatColMonths.map(m => m.label);

  return apiResponse(res, 200, true, 'Analytics fetched', {
    avgTimeToHire,
    totalApplications,
    offerAcceptRate,
    hiresCount: hiredApps.length,
    timeToHireTrend,
    applicationsBySource,
    recruitmentFunnel,
    heatRows,
    heatCols,
    heatData,
  });
};

module.exports = {
  getProfile,
  updateProfile,
  getDashboardStats,
  getPipeline,
  updatePipelineStatus,
  searchCandidates,
  getCandidateById,
  getAnalytics,
};
