
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { SidebarProvider } from "./components/layout/SidebarProvider";
import Layout from "./components/layout/Layout";
import AgentLayout from "./components/layout/AgentLayout";
import Dashboard from "./pages/Dashboard";
import ClientSearch from "./pages/ClientSearch";
import ClientDetails from "./pages/ClientDetails";
import AddClient from "./pages/AddClient";
import DocumentUpload from "./pages/DocumentUpload";
import Compliance from "./pages/Compliance";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import AgentSelector from "./pages/AgentSelector";
import ChatPage from "./pages/ChatPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            {/* New Agent Platform Routes */}
            <Route path="/" element={<AgentLayout />}>
              <Route index element={<Navigate to="/agents" replace />} />
              <Route path="agents" element={<AgentSelector />} />
              <Route path="chat" element={<Navigate to="/chat/kyc" replace />} />
              <Route path="chat/:agentId" element={<ChatPage />} />
            </Route>

            {/* Legacy KYC Application Routes */}
            <Route path="/kyc" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="clients" element={<ClientSearch />} />
              <Route path="clients/add" element={<AddClient />} />
              <Route path="clients/:id" element={<ClientDetails />} />
              <Route path="documents/:clientId" element={<DocumentUpload />} />
              <Route path="compliance/:clientId" element={<Compliance />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
