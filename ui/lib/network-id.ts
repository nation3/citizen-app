export function networkToId(network: any) {
  switch (network.toLowerCase()) {
    case 'mainnet':
      return 1
    case 'ethereum':
      return 1
    case 'goerli':
      return 5
    case 'local':
      return 31337
    default:
      return 1
  }
}
