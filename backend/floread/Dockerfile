# Base image
FROM openjdk:11-jdk-slim

# Working directory
WORKDIR /app

# Copy the JAR file to the container
COPY build/libs/floread-0.0.1-SNAPSHOT.jar ./myapp.jar
COPY build.gradle .
# Set the entrypoint command
ENTRYPOINT ["java", "-jar", "myapp.jar"]
