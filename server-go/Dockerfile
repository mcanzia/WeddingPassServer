FROM golang:1.21 as builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download
COPY . .

RUN go build -o event-manager-server .

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/event-manager-server .
EXPOSE 7500
CMD ["./event-manager-server"]
