import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, RefreshCw } from "lucide-react";
import type { UserFilterProps } from "../types/adminTypes";

const UserFilter = ({ 
  searchTerm, 
  onSearchChange, 
  filterRole, 
  onFilterChange, 
  onRefresh, 
  loading 
}: UserFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <Select
        value={filterRole || ""}
        onValueChange={(value) => onFilterChange(value || null)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="owner">Owner</SelectItem>
          <SelectItem value="tenant">Tenant</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="icon"
        onClick={onRefresh}
        disabled={loading}
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
};

export default UserFilter;