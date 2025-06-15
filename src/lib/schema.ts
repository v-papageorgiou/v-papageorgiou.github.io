import { Person, WithContext } from 'schema-dts';

export const personSchema: WithContext<Person> = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Vasilis Papageorgiou',
  jobTitle: 'PhD Student in Computer Science',
  affiliation: {
    '@type': 'Organization',
    name: 'University of Wisconsin-Madison',
    url: 'https://www.wisc.edu'
  },
  worksFor: {
    '@type': 'Organization',
    name: 'AWS AI Labs',
    url: 'https://aws.amazon.com'
  },
  alumniOf: {
    '@type': 'Organization',
    name: 'Technical University of Crete',
    url: 'https://www.tuc.gr'
  },
  knowsAbout: [
    'Machine Learning',
    'Deep Learning',
    'Large Language Models',
    'Reasoning Models',
    'Computer Science',
    'Artificial Intelligence'
  ],
  email: 'vpapageorgiou@wisc.edu',
  url: 'https://v-papageorgiou.github.io',
  sameAs: [
    'https://scholar.google.com/citations?user=YOUR_ID',
    'https://github.com/yourusername',
    'https://twitter.com/yourusername',
    'https://linkedin.com/in/yourusername'
  ]
};
