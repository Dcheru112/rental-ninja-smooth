
export interface AdminUser {
  id: string;
  email: string | null;
  full_name: string;
  phone_number: string | null;
  role: string;
  created_at: string;
  last_sign_in_at: string | null;
  status: string;
}

export interface UserListProps {
  users: AdminUser[];
  onUpdateStatus: (userId: string, newStatus: string) => Promise<void>;
  onViewDetails: (user: AdminUser) => void;
}

export interface UserFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string | null;
  onFilterChange: (value: string | null) => void;
  onRefresh: () => void;
  loading: boolean;
}
