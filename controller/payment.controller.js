const bankDetailsModel = require("../models/bankAccount.model");

const createBankAccount = async (req, res) => {
  try {
    const { accountName, accountNumber, bankName, accountType } = req.body;
    
    if (!accountName || !accountNumber || !bankName || !accountType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let newAccountDetails = new bankDetailsModel.create({
      accountName, accountNumber, accountType, bankName
    });

    await newAccountDetails.save();

    return res.status(200).json({
      message: "Payment info saved successfully", 
      newAccountDetails
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const fetchAccountDetails = async (req, res)=> {
  try {
    const bankDetails = await bankDetailsModel.find()

    return res.status(200).json(bankDetails);

  }catch(err) {
    console.error(err)
  }

}

const fetchAccountById = async (req, res) => {
  const accountId = req.params.accountId

  try {
    const accountDetails = await bankDetailsModel.findById({_id: accountId})

    if (!accountDetails) {
      return res.status(404).json({message: "Account not found"})
    }

    return res.status(200).json(accountDetails)
  }catch (err) {
    console.log(err)
    return res.status(500).json({message: "Server Error"})
  }
}

const editAccountDetails = async (req, res)=> {
  const {accountId} = req.params.accountId
  const { accountName, accountNumber, bankName, accountType } = req.body;
  console.log(accountId)
  console.log(req.body)
  try {
    const updatedAccount = await bankDetailsModel.findByIdAndUpdate(accountId, {$set:{ accountName, accountNumber, bankName, accountType }}, {new: true});

    if (!updatedAccount) {
      return res.status(400).json({message: "Account not found"})
    }

    return res.status(200).json({message: "Account updated successfully", updatedAccount})
  }catch(err) {
    console.log(err)
    return res.status(500).json({message: "Server error"})
  }
}

module.exports = { createBankAccount, fetchAccountDetails, fetchAccountById, editAccountDetails };