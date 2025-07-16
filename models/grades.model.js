import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  yearLevel: { type: String, required: true },
  prelimGrade: { type: Number, default: 0 },
  midtermGrade: { type: Number, default: 0},
  finalGrade: {type: Number, default: 0},
  averageGrade: {type: Number, default: 0}
});

export default mongoose.model('Grade', gradeSchema);