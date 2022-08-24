# Nation3 App UI

https://app.nation3.org

## Run the UI locally

Navigate to the folder of the UI app:
```
cd ui/
```

Install the dependencies:
```
yarn install
```

Add variables to your local development environment:
```
cp .env.mainnet .env.local
```
or
```
cp .env.goerli .env.local
```

Build:
```
yarn build
```

Lint:
```
yarn lint
```

Start the development server:
```
yarn dev
```

Then open http://localhost:42069 in a browser.

## Integration Testing

Run the integration tests:
```
yarn cypress
```

Run the integration tests headlessly:
```
yarn cypress:headless
```

## Unit Testing

Run unit tests:
```
yarn test
```

## Code Coverage

[![codecov](https://codecov.io/gh/nation3/app/branch/main/graph/badge.svg)](https://codecov.io/gh/nation3/app)

Run code coverage:
```
yarn test:coverage
```
