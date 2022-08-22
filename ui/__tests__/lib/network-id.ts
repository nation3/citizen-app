import { describe, expect, test } from '@jest/globals'
import { networkToId } from '../../lib/network-id'

test("networkToId goerli", () => {
  const actual = networkToId('goerli')
  expect(actual).toBe(5)
})

test("networkToId mainnet", () => {
  const actual = networkToId('mainnet')
  expect(actual).toBe(1)
})
