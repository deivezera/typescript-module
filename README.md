# Overview

This project is an Authentication System built using TypeScript. The goal of this software is to strengthen my understanding of TypeScript by applying its core language features in a real-world use case — managing user authentication through registration, login, and profile handling.

The project demonstrates TypeScript concepts such as strong typing, classes, asynchronous functions (with async/await), recursion, and exception handling. It uses an in-memory list to simulate user storage, showing how TypeScript enforces type safety and improves code clarity while still compiling to standard JavaScript.

By creating this project, I aimed to deepen my understanding of TypeScript’s syntax, type system, and integration with Node.js. This helped me explore how TypeScript provides better tooling, early error detection, and clean, maintainable code — all essential skills for building scalable applications.

[Software Demo Video](https://www.youtube.com/watch?v=5Sj3VzZPcAI)

# Development Environment

This project was developed using Visual Studio Code with the TypeScript compiler (tsc) configured through a tsconfig.json file.
I ran the application in a Node.js environment to execute TypeScript output in the terminal.

Tools and Libraries:

- TypeScript (typed superset of JavaScript)
- Node.js for running compiled JavaScript
- ts-node for running TypeScript directly
- TSLint / ESLint for code linting
- JWT for authentication
- MongoDb

Key TypeScript Features Used:

- Classes to represent User and AuthService
- Lists (arrays) to store users in memory
- Asynchronous functions to storage users in database
- Recursion for operations such as password validation attempts
- Exception handling with try/catch blocks for login errors

# Useful Websites

- [TypeScript Official Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript Tutorial – W3Schools](https://www.w3schools.com/typescript/)

# Future Work

- Create a web interface using React + TypeScript.
- Improve validation and error handling for edge cases.
- Add encryption for passwords and sensitive user data.