
export type ClientStatus = 'pending' | 'complete' | 'flagged';
export type DocumentType = 'passport' | 'idCard' | 'drivingLicense' | 'utilityBill' | 'bankStatement' | 'taxDocument' | 'other';
export type DocumentStatus = 'verified' | 'pending' | 'rejected';
export type ComplianceStatus = 'cleared' | 'flagged' | 'pending';

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  address: Address;
  status: ClientStatus;
  createdAt: string;
  documents: Document[];
  compliance: Compliance;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Document {
  id: string;
  clientId: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  expiryDate?: string;
  status: DocumentStatus;
  verificationIssues?: VerificationIssue[];
}

export interface VerificationIssue {
  field: string;
  expected: string;
  found: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Compliance {
  pepStatus: ComplianceStatus;
  adverseMediaStatus: ComplianceStatus;
  sanctionsStatus: ComplianceStatus;
  lastCheckedAt: string;
  notes?: string;
  riskRating: 'low' | 'medium' | 'high';
}

export interface DashboardStats {
  totalClients: number;
  pendingClients: number;
  completedClients: number;
  flaggedClients: number;
  documentsToReview: number;
  averageCompletionTime: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: 'client' | 'document' | 'compliance';
  entityId: string;
  timestamp: string;
}

export interface Contract {
  id: string;
  name: string;
  description: string;
  category: string;
  requiresSignature: boolean;
  defaultSelected?: boolean;
}

export interface ClientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  address: {
    street: string;
    city: string;
    state: string | null;
    postalCode: string;
    country: string;
  };
  documents: {
    type: DocumentType;
    file: File | null;
    description?: string;
  }[];
  selectedContracts: string[];
}

export interface DocumentCorrection {
  documentId: string;
  corrections: {
    [field: string]: string;
  };
}

export interface DocumentCorrectionsFormValues {
  documentCorrections: DocumentCorrection[];
}
