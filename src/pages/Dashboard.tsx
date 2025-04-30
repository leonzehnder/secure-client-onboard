
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockDashboardStats, mockClients, mockActivityLogs } from '../data/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { FileText, User, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const statusData = [
    { name: 'Pending', value: mockDashboardStats.pendingClients, color: '#FFB347' },
    { name: 'Completed', value: mockDashboardStats.completedClients, color: '#4CAF50' },
    { name: 'Flagged', value: mockDashboardStats.flaggedClients, color: '#FF6B6B' },
  ];

  const documentTypeData = mockClients.flatMap(client => client.documents).reduce((acc, doc) => {
    const type = doc.type;
    const existing = acc.find(item => item.name === type);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: type, count: 1 });
    }
    return acc;
  }, [] as { name: string; count: number }[]);

  const recentClients = [...mockClients].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  const recentActivities = [...mockActivityLogs].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-banking-warning" />;
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-banking-success" />;
      case 'flagged':
        return <AlertTriangle className="h-5 w-5 text-banking-danger" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const formatActivityTime = (timestamp: string) => {
    try {
      return format(parseISO(timestamp), 'MMM d, h:mm a');
    } catch (e) {
      return timestamp;
    }
  };

  const handleClientClick = (id: string) => {
    navigate(`/clients/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div>
          <Button onClick={() => navigate('/clients')}>
            Search Clients
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clients">Recent Clients</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="animate-fade-in">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockDashboardStats.totalClients}</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockDashboardStats.pendingClients}</div>
                <p className="text-xs text-muted-foreground">
                  {mockDashboardStats.documentsToReview} documents to verify
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockDashboardStats.completedClients}</div>
                <p className="text-xs text-muted-foreground">
                  Average completion: {mockDashboardStats.averageCompletionTime}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Flagged Issues</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockDashboardStats.flaggedClients}</div>
                <p className="text-xs text-muted-foreground">
                  Requires immediate attention
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Client Status Distribution</CardTitle>
                <CardDescription>
                  Overview of client onboarding status
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={statusData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Clients">
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Document Types</CardTitle>
                <CardDescription>
                  Breakdown of document categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={documentTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {documentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 60%)`} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="clients" className="animate-fade-in">
          <div className="space-y-4">
            {recentClients.map((client) => (
              <Card key={client.id} className="cursor-pointer hover:bg-muted/50 transition-colors" 
                onClick={() => handleClientClick(client.id)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-banking-primary p-2">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">{client.firstName} {client.lastName}</h3>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {client.documents.length} docs
                        </span>
                      </div>
                      <div className={`rounded-full px-2.5 py-0.5 text-xs kyc-status-${client.status}`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(client.status)}
                          <span className="capitalize">{client.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={() => navigate('/clients')}>
                View All Clients
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions across the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                    <div className="rounded-full bg-muted p-2">
                      {activity.entityType === 'client' && <User className="h-4 w-4" />}
                      {activity.entityType === 'document' && <FileText className="h-4 w-4" />}
                      {activity.entityType === 'compliance' && <AlertTriangle className="h-4 w-4" />}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {activity.userName} {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatActivityTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
