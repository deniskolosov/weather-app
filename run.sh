#!/usr/bin/env bash
./node_modules/.bin/webpack --config webpack.config.js
if [ ! -e weatherdb.sqlite3 ]; then
    touch weatherdb.sqlite3
fi

python manage.py runserver 8000