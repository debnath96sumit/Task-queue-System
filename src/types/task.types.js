/**
 * @typedef {Object} Task
 * @property {string} id - UUID
 * @property {'sms'|'email'|'webhook'} type
 * @property {'pending'|'completed'|'failed'} status
 * @property {'high'|'medium'|'low'} priority
 * @property {Object} payload
 * @property {Date} createdAt
 * @property {number} retryCount
 */

module.exports = {};