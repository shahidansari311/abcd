const mongoose = require('mongoose');

const skillGraphNodeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, enum: ['technical', 'soft', 'tool', 'domain'], required: true },
  description: { type: String },
  relatedSkills: [{
    skillRef: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillGraphNode' },
    relationshipType: { type: String, enum: ['prerequisite', 'related', 'similar'] },
    weight: { type: Number, default: 1 }
  }],
  demandTrend: { type: Number, default: 0 }, // -1 to 1 based on market demand
}, { timestamps: true });

module.exports = mongoose.model('SkillGraphNode', skillGraphNodeSchema);
