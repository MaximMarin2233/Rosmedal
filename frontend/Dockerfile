# Используем официальный образ Node.js версии 20
FROM node:20

ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json (если он есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта в рабочую директорию
COPY . .

# Открываем порт, который используется вашим приложением
EXPOSE 3003

# Определяем команду для запуска вашего приложения
CMD ["npm", "start"]
