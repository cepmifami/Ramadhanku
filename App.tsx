
import React, { useState, useEffect, useMemo } from 'react';
import { Role, User, StudentData, AmaliahEntry } from './types';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import { BADGES } from './constants';
import { BookOpen, LogOut, LayoutDashboard, Calendar, Trophy, Users } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Record<string, StudentData>>({});
  const [activeTab, setActiveTab] = useState('dashboard');

  // Load initial mock data
  useEffect(() => {
    const saved = localStorage.getItem('ramadhan_app_data');
    if (saved) {
      setStudents(JSON.parse(saved));
    } else {
      const initial: Record<string, StudentData> = {
        'S001': {
          id: 'S001',
          name: 'Ahmad Fathoni',
          role: Role.STUDENT,
          class: '4-A',
          nis: '12345',
          avatar: 'https://picsum.photos/seed/ahmad/200',
          entries: {},
          totalPoints: 120,
          badges: ['fasting_warrior']
        },
        'S002': {
          id: 'S002',
          name: 'Siti Aminah',
          role: Role.STUDENT,
          class: '4-A',
          nis: '12346',
          avatar: 'https://picsum.photos/seed/siti/200',
          entries: {},
          totalPoints: 85,
          badges: []
        }
      };
      setStudents(initial);
      localStorage.setItem('ramadhan_app_data', JSON.stringify(initial));
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === Role.STUDENT && !students[user.id]) {
        // New student initialization
        const newStudent: StudentData = {
            ...user,
            entries: {},
            totalPoints: 0,
            badges: []
        };
        setStudents(prev => ({...prev, [user.id]: newStudent}));
    }
  };

  const handleLogout = () => setCurrentUser(null);

  const updateAmaliah = (userId: string, date: string, entry: AmaliahEntry) => {
    setStudents(prev => {
      const student = prev[userId];
      const newEntries = { ...student.entries, [date]: entry };
      
      // Calculate total points
      // FIX: Cast Object.values results to AmaliahEntry[] to fix "Property 'points' does not exist on type 'unknown'"
      const newTotalPoints = (Object.values(newEntries) as AmaliahEntry[]).reduce((acc, curr) => acc + curr.points, 0);
      
      // Calculate badges
      const newBadges = BADGES
        .filter(badge => badge.requirement({ ...student, entries: newEntries }))
        .map(b => b.id);

      const updated = {
        ...prev,
        [userId]: {
          ...student,
          entries: newEntries,
          totalPoints: newTotalPoints,
          badges: Array.from(new Set([...student.badges, ...newBadges]))
        }
      };
      localStorage.setItem('ramadhan_app_data', JSON.stringify(updated));
      return updated;
    });
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen islamic-pattern flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-green-100 p-4 flex flex-col shadow-lg z-10">
        <div className="flex items-center gap-3 mb-8 px-2">
            <div className="bg-green-600 p-2 rounded-xl text-white">
                <BookOpen size={24} />
            </div>
            <div>
                <h1 className="font-bold text-green-800 text-sm leading-tight">Catatan Amaliah</h1>
                <p className="text-[10px] text-green-600 font-semibold tracking-wider uppercase">Ramadhan 1446H</p>
            </div>
        </div>

        <nav className="flex-1 space-y-2">
            <button 
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-green-600 text-white shadow-md' : 'text-gray-500 hover:bg-green-50'}`}
            >
                <LayoutDashboard size={20} />
                <span className="font-semibold text-sm">Dashboard</span>
            </button>
            {currentUser.role === Role.TEACHER && (
                <button 
                    onClick={() => setActiveTab('students')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'students' ? 'bg-green-600 text-white shadow-md' : 'text-gray-500 hover:bg-green-50'}`}
                >
                    <Users size={20} />
                    <span className="font-semibold text-sm">Data Siswa</span>
                </button>
            )}
            <button 
                onClick={() => setActiveTab('calendar')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'calendar' ? 'bg-green-600 text-white shadow-md' : 'text-gray-500 hover:bg-green-50'}`}
            >
                <Calendar size={20} />
                <span className="font-semibold text-sm">Kalender</span>
            </button>
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-4 px-2">
                <img src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name}`} className="w-10 h-10 rounded-full border-2 border-green-100" />
                <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-800 truncate">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">{currentUser.role === Role.TEACHER ? 'Guru' : `Kelas ${currentUser.class}`}</p>
                </div>
            </div>
            <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all"
            >
                <LogOut size={20} />
                <span className="font-semibold text-sm">Keluar</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-green-50/50">
        {currentUser.role === Role.STUDENT ? (
          <StudentDashboard 
            student={students[currentUser.id] || { ...currentUser, entries: {}, totalPoints: 0, badges: [] } as StudentData} 
            onUpdateEntry={(date, entry) => updateAmaliah(currentUser.id, date, entry)}
          />
        ) : (
          <TeacherDashboard students={Object.values(students)} />
        )}
      </main>
    </div>
  );
};

export default App;
