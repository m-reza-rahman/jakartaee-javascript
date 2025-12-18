Using JavaScript/HTML5 Clients with Jakarta EE 10
=================================================
This project demonstrates how you can utilize today's most popular JavaScript frameworks like React, Angular, or Vue to utilize the core strengths of Jakarta EE.

It is a Jakarta EE 10 server-side application with a React front-end consisting of a chat application (powered by WebSocket) and a to-do list application (powered by REST). The server-side is implemented using 
the Java API for WebSocket, JSON Processing, REST, CDI, Validation, and Persistence.

The application uses basic authentication with PBKDF2 hashed passwords. You can set the username/passwords via the database scripts in the source code. The current users are reza, nicole, zehra, and inaya. Each is seeded with the password secret1, stored as PBKDF2WithHmacSHA256 (2048 iterations, 16-byte salt, 32-byte key). If you change passwords, generate new hashes with those parameters and update src/main/resources/load-script.sql. When using the application, the browser will warn you about the self-signed SSL certificate that WildFly uses by default. Simply ignore the warning, it's harmless.

The project is in standard Maven format. You should be able to open it using any IDE that supports Maven and run it using any Jakarta EE 10 container. However, we now use VS Code and WildFly. Note that the project uses an embedded H2 database.

Setup Instructions
------------------
Here are the instructions to get up and running using VS Code and WildFly:

* Install JDK 21
* Install WildFly 38 or later
* Install VS Code with WildFly support
* Setup WildFly in VS Code
* Make sure you have WildFly up and running
* Open and build this project
* Run the project on WildFly
* Open up a browser and go to [http://localhost:8080/jakartaee-javascript](http://localhost:8080/jakartaee-javascript)
