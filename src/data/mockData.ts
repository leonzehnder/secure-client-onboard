
import { Client, DashboardStats, ActivityLog } from '../types';

export const mockClients: Client[] = [
  {
    id: "CLIENT-001",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1985-06-15",
    nationality: "United States",
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States"
    },
    status: "complete",
    createdAt: "2024-03-12T09:30:00Z",
    documents: [
      {
        id: "DOC-001-A",
        clientId: "CLIENT-001",
        type: "passport",
        fileName: "john_smith_passport.pdf",
        fileUrl: "/placeholder.svg",
        uploadedAt: "2024-03-12T10:15:00Z",
        expiryDate: "2030-06-14",
        status: "verified",
        verificationIssues: []
      },
      {
        id: "DOC-001-B",
        clientId: "CLIENT-001",
        type: "utilityBill",
        fileName: "john_smith_utility_bill.pdf",
        fileUrl: "/placeholder.svg",
        uploadedAt: "2024-03-12T10:25:00Z",
        status: "verified",
        verificationIssues: []
      }
    ],
    compliance: {
      pepStatus: "cleared",
      adverseMediaStatus: "cleared",
      sanctionsStatus: "cleared",
      lastCheckedAt: "2024-03-13T14:30:00Z",
      riskRating: "low"
    }
  },
  {
    id: "CLIENT-002",
    firstName: "Emma",
    lastName: "Johnson",
    email: "emma.johnson@example.com",
    phone: "+1 (555) 234-5678",
    dateOfBirth: "1990-09-22",
    nationality: "United Kingdom",
    address: {
      street: "45 Park Avenue",
      city: "London",
      state: "England",
      postalCode: "SW1A 1AA",
      country: "United Kingdom"
    },
    status: "pending",
    createdAt: "2024-03-15T11:00:00Z",
    documents: [
      {
        id: "DOC-002-A",
        clientId: "CLIENT-002",
        type: "idCard",
        fileName: "emma_johnson_id.pdf",
        fileUrl: "/placeholder.svg",
        uploadedAt: "2024-03-15T11:45:00Z",
        expiryDate: "2028-09-21",
        status: "pending",
        verificationIssues: []
      }
    ],
    compliance: {
      pepStatus: "pending",
      adverseMediaStatus: "pending",
      sanctionsStatus: "pending",
      lastCheckedAt: "2024-03-15T13:00:00Z",
      riskRating: "medium"
    }
  },
  {
    id: "CLIENT-003",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@example.com",
    phone: "+1 (555) 345-6789",
    dateOfBirth: "1988-12-03",
    nationality: "Canada",
    address: {
      street: "789 Queen Street",
      city: "Toronto",
      state: "Ontario",
      postalCode: "M5H 2N2",
      country: "Canada"
    },
    status: "flagged",
    createdAt: "2024-03-18T14:30:00Z",
    documents: [
      {
        id: "DOC-003-A",
        clientId: "CLIENT-003",
        type: "passport",
        fileName: "michael_chen_passport.pdf",
        fileUrl: "/placeholder.svg",
        uploadedAt: "2024-03-18T15:10:00Z",
        expiryDate: "2029-12-02",
        status: "rejected",
        verificationIssues: [
          {
            field: "name",
            expected: "Michael Chen",
            found: "Michel Chen",
            severity: "high"
          }
        ]
      },
      {
        id: "DOC-003-B",
        clientId: "CLIENT-003",
        type: "bankStatement",
        fileName: "michael_chen_bank_statement.pdf",
        fileUrl: "/placeholder.svg",
        uploadedAt: "2024-03-18T15:20:00Z",
        status: "rejected",
        verificationIssues: [
          {
            field: "address",
            expected: "789 Queen Street",
            found: "789 King Street",
            severity: "medium"
          }
        ]
      }
    ],
    compliance: {
      pepStatus: "flagged",
      adverseMediaStatus: "cleared",
      sanctionsStatus: "cleared",
      lastCheckedAt: "2024-03-19T10:45:00Z",
      notes: "PEP match found. Needs senior approval.",
      riskRating: "high"
    }
  },
  {
    id: "CLIENT-004",
    firstName: "Sophia",
    lastName: "Garcia",
    email: "sophia.garcia@example.com",
    phone: "+1 (555) 456-7890",
    dateOfBirth: "1992-04-18",
    nationality: "Spain",
    address: {
      street: "321 Maple Road",
      city: "Barcelona",
      state: "Catalonia",
      postalCode: "08001",
      country: "Spain"
    },
    status: "complete",
    createdAt: "2024-03-20T09:00:00Z",
    documents: [
      {
        id: "DOC-004-A",
        clientId: "CLIENT-004",
        type: "idCard",
        fileName: "sophia_garcia_id.pdf",
        fileUrl: "/placeholder.svg",
        uploadedAt: "2024-03-20T09:45:00Z",
        expiryDate: "2031-04-17",
        status: "verified",
        verificationIssues: []
      },
      {
        id: "DOC-004-B",
        clientId: "CLIENT-004",
        type: "utilityBill",
        fileName: "sophia_garcia_utility_bill.pdf",
        fileUrl: "/placeholder.svg",
        uploadedAt: "2024-03-20T10:00:00Z",
        status: "verified",
        verificationIssues: []
      }
    ],
    compliance: {
      pepStatus: "cleared",
      adverseMediaStatus: "cleared",
      sanctionsStatus: "cleared",
      lastCheckedAt: "2024-03-21T13:15:00Z",
      riskRating: "low"
    }
  },
  {
    id: "CLIENT-005",
    firstName: "David",
    lastName: "Kim",
    email: "david.kim@example.com",
    phone: "+1 (555) 567-8901",
    dateOfBirth: "1983-11-09",
    nationality: "South Korea",
    address: {
      street: "567 Oak Lane",
      city: "Seoul",
      state: null,
      postalCode: "04523",
      country: "South Korea"
    },
    status: "pending",
    createdAt: "2024-03-25T16:30:00Z",
    documents: [
      {
        id: "DOC-005-A",
        clientId: "CLIENT-005",
        type: "passport",
        fileName: "david_kim_passport.pdf",
        fileUrl: "/placeholder.svg",
        uploadedAt: "2024-03-25T17:00:00Z",
        expiryDate: "2032-11-08",
        status: "pending",
        verificationIssues: []
      }
    ],
    compliance: {
      pepStatus: "pending",
      adverseMediaStatus: "pending",
      sanctionsStatus: "pending",
      lastCheckedAt: "2024-03-25T18:00:00Z",
      riskRating: "medium"
    }
  }
];

