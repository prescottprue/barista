FROM node:8

# Expose Port 5000 to be used later for firebase serve
EXPOSE 5000

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Bundle app source
COPY . .

# Install dependencies (skipping install of Cypress binary)
RUN CYPRESS_INSTALL_BINARY=0 npm install

# Install http-server to host after building html
RUN npm install firebase-tools@^4.1.0

## Build app bundle and index.html
RUN npm run build

# Server Hosting and Functions using firebase-tools. Entrypoint is used so exit
# signals such as SIGTERM and SIGINT are recieved by node process instead of
# being swallowed by npm
ENTRYPOINT $(npm bin)/firebase serve
