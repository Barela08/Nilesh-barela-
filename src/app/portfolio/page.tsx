import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ExternalLink, Github, Play, Film, Layers } from 'lucide-react';
import { dbProjects } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Portfolio & Software Projects | HackifyPro',
  description: 'Explore real-world software solutions, web applications, and digital platforms engineered by HackifyPro.',
  alternates: {
    canonical: 'https://www.nileshbarela.site/portfolio',
  },
};

function getEmbedUrl(url: string, type: string): string | null {
  if (!url) return null;
  if (type === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be')) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
  } else if (type === 'vimeo' || url.includes('vimeo.com')) {
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}`;
    }
  }
  return null;
}

export default function PortfolioPage() {
  const portfolioProjects = dbProjects.getPublished();

  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00E676]">
            Verified Deliverables
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white mt-2 mb-4">
            Our Software Engineering Portfolio
          </h1>
          <p className="text-base text-[#9AA3B8] leading-relaxed">
            Every project represents a real business challenge solved through clean code, scalable architecture, and user-centric design.
          </p>
        </div>

        <div className="space-y-16">
          {portfolioProjects.map((p) => {
            const beforeVideos = (p.videos || []).filter((v) => v.position === 'before');
            const afterVideos = (p.videos || []).filter((v) => v.position !== 'before');

            return (
              <div 
                key={p.id}
                className="p-8 sm:p-10 rounded-3xl bg-[#0F1624] border border-[#1E293B] hover:border-[#00E676]/40 transition-all space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Visual Media & Videos */}
                  <div className="lg:col-span-6 space-y-4">
                    
                    {/* Before-Gallery Videos */}
                    {beforeVideos.map((vid) => {
                      const embed = getEmbedUrl(vid.url, vid.type);
                      return (
                        <div key={vid.id} className="rounded-2xl overflow-hidden bg-[#080B12] border border-[#1E293B] aspect-video">
                          {embed ? (
                            <iframe
                              src={embed}
                              title={vid.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full border-0"
                            />
                          ) : (
                            <video
                              src={vid.url}
                              poster={vid.poster}
                              controls
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      );
                    })}

                    {/* Main Cover Image */}
                    <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-[#080B12] border border-[#1E293B] group">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority
                      />
                      {p.projectType && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#080B12]/80 backdrop-blur-md text-[10px] font-mono text-[#00E676] border border-[#1E293B]">
                          {p.projectType}
                        </span>
                      )}
                    </div>

                    {/* Multi-Image Gallery */}
                    {p.gallery && p.gallery.length > 1 && (
                      <div>
                        <div className="text-[11px] font-mono text-[#9AA3B8] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
                          <span>Project Gallery ({p.gallery.length} Views)</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2.5">
                          {p.gallery.map((img) => (
                            <div key={img.id} className="relative h-20 rounded-xl overflow-hidden bg-[#080B12] border border-[#1E293B] hover:border-[#00E676] transition-all group">
                              <Image
                                src={img.url}
                                alt={img.alt || p.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* After-Gallery Videos */}
                    {afterVideos.map((vid) => {
                      const embed = getEmbedUrl(vid.url, vid.type);
                      return (
                        <div key={vid.id} className="space-y-1.5">
                          <div className="text-xs font-mono text-[#9AA3B8] flex items-center space-x-1.5">
                            <Film className="w-3.5 h-3.5 text-[#A78BFA]" />
                            <span>{vid.title}</span>
                          </div>
                          <div className="rounded-2xl overflow-hidden bg-[#080B12] border border-[#1E293B] aspect-video">
                            {embed ? (
                              <iframe
                                src={embed}
                                title={vid.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full border-0"
                              />
                            ) : (
                              <video
                                src={vid.url}
                                poster={vid.poster}
                                controls
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}

                  </div>

                  {/* Right Column: Project Details */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-[#080B12] text-[#00E676] border border-[#1E293B]">
                        {p.category}
                      </span>
                      <span className="text-xs font-mono text-[#9AA3B8]">{p.market}</span>
                      {p.completionDate && (
                        <span className="text-xs font-mono text-[#64748B]">Completed: {p.completionDate}</span>
                      )}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                      {p.title}
                    </h2>

                    <p className="text-sm text-[#9AA3B8] leading-relaxed">
                      {p.summary}
                    </p>

                    {p.problemSolved && (
                      <div className="p-4 rounded-xl bg-[#080B12] border border-[#1E293B] text-xs">
                        <strong className="text-[#38BDF8] block mb-1 font-mono">Business Challenge Solved:</strong>
                        <span className="text-[#9AA3B8]">{p.problemSolved}</span>
                      </div>
                    )}

                    <div className="space-y-1.5 pt-1">
                      {p.mainFeatures.map((feat, i) => (
                        <div key={i} className="text-xs text-[#E8EDF5] flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676] flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {p.techStack.map((tech) => (
                        <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141D30] text-[#38BDF8] border border-[#1E293B]">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex flex-wrap items-center gap-3">
                      {p.demoUrl && p.demoUrl.startsWith('http') ? (
                        <a
                          href={p.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity inline-flex items-center space-x-1.5"
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : p.demoUrl ? (
                        <Link
                          href={p.demoUrl}
                          className="px-5 py-2.5 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity inline-flex items-center space-x-1.5"
                        >
                          <span>View Demo</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <Link
                          href="/appointment"
                          className="px-5 py-2.5 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                        >
                          Request Demo
                        </Link>
                      )}

                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 rounded-xl bg-[#0F1624] border border-[#1E293B] text-white hover:text-[#00E676] hover:border-[#00E676] font-mono text-xs inline-flex items-center space-x-1.5 transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Code Repo</span>
                        </a>
                      )}

                      <Link
                        href="/appointment"
                        className="text-xs font-mono text-white hover:text-[#00E676] flex items-center px-2 py-2"
                      >
                        <span>Discuss Similar Project</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
