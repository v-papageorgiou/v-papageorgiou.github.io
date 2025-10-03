'use client';

import { useState } from 'react';
import Image from "next/image";
import Navigation from "@/components/Navigation";
import { 
  GraduationCap, 
  MapPin, 
  Mail, 
  Github,
  LinkedinIcon,
  FileText,
  Award
} from "lucide-react";
import Publication from "@/components/Publication";
import { publications, formatAuthors } from "@/data/publications";
import { news } from "@/data/news";
import { socialLinks as importedSocialLinks } from "@/data/personal";
import { getColleagueLink } from "@/data/colleagues";
import { colors, effects, transitions, classes } from "@/styles/theme";

const formatNewsDate = (isoDate: string) => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

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

      <main id="main-content" className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section id="about" className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12 items-start">
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
                  My research interests revolve around LLMs, Reasoning, Machine Learning, and Deep Learning.
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
                  <time
                    dateTime={item.date}
                    className={`${colors.cyan} font-medium text-sm min-w-fit`}
                  >
                    {formatNewsDate(item.date)}
                  </time>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`font-semibold ${colors.cyanDark} text-base`}>{item.title}</h3>
                      {item.category && (
                        <span className={`text-[11px] uppercase tracking-wide px-2 py-0.5 rounded-full border ${colors.borderSocial} ${colors.textFooterSecondary}`}>
                          {item.category}
                        </span>
                      )}
                      {item.highlight && (
                        <span className={`text-[11px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-200`}>
                          Highlight
                        </span>
                      )}
                    </div>
                    <p className={`${colors.textBody} text-sm mt-1`}>{item.description}</p>
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
                <Publication
                  key={pub.title}
                  title={pub.title}
                  authors={formattedAuthors}
                  venue={pub.venue}
                  year={pub.year}
                  abstract={pub.abstract}
                  links={pub.links}
                  tags={pub.tags}
                  isExpanded={isExpanded}
                  onToggle={() => toggleAbstract(index)}
                  abstractId={`abstract-${index}`}
                />
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
