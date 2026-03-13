import type { JobOption } from '@/types';

// Base company‑specific profiles (where we want custom wording).
const baseCompanyProfiles: JobOption[] = [
  {
    company: 'Google',
    role: 'Software Engineer',
    description:
      'Design, build and maintain large-scale distributed systems and developer productivity tools at Google.',
    requiredSkills: [
      'Data Structures',
      'Algorithms',
      'Java',
      'C++',
      'Python',
      'Go',
      'System Design',
    ],
    preferredSkills: ['Distributed Systems', 'Microservices', 'Kubernetes', 'GCP'],
    tools: ['Git', 'Bazel', 'Linux', 'GCP'],
    keywords: ['code review', 'scalability', 'latency', 'reliability'],
  },
  {
    company: 'Google',
    role: 'Product Manager',
    description:
      'Own product vision, roadmap and execution for user-facing or platform products at Google.',
    requiredSkills: [
      'Product Strategy',
      'Roadmapping',
      'Stakeholder Management',
      'User Research',
      'Data Analysis',
    ],
    preferredSkills: ['A/B Testing', 'SQL', 'Experimentation', 'Growth'],
    tools: ['Google Analytics', 'Looker', 'Tableau', 'Jira'],
    keywords: ['PRD', 'go-to-market', 'OKRs', 'KPIs'],
  },
  {
    company: 'Amazon',
    role: 'Software Development Engineer',
    description:
      'Design, implement and operate services that power Amazon products at massive scale.',
    requiredSkills: [
      'Java',
      'Python',
      'C++',
      'Object Oriented Design',
      'Data Structures',
      'Algorithms',
      'System Design',
    ],
    preferredSkills: ['AWS', 'Microservices', 'Distributed Systems'],
    tools: ['AWS', 'DynamoDB', 'SQS', 'Git'],
    keywords: ['low latency', 'high availability', 'SLA'],
  },
  {
    company: 'Amazon',
    role: 'Technical Program Manager',
    description:
      'Drive large cross-team technical programs, aligning engineering teams and business stakeholders.',
    requiredSkills: [
      'Program Management',
      'Roadmapping',
      'Risk Management',
      'Agile',
      'Scrum',
    ],
    preferredSkills: ['Software Engineering', 'Cloud', 'AWS'],
    tools: ['Jira', 'Confluence'],
    keywords: ['dependencies', 'milestones', 'cross-functional'],
  },
  {
    company: 'Microsoft',
    role: 'Software Engineer',
    description:
      'Build cloud and client software for Microsoft products and platforms.',
    requiredSkills: [
      'C#',
      'C++',
      'Java',
      'Python',
      'Data Structures',
      'Algorithms',
    ],
    preferredSkills: ['Azure', '.NET', 'Microservices'],
    tools: ['Azure', 'GitHub', 'Visual Studio'],
    keywords: ['design review', 'code review', 'performance'],
  },
  {
    company: 'Microsoft',
    role: 'Data Scientist',
    description:
      'Develop machine learning models and analytics solutions that power Microsoft products.',
    requiredSkills: [
      'Python',
      'R',
      'SQL',
      'Statistics',
      'Machine Learning',
    ],
    preferredSkills: ['Deep Learning', 'Azure ML', 'Experimentation'],
    tools: ['Azure ML', 'PyTorch', 'TensorFlow', 'Jupyter'],
    keywords: ['A/B testing', 'causal inference', 'forecasting'],
  },
  {
    company: 'Meta',
    role: 'Frontend Engineer',
    description:
      'Build high-performance, accessible web experiences using React and modern web technologies.',
    requiredSkills: [
      'JavaScript',
      'TypeScript',
      'React',
      'HTML',
      'CSS',
      'Web Performance',
    ],
    preferredSkills: ['Next.js', 'GraphQL', 'Design Systems'],
    tools: ['React', 'Jest', 'Webpack'],
    keywords: ['accessibility', 'responsive design', 'component library'],
  },
  {
    company: 'Meta',
    role: 'Backend Engineer',
    description:
      'Design and implement backend services that serve billions of requests with high reliability.',
    requiredSkills: [
      'Python',
      'Java',
      'C++',
      'Go',
      'Distributed Systems',
      'APIs',
      'Databases',
    ],
    preferredSkills: ['GraphQL', 'Caching', 'Messaging Queues'],
    tools: ['MySQL', 'RocksDB', 'Redis'],
    keywords: ['throughput', 'replication', 'sharding'],
  },
  {
    company: 'Apple',
    role: 'Software Engineer',
    description:
      'Develop high-quality software for Apple platforms with a strong focus on user experience.',
    requiredSkills: ['Swift', 'Objective-C', 'iOS', 'macOS', 'C++'],
    preferredSkills: ['Metal', 'Core Data', 'SwiftUI'],
    tools: ['Xcode', 'Instruments'],
    keywords: ['performance', 'latency', 'UI polish'],
  },
  {
    company: 'Adobe',
    role: 'Full Stack Developer',
    description:
      'Build full-stack web applications for creative and document cloud products.',
    requiredSkills: [
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'REST APIs',
      'SQL',
    ],
    preferredSkills: ['Microservices', 'AWS', 'Docker', 'Kubernetes'],
    tools: ['React', 'Node.js', 'PostgreSQL'],
    keywords: ['full stack', 'scalable', 'multi-tenant'],
  },
  {
    company: 'Infosys',
    role: 'Software Engineer',
    description:
      'Deliver enterprise applications and digital transformation projects for global clients.',
    requiredSkills: [
      'Java',
      'Spring',
      'REST APIs',
      'SQL',
      'OOP',
    ],
    preferredSkills: ['Microservices', 'Cloud', 'Angular', 'React'],
    tools: ['Spring Boot', 'Git', 'Jenkins'],
    keywords: ['client requirements', 'SDLC', 'onsite offshore'],
  },
  {
    company: 'TCS',
    role: 'Software Engineer',
    description:
      'Design and implement scalable enterprise systems across domains such as BFSI and retail.',
    requiredSkills: ['Java', '.NET', 'SQL', 'REST APIs'],
    preferredSkills: ['Cloud', 'Microservices', 'Agile'],
    tools: ['Git', 'Jira'],
    keywords: ['requirement analysis', 'unit testing', 'support'],
  },
  {
    company: 'Wipro',
    role: 'Backend Developer',
    description:
      'Develop backend services and integrations for enterprise clients.',
    requiredSkills: ['Java', 'Spring Boot', 'REST APIs', 'SQL'],
    preferredSkills: ['Microservices', 'AWS', 'Docker'],
    tools: ['Spring', 'Git', 'Jenkins'],
    keywords: ['integration', 'API', 'scalability'],
  },
  {
    company: 'Accenture',
    role: 'Cloud Engineer',
    description:
      'Design and implement secure, scalable cloud solutions on AWS, Azure or GCP.',
    requiredSkills: ['Cloud Architecture', 'AWS', 'Azure', 'GCP', 'Networking'],
    preferredSkills: ['Terraform', 'Kubernetes', 'Docker'],
    tools: ['AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes'],
    keywords: ['migration', 'cloud security', 'cost optimization'],
  },
  {
    company: 'Deloitte',
    role: 'Data Analyst',
    description:
      'Analyze client data, build dashboards and support decision-making for consulting projects.',
    requiredSkills: ['SQL', 'Excel', 'Data Visualization', 'Statistics'],
    preferredSkills: ['Power BI', 'Tableau', 'Python'],
    tools: ['Power BI', 'Tableau', 'Excel'],
    keywords: ['dashboard', 'KPIs', 'insights'],
  },
  {
    company: 'Goldman Sachs',
    role: 'Software Engineer',
    description:
      'Build low-latency trading and risk systems for Goldman Sachs.',
    requiredSkills: ['Java', 'C++', 'Data Structures', 'Algorithms'],
    preferredSkills: ['KDB+', 'Scala'],
    tools: ['Linux', 'Git'],
    keywords: ['latency', 'throughput', 'risk'],
  },
  {
    company: 'Flipkart',
    role: 'Backend Developer',
    description:
      'Develop backend services for large-scale e-commerce systems.',
    requiredSkills: ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'SQL'],
    preferredSkills: ['Redis', 'Elasticsearch'],
    tools: ['Kafka', 'MySQL', 'Redis'],
    keywords: ['e-commerce', 'order management', 'catalog'],
  },
];

