"use client"

import { AchievementsProvider } from "@/contexts/AchievementsContext";
import PomodoroContent from "@/components/PomodoroContent";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <AchievementsProvider>
        <PomodoroContent />
      </AchievementsProvider>
    </div>
  );
}