
# install Linux Alpine (specific version) + Node.js(specific version)
FROM node:20-alpine3.19

#Install global installations needed inside a terminal(no need for nodemon in production):
RUN npm i -g ts-node

#craete app folder inside the image - ar root level+ make it the current directory:
WORKDIR /app

# Copy package.json and package-lock.json from root (.) into image /app folder:
COPY package*.json /app

# Install packages : 
RUN npm i

# Copy source files from developer computer into the /app folder inside the image:
COPY . /app

# Specify which terminal command will run the application:
ENTRYPOINT npm start

