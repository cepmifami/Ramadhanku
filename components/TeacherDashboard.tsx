
import React, { useMemo } from 'react';
// FIX: Added AmaliahEntry to imports
import { StudentData, AmaliahEntry } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Users, Filter, Download, Search, ChevronRight } from 'lucide-react';

interface TeacherDashboardProps {
  students: StudentData[];
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ students }) => {
  const chartData = useMemo(() => {
    return students.map(s => ({
      name: s.name.split(' ')[0],
      points: s.totalPoints,
      activities: Object.keys(s.entries).length
    }));
  }, [students]);

  const prayerStats = useMemo(() => {
    let subuh = 0, tarawih = 0, fasting = 0;
    students.forEach(s => {
      // FIX: Explicitly cast Object.values results to AmaliahEntry[] to fix "Property does not exist on type 'unknown'"
      (Object.values(s.entries) as AmaliahEntry[]).forEach(e => {
        if (e.prayers.subuh) subuh++;
        if (e.prayers.tarawih) tarawih++;
        if (e.fasting) fasting++;
      });
    });
    return [
      { name: 'Puasa', value: fasting },
      { name: 'Subuh', value: subuh },
      { name: 'Tarawih', value: tarawih },
    ];
  }, [students]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Guru 🏫</h1>
          <p className="text-gray-500">Monitoring amaliah siswa Kelas 4-A</p>
        </div>
        <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all">
                <Filter size={16} /> Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-all shadow-md shadow-green-100">
                <Download size={16} /> Unduh Rekap
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Summary */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6">Poin Amaliah Siswa</h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} dy={10} />
                        <YAxis axisLine={false} tickLine={false} fontSize={12} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="points" fill="#16a34a" radius={[10, 10, 0, 0]} barSize={40}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#16a34a' : '#3b82f6'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Global Stats */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6">Keaktifan Kelas</h3>
            <div className="space-y-6">
                {prayerStats.map((stat, i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 font-medium">{stat.name}</span>
                            <span className="text-green-600 font-bold">{stat.value} Aktivitas</span>
                        </div>
                        <div className="w-full bg-gray-50 h-3 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full ${i === 0 ? 'bg-green-500' : i === 1 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                                style={{ width: `${Math.min(100, (stat.value / (students.length * 30)) * 100)}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 p-4 bg-green-50 rounded-2xl border border-green-100">
                <p className="text-xs text-green-700 font-medium leading-relaxed">
                    💡 Berikan apresiasi kepada Ahmad karena progres tadarusnya meningkat pesat minggu ini!
                </p>
            </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Users size={18} className="text-gray-400" /> Daftar Siswa
            </h3>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Cari siswa..." 
                    className="pl-10 pr-4 py-2 bg-gray-50 border border-transparent focus:border-green-200 rounded-xl text-sm outline-none w-64"
                />
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <th className="px-6 py-4">Siswa</th>
                        <th className="px-6 py-4">Poin</th>
                        <th className="px-6 py-4">Badge</th>
                        <th className="px-6 py-4">Terakhir Aktif</th>
                        <th className="px-6 py-4">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {students.map(student => (
                        <tr key={student.id} className="hover:bg-green-50/30 transition-all group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img src={student.avatar} className="w-8 h-8 rounded-full border border-gray-100" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">{student.name}</p>
                                        <p className="text-[10px] text-gray-400">NIS: {student.nis}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm font-bold text-green-600">{student.totalPoints}</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex -space-x-2">
                                    {student.badges.map(b => (
                                        <div key={b} className="w-6 h-6 rounded-full bg-yellow-50 border border-white flex items-center justify-center text-[10px]">
                                            ✨
                                        </div>
                                    ))}
                                    {student.badges.length === 0 && <span className="text-xs text-gray-300">Belum ada</span>}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-xs text-gray-500">
                                    {Object.keys(student.entries).length > 0 
                                        ? Object.keys(student.entries).pop() 
                                        : 'Belum pernah'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <button className="p-2 hover:bg-white rounded-lg text-gray-400 group-hover:text-green-600 transition-all">
                                    <ChevronRight size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
