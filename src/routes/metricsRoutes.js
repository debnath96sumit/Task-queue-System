const express = require('express');

const createMetricsRoutes = (metricsController) => {
  const router = express.Router();

  router.get('/', metricsController.getMetrics);

  return router;
};

module.exports = createMetricsRoutes;