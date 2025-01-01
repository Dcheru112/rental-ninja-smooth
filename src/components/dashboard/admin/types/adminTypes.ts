import { User as AuthUser } from '@supabase/supabase-js';

export interface AdminUser {
  id: string;
  email: string | null;
  full_name: string;
  phone_number: string | null;
  role: string;
  created_at: string;
  last_sign_in_at: string | null;
}

export interface UserListProps {
  users: AdminUser[];
  onUpdateRole: (userId: string, newRole: string) => Promise<void>;
}

export interface UserFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterRole: string | null;
  onFilterChange: (value: string | null) => void;
  onRefresh: () => void;
  loading: boolean;
}