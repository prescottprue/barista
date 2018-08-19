FROM cypress/base:8

# Handle input of test url (defaults to stage)
ARG test_url=https://barista-stage.firebaseapp.com
ENV CYPRESS_baseUrl=$test_url

## Environment Variables

# Set CI to true to prevent a large number of messages during install of
# dependencies such as Cypress
ENV CI=true
# Prevent a large number messages during NPM install
ENV npm_config_loglevel warn
# Color logs where possible
ENV TERM xterm

## Copy code into container

### Files
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json cypress.json serviceAccount.json ./

### Directories
COPY build/ /build/
COPY cypress/ /cypress/

# Install Dependencies (only those used to build config files)
RUN npm install babel-core babel-cli babel-preset-env lodash firebase-admin barista-reporter

# Build Test Config
RUN npm run build:testConfig

# Install Cypress
RUN npm install cypress

# Verify Cypress Installed correctly
RUN $(npm bin)/cypress verify

# Run Cypress tests (URL set by ENV above)
ENTRYPOINT $(npm bin)/cypress run --reporter barista-reporter
