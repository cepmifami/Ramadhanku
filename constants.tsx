
import React from 'react';
import { Badge, StudentData } from './types';
import { Star, BookOpen, Heart, Trophy, Sun, Moon } from 'lucide-react';

export const COLORS = {
  primary: '#16a34a', // Islamic Green
  secondary: '#3b82f6', // Bright Blue
  accent: '#fbbf24', // Golden yellow
  background: '#f0fdf4',
};

export const BADGES: Badge[] = [
  {
    id: 'fasting_warrior',
    name: 'Pejuang Puasa',
    description: 'Puasa 3 hari berturut-turut',
    icon: '🌙',
    requirement: (data) => Object.values(data.entries).filter(e => e.fasting).length >= 3,
  },
  {
    id: 'quran_friend',
    name: 'Sahabat Al-Qur’an',
    description: 'Membaca lebih dari 20 halaman',
    icon: '📖',
    requirement: (data) => Object.values(data.entries).reduce((acc, curr) => acc + curr.quran.pages, 0) >= 20,
  },
  {
    id: 'sholeh_child',
    name: 'Anak Shalih',
    description: 'Shalat 5 waktu lengkap dalam sehari',
    icon: '🕌',
    requirement: (data) => Object.values(data.entries).some(e => 
      e.prayers.subuh && e.prayers.dzuhur && e.prayers.ashar && e.prayers.maghrib && e.prayers.isya
    ),
  },
  {
    id: 'charity_star',
    name: 'Bintang Sedekah',
    description: 'Berbagi kebaikan 5 kali',
    icon: '✨',
    requirement: (data) => Object.values(data.entries).filter(e => e.charity).length >= 5,
  }
];

export const RAMADHAN_DAY_ONE = new Date('2025-03-01'); // Projected Ramadhan Start
