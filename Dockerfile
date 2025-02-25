FROM openjdk:17-jdk-alpine
ARG JAR_FILE=shortUrl/target/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
