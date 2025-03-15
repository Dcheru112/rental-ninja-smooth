
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock } from "lucide-react";
import type { UserListProps } from "../types/adminTypes";

const UserList = ({ users, onUpdateStatus }: UserListProps) => {
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
              <Label htmlFor={`status-${user.id}`} className="sr-only">
                Status
              </Label>
              <Select
                value={user.status || "active"}
                onValueChange={(value) => onUpdateStatus(user.id, value)}
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
  );
};

export default UserList;
