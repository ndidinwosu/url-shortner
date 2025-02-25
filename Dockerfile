FROM openjdk:17-jdk-alpine
#RUN addgroup -S spring && adduser -S spring -G spring
#USER spring:spring
ARG JAR_FILE=shortUrl/target/*.jar
COPY ./shortUrl/target/shortUrl-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]