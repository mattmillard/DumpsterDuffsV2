// Admin-specific types and interfaces

export type AdminRole = "owner" | "admin" | "dispatcher";

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export interface AdminContextType {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  hasPermission: (action: string) => boolean;
}

export type DashboardMetrics = {
  total_bookings_today: number;
  total_bookings_this_month: number;
  pending_payments: number;
  pending_deliveries: number;
  completed_pickups: number;
  revenue_today: number;
  revenue_this_month: number;
  available_dumpsters: number;
};

export interface DashboardAlert {
  id: string;
  type: "warning" | "error" | "info" | "success";
  message: string;
  action?: string;
  action_link?: string;
  dismissable: boolean;
}

export interface AdminNavItem {
  name: string;
  href: string;
  icon: string; // Icon name or path
  badge?: number;
  requiredRole?: AdminRole[];
}
