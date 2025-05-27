
import React, { useState } from 'react';
import { 
  FileSearch, 
  Upload, 
  FileText, 
  BarChart3, 
  Download, 
  Zap, 
  Eye,
  Settings,
  History,
  Plus,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AnalysisResult {
  id: string;
  fileName: string;
  type: string;
  extractedText: string;
  insights: string[];
  confidence: number;
  timestamp: string;
}

const DocumentAnalysis = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeDocument = async (file: File) => {
    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      const result: AnalysisResult = {
        id: Date.now().toString(),
        fileName: file.name,
        type: file.type,
        extractedText: "Sample extracted text from the document. This would contain the actual OCR results and parsed content from the uploaded file.",
        insights: [
          "Document contains structured financial data",
          "95% confidence in text extraction accuracy",
          "Detected 3 tables and 2 charts",
          "Key entities: dates, amounts, names identified"
        ],
        confidence: 95,
        timestamp: new Date().toISOString()
      };
      
      setAnalysisResults(prev => [result, ...prev]);
      setActiveAnalysis(result);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileSearch className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Document Analysis Agent</h1>
              <p className="text-sm text-gray-500">Extract, analyze, and gain insights from your documents</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm">
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Analysis Results</h3>
            {analysisResults.length === 0 ? (
              <p className="text-sm text-gray-500">No analyses yet. Upload a document to get started.</p>
            ) : (
              <div className="space-y-2">
                {analysisResults.map((result) => (
                  <Card 
                    key={result.id}
                    className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                      activeAnalysis?.id === result.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setActiveAnalysis(result)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">{result.fileName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(result.timestamp).toLocaleDateString()}
                        </p>
                        <div className="flex items-center mt-2">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-xs text-gray-600">{result.confidence}% confidence</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="upload">Upload & Extract</TabsTrigger>
              <TabsTrigger value="analyze">Analyze</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Area */}
                <Card className="p-6">
                  <h3 className="font-medium mb-4">Upload Documents</h3>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFileUpload(e.dataTransfer.files);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">Drop files here or click to upload</p>
                    <p className="text-sm text-gray-500">Supports PDF, DOC, DOCX, TXT, CSV, XLS, XLSX</p>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Uploaded Files</h4>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{file.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                onClick={() => analyzeDocument(file)}
                                disabled={isAnalyzing}
                              >
                                <Zap className="h-3 w-3 mr-1" />
                                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>

                {/* Extraction Settings */}
                <Card className="p-6">
                  <h3 className="font-medium mb-4">Extraction Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="extraction-type">Extraction Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select extraction type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Full Text Extraction</SelectItem>
                          <SelectItem value="structured">Structured Data Only</SelectItem>
                          <SelectItem value="tables">Tables and Charts</SelectItem>
                          <SelectItem value="entities">Named Entities</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="language">Document Language</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="confidence">Minimum Confidence</Label>
                      <Input type="number" placeholder="85" min="0" max="100" />
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analyze" className="mt-6">
              {activeAnalysis ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="font-medium mb-4">Extracted Text</h3>
                    <Textarea
                      value={activeAnalysis.extractedText}
                      readOnly
                      className="min-h-[300px] resize-none"
                    />
                  </Card>

                  <Card className="p-6">
                    <h3 className="font-medium mb-4">Analysis Tools</h3>
                    <div className="space-y-4">
                      <Button className="w-full justify-start">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Generate Data Visualization
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Entity Recognition
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Sentiment Analysis
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Zap className="h-4 w-4 mr-2" />
                        Key Phrase Extraction
                      </Button>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Document Statistics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Word Count:</span>
                          <span>1,247</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Character Count:</span>
                          <span>7,392</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pages:</span>
                          <span>3</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tables Detected:</span>
                          <span>2</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <FileSearch className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Document Selected</h3>
                  <p className="text-gray-500">Upload and analyze a document to see the results here.</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="insights" className="mt-6">
              {activeAnalysis ? (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="font-medium mb-4">AI-Generated Insights</h3>
                    <div className="space-y-3">
                      {activeAnalysis.insights.map((insight, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                          <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                          <p className="text-sm text-gray-700">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6">
                      <h3 className="font-medium mb-4">Data Quality Score</h3>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">{activeAnalysis.confidence}%</div>
                        <p className="text-sm text-gray-500 mt-1">Extraction Confidence</p>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h3 className="font-medium mb-4">Quick Actions</h3>
                      <div className="space-y-2">
                        <Button size="sm" className="w-full justify-start">
                          <Plus className="h-3 w-3 mr-2" />
                          Create Summary
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start">
                          <Download className="h-3 w-3 mr-2" />
                          Generate Report
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Available</h3>
                  <p className="text-gray-500">Analyze a document first to generate insights.</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="export" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-medium mb-4">Export Options</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Export Format</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF Report</SelectItem>
                          <SelectItem value="docx">Word Document</SelectItem>
                          <SelectItem value="xlsx">Excel Spreadsheet</SelectItem>
                          <SelectItem value="csv">CSV Data</SelectItem>
                          <SelectItem value="json">JSON Data</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Include Components</Label>
                      <div className="space-y-2 mt-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Extracted Text</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Analysis Results</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">Visualizations</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">Raw Data</span>
                        </label>
                      </div>
                    </div>

                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export Analysis
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-medium mb-4">Batch Operations</h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Export All Analyses
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Merge Documents
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Compare Analyses
                    </Button>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      💡 <strong>Pro Tip:</strong> Use batch operations to process multiple documents efficiently and generate comprehensive reports.
                    </p>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalysis;
