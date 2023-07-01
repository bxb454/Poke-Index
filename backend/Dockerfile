FROM node:18

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install --silent

# Bundle app source
COPY . .

EXPOSE 5000

CMD ["npm","start"]