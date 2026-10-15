import React, { useState, useEffect } from 'react';
import {
  Heart,
  ArrowRight,
  Trash2,
  Building2,
  MapPin,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';
import { Listing } from '../types/database';

interface FavoritesPageProps {
  onSelectListing: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ onSelectListing, onNavigate }) => {
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await api.getListings();
      if (res.success && res.listings) {
        // Show first few active listings as user's favorites
        setFavorites(res.listings.slice(0, 4));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-right">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-rose-600 text-xs font-bold mb-1">
            <Heart className="w-4 h-4 fill-rose-600 text-rose-600" />
            <span>قائمة العقارات المحفوظة والمفضلة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            إعلاناتك المفضلة
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            تابع التغيرات في الأسعار وتواصل مع المعلنين بسهولة
          </p>
        </div>

        <button
          onClick={() => onNavigate('search')}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
        >
          تصفح العقارات المتاحة
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
          <span className="text-xs">جاري تحميل المفضلة...</span>
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Heart className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-slate-800">قائمة المفضلة فارغة حالياً</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            قم بالضغط على أيقونة القلب على أي إعلان عقاري لحفظه في هذه القائمة والرجوع إليه لاحقاً.
          </p>
          <button
            onClick={() => onNavigate('search')}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            استعراض العقارات المعروضة
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((listing) => (
            <div
              key={listing.id}
              onClick={() => onSelectListing(listing.id)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col"
            >
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                <img
                  src={listing.media?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600'}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <button
                  onClick={(e) => handleRemoveFavorite(listing.id, e)}
                  className="absolute top-3 left-3 p-2 rounded-full bg-white/90 backdrop-blur-xs text-rose-600 hover:bg-white shadow-xs transition"
                  title="إزالة من المفضلة"
                >
                  <Heart className="w-4 h-4 fill-rose-600 text-rose-600" />
                </button>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                  {listing.price.toLocaleString()} ر.ي
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-right">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-emerald-700 transition">
                    {listing.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{listing.property?.city || 'صنعاء'} — {listing.property?.district || 'حي الأندلس'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">
                    رقم الإعلان: #{listing.id.substring(4)}
                  </span>
                  <span className="text-emerald-600 font-bold group-hover:underline flex items-center gap-1">
                    <span>التفاصيل الكاملة</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
