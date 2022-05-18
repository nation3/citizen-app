export default function networkToId(network) {
  switch (network.toLowerCase()) {
    case 'mainnet':
      return 1
    case 'ethereum':
      return 1
    case 'goerli':
      return 5
    default:
      return 1
  }
}
