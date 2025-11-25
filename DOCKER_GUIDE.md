# 🐳 Docker Guide cho ChatApp Project

## 📚 Lý thuyết cơ bản về Docker

### Docker là gì?

**Docker** là một nền tảng containerization cho phép đóng gói ứng dụng và tất cả dependencies vào một container có thể chạy trên bất kỳ môi trường nào.

### Các khái niệm cơ bản:

#### 1. **Image**
- Blueprint/template để tạo container
- Chứa OS, runtime, libraries, code
- Read-only, immutable
- Ví dụ: `php:8.2-fpm`, `node:20-alpine`

#### 2. **Container**
- Instance đang chạy của một Image
- Isolated process với filesystem riêng
- Có thể start, stop, delete
- Ephemeral (tạm thời) - data mất khi xóa container

#### 3. **Dockerfile**
- File text chứa instructions để build Image
- Mỗi instruction tạo một layer
- Syntax: `FROM`, `RUN`, `COPY`, `CMD`, etc.

#### 4. **Docker Compose**
- Tool để định nghĩa và chạy multi-container apps
- Sử dụng file YAML (`docker-compose.yml`)
- Quản lý networks, volumes, services cùng lúc

#### 5. **Volume**
- Persistent data storage
- Không bị xóa khi container bị xóa
- Share data giữa host và container
- Share data giữa các containers

#### 6. **Network**
- Cho phép containers communicate với nhau
- Isolated networking
- Types: bridge, host, overlay, macvlan

---

## 🏗️ Kiến trúc Docker cho ChatApp

```
┌─────────────────────────────────────────────────────────┐
│                     Docker Network                       │
│  ┌────────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │   Nginx    │◄─┤ Frontend │  │     Backend      │   │
│  │  (Reverse  │  │  (React) │  │    (Laravel)     │   │
│  │   Proxy)   │  │   Vite   │  │   PHP-FPM 8.2    │   │
│  │  Port: 80  │  │ Port:3000│  │   Port: 9000     │   │
│  └─────┬──────┘  └────┬─────┘  └────────┬─────────┘   │
│        │              │                  │              │
│        └──────────────┴──────────────────┘              │
│                       │                                 │
│        ┌──────────────┴──────────────┐                 │
│        │                              │                 │
│  ┌─────▼──────┐            ┌─────────▼────────┐       │
│  │  MySQL 8   │            │  Redis (Cache)   │       │
│  │ Port: 3306 │            │   Port: 6379     │       │
│  └────────────┘            └──────────────────┘       │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │         Socket.io Server (Optional)             │  │
│  │              Port: 6001                         │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Services cần thiết:

1. **nginx** - Web server & reverse proxy
2. **frontend** - React + Vite development server
3. **backend** - Laravel PHP-FPM application
4. **mysql** - Database
5. **redis** - Cache & queue driver
6. **socketio** (optional) - Real-time communication

---

## 📝 Các bước tạo Docker cho dự án

### Bước 1: Cấu trúc thư mục

```
chatapp/
├── backend/
│   ├── Dockerfile              # Docker image cho Laravel
│   ├── .dockerignore
│   └── ... (Laravel files)
├── frontend/
│   ├── Dockerfile              # Docker image cho React
│   ├── .dockerignore
│   └── ... (React files)
├── docker/
│   ├── nginx/
│   │   └── default.conf        # Nginx configuration
│   ├── php/
│   │   ├── php.ini             # PHP configuration
│   │   └── php-fpm.conf
│   └── mysql/
│       └── my.cnf              # MySQL configuration
├── docker-compose.yml          # Orchestration file
├── docker-compose.dev.yml      # Development overrides
└── .env.docker                 # Docker environment variables
```

### Bước 2: Tạo Dockerfile cho Backend (Laravel)

**backend/Dockerfile:**

```dockerfile
FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    oniguruma-dev \
    postgresql-dev

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port
EXPOSE 9000

