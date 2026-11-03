import { useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Check, X, Minus, Activity } from "lucide-react"

// Import firebase config
import { functions } from "@/lib/firebase/config"
import { httpsCallable } from "firebase/functions"

export default function InvigilatorScoring() {
  const { quizId } = useParams()
  const [searchParams] = useSearchParams()
  const ownerUid = searchParams.get("owner")

  const [loading, setLoading] = useState(false)
  const [activeTeam, setActiveTeam] = useState("team1")

  const submitScore = async (questionId: string, score: number, status: string) => {
    setLoading(true)
    try {
      const submitFn = httpsCallable(functions, "quizMarksSubmitScore")
      await submitFn({
        ownerUid,
        quizId,
        teamId: activeTeam,
        questionId,
        score,
        status
      })
      // Ideally update local state optimistically here
    } catch (err) {
      console.error(err)
      alert("Failed to submit score")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="p-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-10 text-center">
        <h1 className="text-xl font-bold tracking-tight text-indigo-400">Inter-School Science Quiz</h1>
        <p className="text-sm text-slate-400">Scoring Interface</p>
      </header>

      <main className="flex-1 p-4 max-w-lg mx-auto w-full space-y-6">
        {/* Placeholder Team Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button variant={activeTeam === "team1" ? "default" : "outline"} onClick={() => setActiveTeam("team1")} className={activeTeam === "team1" ? "bg-indigo-600" : "border-slate-800 text-slate-300"}>Team Alpha</Button>
          <Button variant={activeTeam === "team2" ? "default" : "outline"} onClick={() => setActiveTeam("team2")} className={activeTeam === "team2" ? "bg-indigo-600" : "border-slate-800 text-slate-300"}>Team Beta</Button>
        </div>

        {/* Placeholder Questions */}
        <div className="space-y-4">
          {[
            { id: "q1", max: 5 },
            { id: "q2", max: 10 }
          ].map(q => (
            <div key={q.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg uppercase tracking-wider text-slate-300">Question {q.id.replace('q', '')}</h3>
                <span className="text-sm text-slate-500">{q.max} Marks</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  className="h-16 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 flex flex-col gap-1"
                  onClick={() => submitScore(q.id, q.max, 'correct')}
                  disabled={loading}
                >
                  <Check className="w-5 h-5" />
                  <span className="text-xs">{q.max}</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-16 border-amber-500/30 text-amber-500 hover:bg-amber-500/10 flex flex-col gap-1"
                  onClick={() => submitScore(q.id, q.max / 2, 'half')}
                  disabled={loading}
                >
                  <Activity className="w-5 h-5" />
                  <span className="text-xs">{q.max / 2}</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-16 border-rose-500/30 text-rose-500 hover:bg-rose-500/10 flex flex-col gap-1"
                  onClick={() => submitScore(q.id, 0, 'incorrect')}
                  disabled={loading}
                >
                  <X className="w-5 h-5" />
                  <span className="text-xs">0</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-16 border-slate-700 text-slate-400 hover:bg-slate-800 flex flex-col gap-1"
                  onClick={() => submitScore(q.id, 0, 'unanswered')}
                  disabled={loading}
                >
                  <Minus className="w-5 h-5" />
                  <span className="text-xs">—</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
