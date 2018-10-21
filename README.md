# Scoreboard
A TypeScript application
## Running
To run the app, enter
```
npm start
```
in the terminal.
## Secrets
To run the app, you have to create secret files.
```
.secret (Contains key for JWT)
```
```
.gmailsecret (Contains password for E-Mail account)
```
## Base URL
You have to set baseURL in app/controller/user.controller.ts to the URL of the server. This is used for E-Mail verification.
```ts
const baseURL = 'http://localhost:8080'
```
## Docs
All docs are available in 'doc' folder