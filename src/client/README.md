# Web application

This web application has been developed in ReactJS starting from `create-react-app` (https://reactjs.org/docs/create-a-new-react-app.html). 

## Installation

1. Run `npm install`
2. Copy the `.env.example` to `.env` and fill the needed value.
3. Run `npm start` to start the development server

### Env Variables

The env variables are needed to configure the web application. Set the environment based on your use-case and the base URL for the development and prod environment.

```
REACT_APP_ENVIRONMENT=development
REACT_APP_BASE_URL_DEV=https://xxxxxx.execute-api.{region}.amazonaws.com/dev
REACT_APP_BASE_URL_PROD=

```

## Architecture

