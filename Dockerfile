FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY shortUrl/target/shortUrl-0.0.1-SNAPSHOT.jar /app/shortUrl.jar
EXPOSE 8080
#ARG JAR_FILE=shortUrl/target/*.jar
#COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app/shortUrl.jar"]
