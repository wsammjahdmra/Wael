import React, { useState, useEffect } from 'react';
import {
  Database,
  Server,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Download,
  Terminal,
  Play,
  Layers,
  Cpu,
  KeyRound,
  HardDrive,
  Copy,
  Check,
  Code2,
  Table,
  Zap,
} from 'lucide-react';
import { api } from '../services/api';

interface MySQLDatabasePageProps {
  onBack: () => void;
}

export const MySQLDatabasePage: React.FC<MySQLDatabasePageProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [dbState, setDbState] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Connection settings state
  const [host, setHost] = useState('127.0.0.1');
  const [port, setPort] = useState('3306');
  const [user, setUser] = useState('root');
  const [password, setPassword] = useState('');
  const [database, setDatabase] = useState('almahdi_realestate');

  // Query runner state
  const [sqlQuery, setSqlQuery] = useState('SELECT id, title, city, price, currency FROM properties LIMIT 5;');
  const [queryResult, setQueryResult] = useState<{ fields?: string[]; rows?: any[]; message?: string } | null>(null);
  const [queryRunning, setQueryRunning] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // Active section tab
  const [activeTab, setActiveTab] = useState<'config' | 'guide' | 'tables' | 'query'>('config');

  const loadStatus = async () => {
    setLoading(true);
    try {
      const res = await api.getDatabaseStatus();
      if (res.success) {
        setDbState(res);
        if (res.mysql?.config) {
          setHost(res.mysql.config.host || '127.0.0.1');
          setPort(String(res.mysql.config.port || 3306));
          setUser(res.mysql.config.user || 'root');
          setDatabase(res.mysql.config.database || 'almahdi_realestate');
        }
      }
    } catch (err: any) {
      console.error('Error fetching database status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleTestConnection = async () => {
    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await api.testDatabaseConnection({
        host,
        port: Number(port),
        user,
        password,
        database,
      });
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'فشل فحص الاتصال' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await api.updateDatabaseConfig({
        host,
        port: Number(port),
        user,
        password,
        database,
      });
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        loadStatus();
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'فشل حفظ إعدادات الاتصال' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleInitTables = async () => {
    if (!window.confirm('هل أنت متأكد من إنشاء وتهيئة جداول MySQL الآن؟')) return;
    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await api.initDatabaseTables();
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        loadStatus();
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'فشل تهيئة الجداول' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSeedData = async () => {
    if (!window.confirm('هل ترغب في استيراد بيانات عقارات ومستخدمي منصة المهدي آل عمران الأولية في MySQL؟')) return;
    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await api.seedDatabaseTables();
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        loadStatus();
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'فشل استيراد البيانات' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadSQL = () => {
    window.open('/api/v1/database/export-sql', '_blank');
  };

  const handleExecuteQuery = async (queryToRun?: string) => {
    const q = queryToRun || sqlQuery;
    if (!q.trim()) return;
    setQueryRunning(true);
    try {
      const res = await api.executeDatabaseQuery(q);
      if (res.success) {
        setQueryResult(res);
      } else {
        setQueryResult({ message: res.message || 'خطأ أثناء تنفيذ الاستعلام' });
      }
    } catch (err: any) {
      setQueryResult({ message: err.message || 'خطأ في الاتصال بقاعدة البيانات' });
    } finally {
      setQueryRunning(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const isConnected = dbState?.mysql?.connected;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-right font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold mb-1">
            <Database className="w-4 h-4" />
            <span>قواعد البيانات العلائقية — MySQL Local Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            إدارة وربط قاعدة بيانات MySQL المحلية
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ربط منصة «المهدي آل عمران للعقارات» مع خادم MySQL المحلي (XAMPP / Laragon / Docker) وتهيئة الجداول وتصدير ملفات SQL
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadStatus}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3.5 py-2.5 rounded-xl transition cursor-pointer"
            title="تحديث الحالة"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>تحديث</span>
          </button>

          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للإدارة</span>
          </button>
        </div>
      </div>

      {/* Real-time Status Card */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                  isConnected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {isConnected ? 'خادم MySQL متصل ويعمل بنجاح' : 'جاهز للربط المحلي (يعمل عبر الذاكرة المؤقتة للبيئة السحابية)'}
              </span>

              {dbState?.mysql?.version && (
                <span className="text-xs text-slate-400 bg-white/10 px-2.5 py-0.5 rounded-lg font-mono">
                  {dbState.mysql.version}
                </span>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold font-heading">
                قاعدة البيانات المستهدفة: <span className="text-indigo-400 font-mono">{database}</span>
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl mt-1">
                {isConnected
                  ? `تم الاتصال بنجاح بخادم MySQL المحلي على ${host}:${port}. زمن الاستجابة: ${dbState.mysql.latencyMs || 2}ms. عدد الجداول المهيأة: ${dbState.mysql.tablesCount || 0}.`
                  : 'التطبيق مصمم للتوافق المباشر مع خادم MySQL المحلي على جهازك (XAMPP، Laragon، أو Docker). يمكنك في أي وقت بدء خادم MySQL محلياً وتفعيل الاتصال.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadSQL}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-md transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>تحميل ملف SQL المتكامل (.sql)</span>
            </button>
          </div>
        </div>

        {/* In-Memory vs MySQL Stats */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-center">
          <div className="bg-white/5 p-3 rounded-2xl">
            <div className="text-[11px] text-slate-400">العقارات</div>
            <div className="text-lg font-black text-white font-mono">{dbState?.inMemoryStats?.properties || 12}</div>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl">
            <div className="text-[11px] text-slate-400">الإعلانات</div>
            <div className="text-lg font-black text-white font-mono">{dbState?.inMemoryStats?.listings || 12}</div>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl">
            <div className="text-[11px] text-slate-400">المستخدمين</div>
            <div className="text-lg font-black text-white font-mono">{dbState?.inMemoryStats?.users || 10}</div>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl">
            <div className="text-[11px] text-slate-400">الشركات</div>
            <div className="text-lg font-black text-white font-mono">{dbState?.inMemoryStats?.organizations || 2}</div>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl">
            <div className="text-[11px] text-slate-400">المشاريع</div>
            <div className="text-lg font-black text-white font-mono">{dbState?.inMemoryStats?.projects || 9}</div>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl">
            <div className="text-[11px] text-slate-400">الفواتير</div>
            <div className="text-lg font-black text-white font-mono">{dbState?.inMemoryStats?.invoices || 4}</div>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl">
            <div className="text-[11px] text-slate-400">سجل التدقيق</div>
            <div className="text-lg font-black text-white font-mono">{dbState?.inMemoryStats?.auditEvents || 15}</div>
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : feedback.type === 'error'
              ? 'bg-rose-50 text-rose-900 border border-rose-200'
              : 'bg-indigo-50 text-indigo-900 border border-indigo-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition ${
            activeTab === 'config' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>إعدادات الاتصال وفحص الخادم</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition ${
            activeTab === 'guide' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>دليل التشغيل المحلي (XAMPP / Laragon / Docker)</span>
        </button>

        <button
          onClick={() => setActiveTab('tables')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition ${
            activeTab === 'tables' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>تهيئة الجداول وتصدير البيانات</span>
        </button>

        <button
          onClick={() => setActiveTab('query')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition ${
            activeTab === 'query' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>محرر استعلامات SQL ومستكشف البيانات</span>
        </button>
      </div>

      {/* Tab 1: Configuration */}
      {activeTab === 'config' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-heading">
              بيانات الاتصال بخادم MySQL المحلي
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              القيم الافتراضية متوافقة تلقائياً مع خوادم XAMPP و Laragon الشائعة (Host: 127.0.0.1, Port: 3306, User: root, Password: فارغة)
            </p>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان المضيف (Host) *</label>
                <input
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-xs focus:outline-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">المنفذ (Port) *</label>
                <input
                  type="text"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-xs focus:outline-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم قاعدة البيانات (Database) *</label>
                <input
                  type="text"
                  value={database}
                  onChange={(e) => setDatabase(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-xs focus:outline-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم المستخدم (User) *</label>
                <input
                  type="text"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-xs focus:outline-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">كلمة المرور (Password)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="(فارغة في XAMPP الافتراضي)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-xs focus:outline-indigo-500"
                />
              </div>

              <div className="flex items-end">
                <div className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 flex items-center justify-between">
                  <span>ترميز الحروف:</span>
                  <span className="font-mono font-bold text-indigo-700">utf8mb4_unicode_ci</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={actionLoading}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-600" />
                <span>فحص الاتصال (Test Ping)</span>
              </button>

              <button
                type="submit"
                disabled={actionLoading}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>حفظ وتفعيل الاتصال</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Setup Guide */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          {/* CLI Guide */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
              <Terminal className="w-5 h-5" />
              <h2>الخطوات السريعة عبر سطر الأوامر (Terminal / CMD)</h2>
            </div>
            <p className="text-xs text-slate-500">
              يمكنك تشغيل هذه الأوامر مباشرة في مجلد المشروع لإنشاء قاعدة البيانات واستيراد كامل الجداول والبيانات اليمنية:
            </p>

            <div className="space-y-3">
              {/* Step 1 */}
              <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl relative font-mono text-xs">
                <div className="text-[11px] text-slate-400 mb-1"># 1. إنشاء قاعدة البيانات بترميز عربي كامل:</div>
                <code>mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS almahdi_realestate CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"</code>
                <button
                  onClick={() => copyToClipboard('mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS almahdi_realestate CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"', 'cmd1')}
                  className="absolute left-3 top-3 text-slate-400 hover:text-white transition"
                  title="نسخ"
                >
                  {copiedIndex === 'cmd1' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl relative font-mono text-xs">
                <div className="text-[11px] text-slate-400 mb-1"># 2. استيراد مخطط الجداول (Schema DDL):</div>
                <code>mysql -u root -p almahdi_realestate &lt; database/schema.sql</code>
                <button
                  onClick={() => copyToClipboard('mysql -u root -p almahdi_realestate < database/schema.sql', 'cmd2')}
                  className="absolute left-3 top-3 text-slate-400 hover:text-white transition"
                  title="نسخ"
                >
                  {copiedIndex === 'cmd2' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl relative font-mono text-xs">
                <div className="text-[11px] text-slate-400 mb-1"># 3. استيراد البيانات التجريبية الأولية (الريال اليمني وعقارات صنعاء وعدن):</div>
                <code>mysql -u root -p almahdi_realestate &lt; database/seed.sql</code>
                <button
                  onClick={() => copyToClipboard('mysql -u root -p almahdi_realestate < database/seed.sql', 'cmd3')}
                  className="absolute left-3 top-3 text-slate-400 hover:text-white transition"
                  title="نسخ"
                >
                  {copiedIndex === 'cmd3' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* XAMPP Guide */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <HardDrive className="w-5 h-5" />
              <h2>الربط عبر برنامج XAMPP / Laragon (واجهة phpMyAdmin)</h2>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700 leading-relaxed font-medium">
              <li>قم بتشغيل خادم **Apache** و **MySQL** من لوحة تحكم XAMPP.</li>
              <li>افتح المتصفح وانتقل إلى الرابط: <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-indigo-700">http://localhost/phpmyadmin</code></li>
              <li>اضغط على **New (جديد)** في القائمة الجانبية لإنشاء قاعدة بيانات جديدة.</li>
              <li>اكتب اسم القاعدة: <strong className="font-mono text-indigo-700">almahdi_realestate</strong> واختر الترميز <strong className="font-mono">utf8mb4_unicode_ci</strong> ثم اضغط **Create**.</li>
              <li>اضغط على تبويب **Import (استيراد)** ثم اختر الملف <code className="bg-slate-100 px-2 py-0.5 rounded font-mono">database/schema.sql</code> واضغط **Go (تنفيذ)**.</li>
              <li>كرر الخطوة مع الملف <code className="bg-slate-100 px-2 py-0.5 rounded font-mono">database/seed.sql</code> لاستيراد كافة العقارات والبيانات المعتمدة.</li>
            </ol>
          </div>

          {/* Docker Guide */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
              <Cpu className="w-5 h-5" />
              <h2>التشغيل عبر حاوية Docker (خيار المطورين)</h2>
            </div>
            <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl relative font-mono text-xs">
              <pre className="overflow-x-auto whitespace-pre">
{`docker run -d \\
  --name almahdi_mysql \\
  -p 3306:3306 \\
  -e MYSQL_ROOT_PASSWORD= \\
  -e MYSQL_ALLOW_EMPTY_PASSWORD=yes \\
  -e MYSQL_DATABASE=almahdi_realestate \\
  mysql:8.0 \\
  --character-set-server=utf8mb4 \\
  --collation-server=utf8mb4_unicode_ci`}
              </pre>
              <button
                onClick={() => copyToClipboard(`docker run -d --name almahdi_mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD= -e MYSQL_ALLOW_EMPTY_PASSWORD=yes -e MYSQL_DATABASE=almahdi_realestate mysql:8.0 --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci`, 'docker')}
                className="absolute left-3 top-3 text-slate-400 hover:text-white transition"
                title="نسخ"
              >
                {copiedIndex === 'docker' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Tables & Seed */}
      {activeTab === 'tables' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                إجراءات تهيئة وترحيل البيانات (Migrations & Seed)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                تطبيق المخطط البرمجي الكامل على قاعدة بيانات MySQL المتصلة وتعبئتها بالبيانات اليمنية
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleInitTables}
                disabled={actionLoading}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>إنشاء وتهيئة الجداول تلقائياً</span>
              </button>

              <button
                onClick={handleSeedData}
                disabled={actionLoading}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                <Database className="w-4 h-4" />
                <span>استيراد البيانات التجريبية</span>
              </button>
            </div>
          </div>

          {/* Tables Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            {[
              { name: 'properties', desc: 'جدول العقارات والمواصفات الميدانية والأسعار بالريال اليمني', count: '12 عقار' },
              { name: 'listings', desc: 'جدول الإعلانات العقارية النشطة وحالات الفحص والترخيص', count: '12 إعلان' },
              { name: 'users', desc: 'جدول الحسابات والأدوار الـ 10 (مدير النظام، معلن، وسيط...) ', count: '10 حسابات' },
              { name: 'organizations', desc: 'جدول المكاتب والشركات العقارية المرخصة والسجلات التجارية', count: '2 منشآت' },
              { name: 'projects', desc: 'جدول المشاريع السكنية والتجارية الكبرى ونسب الإنجاز', count: '9 مشاريع' },
              { name: 'invoices', desc: 'جدول الفواتير الضريبية وطلبات الشراء للباقات الترويجية', count: '4 فواتير' },
              { name: 'audit_events', desc: 'سجل التدقيق الإداري المحمي والموثق مع IP والتوقيت', count: '15 حدث' },
              { name: 'system_settings', desc: 'جدول إعدادات وهوية المنصة الرسمية وشعارها والاتصال', count: '1 صف' },
              { name: 'reports', desc: 'جدول البلاغات والشكاوى العقارية ومتابعة الإجراءات', count: '2 بلاغ' },
            ].map((tbl) => (
              <div key={tbl.name} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-indigo-700 text-xs">{tbl.name}</span>
                  <span className="text-[11px] font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-600">
                    {tbl.count}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{tbl.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: SQL Query Runner */}
      {activeTab === 'query' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                محرر استعلامات SQL ومستعرض الجداول المباشر
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                تشغيل أي استعلام SQL وتصفح السجلات والنتائج مباشرة
              </p>
            </div>

            {/* Shortcut query buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: 'عرض الجداول', sql: 'SHOW TABLES;' },
                { label: 'العقارات', sql: 'SELECT id, title, city, price, currency FROM properties LIMIT 5;' },
                { label: 'المستخدمون', sql: 'SELECT role, count(*) AS count FROM users GROUP BY role;' },
                { label: 'الشركات', sql: 'SELECT id, commercial_name, city, phone FROM organizations;' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setSqlQuery(item.sql);
                    handleExecuteQuery(item.sql);
                  }}
                  className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                rows={3}
                className="w-full bg-slate-900 text-emerald-300 p-4 rounded-2xl font-mono text-xs focus:outline-indigo-500 resize-none shadow-inner"
                dir="ltr"
                placeholder="SELECT * FROM properties;"
              />
              <button
                onClick={() => handleExecuteQuery()}
                disabled={queryRunning}
                className="absolute left-3 bottom-4 flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
              >
                <Play className={`w-3.5 h-3.5 ${queryRunning ? 'animate-spin' : ''}`} />
                <span>تنفيذ (Run SQL)</span>
              </button>
            </div>

            {/* Results Table */}
            {queryResult && (
              <div className="mt-4 space-y-2">
                {queryResult.message && (
                  <div className="p-3 bg-slate-100 text-slate-800 rounded-xl text-xs font-mono">
                    {queryResult.message}
                  </div>
                )}

                {queryResult.rows && queryResult.rows.length > 0 && (
                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          {queryResult.fields?.map((f) => (
                            <th key={f} className="px-4 py-2.5 font-mono text-slate-800">
                              {f}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {queryResult.rows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition">
                            {queryResult.fields?.map((f) => (
                              <td key={f} className="px-4 py-2.5 text-slate-700 font-mono text-[11px] whitespace-nowrap">
                                {typeof row[f] === 'object' ? JSON.stringify(row[f]) : String(row[f] ?? 'NULL')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
