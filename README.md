# Task Queue System

A production-ready priority-based task queue system with rate limiting, built with Node.js and Express.

## Features

- ✅ Priority-based queue (High → Medium → Low)
- ✅ FIFO ordering within same priority
- ✅ Rate limiting per task type
- ✅ Concurrent task processing (max 5)
- ✅ Retry mechanism (3 attempts)
- ✅ In-memory storage (arrays)
- ✅ Comprehensive metrics
- ✅ Input validation
- ✅ Swagger API documentation
- ✅ Docker support

## Rate Limits

- **SMS**: 15 tasks/minute
- **Email**: 10 tasks/minute
- **Webhook**: 20 tasks/minute

## Quick Start

### Using Docker (Recommended)
```bash
# Build and run
docker-compose up --build

# Run in background

docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down