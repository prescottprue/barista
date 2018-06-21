FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Bundle app source
COPY . .

# If you are building for development
# RUN npm install
# If you are building your code for production
RUN npm install --only=production

CMD [ "npm", "run", "build" ]
