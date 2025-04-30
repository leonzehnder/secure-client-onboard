
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockClients } from '../data/mockData';
import { Client, DocumentType } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Upload, FileText, AlertTriangle, Trash2 } from 'lucide-react';

const DocumentUpload = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [documentType, setDocumentType] = useState<DocumentType>('passport');
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [expiryDate, setExpiryDate] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('default');

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      if (clientId === 'all') {
        setClient(null);
        setLoading(false);
      } else {
        const foundClient = mockClients.find(c => c.id === clientId);
        setClient(foundClient || null);
        setLoading(false);
        
        if (!foundClient && clientId !== 'all') {
          toast.error("Client not found");
          navigate('/clients');
        }
      }
    }, 500);
  }, [clientId, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileSelected(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentTypeChange = (value: string) => {
    setDocumentType(value as DocumentType);
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileSelected) {
      toast.error("Please select a file to upload");
      return;
    }
    
    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      toast.success("Document uploaded successfully!");
      
      if (client) {
        navigate(`/clients/${client.id}`);
      } else {
        // Clear form
        setFileSelected(null);
        setPreviewUrl(null);
        setDocumentType('passport');
        setExpiryDate('');
      }
    }, 2000);
  };

  const handleCancel = () => {
    setFileSelected(null);
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          className="mr-2" 
          onClick={() => client ? navigate(`/clients/${client.id}`) : navigate('/clients')}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          Document Upload
          {client && ` for ${client.firstName} ${client.lastName}`}
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Verification Document</CardTitle>
          <CardDescription>
            Upload identification documents for verification and KYC compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {client ? (
                  <div>
                    <Label>Client</Label>
                    <div className="flex items-center mt-2 p-3 bg-muted rounded-md">
                      <div className="h-10 w-10 rounded-full bg-banking-primary flex items-center justify-center text-white font-semibold">
                        {client.firstName[0]}{client.lastName[0]}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{client.firstName} {client.lastName}</p>
                        <p className="text-sm text-muted-foreground">{client.id}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label>Client</Label>
                    <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                      <SelectTrigger>
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Or <Link to="/clients" className="text-banking-primary underline">search for a client</Link>
                    </p>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="documentType">Document Type</Label>
                  <Select value={documentType} onValueChange={handleDocumentTypeChange}>
                    <SelectTrigger id="documentType">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="idCard">ID Card</SelectItem>
                      <SelectItem value="drivingLicense">Driving License</SelectItem>
                      <SelectItem value="utilityBill">Utility Bill</SelectItem>
                      <SelectItem value="bankStatement">Bank Statement</SelectItem>
                      <SelectItem value="taxDocument">Tax Document</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="expiryDate">Expiry Date (if applicable)</Label>
                  <Input 
                    id="expiryDate" 
                    type="date" 
                    value={expiryDate} 
                    onChange={(e) => setExpiryDate(e.target.value)} 
                  />
                </div>
                
                <div>
                  <Label htmlFor="document">Document File</Label>
                  <div className="mt-2">
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="document" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="mb-1 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PDF, JPG, PNG or TIFF (max. 10MB)
                          </p>
                        </div>
                        <Input 
                          id="document" 
                          type="file" 
                          className="hidden" 
                          onChange={handleFileChange}
                          accept=".jpg,.jpeg,.png,.pdf,.tiff" 
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Document Preview</Label>
                <div className="border rounded-lg overflow-hidden h-72 bg-muted/50 flex items-center justify-center">
                  {previewUrl ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={previewUrl} 
                        alt="Document preview" 
                        className="w-full h-full object-contain"
                      />
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-2 right-2"
                        onClick={handleCancel}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">
                        {fileSelected ? "Processing preview..." : "No document selected"}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-banking-warning" />
                    <p className="ml-2 font-medium">Important Notes</p>
                  </div>
                  <ul className="mt-2 text-sm list-disc list-inside space-y-1">
                    <li>Ensure documents are clear, legible and not cropped</li>
                    <li>All four corners of identification documents must be visible</li>
                    <li>For proof of address, documents must be less than 3 months old</li>
                    <li>Personal information must match the client profile details</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => client ? navigate(`/clients/${client.id}`) : navigate('/clients')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!fileSelected || uploading}>
                {uploading ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUpload;
