Using JavaScript/HTML5 Clients with Jakarta EE 10
=================================================
This project demonstrates how you can utilize today's most popular JavaScript frameworks like React, Angular, or Vue to utilize the core strengths of Jakarta EE.

It is a Jakarta EE 10 server-side application with a React front-end consisting of a chat application (powered by WebSocket) and a to-do list application (powered by REST). The server-side is implemented using 
the Java API for WebSocket, JSON Processing, REST, CDI, Validation, and Persistence.

The application uses basic authentication. You can set the username/passwords via the database scripts in 
the source code. The current users are reza, nicole, zehra, and inaya. The passwords are set to secret1. When using the application, the browser will warn you about the self-signed SSL certificate that Payara uses by default. Simply ignore the warning, it's harmless.

The project is in standard Maven format. You should be able to open it using any IDE that supports Maven and run it using any Jakarta EE 10 container. However, we used VS Code and Payara 7. Note that the project uses the default embedded Derby database that comes with Payara.

Setup Instructions
------------------
Here are the instructions to get up and running using VS Code and Payara:

* Install JDK 21
* Install Payara 7
* Install VS Code with Payara support
* Setup Payara in VS Code
* Make sure you have Payara up and running
* Open and build this project
* Run the project on Payara 7
* Open up a browser and go to [http://localhost:8080/jakartaee-javascript](http://localhost:8080/jakartaee-javascript)
