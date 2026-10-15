import React from 'react';
import {
  Lock,
  X,
  LogIn,
  UserPlus,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

interface VisitorGateModalProps {
  onSuccessRedirect?: () => void;
}

export const VisitorGateModal: React.FC<VisitorGateModalProps> = ({ onSuccessRedirect }) => {
  const { visitorGateOpen, visitorGateAction, closeVisitorGate, openAuthModal } = useAuth();
  const { settings } = useSettings();

  if (!visitorGateOpen) return null;

  const handleOpenLogin = () => {
    closeVisitorGate();
    openAuthModal('login');
  };

  const handleOpenRegister = () => {
    closeVisitorGate();
    openAuthModal('register');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white text-center relative">
          <button
            onClick={closeVisitorGate}
            className="absolute top-4 left-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-3 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold font-heading">تسجيل الدخول مطلوب</h3>
          <p className="text-xs text-emerald-100 mt-1 max-w-xs mx-auto">
            عزيزي الزائر، يتطلب تنفيذ {visitorGateAction} أن تكون مسجلاً في منصة {settings.platformName}.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-center">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-right text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>مزايا الحساب المسجل:</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>حفظ العقارات بالمفضلة والوصول إليها من أي جهاز</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>نشر وإدارة الإعلانات العقارية المعتمدة</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>التواصل المباشر مع الملاك والوسطاء المرخصين</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleOpenLogin}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              style={{ backgroundColor: settings.primaryColor }}
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول إلى حسابك</span>
            </button>

            <button
              onClick={handleOpenRegister}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>إنشاء حساب جديد (مجاناً)</span>
            </button>

            <button
              onClick={closeVisitorGate}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>المتابعة كزائر عام (تصفح فقط)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
