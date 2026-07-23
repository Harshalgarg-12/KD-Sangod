const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    partyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Party',
      required: [true, 'Party ID is required'],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be at least 1 Rupee'],
    },
    type: {
      type: String,
      enum: ['DEBIT', 'CREDIT'],
      required: [true, 'Transaction type is required'],
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    remarks: {
      type: String,
      trim: true,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: [true, 'Created by admin reference is required'],
    },
    balanceAfterTransaction: {
      type: Number,
      required: [true, 'balanceAfterTransaction is required'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Compound index for fast queries and ledger sorting
transactionSchema.index({ partyId: 1, date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
