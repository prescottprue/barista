FROM cypress/base:8

## Build Arguments
# URL which Cypress will run tests against (with default)
ARG test_url=https://barista-stage.firebaseapp.com

## Environment Variables
# URL which Cypress will run tests against (defaults to test_url arg)
ENV CYPRESS_baseUrl=$test_url
# Token used to auth firebase-tools for use in seeding/checking Firebase (RTDB + Firestore)
ENV FIREBASE_TOKEN $FIREBASE_TOKEN
# Key used to specifiy job
ENV JOB_RUN_KEY $JOB_RUN_KEY

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
COPY bin/ /bin/
COPY cypress/ /cypress/

# Install Dependencies (only those used to build config files)
RUN CYPRESS_INSTALL_BINARY=0 npm install babel-core babel-cli babel-preset-env lodash firebase-admin mocha barista-reporter@0.0.9

# Build Test Config
RUN npm run build:testConfig

# Install Cypress
# Set CI=true to prevent a large number of messages during install of
# dependencies such as Cypress
RUN CI=true npm install cypress

# Verify Cypress Installed correctly
RUN $(npm bin)/cypress verify

# Run Cypress tests (URL set by ENV above)
# Steps:
# 1. Mark test as status "started" within tests_runs_meta/$JOB_RUN_KEY
# 2. Run Cypress reporting results using Barista Reporter (writes to test_runs_data/$JOB_RUN_KEY)
# 3. Echo the exit code of the cypress test run and pipe to the next step
# 4. Update RTDB with status "complete" or "error" within tests_runs_meta/$JOB_RUN_KEY based on piped error code
ENTRYPOINT bin/testsStart.js; $(npm bin)/cypress run --reporter barista-reporter; echo \"$?\" | bin/testsComplete.js
