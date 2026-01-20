"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Mode = "junior" | "middle" | "senior";

interface Progress {
  totalWork: number;
  totalBreak: number;
  workByMode: Record<Mode, number>;
  breakByMode: Record<Mode, number>;
  dailyWork: number;
  lastDate: string; // YYYY-MM-DD
  streak: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  condition: (p: Progress) => boolean;
  progressFn?: (p: Progress) => string | undefined;
}

interface AchievementsContextType {
  completeSession: (isBreak: boolean, mode: Mode) => void;
  progress: Progress;
  achievements: (Achievement & { unlocked: boolean; currentProgress?: string })[];
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

const initialProgress: Progress = {
  totalWork: 0,
  totalBreak: 0,
  workByMode: { junior: 0, middle: 0, senior: 0 },
  breakByMode: { junior: 0, middle: 0, senior: 0 },
  dailyWork: 0,
  lastDate: "",
  streak: 0,
};

const achievementsList: Achievement[] = [
  {
    id: "first_pomodoro",
    name: "Первый помодоро",
    description: "Завершите первую рабочую сессию",
    condition: (p) => p.totalWork >= 1,
  },
  {
    id: "ten_pomodoro",
    name: "Десятка",
    description: "Завершите 10 рабочих сессий",
    condition: (p) => p.totalWork >= 10,
    progressFn: (p) => (p.totalWork < 10 ? `${p.totalWork}/10` : undefined),
  },
  {
    id: "hundred_pomodoro",
    name: "Сотня",
    description: "Завершите 100 рабочих сессий",
    condition: (p) => p.totalWork >= 100,
    progressFn: (p) => (p.totalWork < 100 ? `${p.totalWork}/100` : undefined),
  },
  {
    id: "first_break",
    name: "Первый перерыв",
    description: "Завершите первый перерыв",
    condition: (p) => p.totalBreak >= 1,
  },
  {
    id: "fifty_breaks",
    name: "Любитель перерывов",
    description: "Завершите 50 перерывов",
    condition: (p) => p.totalBreak >= 50,
    progressFn: (p) => (p.totalBreak < 50 ? `${p.totalBreak}/50` : undefined),
  },
  {
    id: "junior_fan",
    name: "Фанат Junior",
    description: "Завершите 15 сессий в режиме Junior",
    condition: (p) => p.workByMode.junior >= 15,
    progressFn: (p) => `${p.workByMode.junior}/15`,
  },
  {
    id: "middle_master",
    name: "Мастер Middle",
    description: "Завершите 30 сессий в режиме Middle",
    condition: (p) => p.workByMode.middle >= 30,
    progressFn: (p) => `${p.workByMode.middle}/30`,
  },
  {
    id: "senior_challenge",
    name: "Вызов Senior",
    description: "Завершите хотя бы одну сессию в режиме Senior",
    condition: (p) => p.workByMode.senior >= 1,
  },
  {
    id: "week_streak",
    name: "Недельный стрик",
    description: "Достигните 7-дневного стрику",
    condition: (p) => p.streak >= 7,
    progressFn: (p) => `${p.streak}/7`,
  },
];

const STORAGE_KEY = "pomodoroAchievementsProgress";

const getToday = () => new Date().toISOString().split("T")[0];

const getYesterday = (dateStr: string) => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split("T")[0];
};

export function AchievementsProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(() => {
    if (typeof window === "undefined") return initialProgress;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialProgress;
  });

  // Сброс ежедневного счётчика при открытии приложения в новый день
  useEffect(() => {
    const today = getToday();
    if (progress.lastDate !== today && progress.lastDate !== "") {
      setProgress((prev) => ({ ...prev, dailyWork: 0 }));
    }
  }, []);

  // Сохранение в localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const completeSession = (isBreak: boolean, currentMode: Mode) => {
    setProgress((prev) => {
      const today = getToday();

      let newDaily = prev.dailyWork;
      let newStreak = prev.streak;
      let newLastDate = prev.lastDate;

      if (!isBreak) {
        // Обновляем стрик и ежедневку только по завершению рабочей сессии
        if (prev.lastDate === today) {
          newDaily = prev.dailyWork + 1;
        } else {
          newDaily = 1;
          if (prev.lastDate === "") {
            newStreak = 1;
          } else {
            const yesterday = getYesterday(today);
            newStreak = prev.lastDate === yesterday ? prev.streak + 1 : 1;
          }
        }
        newLastDate = today;
      }

      return {
        ...prev,
        totalWork: isBreak ? prev.totalWork : prev.totalWork + 1,
        totalBreak: isBreak ? prev.totalBreak + 1 : prev.totalBreak,
        workByMode: {
          ...prev.workByMode,
          [currentMode]: isBreak ? prev.workByMode[currentMode] : prev.workByMode[currentMode] + 1,
        },
        breakByMode: {
          ...prev.breakByMode,
          [currentMode]: isBreak ? prev.breakByMode[currentMode] + 1 : prev.breakByMode[currentMode],
        },
        dailyWork: newDaily,
        streak: newStreak,
        lastDate: newLastDate,
      };
    });
  };

  const achievements = achievementsList.map((a) => ({
    ...a,
    unlocked: a.condition(progress),
    currentProgress: a.progressFn?.(progress),
  }));

  return (
    <AchievementsContext.Provider value={{ completeSession, progress, achievements }}>
      {children}
    </AchievementsContext.Provider>
  );
}

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  if (!context) throw new Error("useAchievements must be used within AchievementsProvider");
  return context;
};