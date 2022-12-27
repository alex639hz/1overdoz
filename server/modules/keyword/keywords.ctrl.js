const { Keyword } = require('./keyword.model');
const { Community } = require('../community/community.model');
const errorHandler = require('../../helpers/dbErrorHandler');

const create = async (req, res) => {

  const arr = [...req.body]
    .map(keyword => ({ keyword }))

  try {
    const keywords = await Keyword.insertMany(arr, { ordered: false });

    return res.status(201).json({
      message: "Keywords created successfully!",
      keywords: [...await Keyword.find({}, "keyword").lean()]
        .map((elem) => elem.keyword)
    })

  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    })
  }

}

const list = async (req, res) => {

  try {
    const keywords = [...await Keyword.find({}, "keyword", { lean: true })]
      .map((elem) => elem.keyword)

    return res.status(200).json({
      keywords
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    })
  }


}


module.exports = {
  create,
  list,

}
