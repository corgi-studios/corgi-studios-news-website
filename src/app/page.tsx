import { client } from '@/sanity/client'
import Link from 'next/link'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/image'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

async function getPosts() {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    mainImage,
    "authorName": author->name,
    publishedAt
  }`
  const posts = await client.fetch(query)
  return posts
}

interface Post {
  title: string;
  slug: string;
  mainImage: SanityImageSource;
  authorName: string;
  publishedAt: string;
}

export default async function HomePage() {
  const posts: Post[] = await getPosts()

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 border-b-4 border-corgi-blue pb-2">Latest News</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link href={`/news/${post.slug}`} key={post.slug} className="block group">
            <article className="bg-white rounded-lg shadow-md overflow-hidden group-hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
              {post.mainImage && (
                <div className="relative h-48 w-full">
                   <Image
                      src={urlForImage(post.mainImage).width(500).height(300).url()}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                   />
                </div>
              )}
              <div className="p-6 flex-grow flex flex-col">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">{post.title}</h2>
                <p className="text-gray-600 mb-4 flex-grow">
                  By {post.authorName || 'Corgi Studios'} • {new Date(post.publishedAt).toLocaleDateString()}
                </p>
                <span className="text-corgi-blue font-semibold mt-auto">Read More →</span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
}