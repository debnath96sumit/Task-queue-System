const {v4: uuidv4} = require('uuid');
const {STATUS, PRIORITIES, PRIORITY_ORDER } = require('../config/constants');
const Logger = require('../utils/logger');

class TaskQueue {
    constructor(){
        this.queues = {
            high: [],
            medium: [],
            low: []
        },
        this.allTasks = new Map();
        this.metrics = { totalProcessed: 0, pending: 0, completed: 0, failed: 0 };
    }

    addTask(taskData){
        const task = {
            id: uuidv4(),
            type: taskData.type,
            status: STATUS.PENDING,
            priority: taskData.priority,
            payload: taskData.payload,
            createdAt: new Date(),
            retryCount: 0
        };

        this.queues[task.priority].push(task);
        this.allTasks.set(task.id, task);
        this.metrics.pending++;
        Logger.info(`Task added to queue with ID: ${task.id}`);
        return task;
    }

    getNextTask(){
        for (const priority of ['high', 'medium', 'low']) {
            if (this.queues[priority].length > 0) {
                const task = this.queues[priority].shift();
                return task;
            }
        }
        return null;
    }

    updateTaskStatus(taskId, newStatus) {
        const task = this.allTasks.get(taskId);
        if(!task) return false;

        const oldStatus = task.status;
        task.status = newStatus;

        if (oldStatus === STATUS.PENDING) {
            this.metrics.pending--;
        }
        if (newStatus === STATUS.COMPLETED) {
            this.metrics.completed++;
            this.metrics.totalProcessed++;
        } else if (newStatus === STATUS.FAILED) {
            this.metrics.failed++;
            this.metrics.totalProcessed++;
        }

        Logger.info(`Task with ID ${taskId} status updated from ${oldStatus} to ${newStatus}`);
        return true;
    }

    requeueTask(task){
        task.retryCount += 1;
        task.status = STATUS.PENDING;
        this.queues[task.priority].push(task);
        Logger.warn(`Task with ID ${task.id} requeued. Retry count: ${task.retryCount}`);
    }

    getAllTasks(filters = {}){
        let tasks = Array.from(this.allTasks.values());
        if(filters.type) tasks = tasks.filter(task => task.type === filters.type);
        if(filters.status) tasks = tasks.filter(task => task.status === filters.status);
        if(filters.priority) tasks = tasks.filter(task => task.priority === filters.priority);

        return tasks.sort((a, b) => a.createdAt - b.createdAt);
    }

    getTaskById(taskId){
        return this.allTasks.get(taskId) ?? null;
    }

    deleteTask(taskId) {
        const task = this.allTasks.get(taskId);
        if(!task) return false;

        if(task.status === STATUS.PENDING){
            const queue = this.queues[task.priority];
            const index = queue.findIndex(t => t.id === taskId);
            if (index !== -1) {
                queue.splice(index, 1);
                this.metrics.pending--;
            }
        }

        this.allTasks.delete(taskId);
        Logger.info(`Task with ID ${taskId} deleted`);
        return true;
    }

    getMetrics(){
        return {
            ...this.metrics,
            queueSizes: {
                high: this.queues.high.length,
                medium: this.queues.medium.length,
                low: this.queues.low.length
            }
        }
    }
    getPendingCount(){
        return this.metrics.pending
    }
}

module.exports = TaskQueue;