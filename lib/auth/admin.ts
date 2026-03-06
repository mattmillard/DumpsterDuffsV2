// Authentication utilities for admin section
import { supabase } from "@/lib/supabase/client";
import { AdminUser, AdminRole } from "@/types/admin";

/**
 * Get the current authenticated admin user
 */
export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return null;
    }

    // Fetch admin profile with role
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, is_active, created_at, last_login")
      .eq("user_id", session.user.id)
      .single();

    if (error || !profile) {
      return null;
    }

    // Check if user has admin role
    if (!["admin", "owner", "dispatcher"].includes(profile.role)) {
      return null; // Not an admin
    }

    return {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name || "",
      role: profile.role as AdminRole,
      is_active: profile.is_active,
      created_at: profile.created_at,
      last_login: profile.last_login,
    };
  } catch (error) {
    console.error("Error fetching admin user:", error);
    return null;
  }
}

/**
 * Check if user has specific permission
 */
export function checkPermission(
  userRole: AdminRole | string,
  requiredRole?: AdminRole[],
): boolean {
  if (!requiredRole || requiredRole.length === 0) {
    return true; // No role requirement
  }

  return requiredRole.includes(userRole as AdminRole);
}

/**
 * Admin login
 */
export async function adminLogin(
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Login failed. Please try again.",
    };
  }
}

/**
 * Admin logout
 */
export async function adminLogout(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Logout failed. Please try again.",
    };
  }
}

/**
 * Listen for auth state changes
 */
export function onAuthStateChange(callback: (user: AdminUser | null) => void) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async () => {
    const user = await getCurrentAdminUser();
    callback(user);
  });

  return subscription;
}

/**
 * Permissions matrix
 */
export const PERMISSIONS: Record<
  AdminRole,
  {
    canViewDashboard: boolean;
    canManageBookings: boolean;
    canManageInventory: boolean;
    canManagePricing: boolean;
    canManageZones: boolean;
    canManageUsers: boolean;
    canViewAnalytics: boolean;
  }
> = {
  owner: {
    canViewDashboard: true,
    canManageBookings: true,
    canManageInventory: true,
    canManagePricing: true,
    canManageZones: true,
    canManageUsers: true,
    canViewAnalytics: true,
  },
  admin: {
    canViewDashboard: true,
    canManageBookings: true,
    canManageInventory: true,
    canManagePricing: true,
    canManageZones: true,
    canManageUsers: false,
    canViewAnalytics: true,
  },
  dispatcher: {
    canViewDashboard: true,
    canManageBookings: true,
    canManageInventory: false,
    canManagePricing: false,
    canManageZones: false,
    canManageUsers: false,
    canViewAnalytics: false,
  },
};

/**
 * Check if user can perform action
 */
export function canUserPerformAction(
  role: AdminRole,
  action: keyof typeof PERMISSIONS.owner,
): boolean {
  return PERMISSIONS[role]?.[action] ?? false;
}