CMD ["php-fpm"]
```

**Giải thích:**
- `FROM php:8.2-fpm-alpine`: Base image nhẹ
- `RUN apk add`: Cài system packages
- `docker-php-ext-install`: Cài PHP extensions
- `COPY --from=composer`: Multi-stage build lấy Composer
- `WORKDIR`: Set thư mục làm việc
- `composer install`: Cài Laravel dependencies
- `chown`: Set quyền cho storage folders
- `CMD`: Lệnh chạy khi container start

### Bước 3: Tạo Dockerfile cho Frontend (React)

**frontend/Dockerfile:**

```dockerfile
# Development stage
FROM node:20-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Production build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production serve stage
FROM nginx:alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx/frontend.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Giải thích:**
- **Multi-stage build**: 3 stages (development, build, production)
- **Development**: Dùng cho local development với hot reload
- **Build**: Build React app thành static files
- **Production**: Serve static files với Nginx

### Bước 4: Tạo Docker Compose file

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: chatapp_mysql
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: ${DB_DATABASE:-chatapp}
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD:-secret}
      MYSQL_PASSWORD: ${DB_PASSWORD:-secret}
      MYSQL_USER: ${DB_USERNAME:-chatapp}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./docker/mysql/my.cnf:/etc/mysql/conf.d/my.cnf
    ports:
      - "${DB_PORT:-3306}:3306"
    networks:
      - chatapp_network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: chatapp_redis
    restart: unless-stopped
    ports:
      - "${REDIS_PORT:-6379}:6379"
    volumes:
      - redis_data:/data
    networks:
      - chatapp_network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Laravel Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: chatapp_backend
    restart: unless-stopped
    working_dir: /var/www/html
    volumes:
      - ./backend:/var/www/html
      - ./docker/php/php.ini:/usr/local/etc/php/conf.d/custom.ini
    environment:
      - DB_HOST=mysql
      - DB_DATABASE=${DB_DATABASE:-chatapp}
      - DB_USERNAME=${DB_USERNAME:-chatapp}
      - DB_PASSWORD=${DB_PASSWORD:-secret}
      - REDIS_HOST=redis
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - chatapp_network

  # React Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: development
    container_name: chatapp_frontend
    restart: unless-stopped
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "${VITE_PORT:-3000}:3000"
    environment:
      - VITE_API_URL=http://localhost/api
      - VITE_SOCKET_URL=http://localhost:6001
    networks:
      - chatapp_network

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: chatapp_nginx
    restart: unless-stopped
    ports:
      - "${NGINX_PORT:-80}:80"
      - "${NGINX_SSL_PORT:-443}:443"
    volumes:
      - ./backend/public:/var/www/html/public
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - backend
      - frontend
    networks:
      - chatapp_network

networks:
  chatapp_network:
    driver: bridge

volumes:
  mysql_data:
    driver: local
  redis_data:
    driver: local
```

**Giải thích các phần quan trọng:**

#### Services:
- **mysql**: Database server với persistent volume
- **redis**: Cache và queue driver
- **backend**: Laravel PHP-FPM
- **frontend**: React development server
- **nginx**: Reverse proxy routing requests

#### Volumes:
- **Named volumes** (`mysql_data`, `redis_data`): Persistent data
- **Bind mounts** (`./backend:/var/www/html`): Sync code real-time

#### Networks:
- **bridge network**: Cho phép containers giao tiếp qua service name

#### Health checks:
- Đảm bảo service sẵn sàng trước khi start dependent services

### Bước 5: Cấu hình Nginx

**docker/nginx/default.conf:**

```nginx
# Frontend upstream
upstream frontend {
    server frontend:3000;
}

# Backend upstream
upstream backend {
    server backend:9000;
}

