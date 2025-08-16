# Railway Frontend Dockerfile for UniPlan React App - NO SERVE PACKAGE v3
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

# No need to install serve - using Node.js built-in server

# Set default PORT if not provided by Railway
ENV PORT=3000

# Expose port
EXPOSE $PORT

# Copy Node.js static server
COPY node-server.js ./

# Make server executable
RUN chmod +x node-server.js

# Start command - Use Node.js built-in server (NO SERVE PACKAGE)
CMD ["node", "node-server.js"]
