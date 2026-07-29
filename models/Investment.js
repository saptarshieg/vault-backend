const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accountNo: String,
  bankName: String,
  openDate: Date,
  maturityDate: Date,
  term: String,
  initialAmount: Number,
  interestRate: Number,
  interestAmount: Number,
  maturityAmount: Number,
  nominee: String,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Investment', investmentSchema);