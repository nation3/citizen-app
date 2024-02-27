# Nation3 Citizen App

![Vercel](https://vercelbadge.vercel.app/api/nation3/citizen-app)
<a href="https://github.com/nation3/citizen-app/graphs/contributors" alt="Contributors"> <img src="https://img.shields.io/github/contributors/nation3/citizen-app" /></a> <a href="https://github.com/nation3/citizen-app/pulse" alt="Activity">
  <img src="https://img.shields.io/github/commit-activity/m/nation3/citizen-app" /></a>

---

[![](/ui/public/logo.svg)](https://app.nation3.org)

The Nation3 Citizen App at https://app.nation3.org is where people can connect their Ethereum wallet and interact with the [foundational](https://github.com/nation3/foundations) Nation3 smart contracts.

> [![app](https://user-images.githubusercontent.com/95955389/169034356-f1fdb540-d65b-4c1b-bd4d-21c76f7f8af3.png)](https://app.nation3.org)

## File Structure

The code in this repository is structured into two main parts:

```
.
├── contracts # The smart contracts
└── ui        # The user interface (UI) for interacting with the smart contracts
```

## Run the UI locally

See [ui/README.md](ui/README.md)

## Testing against the Goerli Ethereum testnet

Add Goerli testnet variables to your local development environment:
```
cp .env.goerli .env.local
```

Start the development server:
```
yarn dev
```

Once you go to http://localhost:42069, you will see the message "Nation3 uses Goerli as its preferred network":

> <img width="966" alt="Screen Shot 2022-05-21 at 11 10 06 AM" src="https://user-images.githubusercontent.com/95955389/169633157-50b239e4-9b4f-484d-a62e-8c3b6627dc29.png">

Solve this by switching to the _Goerli Test Network_ in MetaMask:

> <img width="328" alt="Screen Shot 2022-05-21 at 11 03 28 AM" src="https://user-images.githubusercontent.com/95955389/169633167-3570d17b-e7a9-4726-a377-e4a4ce455f5e.png">

## Testing against the Sepolia Ethereum testnet

Add Sepolia testnet variables to your local development environment:
```
cp .env.sepolia .env.local
```

Start the development server:
```
yarn dev
```

Once you go to http://localhost:42069, you will see the message "Nation3 uses Sepolia as its preferred network":

> <img width="801" alt="Screenshot 2024-01-25 at 13 09 56" src="https://github.com/nation3/citizen-app/assets/42999269/6121fde4-8b5c-4f8c-be50-531723121770">

Solve this by switching to the Sepolia Test Network in MetaMask:

> <img width="315" alt="Screenshot 2024-01-25 at 14 45 18" src="https://github.com/nation3/citizen-app/assets/42999269/3331f209-1d48-4b6b-8e71-f1ca53a37394">

## Run the smart contracts locally

Follow the instructions at [`contracts/README.md#local-setup`](https://github.com/nation3/citizen-app/blob/main/contracts/README.md#local-setup).

Update the `NEXT_PUBLIC_CHAIN` variable in `.env.local` to match your local Ethereum [node](https://github.com/nation3/citizen-app/blob/main/contracts/README.md#running-a-node).

Start the development server:
```
yarn dev
```
