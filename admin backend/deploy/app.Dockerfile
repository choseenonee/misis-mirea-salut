# Используем официальный образ Go как базовый
FROM golang:latest

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем файлы 'go.mod' и 'go.sum', если они есть
COPY go.mod go.sum ./

# Загружаем зависимости. Это может быть пропущено, если нет файлов 'go.mod' и 'go.sum'
RUN go mod download

# Копируем исходный код
COPY .. .

# Собираем приложение
RUN go build -o ./cmd/main ./cmd/main.go && chmod +x ./cmd/main

# Экспортируем порт, который будет использовать приложение
EXPOSE 8080

# меняем workdir для корректной работы go logs
WORKDIR /app/cmd
# Запускаем исполняемый файл
CMD ["./main"]