export const mockDashboardStats: DashboardStats = {
  totalClients: 5,
  pendingClients: 2,
  completedClients: 2,
  flaggedClients: 1,
  documentsToReview: 3,
  averageCompletionTime: "2.5 days"
};

export const mockActivityLogs: ActivityLog[] = [
  {
    id: "LOG-001",
    userId: "USER-001",
    userName: "John Doe",
    action: "uploaded document",
    entityType: "document",
    entityId: "DOC-005-A",
    timestamp: "2024-03-25T17:00:00Z"
  },
  {
    id: "LOG-002",
    userId: "USER-002",
    userName: "Jane Smith",
    action: "verified document",
    entityType: "document",
    entityId: "DOC-004-B",
    timestamp: "2024-03-20T14:30:00Z"
  },
  {
    id: "LOG-003",
    userId: "USER-001",
    userName: "John Doe",
    action: "flagged compliance issue",
    entityType: "compliance",
    entityId: "CLIENT-003",
    timestamp: "2024-03-19T10:45:00Z"
  },
  {
    id: "LOG-004",
    userId: "USER-003",
    userName: "Robert Johnson",
    action: "created client",
    entityType: "client",
    entityId: "CLIENT-005",
    timestamp: "2024-03-25T16:30:00Z"
  },
  {
    id: "LOG-005",
    userId: "USER-002",
    userName: "Jane Smith",
    action: "completed onboarding",
    entityType: "client",
    entityId: "CLIENT-001",
    timestamp: "2024-03-13T15:00:00Z"
  }
];
