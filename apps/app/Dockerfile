# Этап 1: Сборка
FROM node:14-alpine as build-stage

WORKDIR /app

# 1. Копируем корневые конфиги
COPY package*.json ./

# 2. Копируем конфиги конкретного приложения
# Создаем структуру заранее
RUN mkdir -p apps/app
COPY apps/app/package*.json ./apps/app/

# 3. Установка зависимостей. 
# Сначала ставим общие зависимости в корень
RUN npm install --unsafe-perm

# 4. ВАЖНЫЙ ШАГ: Ставим зависимости прямо в папку приложения. 
# Это решит проблему с "react-app-rewired: not found"
WORKDIR /app/apps/app
RUN npm install --unsafe-perm

# 5. Возвращаемся в корень, чтобы скопировать весь исходный код
WORKDIR /app
COPY . .

# 6. Снова идем в папку приложения для сборки
WORKDIR /app/apps/app

# Прописываем переменные окружения
ENV TSC_COMPILE_ON_ERROR=true
ENV SKIP_PREFLIGHT_CHECK=true
ENV PUBLIC_URL=/

# Запускаем сборку. 
# Теперь react-app-rewired будет лежать в /app/apps/app/node_modules/.bin/
RUN CI=false npm run build

# --- ТЕСТОВЫЙ ШАГ ---
# Если сборка прошла, эта команда покажет файлы. Если нет - билд упадет здесь с ошибкой.
RUN ls -la build

# Этап 2: Раздача
FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-stage /app/apps/app/build /usr/share/nginx/html
COPY ./apps/app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
