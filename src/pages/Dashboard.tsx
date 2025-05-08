
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockDashboardStats, mockClients, mockActivityLogs } from '../data/mockData';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { User, Clock, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const statusData = [
    { name: 'Pending', value: mockDashboardStats.pendingClients, color: '#FFB347' },
    { name: 'Completed', value: mockDashboardStats.completedClients, color: '#4CAF50' },
    { name: 'Flagged', value: mockDashboardStats.flaggedClients, color: '#FF6B6B' },
  ];

  const statusConfig = {
    pending: { label: "Pending", color: "#FFB347" },
    completed: { label: "Completed", color: "#4CAF50" },
    flagged: { label: "Flagged", color: "#FF6B6B" }
  };

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

  const documentConfig = {
    passport: { label: "Passport", color: "#4361EE" },
    idCard: { label: "ID Card", color: "#3A86FF" },
    utilityBill: { label: "Utility Bill", color: "#4EA8DE" },
    bankStatement: { label: "Bank Statement", color: "#56CFE1" }
  };

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
              <CardContent className="pt-2">
                <ChartContainer
                  config={statusConfig}
                  className="aspect-[4/2]"
                >
                  <BarChart
                    data={statusData}
                    margin={{
                      top: 15,
                      right: 10,
                      left: 10,
                      bottom: 20,
                    }}
                  >
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Bar
                      dataKey="value"
                      radius={[4, 4, 0, 0]}
                      className="fill-primary"
                    >
                      {statusData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          className="cursor-pointer hover:opacity-80"
                        />
                      ))}
                    </Bar>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload) return null;
                        return (
                          <div className="rounded-md border border-slate-100 bg-white p-2 shadow-md">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center gap-1 text-slate-500">
                                <div
                                  className="h-3 w-3 rounded"
                                  style={{
                                    background: payload[0].color,
                                  }}
                                />
                                <p className="font-medium">{payload[0].name}</p>
                              </div>
                              <p className="font-medium text-right">
                                {payload[0].value}
                              </p>
                            </div>
                          </div>
                        );
                      }}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Document Types</CardTitle>
                <CardDescription>
                  Breakdown of document categories
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ChartContainer
                  config={documentConfig}
                  className="aspect-[4/3]"
                >
                  <PieChart
                    margin={{
                      top: 0,
                      right: 0,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <Pie
                      data={documentTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      stroke="#fff"
                      strokeWidth={2}
                    >
                      {documentTypeData.map((entry, index) => {
                        const docType = entry.name as keyof typeof documentConfig;
                        return (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={documentConfig[docType]?.color || `hsl(${index * 45}, 70%, 60%)`}
                            className="cursor-pointer hover:opacity-80"
                          />
                        )
                      })}
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload) return null;
                        
                        const data = payload[0].payload;
                        const docType = data.name as keyof typeof documentConfig;
                        const color = documentConfig[docType]?.color || "#888";
                        
                        return (
                          <div className="rounded-md border border-slate-100 bg-white p-2 shadow-md">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center gap-1 text-slate-500">
                                <div
                                  className="h-3 w-3 rounded"
                                  style={{
                                    background: color,
                                  }}
                                />
                                <p className="font-medium">{data.name}</p>
                              </div>
                              <p className="font-medium text-right">{data.count}</p>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <ChartLegend 
                      verticalAlign="bottom" 
                      height={36} 
                      content={<ChartLegendContent nameKey="name" />}
                    />
                  </PieChart>
                </ChartContainer>
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
