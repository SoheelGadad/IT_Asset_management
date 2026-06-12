# ==========================================
# STAGE 1: Build the React Frontend
# ==========================================
FROM node:20-alpine AS ui-build
WORKDIR /usr/src/ui

# Copy UI dependencies and install them
COPY ui/package*.json ./
RUN npm install

# Copy UI source code and compile it into the 'dist' folder
COPY ui/ .
RUN npm run build

# ==========================================
# STAGE 2: Set up the Express Backend
# ==========================================
FROM node:20-alpine AS server-build
WORKDIR /usr/src/app

# Copy Backend dependencies and install them
COPY server/package*.json ./
RUN npm install --only=production

# Copy Backend source code
COPY server/ .

# CRITICAL STEP: Copy the compiled 'dist' folder from Stage 1 
# directly into the location your Express app expects (frontend/dist)
COPY --from=ui-build /usr/src/ui/dist ./frontend/dist

# Expose the default port your Express app uses
EXPOSE 8080

# Start your Express backend
CMD ["node", "index.js"]