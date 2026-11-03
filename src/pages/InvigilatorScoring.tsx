import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Check, X, Minus, Activity } from "lucide-react"

// Import firebase config
import { functions } from "@/lib/firebase/config"
import { httpsCallable } from "firebase/functions"
import { getTeams, getQuestions } from "@/lib/firebase/services"

export default function InvigilatorScoring() {
  const { quizId } = useParams()
  const [searchParams] = useSearchParams()
  const ownerUid = searchParams.get("owner")

  const [loading, setLoading] = useState(false)
  const [activeTeam, setActiveTeam] = useState("")
  const [teams, setTeams] = useState<any[]>([])
  const [questions, setQuestions] = useState<any[]>([])

  useEffect(() => {
    if (ownerUid && quizId) {
      getTeams(ownerUid, quizId).then(fetchedTeams => {
        setTeams(fetchedTeams)
        if (fetchedTeams.length > 0) setActiveTeam(fetchedTeams[0].id)
      })
      getQuestions(ownerUid, quizId).then(setQuestions)
    }
  }, [ownerUid, quizId])

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
    } catch (err) {
      console.error(err)
      alert("Failed to submit score")
    } finally {
      setLoading(false)
    }
  }

  if (!ownerUid || !quizId) return <div className="p-8 text-center text-slate-400">Invalid session. Missing owner context.</div>

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="p-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-10 text-center">
        <h1 className="text-xl font-bold tracking-tight text-indigo-400">Scoring Interface</h1>
      </header>

      <main className="flex-1 p-4 max-w-lg mx-auto w-full space-y-6">
        {teams.length === 0 ? (
          <div className="text-center text-slate-400">No teams available for scoring.</div>
        ) : (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {teams.map(team => (
              <Button
                key={team.id}
                variant={activeTeam === team.id ? "default" : "outline"}
                onClick={() => setActiveTeam(team.id)}
                className={activeTeam === team.id ? "bg-indigo-600 shrink-0" : "border-slate-800 text-slate-300 shrink-0"}
              >
                {team.name}
              </Button>
            ))}
          </div>
        )}

        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="text-center text-slate-400 pt-8">No questions loaded.</div>
          ) : (
            questions.map(q => (
              <div key={q.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg uppercase tracking-wider text-slate-300">Question {q.number || q.id}</h3>
                  <span className="text-sm text-slate-500">{q.maxMarks} Marks</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    className="h-16 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 flex flex-col gap-1"
                    onClick={() => submitScore(q.id, q.maxMarks, 'correct')}
                    disabled={loading || !activeTeam}
                  >
                    <Check className="w-5 h-5" />
                    <span className="text-xs">{q.maxMarks}</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-16 border-amber-500/30 text-amber-500 hover:bg-amber-500/10 flex flex-col gap-1"
                    onClick={() => submitScore(q.id, q.maxMarks / 2, 'half')}
                    disabled={loading || !activeTeam}
                  >
                    <Activity className="w-5 h-5" />
                    <span className="text-xs">{q.maxMarks / 2}</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-16 border-rose-500/30 text-rose-500 hover:bg-rose-500/10 flex flex-col gap-1"
                    onClick={() => submitScore(q.id, 0, 'incorrect')}
                    disabled={loading || !activeTeam}
                  >
                    <X className="w-5 h-5" />
                    <span className="text-xs">0</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-16 border-slate-700 text-slate-400 hover:bg-slate-800 flex flex-col gap-1"
                    onClick={() => submitScore(q.id, 0, 'unanswered')}
                    disabled={loading || !activeTeam}
                  >
                    <Minus className="w-5 h-5" />
                    <span className="text-xs">—</span>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
