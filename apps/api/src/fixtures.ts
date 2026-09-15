import type { Opportunity, OpportunitySummary } from '@oppora/contracts';

/**
 * In-memory sample data conforming to the public opportunities API contract.
 * Stands in for the persistence-backed implementation until a live database
 * is provisioned; keeps the mobile app integration real end-to-end.
 */
export const OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-001',
    title: 'Chevening Scholarship',
    organization: 'UK Foreign, Commonwealth & Development Office',
    category: 'scholarship',
    countries: ['GB'],
    fundingType: 'fully-funded',
    deadline: '2026-11-02T23:59:00.000Z',
    status: 'ACTIVE',
    source: {
      id: 'src-chevening',
      name: 'Chevening',
      website: 'https://www.chevening.org',
      lastVerified: '2025-09-01T00:00:00.000Z',
      officialApplication: true,
    },
    sourceUrl: 'https://www.chevening.org/scholarships/',
    officialApplicationUrl: 'https://www.chevening.org/apply/',
    description: 'Fully-funded UK master\u2019s scholarships for future global leaders.',
    benefits: ['Tuition fees', 'Monthly stipend', 'Travel costs'],
    eligibility: ['Undergraduate degree', 'Minimum 2 years of work experience'],
    requirements: ['Personal statement', 'Two references'],
    applicationProcess: ['Online application', 'Interview'],
    verified: true,
    verificationDate: '2025-09-01T00:00:00.000Z',
  },
  {
    id: 'opp-002',
    title: 'DAAD Study Scholarship',
    organization: 'German Academic Exchange Service',
    category: 'scholarship',
    countries: ['DE'],
    fundingType: 'fully-funded',
    deadline: '2026-08-15T23:59:00.000Z',
    status: 'ACTIVE',
    source: {
      id: 'src-daad',
      name: 'DAAD',
      website: 'https://www.daad.de',
      lastVerified: '2025-08-20T00:00:00.000Z',
      officialApplication: true,
    },
    sourceUrl: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/',
    officialApplicationUrl: 'https://www.daad.de/en/apply/',
    description: 'Funding for international students pursuing graduate studies in Germany.',
    benefits: ['Monthly payments', 'Health insurance', 'Travel subsidy'],
    eligibility: ['Bachelor\u2019s degree completed within the last 6 years'],
    requirements: ['Motivation letter', 'Academic transcripts'],
    applicationProcess: ['Online portal submission', 'Document review'],
    verified: true,
    verificationDate: '2025-08-20T00:00:00.000Z',
  },
  {
    id: 'opp-003',
    title: 'Remote Software Engineering Internship',
    organization: 'Open Source Collective',
    category: 'internship',
    countries: [],
    fundingType: 'paid',
    deadline: '2026-03-01T23:59:00.000Z',
    status: 'DISCOVERED',
    source: {
      id: 'src-osc',
      name: 'Open Source Collective',
      website: 'https://opencollective.com',
      lastVerified: null,
      officialApplication: false,
    },
    sourceUrl: 'https://opencollective.com/internships',
    officialApplicationUrl: null,
    description: 'Remote-friendly internship contributing to open-source infrastructure projects.',
    benefits: ['Stipend', 'Mentorship'],
    eligibility: ['Currently enrolled student'],
    requirements: ['GitHub profile', 'Cover letter'],
    applicationProcess: ['Async application review'],
    verified: false,
    verificationDate: null,
  },
];

export function toSummary(opportunity: Opportunity): OpportunitySummary {
  const {
    id,
    title,
    organization,
    category,
    countries,
    fundingType,
    deadline,
    status,
    source,
  } = opportunity;
  return { id, title, organization, category, countries, fundingType, deadline, status, source };
}
