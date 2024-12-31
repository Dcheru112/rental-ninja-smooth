import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

interface TenantMaintenanceRequestProps {
  requests: MaintenanceRequest[];
  onRequestsUpdate: (updatedRequests: MaintenanceRequest[]) => void;
}

const TenantMaintenanceRequest = ({ 
  requests, 
  onRequestsUpdate 
}: TenantMaintenanceRequestProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const channel = supabase
      .channel('maintenance_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'maintenance_requests'
        },
        async (payload) => {
          console.log('Maintenance request updated:', payload);
          
          // Fetch updated requests
          const { data: updatedRequests, error } = await supabase
            .from('maintenance_requests')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching updated maintenance requests:', error);
            return;
          }

          onRequestsUpdate(updatedRequests);
          
          toast({
            title: "Maintenance Request Updated",
            description: "The status of your maintenance request has been updated.",
          });
        }
      )
      .subscribe();

    setLoading(false);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onRequestsUpdate, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div>Loading maintenance requests...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">{request.title}</TableCell>
              <TableCell>{request.description}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(request.status)}>
                  {request.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(request.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
          {requests.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No maintenance requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TenantMaintenanceRequest;