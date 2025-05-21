# Rosmedal

## Описание

  1. Backend(Django)
  2. Frontend(React/Redux)

Конфиг docker-compose поднимает каждый из сервисов

Backend и Frontend - два отдельных сервиса, хостуются на двух разных портах, у нас это 8000(Backend) и 3003(Frontend)

## Развёртка на сервере

### Переменные окружения

Для начала необходимо создать файл .env, подобный .env.example и указать все необходимые переменные.

Описание переменных: 

1. COMPOSE_FILE - указывает путь к файлу `docker-compose.yml`, который используется для развертывания приложения с помощью Docker Compose. У нас две конфигурации docker-compose: для разработки и продакшна.

   Значение переменной для разработки:

         COMPOSE_FILE=docker-compose.yaml:docker-compose.dev.yaml

   Значение переменной для продакшна:

         COMPOSE_FILE=docker-compose.yaml:docker-compose.prod.yaml

2. EMAIL_HOST_USER и EMAIL_HOST_PASSWORD - Учетные данные для доступа к SMTP серверу Yandex.

   Пример:

         EMAIL_HOST_USER=example@yandex.com
         EMAIL_HOST_PASSWORD=examplepassword

3. ALLOWED_HOSTS - Список разрешенных доменных имен хоста для бэкенда(Django). По сути это доменное имя, которое будет связано с бэкендом. 

      Пример:
       
            ALLOWED_HOSTS=api.rosmedal.com example.com api.example.com

4. REACT_APP_API_BASE_URL - указывает базовый URL для доступа к API бэкенда из frontend приложения. В разработке.
      
### Запуск

Команда для "поднятия" инфраструктуры проекта:
```
   docker compose up -d
```

Команда для создания суперпользователя django (админа):
```
   docker compose exec django python manage.py createsuperuser
```

Команда для сбора статических файлов:
```
   docker compose exec django python manage.py collectstatic --no-input
```

Теперь сервисы доступны по следующим локальным адресам и могут быть проксированы через Nginx:

   Backend: localhost:8000  
   Frontend: localhost:3003

### Прочее

Для работы рассылки почтовых писем необходимо создать в админке объект почты для приема заявок клиентов.

### Проксирование на Django

В конфиг nginx необходимо добавить пути для обработки статических и медиа файлов. Выглядят они примерно так:

```
location /static/ {
   alias /path/to/your/project/static/;
   }
```

```
location /media/ {
   alias /path/to/your/project/media/;
   }
```

В файле nginx.conf.example содержится пример конфигурации.