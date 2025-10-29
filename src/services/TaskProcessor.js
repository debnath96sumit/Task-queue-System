const { STATUS, MAX_RETRIES, MAX_CONCURRENT_TASKS, TASK_TYPES} = require('../config/constants');  
const Logger = require('../utils/logger');

class TaskProcessor {
    constructor(taskQueue, rateLimiter) {
        this.taskQueue = taskQueue;
        this.rateLimiter = rateLimiter;
        this.activeTasks = 0;
        this.isProcessing = false;
    }

    start(){
        if(this.isProcessing) return;
        this.isProcessing = true;
        Logger.info(`Task processor started.`);
        this.processLoop();
    }

    stop(){
        this.isProcessing = false;
        Logger.info(`Task processor stopped.`);
    }

    async processLoop(){
        while(this.isProcessing){
            if (this.activeTasks < MAX_CONCURRENT_TASKS) {
                const task = this.taskQueue.getNextTask();
                if (task) {
                    if (this.rateLimiter.canProcess(task.type)) {
                        this.processTask(task);
                    }else{
                        this.taskQueue.requeueTask(task);
                        Logger.warn(`Task with ID ${task.id} requeued.`);
                    }
                }
            }

            await this.sleep(100);
        }
    }

    async processTask(task){
        this.activeTasks++;
        Logger.info(`Processing task with ID ${task.id}`);

        try {
            this.rateLimiter.consume(task.type);
            await this.executeTask(task);
            this.taskQueue.updateTaskStatus(task.id, STATUS.COMPLETED);
            Logger.info(`Task with ID ${task.id} completed.`);
        } catch (error) {
            Logger.error(`Error processing task with ID ${task.id}`, error);
            if (task.retryCount < MAX_RETRIES) {
                this.taskQueue.requeueTask(task);
                Logger.warn(`Task with ID ${task.id} requeued. Retry count: ${task.retryCount}`);
            }else{
                this.taskQueue.updateTaskStatus(task.id, STATUS.FAILED);
                Logger.warn(`Task with ID ${task.id} failed after ${task.retryCount} retries.`);
            }
        }finally{
            this.activeTasks--;
        }
    }

    async executeTask(task){
        let executionTime = 1000;
        if (task.type === TASK_TYPES.EMAIL) {
            //2 to 4 secconds
            executionTime = Math.floor(Math.random() * 2000) + 2000;
        }else if (task.type === TASK_TYPES.SMS) {
            //1 to 3 seconds
            executionTime = Math.floor(Math.random() * 3000) + 1000;
        }else if (task.type === TASK_TYPES.WEBHOOK) {
            //1 to 3 seconds
            executionTime = Math.floor(Math.random() * 3000) + 1000;
        }

        await this.sleep(executionTime);
        if (Math.random < 0.1) {
            throw new Error('Task execution failed.');
        }

        Logger.debug(`Executing task with ID ${task.id} for ${executionTime} milliseconds.`);
    }

    sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getActiveTaskCount(){
        return this.activeTasks;
    }
}

module.exports = TaskProcessor; 