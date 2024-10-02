FROM golang:1.23-alpine

WORKDIR /app

COPY . .

RUN --mount=type=cache,target=/go/pkg/mod \
   go build -o backend

ENTRYPOINT ./backend