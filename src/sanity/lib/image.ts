import createImageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client } from '@/sanity/client'

const imageBuilder = createImageUrlBuilder(client)

export const urlForImage = (source: SanityImageSource) => {
  return imageBuilder.image(source)
}