// Role templates reused across companies so that every company exposes a rich set of roles.
const roleTemplates: Omit<JobOption, 'company'>[] = [
  {
    role: 'Software Engineer',
    description:
      'Generalist software engineer working on backend or full-stack systems.',
    requiredSkills: ['Data Structures', 'Algorithms', 'Git', 'Unit Testing'],
    preferredSkills: ['System Design', 'CI/CD'],
    tools: ['Git', 'Jest', 'Docker'],
    keywords: ['code review', 'agile', 'scrum'],
  },
  {
    role: 'Backend Developer',
    description: 'Backend engineer building APIs and services.',
    requiredSkills: ['Node.js', 'Express', 'REST APIs', 'SQL', 'NoSQL'],
    preferredSkills: ['Microservices', 'Docker', 'Kubernetes'],
    tools: ['Node.js', 'PostgreSQL', 'MongoDB'],
    keywords: ['API', 'latency', 'throughput'],
  },
  {
    role: 'Frontend Developer',
    description: 'Frontend engineer building modern web UIs.',
    requiredSkills: ['JavaScript', 'TypeScript', 'React', 'HTML', 'CSS'],
    preferredSkills: ['Next.js', 'Accessibility', 'Performance'],
    tools: ['React', 'Next.js', 'Storybook'],
    keywords: ['responsive', 'SPA', 'design system'],
  },
  {
    role: 'Full Stack Developer',
    description: 'Engineer working across frontend and backend.',
    requiredSkills: ['React', 'Node.js', 'REST APIs', 'SQL', 'Git'],
    preferredSkills: ['TypeScript', 'Docker', 'Cloud'],
    tools: ['React', 'Node.js', 'PostgreSQL'],
    keywords: ['end-to-end', 'ownership', 'deployment'],
  },
  {
    role: 'Data Scientist',
    description: 'Build ML models and perform advanced analytics.',
    requiredSkills: ['Python', 'Pandas', 'NumPy', 'Statistics', 'Machine Learning'],
    preferredSkills: ['Deep Learning', 'MLOps'],
    tools: ['Jupyter', 'scikit-learn', 'TensorFlow', 'PyTorch'],
    keywords: ['classification', 'regression', 'clustering'],
  },
  {
    role: 'Data Analyst',
    description: 'Analyze data and build dashboards for business stakeholders.',
    requiredSkills: ['SQL', 'Excel', 'Data Visualization', 'Statistics'],
    preferredSkills: ['Power BI', 'Tableau', 'Python'],
    tools: ['Power BI', 'Tableau', 'Excel'],
    keywords: ['dashboard', 'KPI', 'insights'],
  },
  {
    role: 'Machine Learning Engineer',
    description: 'Productionize ML models and build ML pipelines.',
    requiredSkills: ['Python', 'Machine Learning', 'MLOps', 'APIs'],
    preferredSkills: ['TensorFlow', 'PyTorch', 'Kubeflow'],
    tools: ['Docker', 'Kubernetes', 'TensorFlow', 'PyTorch'],
    keywords: ['model deployment', 'pipelines', 'monitoring'],
  },
  {
    role: 'Cloud Engineer',
    description: 'Design and operate infrastructure on major cloud providers.',
    requiredSkills: ['AWS', 'Azure', 'GCP', 'Networking', 'Linux'],
    preferredSkills: ['Terraform', 'Kubernetes', 'Docker'],
    tools: ['AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes'],
    keywords: ['VPC', 'IAM', 'cost optimization'],
  },
  {
    role: 'DevOps Engineer',
    description: 'Own CI/CD pipelines and infrastructure automation.',
    requiredSkills: ['CI/CD', 'Docker', 'Kubernetes', 'Linux'],
    preferredSkills: ['Terraform', 'Helm', 'Monitoring'],
    tools: ['Jenkins', 'GitHub Actions', 'Prometheus', 'Grafana'],
    keywords: ['pipeline', 'automation', 'observability'],
  },
  {
    role: 'Graphic Designer',
    description: 'Create visual assets, marketing materials and brand-aligned graphics.',
    requiredSkills: ['Adobe Photoshop', 'Illustrator', 'Typography', 'Layout'],
    preferredSkills: ['After Effects', 'Figma'],
    tools: ['Adobe Creative Cloud', 'Figma'],
    keywords: ['branding', 'visual identity', 'creative assets'],
  },
  {
    role: 'UI/UX Designer',
    description: 'Design user-centric interfaces and experiences for web and mobile products.',
    requiredSkills: ['Wireframing', 'Prototyping', 'User Research', 'Interaction Design'],
    preferredSkills: ['Design Systems', 'Accessibility'],
    tools: ['Figma', 'Sketch', 'Adobe XD'],
    keywords: ['user flows', 'usability testing', 'design system'],
  },
  {
    role: 'Cybersecurity Engineer',
    description: 'Protect systems and data from security threats.',
    requiredSkills: ['Network Security', 'Vulnerability Management', 'SIEM'],
    preferredSkills: ['Cloud Security', 'Penetration Testing'],
    tools: ['Splunk', 'Wireshark', 'Nessus'],
    keywords: ['threat detection', 'incident response', 'compliance'],
  },
  {
    role: 'Mobile App Developer',
    description: 'Build native or cross-platform mobile applications.',
    requiredSkills: ['Android', 'iOS', 'Kotlin', 'Swift', 'React Native', 'Flutter'],
    preferredSkills: ['Mobile CI/CD', 'Play Store', 'App Store'],
    tools: ['Android Studio', 'Xcode', 'React Native'],
    keywords: ['mobile', 'push notifications', 'offline'],
  },
  {
    role: 'Business Analyst',
    description: 'Gather requirements and translate them into technical solutions.',
    requiredSkills: ['Requirement Gathering', 'Process Mapping', 'SQL'],
    preferredSkills: ['Agile', 'Scrum'],
    tools: ['Jira', 'Confluence'],
    keywords: ['user stories', 'acceptance criteria', 'stakeholders'],
  },
  {
    role: 'Product Manager',
    description: 'Own product discovery, delivery and lifecycle.',
    requiredSkills: ['Product Strategy', 'Roadmapping', 'User Research'],
    preferredSkills: ['Analytics', 'Experimentation'],
    tools: ['Jira', 'Figma', 'Analytics Tools'],
    keywords: ['MVP', 'OKRs', 'KPIs'],
  },
];

