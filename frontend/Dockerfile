FROM node:16-alpine as build-stage
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
ARG VITE_SERVER_API_URL
ARG VITE_FRONTEND_PORT
ARG VITE_FIREBASE_CONFIG
RUN echo "VITE_SERVER_API_URL=$VITE_SERVER_API_URL" >> .env.production && \
    echo "VITE_FRONTEND_PORT=$VITE_FRONTEND_PORT" >> .env.production && \
    echo "VITE_FIREBASE_CONFIG=$VITE_FIREBASE_CONFIG" >> .env.production
RUN npm run build

FROM nginx:stable as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
