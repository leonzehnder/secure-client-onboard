
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockClients } from '../data/mockData';
import { Client } from '../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import {
  User,
  MapPin,
  FileText,
  Phone,
  Mail,
  Calendar,
  Flag,
  Clock,
  AlertTriangle,
  CheckCircle,
  Shield,
  Edit,
  Save,
  Trash2,
  ChevronLeft
} from 'lucide-react';

const ClientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const foundClient = mockClients.find(c => c.id === id);
      setClient(foundClient || null);
      setLoading(false);
      
      if (!foundClient) {
        toast.error("Client not found");
        navigate('/clients');
      }
    }, 500);
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-banking-primary border-t-transparent"></div>
          <p className="text-banking-primary text-sm font-medium">Loading client data...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertTriangle className="h-12 w-12 text-banking-warning" />
        <h2 className="text-2xl font-semibold">Client Not Found</h2>
        <p className="text-muted-foreground">The client you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/clients')}>Back to Client Search</Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="kyc-status-pending ml-2">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      case 'complete':
        return (
          <Badge variant="outline" className="kyc-status-complete ml-2">
            <CheckCircle className="h-3 w-3 mr-1" /> Complete
          </Badge>
        );
      case 'flagged':
        return (
          <Badge variant="outline" className="kyc-status-flagged ml-2">
            <AlertTriangle className="h-3 w-3 mr-1" /> Flagged
          </Badge>
        );
      default:
        return null;
    }
  };

  const getComplianceStatusBadge = (status: string) => {
    switch (status) {
      case 'cleared':
        return <Badge className="bg-banking-success">Cleared</Badge>;
      case 'flagged':
        return <Badge className="bg-banking-danger">Flagged</Badge>;
      case 'pending':
        return <Badge className="bg-banking-warning">Pending</Badge>;
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

  const handleEdit = () => {
    toast.info("Edit functionality would be implemented in a real app");
  };

  const handleUploadDocument = () => {
    navigate(`/documents/${client.id}`);
  };

  const handleReviewCompliance = () => {
    navigate(`/compliance/${client.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" className="mr-2" onClick={() => navigate('/clients')}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          {client.firstName} {client.lastName}
          {getStatusBadge(client.status)}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Client Overview</CardTitle>
              <CardDescription>Basic information and profile</CardDescription>
            </div>
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Personal Information</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Full Name</p>
                    <p>{client.firstName} {client.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Client ID</p>
                    <p>{client.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date of Birth</p>
                    <p>{client.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Nationality</p>
                    <p>{client.nationality}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Address</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Street</p>
                    <p>{client.address.street}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">City</p>
                    <p>{client.address.city}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">State/Region</p>
                    <p>{client.address.state || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Postal Code</p>
                    <p>{client.address.postalCode}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Country</p>
                    <p>{client.address.country}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Contact</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p>{client.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p>{client.phone}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Account Information</span>
                  </div>
                  <div className="mt-2 space-y-2">
                    <div>
                      <p className="text-sm font-medium">Created On</p>
                      <p>{new Date(client.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="documents" className="col-span-3">
          <TabsList>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Verification Documents</CardTitle>
                  <CardDescription>
                    Client has {client.documents.length} document(s) uploaded
                  </CardDescription>
                </div>
                <Button onClick={handleUploadDocument}>
                  <FileText className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </CardHeader>
              <CardContent>
                {client.documents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {client.documents.map(document => (
                      <div 
                        key={document.id} 
                        className={`document-card ${document.verificationIssues && document.verificationIssues.length > 0 ? 'has-error' : ''}`}
                      >
                        <div className="aspect-video relative overflow-hidden bg-muted">
                          <img 
                            src={document.fileUrl} 
                            alt={`Thumbnail for ${document.fileName}`}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            {document.status === 'verified' && (
                              <Badge className="bg-banking-success">Verified</Badge>
                            )}
                            {document.status === 'pending' && (
                              <Badge className="bg-banking-warning">Pending</Badge>
                            )}
                            {document.status === 'rejected' && (
                              <Badge className="bg-banking-danger">Rejected</Badge>
                            )}
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium capitalize">{document.type.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())}</h4>
                          <p className="text-sm text-muted-foreground truncate">{document.fileName}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-muted-foreground">
                              Uploaded: {new Date(document.uploadedAt).toLocaleDateString()}
                            </p>
                            {document.expiryDate && (
                              <p className="text-xs text-muted-foreground">
                                Expires: {new Date(document.expiryDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          
                          {document.verificationIssues && document.verificationIssues.length > 0 && (
                            <div className="mt-3 border-t pt-3">
                              <p className="text-sm font-medium text-banking-danger flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Issues Found
                              </p>
                              <ul className="mt-2 space-y-1">
                                {document.verificationIssues.map((issue, idx) => (
                                  <li key={idx} className="text-xs text-banking-danger">
                                    {issue.field}: Expected "{issue.expected}" but found "{issue.found}"
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">No documents uploaded yet</p>
                    <Button onClick={handleUploadDocument} className="mt-4">Upload Document</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="compliance">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Compliance Checks</CardTitle>
                  <CardDescription>
                    Risk assessment and regulatory verification
                  </CardDescription>
                </div>
                <Button onClick={handleReviewCompliance}>
                  <Shield className="h-4 w-4 mr-2" />
                  Review Compliance
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">PEP Check</h3>
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      {getComplianceStatusBadge(client.compliance.pepStatus)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Politically Exposed Person screening checks if the client holds a prominent public position.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Adverse Media</h3>
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      {getComplianceStatusBadge(client.compliance.adverseMediaStatus)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Checks for negative news or information about the client in media sources.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Sanctions</h3>
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      {getComplianceStatusBadge(client.compliance.sanctionsStatus)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Verifies if the client appears on any international sanctions or watchlists.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Overall Risk Rating</h3>
                    {getRiskRatingBadge(client.compliance.riskRating)}
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium text-sm">Compliance Notes</h4>
                    <p className="p-3 bg-muted rounded-md mt-2 text-sm">
                      {client.compliance.notes || "No compliance notes available."}
                    </p>
                  </div>
                  
                  <div className="mt-4 text-sm text-muted-foreground">
                    Last checked: {new Date(client.compliance.lastCheckedAt).toLocaleString()}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleReviewCompliance}>
                  Re-Run Checks
                </Button>
                <Button variant="outline" onClick={handleEdit}>
                  Add Notes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDetails;
