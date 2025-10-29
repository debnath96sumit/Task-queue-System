const ApiResponse = require('../utils/response');
const Logger = require('../utils/logger');

class TaskController {
  constructor(taskQueue) {
    this.taskQueue = taskQueue;
  }

  addTask = (req, res) => {
    try {
      const { type, priority, payload } = req.body;
      const task = this.taskQueue.addTask({ type, priority, payload });
      
      const response = ApiResponse.created(task, 'Task created successfully');
      res.status(response.statusCode).json(response);
    } catch (error) {
      Logger.error('Error adding task:', error);
      const response = ApiResponse.error('Failed to create task');
      res.status(response.statusCode).json(response);
    }
  };

  getAllTasks = (req, res) => {
    try {
      const { type, status, priority } = req.query;
      const { page, limit } = req.pagination;

      const filters = { type, status, priority };
      const allTasks = this.taskQueue.getAllTasks(filters);

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTasks = allTasks.slice(startIndex, endIndex);

      const response = ApiResponse.paginated(
        paginatedTasks,
        page,
        limit,
        allTasks.length
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      Logger.error('Error getting tasks:', error);
      const response = ApiResponse.error('Failed to retrieve tasks');
      res.status(response.statusCode).json(response);
    }
  };

  getTaskById = (req, res) => {
    try {
      const { id } = req.params;
      const task = this.taskQueue.getTaskById(id);

      if (!task) {
        const response = ApiResponse.notFound('Task not found');
        return res.status(response.statusCode).json(response);
      }

      const response = ApiResponse.success(task, 'Task retrieved successfully');
      res.status(response.statusCode).json(response);
    } catch (error) {
      Logger.error('Error getting task by ID:', error);
      const response = ApiResponse.error('Failed to retrieve task');
      res.status(response.statusCode).json(response);
    }
  };

  deleteTask = (req, res) => {
    try {
      const { id } = req.params;
      const deleted = this.taskQueue.deleteTask(id);

      if (!deleted) {
        const response = ApiResponse.notFound('Task not found');
        return res.status(response.statusCode).json(response);
      }

      const response = ApiResponse.success(null, 'Task deleted successfully');
      res.status(response.statusCode).json(response);
    } catch (error) {
      Logger.error('Error deleting task:', error);
      const response = ApiResponse.error('Failed to delete task');
      res.status(response.statusCode).json(response);
    }
  };
}

module.exports = TaskController;