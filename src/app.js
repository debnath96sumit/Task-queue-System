const express = require('express'); 
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const path = require('path');

const TaskQueue = require('./services/TaskQueue');
const TaskProcessor = require('./services/TaskProcessor');
const RateLimiter = require('./services/RateLimiter');
const MetricsController = require('./controllers/metricController');
const TaskController = require('./controllers/taskController');
const taskRoutes = require('./routes/taskRoutes');
const metricsRoutes = require('./routes/metricsRoutes');
const errorHandler = require('./middleware/errorHandler');
const ValidationMiddleware = require('./middleware/validation');
const Logger = require('./utils/logger');

const taskQueue = new TaskQueue(); 
const rateLimiter = new RateLimiter(); 
const taskProcessor = new TaskProcessor(taskQueue, rateLimiter);

const taskController = new TaskController(taskQueue); 
const metricsController = new MetricsController(taskQueue, rateLimiter, taskProcessor);

taskProcessor.start();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next)=>{
    Logger.info(`${req.method} ${req.url}`); 
    next();
})

app.get('/health', (req, res)=>{
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
})

app.use('/api/tasks', taskRoutes(taskController));
app.use('/api/metrics', metricsRoutes(metricsController));  


try {
    const swaggerDocument = yaml.load(path.join(__dirname, '../swagger.yaml'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
    Logger.error('Error loading swagger.yaml:', error);
}


app.use((req, res)=>{
    res.status(404).json({ error: 'Route Not found' });
})

app.use(errorHandler);

module.exports = app;