import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { SidebarProvider } from "./components/layout/SidebarProvider";
import Layout from "./components/layout/Layout";
import Navbar from "./components/layout/Navbar";
import ChatPage from "./pages/Chat";
import AgentSelection from "./pages/AgentSelection";
import Dashboard from "./pages/Dashboard";
import ClientSearch from "./pages/ClientSearch";
import ClientDetails from "./pages/ClientDetails";
import AddClient from "./pages/AddClient";
import DocumentUpload from "./pages/DocumentUpload";
import Compliance from "./pages/Compliance";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Placeholder agent pages
import DocumentAnalysis from "./pages/placeholder/DocumentAnalysis";
import DeepResearch from "./pages/placeholder/DeepResearch";
import DataCleaning from "./pages/placeholder/DataCleaning";
import FraudDetection from "./pages/placeholder/FraudDetection";
import StockAnalysis from "./pages/placeholder/StockAnalysis";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/agents" replace />} />
              <Route path="/chat" element={<ChatPage />} />
              
              {/* Agent Selection Route */}
              <Route path="/agents" element={<AgentSelection />} />
              
              {/* KYC Agent Routes */}
              <Route path="/agents/dashboard" element={
                <SidebarProvider>
                  <Layout />
                </SidebarProvider>
              }>
                <Route index element={<Dashboard />} />
                <Route path="clients" element={<ClientSearch />} />
                <Route path="clients/add" element={<AddClient />} />
                <Route path="clients/:id" element={<ClientDetails />} />
                <Route path="documents/:clientId" element={<DocumentUpload />} />
                <Route path="compliance/:clientId" element={<Compliance />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              
              {/* Other Agent Routes */}
              <Route path="/agents/document-analysis" element={<DocumentAnalysis />} />
              <Route path="/agents/research" element={<DeepResearch />} />
              <Route path="/agents/data-cleaning" element={<DataCleaning />} />
              <Route path="/agents/fraud-detection" element={<FraudDetection />} />
              <Route path="/agents/stock-analysis" element={<StockAnalysis />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;