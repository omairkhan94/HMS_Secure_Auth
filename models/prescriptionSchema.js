import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  medication: {
    type: String,
    required: [true, "Madication is required!"]
  },
  dosage: {
    type: String,
    required: [true, "Dosage is misssing!"]
  },
  instructions: {
    type: String,
    required: [true, " Instruction of using madicence of such is important!"]
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  }
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;

