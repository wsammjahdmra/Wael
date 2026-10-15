import React, { useState } from 'react';
import {
  X,
  LogIn,
  UserPlus,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  User,
  Building,
  Briefcase,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { UserRole } from '../types/database';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authModalTab, openAuthModal, closeAuthModal, login, register, forgotPassword, resetPassword } =
    useAuth();
  const { settings } = useSettings();

  // Active sub-tab
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(authModalTab || 'login');

  // Sync with context prop when opened
  React.useEffect(() => {
    if (authModalTab) {
      setTab(authModalTab);
    }
  }, [authModalTab]);

  // Form states - Login
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form states - Register
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('registered_user');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regFalLicense, setRegFalLicense] = useState('');
  const [regAgreeTerms, setRegAgreeTerms] = useState(false);

  // Form states - Forgot & Reset Password
  const [forgotContact, setForgotContact] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const resetMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleTabChange = (newTab: 'login' | 'register' | 'forgot') => {
    resetMessages();
    setTab(newTab);
    if (newTab === 'forgot') {
      setForgotStep(1);
    }
  };

  // Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!loginIdentifier.trim()) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني أو رقم الجوال.');
      return;
    }

    setLoading(true);
    try {
      const res = await login({
        identifier: loginIdentifier.trim(),
        password: loginPassword,
      });

      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          closeAuthModal();
        }, 600);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'حدث خطأ غير متوقع أثناء الدخول.');
    } finally {
      setLoading(false);
    }
  };

  // Register submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!regFullName.trim() || !regPhone.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage('يرجى تعبئة كافة الحقول الإلزامية.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('كلمة المرور وتأكيدها غير متطابقين.');
      return;
    }

    if (!regAgreeTerms) {
      setErrorMessage('يرجى الموافقة على الشروط وسياسة الخصوصية للاستمرار.');
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        fullName: regFullName.trim(),
        phone: regPhone.trim(),
        email: regEmail.trim(),
        password: regPassword,
        role: regRole,
        falLicenseNumber: regFalLicense.trim() || undefined,
      });

      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          closeAuthModal();
        }, 1200);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'حدث خطأ أثناء إنشاء الحساب.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot password - Step 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!forgotContact.trim()) {
      setErrorMessage('يرجى إدخال البريد أو رقم الجوال المسجل.');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(forgotContact.trim());
      if (res.success) {
        setForgotStep(2);
        if (res.simulatedOtp) {
          setSimulatedCode(res.simulatedOtp);
          setResetOtp(res.simulatedOtp);
        }
        setSuccessMessage(res.message);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'تعذر إرسال رمز التحقق.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot password - Step 2: Reset Password with OTP
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!resetOtp.trim() || !newPassword) {
      setErrorMessage('يرجى إدخال رمز التحقق وكلمة المرور الجديدة.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('كلمة المرور يجب أن لا تقل عن 6 خانات.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('كلمة المرور وتأكيدها غير متطابقين.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({
        contact: forgotContact.trim(),
        otp: resetOtp.trim(),
        newPassword,
      });

      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          setTab('login');
          setLoginIdentifier(forgotContact);
          setLoginPassword(newPassword);
          setForgotStep(1);
          setErrorMessage(null);
        }, 1500);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'فشلت عملية تغيير كلمة المرور.');
    } finally {
      setLoading(false);
    }
  };

  // Fast demo persona credentials fill
  const demoPersonas = [
    { label: 'مدير النظام', role: 'system_admin', email: 'admin@aqqar.local', name: 'عبدالرحمن الحربي' },
    { label: 'مراجع إعلانات', role: 'content_moderator', email: 'mona.mod@aqqar.local', name: 'منى التميمي' },
    { label: 'مسؤول امتثال', role: 'compliance_officer', email: 'faisal.comp@aqqar.local', name: 'فيصل القحطاني' },
    { label: 'مدير منشأة', role: 'org_manager', email: 'khaled.mgr@arkan.ye', name: 'خالد الشمري' },
    { label: 'وسيط معتمد', role: 'authorized_broker', email: 'tariq.broker@arkan.ye', name: 'طارق المطيري' },
    { label: 'مستخدم مسجل', role: 'registered_user', email: 'ahmed.user@aqqar.local', name: 'أحمد الدوسري' },
  ];

  const handleSelectDemoPersona = (email: string) => {
    setLoginIdentifier(email);
    setLoginPassword('Password@123');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: settings.primaryColor }}
            >
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-heading">
                {tab === 'login' && 'تسجيل الدخول إلى حسابك'}
                {tab === 'register' && 'إنشاء حساب جديد في المنصة'}
                {tab === 'forgot' && 'استعادة كلمة المرور'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {settings.platformName} — البوابة العقارية المعتمدة
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-100/70 p-1 text-xs font-bold text-slate-600">
          <button
            onClick={() => handleTabChange('login')}
            className={`py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'login' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>تسجيل الدخول</span>
          </button>
          <button
            onClick={() => handleTabChange('register')}
            className={`py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'register' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>إنشاء حساب</span>
          </button>
          <button
            onClick={() => handleTabChange('forgot')}
            className={`py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'forgot' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>نسيت المرور</span>
          </button>
        </div>

        {/* Alerts */}
        <div className="px-6 pt-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{successMessage}</div>
            </div>
          )}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* 1. LOGIN TAB */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  البريد الإلكتروني أو رقم الجوال
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="مثال: admin@aqqar.local أو 0501234567"
                    className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 pl-10 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">كلمة المرور</label>
                  <button
                    type="button"
                    onClick={() => handleTabChange('forgot')}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 pl-10 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>تذكر بياناتي في هذا المتصفح</span>
                </label>
                <span className="text-[11px] text-slate-400">حماية مشددة ضد التخمين</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: settings.primaryColor }}
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'جارٍ التحقق...' : 'تسجيل الدخول الآمن'}</span>
              </button>

              {/* Fast persona testing shortcuts */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                  <span className="font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    حسابات تجريبية جاهزة للاختبار:
                  </span>
                  <span className="text-[10px] text-slate-400">(كلمة المرور: Password@123)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {demoPersonas.map((p) => (
                    <button
                      key={p.role}
                      type="button"
                      onClick={() => handleSelectDemoPersona(p.email)}
                      className={`text-right text-[11px] p-2 rounded-lg border transition cursor-pointer ${
                        loginIdentifier === p.email
                          ? 'border-emerald-600 bg-emerald-50/80 font-bold text-emerald-900'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                      }`}
                    >
                      <div className="truncate font-semibold">{p.label}</div>
                      <div className="text-[10px] text-slate-400 truncate">{p.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* 2. REGISTER TAB */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل / الاسم التجاري *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="مثال: صالح بن محمد اليافعي"
                    className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 pl-10 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                    required
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رقم الجوال *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+967 77xxxxxxx أو +966"
                      className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 pl-10 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                      required
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني *</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 pl-10 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                      required
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نوع الحساب *</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                >
                  <option value="registered_user">مستخدم عادي / باحث عن عقار</option>
                  <option value="individual_advertiser">معلن فردي (مالك عقار مستقل)</option>
                  <option value="authorized_broker">وسيط عقاري معتمد (مرخص)</option>
                  <option value="org_manager">منشأة عقارية / مكتب عقاري</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  * الأدوار الإشرافية والرقابية والمالية تعين حصراً من قبل إدارة المنصة وفق معايير الحوكمة.
                </p>
              </div>

              {(regRole === 'authorized_broker' || regRole === 'org_manager' || regRole === 'individual_advertiser') && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رقم الترخيص العقاري / رخصة فال (اختياري)
                  </label>
                  <input
                    type="text"
                    value={regFalLicense}
                    onChange={(e) => setRegFalLicense(e.target.value)}
                    placeholder="مثال: 1200004589"
                    className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور *</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="6 خانات على الأقل"
                    className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">تأكيد كلمة المرور *</label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="أعد إدخال كلمة المرور"
                    className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600 leading-relaxed">
                  <input
                    type="checkbox"
                    checked={regAgreeTerms}
                    onChange={(e) => setRegAgreeTerms(e.target.checked)}
                    className="mt-1 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    required
                  />
                  <span>
                    أوافق على <span className="text-emerald-700 font-bold underline">شروط الاستخدام</span> و
                    <span className="text-emerald-700 font-bold underline"> سياسة الخصوصية</span> والتعهد بصحة البيانات المدخلة.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: settings.primaryColor }}
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'جارٍ إنشاء الحساب...' : 'إنشاء حساب جديد'}</span>
              </button>
            </form>
          )}

          {/* 3. FORGOT / RESET PASSWORD TAB */}
          {tab === 'forgot' && (
            <div className="space-y-4">
              {forgotStep === 1 ? (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    أدخل البريد الإلكتروني أو رقم الهاتف المسجل في حسابك، وسنرسل لك رمز تحقق مؤقتاً لإعادة تعيين كلمة المرور بأمان.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      البريد الإلكتروني أو رقم الجوال
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={forgotContact}
                        onChange={(e) => setForgotContact(e.target.value)}
                        placeholder="admin@aqqar.local أو رقم الهاتف"
                        className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 pl-10 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                        required
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{loading ? 'جارٍ الإرسال...' : 'إرسال رمز التحقق (OTP)'}</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-3.5">
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-xl text-xs space-y-1">
                    <div className="font-bold">تم إرسال رمز التحقق إلى: {forgotContact}</div>
                    {simulatedCode && (
                      <div className="text-[11px] text-emerald-700">
                        الرمز التجريبي المولّد تلقائياً: <span className="font-mono font-bold text-sm">{simulatedCode}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">رمز التحقق (4 أرقام)</label>
                    <input
                      type="text"
                      value={resetOtp}
                      onChange={(e) => setResetOtp(e.target.value)}
                      placeholder="1234"
                      maxLength={6}
                      className="w-full text-center tracking-widest font-mono text-lg font-bold bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="6 خانات على الأقل"
                      className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">تأكيد كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="تأكيد كلمة المرور"
                      className="w-full text-sm bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{loading ? 'جارٍ الحفظ...' : 'تأكيد وحفظ كلمة المرور الجديدة'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="w-full text-center text-xs text-slate-500 hover:text-slate-800 py-1 cursor-pointer"
                  >
                    الرجوع لتعديل البريد أو رقم الجوال
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
