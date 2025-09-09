#!/bin/bash
set -e

# Временный файл для python-скрипта
TMP_FILE=$(mktemp)

# Скачиваем Python-скрипт с GitHub
curl -sL "https://raw.githubusercontent.com/<YOUR_GITHUB_USERNAME>/vless2clash/main/vless2clash.py" -o "$TMP_FILE"

# Запрашиваем у пользователя ссылку VLESS
read -p "Введите VLESS ссылку: " VLESS_URL

# Запускаем конвертацию
python3 "$TMP_FILE" "$VLESS_URL"

# Чистим
rm "$TMP_FILE"