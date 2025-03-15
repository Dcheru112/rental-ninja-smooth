
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Phone, User, Mail } from "lucide-react";
import type { AdminUser } from "../types/adminTypes";

interface UserDetailsDialogProps {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserDetailsDialog = ({ user, open, onOpenChange }: UserDetailsDialogProps) => {
  if (!user) return null;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Detailed information about {user.full_name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <h4 className="font-medium">{user.full_name}</h4>
              {user.email && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span>{user.email}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Status</p>
              <Badge className={getStatusColor(user.status)}>
                {user.status}
              </Badge>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Role</p>
              <p className="text-sm capitalize">{user.role || "User"}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Joined</p>
              <div className="flex items-center gap-1 text-sm">
                <CalendarDays className="h-3 w-3" />
                {new Date(user.created_at).toLocaleDateString()}
              </div>
            </div>
            
            {user.last_sign_in_at && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Last Login</p>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-3 w-3" />
                  {new Date(user.last_sign_in_at).toLocaleString()}
                </div>
              </div>
            )}
          </div>
          
          {user.phone_number && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Contact</p>
              <div className="flex items-center gap-1 text-sm">
                <Phone className="h-3 w-3" />
                {user.phone_number}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;
