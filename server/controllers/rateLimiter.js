const redisClient = require("../redis");
module.exports.rateLimiter = async (req,res,next) => {
    const ip = req.connections.remoteAddress.slice(0, 2);
    const response = await redisClient.multi().incr(ip).expire(60).exec();
    //console.log(response);
}