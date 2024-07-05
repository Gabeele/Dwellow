# Use the official Python image from the Docker Hub
FROM python:3.9

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install necessary system packages
RUN apt-get update && pip install --upgrade pip && \
    apt-get install -y curl gnupg2 unixodbc-dev && \
    curl -fsSL https://ollama.com/install.sh | sh

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Run Ollama model (this can be adapted to your specific needs)
CMD ["sh", "-c", "ollama run gemma2 & python main.py"]
