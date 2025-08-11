#FROM eclipse-temurin:21-jre
#WORKDIR /app
#COPY target/moneymanager-0.0.1-SNAPSHOT.jar moneymanager-v1.0.jar
#EXPOSE 9090
#ENTRYPOINT ["java","-jar","moneymanager-v1.0.jar"]
# Build stage
#FROM maven:3.9-openjdk-17 AS build
#WORKDIR /app
#COPY pom.xml .
#COPY src ./src
#RUN mvn clean package -DskipTests
#
## Runtime stage
#FROM openjdk:17-jre-alpine
#WORKDIR /app
#COPY --from=build /app/target/*.jar app.jar
#EXPOSE 9090
#ENTRYPOINT ["java", "-jar", "app.jar"]

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/moneymanager-0.0.1-SNAPSHOT.jar moneymanager-v1.0.jar
EXPOSE 9090
ENTRYPOINT ["java","-jar","moneymanager-v1.0.jar"]
