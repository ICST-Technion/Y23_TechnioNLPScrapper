# Use an official Python runtime as the base image
FROM python:3.9

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file to the container
COPY requirements.txt .

# Copy the rest of the application's source code to the container
COPY . .

# Copy the env file to the container
COPY .env ./

# Install Python dependencies
RUN pip install -r requirements.txt

# Expose the port the Flask server runs on
EXPOSE 10000

# Start the application
CMD ["python", "API.py"]