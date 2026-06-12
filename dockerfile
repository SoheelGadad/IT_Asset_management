# ==========================================
# STAGE 1: Build the React Frontend
# ==========================================
FROM node:20-alpine AS ui-build
WORKDIR /usr/src/ui

# Copy UI package files and install dependencies
COPY ui/package*.json ./
RUN npm install

# Copy UI source files and build the production assets
COPY ui/ .
RUN npm run build

# ==========================================
# STAGE 2: Run the Express Backend
# ==========================================
FROM node:20-alpine
WORKDIR /usr/src/app

# Copy Backend package files and install only production dependencies
COPY server/package*.json ./
RUN npm install --production

# Copy Backend application code
COPY server/ .

# CRITICAL AZURE BRIDGE: Copy the built 'dist' folder from Stage 1 
# directly into the 'frontend/dist' folder your Express app expects
COPY --from=ui-build /usr/src/ui/dist ./frontend/dist

# FIX: Azure App Service defaults to port 8080 for custom containers
EXPOSE 8080

# FIX: Match the entry point file name from your Express script (index.js)
CMD ["node", "index.js"]