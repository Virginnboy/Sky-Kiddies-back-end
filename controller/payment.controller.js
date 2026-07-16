const bankDetailsModel = require("../models/bankAccount.model");
const AppError = require("../errors/AppError");
const catchAsync = require("../utils/catchAsync");

const createBankAccount = catchAsync(async (req, res, next) => {

    const { accountName, accountNumber, bankName, accountType } = req.body;
    
    if (!accountName || !accountNumber || !bankName || !accountType) {
      return next("All fields are required", 400)
    }

    let newAccountDetails = new bankDetailsModel.create({
      accountName, accountNumber, accountType, bankName
    });

    await newAccountDetails.save();

    return res.status(201).json({
      status: "Success",
      message: "Payment info saved successfully", 
      data: newAccountDetails
    });
});

const fetchAccountDetails = catchAsync(async (req, res, next)=> {
    const bankDetails = await bankDetailsModel.find();

    if(!bankDetails) return next(new AppError("Bank details not found", 404));

    return res.status(200).json(bankDetails);
});

const fetchAccountById = catchAsync(async (req, res, next) => {
  const accountId = req.params.accountId

    const accountDetails = await bankDetailsModel.findById({_id: accountId})

    if (!accountDetails) {
      return next(new AppError("Account not found", 404));
    }

    return res.status(200).json({
      status: "Success",
      data: accountDetails
  });
});

const editAccountDetails = catchAsync(async (req, res, next)=> {
  const {accountId} = req.params
  const { accountName, accountNumber, bankName, accountType } = req.body;
    const updatedAccount = await bankDetailsModel.findByIdAndUpdate(accountId, {$set:{ accountName, accountNumber, bankName, accountType }}, {new: true});

    if (!updatedAccount) {
      return next(new AppError("Account not found", 404));
    }

    return res.status(200).json({
      status: "Success",
      message: "Account updated successfully", 
      data: updatedAccount
    })
})

module.exports = { createBankAccount, fetchAccountDetails, fetchAccountById, editAccountDetails };