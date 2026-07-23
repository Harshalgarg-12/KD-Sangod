const mongoose = require('mongoose');

const partySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'],
    },
    type: {
      type: String,
      enum: ['CUSTOMER', 'SUPPLIER'],
      required: [true, 'Party type is required'],
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: [true, 'Location is required'],
    },
    // customerCategory: only used for CUSTOMER type parties
    // Helps differentiate between regular walk-in customers and shopkeepers
    customerCategory: {
      type: String,
      enum: ['REGULAR', 'SHOPKEEPER'],
    },
    netBalance: {
      type: Number,
      default: 0,
    },
    fathersName: {
      type: String,
      trim: true,
      required: [
        function () {
          return this.type === 'CUSTOMER';
        },
        "Father's name is required for customers",
      ],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: [true, 'Creator admin reference is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Pre-validate hook to nullify fathersName automatically when type is SUPPLIER
partySchema.pre('validate', function (next) {
  if (this.type === 'SUPPLIER') {
    this.fathersName = undefined;
    this.customerCategory = undefined; // Clear category for suppliers
  }
  next();
});

// Indexes for pagination, search, and sorting
partySchema.index({ type: 1, isActive: 1, name: 1 });
partySchema.index({ phone: 1, type: 1 });

module.exports = mongoose.model('Party', partySchema);
