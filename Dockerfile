# Use the official Node.js image as a build environment
FROM node:16 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the frontend code to the container
COPY ghi/package*.json ./
RUN npm install
COPY ghi ./
RUN npm run build

# Use an official Python runtime as a parent image
FROM python:3.10-bullseye

# Set the working directory in the container
WORKDIR /app

# Copy the backend code to the container
COPY cookit/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY cookit ./

# Expose the port your FastAPI application will run on
EXPOSE 8000

# Start the FastAPI application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
