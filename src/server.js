const app = require('./app');
const Logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  Logger.info(`Task Queue System running on port ${PORT}`);
  Logger.info(`API Documentation: http://localhost:${PORT}/api-docs`);
  Logger.info(`Health Check: http://localhost:${PORT}/health`);
});