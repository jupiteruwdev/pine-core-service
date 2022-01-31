# Pine Treasury Service

## Usage

```sh
# Run in dev
$ npm run dev

# Run tests in TypeScirpt
$ npm run test:ts

# Build for production and run tests
$ npm run build:test
$ npm test

# Build for production and run in production
$ npm run build
$ npm start

# Build the image for test and run unit tests
$ docker build -t ${IMAGE_NAME:-treasury-service}:${IMAGE_TAG:-test} .
$ docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Build the image for production
$ docker build -t ${IMAGE_NAME:-treasury-service}:${IMAGE_TAG:-latest} .

# Run the image in production
$ docker-compose -f docker-compose.yml up
```
