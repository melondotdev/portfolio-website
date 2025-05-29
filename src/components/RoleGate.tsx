'use client';

import { supabase } from '@/lib/config/client-supabase';
import { useSession } from '@/lib/providers/SessionProvider';
import type { UserRole } from '@/middleware';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

interface RoleGateProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

export default function RoleGate({
  children,
  allowedRoles,
  fallback = null,
}: RoleGateProps) {
  const { user, loading } = useSession();
  const [userRole, setUserRole] = useState<UserRole | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setUserRole(undefined);
        } else {
          setUserRole(profile?.role as UserRole);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(undefined);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserRole();
  }, [user]);

  // Show loading state or fallback while loading
  if (loading || isLoading) {
    return <>{fallback}</>;
  }

  // If no user role or role not in allowed roles, show fallback
  if (!userRole || !allowedRoles.includes(userRole)) {
    console.log('RoleGate - Access Denied:', { userRole, allowedRoles });
    return <>{fallback}</>;
  }

  // User has required role, show children
  return <>{children}</>;
}
