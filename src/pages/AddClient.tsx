
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { mockContracts } from '../data/mockContracts';
import { ClientFormData, DocumentType } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CalendarIcon, 
  UserPlus, 
  Save, 
  FileText, 
  Upload,
  File,
  X,
  Plus
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Document types for selection
const documentTypes: { value: DocumentType; label: string }[] = [
  { value: 'passport', label: 'Passport' },
  { value: 'idCard', label: 'ID Card' },
  { value: 'drivingLicense', label: 'Driving License' },
  { value: 'utilityBill', label: 'Utility Bill' },
  { value: 'bankStatement', label: 'Bank Statement' },
  { value: 'taxDocument', label: 'Tax Document' },
  { value: 'other', label: 'Other Document' },
];

// Validation schema
const formSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(5, { message: 'Valid phone number is required' }),
  dateOfBirth: z.string().min(1, { message: 'Date of birth is required' }),
  nationality: z.string().min(1, { message: 'Nationality is required' }),
  address: z.object({
    street: z.string().min(1, { message: 'Street address is required' }),
    city: z.string().min(1, { message: 'City is required' }),
    state: z.string().nullable(),
    postalCode: z.string().min(1, { message: 'Postal code is required' }),
    country: z.string().min(1, { message: 'Country is required' })
  }),
  documents: z.array(
    z.object({
      type: z.enum(['passport', 'idCard', 'drivingLicense', 'utilityBill', 'bankStatement', 'taxDocument', 'other']),
      file: z.any().refine(file => file instanceof File || file === null, {
        message: 'Please upload a valid file',
      }),
      description: z.string().optional(),
    })
  ),
  selectedContracts: z.array(z.string()).min(1, { message: 'At least one contract must be selected' })
});

const AddClient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('personal');

  // Initialize form with react-hook-form and zod validation
  const form = useForm<ClientFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      nationality: '',
      address: {
        street: '',
        city: '',
        state: null,
        postalCode: '',
        country: ''
      },
      documents: [
        { type: 'passport', file: null, description: '' }
      ],
      selectedContracts: mockContracts
        .filter(contract => contract.defaultSelected)
        .map(contract => contract.id)
    }
  });

  // Group contracts by category for better organization
  const contractsByCategory = mockContracts.reduce((acc, contract) => {
    if (!acc[contract.category]) {
      acc[contract.category] = [];
    }
    acc[contract.category].push(contract);
    return acc;
  }, {} as Record<string, typeof mockContracts>);

  const onSubmit = (data: ClientFormData) => {
    console.log('Client data submitted:', data);
    
    // Show success toast
    toast({
      title: "Client Added Successfully",
      description: `${data.firstName} ${data.lastName} has been added to your client list.`,
    });
    
    // Navigate back to client list
    navigate('/agents/dashboard/clients');
  };

  // Function to handle file selection
  const handleFileChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileValue = e.target.files[0];
      const documents = form.getValues().documents;
      documents[index].file = fileValue;
      form.setValue(`documents.${index}.file`, fileValue);
    }
  };

  // Add a new document upload field
  const addDocument = () => {
    const documents = form.getValues().documents;
    form.setValue('documents', [
      ...documents,
      { type: 'other', file: null, description: '' }
    ]);
  };

  // Remove a document upload field
  const removeDocument = (index: number) => {
    const documents = form.getValues().documents;
    if (documents.length > 1) {
      const updatedDocuments = documents.filter((_, i) => i !== index);
      form.setValue('documents', updatedDocuments);
    }
  };

  // Get an array of document field values
  const { fields: documentFields } = form.control._formValues.documents
    ? { fields: form.getValues().documents }
    : { fields: [] };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add New Client</h2>
          <p className="text-muted-foreground">Create a new client profile and assign contracts</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full md:w-[600px]">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Enter the client's personal and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input type="date" className="pl-8" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality</FormLabel>
                          <FormControl>
                            <Input placeholder="United States" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-4" />
                  <h3 className="text-lg font-medium">Address Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="address.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main Street" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="address.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address.state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input placeholder="NY" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="address.postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address.country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="United States" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-between mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/agents/dashboard/clients')}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setActiveTab('documents')}
                >
                  Next: Upload Documents
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Client Documents</CardTitle>
                  <CardDescription>
                    Upload verification documents for the client
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    {documentFields.map((document, index) => (
                      <div key={index} className="p-4 border rounded-md relative">
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 p-0"
                            onClick={() => removeDocument(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`documents.${index}.type` as const}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Document Type</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a document type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {documentTypes.map(docType => (
                                      <SelectItem key={docType.value} value={docType.value}>
                                        {docType.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormItem>
                            <FormLabel>Upload Document</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Input 
                                  type="file" 
                                  id={`document-${index}`}
                                  onChange={handleFileChange(index)}
                                  className="hidden"
                                />
                                <label 
                                  htmlFor={`document-${index}`}
                                  className="cursor-pointer flex items-center gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-2 text-sm font-medium"
                                >
                                  <Upload className="h-4 w-4" />
                                  Choose File
                                </label>
                                <span className="ml-3 text-sm text-muted-foreground">
                                  {form.watch(`documents.${index}.file`)?.name || "No file selected"}
                                </span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        </div>
                        
                        <div className="mt-4">
                          <FormField
                            control={form.control}
                            name={`documents.${index}.description` as const}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Add notes about this document..."
                                    className="resize-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center gap-2 w-full"
                      onClick={addDocument}
                    >
                      <Plus className="h-4 w-4" />
                      Add Another Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-between mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setActiveTab('personal')}
                >
                  Previous: Personal Information
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setActiveTab('contracts')}
                >
                  Next: Select Contracts
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="contracts">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Selection</CardTitle>
                  <CardDescription>
                    Select the contracts required for this client
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-6">
                      {Object.entries(contractsByCategory).map(([category, contracts]) => (
                        <div key={category} className="space-y-4">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium">{category}</h3>
                            <Badge variant="outline" className="ml-2">{contracts.length}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4">
                            {contracts.map((contract) => (
                              <FormField
                                key={contract.id}
                                control={form.control}
                                name="selectedContracts"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(contract.id)}
                                        onCheckedChange={(checked) => {
                                          const currentValues = field.value || [];
                                          return checked
                                            ? field.onChange([...currentValues, contract.id])
                                            : field.onChange(
                                                currentValues.filter((value) => value !== contract.id)
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="text-base">
                                        {contract.name}
                                      </FormLabel>
                                      <FormDescription>
                                        {contract.description}
                                      </FormDescription>
                                      {contract.requiresSignature && (
                                        <Badge variant="outline" className="mt-2">
                                          <FileText className="h-3 w-3 mr-1" />
                                          Requires Signature
                                        </Badge>
                                      )}
                                    </div>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <FormField
                    control={form.control}
                    name="selectedContracts"
                    render={() => (
                      <FormMessage className="mt-4" />
                    )}
                  />
                </CardContent>
              </Card>
              
              <div className="flex justify-between mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setActiveTab('documents')}
                >
                  Back
                </Button>
                <Button type="submit" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Client
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
};

export default AddClient;
