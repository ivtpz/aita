import mongoose from 'mongoose';

const host = process.env.DBHOST || 'localhost';

mongoose.connect(`mongodb://${host}/aita`);

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  references: [String],
  recommendations: [String],
  lastUpdated: Date
});

const Users = mongoose.model('User', userSchema);

const subjectCountSchema = new mongoose.Schema({
  id: String,
  name: String,
  count: Number
});

const SubjectCounts = mongoose.model('SubjectCount', subjectCountSchema);

const subjectCountYearSchema = new mongoose.Schema({
  id: String,
  name: String,
  count: Number,
  year: String
});

const SubjectCountYears = mongoose.model('SubjectCountYear', subjectCountYearSchema);

export {
  Users,
  SubjectCounts,
  SubjectCountYears
};
