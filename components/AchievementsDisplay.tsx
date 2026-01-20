"use client";

import { useAchievements } from "@/contexts/AchievementsContext";

export default function AchievementsDisplay() {
  const { progress, achievements } = useAchievements();

  const dailyCompleted = progress.dailyWork >= 4;

  return (
    <div className="text-center mb-8">
      {/* Ежедневное задание + стрик */}
      <div className="bg-white/5 backdrop-blur rounded-xl p-4 mb-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-2">Ежедневное задание</h3>
        <p className="text-lg text-white/90">
          Завершить 4 помодоро сегодня:{" "}
          <span className={dailyCompleted ? "text-green-400 font-bold" : "text-yellow-300"}>
            {progress.dailyWork}/4
          </span>
          {dailyCompleted && " 🎉 Выполнено!"}
        </p>
        {progress.streak > 0 && (
          <p className="text-lg text-orange-400 mt-2">
            🔥 Стрик: {progress.streak} {progress.streak === 1 ? "день" : "дней"}
          </p>
        )}
      </div>

      {/* Достижения */}
      <h3 className="text-2xl font-bold text-white mb-4">Достижения</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`p-4 rounded-xl border transition-all ${
              ach.unlocked
                ? "bg-yellow-600/20 border-yellow-500/50 shadow-lg shadow-yellow-500/20"
                : "bg-white/5 border-white/10"
            }`}
          >
            <div className="text-3xl mb-2">{ach.unlocked ? "🏆" : "🔒"}</div>
            <p className={`font-semibold ${ach.unlocked ? "text-yellow-300" : "text-gray-400"}`}>
              {ach.name}
            </p>
            <p className="text-sm text-white/70 mt-1">{ach.description}</p>
            {!ach.unlocked && ach.currentProgress && (
              <p className="text-xs text-gray-400 mt-2">{ach.currentProgress}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}