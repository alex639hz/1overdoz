const Redis = require('ioredis')
const { serviceGetStatusOfFailedTx } = require('../config/config').topicsNames



const redisSub = new Redis()
redisSub.subscribe(serviceGetStatusOfFailedTx)
redisSub.on('message', async (channel, msg) => {

  console.log(`tx-check::---- channel:${channel} keywords:${msg}`)

})

