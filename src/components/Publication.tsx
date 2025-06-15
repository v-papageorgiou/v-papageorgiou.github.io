interface PublicationProps {
  title: string;
  authors: string[];
  venue: string;
  year: string;
  abstract: string;
  links: {
    paper?: string;
    code?: string;
    website?: string;
  };
}

export default function Publication({ 
  title, 
  authors, 
  venue, 
  year, 
  abstract, 
  links 
}: PublicationProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-2">
        {authors.map((author, i) => (
          <span key={i} className={author === "Vasilis Papageorgiou" ? "font-medium" : ""}>
            {author}{i < authors.length - 1 ? ", " : ""}
          </span>
        ))}
      </p>
      <p className="text-blue-600 font-medium mb-3">{venue} ({year})</p>
      <p className="text-gray-700 text-sm mb-4">{abstract}</p>
      <div className="flex space-x-4">
        {links.paper && (
          <a 
            href={links.paper} 
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Paper</span>
          </a>
        )}
        {links.code && (
          <a 
            href={links.code} 
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Code</span>
          </a>
        )}
        {links.website && (
          <a 
            href={links.website} 
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Website</span>
          </a>
        )}
      </div>
    </div>
  );
}
