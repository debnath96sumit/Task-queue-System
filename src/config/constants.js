module.exports = {
    TASK_TYPES: {
        SMS: "sms",
        EMAIL: "email",
        WEBHOOK: "webhook"
    },

    PRIORITIES: {
        LOW: 'low',
        MEDIUM: 'medium',
        HIGH: 'high'
    },

    STATUS: {
        PENDING: 'pending',
        COMPLETED: 'completed',
        FAILED: 'failed'
    },

    RATE_LIMITS: {
        sms: { limit: 15, window: 60000 },
        email: { limit: 10, window: 60000 },
        webhook: { limit: 20, window: 60000 }
    },

    MAX_RETRIES: 3,
    MAX_CONCURRENT_TASKS: 5,
    PRIORITY_ORDER: {
        high: 1,
        medium: 2,
        low: 3
    }
}