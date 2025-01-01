import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import type { UserListProps } from "../types/adminTypes";

const UserList = ({ users, onUpdateRole }: UserListProps) => {
  return (
    <ScrollArea className="h-[500px] rounded-md border">
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
              <p className="text-xs text-muted-foreground">
                Joined: {new Date(user.created_at).toLocaleDateString()}
              </p>
              {user.phone_number && (
                <p className="text-xs text-muted-foreground">
                  Phone: {user.phone_number}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor={`role-${user.id}`} className="sr-only">
                Role
              </Label>
              <Select
                value={user.role || "tenant"}
                onValueChange={(value) => onUpdateRole(user.id, value)}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="tenant">Tenant</SelectItem>
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