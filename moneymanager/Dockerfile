# bhushan
#FROM eclipse-temurin:17-jre
#WORKDIR /app
#COPY target/moneymanager-0.0.1-SNAPSHOT.jar moneymanager-v1.0.jar
#EXPOSE 9090
#ENTRYPOINT ["java", "-jar", "moneymanager-v1.0.jar"]

FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/moneymanager-0.0.1-SNAPSHOT.jar moneymanager-v1.0.jar
EXPOSE 9090
ENTRYPOINT ["java", "-jar", "moneymanager-v1.0.jar"]

