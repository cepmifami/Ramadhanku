
import React, { useState } from 'react';
import { AmaliahEntry } from '../types';
import { Moon, Sun, BookOpen, Heart, Trash2, CheckCircle2 } from 'lucide-react';

interface AmaliahFormProps {
  onClose: () => void;
  onSubmit: (entry: AmaliahEntry) => void;
  initialData?: AmaliahEntry;
}

const AmaliahForm: React.FC<AmaliahFormProps> = ({ onClose, onSubmit, initialData }) => {
  const [fasting, setFasting] = useState(initialData?.fasting ?? true);
  const [prayers, setPrayers] = useState(initialData?.prayers ?? {
    subuh: false, dzuhur: false, ashar: false, maghrib: false, isya: false, tarawih: false, dhuha: false
  });
  const [quranPages, setQuranPages] = useState(initialData?.quran.pages ?? 0);
  const [charity, setCharity] = useState(initialData?.charity ?? false);
  const [character, setCharacter] = useState(initialData?.character ?? {
    helpingParents: false, honesty: false, kindSpeech: false, studying: false
  });

  const handleSubmit = () => {
    // Basic point calculation
    let points = 0;
    if (fasting) points += 50;
    Object.values(prayers).forEach(p => { if (p) points += 10; });
    points += (quranPages * 5);
    if (charity) points += 20;
    Object.values(character).forEach(c => { if (c) points += 5; });

    onSubmit({
      date: new Date().toISOString().split('T')[0],
      fasting,
      prayers,
      quran: { pages: quranPages },
      charity,
      character,
      points
    });
  };

  const togglePrayer = (key: keyof typeof prayers) => {
    setPrayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCharacter = (key: keyof typeof character) => {
    setCharacter(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white rounded-3xl p-6 text-left space-y-8 max-w-xl mx-auto border border-green-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-green-800">Ceklis Ibadah Hari Ini</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><Trash2 size={18} className="text-gray-400" /></button>
      </div>

      {/* Fasting */}
      <section>
        <h4 className="flex items-center gap-2 font-bold text-gray-700 mb-3"><Moon className="text-purple-500" size={18} /> Puasa</h4>
        <div className="flex gap-4">
            {['Ya', 'Tidak'].map(val => (
                <button 
                    key={val}
                    onClick={() => setFasting(val === 'Ya')}
                    className={`flex-1 py-3 rounded-2xl font-bold border-2 transition-all ${fasting === (val === 'Ya') ? 'bg-green-600 text-white border-green-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                >
                    {val}
                </button>
            ))}
        </div>
      </section>

      {/* Prayers */}
      <section>
        <h4 className="flex items-center gap-2 font-bold text-gray-700 mb-3"><Sun className="text-yellow-500" size={18} /> Shalat Wajib & Sunnah</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.keys(prayers).map((p) => (
                <button 
                    key={p}
                    onClick={() => togglePrayer(p as keyof typeof prayers)}
                    className={`p-3 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${prayers[p as keyof typeof prayers] ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                >
                    {p}
                </button>
            ))}
        </div>
      </section>

      {/* Quran */}
      <section>
        <h4 className="flex items-center gap-2 font-bold text-gray-700 mb-3"><BookOpen className="text-blue-500" size={18} /> Tadarus Al-Qur'an</h4>
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
            <span className="text-sm text-gray-500">Jumlah Halaman:</span>
            <input 
                type="number" 
                value={quranPages} 
                onChange={(e) => setQuranPages(Number(e.target.value))}
                className="flex-1 bg-white border border-gray-200 rounded-xl p-2 outline-none text-center font-bold"
                min="0"
            />
        </div>
      </section>

      {/* Character */}
      <section>
        <h4 className="flex items-center gap-2 font-bold text-gray-700 mb-3"><Heart className="text-red-500" size={18} /> Akhlak & Kebaikan</h4>
        <div className="space-y-2">
            {[
                { key: 'helpingParents', label: 'Membantu Orang Tua' },
                { key: 'honesty', label: 'Berkata Jujur' },
                { key: 'kindSpeech', label: 'Berkata Baik' },
                { key: 'studying', label: 'Belajar di Rumah' }
            ].map(item => (
                <button 
                    key={item.key}
                    onClick={() => toggleCharacter(item.key as keyof typeof character)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${character[item.key as keyof typeof character] ? 'bg-red-50 border-red-200 text-red-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                >
                    <span className="text-sm font-semibold">{item.label}</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${character[item.key as keyof typeof character] ? 'bg-red-500 border-red-500' : 'border-gray-200'}`}>
                        {character[item.key as keyof typeof character] && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                </button>
            ))}
        </div>
      </section>

      <button 
        onClick={handleSubmit}
        className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-100 flex items-center justify-center gap-2 hover:bg-green-700 active:scale-95 transition-all"
      >
        Simpan Catatan <CheckCircle2 size={20} />
      </button>
    </div>
  );
};

export default AmaliahForm;
