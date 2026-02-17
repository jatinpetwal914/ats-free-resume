import type { JobOption } from '@/types';

export const jobDescriptions: JobOption[] = [
  {
    company: 'Google',
    role: 'Software Engineer',
    description: `Responsibilities:
- Design, develop, test, deploy, maintain and improve software.
- Manage individual project priorities, deadlines and deliverables.
- Write clean, maintainable code and perform code reviews.
- Collaborate with cross-functional teams on technical design and implementation.

Requirements:
- Bachelor's degree in Computer Science or equivalent practical experience.
- Experience with one or more general purpose programming languages (e.g., Java, C/C++, Python, Go).
- Experience with data structures, algorithms, and software design.
- Strong problem-solving and analytical skills.

Preferred:
- Master's degree or PhD in Computer Science or related field.
- Experience with large-scale distributed systems.
- Knowledge of cloud platforms (GCP, AWS).
- Experience with machine learning or AI systems.`,
  },
  {
    company: 'Google',
    role: 'Product Manager',
    description: `Responsibilities:
- Define product strategy and roadmap.
- Work with engineering, design, and cross-functional teams.
- Analyze market trends and user feedback.
- Drive product launches and go-to-market strategy.

Requirements:
- Bachelor's degree or equivalent experience.
- 5+ years of product management experience.
- Strong analytical and problem-solving skills.
- Excellent communication and stakeholder management.

Preferred:
- MBA or technical degree.
- Experience in B2B or enterprise products.
- Data-driven decision making.`,
  },
  {
    company: 'Amazon',
    role: 'Software Development Engineer',
    description: `Responsibilities:
- Design and build scalable, reliable systems.
- Write high-quality code with automated tests.
- Participate in design and code reviews.
- Own delivery of features from design to production.

Requirements:
- Bachelor's degree in Computer Science or related field.
- Proficiency in at least one programming language (Java, Python, C++, etc.).
- Understanding of data structures, algorithms, and OOP.
- Experience with distributed systems or databases.

Preferred:
- Experience with AWS services.
- Knowledge of system design and scalability.
- Agile/Scrum experience.`,
  },
  {
    company: 'Amazon',
    role: 'Technical Program Manager',
    description: `Responsibilities:
- Lead cross-functional technical projects.
- Define project scope, timeline, and deliverables.
- Remove blockers and manage risks.
- Communicate status to stakeholders.

Requirements:
- Bachelor's degree in Engineering, CS, or related.
- 5+ years of technical program or project management.
- Experience with Agile/Scrum.
- Strong written and verbal communication.

Preferred:
- PMP or similar certification.
- Experience in e-commerce or cloud.`,
  },
  {
    company: 'Microsoft',
    role: 'Software Engineer',
    description: `Responsibilities:
- Design, develop, and ship software features.
- Collaborate with PM and design teams.
- Debug and resolve technical issues.
- Contribute to engineering best practices.

Requirements:
- Bachelor's degree in Computer Science or related.
- Experience with C#, C++, Java, or Python.
- Understanding of algorithms and data structures.
- Problem-solving and debugging skills.

Preferred:
- Experience with Azure or cloud services.
- Open source contributions.
- Full-stack development experience.`,
  },
  {
    company: 'Microsoft',
    role: 'Data Scientist',
    description: `Responsibilities:
- Build ML models and analytics solutions.
- Work with large datasets and experiment at scale.
- Communicate insights to business stakeholders.
- Deploy models to production.

Requirements:
- PhD or Master's in Statistics, CS, or related.
- Experience with Python, R, or SQL.
- Knowledge of ML frameworks (TensorFlow, PyTorch).
- Strong statistical and analytical skills.

Preferred:
- Experience with Azure ML or cloud ML platforms.
- Publication record.
- A/B testing and causal inference.`,
  },
  {
    company: 'Meta',
    role: 'Frontend Engineer',
    description: `Responsibilities:
- Build responsive, performant web applications.
- Implement UI with React or similar frameworks.
- Collaborate with design and backend teams.
- Optimize for accessibility and performance.

Requirements:
- Experience with JavaScript/TypeScript.
- Knowledge of React, HTML, CSS.
- Understanding of web performance and SEO.
- Strong attention to detail.

Preferred:
- Experience with GraphQL.
- Mobile web or React Native.
- Design systems.`,
  },
  {
    company: 'Meta',
    role: 'Backend Engineer',
    description: `Responsibilities:
- Design and build scalable backend systems.
- Write efficient, reliable server-side code.
- Work with databases and caching layers.
- Ensure system reliability and monitoring.

Requirements:
- Proficiency in one or more of: Python, Java, C++, Go, PHP.
- Experience with databases (SQL/NoSQL).
- Understanding of distributed systems.
- Strong debugging skills.

Preferred:
- Experience with large-scale systems.
- Knowledge of ML infrastructure.
- Open source contributions.`,
  },
  {
    company: 'Startup (Series A)',
    role: 'Full Stack Engineer',
    description: `Responsibilities:
- Build end-to-end features (frontend + backend).
- Move fast in an agile environment.
- Own features from idea to production.
- Work closely with founders and product.

Requirements:
- 2+ years full-stack experience.
- Proficiency in JavaScript/TypeScript and Node.js or Python.
- Experience with React or Vue.
- Database and API design skills.

Preferred:
- Startup experience.
- DevOps or cloud (AWS, GCP).
- Ability to wear multiple hats.`,
  },
  {
    company: 'Startup (Series A)',
    role: 'Product Designer',
    description: `Responsibilities:
- Create user flows, wireframes, and high-fidelity designs.
- Conduct user research and usability testing.
- Collaborate with engineering on implementation.
- Maintain design system and consistency.

Requirements:
- Portfolio demonstrating end-to-end product design.
- Proficiency in Figma, Sketch, or similar.
- Understanding of UX principles and accessibility.
- Strong communication skills.

Preferred:
- Experience in B2B or SaaS.
- Basic HTML/CSS or prototyping skills.
- Data-driven design.`,
  },
];

export function getJobDescription(company: string, role: string): string | null {
  const found = jobDescriptions.find(
    (j) =>
      j.company.toLowerCase() === company.toLowerCase() &&
      j.role.toLowerCase() === role.toLowerCase()
  );
  return found ? found.description : null;
}

export function getCompanies(): string[] {
  return Array.from(new Set(jobDescriptions.map((j) => j.company)));
}

export function getRolesByCompany(company: string): string[] {
  return Array.from(
    new Set(
      jobDescriptions.filter((j) => j.company === company).map((j) => j.role)
    )
  );
}
