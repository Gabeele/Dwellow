
# Dwellow

## What is it?
Dwellow is a communication app that connects tenants with property managers, streamlining ticketing, resource management, and interactions. It's designed to make property management more efficient and tenant issues easier to resolve. The platform integrates various tools for effective property oversight and enhanced communication. 

## Project Goal
Dwellow seeks to significantly improve communication between tenants and landowners, streamline efficient property management practices, and enhance tenant satisfaction through a digital platform. By incorporating chatbots and a robust ticketing system for issue tracking, Dwellow addresses common challenges in property management such as delayed communications, inefficient issue resolution, and the absence of data-driven decision-making. The initiative not only proposes immediate solutions but also looks towards future advancements, including the use of AI to automate and optimize the ticketing system. These enhancements aim to mitigate property manager complacency and introduce a more proactive, responsive approach to property management.

## Future Directions
In future renditions of Dwellow, we plan to leverage artificial intelligence to further enhance the scheduling, planning, adaptation, and management of the ticketing system. This progression aims to reduce property manager complacency and foster a more efficient, effective property management ecosystem.

## Resources and Tools
- **Technology Stack**: Python, Docker & Docker Compose, Express, React Native, REST API, Chatbot, MSSQL.
- **Development Tools**: Git for version control, Docker for containerization and local deployment, and various tools for API development and testing.

Please ensure you have Docker and Docker Compose installed on your machine to run the Dwellow application locally. For detailed setup and running instructions, refer to the [Getting Started](#getting-started) section.

## Contributors
- thorcda
- gabeele
- riisaNGU

## Technology Stack
- Python
- Docker & Docker Compose
- Express
- React Native
- REST API
- Chatbot
- MSSQL

## Features
- Docker compose to generate containers for both local development and deployment environments.
- The server automatically deploys upon push to the main branch, updating API routes within minutes.
- Integration of various tools for effective property management and communication.

## Getting Started

### Prerequisites
- Docker and Docker Compose installed on your machine.
- Basic knowledge of Docker containerization.

### Clone the Repository
```bash
git clone https://github.com/Gabeele/dwellow.git
```

### Configuration Files
- Navigate to the API and frontend directories and add the `.env` files. Templates for these `.env` files are provided within the respective directories.
- You may need to adjust the NGINX configuration to match your local or deployment environment.

### Running the Application
1. Ensure Docker is running on your machine.
2. From the root of the project, run:
   ```bash
   docker-compose up
   ```
   This command will build and start all the necessary containers for the application to run locally.

### NGINX Configuration Summary
The NGINX configuration routes traffic to different parts of the Dwellow application based on the requested domain. Here's what each route does:

- `dwellow.ca`: Redirects all traffic to `www.dwellow.ca`.
- `www.dwellow.ca`: Serves the main frontend application.
- `api.dwellow.ca`: Routes to the backend API, facilitating communication between the frontend and the database.
- `docs.dwellow.ca`: Serves the application's documentation.

Each server block in the configuration is designed to handle requests to its specified domain, ensuring that users, developers, and administrators can interact with different aspects of the Dwellow platform as intended.

### Database Setup
- The database is currently not auto-deployed. You will need to run the database script within the container to populate it.
- For the current release, the database points to our main server.

## Future Updates
- The next release will include auto-generated API documentation to facilitate easier integration and development.
