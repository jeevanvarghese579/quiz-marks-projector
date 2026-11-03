import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { subscribeToLeaderboard } from "@/lib/firebase/services"

export default function Projector() {
  const [teams, setTeams] = useState<any[]>([])
  const [searchParams] = useSearchParams()

  // Real scenario expects ownerUid and quizId as query parameters for the projector view
  const ownerUid = searchParams.get("owner")
  const quizId = searchParams.get("quiz")

  useEffect(() => {
    if (!ownerUid || !quizId) return;

    const unsubscribe = subscribeToLeaderboard(ownerUid, quizId, (updatedTeams) => {
      setTeams(updatedTeams)
    })

    return () => unsubscribe()
  }, [ownerUid, quizId])

  if (!ownerUid || !quizId) {
     return <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-8">Missing owner or quiz parameter in URL.</div>
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-8 overflow-hidden font-sans">
      <header className="text-center mb-12 space-y-2">
        <h1 className="text-5xl font-black tracking-tight text-white uppercase drop-shadow-lg">INTER-SCHOOL SCIENCE QUIZ 2026</h1>
        <h2 className="text-2xl font-bold tracking-widest text-indigo-400 uppercase">LIVE CHAMPIONSHIP LEADERBOARD</h2>
      </header>

      <main className="flex-1 flex gap-8 max-w-7xl mx-auto w-full">
        {/* Main Leaderboard */}
        <div className="flex-[2] flex flex-col gap-4 relative">
          <AnimatePresence>
            {teams.slice(0, 5).map((team, index) => (
              <motion.div
                key={team.teamId}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center shadow-2xl relative overflow-hidden"
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-3"
                  style={{ backgroundColor: team.color || '#ccc' }}
                />

                <div className="w-16 h-16 flex items-center justify-center bg-slate-950 rounded-xl mr-6 border border-slate-800 shadow-inner">
                  <span className={`text-3xl font-black ${index === 0 ? 'text-amber-400' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-amber-700' : 'text-slate-500'}`}>
                    {index + 1}
                  </span>
                </div>

                <h3 className="text-4xl font-bold uppercase tracking-wider flex-1 truncate">{team.name || team.teamId}</h3>

                <div className="bg-slate-950 px-8 py-4 rounded-xl border border-slate-800 min-w-[120px] text-center shadow-inner">
                  <span className="text-5xl font-black font-mono tracking-tighter text-white">
                    {team.totalScore || 0}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Overflow Panel */}
        {teams.length > 5 && (
          <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col overflow-hidden">
            <h3 className="text-lg font-semibold text-slate-400 uppercase tracking-widest mb-6 text-center">Contenders</h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
              <AnimatePresence>
                {teams.slice(5).map((team, index) => (
                  <motion.div
                    key={team.teamId}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center relative overflow-hidden"
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1.5"
                      style={{ backgroundColor: team.color || '#ccc' }}
                    />
                    <span className="w-8 text-slate-500 font-bold ml-2">{index + 6}</span>
                    <h4 className="flex-1 font-bold uppercase truncate">{team.name || team.teamId}</h4>
                    <span className="text-xl font-black font-mono">{team.totalScore || 0}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
