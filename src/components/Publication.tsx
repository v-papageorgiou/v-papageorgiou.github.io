import { ChevronDown, ChevronUp, ExternalLink, FileText, Github, Globe } from 'lucide-react';
import { colors, classes, effects, transitions } from '@/styles/theme';

interface PublicationLinkSet {
  paper?: string;
  code?: string;
  website?: string;
}

interface PublicationAuthor {
  name: string;
  link?: string;
}

interface PublicationProps {
  title: string;
  authors: PublicationAuthor[];
  venue: string;
  year: string;
  abstract: string;
  links: PublicationLinkSet;
  tags?: string[];
  isExpanded: boolean;
  onToggle: () => void;
  abstractId: string;
}

export default function Publication({
  title,
  authors,
  venue,
  year,
  abstract,
  links,
  tags = [],
  isExpanded,
  onToggle,
  abstractId,
}: PublicationProps) {
  return (
    <article className={classes.card}>
      <header className="mb-3">
        <h3 className={`text-xl font-semibold ${colors.cyanDark} mb-1`}>{title}</h3>
        <p className={`${colors.orange} font-medium text-sm`}>{venue} ({year})</p>
      </header>

      <p className={`${colors.textSecondary} mb-3 text-sm`}>
        {authors.map((author, index) => {
          const separator = index < authors.length - 1 ? ', ' : '';
          const highlight = author.name === 'Vasilis Papageorgiou'
            ? `font-bold underline ${colors.orange}`
            : '';

          if (author.link) {
            return (
              <span key={author.name} className={highlight}>
                <a
                  href={author.link}
                  className={`${colors.cyan} ${colors.textLinkHover} hover:underline ${transitions.colors} ${effects.glowCyan}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {author.name}
                </a>
                {separator}
              </span>
            );
          }

          return (
            <span key={author.name} className={highlight}>
              {author.name}
              {separator}
            </span>
          );
        })}
      </p>

      {tags.length > 0 && (
        <ul className="mb-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-wide">
          {tags.map((tag) => (
            <li
              key={tag}
              className={`rounded-full border ${colors.borderSocial} px-3 py-1 ${colors.textFooterSecondary}`}
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={abstractId}
        className={`flex items-center space-x-1 ${colors.cyanLight} ${colors.textLinkHover} ${transitions.colors} mb-2 ${effects.glowCyan}`}
      >
        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        <span className="text-xs font-medium">
          {isExpanded ? 'Hide Abstract' : 'Show Abstract'}
        </span>
      </button>

      <section
        id={abstractId}
        aria-label={`Abstract for ${title}`}
        hidden={!isExpanded}
        className={`mb-3 rounded-lg border-l-4 ${colors.borderAbstract} ${colors.bgAbstract} p-3`}
      >
        <p className={`${colors.textBody} text-xs leading-relaxed`}>{abstract}</p>
      </section>

      <div className="flex flex-wrap gap-3 text-xs">
        {links.paper && (
          <a
            href={links.paper}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center space-x-1 ${colors.cyan} ${colors.textLinkHover} ${transitions.colors} ${effects.glowCyan}`}
          >
            <FileText className="w-3 h-3" />
            <span>Paper</span>
            <ExternalLink className="w-2 h-2" />
          </a>
        )}

        {links.code && (
          <a
            href={links.code}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center space-x-1 ${colors.cyan} ${colors.textLinkHover} ${transitions.colors} ${effects.glowCyan}`}
          >
            <Github className="w-3 h-3" />
            <span>Code</span>
            <ExternalLink className="w-2 h-2" />
          </a>
        )}

        {links.website && (
          <a
            href={links.website}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center space-x-1 ${colors.cyan} ${colors.textLinkHover} ${transitions.colors} ${effects.glowCyan}`}
          >
            <Globe className="w-3 h-3" />
            <span>Project</span>
            <ExternalLink className="w-2 h-2" />
          </a>
        )}
      </div>
    </article>
  );
}
