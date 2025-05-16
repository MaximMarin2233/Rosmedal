FROM python:3.11-bullseye

# Установка переменной окружения PYTHONUNBUFFERED в значение 1,
# чтобы вывод команд Python был сразу доступен в консоли
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y wait-for-it

WORKDIR /usr/src/backend/rosmedal

# Копирование requirements.txt в контейнер
COPY requirements.txt .

# Установка зависимостей проекта
RUN pip install -r requirements.txt

# Копирование всего содержимого проекта в контейнер
COPY . /usr/src/backend

EXPOSE 8000