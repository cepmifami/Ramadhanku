
import React, { useState } from 'react';
import { Role, User } from '../types';
import { UserCircle, GraduationCap, ChevronRight, BookOpen } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<Role | null>(null);
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');

  const handleStart = () => {
    if (!name) return;
    onLogin({
      id: mode === Role.STUDENT ? `S-${Date.now()}` : 'T-001',
      name,
      role: mode as Role,
      class: className,
      avatar: `https://picsum.photos/seed/${name}/200`
    });
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4 islamic-pattern">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-green-100 relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 rounded-full -mr-12 -mt-12 opacity-50" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-100 rounded-full -ml-16 -mb-16 opacity-50" />

        <div className="text-center mb-8 relative z-10">
          <div className="inline-block p-4 bg-green-600 rounded-2xl text-white mb-4 shadow-lg">
            <BookOpen size={40} />
          </div>
          <h1 className="text-2xl font-bold text-green-800 font-jakarta">Catatan Amaliah</h1>
          <p className="text-green-600 font-medium">Ramadhan Digital 1446H</p>
        </div>

        {!mode ? (
          <div className="space-y-4 relative z-10">
            <p className="text-center text-gray-500 mb-6">Assalamu'alaikum! Siapa kamu?</p>
            <button 
              onClick={() => setMode(Role.STUDENT)}
              className="w-full p-6 bg-white border-2 border-green-100 rounded-2xl flex items-center gap-4 hover:border-green-500 hover:bg-green-50 transition-all group"
            >
              <div className="p-3 bg-green-100 text-green-600 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-all">
                <GraduationCap size={32} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-800">Saya Siswa</h3>
                <p className="text-xs text-gray-500">Isi amaliah harian & kumpulkan poin</p>
              </div>
              <ChevronRight className="ml-auto text-gray-300" />
            </button>
            <button 
              onClick={() => {
                setMode(Role.TEACHER);
                setName('Ustadz Ahmad'); // Default for demo
              }}
              className="w-full p-6 bg-white border-2 border-blue-100 rounded-2xl flex items-center gap-4 hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                <UserCircle size={32} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-800">Saya Guru</h3>
                <p className="text-xs text-gray-500">Monitor & rekap data amaliah kelas</p>
              </div>
              <ChevronRight className="ml-auto text-gray-300" />
            </button>
          </div>
        ) : (
          <div className="space-y-4 relative z-10">
            <button onClick={() => setMode(null)} className="text-xs text-green-600 font-bold mb-4 flex items-center gap-1">
              ← Kembali
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Lengkapi Profil</h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan namamu..."
                className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-xl outline-none transition-all"
              />
            </div>
            {mode === Role.STUDENT && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kelas</label>
                <select 
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-xl outline-none transition-all"
                >
                  <option value="">Pilih Kelas</option>
                  <option value="4-A">Kelas 4-A</option>
                  <option value="4-B">Kelas 4-B</option>
                  <option value="5-A">Kelas 5-A</option>
                </select>
              </div>
            )}
            <button 
              onClick={handleStart}
              disabled={!name || (mode === Role.STUDENT && !className)}
              className="w-full p-4 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 disabled:bg-gray-300 disabled:shadow-none transition-all mt-4"
            >
              Mulai Sekarang
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
