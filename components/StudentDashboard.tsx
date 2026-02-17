
import React, { useState, useEffect } from 'react';
import { StudentData, AmaliahEntry } from '../types';
import { BADGES } from '../constants';
import AmaliahForm from './AmaliahForm';
import { getDailyMotivation } from '../services/geminiService';
// FIX: Added Trophy to the lucide-react imports
import { Star, Award, Zap, Book, CheckCircle2, Trophy } from 'lucide-react';

interface StudentDashboardProps {
  student: StudentData;
  onUpdateEntry: (date: string, entry: AmaliahEntry) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ student, onUpdateEntry }) => {
  const [motivation, setMotivation] = useState("Memuat pesan hari ini...");
  const [showForm, setShowForm] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const hasEntryToday = !!student.entries[today];

  useEffect(() => {
    getDailyMotivation(1).then(setMotivation);
  }, []);

  const progress = Math.min(100, Math.round((student.totalPoints / 500) * 100)); // Example target 500 pts

  return (
    <div className="space-y-6">
      {/* Header Profile Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-green-100 flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
            <img src={student.avatar} className="w-24 h-24 rounded-full border-4 border-green-100" alt="avatar" />
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 p-1.5 rounded-lg text-white border-2 border-white shadow-sm">
                <Award size={16} />
            </div>
        </div>
        <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl font-bold text-gray-800">Assalamu'alaikum, {student.name}! 👋</h1>
            <p className="text-gray-500">Semangat Ramadhan! Hari ini adalah hari yang luar biasa untuk berbuat baik.</p>
            <div className="mt-4 bg-green-50 p-3 rounded-2xl border border-green-100 flex items-center gap-3">
                <Zap className="text-yellow-500 fill-yellow-500" size={20} />
                <p className="text-sm font-semibold text-green-800 italic">{motivation}</p>
            </div>
        </div>
        <div className="flex flex-col items-center gap-1 bg-yellow-50 p-4 rounded-3xl border border-yellow-100 min-w-[120px]">
            <Star className="text-yellow-500 fill-yellow-500 mb-1" size={24} />
            <span className="text-2xl font-black text-yellow-700">{student.totalPoints}</span>
            <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider">Total Poin</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress & Entry Column */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-green-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Book size={20} className="text-green-600" /> Progres Ramadhan
                    </h3>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">{progress}% Selesai</span>
                </div>
                <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden mb-6">
                    <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="bg-green-50 border-2 border-dashed border-green-200 rounded-3xl p-8 text-center">
                    {!showForm ? (
                        <>
                            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-white rounded-full text-green-600 shadow-sm">
                                {hasEntryToday ? <CheckCircle2 size={32} /> : <Zap size={32} />}
                            </div>
                            <h4 className="text-lg font-bold text-green-800 mb-2">
                                {hasEntryToday ? 'Amaliah Hari Ini Sudah Terisi!' : 'Yuk, Catat Amaliahmu!'}
                            </h4>
                            <p className="text-sm text-green-600 mb-6 max-w-xs mx-auto">
                                {hasEntryToday 
                                    ? 'Keren! Terus istiqomah ya, kamu bisa update catatanmu kapan saja.' 
                                    : 'Jangan biarkan hari ini berlalu tanpa catatan kebaikan. Ayo kumpulkan poin!'}
                            </p>
                            <button 
                                onClick={() => setShowForm(true)}
                                className="px-8 py-3 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-200 hover:scale-105 active:scale-95 transition-all"
                            >
                                {hasEntryToday ? 'Edit Amaliah' : 'Mulai Mengisi'}
                            </button>
                        </>
                    ) : (
                        <AmaliahForm 
                            onClose={() => setShowForm(false)} 
                            onSubmit={(entry) => {
                                onUpdateEntry(today, entry);
                                setShowForm(false);
                            }}
                            initialData={student.entries[today]}
                        />
                    )}
                </div>
            </div>
        </div>

        {/* Badges Column */}
        <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-green-100 h-full">
                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Trophy size={20} className="text-yellow-500" /> Koleksi Badge
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {BADGES.map(badge => {
                        const isUnlocked = student.badges.includes(badge.id);
                        return (
                            <div 
                                key={badge.id} 
                                className={`flex flex-col items-center p-4 rounded-2xl border transition-all ${isUnlocked ? 'bg-yellow-50 border-yellow-200 opacity-100' : 'bg-gray-50 border-gray-100 opacity-40 grayscale'}`}
                            >
                                <div className="text-4xl mb-2">{badge.icon}</div>
                                <p className="text-[10px] font-bold text-gray-800 text-center leading-tight mb-1">{badge.name}</p>
                                {isUnlocked && <p className="text-[8px] text-yellow-600 font-bold uppercase tracking-wider">Terbuka!</p>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
