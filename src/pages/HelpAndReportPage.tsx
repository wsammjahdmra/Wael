import React, { useState } from 'react';
import {
  HelpCircle,
  AlertTriangle,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  RefreshCw,
  MessageSquare,
  FileQuestion,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';

export const HelpAndReportPage: React.FC = () => {
  const { settings } = useSettings();
  const [activeSection, setActiveSection] = useState<'support' | 'report' | 'faq'>('support');

  // Support ticket form
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketPriority, setTicketPriority] = useState('normal');
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // Report form
  const [reportListingId, setReportListingId] = useState('');
  const [reportReason, setReportReason] = useState('معلومات مضللة أو غير دقيقة');
  const [reportDescription, setReportDescription] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    setTicketSubmitting(true);
    try {
      const res = await api.createTicket({
        subject: ticketSubject,
        message: ticketMessage,
        priority: ticketPriority,
      });
      if (res.success) {
        setTicketSuccess(true);
        setTicketSubject('');
        setTicketMessage('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTicketSubmitting(false);
    }
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDescription) return;
    setReportSubmitting(true);
    try {
      const res = await api.createReport({
        listingId: reportListingId || undefined,
        reason: reportReason,
        description: reportDescription,
      });
      if (res.success) {
        setReportSuccess(true);
        setReportListingId('');
        setReportDescription('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReportSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'كيف يتم التحقق من تراخيص الإعلانات والوسطاء العقاريين؟',
      a: 'تلتزم المنصة بالربط الإلكتروني المباشر مع الهيئة للتحقق التلقائي من أرقام رخص فال والتفويضات العقارية قبل تفعيل أي إعلان.',
    },
    {
      q: 'ما هي خطوات توثيق حساب المنشأة العقارية؟',
      a: 'يتطلب توثيق حساب المنشأة تزويد رقم السجل التجاري ورخصة فال للمنشآت، ثم فحص الوثائق من قبل فريق الامتثال.',
    },
    {
      q: 'كيف يمكن استرداد مبالغ باقات الترويج؟',
      a: 'يمكن تقديم طلب استرداد خلال 48 ساعة من السداد في حال لم يتم تفعيل باقة الترويج، وتتم مراجعة الطلب من المسؤول المالي.',
    },
    {
      q: 'ما هي سياسة حماية بيانات العملاء والمستخدمين؟',
      a: 'تخضع كافة البيانات للتشفير التام، وتطبق المنصة نظام صلاحيات صارم (RBAC) يمنع أي وصول غير مصرح للمعلومات الشخصية.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-right">
      <div className="text-center space-y-2 pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-black text-slate-900 font-heading">
          مركز الدعم الفني والبلاغات
        </h1>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          فريق خدمة العملاء والامتثال متاح على مدار الساعة للإجابة على استفساراتكم والتعامل مع البلاغات باحترافية
        </p>

        {/* Quick Contact Chips */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3 text-xs">
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-full font-bold border border-emerald-100">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span dir="ltr">{settings.supportPhone}</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3.5 py-1.5 rounded-full font-bold border border-blue-100">
            <Mail className="w-4 h-4 text-blue-600" />
            <span>{settings.supportEmail}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setActiveSection('support')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
            activeSection === 'support'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>فتح تذكرة دعم فني</span>
        </button>

        <button
          onClick={() => setActiveSection('report')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
            activeSection === 'report'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>تقديم بلاغ عن إعلان أو مخالفة</span>
        </button>

        <button
          onClick={() => setActiveSection('faq')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
            activeSection === 'faq'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <FileQuestion className="w-4 h-4" />
          <span>الأسئلة الشائعة (FAQ)</span>
        </button>
      </div>

      {/* Section 1: Support Ticket */}
      {activeSection === 'support' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-bold border-b border-slate-100 pb-3">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-sm">طلب مساعدة أو استفسار فني</span>
          </div>

          {ticketSuccess ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-sm text-emerald-900">تم إرسال تذكرتك بنجاح</h3>
              <p className="text-emerald-700 text-xs">
                تم تسجيل طلبك برقم متابعة وسيقوم ممثل خدمة العملاء بالرد عليك في أقرب وقت.
              </p>
              <button
                onClick={() => setTicketSuccess(false)}
                className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold"
              >
                إرسال استفسار آخر
              </button>
            </div>
          ) : (
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان الموضوع أو الاستفسار:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: استفسار حول باقات الترويج العقاري / توثيق الترخيص..."
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">مستوى الأهمية:</label>
                <select
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="normal">عادية (استفسار عام)</option>
                  <option value="high">متوسطة (مشكلة في النشر أو السداد)</option>
                  <option value="urgent">عاجلة (حساب متوقف أو بلاغ فوري)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">تفاصيل الرسالة أو المشكلة:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="يرجى كتابة التفاصيل بدقة لتمكين فريق الدعم من مساعدتك..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={ticketSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs flex items-center gap-2 transition"
                >
                  {ticketSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>إرسال التذكرة لفريق الدعم</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Section 2: Report Violation */}
      {activeSection === 'report' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 text-rose-800 font-bold border-b border-slate-100 pb-3">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span className="text-sm">تقديم بلاغ رقابي عن إعلان مخالف</span>
          </div>

          {reportSuccess ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-sm text-emerald-900">تم استلام البلاغ وتحويله للرقابة</h3>
              <p className="text-emerald-700 text-xs">
                يقوم مشرفو الامتثال بمراجعة الإعلانات المبلغ عنها بدقة لحماية حقوق الجميع.
              </p>
              <button
                onClick={() => setReportSuccess(false)}
                className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold"
              >
                تقديم بلاغ آخر
              </button>
            </div>
          ) : (
            <form onSubmit={handleCreateReport} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">رقم الإعلان أو الرابط (إن وجد):</label>
                <input
                  type="text"
                  placeholder="مثال: lst_1 أو رقم الإعلان"
                  value={reportListingId}
                  onChange={(e) => setReportListingId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">نوع المخالفة:</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="معلومات مضللة أو غير دقيقة">معلومات مضللة أو غير دقيقة</option>
                  <option value="مخالفة ضوابط ترخيص الإعلانات العقارية">مخالفة ضوابط ترخيص الإعلانات العقارية</option>
                  <option value="استخدام صور بدون إذن المالك">استخدام صور بدون إذن المالك</option>
                  <option value="العقار مباع أو غير متاح">العقار مباع أو غير متاح</option>
                  <option value="احتيال أو محتوى مشبوه">احتيال أو محتوى مشبوه</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">شرح المخالفة بالتفصيل:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="صف بدقة ما لاحظته في الإعلان المخالف لمساعدة المحققين..."
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={reportSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs flex items-center gap-2 transition"
                >
                  {reportSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>إرسال البلاغ للجنة الرقابة</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Section 3: FAQ */}
      {activeSection === 'faq' && (
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pr-6">{faq.a}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
