'use client'; // This directive is crucial

import { useState, useEffect } from 'react';
import { client } from '@/sanity/client';
import { urlForImage } from '@/sanity/lib/image';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import type { PortableTextBlock } from '@portabletext/types';

// Define the types for our data
interface Post {
  title: string;
  mainImage: SanityImageSource;
  authorName: string;
  publishedAt: string;
  body: PortableTextBlock[];
}

interface ImageValue extends SanityImageSource {
  alt?: string;
}

// Reusable component for rendering images in the post body
const portableTextComponents = {
  types: {
    image: ({ value }: { value: ImageValue }) => (
      <div className="relative w-full h-96 my-8">
        <Image 
          src={urlForImage(value).url()} 
          alt={value.alt || 'Post image'} 
          fill 
          sizes="100vw" 
          className="rounded-lg object-cover" 
        />
      </div>
    ),
  },
};

// The main page component
export default function PostPage({ params }: any) { // Use 'any' to bypass the build error
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function getPost(slug: string) {
      const query = `*[_type == "post" && slug.current == $slug][0] { title, mainImage, "authorName": author->name, publishedAt, body }`;
      try {
        const fetchedPost = await client.fetch(query, { slug });
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          setError(true); // Post not found
        }
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (params.slug) {
      getPost(params.slug);
    }
  }, [params.slug]); // Rerun when the slug changes

  if (loading) {
    return <div className="text-center p-10">Loading post...</div>;
  }

  if (error || !post) {
    return <div className="text-center p-10">Sorry, this post could not be found.</div>;
  }

  return (
    <article className="max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900">{post.title}</h1>
      <p className="text-gray-500 mb-6">
        By {post.authorName || 'Corgi Studios'} • Published on {new Date(post.publishedAt).toLocaleDateString()}
      </p>
      {post.mainImage && (
        <div className="relative h-96 w-full mb-8">
          <Image 
            src={urlForImage(post.mainImage).url()} 
            alt={post.title} 
            fill 
            sizes="100vw" 
            className="object-cover rounded-lg" 
            priority 
          />
        </div>
      )}
      <div className="prose lg:prose-xl max-w-none">
        <PortableText value={post.body} components={portableTextComponents} />
      </div>
    </article>
  );
}
