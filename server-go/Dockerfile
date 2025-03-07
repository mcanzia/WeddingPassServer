FROM golang:latest AS builder
WORKDIR /app
COPY server-go/go.mod server-go/go.sum ./
RUN go mod download

COPY server-go/ ./

RUN go build -o event-manager-server ./cmd/event-manager

FROM alpine:latest

WORKDIR /app

RUN apk add --no-cache ca-certificates

COPY --from=builder /app/event-manager-server .
RUN chmod +x event-manager-server

EXPOSE 7500

CMD ["./event-manager-server"]
