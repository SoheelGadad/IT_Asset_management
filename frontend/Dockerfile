# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# This creates the 'dist' folder with optimized code
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine
# Copy the built files from the first stage
COPY --from=build /app/dist /usr/share/nginx/html
# Nginx runs on port 80 by default
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]