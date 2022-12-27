const Redis = require('ioredis')
const config = require('../config/config')
const { User } = require('../modules/user/user.model');



const redisSub = new Redis()
redisSub.subscribe(config.topicsNames.keywordAlertTopic)
redisSub.on('message', async (channel, msg) => {

  console.log(`email::---- channel:${channel} keywords:${msg}`)

})

