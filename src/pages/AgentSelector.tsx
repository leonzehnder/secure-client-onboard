
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileCheck, BarChart2, Search, FileCog, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { agents } from '@/types/Agent';

interface AgentCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  bgColor: string;
}

const AgentCard = ({ title, description, icon, path, bgColor }: AgentCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md overflow-hidden"
      onClick={() => navigate(path)}
    >
      <div className={`p-6 flex flex-col h-full`}>
        <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-4 ${bgColor} text-white`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        <Button 
          variant="outline" 
          className="mt-auto w-full"
          onClick={(e) => {
            e.stopPropagation();
            navigate(path);
          }}
        >
          Select Agent
        </Button>
      </div>
    </Card>
  );
};

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'FileCheck':
      return <FileCheck size={24} />;
    case 'BarChart2':
      return <BarChart2 size={24} />;
    case 'Search':
      return <Search size={24} />;
    case 'FileCog':
      return <FileCog size={24} />;
    case 'AlertTriangle':
      return <AlertTriangle size={24} />;
    default:
      return <FileCheck size={24} />;
  }
};

const AgentSelector = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">AI Agents</h1>
      <p className="text-muted-foreground mb-8">Select an AI agent to help with your specific tasks</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <AgentCard 
            key={agent.id}
            title={agent.name}
            description={agent.description}
            icon={getIconComponent(agent.icon)}
            path={`/chat/${agent.id}`}
            bgColor={agent.bgColor}
          />
        ))}
      </div>
    </div>
  );
};

export default AgentSelector;
