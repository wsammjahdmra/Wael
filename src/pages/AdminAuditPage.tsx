import React, { useState, useEffect } from 'react';
import {
  History,
  Shield,
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Settings,
  DollarSign,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';
import { api } from '../services/api';

interface AdminAuditPageProps {
  onBack: () => void;
}

export const AdminAuditPage: React.FC<AdminAuditPageProps> = ({ onBack }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');

  const fetchAuditEvents = async () => {
    setLoading(true);
    try {
      const res = await api.getAuditEvents();
      if (res.success && res.events) {
        setEvents(res.events);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditEvents();
  }, []);

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.eventType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.ipAddress?.includes(searchQuery);

    const matchesType = selectedTypeFilter === 'all' || ev.eventType === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'USER_ROLE_CHANGED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">ترقية/تعديل دور</span>;
      case 'USER_STATUS_CHANGED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">تعديل حالة حساب</span>;
      case 'USER_CREATED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">إنشاء مستخدم</span>;
      case 'USER_DELETED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">حذف مستخدم</span>;
      case 'SETTINGS_UPDATED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">تحديث إعدادات</span>;
      case 'LISTING_APPROVED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">اعتماد إعلان</span>;
      case 'LISTING_REJECTED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">رفض إعلان</span>;
      case 'REFUND_APPROVED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">اعتماد استرداد</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">{type}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-right">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold mb-1">
              <Shield className="w-4 h-4" />
              <span>سجل التدقيق الإداري المحمي (Audit Log)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              سجل العمليات والرقابة الحساسة
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              سجل تاريخي غير قابل للتعديل يوثق جميع التعديلات على الصلاحيات وحسابات المستخدمين والقرارات الإدارية
            </p>
          </div>
        </div>

        <button
          onClick={fetchAuditEvents}
          disabled={loading}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 text-xs font-bold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>تحديث السجل</span>
        </button>
      </div>

      {/* Filter and search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="بحث بالفاعل، التفاصيل، الـ IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">كل أنواع الأحداث</option>
            <option value="USER_ROLE_CHANGED">ترقية/تعديل دور</option>
            <option value="USER_STATUS_CHANGED">تعديل حالة حساب</option>
            <option value="USER_CREATED">إنشاء مستخدم</option>
            <option value="SETTINGS_UPDATED">تحديث إعدادات</option>
            <option value="LISTING_APPROVED">اعتماد إعلان</option>
            <option value="LISTING_REJECTED">رفض إعلان</option>
            <option value="REFUND_APPROVED">اعتماد استرداد</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="text-xs">جاري تحميل سجل التدقيق...</span>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <History className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <div className="font-bold text-sm">لا توجد سجلات مطابقة</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold">
                <tr>
                  <th className="py-3 px-4">نوع الحدث</th>
                  <th className="py-3 px-4">تفاصيل العملية</th>
                  <th className="py-3 px-4">الفاعل (المشغل)</th>
                  <th className="py-3 px-4">عنوان IP</th>
                  <th className="py-3 px-4">التوقيت والزمن</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.map((ev, i) => (
                  <tr key={ev.id || i} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">{getEventBadge(ev.eventType)}</td>
                    <td className="py-3 px-4 font-medium text-slate-800 max-w-md">
                      {ev.details}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{ev.userName || 'النظام'}</div>
                      <div className="text-[10px] text-slate-400">{ev.userRole}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {ev.ipAddress || '127.0.0.1'}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {ev.timestamp ? new Date(ev.timestamp).toLocaleString('ar-SA') : 'الآن'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
