
import React, { useState } from 'react';
import { 
  DatabaseBackup, 
  Upload, 
  Search, 
  Eye, 
  BarChart3, 
  AlertTriangle, 
  Settings, 
  Play, 
  Clock, 
  CheckCircle, 
  Download,
  Plus,
  Trash2,
  RefreshCw,
  Filter,
  Zap,
  History,
  FileText
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const DataCleaning = () => {
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [activeRule, setActiveRule] = useState<string | null>(null);

  // Mock data for demonstration
  const datasets = [
    { id: '1', name: 'Customer Data', source: 'PostgreSQL', rows: 15420, status: 'connected' },
    { id: '2', name: 'Sales Transactions', source: 'S3 Bucket', rows: 89234, status: 'connected' },
    { id: '3', name: 'Product Inventory', source: 'CSV Upload', rows: 2341, status: 'processing' }
  ];

  const sampleData = [
    { id: 1, name: 'John Doe', email: 'john@email.com', age: 25, status: 'Active' },
    { id: 2, name: 'Jane Smith', email: '', age: null, status: 'Inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@company.com', age: 45, status: 'Active' }
  ];

  const columnStats = [
    { column: 'name', nullPercent: 0, unique: 98, type: 'string' },
    { column: 'email', nullPercent: 12, unique: 87, type: 'string' },
    { column: 'age', nullPercent: 8, unique: 45, type: 'integer' },
    { column: 'status', nullPercent: 0, unique: 2, type: 'string' }
  ];

  const detectedIssues = [
    { type: 'Missing Values', count: 145, severity: 'medium', column: 'email' },
    { type: 'Duplicates', count: 23, severity: 'high', column: 'customer_id' },
    { type: 'Format Errors', count: 8, severity: 'low', column: 'phone' },
    { type: 'Outliers', count: 12, severity: 'medium', column: 'purchase_amount' }
  ];

  const suggestions = [
    { id: 1, text: 'Impute missing email addresses using name patterns', confidence: 85 },
    { id: 2, text: 'Remove duplicate records based on customer_id', confidence: 95 },
    { id: 3, text: 'Standardize phone number formats to E.164', confidence: 78 },
    { id: 4, text: 'Flag transactions above $10,000 for review', confidence: 92 }
  ];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Data Cleaning Agent</h1>
        <p className="text-muted-foreground">Clean, validate, and transform your data with AI-powered tools</p>
      </div>

      <Tabs defaultValue="datasets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="datasets">Dataset Access</TabsTrigger>
          <TabsTrigger value="preview">Preview & Profile</TabsTrigger>
          <TabsTrigger value="checks">AI Checks</TabsTrigger>
          <TabsTrigger value="rules">Rule Builder</TabsTrigger>
          <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
          <TabsTrigger value="audit">Review & Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="datasets" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <DatabaseBackup className="h-5 w-5" />
                Data Sources
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Connect Database
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {datasets.map((dataset) => (
                <div key={dataset.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <DatabaseBackup className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-medium">{dataset.name}</h3>
                      <p className="text-sm text-muted-foreground">{dataset.source} • {dataset.rows.toLocaleString()} rows</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={dataset.status === 'connected' ? 'default' : 'secondary'}>
                      {dataset.status}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedDataset(dataset.id)}
                    >
                      Select
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 border-2 border-dashed rounded-lg text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">Drop files here or click to upload</p>
              <Button variant="outline" size="sm">Browse Files</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Data Preview
                </h2>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.email || <span className="text-red-500">null</span>}</TableCell>
                        <TableCell>{row.age || <span className="text-red-500">null</span>}</TableCell>
                        <TableCell>{row.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5" />
                Column Statistics
              </h2>

              <div className="space-y-4">
                {columnStats.map((stat) => (
                  <div key={stat.column} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{stat.column}</span>
                      <Badge variant="outline">{stat.type}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Null: {stat.nullPercent}%</span>
                        <span>Unique: {stat.unique}</span>
                      </div>
                      <Progress value={100 - stat.nullPercent} className="mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="checks" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                AI-Driven Quality Checks
              </h2>
              <Button>
                <Play className="h-4 w-4 mr-2" />
                Run All Checks
              </Button>
            </div>

            <div className="grid gap-4 mb-6">
              {detectedIssues.map((issue, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <AlertTriangle className={`h-5 w-5 ${
                      issue.severity === 'high' ? 'text-red-500' : 
                      issue.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                    }`} />
                    <div>
                      <h3 className="font-medium">{issue.type}</h3>
                      <p className="text-sm text-muted-foreground">
                        {issue.count} issues found in {issue.column}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      issue.severity === 'high' ? 'destructive' : 
                      issue.severity === 'medium' ? 'default' : 'secondary'
                    }>
                      {issue.severity}
                    </Badge>
                    <Button variant="outline" size="sm">Fix</Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Smart Suggestions
              </h3>
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm">{suggestion.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">Confidence:</span>
                      <Progress value={suggestion.confidence} className="w-20 h-2" />
                      <span className="text-xs text-muted-foreground">{suggestion.confidence}%</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm">Dismiss</Button>
                    <Button size="sm">Apply</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Cleaning Rule Builder
              </h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Available Actions</h3>
                <div className="grid gap-2">
                  {['Remove Duplicates', 'Fill Missing Values', 'Standardize Format', 'Filter Rows', 'Transform Values'].map((action) => (
                    <Button 
                      key={action} 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => setActiveRule(action)}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      {action}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Rule Configuration</h3>
                {activeRule ? (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-medium">{activeRule}</h4>
                    <div className="space-y-2">
                      <Label>Column</Label>
                      <Input placeholder="Select column..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Condition</Label>
                      <Input placeholder="Define condition..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Action</Label>
                      <Textarea placeholder="Describe the transformation..." />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">Preview</Button>
                      <Button>Save Rule</Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground">
                    Select an action to configure
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="pipelines" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Play className="h-5 w-5" />
                Cleaning Pipelines
              </h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Pipeline
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Customer Data Cleanup', status: 'running', progress: 65, lastRun: '2 mins ago' },
                { name: 'Sales Data Validation', status: 'completed', progress: 100, lastRun: '1 hour ago' },
                { name: 'Weekly Data Refresh', status: 'scheduled', progress: 0, lastRun: 'Never' }
              ].map((pipeline, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`h-3 w-3 rounded-full ${
                      pipeline.status === 'running' ? 'bg-blue-500' :
                      pipeline.status === 'completed' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <div>
                      <h3 className="font-medium">{pipeline.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Last run: {pipeline.lastRun}</span>
                        {pipeline.progress > 0 && (
                          <div className="flex items-center gap-2">
                            <Progress value={pipeline.progress} className="w-20 h-2" />
                            <span>{pipeline.progress}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5" />
                Data Quality Score
              </h2>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">87%</div>
                  <p className="text-muted-foreground">Overall Quality Score</p>
                </div>
                <div className="space-y-2">
                  {[
                    { metric: 'Completeness', score: 92 },
                    { metric: 'Accuracy', score: 88 },
                    { metric: 'Consistency', score: 85 },
                    { metric: 'Validity', score: 84 }
                  ].map((metric) => (
                    <div key={metric.metric} className="flex justify-between items-center">
                      <span className="text-sm">{metric.metric}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={metric.score} className="w-20 h-2" />
                        <span className="text-sm w-8">{metric.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Audit Trail
                </h2>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <div className="space-y-3">
                {[
                  { action: 'Removed 23 duplicate records', user: 'AI Agent', time: '5 mins ago' },
                  { action: 'Applied email format validation', user: 'John Doe', time: '1 hour ago' },
                  { action: 'Imputed missing age values', user: 'AI Agent', time: '2 hours ago' },
                  { action: 'Dataset uploaded: customers.csv', user: 'Jane Smith', time: '1 day ago' }
                ].map((entry, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm">{entry.action}</p>
                      <p className="text-xs text-muted-foreground">{entry.user} • {entry.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export & Integration
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="flex flex-col h-20">
                <DatabaseBackup className="h-6 w-6 mb-1" />
                Export to Database
              </Button>
              <Button variant="outline" className="flex flex-col h-20">
                <Download className="h-6 w-6 mb-1" />
                Download as CSV
              </Button>
              <Button variant="outline" className="flex flex-col h-20">
                <Settings className="h-6 w-6 mb-1" />
                API Integration
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataCleaning;
