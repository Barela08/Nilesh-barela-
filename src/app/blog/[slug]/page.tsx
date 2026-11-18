import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, ArrowRight } from 'lucide-react';
import { blogPosts } from '@/data/blog';
import { company } from '@/data/company';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: 'Article Not Found' };

  return {
    title: `${post.title} | HackifyPro Blog`,
    description: post.summary,
    alternates: {
      canonical: `${company.websiteUrl}/blog/${post.slug}`,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.summary,
      url: `${company.websiteUrl}/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    url: `${company.websiteUrl}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: `${company.websiteUrl}/nilesh-barela`,
    },
    publisher: {
      '@type': 'Organization',
      name: company.name,
      logo: {
        '@type': 'ImageObject',
        url: `${company.websiteUrl}/assets/hackifypro-storefront.png`,
      },
    },
  };

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link
          href="/blog"
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#9AA3B8] hover:text-[#00E676] mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Articles</span>
        </Link>

        {/* Header */}
        <header className="space-y-4 mb-10 pb-8 border-b border-[#1E293B]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30">
              {post.category}
            </span>
            <span className="text-xs font-mono text-[#9AA3B8] flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {post.readingTime}
            </span>
            <span className="text-xs font-mono text-[#9AA3B8] flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              {post.publishedAt}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center space-x-3 pt-2">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#00E676]">
              <Image
                src={post.author.image}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                <Link href="/nilesh-barela" className="hover:text-[#00E676] underline decoration-dotted">
                  {post.author.name}
                </Link>
              </div>
              <div className="text-xs font-mono text-[#9AA3B8]">{post.author.role}</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="space-y-6 text-base text-[#E8EDF5] leading-relaxed font-body">
          {post.content.map((p, i) => (
            <p key={i} className="text-[#E8EDF5]/90">
              {p}
            </p>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-12 pt-6 border-t border-[#1E293B] flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-[#9AA3B8]">Tags:</span>
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs font-mono px-2.5 py-1 rounded bg-[#0F1624] text-[#38BDF8] border border-[#1E293B]">
              #{tag}
            </span>
          ))}
        </div>

        {/* Author Bio Box */}
        <div className="mt-12 p-6 rounded-2xl bg-[#0F1624] border border-[#1E293B] flex items-center space-x-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border border-[#00E676]">
            <Image src="/assets/nilesh-barela.jpg" alt="Nilesh Barela" fill className="object-cover" />
          </div>
          <div>
            <div className="text-sm font-heading font-bold text-white">Written by Nilesh Barela</div>
            <p className="text-xs text-[#9AA3B8] mt-1 leading-relaxed">
              Founder of HackifyPro. App developer, AI enthusiast, and cybersecurity learner helping businesses build scalable digital products.
            </p>
          </div>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-[#1E293B]">
            <h3 className="text-xl font-heading font-bold text-white mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((rel) => (
                <div key={rel.slug} className="p-5 rounded-xl bg-[#0F1624] border border-[#1E293B] hover:border-[#00E676]/40 transition-all">
                  <span className="text-[10px] font-mono text-[#38BDF8] block mb-1">{rel.category}</span>
                  <h4 className="text-sm font-bold text-white hover:text-[#00E676]">
                    <Link href={`/blog/${rel.slug}`}>{rel.title}</Link>
                  </h4>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
