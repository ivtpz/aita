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

export default Users;
