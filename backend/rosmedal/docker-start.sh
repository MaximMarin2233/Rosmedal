#!/bin/bash
wait-for-it db:5432 -- python manage.py migrate

for fixture in fixtures/*.json; do
    echo "Загрузка фикстуры: $fixture"
    python manage.py loaddata $fixture
done



