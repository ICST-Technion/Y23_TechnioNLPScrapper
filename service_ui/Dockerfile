# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application's source code to the container
COPY . .

# Build the React app
RUN npm run build

# Expose the port the frontend runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]