# -----------------------------
# Stage 1: Build the React frontend
# -----------------------------
FROM node:18-alpine AS frontend-build
WORKDIR /app

# Copy frontend package files
COPY package.json package-lock.json ./
RUN npm ci

# Copy frontend source code
COPY . .

# Build the React app
RUN npm run build

# -----------------------------
# Stage 2: Build backend (TypeScript)
# -----------------------------
FROM node:18-alpine AS backend-build
WORKDIR /app/server

# Copy backend package files
COPY server/package.json server/package-lock.json ./
RUN npm ci

# Copy backend source code
COPY server/ ./

# Build TypeScript to JavaScript
RUN npm run build

# Remove dev dependencies for production
RUN npm prune --production

# -----------------------------
# Stage 3: Production image
# -----------------------------
FROM node:18-alpine
WORKDIR /app

# Copy backend build output and production dependencies
COPY --from=backend-build /app/server/dist ./server/dist
COPY --from=backend-build /app/server/node_modules ./server/node_modules
COPY --from=backend-build /app/server/package.json ./server/

# Copy frontend build
COPY --from=frontend-build /app/dist ./dist

# Set working directory to backend
WORKDIR /app/server

# Set environment variable for port
ENV PORT=8080
EXPOSE 8080

# Start the backend (which also serves React frontend)
CMD ["node", "dist/index.js"]