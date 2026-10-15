import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Search,
  Filter,
  ArrowRight,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Eye,
  Building2,
  Briefcase,
  Headphones,
  DollarSign,
  Settings,
  HelpCircle,
  FileCheck2,
  Trash2,
  ExternalLink,
  ChevronDown,
  Info,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { UserAccount, UserRole, AccountStatus } from '../types/database';
import {
  ROLE_METADATA,
  ROLE_PERMISSIONS_MATRIX,
  PERMISSION_DEFINITIONS,
  PermissionKey,
  roleHasPermission,
} from '../types/permissions';

interface AdminUsersPageProps {
  onBack: () => void;
}

export const AdminUsersPage: React.FC<AdminUsersPageProps> = ({ onBack }) => {
  const { user: currentUser, switchRole } = useAuth();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'matrix' | 'roles'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Edit Role Modal State
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [targetRole, setTargetRole] = useState<UserRole>('registered_user');
  const [roleChangeReason, setRoleChangeReason] = useState('');
  const [savingRole, setSavingRole] = useState(false);

  // Add User Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserFullName, setNewUserFullName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('content_moderator');
  const [newUserFalLicense, setNewUserFalLicense] = useState('');
  const [isSubmittingNewUser, setIsSubmittingNewUser] = useState(false);

  // Status Toggle Modal State
  const [statusUser, setStatusUser] = useState<UserAccount | null>(null);
  const [statusReason, setStatusReason] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  // Matrix category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminUsers();
      if (res.success && res.users) {
        setUsers(res.users);
      }
    } catch (err: any) {
      console.error(err);
      setNotification({
        type: 'error',
        message: err.message || 'تعذر تحميل قائمة المستخدمين',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async () => {
    if (!editingUser) return;
    setSavingRole(true);
    try {
      const res = await api.updateUserRole(editingUser.id, targetRole, roleChangeReason);
      if (res.success && res.user) {
        setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? res.user : u)));
        setNotification({
          type: 'success',
          message: `تم ترقية وتحديث دور (${editingUser.fullName}) إلى: ${ROLE_METADATA[targetRole].title}`,
        });
        setEditingUser(null);
        setRoleChangeReason('');
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'فشل تحديث الدور' });
    } finally {
      setSavingRole(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!statusUser) return;
    setSavingStatus(true);
    const newStatus: AccountStatus = statusUser.status === 'active' ? 'suspended' : 'active';
    try {
      const res = await api.updateUserStatus(statusUser.id, newStatus, statusReason);
      if (res.success && res.user) {
        setUsers((prev) => prev.map((u) => (u.id === statusUser.id ? res.user : u)));
        setNotification({
          type: 'success',
          message: `تم ${newStatus === 'active' ? 'تنشيط' : 'تجميد'} حساب (${statusUser.fullName}) بنجاح`,
        });
        setStatusUser(null);
        setStatusReason('');
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'فشل تعديل حالة الحساب' });
    } finally {
      setSavingStatus(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserFullName || !newUserPhone || !newUserEmail) return;

    setIsSubmittingNewUser(true);
    try {
      const res = await api.createUser({
        fullName: newUserFullName,
        phone: newUserPhone,
        email: newUserEmail,
        role: newUserRole,
        falLicenseNumber: newUserFalLicense || undefined,
      });

      if (res.success && res.user) {
        setUsers((prev) => [res.user, ...prev]);
        setNotification({
          type: 'success',
          message: `تم إنشاء حساب (${res.user.fullName}) وتعيين دور: ${ROLE_METADATA[res.user.role].title}`,
        });
        setIsAddModalOpen(false);
        setNewUserFullName('');
        setNewUserEmail('');
        setNewUserPhone('');
        setNewUserFalLicense('');
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'تعذر إنشاء الحساب' });
    } finally {
      setIsSubmittingNewUser(false);
    }
  };

  const handleDeleteUser = async (userToDelete: UserAccount) => {
    if (!confirm(`هل أنت متأكد من رغبتك في حذف حساب (${userToDelete.fullName}) نهائياً؟`)) return;

    try {
      const res = await api.deleteUser(userToDelete.id);
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
        setNotification({
          type: 'success',
          message: `تم حذف حساب (${userToDelete.fullName}) بنجاح`,
        });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'تعذر حذف الحساب' });
    }
  };

  const handleSimulateUser = async (userToSimulate: UserAccount) => {
    try {
      await switchRole(userToSimulate.role, userToSimulate.id);
      setNotification({
        type: 'success',
        message: `تم التبديل الآن لجلسة المستخدم: ${userToSimulate.fullName} (${ROLE_METADATA[userToSimulate.role].title})`,
      });
    } catch (err: any) {
      setNotification({ type: 'error', message: 'فشل التبديل' });
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery) ||
      (u.falLicenseNumber && u.falLicenseNumber.includes(searchQuery));

    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    const matchesStatus = selectedStatusFilter === 'all' || u.status === selectedStatusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const staffCount = users.filter((u) =>
    ['system_admin', 'content_moderator', 'compliance_officer', 'support_officer', 'financial_officer'].includes(u.role)
  ).length;

  const activeCount = users.filter((u) => u.status === 'active').length;
  const suspendedCount = users.filter((u) => u.status === 'suspended').length;

  // Filtered permissions definitions
  const filteredDefinitions =
    selectedCategory === 'all'
      ? PERMISSION_DEFINITIONS
      : PERMISSION_DEFINITIONS.filter((d) => d.category === selectedCategory);

  const allRolesList = Object.keys(ROLE_METADATA) as UserRole[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-right">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="العودة للوحة الإدارة"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold mb-1">
              <Shield className="w-4 h-4" />
              <span>نظام إدارة الصلاحيات والكوادر (RBAC Enterprise)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              المستخدمون والصلاحيات والأدوار النظامية
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              تحكم مركزي كامل في 10 أدوار تشغيلية معتمدة وفق متطلبات الرقابة والتراخيص العقارية
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 text-xs font-bold"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>تحديث</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة كادر أو مستخدم</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-sm animate-in fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-bold opacity-75 hover:opacity-100 underline"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">إجمالي الحسابات</div>
            <div className="text-xl font-black text-slate-900">{users.length}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">الكوادر الإدارية والرقابية</div>
            <div className="text-xl font-black text-purple-700">{staffCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">الحسابات النشطة</div>
            <div className="text-xl font-black text-emerald-700">{activeCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">الحسابات المجمدة</div>
            <div className="text-xl font-black text-rose-700">{suspendedCount}</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
            activeTab === 'users'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>إدارة حسابات المستخدمين ({filteredUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
            activeTab === 'matrix'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>مصفوفة الصلاحيات التفاعلية (Role Matrix)</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
            activeTab === 'roles'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>دليل وتفاصيل الأدوار العشرة</span>
        </button>
      </div>

      {/* Tab 1: Users List */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="بحث بالاسم، الجوال، البريد، رخصة فال..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Filter className="w-3.5 h-3.5" />
                <span>تصفية:</span>
              </div>

              {/* Role filter */}
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="all">كل الأدوار (10 أدوار)</option>
                {allRolesList.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_METADATA[r].title}
                  </option>
                ))}
              </select>

              {/* Status filter */}
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="all">كل الحالات</option>
                <option value="active">نشط فقط</option>
                <option value="suspended">مجمد فقط</option>
                <option value="pending_verification">قيد التدقيق</option>
              </select>
            </div>
          </div>

          {/* Table / List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
                <span className="text-xs">جاري تحميل بيانات المستخدمين وسجلات الصلاحيات...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <Users className="w-10 h-10 text-slate-300 mx-auto" />
                <div className="font-bold text-sm">لا توجد حسابات مطابقة للبحث أو التصفية</div>
                <div className="text-xs text-slate-400">جرب تعديل كلمة البحث أو فلتر الدور</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold">
                    <tr>
                      <th className="py-3 px-4">المستخدم</th>
                      <th className="py-3 px-4">الدور النظامي الحالي</th>
                      <th className="py-3 px-4">حالة الحساب</th>
                      <th className="py-3 px-4">الترخيص / الهوية</th>
                      <th className="py-3 px-4">تاريخ التسجيل</th>
                      <th className="py-3 px-4 text-center">إجراءات الصلاحيات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => {
                      const roleMeta = ROLE_METADATA[u.role] || ROLE_METADATA.registered_user;
                      const isSelf = currentUser?.id === u.id;

                      return (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition">
                          {/* User info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                                alt={u.fullName}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 flex-shrink-0"
                              />
                              <div>
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <span>{u.fullName}</span>
                                  {isSelf && (
                                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                      أنت (الجلسة الحالية)
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                  {u.email} • {u.phone}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Role Badge */}
                          <td className="py-3.5 px-4">
                            <div className="inline-flex items-center gap-1.5">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${roleMeta.badgeColor} ${roleMeta.badgeBorder}`}
                              >
                                {roleMeta.title}
                              </span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            {u.status === 'active' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>نشط</span>
                              </span>
                            ) : u.status === 'suspended' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                <AlertCircle className="w-3 h-3" />
                                <span>مجمد</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <span>قيد التدقيق</span>
                              </span>
                            )}
                          </td>

                          {/* License / ID */}
                          <td className="py-3.5 px-4">
                            {u.falLicenseNumber ? (
                              <div className="font-mono text-emerald-800 bg-emerald-50/70 border border-emerald-100 px-2 py-0.5 rounded-md inline-block">
                                فال: {u.falLicenseNumber}
                              </div>
                            ) : (
                              <span className="text-slate-400 font-mono text-[11px]">
                                {u.nationalIdMasked || 'حساب فردي'}
                              </span>
                            )}
                          </td>

                          {/* Created */}
                          <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString('ar-SA') : '—'}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Edit Role Button */}
                              <button
                                onClick={() => {
                                  setEditingUser(u);
                                  setTargetRole(u.role);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold transition flex items-center gap-1 text-[11px]"
                                title="تعديل الدور والصلاحيات"
                              >
                                <KeyRound className="w-3.5 h-3.5" />
                                <span>تعديل الدور</span>
                              </button>

                              {/* Toggle Status Button */}
                              <button
                                onClick={() => setStatusUser(u)}
                                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                                  u.status === 'active'
                                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                                }`}
                                title={u.status === 'active' ? 'تجميد الحساب' : 'إعادة التنشيط'}
                              >
                                {u.status === 'active' ? (
                                  <>
                                    <UserX className="w-3.5 h-3.5" />
                                    <span>تجميد</span>
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-3.5 h-3.5" />
                                    <span>تنشيط</span>
                                  </>
                                )}
                              </button>

                              {/* Simulate user session */}
                              <button
                                onClick={() => handleSimulateUser(u)}
                                className="px-2 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition flex items-center gap-1 text-[11px]"
                                title="محاكاة جلسة هذا المستخدم لاختبار الواجهات"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>محاكاة</span>
                              </button>

                              {/* Delete (admin only, cannot delete self) */}
                              {!isSelf && (
                                <button
                                  onClick={() => handleDeleteUser(u)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                  title="حذف الحساب نهائياً"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Role Matrix */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 leading-relaxed">
              <strong className="font-bold">المصفوفة النظامية للصلاحيات وقواعد التحكم بالوصول:</strong> تم تصميم
              هذه المصفوفة لتعكس الامتثال الصارم للضوابط العقارية ولوائح النشر والوساطة. كل دور في النظام مقيد
              بالصلاحيات المحددة، ويتم تطبيق هذه القواعد خادمياً (Server-Authoritative Enforcement) مع توثيق كل
              حدث في سجل التدقيق الإداري.
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-600 ml-1">تصفية حسب المجال:</span>
            {[
              { id: 'all', label: 'الكل (كل الصلاحيات)' },
              { id: 'listings', label: 'العقارات والإعلانات' },
              { id: 'org', label: 'المنشآت والوساطة' },
              { id: 'users', label: 'المستخدمون والـ RBAC' },
              { id: 'reports', label: 'الرقابة والبلاغات' },
              { id: 'compliance', label: 'الامتثال والتراخيص' },
              { id: 'support', label: 'الدعم الفني' },
              { id: 'finance', label: 'المالية والفواتير' },
              { id: 'system', label: 'إدارة النظام وقاعدة البيانات' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Big Matrix Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="py-3 px-4 min-w-[220px]">الصلاحية والوظيفة</th>
                    {allRolesList.map((r) => {
                      const meta = ROLE_METADATA[r];
                      return (
                        <th
                          key={r}
                          className="py-3 px-2 text-center min-w-[90px] border-r border-slate-100 font-bold"
                          title={meta.description}
                        >
                          <div className="text-[11px] font-black text-slate-800">{meta.badge}</div>
                          <div className="text-[9px] text-slate-400 font-normal">مستوى {meta.level}</div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDefinitions.map((def) => (
                    <tr key={def.key} className="hover:bg-slate-50/70 transition">
                      <td className="py-2.5 px-4">
                        <div className="font-bold text-slate-900">{def.label}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{def.key}</div>
                      </td>
                      {allRolesList.map((r) => {
                        const hasPerm = roleHasPermission(r, def.key);
                        return (
                          <td
                            key={r}
                            className={`py-2.5 px-2 text-center border-r border-slate-100 ${
                              hasPerm ? 'bg-emerald-50/30' : ''
                            }`}
                          >
                            {hasPerm ? (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">
                                ✓
                              </span>
                            ) : (
                              <span className="text-slate-300 font-light text-sm">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: The 10 Roles Detailed Guide */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allRolesList.map((r) => {
            const meta = ROLE_METADATA[r];
            const permissionsCount = ROLE_PERMISSIONS_MATRIX[r]?.length || (r === 'system_admin' ? 'كاملة (100%)' : 0);

            return (
              <div
                key={r}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${meta.badgeColor} ${meta.badgeBorder}`}
                    >
                      {meta.title}
                    </span>
                    <span className="text-xs text-slate-400 font-mono font-bold">المستوى: {meta.level} / 10</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">{meta.description}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                    <div className="text-slate-500">
                      <strong>شخصية المحاكاة النموذجية:</strong> {meta.typicalPersona}
                    </div>
                    <div className="text-slate-500">
                      <strong>عدد الصلاحيات الممنوحة:</strong>{' '}
                      <span className="font-bold text-slate-800">{permissionsCount}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => switchRole(r)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" />
                    <span>تجربة المنصة فوراً بهذا الدور</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Edit User Role */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  تعديل دور وصلاحيات المستخدم
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  المستخدم: <strong>{editingUser.fullName}</strong> ({editingUser.email})
                </p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  اختر الدور الجديد من الأدوار العشرة النظامية:
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value as UserRole)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {allRolesList.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_METADATA[r].title} — (مستوى {ROLE_METADATA[r].level})
                    </option>
                  ))}
                </select>
              </div>

              {/* Role preview card */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-800">
                  {ROLE_METADATA[targetRole].title}
                </div>
                <div className="text-slate-500 text-[11px] leading-relaxed">
                  {ROLE_METADATA[targetRole].description}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  سبب الترقية أو النقل (يوثق في سجل التدقيق المحمي):
                </label>
                <input
                  type="text"
                  placeholder="مثال: ترقية إلى وسيط معتمد بعد اجتياز رخصة فال / تكليف بالرقابة..."
                  value={roleChangeReason}
                  onChange={(e) => setRoleChangeReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                إلغاء
              </button>
              <button
                onClick={handleUpdateRole}
                disabled={savingRole}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
              >
                {savingRole && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>حفظ الدور الجديد وتوثيق الإجراء</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Toggle User Status */}
      {statusUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-right">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  statusUser.status === 'active' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                }`}
              >
                {statusUser.status === 'active' ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  {statusUser.status === 'active' ? 'تجميد حساب المستخدم' : 'إعادة تنشيط الحساب'}
                </h3>
                <p className="text-xs text-slate-500">{statusUser.fullName}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {statusUser.status === 'active'
                ? 'تجميد الحساب سيمنع المستخدم فوراً من تسجيل الدخول أو نشر الإعلانات أو التعامل مع المنصة حتى يتم رفع التجميد.'
                : 'سيتم إعادة تفعيل الحساب فوراً وتمكين المستخدم من استئناف نشاطه.'}
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">سبب الإجراء (إلزامي للرقابة):</label>
              <input
                type="text"
                placeholder="سبب التجميد أو التنشيط..."
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setStatusUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                إلغاء
              </button>
              <button
                onClick={handleToggleStatus}
                disabled={savingStatus}
                className={`px-5 py-2 rounded-xl text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 ${
                  statusUser.status === 'active' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {savingStatus && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>تأكيد الإجراء</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Staff or User */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  إضافة كادر وظيفي أو مستخدم جديد
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  تسجيل حساب جديد وتعيين دوره وصلاحياته في النظام
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">الاسم الكامل:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: يحيى بن محمد الصعدي"
                  value={newUserFullName}
                  onChange={(e) => setNewUserFullName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">البريد الإلكتروني:</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">رقم الهاتف:</label>
                  <input
                    type="tel"
                    required
                    placeholder="+967 77 1234567"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الدور المخصص في النظام:</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {allRolesList.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_METADATA[r].title} (مستوى {ROLE_METADATA[r].level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">رقم ترخيص فال / رخصة الوساطة (اختياري):</label>
                <input
                  type="text"
                  placeholder="مثال: 1200055412"
                  value={newUserFalLicense}
                  onChange={(e) => setNewUserFalLicense(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNewUser}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs flex items-center gap-1.5"
                >
                  {isSubmittingNewUser && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>إنشاء الحساب وتفعيل الصلاحيات</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
