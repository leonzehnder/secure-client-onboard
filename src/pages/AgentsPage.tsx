
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileSearch, 
  Microscope, 
  Hammer, 
  AlertTriangle 
} from 'lucide-react';

const agentCards = [
  {
    id: 'kyc',
    title: 'KYC Banking',
    description: 'Client onboarding & identity verification',
    icon: <ShieldCheck size={24} className="text-banking-primary" />,
    path: '/kyc',
    color: 'bg-banking-primary/10'
  },
  {
    id: 'data-analysis',
    title: 'Data Analysis',
    description: 'Analyze financial datasets and generate insights',
    icon: <FileSearch size={24} className="text-blue-600" />,
    path: '/data-analysis',
    color: 'bg-blue-600/10'
  },
  {
    id: 'research',
    title: 'Research Analysis',
    description: 'Research market trends and generate reports',
    icon: <Microscope size={24} className="text-purple-600" />,
    path: '/research',
    color: 'bg-purple-600/10'
  },
  {
    id: 'data-cleaning',
    title: 'Data Cleaning',
    description: 'Clean and transform financial datasets',
    icon: <Hammer size={24} className="text-green-600" />,
    path: '/data-cleaning',
    color: 'bg-green-600/10'
  },
  {
    id: 'fraud-detection',
    title: 'Fraud Detection',
    description: 'Identify potential fraudulent transactions',
    icon: <AlertTriangle size={24} className="text-red-600" />,
    path: '/fraud-detection',
    color: 'bg-red-600/10'
  }
];

const AgentsPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Available Agents</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agentCards.map((agent) => (
          <Link 
            to={agent.path} 
            key={agent.id}
            className="transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <Card className="h-full border-2 hover:border-banking-primary/50">
              <CardHeader className={`${agent.color} p-4`}>
                <div className="flex items-center justify-between">
                  {agent.icon}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2">{agent.title}</CardTitle>
                <CardDescription>{agent.description}</CardDescription>
              </CardContent>
              <CardFooter className="bg-gray-50 p-4">
                <p className="text-sm text-gray-600">Click to access agent</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AgentsPage;
