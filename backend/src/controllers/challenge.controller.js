const Challenge = require('../models/Challenge.model');
const apiResponse = require('../utils/apiResponse');

const getChallenges = async (req, res) => {
  let challenges = await Challenge.find().sort({ deadline: 1 });
  
  if (challenges.length === 0) {
    // Seed challenges if empty
    challenges = await Challenge.insertMany([
      { title: "Analytics Sprint", difficulty: "Beginner", rewardXP: 500, deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
      { title: "ML Model Showdown", difficulty: "Advanced", rewardXP: 1500, deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
      { title: "SQL Query Golf", difficulty: "Intermediate", rewardXP: 800, deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
    ]);
  }

  return apiResponse(res, 200, true, 'Challenges fetched', challenges);
};

const joinChallenge = async (req, res) => {
  const { id } = req.params;
  const challenge = await Challenge.findById(id);
  if (!challenge) {
    return apiResponse(res, 404, false, 'Challenge not found');
  }

  if (!challenge.participants.includes(req.user.id)) {
    challenge.participants.push(req.user.id);
    await challenge.save();
  }

  return apiResponse(res, 200, true, 'Joined challenge successfully', challenge);
};

module.exports = { getChallenges, joinChallenge };
