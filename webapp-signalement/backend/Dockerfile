# Use Node.js for the backend
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Compile TypeScript
RUN npm run build

# Expose the port
EXPOSE 5000

# Start the application
CMD ["node", "dist/index.js"]