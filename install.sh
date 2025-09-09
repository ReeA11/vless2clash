#!/bin/bash
set -e

# Временный файл для python-скрипта
TMP_FILE=$(mktemp)

# Скачиваем Python-скрипт с GitHub
curl -sL "https://raw.githubusercontent.com/ReeA11/vless2clash/refs/heads/master/vless2clash.py" -o "$TMP_FILE"

# Запрашиваем у пользователя ссылку VLESS
read -p "Введите VLESS ссылку: " VLESS_URL

# Запускаем конвертацию
python3 "$TMP_FILE" "$VLESS_URL"

# Чистим
rm "$TMP_FILE"