const mongoose = require('mongoose');

const availabilitySlotSchema = new mongoose.Schema({
  day: { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] },
  startTime: String,
  endTime: String,
  isAvailable: { type: Boolean, default: true },
});

const advocateProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    barCouncilNumber: { type: String, trim: true },
    designation: { type: String, default: 'Advocate' },
    bio: { type: String, maxlength: 2000 },
    practiceAreas: [{ type: String, enum: ['Criminal Law','Family Law','Property Law','Corporate Law','Civil Law','Consumer Law','Labour Law','Intellectual Property','Tax Law','Constitutional Law'] }],
    experience: { type: Number, default: 0 },
    education: [{ degree: String, institution: String, year: Number }],
    languages: [String],
    location: {
      city: String,
      state: String,
      country: { type: String, default: 'India' },
    },
    consultationFee: { type: Number, default: 500 },
    consultationTypes: [{ type: String, enum: ['audio', 'video', 'in-person'] }],
    availability: [availabilitySlotSchema],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    totalCases: { type: Number, default: 0 },
    isProfileComplete: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    profilePhoto: String,
    court: String,
  },
  { timestamps: true }
);

advocateProfileSchema.index({ practiceAreas: 1 });
advocateProfileSchema.index({ rating: -1 });
advocateProfileSchema.index({ 'location.city': 1 });

module.exports = mongoose.model('AdvocateProfile', advocateProfileSchema);
