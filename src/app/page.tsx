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
import { colors, effects, transitions, classes } from "@/styles/theme";

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
    <div className={`min-h-screen ${colors.bgMain}`}>
      {/* Header */}
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section id="about" className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2">
              <h1 className={`text-3xl font-bold ${colors.cyanLight} mb-3 ${effects.dropShadow}`}>
                Vasilis Papageorgiou
              </h1>
              <div className={`flex items-center space-x-3 ${colors.cyanLight} mb-4 text-sm`}>
                <div className="flex items-center space-x-1">
                  <GraduationCap className={`w-4 h-4 ${colors.cyan}`} />
                  <span>PhD Student in Computer Science</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className={`w-4 h-4 ${colors.cyan}`} />
                  <span>UW-Madison</span>
                </div>
              </div>
              
              <div className={`prose prose-base ${colors.textBody} text-base leading-relaxed`}>
                <p className="mb-3">
                  Hello! I am a 4th year PhD student in Computer Sciences at the University of Wisconsin-Madison, 
                  advised by <a href={getColleagueLink("Dimitris Papailiopoulos")} className={`${colors.cyanLight} ${colors.textLinkHover} ${transitions.colors} ${effects.glowCyan}`}>Dimitris Papailiopoulos</a>. 
                  My research interests revolve around Large Language Models (LLMs), Machine Learning, and Deep Learning, 
                  with a focus on both theoretical and practical aspects.
                </p>
                <p className="mb-3">
                  Previously, I earned my diploma in Electrical and Computer Engineering from the Technical University of Crete, 
                  Greece, where I worked with <a href={getColleagueLink("Aggelos Bletsas")} className={`${colors.cyanLight} ${colors.textLinkHover} ${transitions.colors} ${effects.glowCyan}`}>Prof. Aggelos Bletsas</a>  on asynchronous algorithms for distributed inference in wireless sensor networks.
                </p>
                <p className="mb-0">
                  Currently, I am also a research intern at AWS AI Labs in Pasadena, CA, where I am working on reasoning models.
                </p>
              </div>
            </div>

            {/* Profile Image and Social Links */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className={`w-52 h-52 rounded-2xl overflow-hidden border-4 ${colors.borderProfile} ${effects.shadowLg} ${colors.bgProfileImage} ${effects.shadowCyan} ${effects.profileGlow}`}>
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
                      className={classes.socialIcon}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      <Icon className={classes.socialIconContent} />
                    </a>
                  );
                })}
              </div>

              {/* CV Button */}
              <div className="mt-4 flex justify-center">
                <a
                  href="/cv.pdf"
                  className={classes.cvButton}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium">CV</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* News */}
        <section id="news" className="mb-10">
          <h2 className={`text-2xl font-bold ${colors.orange} mb-5 ${effects.dropShadow}`}>News</h2>
          
          <div className="space-y-3">
            {news.map((item, index) => (
              <div key={index} className={classes.card}>
                <div className="flex items-start space-x-3">
                  <div className={`${colors.cyan} font-medium text-sm min-w-fit`}>{item.date}</div>
                  <div>
                    <h3 className={`font-semibold ${colors.cyanDark} mb-1 text-base`}>{item.title}</h3>
                    <p className={`${colors.textBody} text-sm`}>{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Publications */}
        <section id="publications" className="mb-10">
          <div className="flex items-center space-x-2 mb-5">
            <Award className={`w-5 h-5 ${colors.cyan} ${effects.iconGlow}`} />
            <h2 className={`text-2xl font-bold ${colors.orange} ${effects.dropShadow}`}>Publications</h2>
          </div>
          
          <div className="space-y-4">
            {publications.map((pub, index) => {
              const isExpanded = expandedAbstracts.has(index);
              const formattedAuthors = formatAuthors(pub.authors);
              return (
                <div key={index} className={classes.card}>
                  <h3 className={`text-xl font-semibold ${colors.cyanDark} mb-1`}>{pub.title}</h3>
                  <p className={`${colors.orange} font-medium mb-1 text-sm`}>{pub.venue} ({pub.year})</p>
                  <p className={`${colors.textSecondary} mb-3 text-sm`}>
                    {formattedAuthors.map((author, i) => (
                      <span key={i} className={author.name === "Vasilis Papageorgiou" ? `font-bold underline ${colors.orange}` : ""}>
                        {author.link && author.link !== "#" ? (
                          <a 
                            href={author.link} 
                            className={`${colors.cyan} ${colors.textLinkHover} hover:underline ${transitions.colors} ${effects.glowCyan}`}
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
                    className={`flex items-center space-x-1 ${colors.cyanLight} ${colors.textLinkHover} ${transitions.colors} mb-2 ${effects.glowCyan}`}
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
                    <div className={`mb-3 p-3 ${colors.bgAbstract} rounded-lg border-l-4 ${colors.borderAbstract} ${colors.bgAbstract}`}>
                      <p className={`${colors.textBody} text-xs leading-relaxed`}>{pub.abstract}</p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <a 
                      href={pub.links.paper} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-1 ${colors.cyan} ${colors.textLinkHover} text-xs ${transitions.colors} ${effects.glowCyan}`}
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
                        className={`flex items-center space-x-1 ${colors.cyan} ${colors.textLinkHover} text-xs ${transitions.colors} ${effects.glowCyan}`}
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
      <footer className={`bg-black border-t ${colors.borderNav} text-white py-12`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className={`${colors.textFooterPrimary} mb-4`}>
            © 2025 Vasilis Papageorgiou. All rights reserved.
          </p>
          <p className={`${colors.textFooterSecondary} text-sm`}>
            PhD Student in Computer Sciences at the University of Wisconsin-Madison
          </p>
        </div>
      </footer>
    </div>
  );
}