server {
    listen 80;
    server_name localhost;
    
    # Root directory
    root /var/www/html/public;
    index index.php index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API requests to Laravel
    location /api {
        try_files $uri $uri/ /index.php?$query_string;
        
        location ~ \.php$ {
            fastcgi_pass backend;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include fastcgi_params;
        }
    }

    # Laravel backend
    location ~ \.php$ {
        fastcgi_pass backend;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Frontend React app (proxy to Vite dev server)
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Bước 6: File .dockerignore

**backend/.dockerignore:**
```
node_modules
vendor
storage/logs/*
storage/framework/cache/*
storage/framework/sessions/*
storage/framework/views/*
.env
.git
.gitignore
docker-compose.yml
Dockerfile
```

**frontend/.dockerignore:**
```
node_modules
dist
.git
.gitignore
.env
.env.local
docker-compose.yml
Dockerfile
```

---

## 🚀 Các lệnh Docker thường dùng

### Build và Start:

```bash
# Build tất cả images
docker-compose build

# Start tất cả services
docker-compose up -d

# Build và start cùng lúc
docker-compose up -d --build

# Start service cụ thể
docker-compose up -d mysql redis

# Xem logs
docker-compose logs -f
docker-compose logs -f backend
```

### Quản lý Containers:

```bash
# List containers
docker-compose ps

# Stop containers
docker-compose stop

# Stop và xóa containers
docker-compose down

# Stop, xóa containers và volumes
docker-compose down -v

# Restart service
docker-compose restart backend
```

### Exec commands trong container:

```bash
# Access backend shell
docker-compose exec backend sh
docker-compose exec backend bash

# Run Laravel commands
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan cache:clear
docker-compose exec backend composer install

# Access MySQL
docker-compose exec mysql mysql -u chatapp -p

# Access frontend shell
docker-compose exec frontend sh
```

### Database migrations:

```bash
# Run migrations
docker-compose exec backend php artisan migrate

# Seed database
docker-compose exec backend php artisan db:seed

# Fresh migration
docker-compose exec backend php artisan migrate:fresh --seed
```

---

## 🔧 Environment Variables

**.env.docker:**
```env
# App
APP_NAME=ChatApp
APP_ENV=local
APP_DEBUG=true

# Database
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=chatapp
DB_USERNAME=chatapp
DB_PASSWORD=secret

# Redis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

# Ports
NGINX_PORT=80
NGINX_SSL_PORT=443
VITE_PORT=3000
DB_PORT=3306
REDIS_PORT=6379

# Frontend
VITE_API_URL=http://localhost/api
VITE_SOCKET_URL=http://localhost:6001
```

---

## 📊 Workflow Development

### 1. **Development mode** (Code thay đổi real-time):

```bash
# Start all services
docker-compose up -d

# Watch logs
docker-compose logs -f backend frontend

# Access app
# Frontend: http://localhost:3000
# Backend API: http://localhost/api
```

### 2. **Production mode**:

```bash
# Build production images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Start production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## ✅ Best Practices

### 1. **Multi-stage builds**
- Giảm image size
- Tách development và production

### 2. **Layer caching**
- Copy `package.json` trước code
- Install dependencies trước
- Code changes không rebuild dependencies

### 3. **Health checks**
- Đảm bảo services sẵn sàng
- Auto-restart failed containers

### 4. **Named volumes**
- Persistent data
- Không mất data khi recreate containers

### 5. **Environment-specific configs**
- `.env` cho local
- `.env.docker` cho Docker
- Secrets management cho production

### 6. **Security**
- Không commit secrets
- Use non-root users trong Dockerfile
- Scan images for vulnerabilities

---

## 🐛 Troubleshooting

### Permission issues:
```bash
# Fix storage permissions
docker-compose exec backend chown -R www-data:www-data storage bootstrap/cache
docker-compose exec backend chmod -R 775 storage bootstrap/cache
```

### Network issues:
```bash
# Recreate network
docker-compose down
docker network prune
docker-compose up -d
```

### Database connection:
```bash
# Check if MySQL is ready
docker-compose exec mysql mysqladmin ping -h localhost -u root -p

# Check environment variables
docker-compose exec backend env | grep DB
```

### Clear cache:
```bash
# Docker system prune
docker system prune -a --volumes

# Remove specific images
docker rmi $(docker images -q)
```

---

## 📚 Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Laravel in Docker](https://laravel.com/docs/sail)
- [Best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

---

**Bạn đã sẵn sàng để tạo Docker setup cho dự án chưa?** Tôi có thể bắt đầu tạo các files Docker ngay bây giờ! 🚀