const templateCompanies = [
  'Google',
  'Microsoft',
  'Amazon',
  'Meta',
  'Apple',
  'Adobe',
  'Infosys',
  'TCS',
  'Wipro',
  'Accenture',
  'Deloitte',
  'Flipkart',
];

const generatedCompanyProfiles: JobOption[] = templateCompanies.flatMap(
  (company) =>
    roleTemplates.map((tpl) => ({
      company,
      ...tpl,
    }))
);

// Generic role profiles (company-agnostic) for custom combinations.
const genericProfiles: JobOption[] = [
  {
    company: 'Generic',
    role: 'Software Engineer',
    description:
      'Generalist software engineer working on backend or full-stack systems.',
    requiredSkills: ['Data Structures', 'Algorithms', 'Git', 'Unit Testing'],
    preferredSkills: ['System Design', 'CI/CD'],
    tools: ['Git', 'Jest', 'Docker'],
    keywords: ['code review', 'agile', 'scrum'],
  },
  {
    company: 'Generic',
    role: 'Backend Developer',
    description: 'Backend engineer building APIs and services.',
    requiredSkills: ['Node.js', 'Express', 'REST APIs', 'SQL', 'NoSQL'],
    preferredSkills: ['Microservices', 'Docker', 'Kubernetes'],
    tools: ['Node.js', 'PostgreSQL', 'MongoDB'],
    keywords: ['API', 'latency', 'throughput'],
  },
  {
    company: 'Generic',
    role: 'Frontend Developer',
    description: 'Frontend engineer building modern web UIs.',
    requiredSkills: ['JavaScript', 'TypeScript', 'React', 'HTML', 'CSS'],
    preferredSkills: ['Next.js', 'Accessibility', 'Performance'],
    tools: ['React', 'Next.js', 'Storybook'],
    keywords: ['responsive', 'SPA', 'design system'],
  },
  {
    company: 'Generic',
    role: 'Full Stack Developer',
    description: 'Engineer working across frontend and backend.',
    requiredSkills: ['React', 'Node.js', 'REST APIs', 'SQL', 'Git'],
    preferredSkills: ['TypeScript', 'Docker', 'Cloud'],
    tools: ['React', 'Node.js', 'PostgreSQL'],
    keywords: ['end-to-end', 'ownership', 'deployment'],
  },
  {
    company: 'Generic',
    role: 'Data Scientist',
    description: 'Build ML models and perform advanced analytics.',
    requiredSkills: ['Python', 'Pandas', 'NumPy', 'Statistics', 'Machine Learning'],
    preferredSkills: ['Deep Learning', 'MLOps'],
    tools: ['Jupyter', 'scikit-learn', 'TensorFlow', 'PyTorch'],
    keywords: ['classification', 'regression', 'clustering'],
  },
  {
    company: 'Generic',
    role: 'Machine Learning Engineer',
    description: 'Productionize ML models and build ML pipelines.',
    requiredSkills: ['Python', 'Machine Learning', 'MLOps', 'APIs'],
    preferredSkills: ['TensorFlow', 'PyTorch', 'Kubeflow'],
    tools: ['Docker', 'Kubernetes', 'TensorFlow', 'PyTorch'],
    keywords: ['model deployment', 'pipelines', 'monitoring'],
  },
  {
    company: 'Generic',
    role: 'AI Engineer',
    description: 'Build AI-powered applications using LLMs and ML models.',
    requiredSkills: ['Python', 'LLMs', 'Prompt Engineering', 'APIs'],
    preferredSkills: ['LangChain', 'Vector Databases'],
    tools: ['OpenAI', 'Gemini', 'Pinecone'],
    keywords: ['RAG', 'chatbot', 'generative AI'],
  },
  {
    company: 'Generic',
    role: 'Cloud Engineer',
    description: 'Design and operate infrastructure on major cloud providers.',
    requiredSkills: ['AWS', 'Azure', 'GCP', 'Networking', 'Linux'],
    preferredSkills: ['Terraform', 'Kubernetes', 'Docker'],
    tools: ['AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes'],
    keywords: ['VPC', 'IAM', 'cost optimization'],
  },
  {
    company: 'Generic',
    role: 'DevOps Engineer',
    description: 'Own CI/CD pipelines and infrastructure automation.',
    requiredSkills: ['CI/CD', 'Docker', 'Kubernetes', 'Linux'],
    preferredSkills: ['Terraform', 'Helm', 'Monitoring'],
    tools: ['Jenkins', 'GitHub Actions', 'Prometheus', 'Grafana'],
    keywords: ['pipeline', 'automation', 'observability'],
  },
  {
    company: 'Generic',
    role: 'Data Analyst',
    description: 'Analyze data and build dashboards for business stakeholders.',
    requiredSkills: ['SQL', 'Excel', 'Data Visualization', 'Statistics'],
    preferredSkills: ['Power BI', 'Tableau', 'Python'],
    tools: ['Power BI', 'Tableau', 'Excel'],
    keywords: ['dashboard', 'KPI', 'insights'],
  },
  {
    company: 'Generic',
    role: 'Business Analyst',
    description: 'Gather requirements and translate them into technical solutions.',
    requiredSkills: ['Requirement Gathering', 'Process Mapping', 'SQL'],
    preferredSkills: ['Agile', 'Scrum'],
    tools: ['Jira', 'Confluence'],
    keywords: ['user stories', 'acceptance criteria', 'stakeholders'],
  },
  {
    company: 'Generic',
    role: 'Product Manager',
    description: 'Own product discovery, delivery and lifecycle.',
    requiredSkills: ['Product Strategy', 'Roadmapping', 'User Research'],
    preferredSkills: ['Analytics', 'Experimentation'],
    tools: ['Jira', 'Figma', 'Analytics Tools'],
    keywords: ['MVP', 'OKRs', 'KPIs'],
  },
  {
    company: 'Generic',
    role: 'Cybersecurity Engineer',
    description: 'Protect systems and data from security threats.',
    requiredSkills: ['Network Security', 'Vulnerability Management', 'SIEM'],
    preferredSkills: ['Cloud Security', 'Penetration Testing'],
    tools: ['Splunk', 'Wireshark', 'Nessus'],
    keywords: ['threat detection', 'incident response', 'compliance'],
  },
  {
    company: 'Generic',
    role: 'Mobile App Developer',
    description: 'Build native or cross-platform mobile applications.',
    requiredSkills: ['Android', 'iOS', 'Kotlin', 'Swift', 'React Native', 'Flutter'],
    preferredSkills: ['Mobile CI/CD', 'Play Store', 'App Store'],
    tools: ['Android Studio', 'Xcode', 'React Native'],
    keywords: ['mobile', 'push notifications', 'offline'],
  },
  {
    company: 'Generic',
    role: 'Graphic Designer',
    description: 'Create visual assets, marketing materials and brand-aligned graphics.',
    requiredSkills: ['Adobe Photoshop', 'Illustrator', 'Typography', 'Layout'],
    preferredSkills: ['After Effects', 'Figma'],
    tools: ['Adobe Creative Cloud', 'Figma'],
    keywords: ['branding', 'visual identity', 'creative assets'],
  },
  {
    company: 'Generic',
    role: 'UI/UX Designer',
    description: 'Design user-centric interfaces and experiences for web and mobile products.',
    requiredSkills: ['Wireframing', 'Prototyping', 'User Research', 'Interaction Design'],
    preferredSkills: ['Design Systems', 'Accessibility'],
    tools: ['Figma', 'Sketch', 'Adobe XD'],
    keywords: ['user flows', 'usability testing', 'design system'],
  },
];

// Central catalog of company/role profiles used for JD text, skills and keyword matching.
// We keep base profiles first so they are preferred when duplicates exist.
export const jobDescriptions: JobOption[] = [
  ...baseCompanyProfiles,
  ...generatedCompanyProfiles,
  ...genericProfiles,
];

export function getJobDescription(company: string, role: string): string | null {
  const found = jobDescriptions.find(
    (j) =>
      j.company.toLowerCase() === company.toLowerCase() &&
      j.role.toLowerCase() === role.toLowerCase()
  );
  return found ? found.description : null;
}

export function getJobProfile(
  company: string | null | undefined,
  role: string | null | undefined
): JobOption | null {
  if (!company || !role) return null;
  const found = jobDescriptions.find(
    (j) =>
      j.company.toLowerCase() === company.toLowerCase() &&
      j.role.toLowerCase() === role.toLowerCase()
  );
  return found ?? null;
}

export function getCompanies(): string[] {
  return Array.from(new Set(jobDescriptions.map((j) => j.company))).sort();
}

export function getRolesByCompany(company: string): string[] {
  return Array.from(
    new Set(
      jobDescriptions.filter((j) => j.company === company).map((j) => j.role)
    ),
  );
}
