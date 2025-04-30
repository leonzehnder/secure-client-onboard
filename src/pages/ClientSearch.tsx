
import { useState } from 'react';
import { mockClients } from '../data/mockData';
import { Client } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Filter, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ClientSearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [filteredClients, setFilteredClients] = useState<Client[]>(mockClients);

  const applyFilters = () => {
    let results = [...mockClients];
    
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      results = results.filter(
        client => 
          client.firstName.toLowerCase().includes(lowerCaseSearch) || 
          client.lastName.toLowerCase().includes(lowerCaseSearch) || 
          client.id.toLowerCase().includes(lowerCaseSearch) ||
          client.email.toLowerCase().includes(lowerCaseSearch)
      );
    }
    
    if (statusFilter) {
      results = results.filter(client => client.status === statusFilter);
    }
    
    setFilteredClients(results);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setTimeout(() => {
      applyFilters();
    }, 0);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-banking-warning" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-banking-success" />;
      case 'flagged':
        return <AlertTriangle className="h-4 w-4 text-banking-danger" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="kyc-status-pending">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      case 'complete':
        return (
          <Badge variant="outline" className="kyc-status-complete">
            <CheckCircle className="h-3 w-3 mr-1" /> Complete
          </Badge>
        );
      case 'flagged':
        return (
          <Badge variant="outline" className="kyc-status-flagged">
            <AlertTriangle className="h-3 w-3 mr-1" /> Flagged
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleAddClient = () => {
    // This would be implemented in a real app
    console.log("Add new client");
  };

  const handleRowClick = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Client Search</h2>
        <Button onClick={handleAddClient}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Client
        </Button>
      </div>
      
      <Card className="p-4">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search by name, ID, or email" 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Search</Button>
        </form>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Nationality</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow 
                    key={client.id} 
                    onClick={() => handleRowClick(client.id)}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{client.id}</TableCell>
                    <TableCell>{client.firstName} {client.lastName}</TableCell>
                    <TableCell className="hidden md:table-cell">{client.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{client.nationality}</TableCell>
                    <TableCell>{getStatusBadge(client.status)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No clients found matching your search criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default ClientSearch;
