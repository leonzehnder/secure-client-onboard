
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockDashboardStats, mockClients, mockActivityLogs } from '../data/mockData';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { User, Clock, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  // Filter clients by status
  const pendingClients = mockClients.filter(client => client.status === 'pending');
  const flaggedClients = mockClients.filter(client => client.status === 'flagged');
  
  // Filter clients with invalid documents
  const clientsWithInvalidDocs = mockClients.filter(client => 
    client.documents.some(doc => 
      doc.verificationIssues && doc.verificationIssues.length > 0
    )
  );

  // Combine pending and clients with issues, removing duplicates
  const clientsNeedingAttention = [...new Map(
    [...pendingClients, ...flaggedClients, ...clientsWithInvalidDocs].map(client => [client.id, client])
  ).values()];

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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-banking-warning/20 text-banking-warning';
      case 'complete':
        return 'bg-banking-success/20 text-banking-success';
      case 'flagged':
        return 'bg-banking-danger/20 text-banking-danger';
      default:
        return '';
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
    navigate(`/agents/dashboard/clients/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div>
          <Button onClick={() => navigate('/agents/dashboard/clients/add')}>
            Add New Client
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attention" className="relative">
            Needs Attention
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-banking-warning text-xs text-white">
              {clientsNeedingAttention.length}
            </span>
          </TabsTrigger>
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
          
          <div className="grid gap-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Clients Needing Attention</CardTitle>
                <CardDescription>
                  Pending clients and those with document issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                {clientsNeedingAttention.length > 0 ? (
                  <div className="space-y-4">
                    {clientsNeedingAttention.slice(0, 5).map((client) => (
                      <div 
                        key={client.id} 
                        className="flex items-center justify-between p-4 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleClientClick(client.id)}
                      >
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
                            <Badge variant="outline" className={getStatusBadgeClass(client.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(client.status)}
                                <span className="ml-1 capitalize">{client.status}</span>
                              </div>
                            </Badge>
                          </div>
                          {client.documents.some(doc => doc.verificationIssues && doc.verificationIssues.length > 0) && (
                            <div className="flex items-center">
                              <Badge variant="outline" className="bg-banking-danger/20 text-banking-danger">
                                Document Issues
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {clientsNeedingAttention.length > 5 && (
                      <div className="flex justify-center mt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveTab('attention')}
                        >
                          View All ({clientsNeedingAttention.length})
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <CheckCircle className="h-12 w-12 mx-auto text-banking-success" />
                    <p className="mt-4 text-muted-foreground">All clients are in good standing</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions across the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.slice(0, 3).map((activity) => (
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
          </div>
        </TabsContent>
        
        <TabsContent value="attention" className="animate-fade-in">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Clients Needing Attention</CardTitle>
                  <CardDescription>Clients with pending status or document issues</CardDescription>
                </div>
                <Button onClick={() => navigate('/agents/dashboard/clients')}>
                  View All Clients
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {clientsNeedingAttention.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {pendingClients.length > 0 && (
                      <>
                        <h3 className="text-lg font-semibold flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-banking-warning" />
                          Pending Clients 
                          <Badge variant="outline" className="ml-2">{pendingClients.length}</Badge>
                        </h3>
                        
                        <div className="space-y-3">
                          {pendingClients.map(client => (
                            <div 
                              key={client.id} 
                              className="p-4 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => handleClientClick(client.id)}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                  <div className="rounded-full bg-banking-primary p-2">
                                    <User className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{client.firstName} {client.lastName}</h4>
                                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                                      <span>{client.email}</span>
                                      <span>•</span>
                                      <span>ID: {client.id}</span>
                                    </div>
                                  </div>
                                </div>
                                <Badge variant="outline" className="bg-banking-warning/20 text-banking-warning">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pending
                                </Badge>
                              </div>
                              
                              <div className="mt-3 flex flex-wrap gap-2">
                                <div className="text-xs bg-muted px-2 py-1 rounded flex items-center">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {client.documents.length} document(s)
                                </div>
                                <div className="text-xs bg-muted px-2 py-1 rounded">
                                  Created: {new Date(client.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    
                    <Separator className="my-4" />
                    
                    {flaggedClients.length > 0 && (
                      <>
                        <h3 className="text-lg font-semibold flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2 text-banking-danger" />
                          Flagged Clients
                          <Badge variant="outline" className="ml-2">{flaggedClients.length}</Badge>
                        </h3>
                        
                        <div className="space-y-3">
                          {flaggedClients.map(client => (
                            <div 
                              key={client.id} 
                              className="p-4 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => handleClientClick(client.id)}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                  <div className="rounded-full bg-banking-primary p-2">
                                    <User className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{client.firstName} {client.lastName}</h4>
                                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                                      <span>{client.email}</span>
                                      <span>•</span>
                                      <span>ID: {client.id}</span>
                                    </div>
                                  </div>
                                </div>
                                <Badge variant="outline" className="bg-banking-danger/20 text-banking-danger">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Flagged
                                </Badge>
                              </div>
                              
                              <div className="mt-3 flex flex-wrap gap-2">
                                <div className="text-xs bg-muted px-2 py-1 rounded flex items-center">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {client.documents.length} document(s)
                                </div>
                                <div className="text-xs bg-muted px-2 py-1 rounded">
                                  Created: {new Date(client.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    
                    <Separator className="my-4" />
                    
                    {clientsWithInvalidDocs.length > 0 && (
                      <>
                        <h3 className="text-lg font-semibold flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-banking-danger" />
                          Document Issues
                          <Badge variant="outline" className="ml-2">{clientsWithInvalidDocs.length}</Badge>
                        </h3>
                        
                        <div className="space-y-3">
                          {clientsWithInvalidDocs.map(client => {
                            const docsWithIssues = client.documents.filter(
                              doc => doc.verificationIssues && doc.verificationIssues.length > 0
                            );
                            
                            return (
                              <div 
                                key={client.id} 
                                className="p-4 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => handleClientClick(client.id)}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center space-x-4">
                                    <div className="rounded-full bg-banking-primary p-2">
                                      <User className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium">{client.firstName} {client.lastName}</h4>
                                      <div className="flex items-center text-sm text-muted-foreground gap-2">
                                        <span>{client.email}</span>
                                        <span>•</span>
                                        <span>ID: {client.id}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="bg-banking-danger/20 text-banking-danger">
                                    <FileText className="h-3 w-3 mr-1" />
                                    {docsWithIssues.length} Invalid Documents
                                  </Badge>
                                </div>
                                
                                <div className="mt-3 border-t pt-3">
                                  <p className="text-sm font-medium mb-2">Invalid Documents:</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {docsWithIssues.map(doc => (
                                      <div key={doc.id} className="text-xs bg-muted/70 p-2 rounded">
                                        <span className="font-medium">{doc.type}</span>: 
                                        {doc.verificationIssues?.length} issues
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto text-banking-success" />
                  <p className="mt-4 text-muted-foreground">All clients are in good standing</p>
                </div>
              )}
            </CardContent>
          </Card>
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
