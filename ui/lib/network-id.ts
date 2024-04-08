export function networkToId(network: string | undefined): number {
  // Definindo um mapa de redes para seus IDs
  const networkMap: { [key: string]: number } = {
    mainnet: 1,
    ethereum: 1,
    goerli: 5,
    sepolia: 11155111,
    local: 31337,
  }

  const id = network ? networkMap[network.toLowerCase()] : undefined

  return id ?? 1 
}
