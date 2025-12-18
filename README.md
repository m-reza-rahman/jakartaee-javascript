Using JavaScript/HTML5 Clients with Jakarta EE 10
=================================================
This project demonstrates how you can utilize today's most popular JavaScript frameworks like React, Angular, or Vue to utilize the core strengths of Jakarta EE.

It is a Jakarta EE 10 server-side application with a React front-end consisting of a chat application (powered by WebSocket) and a to-do list application (powered by REST). The server-side is implemented using the Java API for WebSocket, JSON Processing, REST, CDI, Validation, and Persistence.

The application uses basic authentication. You can set the username/passwords via the database scripts in the source code. The current users are reza, nicole, zehra, and inaya. Each is seeded with the password secret1.

The project is in standard Maven format. You should be able to open it using any IDE that supports Maven and run it using any Jakarta EE 10 container. The project uses Payara Micro and an embedded H2 database.

Setup Instructions
------------------
Here are the instructions to get up and running:

* Install JDK 21
* Open this project in your IDE
* Build and run the project using Maven:
  ```
  mvn clean package payara-micro:start
  ```
* Open up a browser and go to [http://localhost:8080/](http://localhost:8080/)
