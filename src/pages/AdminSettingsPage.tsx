import React, { useState } from 'react';
import {
  Settings,
  ArrowRight,
  Save,
  RefreshCw,
  CheckCircle2,
  Building2,
  Palette,
  Phone,
  Mail,
  Percent,
  Shield,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface AdminSettingsPageProps {
  onBack: () => void;
}

export const AdminSettingsPage: React.FC<AdminSettingsPageProps> = ({ onBack }) => {
  const { settings, updateSettings, loading } = useSettings();
  const [platformName, setPlatformName] = useState(settings.platformName);
  const [platformSubtitle, setPlatformSubtitle] = useState(settings.platformSubtitle);
  const [logoText, setLogoText] = useState(settings.logoText);
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(settings.secondaryColor);
  const [vatRate, setVatRate] = useState(settings.vatRate * 100);
  const [supportPhone, setSupportPhone] = useState(settings.supportPhone);
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail);
  const [regaLicenseNote, setRegaLicenseNote] = useState(settings.regaLicenseNote || '');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);
    try {
      await updateSettings({
        platformName,
        platformSubtitle,
        logoText,
        primaryColor,
        secondaryColor,
        vatRate: Number(vatRate) / 100,
        supportPhone,
        supportEmail,
        regaLicenseNote,
      });
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-right">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold mb-1">
              <Settings className="w-4 h-4" />
              <span>إعدادات النظام وتخصيص الهوية</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              تخصيص هوية المنصة وإعداداتها
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              تعديل مسميات المنصة والشعار والألوان والضرائب وأرقام الدعم مباشرة دون تعديل الكود
            </p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>تم حفظ الإعدادات وتحديث هوية المنصة بنجاح في جميع الواجهات</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-xs">
        {/* Basic Brand */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>بيانات الهوية والاسم التجاري</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">اسم المنصة الرسمي:</label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">نص الشعار المختصر (Logo Text):</label>
              <input
                type="text"
                value={logoText}
                onChange={(e) => setLogoText(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">الوصف الفرعي للمنصة:</label>
            <input
              type="text"
              value={platformSubtitle}
              onChange={(e) => setPlatformSubtitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Colors & Visual Theme */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Palette className="w-4 h-4 text-emerald-600" />
            <span>الألوان والسمة البصرية</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">اللون الأساسي (Primary Color):</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-200 p-1 cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">اللون الثانوي (Secondary Color):</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-200 p-1 cursor-pointer"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Taxes & Financials */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Percent className="w-4 h-4 text-emerald-600" />
            <span>الضرائب والمالية</span>
          </h3>

          <div className="max-w-xs">
            <label className="block font-bold text-slate-700 mb-1">نسبة ضريبة القيمة المضافة (VAT %):</label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={vatRate}
                onChange={(e) => setVatRate(Number(e.target.value))}
                className="w-full p-2.5 pl-8 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="absolute left-3 top-2.5 font-bold text-slate-400">%</span>
            </div>
          </div>
        </div>

        {/* Contact info & Regulatory */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>بيانات التواصل والترخيص الحكومي</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">هاتف خدمة العملاء الموحد:</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">البريد الإلكتروني للدعم:</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">ملاحظة الترخيص والاعتماد النظامي:</label>
            <textarea
              rows={2}
              value={regaLicenseNote}
              onChange={(e) => setRegaLicenseNote(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs flex items-center gap-2 transition"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>حفظ التعديلات وتطبيقها</span>
          </button>
        </div>
      </form>
    </div>
  );
};
