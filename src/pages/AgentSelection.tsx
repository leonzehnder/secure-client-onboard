import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  FileSearch,
  Microscope,
  DatabaseBackup,
  ShieldAlert,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';

interface AgentCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ icon, title, description, onClick }) => {
  return (
    <Card 
      className="p-6 hover:shadow-md transition-all cursor-pointer border border-black flex flex-col h-full"
      onClick={onClick}
    >
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 rounded-md bg-white flex items-center justify-center text-gray-700 mr-4">
          {icon}
        </div>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <p className="text-base text-gray-500 mb-4 flex-grow">{description}</p>
      <div className="flex items-center text-base text-primary mt-auto">
        <span>Select</span>
        <ArrowRight className="h-4 w-4 ml-2" />
      </div>
    </Card>
  );
};

const AgentSelection = () => {
  const navigate = useNavigate();
  
  const agents = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "KYC Agent",
      description: "Onboard new clients and verify their identity. Process KYC documents and manage client information.",
      path: "/agents/dashboard"
    },
    {
      icon: <FileSearch className="h-6 w-6" />,
      title: "Document Analysis Agent",
      description: "Extract and analyze information from documents. Process contracts, forms, and other text-based documents.",
      path: "/agents/document-analysis"
    },
    {
      icon: <Microscope className="h-6 w-6" />,
      title: "Deep Research Agent",
      description: "Conduct thorough research on specific topics. Gather insights and compile comprehensive reports.",
      path: "/agents/research"
    },
    {
      icon: <DatabaseBackup className="h-6 w-6" />,
      title: "Data Cleaning Agent",
      description: "Clean and normalize data for analysis. Identify and fix inconsistencies in your datasets.",
      path: "/agents/data-cleaning"
    },
    {
      icon: <ShieldAlert className="h-6 w-6" />,
      title: "Fraud Detection Agent",
      description: "Identify potential fraud patterns in transactions and activities. Protect your business with advanced detection.",
      path: "/agents/fraud-detection"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Stock Analysis Agent",
      description: "Analyze stock performance and trends. Get insights on market movements and investment opportunities.",
      path: "/agents/stock-analysis"
    }
  ];

  const handleAgentSelect = (path: string) => {
    navigate(path);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold mb-3">Select an Agent</h1>
          <p className="text-gray-500 text-lg">
            Choose an agent to help with your specific business tasks
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <AgentCard
              key={index}
              icon={agent.icon}
              title={agent.title}
              description={agent.description}
              onClick={() => handleAgentSelect(agent.path)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentSelection;