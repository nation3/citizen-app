import { describe, expect, test } from '@jest/globals'
import { sum } from '../../lib/dummy' 

test("Dummy unit test", () => {
  const actual = sum(1, 2)
  expect(actual).toBe(3)
})
