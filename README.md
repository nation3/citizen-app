# Nation3 App ☁️🇺🇳

![Vercel](https://vercelbadge.vercel.app/api/nation3/app)

<a href="https://github.com/nation3/app/graphs/contributors" alt="Contributors">
  <img src="https://img.shields.io/github/contributors/nation3/app" /></a>
<a href="https://github.com/nation3/app/pulse" alt="Activity">
  <img src="https://img.shields.io/github/commit-activity/m/nation3/app" /></a>

---

[![](/ui/public/logo.svg)](https://app.nation3.org)

The Nation3 App at https://app.nation3.org is where people can connect their Ethereum wallet and interact with the Nation3 smart contracts.

> [![app](https://user-images.githubusercontent.com/95955389/169034356-f1fdb540-d65b-4c1b-bd4d-21c76f7f8af3.png)](https://app.nation3.org)

## File Structure

The code in this repository is structured into two main parts:

```
.
├── contracts # The smart contracts
└── ui        # The user interface (UI) for interacting with the smart contracts
```

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

Start the development server:
```
yarn dev
```

Then open http://localhost:42069 in a browser.

## Testing against the Goerli Ethereum testnet

Add Goerli testnet variables to your local development environment:
```
cp .env.goerli .env.local
```

Start the development server:
```
yarn dev
```

## Run the smart contracts locally

See [`contracts/README.md#local-setup`](https://github.com/nation3/app/blob/main/contracts/README.md#local-setup).

Update the `NEXT_PUBLIC_CHAIN` variable in `.env.local` to match your Ethereum [node](https://github.com/nation3/app/blob/main/contracts/README.md#running-a-node).

Start the development server:
```
yarn dev
```
