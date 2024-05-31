export function networkToId(network: any) {
  if (network == undefined) {
    return 1
  }
  switch (network.toLowerCase()) {
    case 'mainnet':
      return 1
    case 'ethereum':
      return 1
    case 'goerli':
      return 5
    case 'sepolia':
      return 11155111
    case 'local':
      return 31337
    default:
      return 1
  }
}
