# Use the official Python image from the Docker Hub
FROM python:latest

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install necessary system packages
RUN apt-get update && pip install --upgrade pip && \
    apt-get install -y curl gnupg2 unixodbc-dev 

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt
