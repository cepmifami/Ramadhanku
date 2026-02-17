
export enum Role {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER'
}

export interface User {
  id: string;
  name: string;
  role: Role;
  class?: string;
  nis?: string;
  avatar?: string;
}

export interface AmaliahEntry {
  date: string; // ISO string YYYY-MM-DD
  fasting: boolean;
  prayers: {
    subuh: boolean;
    dzuhur: boolean;
    ashar: boolean;
    maghrib: boolean;
    isya: boolean;
    tarawih: boolean;
    dhuha: boolean;
  };
  quran: {
    pages: number;
    surah?: string;
  };
  charity: boolean;
  character: {
    helpingParents: boolean;
    honesty: boolean;
    kindSpeech: boolean;
    studying: boolean;
  };
  points: number;
}

export interface StudentData extends User {
  entries: Record<string, AmaliahEntry>;
  totalPoints: number;
  badges: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: (data: StudentData) => boolean;
}
