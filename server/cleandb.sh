#!/bin/bash

timestamp=$(date +%F-%H:%M)
mkdir -p data/dbbackup/$timestamp/migrations

mv authenticator/migrations data/dbbackup/$timestamp/migrations/api

mv data/db.sqlite3 data/dbbackup/$timestamp

bash migrate.sh
python manage.py shell -c "from create_super_user import create_super_user; create_super_user()"