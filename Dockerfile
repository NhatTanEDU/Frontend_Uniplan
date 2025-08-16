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

# Set default PORT if not provided by Railway
ENV PORT=3000

# Expose port
EXPOSE $PORT

# Copy start script
COPY railway-start.js ./

# Make start script executable
RUN chmod +x railway-start.js

# Start command
CMD ["node", "railway-start.js"]
