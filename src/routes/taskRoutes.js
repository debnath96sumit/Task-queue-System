const express = require('express');
const ValidationMiddleware = require('../middleware/validation');

const createTaskRoutes = (taskController) => {
  const router = express.Router();

  router.post(
    '/',
    ValidationMiddleware.validateAddTask,
    taskController.addTask
  );

  router.get(
    '/',
    ValidationMiddleware.validatePagination,
    ValidationMiddleware.validateTaskFilters,
    taskController.getAllTasks
  );

  router.get('/:id', taskController.getTaskById);

  router.delete('/:id', taskController.deleteTask);

  return router;
};

module.exports = createTaskRoutes;