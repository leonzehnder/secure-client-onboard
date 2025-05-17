
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockClients } from '../data/mockData';
import { Client, Document, VerificationIssue, DocumentCorrection, DocumentCorrectionsFormValues, BatchDocumentCorrection } from '../types';
import { OnboardingStage, getOnboardingStageLabel, getOnboardingStageColor } from '../types/OnboardingStage';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
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
  ChevronLeft,
  X
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const ClientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingDocuments, setIsEditingDocuments] = useState(false);
  const [documentsWithIssues, setDocumentsWithIssues] = useState<Document[]>([]);
  const [batchCorrections, setBatchCorrections] = useState<BatchDocumentCorrection[]>([]);
  const [batchEditDialogOpen, setBatchEditDialogOpen] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const foundClient = mockClients.find(c => c.id === id);
      
      if (foundClient) {
        // Add onboarding stage if not present (for demo/mockup only)
        if (!foundClient.onboardingStage) {
          foundClient.onboardingStage = determineOnboardingStage(foundClient);
        }
        
        setClient(foundClient);
        
        // Filter documents with verification issues
        const docsWithIssues = foundClient.documents.filter(
          doc => doc.verificationIssues && doc.verificationIssues.length > 0
        );
        setDocumentsWithIssues(docsWithIssues);
        
        // Initialize batch correction data
        initializeBatchCorrections(docsWithIssues);
      } else {
        toast.error("Client not found");
        navigate('/clients');
      }
      
      setLoading(false);
    }, 500);
  }, [id, navigate]);

  // Helper function to determine onboarding stage
  const determineOnboardingStage = (client: Client): OnboardingStage => {
    if (client.status === 'complete') return 'approved';
    if (client.status === 'flagged') return 'compliance_check';
    
    // Check if any documents are rejected
    const hasRejectedDocuments = client.documents.some(doc => doc.status === 'rejected');
    if (hasRejectedDocuments) return 'verification';
    
    // Check if there are missing documents
    if (client.documents.length === 0) return 'application';
    
    // Check if all documents are verified
    const allDocumentsVerified = client.documents.every(doc => doc.status === 'verified');
    if (allDocumentsVerified) return 'compliance_check';
    
    return 'documents_pending';
  };

  // Initialize the form for document corrections with proper typing
  const form = useForm<DocumentCorrectionsFormValues>({
    defaultValues: {
      documentCorrections: []
    }
  });

  // Setup form when documents with issues are loaded
  useEffect(() => {
    if (documentsWithIssues.length > 0) {
      // Create initial corrections structure from issues
      const initialCorrections = documentsWithIssues.map(doc => {
        const corrections: { [field: string]: string } = {};
        
        if (doc.verificationIssues) {
          doc.verificationIssues.forEach(issue => {
            // Use the found value as the initial value for the correction
            corrections[issue.field] = issue.found;
          });
        }
        
        return {
          documentId: doc.id,
          corrections
        };
      });
      
      form.reset({ documentCorrections: initialCorrections });
    }
  }, [documentsWithIssues, form]);

  // Initialize batch corrections data
  const initializeBatchCorrections = (documents: Document[]) => {
    const batchData: BatchDocumentCorrection[] = [];
    
    documents.forEach(doc => {
      if (doc.verificationIssues && doc.verificationIssues.length > 0) {
        const fields: {[field: string]: {expected: string, found: string, value: string}} = {};
        
        doc.verificationIssues.forEach(issue => {
          fields[issue.field] = {
            expected: issue.expected,
            found: issue.found,
            value: issue.found // Initial value is what was found
          };
        });
        
        batchData.push({
          documentId: doc.id,
          type: doc.type,
          fileName: doc.fileName,
          fields
        });
      }
    });
    
    setBatchCorrections(batchData);
  };

  const handleEditDocuments = () => {
    setIsEditingDocuments(true);
  };

  const handleCancelEdit = () => {
    setIsEditingDocuments(false);
  };

  const openBatchEditDialog = () => {
    setBatchEditDialogOpen(true);
  };

  const closeBatchEditDialog = () => {
    setBatchEditDialogOpen(false);
  };

  const handleBatchFieldChange = (docIndex: number, fieldName: string, value: string) => {
    setBatchCorrections(prev => {
      const updated = [...prev];
      updated[docIndex].fields[fieldName].value = value;
      return updated;
    });
  };

  const handleSubmitBatchCorrections = () => {
    // In a real app, this would send the corrections to an API
    console.log('Submitting batch corrections:', batchCorrections);
    
    // Convert batch corrections to the format expected by the form
    const formattedCorrections = batchCorrections.map(batch => {
      const corrections: {[field: string]: string} = {};
      
      Object.entries(batch.fields).forEach(([field, data]) => {
        corrections[field] = data.value;
      });
      
      return {
        documentId: batch.documentId,
        corrections
      };
    });
    
    // Update client documents with corrections
    if (client) {
      const updatedDocuments = client.documents.map(doc => {
        const correctionData = formattedCorrections.find(
          correction => correction.documentId === doc.id
        );
        
        if (correctionData) {
          // Apply corrections to the document
          const updatedDoc = { ...doc };
          
          if (updatedDoc.verificationIssues) {
            // Update the "found" values with corrected values
            updatedDoc.verificationIssues = updatedDoc.verificationIssues.map(issue => {
              const correctedValue = correctionData.corrections[issue.field];
              return correctedValue 
                ? { ...issue, found: correctedValue } 
                : issue;
            });
          }
          
          return updatedDoc;
        }
        
        return doc;
      });
      
      // Update the client with corrected documents
      setClient({
        ...client,
        documents: updatedDocuments
      });
      
      toast.success("Document corrections saved successfully");
      setBatchEditDialogOpen(false);
    }
  };

  const onSubmitCorrections = (data: DocumentCorrectionsFormValues) => {
    // In a real app, this would send the corrections to an API
    console.log('Submitting corrections:', data);
    
    // Simulate updating the client data
    if (client) {
      const updatedDocuments = client.documents.map(doc => {
        const correctionData = data.documentCorrections.find(
          correction => correction.documentId === doc.id
        );
        
        if (correctionData) {
          // Apply corrections to the document
          const updatedDoc = { ...doc };
          
          if (updatedDoc.verificationIssues) {
            // Update the "found" values with corrected values
            updatedDoc.verificationIssues = updatedDoc.verificationIssues.map(issue => {
              const correctedValue = correctionData.corrections[issue.field];
              return correctedValue 
                ? { ...issue, found: correctedValue } 
                : issue;
            });
          }
          
          return updatedDoc;
        }
        
        return doc;
      });
      
      // Update the client with corrected documents
      setClient({
        ...client,
        documents: updatedDocuments
      });
      
      toast.success("Document corrections saved successfully");
      setIsEditingDocuments(false);
    }
  };

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

  const getOnboardingStageLabel = (stage?: OnboardingStage) => {
    switch (stage) {
      case 'application':
        return 'Application Submitted';
      case 'documents_pending':
        return 'Documents Pending';
      case 'verification':
        return 'Verification in Progress';
      case 'compliance_check':
        return 'Compliance Check';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const getOnboardingStageColor = (stage?: OnboardingStage) => {
    switch (stage) {
      case 'application':
        return 'bg-blue-500';
      case 'documents_pending':
        return 'bg-yellow-500';
      case 'verification':
        return 'bg-orange-500';
      case 'compliance_check':
        return 'bg-purple-500';
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const renderOnboardingProgress = () => {
    const stages: OnboardingStage[] = [
      'application',
      'documents_pending',
      'verification', 
      'compliance_check',
      'approved'
    ];
    
    const currentIndex = client.onboardingStage ? 
      stages.indexOf(client.onboardingStage) : 
      -1;
    
    return (
      <div className="mt-4">
        <div className="flex items-center justify-between">
          {stages.map((stage, index) => (
            <React.Fragment key={stage}>
              <div className="flex flex-col items-center">
                <div 
                  className={`h-8 w-8 rounded-full flex items-center justify-center
                    ${index <= currentIndex ? getOnboardingStageColor(stage) : 'bg-gray-200'} 
                    text-white text-xs font-medium`}
                >
                  {index + 1}
                </div>
                <span className="text-xs text-center mt-1 max-w-[80px]">
                  {getOnboardingStageLabel(stage)}
                </span>
              </div>
              
              {index < stages.length - 1 && (
                <div 
                  className={`h-1 flex-1 mx-1
                    ${index < currentIndex ? getOnboardingStageColor(stages[index + 1]) : 'bg-gray-200'}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
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

  // Render the document correction form
  const renderDocumentCorrectionForm = () => {
    if (documentsWithIssues.length === 0) {
      return (
        <div className="text-center py-6">
          <CheckCircle className="h-12 w-12 text-banking-success mx-auto" />
          <p className="mt-4 text-muted-foreground">No document issues to correct</p>
        </div>
      );
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitCorrections)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {documentsWithIssues.map((doc, docIndex) => (
              <Card key={doc.id} className="border-banking-warning/60">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    {doc.type.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())}
                    <span className="ml-2 text-sm text-muted-foreground">({doc.fileName})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {doc.verificationIssues && doc.verificationIssues.map((issue, issueIndex) => {
                      return (
                        <div key={`${doc.id}-${issue.field}`} className="space-y-2">
                          <Label>
                            {issue.field.charAt(0).toUpperCase() + issue.field.slice(1)}
                          </Label>
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <FormField
                                control={form.control}
                                name={`documentCorrections.${docIndex}.corrections.${issue.field}` as `documentCorrections.${number}.corrections.${string}`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        className="w-full"
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Expected: <span className="font-medium">{issue.expected}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancelEdit}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save All Corrections
            </Button>
          </div>
        </form>
      </Form>
    );
  };

  // Render the batch document correction dialog
  const renderBatchCorrectionDialog = () => {
    return (
      <Dialog open={batchEditDialogOpen} onOpenChange={setBatchEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Batch Edit Document Issues</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {batchCorrections.map((doc, docIndex) => (
              <Card key={doc.documentId} className="border-banking-warning/60">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    {doc.type.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())}
                    <span className="ml-2 text-sm text-muted-foreground">({doc.fileName})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(doc.fields).map(([fieldName, fieldData]) => (
                      <div key={`${doc.documentId}-${fieldName}`} className="space-y-2">
                        <Label>
                          {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                        </Label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <Input
                              value={fieldData.value}
                              onChange={(e) => handleBatchFieldChange(docIndex, fieldName, e.target.value)}
                              className="w-full"
                            />
                            <div className="flex justify-between mt-1">
                              <p className="text-xs text-muted-foreground">
                                Expected: <span className="font-medium">{fieldData.expected}</span>
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Found: <span className="font-medium">{fieldData.found}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={closeBatchEditDialog}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitBatchCorrections} 
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save All Corrections
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" className="mr-2" onClick={() => navigate('/clients')}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight">
            {client.firstName} {client.lastName}
            {getStatusBadge(client.status)}
          </h2>
          <div className="flex items-center mt-1">
            <Badge className={`${getOnboardingStageColor(client.onboardingStage)}`}>
              {getOnboardingStageLabel(client.onboardingStage)}
            </Badge>
          </div>
        </div>
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
            
            <div className="mt-8">
              <h3 className="text-sm font-medium">Onboarding Progress</h3>
              {renderOnboardingProgress()}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="documents" className="col-span-3">
          <TabsList>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            {documentsWithIssues.length > 0 && (
              <TabsTrigger value="corrections" className="relative">
                Document Corrections
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-banking-warning text-xs text-white">
                  {documentsWithIssues.length}
                </span>
              </TabsTrigger>
            )}
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
                <div className="flex space-x-2">
                  {documentsWithIssues.length > 0 && (
                    <Button 
                      variant="outline" 
                      onClick={openBatchEditDialog}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Fix All Document Issues ({documentsWithIssues.length})
                    </Button>
                  )}
                  <Button onClick={handleUploadDocument}>
                    <FileText className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
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

          {documentsWithIssues.length > 0 && (
            <TabsContent value="corrections">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Document Corrections</CardTitle>
                    <CardDescription>
                      Fix validation issues across all documents in one place
                    </CardDescription>
                  </div>
                  {!isEditingDocuments && (
                    <Button onClick={handleEditDocuments}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit All Issues
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {isEditingDocuments ? (
                    renderDocumentCorrectionForm()
                  ) : (
                    <div className="space-y-4">
                      {documentsWithIssues.map(doc => (
                        <div key={doc.id} className="border rounded-md p-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{doc.type.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())}</h4>
                            <Badge variant="outline" className="bg-banking-warning/10 text-banking-warning">
                              {doc.verificationIssues?.length} {doc.verificationIssues?.length === 1 ? 'Issue' : 'Issues'}
                            </Badge>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground">{doc.fileName}</p>
                          </div>
                          <div className="mt-3 pt-3 border-t">
                            <ul className="space-y-2">
                              {doc.verificationIssues?.map((issue, idx) => (
                                <li key={idx} className="flex justify-between text-sm">
                                  <span className="font-medium">{issue.field}:</span>
                                  <span>
                                    <span className="text-banking-danger">{issue.found}</span>
                                    {' → '}
                                    <span className="text-banking-success">{issue.expected}</span>
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Render the batch correction dialog */}
      {renderBatchCorrectionDialog()}
    </div>
  );
};

export default ClientDetails;
