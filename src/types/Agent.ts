
export type AgentType = 'kyc' | 'data-analysis' | 'research' | 'data-cleaning' | 'fraud-detection';

export interface Agent {
  id: AgentType;
  name: string;
  description: string;
  icon: string;
  path: string;
  bgColor: string;
}

export const agents: Agent[] = [
  {
    id: 'kyc',
    name: 'KYC Agent',
    description: 'Verify customer identities, process documents, and manage client onboarding',
    icon: 'FileCheck',
    path: '/kyc',
    bgColor: 'bg-banking-primary'
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    description: 'Analyze financial data, generate insights, and create visualizations',
    icon: 'BarChart2',
    path: '/data-analysis',
    bgColor: 'bg-indigo-600'
  },
  {
    id: 'research',
    name: 'Research Analysis',
    description: 'Conduct financial research, analyze market trends, and generate reports',
    icon: 'Search',
    path: '/research',
    bgColor: 'bg-emerald-600'
  },
  {
    id: 'data-cleaning',
    name: 'Data Cleaning',
    description: 'Process, normalize, and transform data for better analysis and insights',
    icon: 'FileCog',
    path: '/data-cleaning',
    bgColor: 'bg-amber-600'
  },
  {
    id: 'fraud-detection',
    name: 'Fraud Detection',
    description: 'Identify suspicious patterns and potential fraud in financial transactions',
    icon: 'AlertTriangle',
    path: '/fraud-detection',
    bgColor: 'bg-rose-600'
  }
];
