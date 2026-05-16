# Use a smaller, faster image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY . .

# Render will use this, but app.js must also use process.env.PORT
EXPOSE 10000

CMD ["node", "app.js"]