# 🚀 Docker Quick Start Guide

## 📋 Prerequisites

- Docker Desktop installed
- Docker Compose v2+
- Port 80, 3307, 5173, 6380, 8080 available

## 🏃 Quick Start

### 1. Copy environment file

```bash
# Từ thư mục chatapp
cp .env.docker backend/.env
```

### 2. Build và Start containers

```bash
# Build tất cả images
docker-compose build

# Start tất cả services
docker-compose up -d

# Hoặc build và start cùng lúc
docker-compose up -d --build
```

### 3. Setup Laravel

```bash
# Generate application key
docker-compose exec backend php artisan key:generate

# Run migrations
docker-compose exec backend php artisan migrate

# (Optional) Seed database
docker-compose exec backend php artisan db:seed

# Install Laravel Passport
docker-compose exec backend php artisan passport:install
```

### 4. Access Application

- **Frontend**: http://localhost (hoặc http://localhost:5173)
- **Backend API**: http://localhost/api
- **WebSocket**: ws://localhost:8080
- **MySQL**: localhost:3307
- **Redis**: localhost:6380

## 📊 Service Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Nginx (Port 80)                         │
│                  Reverse Proxy                           │
└────┬─────────────────┬─────────────────┬───────────────┘
     │                 │                 │
┌────▼─────┐    ┌─────▼──────┐   ┌─────▼──────────┐
│ Frontend │    │  Backend   │   │ Reverb         │
│ (React)  │    │ (Laravel)  │   │ (WebSocket)    │
│ Port:5173│    │ PHP-FPM    │   │ Port: 8080     │
└──────────┘    └─────┬──────┘   └────────────────┘
                      │
           ┌──────────┴──────────┐
           │                     │
      ┌────▼─────┐         ┌────▼─────┐
      │  MySQL   │         │  Redis   │
      │Port: 3307│         │Port: 6380│
      └──────────┘         └──────────┘
```

## 🔧 Common Commands

### Container Management

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f reverb

# Stop containers
docker-compose stop

# Start containers
docker-compose start

# Restart specific service
docker-compose restart backend

# Stop và remove containers
docker-compose down

# Stop, remove containers + volumes
docker-compose down -v
```

### Laravel Commands

```bash
# Access backend shell
docker-compose exec backend sh

# Run artisan commands
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear
docker-compose exec backend php artisan route:list

# Install composer packages
docker-compose exec backend composer install

# Queue worker
docker-compose exec backend php artisan queue:work
```

### Database Commands

```bash
# Access MySQL
docker-compose exec mysql mysql -u chatapp_user -p chatapp

# Backup database
docker-compose exec mysql mysqldump -u chatapp_user -p chatapp > backup.sql

# Restore database
docker-compose exec -T mysql mysql -u chatapp_user -p chatapp < backup.sql

# Access Redis CLI
docker-compose exec redis redis-cli
```

### Frontend Commands

```bash
# Access frontend shell
docker-compose exec frontend sh

# Install npm packages
docker-compose exec frontend npm install

# Build production
docker-compose exec frontend npm run build
```

### Development Workflow

```bash
# Watch backend logs
docker-compose logs -f backend reverb

# Watch frontend logs
docker-compose logs -f frontend

# Rebuild specific service
docker-compose up -d --build backend
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Check port usage
netstat -ano | findstr :80
netstat -ano | findstr :3307

# Change ports in .env.docker
NGINX_PORT=8080
DB_PORT=3308
```

### Permission Issues

```bash
# Fix storage permissions
docker-compose exec backend chmod -R 775 storage bootstrap/cache
docker-compose exec backend chown -R www-data:www-data storage bootstrap/cache
```

### Database Connection Failed

```bash
# Check MySQL is ready
docker-compose exec mysql mysqladmin ping -h localhost -u root -p

# Check environment variables
docker-compose exec backend env | grep DB

# Restart backend
docker-compose restart backend
```

### WebSocket Connection Failed

```bash
# Check Reverb logs
docker-compose logs -f reverb

# Restart Reverb
docker-compose restart reverb

# Test WebSocket connection
curl http://localhost:8080/app
```

### Clear All Docker Data

```bash
# Remove all containers, images, volumes
docker-compose down -v --rmi all

# System prune
docker system prune -a --volumes

# Rebuild from scratch
docker-compose up -d --build
```

## 🔄 Update Code

```bash
# Backend code changes auto-reload với volume mount
# Frontend hot reload tự động

# Sau khi thay đổi composer.json
docker-compose exec backend composer install

# Sau khi thay đổi package.json
docker-compose exec frontend npm install

# Sau khi thay đổi migrations
docker-compose exec backend php artisan migrate

# Sau khi thay đổi config
docker-compose exec backend php artisan config:clear
```

## 🧪 Testing

```bash
# Run backend tests
docker-compose exec backend php artisan test

# Run specific test
docker-compose exec backend php artisan test --filter=MessageTest

# Run frontend tests
docker-compose exec frontend npm test
```

## 📦 Production Build

```bash
# Build production images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Start production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🔐 Security Checklist

- [ ] Change default passwords in `.env.docker`
- [ ] Generate new Reverb keys
- [ ] Set `APP_DEBUG=false` for production
- [ ] Use SSL certificates
- [ ] Configure firewall rules
- [ ] Regular security updates

## 📝 Environment Variables

Key variables trong `.env.docker`:

```env
# App
APP_ENV=local|production
APP_DEBUG=true|false

# Database
DB_DATABASE=chatapp
DB_USERNAME=chatapp_user
DB_PASSWORD=your_secure_password

# Reverb WebSocket
REVERB_APP_ID=your_app_id
REVERB_APP_KEY=your_app_key
REVERB_APP_SECRET=your_app_secret

# Ports
NGINX_PORT=80
VITE_PORT=5173
DB_PORT=3307
REDIS_PORT=6380
REVERB_PORT=8080
```

## 🎯 Next Steps

1. ✅ Setup Docker containers
2. ⏳ Create database migrations for chat
3. ⏳ Build Chat API controllers
4. ⏳ Test real-time messaging
5. ⏳ Deploy to production

## 📚 Resources

- [Docker Documentation](https://docs.docker.com/)
- [Laravel Reverb](https://reverb.laravel.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

**Need help?** Check logs with `docker-compose logs -f` 🔍
