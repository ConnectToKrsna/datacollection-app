import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  area: String,
  remarks: String,
});

export default mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);
