import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockClients } from '../data/mockData';
import { Client, ComplianceStatus } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Progress } from '@/components/ui/progress';
import {
  ChevronLeft, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  User,
  RefreshCw,
  Save,
  FileText
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Compliance = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [pepStatus, setPepStatus] = useState<ComplianceStatus>('pending');
  const [adverseMediaStatus, setAdverseMediaStatus] = useState<ComplianceStatus>('pending');
  const [sanctionsStatus, setSanctionsStatus] = useState<ComplianceStatus>('pending');
  const [riskRating, setRiskRating] = useState<'low' | 'medium' | 'high'>('medium');
  const [notes, setNotes] = useState('');
  const [progress, setProgress] = useState(0);
  const [selectedClientId, setSelectedClientId] = useState<string>('default');

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      if (clientId === 'all') {
        setClient(null);
        setLoading(false);
      } else {
        const foundClient = mockClients.find(c => c.id === clientId);
        if (foundClient) {
          setClient(foundClient);
          setPepStatus(foundClient.compliance.pepStatus);
          setAdverseMediaStatus(foundClient.compliance.adverseMediaStatus);
          setSanctionsStatus(foundClient.compliance.sanctionsStatus);
          setRiskRating(foundClient.compliance.riskRating);
          setNotes(foundClient.compliance.notes || '');
        } else {
          setClient(null);
        }
        setLoading(false);
        
        if (!foundClient && clientId !== 'all') {
          toast.error("Client not found");
          navigate('/agents/dashboard/clients');
        }
      }
    }, 500);
  }, [clientId, navigate]);

  const handleRunCheck = () => {
    setChecking(true);
    setProgress(0);
    
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setChecking(false);
          toast.success("Compliance check completed");
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    
    // Simulate API calls to compliance services
    setTimeout(() => {
      clearInterval(timer);
      setProgress(100);
      setChecking(false);
      
      // Randomly change some statuses for demo purposes
      const statuses: ComplianceStatus[] = ['cleared', 'flagged', 'pending'];
      const randomPepStatus = statuses[Math.floor(Math.random() * 3)];
      const randomAdverseMediaStatus = statuses[Math.floor(Math.random() * 3)];
      const randomSanctionsStatus = statuses[Math.floor(Math.random() * 3)];
      
      setPepStatus(randomPepStatus);
      setAdverseMediaStatus(randomAdverseMediaStatus);
      setSanctionsStatus(randomSanctionsStatus);
      
      // Set risk rating based on statuses
      if (randomPepStatus === 'flagged' || randomAdverseMediaStatus === 'flagged' || randomSanctionsStatus === 'flagged') {
        setRiskRating('high');
      } else if (randomPepStatus === 'pending' || randomAdverseMediaStatus === 'pending' || randomSanctionsStatus === 'pending') {
        setRiskRating('medium');
      } else {
        setRiskRating('low');
      }
      
      toast.success("Compliance check completed");
    }, 3000);
  };

  const handleSave = () => {
    toast.success("Compliance data saved");
    
    if (client) {
      navigate(`/agents/dashboard/clients/${client.id}`);
    } else {
      // Clear form
      setPepStatus('pending');
      setAdverseMediaStatus('pending');
      setSanctionsStatus('pending');
      setRiskRating('medium');
      setNotes('');
    }
  };

  const getStatusBadge = (status: ComplianceStatus) => {
    switch (status) {
      case 'cleared':
        return (
          <Badge className="bg-banking-success">
            <CheckCircle className="h-3 w-3 mr-1" /> Cleared
          </Badge>
        );
      case 'flagged':
        return (
          <Badge className="bg-banking-danger">
            <AlertTriangle className="h-3 w-3 mr-1" /> Flagged
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-banking-warning">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  const getRiskRatingBadge = (rating: string) => {
    switch (rating) {
      case 'low':
        return <Badge className="bg-banking-success">Low Risk</Badge>;
      case 'medium':
        return <Badge className="bg-banking-warning">Medium Risk</Badge>;
      case 'high':
        return <Badge className="bg-banking-danger">High Risk</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          className="mr-2" 
          onClick={() => client ? navigate(`/agents/dashboard/clients/${client.id}`) : navigate('/agents/dashboard/clients')}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          Compliance Check
          {client && ` for ${client.firstName} ${client.lastName}`}
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AML & KYC Compliance</CardTitle>
          <CardDescription>
            Run compliance checks and review risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {client ? (
            <div className="flex items-center p-3 bg-muted rounded-md mb-6">
              <div className="h-10 w-10 rounded-full bg-banking-primary flex items-center justify-center text-white font-semibold">
                {client.firstName[0]}{client.lastName[0]}
              </div>
              <div className="ml-3">
                <p className="font-medium">{client.firstName} {client.lastName}</p>
                <p className="text-sm text-muted-foreground">{client.id}</p>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <Label>Client</Label>
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default" disabled>Select a client</SelectItem>
                  {mockClients.map(client => (
                    <SelectItem 
                      key={client.id} 
                      value={client.id}
                    >
                      {client.firstName} {client.lastName} ({client.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {checking && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="space-y-2 text-center">
                  <Shield className="h-8 w-8 mx-auto text-banking-primary animate-pulse" />
                  <h3 className="font-medium">Running Compliance Checks...</h3>
                  <Progress value={progress} className="w-full h-2" />
                  <p className="text-sm text-muted-foreground">
                    Checking PEP status, adverse media, and sanctions lists
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Tabs defaultValue="checks">
            <TabsList>
              <TabsTrigger value="checks">Compliance Checks</TabsTrigger>
              <TabsTrigger value="documents">Document Verification</TabsTrigger>
            </TabsList>
            
            <TabsContent value="checks" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Card className="overflow-hidden">
                  <CardHeader className="bg-muted/50 py-3">
                    <CardTitle className="text-base">PEP Check</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Status</span>
                        <div>
                          <Select value={pepStatus} onValueChange={(v) => setPepStatus(v as ComplianceStatus)}>
                            <SelectTrigger className="w-36">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cleared">Cleared</SelectItem>
                              <SelectItem value="flagged">Flagged</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Current status:</p>
                        {getStatusBadge(pepStatus)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Politically Exposed Person screening determines if the client holds a prominent political position.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <CardHeader className="bg-muted/50 py-3">
                    <CardTitle className="text-base">Adverse Media</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Status</span>
                        <div>
                          <Select value={adverseMediaStatus} onValueChange={(v) => setAdverseMediaStatus(v as ComplianceStatus)}>
                            <SelectTrigger className="w-36">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cleared">Cleared</SelectItem>
                              <SelectItem value="flagged">Flagged</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Current status:</p>
                        {getStatusBadge(adverseMediaStatus)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Checks for negative news or information about the client in media sources.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <CardHeader className="bg-muted/50 py-3">
                    <CardTitle className="text-base">Sanctions</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Status</span>
                        <div>
                          <Select value={sanctionsStatus} onValueChange={(v) => setSanctionsStatus(v as ComplianceStatus)}>
                            <SelectTrigger className="w-36">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cleared">Cleared</SelectItem>
                              <SelectItem value="flagged">Flagged</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Current status:</p>
                        {getStatusBadge(sanctionsStatus)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Verifies if the client appears on any international sanctions or watchlists.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Overall Risk Rating</h3>
                  <Select value={riskRating} onValueChange={(v) => setRiskRating(v as 'low' | 'medium' | 'high')}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Risk Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Current rating:</p>
                  {getRiskRatingBadge(riskRating)}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Compliance Notes</Label>
                  <Textarea 
                    id="notes" 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter any notes or findings from the compliance check..." 
                    className="min-h-32"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-6 animate-fade-in">
              <div className="bg-muted/50 p-6 rounded-lg text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="font-medium mt-4">Document Verification</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Verify document authenticity and check for discrepancies across different document types.
                </p>
                <Button className="mt-4" disabled={!client} onClick={() => client && navigate(`/agents/dashboard/documents/${client.id}`)}>
                  View Client Documents
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="document-notes">Document Verification Notes</Label>
                <Textarea 
                  id="document-notes" 
                  placeholder="Enter any notes about document verification..." 
                  className="min-h-24"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleRunCheck}
            disabled={checking}
          >
            {checking ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Running Checks...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Run Compliance Check
              </>
            )}
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Compliance;
