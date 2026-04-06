# Use Node.js to build and serve
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only for serving)
RUN npm install --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose the port used by Vite preview (default 5173)
EXPOSE 5173

# Start the preview server
CMD ["npm", "run", "preview"]