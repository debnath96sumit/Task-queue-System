const { RATE_LIMITS } = require('../config/constants');
const Logger = require('../utils/logger');

class RateLmiter {
    constructor(){
        this.buckets = {
            sms: {tokens: RATE_LIMITS.sms.limit, lastRefill: Date.now()},
            email: {tokens: RATE_LIMITS.email.limit, lastRefill: Date.now()},
            webhook: {tokens: RATE_LIMITS.webhook.limit, lastRefill: Date.now()}
        }

        this.startRefillInterval();
    }

    startRefillInterval(){
        setInterval(() => {
            Object.keys(this.buckets).forEach(type => {
                const config = RATE_LIMITS[type];
                const bucket = this.buckets[type];
                const now = Date.now();
                const timePassed = now - bucket.lastRefill;

                if (timePassed >= config.window){
                    bucket.tokens = config.limit;
                    bucket.lastRefill = now;
                    Logger.debug(`Rate limit for ${type} has been reset.`)
                }
            });
        }, 1000)
    }

    canProcess(taskType){
        const bucket = this.buckets[taskType];
        return bucket && bucket.tokens > 0
    }

    consume(taskType){
        const bucket = this.buckets[taskType];
        if (bucket && bucket.tokens > 0){
            bucket.tokens--;
            Logger.debug(`Rate limit for ${taskType} has been consumed.`)
            return true;
        }
        return false;
    }

    getRemainingTokens(taskType){
        const bucket = this.buckets[taskType];
        return bucket ? bucket.tokens : 0;
    }

    getAllRateLimits(){
        return Object.keys(this.buckets).reduce((acc, type)=>{
            acc[type] = {
                remaining: this.buckets[type].tokens,
                limit: RATE_LIMITS[type].limit
            };
            return acc;
        }, {})
    }
}

module.exports = RateLmiter;