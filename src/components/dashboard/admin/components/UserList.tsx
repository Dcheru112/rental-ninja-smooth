import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Info } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import type { UserListProps } from "../types/adminTypes";

const UserList = ({ users, onUpdateStatus, onViewDetails }: UserListProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{userId: string, status: string} | null>(null);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const handleStatusChange = (userId: string, newStatus: string) => {
    if (newStatus === "suspended") {
      setSelectedAction({ userId, status: newStatus });
      setConfirmOpen(true);
    } else {
      onUpdateStatus(userId, newStatus);
    }
  };

  const confirmStatusChange = () => {
    if (selectedAction) {
      onUpdateStatus(selectedAction.userId, selectedAction.status);
      setConfirmOpen(false);
      setSelectedAction(null);
    }
  };

  return (
    <>
      <ScrollArea className="h-[500px] rounded-lg border">
        <div className="p-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg mb-4 hover:bg-accent/5 transition-colors"
            >
              <div className="space-y-1 mb-2 md:mb-0">
                <h4 className="text-sm font-medium">{user.full_name}</h4>
                {user.email && (
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="h-3 w-3" />
                  <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                {user.last_sign_in_at && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Last sign in: {new Date(user.last_sign_in_at).toLocaleString()}</span>
                  </div>
                )}
                {user.phone_number && (
                  <p className="text-xs text-muted-foreground">
                    Phone: {user.phone_number}
                  </p>
                )}
                <div>
                  <Badge className={`${getStatusColor(user.status)} mt-1`}>
                    {user.status || "active"}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => onViewDetails(user)}
                >
                  <Info className="h-4 w-4 mr-1" />
                  <span>Details</span>
                </Button>
                
                <Label htmlFor={`status-${user.id}`} className="sr-only">
                  Status
                </Label>
                <Select
                  value={user.status || "active"}
                  onValueChange={(value) => handleStatusChange(user.id, value)}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend User Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend this user? They will not be able to login and will be notified to contact an administrator.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedAction(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange} className="bg-red-600 hover:bg-red-700">
              Suspend User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserList;
