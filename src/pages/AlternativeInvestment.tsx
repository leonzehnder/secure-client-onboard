
import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Download,
  Filter,
  Search,
  Calendar,
  Building2,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit3,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const AlternativeInvestment = () => {
  const [activeModule, setActiveModule] = useState('dashboard');

  // Mock data
  const portfolioStats = {
    totalInvested: 125800000,
    availableFunds: 45200000,
    irr: 12.5,
    distributions: 89400000,
    activeInvestments: 24,
    pendingDocuments: 8
  };

  const recentDocuments = [
    { id: 1, name: 'Q3 2024 Capital Call - Fund VII', type: 'Capital Call', status: 'pending', date: '2024-12-10', confidence: 95 },
    { id: 2, name: 'Distribution Notice - Growth Partners', type: 'Distribution', status: 'processed', date: '2024-12-08', confidence: 98 },
    { id: 3, name: 'Valuation Report - Tech Ventures', type: 'Valuation', status: 'review', date: '2024-12-05', confidence: 87 },
    { id: 4, name: 'Commitment Agreement - Real Estate Fund', type: 'Commitment', status: 'pending', date: '2024-12-03', confidence: 92 }
  ];

  const investments = [
    { id: 1, fund: 'Tech Growth Fund VII', invested: 15000000, current: 18500000, irr: 15.2, type: 'Private Equity' },
    { id: 2, fund: 'Real Estate Partners III', invested: 25000000, current: 28900000, irr: 11.8, type: 'Real Estate' },
    { id: 3, fund: 'Healthcare Innovation', invested: 12000000, current: 13200000, irr: 8.5, type: 'Venture Capital' },
    { id: 4, fund: 'Infrastructure Fund II', invested: 30000000, current: 35600000, irr: 14.1, type: 'Infrastructure' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const DashboardModule = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-banking-primary to-banking-accent p-8 rounded-lg text-white">
        <div className="flex items-center space-x-4 mb-4">
          <Building2 className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">core extraDoc</h1>
            <p className="text-banking-light/80">AI-Powered Document Intelligence for Alternative Investments</p>
          </div>
        </div>
        <p className="text-banking-light/90 max-w-4xl">
          Automate extraction and processing of data from alternative investment documents. 
          Eliminate manual data entry, increase accuracy, and accelerate workflow efficiency 
          with seamless integration into the Core platform.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Invested</p>
                <p className="text-2xl font-bold text-banking-primary">{formatCurrency(portfolioStats.totalInvested)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-banking-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Funds</p>
                <p className="text-2xl font-bold text-banking-success">{formatCurrency(portfolioStats.availableFunds)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-banking-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Portfolio IRR</p>
                <p className="text-2xl font-bold text-banking-primary">{portfolioStats.irr}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-banking-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Distributions</p>
                <p className="text-2xl font-bold text-banking-accent">{formatCurrency(portfolioStats.distributions)}</p>
              </div>
              <ArrowDownRight className="h-8 w-8 text-banking-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Portfolio Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Recent Documents</span>
              <Badge variant="secondary">{portfolioStats.pendingDocuments} pending</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{doc.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                      <span className="text-xs text-gray-500">{doc.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        doc.status === 'processed' ? 'bg-green-500' : 
                        doc.status === 'review' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                      <span className="text-xs text-gray-600">{doc.confidence}%</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Top Performing Investments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {investments.slice(0, 4).map((investment) => (
                <div key={investment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{investment.fund}</p>
                    <p className="text-xs text-gray-500">{investment.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-banking-success">{investment.irr}% IRR</p>
                    <p className="text-xs text-gray-500">{formatCurrency(investment.current)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const DocumentIngestionModule = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-banking-primary">Document Ingestion</h2>
        <Button className="bg-banking-primary hover:bg-banking-accent">
          <Plus className="h-4 w-4 mr-2" />
          New Upload
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Options */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Drag & Drop Documents</p>
              <p className="text-gray-500 mb-4">or click to browse files</p>
              <Button variant="outline">Choose Files</Button>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-banking-primary mb-2">Email Forwarding</h4>
              <p className="text-sm text-gray-600 mb-2">Forward documents directly to:</p>
              <code className="bg-white px-3 py-1 rounded border text-sm">docs@core-extradoc.com</code>
            </div>
          </CardContent>
        </Card>

        {/* Document Types */}
        <Card>
          <CardHeader>
            <CardTitle>Supported Document Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                'Capital Call Notices',
                'Distribution Reports',
                'Valuation Reports',
                'Commitment Agreements',
                'Fund Statements',
                'Investment Memos',
                'Partnership Agreements',
                'Quarterly Reports'
              ].map((docType) => (
                <div key={docType} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{docType}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Management */}
      <Card>
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search documents..." className="pl-9" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-banking-secondary" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <div className="flex items-center space-x-3 mt-1">
                      <Badge variant="outline">{doc.type}</Badge>
                      <span className="text-sm text-gray-500">{doc.date}</span>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          doc.status === 'processed' ? 'bg-green-500' : 
                          doc.status === 'review' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}></div>
                        <span className="text-sm text-gray-600">AI Confidence: {doc.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const CheckDashboardModule = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-banking-primary">Pre-Review Dashboard</h2>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary">{recentDocuments.filter(d => d.status === 'pending').length} Pending Review</Badge>
          <Button className="bg-banking-success hover:bg-banking-success/90">
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve All Valid
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Extracted Data Validation</CardTitle>
          <p className="text-gray-600">Review and validate AI-extracted data before final booking</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentDocuments.map((doc) => (
              <div key={doc.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-6 w-6 text-banking-secondary" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <Badge variant="outline">{doc.type}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                      doc.confidence >= 95 ? 'bg-green-100 text-green-800' :
                      doc.confidence >= 85 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {doc.confidence >= 95 ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                      <span>{doc.confidence}% Confidence</span>
                    </div>
                  </div>
                </div>

                {/* Extracted Data Preview */}
                <div className="bg-gray-50 rounded p-4">
                  <h4 className="font-medium mb-3">Extracted Fields</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {doc.type === 'Capital Call' ? (
                      <>
                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wide">Fund Name</label>
                          <p className="font-medium">Tech Growth Fund VII</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wide">Call Amount</label>
                          <p className="font-medium">$2,500,000</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wide">Due Date</label>
                          <p className="font-medium">December 20, 2024</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wide">Reference Number</label>
                          <p className="font-medium">CC-2024-Q4-007</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wide">Purpose</label>
                          <p className="font-medium">Portfolio Company Acquisition</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wide">Investor Share</label>
                          <p className="font-medium">15.75%</p>
                        </div>
                      </>
                    ) : doc.type === 'Distribution' ? (
                      <>
                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wide">Fund Name</label>
                          <p className="font-medium">Growth Partners III</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wide">Distribution Amount</label>
                          <p className="font-medium">$1,850,000</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wide">Payment Date</label>
                          <p className="font-medium">December 15, 2024</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wide">Distribution Type</label>
                          <p className="font-medium">Portfolio Realization</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wide">Source Investment</label>
                          <p className="font-medium">TechCorp Exit</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wide">Tax Classification</label>
                          <p className="font-medium">Capital Gains</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wide">Fund Name</label>
                          <p className="font-medium">Tech Ventures II</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wide">Valuation Date</label>
                          <p className="font-medium">September 30, 2024</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wide">NAV per Share</label>
                          <p className="font-medium">$147.25</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Original
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Data
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Doc Chat
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Discard
                    </Button>
                    <Button variant="outline" size="sm">
                      Return to Edit
                    </Button>
                    <Button className="bg-banking-success hover:bg-banking-success/90" size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm & Book
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-banking-light">
      <div className="border-b bg-white">
        <div className="container mx-auto px-6">
          <Tabs value={activeModule} onValueChange={setActiveModule} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Portfolio Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="ingestion" className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Document Ingestion</span>
              </TabsTrigger>
              <TabsTrigger value="review" className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Review Dashboard</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeModule} onValueChange={setActiveModule}>
          <TabsContent value="dashboard">
            <DashboardModule />
          </TabsContent>
          
          <TabsContent value="ingestion">
            <DocumentIngestionModule />
          </TabsContent>
          
          <TabsContent value="review">
            <CheckDashboardModule />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AlternativeInvestment;
