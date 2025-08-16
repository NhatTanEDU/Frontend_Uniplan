# Railway Frontend Dockerfile for UniPlan React App
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the React application
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Expose port (Railway will override with $PORT)
EXPOSE 3000

# Start command
CMD ["node", "check-railway-env.js", "--start"]
