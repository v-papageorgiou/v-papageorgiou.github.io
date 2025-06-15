'use client';

import { useState } from 'react';
import Image from "next/image";
import Navigation from "@/components/Navigation";
import { 
  GraduationCap, 
  MapPin, 
  Mail, 
  ExternalLink, 
  Github, 
  LinkedinIcon,
  FileText,
  Award,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { publications, formatAuthors } from "@/data/publications";
import { news } from "@/data/news";
import { socialLinks as importedSocialLinks } from "@/data/personal";
import { getColleagueLink } from "@/data/colleagues";

// Custom X.com icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Map social link names to their icons
const iconMap = {
  "Email": Mail,
  "Google Scholar": GraduationCap,
  "GitHub": Github,
  "X": XIcon,
  "LinkedIn": LinkedinIcon,
};

// Add icons to imported social links
const socialLinks = importedSocialLinks.map(link => ({
  ...link,
  icon: iconMap[link.name as keyof typeof iconMap]
}));

export default function Home() {
  const [expandedAbstracts, setExpandedAbstracts] = useState<Set<number>>(new Set());

  const toggleAbstract = (index: number) => {
    const newExpanded = new Set(expandedAbstracts);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedAbstracts(newExpanded);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section id="about" className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Vasilis Papageorgiou
              </h1>
              <div className="flex items-center space-x-3 text-gray-600 mb-4 text-sm">
                <div className="flex items-center space-x-1">
                  <GraduationCap className="w-4 h-4" />
                  <span>PhD Student in Computer Science</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>UW-Madison</span>
                </div>
              </div>
              
              <div className="prose prose-base text-gray-700 text-base leading-relaxed">
                <p className="mb-3">
                  Hello! I am a 3rd year PhD student in Computer Sciences at the University of Wisconsin-Madison, 
                  advised by <a href={getColleagueLink("Dimitris Papailiopoulos")} className="text-blue-600 hover:text-blue-800">Dimitris Papailiopoulos</a>. 
                  My research interests revolve around Large Language Models (LLMs), Machine Learning, and Deep Learning, 
                  with a focus on both theoretical and practical aspects.
                </p>
                <p className="mb-3">
                  Previously, I earned my diploma in Electrical and Computer Engineering from the Technical University of Crete, 
                  Greece, where I worked with <a href={getColleagueLink("Aggelos Bletsas")} className="text-blue-600 hover:text-blue-800">Prof. Aggelos Bletsas</a> 
                  on asynchronous algorithms for distributed inference in wireless sensor networks.
                </p>
                <p className="mb-0">
                  Currently, I am also a research intern at AWS AI Labs in Pasadena, CA, where I work on reasoning models.
                </p>
              </div>
            </div>

            {/* Profile Image and Social Links */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-52 h-52 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-blue-100 to-indigo-200">
                  <Image
                    src="/profile.jpg"
                    alt="Vasilis Papageorgiou"
                    width={208}
                    height={208}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-2">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      title={link.name}
                      className="p-3 bg-white rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group shadow-sm"
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* News */}
        <section id="news" className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">News</h2>
          
          <div className="space-y-3">
            {news.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                <div className="flex items-start space-x-3">
                  <div className="text-blue-600 font-medium text-sm min-w-fit">{item.date}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-base">{item.title}</h3>
                    <p className="text-gray-700 text-sm">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Publications */}
        <section id="publications" className="mb-10">
          <div className="flex items-center space-x-2 mb-5">
            <Award className="w-5 h-5 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Publications</h2>
          </div>
          
          <div className="space-y-4">
            {publications.map((pub, index) => {
              const isExpanded = expandedAbstracts.has(index);
              const formattedAuthors = formatAuthors(pub.authors);
              return (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{pub.title}</h3>
                  <p className="text-gray-900 font-medium mb-1 text-sm">{pub.venue} ({pub.year})</p>
                  <p className="text-gray-600 mb-3 text-sm">
                    {formattedAuthors.map((author, i) => (
                      <span key={i} className={author.name === "Vasilis Papageorgiou" ? "font-bold underline" : ""}>
                        {author.link ? (
                          <a 
                            href={author.link} 
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {author.name}
                          </a>
                        ) : (
                          author.name
                        )}
                        {i < formattedAuthors.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                  
                  {/* Abstract Toggle Button */}
                  <button
                    onClick={() => toggleAbstract(index)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors mb-2"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                    <span className="text-xs font-medium">
                      {isExpanded ? "Hide Abstract" : "Show Abstract"}
                    </span>
                  </button>

                  {/* Collapsible Abstract */}
                  {isExpanded && (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                      <p className="text-gray-700 text-xs leading-relaxed">{pub.abstract}</p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <a 
                      href={pub.links.paper} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-xs"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Paper</span>
                      <ExternalLink className="w-2 h-2" />
                    </a>
                    {pub.links.code && (
                      <a 
                        href={pub.links.code} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-xs"
                      >
                        <Github className="w-3 h-3" />
                        <span>Code</span>
                        <ExternalLink className="w-2 h-2" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-400 mb-4">
            © 2025 Vasilis Papageorgiou. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            PhD Student in Computer Sciences at the University of Wisconsin-Madison
          </p>
        </div>
      </footer>
    </div>
  );
}
