import { requireNativeModule } from 'expo-modules-core'

import * as ImageColors from '..'
import type { IOSImageColors } from '../types'

const NativeImageColors = requireNativeModule('ImageColors')

jest.mock('expo-modules-core', () => ({
  requireNativeModule: jest.fn().mockReturnValue({
    getColors: jest.fn(),
  }),
}))

const mockResult: IOSImageColors = {
  background: '#000000',
  primary: '#120120',
  secondary: '#123123',
  detail: '#321321',
  quality: 'low',
  platform: 'ios' as const,
}

const uri = 'uri'

describe('react-native-image-colors', () => {
  beforeEach(() => {
    NativeImageColors.getColors = jest.fn().mockReturnValue({ ...mockResult })
  })

  describe('getColors', () => {
    describe('when cache is enabled', () => {
      afterEach(() => {
        jest.restoreAllMocks()
        ImageColors.cache.clear()
      })

      it('stores new result into cache', async () => {
        jest.spyOn(ImageColors.cache, 'setItem')
        jest.spyOn(ImageColors.cache, 'getItem')

        const result = await ImageColors.getColors(uri, { cache: true })

        expect(ImageColors.cache.getItem).toHaveBeenCalledWith(uri)
        expect(ImageColors.cache.setItem).toHaveBeenCalled()

        const cacheResult = ImageColors.cache.getItem(uri)
        expect(result).toEqual(cacheResult)
      })

      it('returns old result from cache', async () => {
        const nothing = ImageColors.cache.getItem(uri)
        expect(nothing).toBeUndefined()

        ImageColors.cache.setItem(uri, mockResult)

        jest.spyOn(ImageColors.cache, 'setItem')
        jest.spyOn(ImageColors.cache, 'getItem')

        const result = await ImageColors.getColors(uri, { cache: true })

        expect(mockResult).toEqual(result)
        expect(ImageColors.cache.getItem).toHaveBeenCalledWith(uri)
        expect(ImageColors.cache.setItem).not.toHaveBeenCalled()
      })

      describe('cache key', () => {
        beforeEach(() => {
          jest.spyOn(ImageColors.cache, 'setItem')
          jest.spyOn(ImageColors.cache, 'getItem')
        })

        afterEach(() => {
          jest.restoreAllMocks()
          ImageColors.cache.clear()
        })

        it('uses uri when key is not defined', async () => {
          await ImageColors.getColors(uri, { cache: true })

          expect(ImageColors.cache.getItem).toHaveBeenCalledWith(uri)
          expect(ImageColors.cache.setItem).toHaveBeenCalledWith(
            uri,
            mockResult
          )
        })

        it('uses key if it is defined', async () => {
          const key = 'key'

          await ImageColors.getColors(uri, { cache: true, key })

          expect(ImageColors.cache.getItem).toHaveBeenCalledWith(key)
          expect(ImageColors.cache.setItem).toHaveBeenCalledWith(
            key,
            mockResult
          )
        })

        it('throws an error if the key is too large', async () => {
          await expect(
            ImageColors.getColors(uri.repeat(400), {
              cache: true,
            })
          ).rejects.toThrow()
        })
      })
    })

    describe('when cache is disabled', () => {
      afterEach(() => {
        jest.restoreAllMocks()
      })

      it('never caches any result', async () => {
        jest.spyOn(ImageColors.cache, 'setItem')
        jest.spyOn(ImageColors.cache, 'getItem')

        NativeImageColors.getColors = jest
          .fn()
          .mockReturnValueOnce({ ...mockResult })

        const firstCallResult = await ImageColors.getColors(uri, {
          cache: false,
        })

        expect(ImageColors.cache.getItem).not.toHaveBeenCalled()
        expect(ImageColors.cache.setItem).not.toHaveBeenCalled()

        NativeImageColors.getColors = jest
          .fn()
          .mockReturnValueOnce({ ...mockResult })

        const secondCallResult = await ImageColors.getColors(uri, {
          cache: false,
        })

        expect(ImageColors.cache.getItem).not.toHaveBeenCalled()
        expect(ImageColors.cache.setItem).not.toHaveBeenCalled()

        expect(firstCallResult).not.toBe(secondCallResult)
      })
    })
  })
})
