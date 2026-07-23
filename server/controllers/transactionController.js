const mongoose = require('mongoose');
const Party = require('../models/Party');
const Transaction = require('../models/Transaction');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create a transaction (session-wrapped atomic balance update)
// @route   POST /api/transactions
// @access  Private
const createTransaction = asyncHandler(async (req, res) => {
  const { partyId, amount, type, date, remarks } = req.body;

  if (!partyId || !amount || !type) {
    return res.status(400).json({
      success: false,
      message: 'Party ID, amount, and transaction type are required',
      data: null,
    });
  }

  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount < 1) {
    return res.status(400).json({
      success: false,
      message: 'Amount must be a number and at least 1 Rupee',
      data: null,
    });
  }

  if (!['DEBIT', 'CREDIT'].includes(type)) {
    return res.status(400).json({
      success: false,
      message: 'Transaction type must be DEBIT or CREDIT',
      data: null,
    });
  }

  const session = await mongoose.startSession();
  let createdTransactionDoc;

  try {
    await session.withTransaction(async () => {
      // 1. Fetch and verify party
      const party = await Party.findOne({ _id: partyId, isActive: true }).session(session);
      if (!party) {
        throw new Error('Party not found or is inactive');
      }

      // 2. Calculate balanceChange
      // CREDIT = "You Gave" (increases party's owed balance to you)
      // DEBIT = "You Got" (decreases balance)
      const balanceChange = type === 'CREDIT' ? numericAmount : -numericAmount;

      // 3. Update netBalance
      party.netBalance += balanceChange;
      await party.save({ session });

      // 4. Create transaction log
      const [transaction] = await Transaction.create(
        [
          {
            partyId,
            amount: numericAmount,
            type,
            date: date || undefined,
            remarks: remarks || '',
            createdBy: req.admin._id,
            balanceAfterTransaction: party.netBalance,
          },
        ],
        { session }
      );

      createdTransactionDoc = transaction;
    });

    await session.endSession();

    res.status(201).json({
      success: true,
      message: 'Transaction recorded successfully',
      data: createdTransactionDoc,
    });
  } catch (error) {
    await session.endSession();
    return res.status(400).json({
      success: false,
      message: error.message || 'Transaction recording failed',
      data: null,
    });
  }
});

// @desc    Get party transactions history (paginated ledger)
// @route   GET /api/transactions/party/:partyId
// @access  Private
const getPartyTransactions = asyncHandler(async (req, res) => {
  const { partyId } = req.params;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 20, 1);
  const skip = (page - 1) * limit;

  // Retrieve party first
  const party = await Party.findOne({ _id: partyId, isActive: true }).lean();
  if (!party) {
    return res.status(404).json({
      success: false,
      message: 'Party not found',
      data: null,
    });
  }

  const filter = {
    partyId,
    isDeleted: { $ne: true }
  };

  // Fetch transactions sorted by date descending (running balance snapshots included)
  const [results, totalCount] = await Promise.all([
    Transaction.find(filter)
      .populate('createdBy', 'name')
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Transaction.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  res.status(200).json({
    success: true,
    message: 'Party transaction ledger fetched successfully',
    data: {
      results,
      totalPages,
      currentPage: page,
      totalCount,
    },
  });
});

// @desc    Get all transactions (filterable by date range and type for reports, paginated)
// @route   GET /api/transactions
// @access  Private
const getAllTransactions = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 50, 1);
  const skip = (page - 1) * limit;

  const filter = { isDeleted: { $ne: true } };

  if (req.query.type) {
    const queryType = req.query.type.toUpperCase();
    if (['DEBIT', 'CREDIT'].includes(queryType)) {
      filter.type = queryType;
    }
  }

  // Date filters
  if (req.query.startDate || req.query.endDate) {
    filter.date = {};
    if (req.query.startDate) {
      filter.date.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      // Set end of day for the end date to include all of it
      const end = new Date(req.query.endDate);
      end.setHours(23, 59, 59, 999);
      filter.date.$lte = end;
    }
  }

  const [results, totalCount] = await Promise.all([
    Transaction.find(filter)
      .populate('partyId', 'name type phone')
      .populate('createdBy', 'name')
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Transaction.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  res.status(200).json({
    success: true,
    message: 'Transactions list fetched successfully',
    data: {
      results,
      totalPages,
      currentPage: page,
      totalCount,
    },
  });
});

// @desc    Delete a transaction (session-wrapped atomic balance reversal, restricted to SUPER_ADMIN)
// @route   DELETE /api/transactions/:id
// @access  Private/SuperAdmin
const deleteTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // 1. Fetch transaction
      const transactionToDelete = await Transaction.findOne({ _id: id, isDeleted: { $ne: true } }).session(session);
      if (!transactionToDelete) {
        throw new Error('Transaction not found');
      }

      // 2. Fetch party
      const party = await Party.findById(transactionToDelete.partyId).session(session);
      if (!party) {
        throw new Error('Associated party not found');
      }

      // 3. Reverse the balance change
      // If original type was CREDIT (increased balance), we must subtract
      // If original type was DEBIT (decreased balance), we must add
      const balanceReversal = transactionToDelete.type === 'CREDIT' ? -transactionToDelete.amount : transactionToDelete.amount;

      party.netBalance += balanceReversal;
      await party.save({ session });

      // 4. Mark the target transaction as deleted (soft-delete)
      transactionToDelete.isDeleted = true;
      await transactionToDelete.save({ session });
    });

    await session.endSession();

    res.status(200).json({
      success: true,
      message: 'Transaction deleted and balance reversed successfully',
      data: null,
    });
  } catch (error) {
    await session.endSession();
    return res.status(400).json({
      success: false,
      message: error.message || 'Transaction deletion and reversal failed',
      data: null,
    });
  }
});

module.exports = {
  createTransaction,
  getPartyTransactions,
  getAllTransactions,
  deleteTransaction,
};
