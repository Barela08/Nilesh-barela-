import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Github,
  Calendar,
  MapPin,
  Users,
  Layers,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { dbProjects } from '@/lib/db';
import { company } from '@/data/company';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = dbProjects.getBySlug(slug);
  if (!project || (project.visibility && project.visibility !== 'published')) {
    return { title: 'Project Not Found | HackifyPro' };
  }

  return {
    title: project.seoTitle || `${project.title} | HackifyPro Case Study`,
    description: project.seoDescription || project.summary,
    alternates: {
      canonical: `${company.websiteUrl}/portfolio/${project.slug}`,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = dbProjects.getBySlug(slug);

  if (!project || (project.visibility && project.visibility !== 'published')) {
    notFound();
  }

  const related = dbProjects
    .getPublished()
    .filter((p) => p.id !== project.id)
    .slice(0, 3);

  const isExternalDemo = Boolean(project.demoUrl && project.demoUrl.startsWith('http'));

  return (
    <div className="bg-[#080B12] text-[#E8EDF5] min-h-screen pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/portfolio"
          className="inline-flex items-center space-x-2 text-xs font-mono text-[#9AA3B8] hover:text-[#00E676] mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Projects</span>
        </Link>

        {/* Hero Header */}
        <div className="rounded-3xl bg-[#0F1624] border border-[#1E293B] p-8 sm:p-10 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-mono px-3 py-1 rounded-md bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30 font-bold">
                {project.category}
              </span>
              {project.projectType && (
                <span className="text-xs font-mono px-3 py-1 rounded-md bg-[#080B12] text-[#38BDF8] border border-[#1E293B]">
                  {project.projectType}
                </span>
              )}
              <span className="text-xs font-mono px-3 py-1 rounded-md bg-[#080B12] text-[#A78BFA] border border-[#1E293B]">
                {project.status}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight">
              {project.title}
            </h1>

            <p className="text-base text-[#9AA3B8] leading-relaxed max-w-4xl">
              {project.summary}
            </p>

            {/* Primary Real Links Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {project.demoUrl && isExternalDemo ? (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00E676] to-[#00c853] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-95 transition-opacity inline-flex items-center space-x-2"
                >
                  <span>Open Live Site</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : project.demoUrl ? (
                <Link
                  href={project.demoUrl}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00E676] to-[#00c853] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-95 transition-opacity inline-flex items-center space-x-2"
                >
                  <span>Explore Live Product Page</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : null}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-[#080B12] border border-[#1E293B] hover:border-[#00E676] text-white font-mono text-xs font-semibold inline-flex items-center space-x-2 transition-colors"
                >
                  <Github className="w-4 h-4 text-[#00E676]" />
                  <span>GitHub Repository</span>
                </a>
              )}

              <Link
                href={`/appointment?service=${project.slug}`}
                className="px-5 py-3 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-[#38BDF8] hover:bg-[#38BDF8] hover:text-[#080B12] font-mono text-xs font-bold inline-flex items-center space-x-2 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Live Demo</span>
              </Link>

              <a
                href={`https://wa.me/917414935405?text=${encodeURIComponent(`Hi HackifyPro, I want to know more about ${project.title}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-[#080B12] border border-[#1E293B] hover:border-[#00E676] text-[#00E676] font-mono text-xs font-semibold inline-flex items-center space-x-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Inquiry</span>
              </a>
            </div>
          </div>

          {/* Main Showcase Visual */}
          <div className="relative w-full h-72 sm:h-[460px] rounded-2xl overflow-hidden bg-[#080B12] border border-[#1E293B]">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Quick Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#080B12] border border-[#1E293B]">
              <div className="text-[11px] font-mono text-[#64748B] uppercase flex items-center space-x-1.5 mb-1">
                <Users className="w-3.5 h-3.5 text-[#00E676]" />
                <span>Target Client</span>
              </div>
              <div className="text-sm font-semibold text-white">{project.client}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#080B12] border border-[#1E293B]">
              <div className="text-[11px] font-mono text-[#64748B] uppercase flex items-center space-x-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Market &amp; Region</span>
              </div>
              <div className="text-sm font-semibold text-white">{project.market}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#080B12] border border-[#1E293B]">
              <div className="text-[11px] font-mono text-[#64748B] uppercase flex items-center space-x-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span>Delivery Milestone</span>
              </div>
              <div className="text-sm font-semibold text-white">
                {project.completionDate || '2026'}
              </div>
            </div>
          </div>

          {/* Problem & Features */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
            <div className="lg:col-span-5 space-y-6">
              {project.problemSolved && (
                <div className="p-6 rounded-2xl bg-[#080B12] border border-[#1E293B]">
                  <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#38BDF8] mb-3">
                    Business Challenge Solved
                  </h2>
                  <p className="text-sm text-[#9AA3B8] leading-relaxed">
                    {project.problemSolved}
                  </p>
                </div>
              )}

              <div className="p-6 rounded-2xl bg-[#080B12] border border-[#1E293B]">
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#A78BFA] mb-3 flex items-center space-x-2">
                  <Layers className="w-4 h-4" />
                  <span>Technology Stack</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#0F1624] text-[#38BDF8] border border-[#1E293B]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {project.externalUrls && project.externalUrls.length > 0 && (
                <div className="p-6 rounded-2xl bg-[#080B12] border border-[#1E293B]">
                  <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#00E676] mb-3">
                    Direct Project Links
                  </h2>
                  <div className="space-y-2">
                    {project.externalUrls.map((lnk) =>
                      lnk.url.startsWith('http') ? (
                        <a
                          key={lnk.url}
                          href={lnk.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 rounded-xl bg-[#0F1624] border border-[#1E293B] hover:border-[#00E676] text-xs font-mono text-white transition-colors"
                        >
                          <span>{lnk.label}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#00E676]" />
                        </a>
                      ) : (
                        <Link
                          key={lnk.url}
                          href={lnk.url}
                          className="flex items-center justify-between p-3 rounded-xl bg-[#0F1624] border border-[#1E293B] hover:border-[#00E676] text-xs font-mono text-white transition-colors"
                        >
                          <span>{lnk.label}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#00E676]" />
                        </Link>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 sm:p-8 rounded-2xl bg-[#080B12] border border-[#1E293B]">
                <h2 className="text-lg font-heading font-bold text-white mb-5 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-[#00E676]" />
                  <span>Core Capabilities &amp; Delivered Modules</span>
                </h2>
                <div className="space-y-3.5">
                  {project.mainFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-3 p-3.5 rounded-xl bg-[#0F1624] border border-[#1E293B]/70"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#00E676] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-[#E8EDF5] leading-relaxed">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#00E676]/10 via-[#0F1624] to-[#38BDF8]/10 border border-[#00E676]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-heading font-bold text-white">
                    Want a similar platform built for your business?
                  </h3>
                  <p className="text-xs text-[#9AA3B8] mt-1">
                    Get an itemized scope breakdown and delivery timeline within 24 hours.
                  </p>
                </div>
                <Link
                  href={`/request-quote?service=${project.slug}`}
                  className="px-5 py-3 rounded-xl bg-[#00E676] text-[#080B12] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity whitespace-nowrap text-center"
                >
                  Request Custom Quote
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Projects */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-extrabold text-white">
                More Projects by HackifyPro
              </h2>
              <Link
                href="/portfolio"
                className="text-xs font-mono text-[#00E676] hover:underline flex items-center"
              >
                <span>View Full Portfolio</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/portfolio/${item.slug}`}
                  className="rounded-2xl bg-[#0F1624] border border-[#1E293B] overflow-hidden hover:border-[#00E676]/50 transition-all group flex flex-col"
                >
                  <div className="relative h-40 w-full bg-[#080B12]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#00E676] uppercase">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-heading font-bold text-white group-hover:text-[#00E676] mt-1">
                        {item.title}
                      </h3>
                    </div>
                    <div className="mt-4 text-xs font-mono text-[#38BDF8] flex items-center">
                      <span>View Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
