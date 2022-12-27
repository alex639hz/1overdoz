const extend = require('lodash/extend');
const { Account } = require('./account.model');
// const utils = require('./account.util');
const { Keyword } = require('../keyword/keyword.model');
const errorHandler = require('../../helpers/dbErrorHandler');
const { serviceGetStatusOfFailedTx } = require('../../config/config').topicsNames

// const Redis = require('ioredis');
// const redisPub = new Redis()

const accountByID = async (req, res, next, id) => {
  try {
    let account = await Account.findById(id).lean()
    if (!account)
      return res.status('400').json({
        error: "Account not found"
      })
    req.account = account
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve account"
    })
  }
}

const createInitial = async (req, res) => {
  const account = new Account(req.body.account)

  try { await account.save() }
  catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }

  return res.status(201).json({
    message: "Account created successfully!",
    account
  })

}

const createTx = async (req, res) => {
  const sender = req.body.tx.sender || ''
  const receiver = req.body.tx.receiver || ''
  const amount = req.body.tx.amount || 0
  const title = req.body.tx.title || ''
  const raw = `${sender},${receiver},${amount},${title}`
  let accountSender;

  // try to update sender account
  try {
    accountSender = await Account.findOneAndUpdate(
      {
        owner: sender,
        balance: { $gte: amount },
        outTxs: { $ne: raw }
      },
      {
        $inc: { balance: -amount },
        $addToSet: { outTxs: raw }
      },
      {
        new: true,
        lean: true,
      }
    )
  }
  catch (err) {
    return res.status(500).json({
      error: errorHandler.getErrorMessage(err)
    })
  }

  // get failed tx error and generate response message
  if (!accountSender) {
    if (0) {
      redisPub.publish(serviceGetStatusOfFailedTx, `${JSON.stringify("any data...")}`);

      accountSender = await Account.findOne(
        {
          owner: sender,
        },
        {
          balance: true,
          txs: true,
        },
        {
          lean: true,
        }
      )

      const message = !accountSender ?
        "sender account not fount" : accountSender.balance < amount ?
          "Balance Failure" : accountSender.txs.includes(raw) ?
            "tx already exist" : 'unknown tx failure';

      return res.status(400).json({
        message,
        accountSender,
      })
    } else {
      return res.status(400).json({
        message: "sender account not found`",
      })
    }
  }

  //  update receiver account
  const accountReceiver = await Account.findOneAndUpdate(
    { owner: receiver },
    {
      $inc: { balance: +amount },
      $addToSet: { inTxs: raw },
    },
    {
      new: true,
      lean: true,
      upsert: true
    },
  )

  return res.status(201).json({
    message: "Tx created successfully!",
    accountSender: accountSender || {},
    accountReceiver: accountReceiver || {},
  })



}

const create = async (req, res) => {
  const account = new Account(req.body.account)

  try { await account.save() }
  catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }

  return res.status(201).json({
    message: "Account created successfully!",
    account
  })
}

const read = async (req, res) => {
  const result = await Account.aggregate([
    {
      $match: {
        // check sender account balance
        receiver: "1001"
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    }
  ]);


  return res.json(result)
}

const read_example = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}

/** list accounts 
 * DONE: A section In the app where the user sees accounts which are “recommended” to him. Ranked by “relevance” score - descending 
 * 
 * Account A author is from the same country as the requesting user, account B isn’t. A is ranked higher then B (returned first in the array) even if B has a higher weighted score
 * Account A and B authors are from the same country as the requesting user. The account with the highest weighted score is returned first
 * Account A and B authors are not from the same country as the requesting user. The account with the highest weighted score is returned first 
 * No accounts are found from one of the users communities - the feed is empty (empty array response)
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const listByCommunity = async (req, res) => {
  const myArr = await Account.aggregate(
    [
      { $match: { community: req.community.title } },
      { $sort: { "score": -1 } },
      {
        $group: {
          _id: { country: "$country" },
          docs: {
            $push: {
              title: "$title",
              body: "$body",
              score: "$score",
              country: "$country",
              community: req.community.title
            }
          },
        }
      },

    ]
  )

  res.json([
    ...myArr['0'].docs,
    ...myArr['1'].docs,
  ])

}

const listFeed = async (req, res) => {

  const result = await Account.aggregate([
    {
      $match: {
        community: { $in: req.profile.communities },
        status: "approved",
      }
    },
    {
      $facet: {
        "local": [
          { $match: { country: req.profile.country } },
          { $sort: { "score": -1 } },
        ],
        "nonLocal": [
          { $match: { country: { $ne: req.profile.country } } },
          { $sort: { "score": -1 } },
        ],
      },
    }
  ])

  res.json(
    [...result[0].local, ...result[0].nonLocal],
  )

}

const update = async (req, res) => {
  try {
    let account = req.profile
    account = extend(account, req.body)
    account.updated = Date.now()
    await account.save()
    account.hashed_password = undefined
    account.salt = undefined
    res.json(account)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const remove = async (req, res) => {
  try {
    let account = req.profile
    let deletedUser = await account.remove()
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const approveAccount = async (req, res) => {
  try {
    const result = await Account.findOneAndUpdate({
      _id: req.account._id,
      status: "pending",
    }, {
      status: "approved",
    }, {
      new: true,
      lean: true
    })

    if (!result) {
      return res.status(400).json({
        error: 'Cannot approve account: ' + req.account._id
      })
    }

    res.status(200).json({ result })


  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**
 * 1 verify account signature of content (ie. account instructions)
 * 2 verify the account content ie. balance
 * 3 store account as document in db
 */
const sendAccount = async (req, res) => {
  const sender = "";
  const receiver = "";
  const hash = "";
  const prevHash = "";
  const title = "";
  const data = "";
  const amount = 0;
  const fee = 0;

  const result = await Account.aggregate([
    {
      $match: {
        receiver: "1001"
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    },
    {
      $match: {
        // check sender account balance
        total: { $gte: 10 }
      },
    },
  ]);

  /**
   * https://docs.mongodb.com/manual/reference/operator/aggregation/match/#perform-a-count
   */

  const account = new Account({
    userAccountBody,
    userAccountSignature,
    hash,
  })

}

/**
 * 1 get all accounts where receiver is account.sender 
 * 2 return calculated account income balance
 */
const getBalance = async (req, res) => {
  //  
  // 
  const arr = [10, 20, 30]
}

module.exports = {
  create,
  createTx,
  createInitial,
  accountByID,
  read,
  update,
  remove,
  listByCommunity,
  listFeed,
  approveAccount,
  sendAccount,
  getBalance,
}
