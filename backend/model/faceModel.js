const mongoose = require("mongoose");

const faceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  label: {
    type: String,
    required: true,
    unique: true,
  },
  mobile_number: {
    type: String,
    required: true,
    unique: true,
  },
  regionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Region",
    required: true,
  },
  hasVoted: {
    type: Boolean,
    default: false,
  },
  imagePaths: {
    type: [String],
    default: [],
  },
  fingerprintData: {
    type: Object, 
    required: true,
  },
});

const Face = mongoose.model("Face", faceSchema);

module.exports = Face;
