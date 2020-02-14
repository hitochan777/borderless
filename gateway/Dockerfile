FROM golang:1.13.8
WORKDIR /usr/src/app
COPY . .

RUN CGO_ENABLED=0 go build -o gateway .

FROM alpine:latest  
WORKDIR /root/
COPY --from=0 /usr/src/app/gateway .
RUN chmod +x ./gateway
CMD ["./gateway"] 
