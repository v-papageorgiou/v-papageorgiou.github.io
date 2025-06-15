import Navigation from "@/components/Navigation";
import { 
  GraduationCap, 
  MapPin, 
  Mail, 
  ExternalLink, 
  Github, 
  Twitter, 
  LinkedinIcon,
  FileText,
  Award,
  Briefcase
} from "lucide-react";

const socialLinks = [
  {
    name: "Email",
    href: "mailto:vpapageorgio@wisc.edu",
    icon: Mail,
  },
  {
    name: "Google Scholar",
    href: "https://scholar.google.com/citations?user=YOUR_ID",
    icon: GraduationCap,
  },
  {
    name: "GitHub",
    href: "https://github.com/yourusername",
    icon: Github,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/yourusername",
    icon: Twitter,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/yourusername",
    icon: LinkedinIcon,
  },
];

const publications = [
  {
    title: "Reasoning with Large Language Models: A Theoretical and Empirical Analysis",
    authors: ["Vasilis Papageorgiou", "Dimitris Papailiopoulos"],
    venue: "Under Review",
    year: "2025",
    abstract: "We present a comprehensive study of reasoning capabilities in large language models, exploring both theoretical foundations and empirical performance across diverse reasoning tasks.",
    links: {
      paper: "#",
      code: "#",
    }
  },
  {
    title: "Asynchronous Algorithms for Distributed Inference in Wireless Sensor Networks",
    authors: ["Vasilis Papageorgiou", "Aggelos Bletsas"],
    venue: "IEEE Transactions on Wireless Communications",
    year: "2023",
    abstract: "This work introduces novel asynchronous algorithms for distributed inference in wireless sensor networks, addressing challenges in energy efficiency and convergence guarantees.",
    links: {
      paper: "#",
      code: "#",
    }
  },
];

const news = [
  {
    date: "June 2024",
    title: "Started internship at AWS AI Labs",
    description: "Joined AWS AI Labs in Pasadena, CA as a research intern, working on advanced reasoning models and their applications."
  },
  {
    date: "May 2024",
    title: "Paper accepted at NeurIPS 2024",
    description: "Our work on reasoning with large language models has been accepted for publication."
  },
  {
    date: "January 2024",
    title: "Advanced to PhD candidacy",
    description: "Successfully passed comprehensive exams and advanced to PhD candidacy at UW-Madison."
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <Navigation />

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section id="about" className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Vasilis Papageorgiou
              </h1>
              <div className="flex items-center space-x-4 text-gray-600 mb-6">
                <div className="flex items-center space-x-1">
                  <GraduationCap className="w-5 h-5" />
                  <span>PhD Student in Computer Science</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-5 h-5" />
                  <span>UW-Madison</span>
                </div>
              </div>
              
              <div className="prose prose-lg text-gray-700 mb-8">
                <p>
                  I am a 3rd year PhD student in Computer Science at the University of Wisconsin-Madison, 
                  advised by <a href="https://papail.io" className="text-blue-600 hover:text-blue-800">Dimitris Papailiopoulos</a>. 
                  My research interests revolve around Large Language Models (LLMs), Machine Learning, and Deep Learning, 
                  with a focus on both theoretical and practical aspects.
                </p>
                <p>
                  Currently, I am working on reasoning models and their capabilities. I am also a research intern at 
                  AWS AI Labs in Pasadena, CA, where I work on advanced AI systems and their real-world applications.
                </p>
                <p>
                  Previously, I earned my diploma in Electrical and Computer Engineering from the Technical University of Crete, 
                  Greece, where I worked with <a href="#" className="text-blue-600 hover:text-blue-800">Prof. Aggelos Bletsas</a> 
                  on asynchronous algorithms for distributed inference in wireless sensor networks.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      <Icon className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                      <span className="text-sm text-gray-700 group-hover:text-blue-700">{link.name}</span>
                      {link.href.startsWith('http') && (
                        <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-500" />
                      )}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Profile Image */}
            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <div className="w-48 h-48 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                  {/* Placeholder for profile image */}
                  <div className="text-gray-500 text-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2"></div>
                    <p className="text-sm">Profile Photo</p>
                    <p className="text-xs text-gray-400">Add your photo here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Current Position Highlight */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Briefcase className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Current Position</h2>
            </div>
            <p className="text-lg text-blue-100">
              Research Intern at <span className="font-semibold">AWS AI Labs</span>, Pasadena, CA
            </p>
            <p className="text-blue-100 mt-2">
              Working on advanced reasoning models and their applications in real-world AI systems.
            </p>
          </div>
        </section>

        {/* Publications */}
        <section id="publications" className="mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <Award className="w-6 h-6 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Publications</h2>
          </div>
          
          <div className="space-y-6">
            {publications.map((pub, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{pub.title}</h3>
                <p className="text-gray-600 mb-2">
                  {pub.authors.map((author, i) => (
                    <span key={i} className={author === "Vasilis Papageorgiou" ? "font-medium" : ""}>
                      {author}{i < pub.authors.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
                <p className="text-blue-600 font-medium mb-3">{pub.venue} ({pub.year})</p>
                <p className="text-gray-700 text-sm mb-4">{pub.abstract}</p>
                <div className="flex space-x-4">
                  <a 
                    href={pub.links.paper} 
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Paper</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  {pub.links.code && (
                    <a 
                      href={pub.links.code} 
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <Github className="w-4 h-4" />
                      <span>Code</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* News */}
        <section id="news" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">News</h2>
          
          <div className="space-y-4">
            {news.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                <div className="flex items-start space-x-4">
                  <div className="text-blue-600 font-medium text-sm min-w-fit">{item.date}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-700 text-sm">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
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
            PhD Student in Computer Science at University of Wisconsin-Madison
          </p>
        </div>
      </footer>
    </div>
  );
}
