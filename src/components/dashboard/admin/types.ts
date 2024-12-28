export interface PropertyOwner {
  id: string;
  full_name: string;
  properties_count: number;
}

export interface Statistics {
  totalProperties: number;
  totalTenants: number;
  totalMaintenanceRequests: number;
  totalPayments: number;
  pendingMaintenanceRequests: number;
  occupancyRate: number;
}