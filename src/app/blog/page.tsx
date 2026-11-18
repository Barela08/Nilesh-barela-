import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock, User } from 'lucide-react';
import { blogPosts } from '@/data/blog';

export const metadata: Metadata = {
  title: 'Blog & Technology Insights | HackifyPro',
  description: 'Articles on modern web architecture, Android app engineering, custom software ROI, and practical cybersecurity by HackifyPro.',
  alternates: {
    canonical: 'https://nileshbarela.site/blog',
  },
};

export default function BlogListingPage() {
  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00E676]">
            Technical Insights
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white mt-2 mb-4">
            HackifyPro Blog & Guides
          </h1>
          <p className="text-base text-[#9AA3B8] leading-relaxed">
            Practical insights on web development, Android applications, cybersecurity essentials, and software strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {blogPosts.map((post) => (
            <article 
              key={post.slug}
              className="p-8 rounded-3xl bg-[#0F1624] border border-[#1E293B] hover:border-[#00E676]/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#080B12] text-[#38BDF8] border border-[#1E293B]">
                    {post.category}
                  </span>
                  <span className="text-xs font-mono text-[#64748B] flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {post.readingTime}
                  </span>
                </div>

                <h2 className="text-xl font-heading font-bold text-white group-hover:text-[#00E676] transition-colors leading-snug">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-xs sm:text-sm text-[#9AA3B8] mt-3 leading-relaxed">
                  {post.summary}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141D30] text-[#9AA3B8]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-[#1E293B] flex items-center justify-between">
                <div className="text-xs text-[#9AA3B8] flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-[#00E676]" />
                  <span>{post.author.name}</span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-mono font-bold text-[#00E676] hover:underline flex items-center"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
