FROM golang:latest as builder

WORKDIR /app

COPY server-go/go.mod server-go/go.sum ./
RUN go mod download
COPY . .

RUN go build -o event-manager-server ./server-go/cmd/event-manager

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/event-manager-server .
EXPOSE 7500
CMD ["./event-manager-server"]
