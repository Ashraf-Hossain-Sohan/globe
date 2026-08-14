# Globe Backend API Documentation

Welcome to the Globe Backend API documentation. This is a Spring Boot 3.x application providing the core services for the Globe Enterprise Suite.

## Features

- **Authentication & Authorization**: Spring Security configured with Form Login and Session-based Authentication (Cookie `JSESSIONID`).
- **RESTful Endpoints**: Full suite of REST controllers serving the React frontend.
- **Data Persistence**: Configured with Spring Data JPA backed by a file-based H2 database for local development.
- **OpenAPI/Swagger UI**: Automatically generated API documentation.

## Running the Application

### Using `npm` (Recommended)
From the root of the monorepo, run:
```bash
npm run dev
```
This script will:
1. Start the Vite React frontend.
2. Start the Spring Boot backend concurrently (available at `http://localhost:8080`).

### Using Maven Directly
If you wish to run the backend independently:
```bash
cd globe-backend
./mvnw clean spring-boot:run
```

## API Documentation (Swagger)

We use `springdoc-openapi` to automatically scan all controllers and expose API documentation.
Once the backend is running, navigate to:

**Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
**OpenAPI JSON:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

You can test all endpoints directly from the Swagger UI interface!

## Database Details

- **Database Engine**: H2 Database (File-based)
- **Data Location**: `./data/globedb.mv.db`
- **H2 Console**: Available at `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:file:./data/globedb`
  - Username: `sa`
  - Password: *(leave blank)*

*Note: Database tables are initialized automatically using JPA `update`. Initial data seeding is handled by `DataSeeder.java`.*

## Testing Strategy

The project contains unit tests across the three main layers of the application:
1. **Repository Tests** (`@DataJpaTest`): Verifies database queries against an in-memory H2 database.
2. **Service Tests**: Uses Mockito to mock repositories and verify core business logic.
3. **Controller Tests** (`@WebMvcTest`): Uses `MockMvc` to mock the service layer and test HTTP status codes, routing, and JSON serialization.

To run the tests:
```bash
./mvnw test
```
