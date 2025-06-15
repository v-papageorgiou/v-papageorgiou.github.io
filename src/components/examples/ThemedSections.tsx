/**
 * Example of how the page.tsx file could be refactored to use themed components
 * This demonstrates the modular approach with cleaner, more maintainable code
 */

import React from 'react';
import { ThemedHeading, ThemedCard, ThemedButton } from '@/components/themed/ThemedComponents';
import { colors, classes } from '@/styles/theme';
import { FileText } from 'lucide-react';

// Example of how the News section would look with themed components:
const NewsSection = ({ news }: { news: Array<{ date: string; title: string; description: string }> }) => (
  <section id="news" className="mb-10">
    <ThemedHeading level={2}>News</ThemedHeading>
    
    <div className="space-y-3">
      {news.map((item, index) => (
        <ThemedCard key={index}>
          <div className="flex items-start space-x-3">
            <div className={`${colors.cyan} font-medium text-sm min-w-fit`}>
              {item.date}
            </div>
            <div>
              <h3 className={`font-semibold ${colors.cyanDark} mb-1 text-base`}>
                {item.title}
              </h3>
              <p className={`${colors.textBody} text-sm`}>
                {item.description}
              </p>
            </div>
          </div>
        </ThemedCard>
      ))}
    </div>
  </section>
);

// Example of how social links would look:
const SocialLinks = ({ socialLinks }: { socialLinks: Array<{ name: string; href: string; icon: React.ComponentType<{ className?: string }> }> }) => (
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
);

// Example of CV button:
const CVButton = () => (
  <div className="mt-4 flex justify-center">
    <ThemedButton 
      href="/cv.pdf" 
      icon={<FileText className="w-4 h-4" />}
      external={true}
    >
      CV
    </ThemedButton>
  </div>
);

// Benefits of this approach:
// 1. All colors and styles are centralized in theme.ts
// 2. Components are reusable and consistent
// 3. Easy to change the entire theme by modifying theme.ts
// 4. Type-safe theme configuration
// 5. Cleaner, more readable component code
// 6. Better maintainability and scalability

export { NewsSection, SocialLinks, CVButton };
