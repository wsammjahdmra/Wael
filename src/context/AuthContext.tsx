import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, UserRole, Organization } from '../types/database';
import { PermissionKey, roleHasPermission } from '../types/permissions';
import { api } from '../services/api';

interface AuthContextType {
  user: UserAccount | null;
  organization: Organization | null;
  role: UserRole;
  loading: boolean;
  switchRole: (role: UserRole, userId?: string) => Promise<void>;
  login: (credentials: { identifier?: string; email?: string; phone?: string; password?: string }) => Promise<{ success: boolean; message: string }>;
  register: (payload: {
    fullName: string;
    phone: string;
    email: string;
    password: string;
    role?: string;
    falLicenseNumber?: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  forgotPassword: (contact: string) => Promise<{ success: boolean; message: string; simulatedOtp?: string }>;
  resetPassword: (payload: { contact: string; otp: string; newPassword: string }) => Promise<{ success: boolean; message: string }>;
  refreshUser: () => Promise<void>;
  hasPermission: (permission: PermissionKey) => boolean;

  // Visitor Gate & Auth Modal State
  visitorGateOpen: boolean;
  visitorGateAction: string;
  openVisitorGate: (intendedAction?: string) => void;
  closeVisitorGate: () => void;
  authModalOpen: boolean;
  authModalTab: 'login' | 'register' | 'forgot';
  openAuthModal: (tab?: 'login' | 'register' | 'forgot') => void;
  closeAuthModal: () => void;

  // Convenient capability flags
  canCreateAd: boolean;
  canModerate: boolean;
  canManageOrg: boolean;
  canAccessFinance: boolean;
  canAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  organization: null,
  role: 'visitor',
  loading: true,
  switchRole: async () => {},
  login: async () => ({ success: false, message: '' }),
  register: async () => ({ success: false, message: '' }),
  logout: async () => {},
  forgotPassword: async () => ({ success: false, message: '' }),
  resetPassword: async () => ({ success: false, message: '' }),
  refreshUser: async () => {},
  hasPermission: () => false,

  visitorGateOpen: false,
  visitorGateAction: '',
  openVisitorGate: () => {},
  closeVisitorGate: () => {},
  authModalOpen: false,
  authModalTab: 'login',
  openAuthModal: () => {},
  closeAuthModal: () => {},

  canCreateAd: false,
  canModerate: false,
  canManageOrg: false,
  canAccessFinance: false,
  canAdmin: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [visitorGateOpen, setVisitorGateOpen] = useState(false);
  const [visitorGateAction, setVisitorGateAction] = useState('هذا الإجراء');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot'>('login');

  const openVisitorGate = (intendedAction: string = 'هذا الإجراء') => {
    setVisitorGateAction(intendedAction);
    setVisitorGateOpen(true);
  };

  const closeVisitorGate = () => {
    setVisitorGateOpen(false);
  };

  const openAuthModal = (tab: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        setOrganization(res.organization || null);
      }
    } catch (err) {
      console.warn('Could not load current user session, falling back to visitor:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const switchRole = async (targetRole: UserRole, targetUserId?: string) => {
    setLoading(true);
    try {
      const res = await api.switchRole(targetRole, targetUserId);
      if (res.success && res.user) {
        setUser(res.user);
        const meRes = await api.getMe();
        setOrganization(meRes.organization || null);
      }
    } catch (err) {
      console.error('Failed to switch role:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: { identifier?: string; email?: string; phone?: string; password?: string }) => {
    setLoading(true);
    try {
      const res = await api.login(credentials);
      if (res.success && res.user) {
        setUser(res.user);
        const meRes = await api.getMe();
        setOrganization(meRes.organization || null);
        return { success: true, message: res.message || 'تم تسجيل الدخول بنجاح' };
      }
      return { success: false, message: res.message || 'تعذر تسجيل الدخول' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'خطأ أثناء تسجيل الدخول' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: {
    fullName: string;
    phone: string;
    email: string;
    password: string;
    role?: string;
    falLicenseNumber?: string;
  }) => {
    setLoading(true);
    try {
      const res = await api.register(payload);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true, message: res.message || 'تم إنشاء الحساب بنجاح' };
      }
      return { success: false, message: res.message || 'تعذر إنشاء الحساب' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'خطأ أثناء إنشاء الحساب' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.warn('Logout network error:', err);
    }
    setUser({
      id: 'usr_guest',
      fullName: 'زائر غير مسجل',
      phone: '',
      email: '',
      role: 'visitor',
      status: 'active',
      createdAt: '',
      updatedAt: '',
    });
    setOrganization(null);
  };

  const forgotPassword = async (contact: string) => {
    try {
      return await api.forgotPassword(contact);
    } catch (err: any) {
      return { success: false, message: err?.message || 'فشل إرسال رمز التحقق' };
    }
  };

  const resetPassword = async (payload: { contact: string; otp: string; newPassword: string }) => {
    try {
      return await api.resetPassword(payload);
    } catch (err: any) {
      return { success: false, message: err?.message || 'فشل إعادة تعيين كلمة المرور' };
    }
  };

  const role: UserRole = user?.role || 'visitor';

  const hasPermission = (permission: PermissionKey) => {
    return roleHasPermission(role, permission);
  };

  const canCreateAd = ['individual_advertiser', 'org_manager', 'authorized_broker', 'system_admin'].includes(role);
  const canModerate = ['content_moderator', 'compliance_officer', 'system_admin'].includes(role);
  const canManageOrg = ['org_manager', 'system_admin'].includes(role);
  const canAccessFinance = ['financial_officer', 'system_admin'].includes(role);
  const canAdmin = role === 'system_admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        role,
        loading,
        switchRole,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        refreshUser,
        hasPermission,
        visitorGateOpen,
        visitorGateAction,
        openVisitorGate,
        closeVisitorGate,
        authModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        canCreateAd,
        canModerate,
        canManageOrg,
        canAccessFinance,
        canAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
