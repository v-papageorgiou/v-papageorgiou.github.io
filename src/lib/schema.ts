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
  email: 'vpapageorgio@wisc.edu',
  url: 'https://v-papageorgiou.github.io',
  sameAs: [
    'https://scholar.google.com/citations?user=dUQ-VYsAAAAJ',
    'https://github.com/v-papageorgiou',
    'https://x.com/vpapageorgiou_',
    'https://linkedin.com/in/v-papageorgiou'
  ]
};
