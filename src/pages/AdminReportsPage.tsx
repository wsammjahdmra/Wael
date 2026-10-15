import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api';
import { ReportCase } from '../types/database';

interface AdminReportsPageProps {
  onBack: () => void;
  onSelectListing: (id: string) => void;
}

export const AdminReportsPage: React.FC<AdminReportsPageProps> = ({ onBack, onSelectListing }) => {
  const [reports, setReports] = useState<ReportCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [resolvingReport, setResolvingReport] = useState<ReportCase | null>(null);
  const [resolutionStatus, setResolutionStatus] = useState<'closed' | 'escalated'>('closed');
  const [resolutionDecision, setResolutionDecision] = useState<'accept' | 'dismiss'>('accept');
  const [resolutionNote, setResolutionNote] = useState('');
  const [suspendListing, setSuspendListing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminReports();
      if (res.success && res.reports) {
        setReports(res.reports);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolve = async () => {
    if (!resolvingReport) return;
    setSubmitting(true);
    try {
      const res = await api.resolveReport(resolvingReport.id, {
        status: resolutionDecision === 'accept' ? 'closed' : 'closed',
        resolutionNote:
          resolutionNote ||
          (resolutionDecision === 'accept'
            ? 'تم قبول البلاغ واتخاذ الإجراء اللازم وإغلاق الحالة'
            : 'تم رفض وحفظ البلاغ لعدم كفاية الأدلة أو ثبوت عدم المخالفة'),
        suspendListing: resolutionDecision === 'accept' && suspendListing,
      });
      if (res.success) {
        setReports((prev) =>
          prev.map((r) => (r.id === resolvingReport.id ? res.report : r))
        );
        setResolvingReport(null);
        setResolutionNote('');
        setSuspendListing(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (selectedStatusFilter === 'all') return true;
    return r.status === selectedStatusFilter;
  });

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
            <div className="flex items-center gap-2 text-rose-700 text-xs font-bold mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>إدارة الرقابة والبلاغات والشكاوى</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              متابعة ومعالجة البلاغات العقارية
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              فحص بلاغات الإعلانات المخالفة أو النزاعات القانونية واتخاذ القرارات الإدارية المناسبة
            </p>
          </div>
        </div>

        <button
          onClick={fetchReports}
          disabled={loading}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 text-xs font-bold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>تحديث</span>
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-600">الحالة:</span>
        {['all', 'new', 'under_investigation', 'escalated', 'closed'].map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedStatusFilter === st
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {st === 'all' && 'الكل'}
            {st === 'new' && 'جديد'}
            {st === 'under_investigation' && 'قيد التحقيق'}
            {st === 'escalated' && 'مُصعّد'}
            {st === 'closed' && 'مُغلق'}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-rose-600" />
            <span className="text-xs">جاري تحميل البلاغات...</span>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <div className="font-bold text-sm">لا توجد بلاغات في هذه القائمة</div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredReports.map((r) => (
              <div key={r.id} className="p-5 hover:bg-slate-50/70 transition space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        r.status === 'new'
                          ? 'bg-rose-100 text-rose-800'
                          : r.status === 'under_investigation'
                          ? 'bg-amber-100 text-amber-800'
                          : r.status === 'escalated'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {r.status === 'new' && 'بلاغ جديد'}
                      {r.status === 'under_investigation' && 'قيد التحقيق'}
                      {r.status === 'escalated' && 'تم التصعيد'}
                      {r.status === 'closed' && 'مغلق'}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      #{r.referenceNo || r.id} — {r.reasonType}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(r.createdAt).toLocaleDateString('ar-SA')}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {r.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <div>
                    بيانات المُبلّغ: <strong>{r.reporterContact || 'مستخدم مسجل'}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {r.listingId && (
                      <button
                        onClick={() => onSelectListing(r.listingId!)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1 text-[11px]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>معاينة الإعلان</span>
                      </button>
                    )}

                    {r.status !== 'closed' && (
                      <button
                        onClick={() => {
                          setResolvingReport(r);
                          setResolutionDecision('accept');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1 text-[11px]"
                      >
                        <span>اتخاذ قرار ومعالجة</span>
                      </button>
                    )}
                  </div>
                </div>

                {r.resolutionNote && (
                  <div className="text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                    <strong>الإجراء المتخذ:</strong> {r.resolutionNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolve Modal */}
      {resolvingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-right">
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              معالجة واتخاذ قرار بالبلاغ
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">القرار:</label>
                <select
                  value={resolutionDecision}
                  onChange={(e) => setResolutionDecision(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="accept">قبول البلاغ واتخاذ الإجراء اللازم وإغلاق الحالة</option>
                  <option value="dismiss">رفض وحفظ البلاغ (بلاغ كيدي أو غير صحيح)</option>
                </select>
              </div>

              {resolutionDecision === 'accept' && resolvingReport.listingId && (
                <label className="flex items-center gap-2 p-2.5 bg-rose-50 rounded-xl border border-rose-100 text-rose-800 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={suspendListing}
                    onChange={(e) => setSuspendListing(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>إيقاف وتعليق الإعلان المخالف فوراً</span>
                </label>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">بيان القرار والتوجيه الإداري:</label>
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="اكتب التوجيه أو الإجراء المتخذ للتوثيق في السجل..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setResolvingReport(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                إلغاء
              </button>
              <button
                onClick={handleResolve}
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>توثيق القرار وإغلاق البلاغ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
