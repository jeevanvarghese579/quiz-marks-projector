import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, HelpCircle, Settings, ShieldCheck, FileSpreadsheet } from "lucide-react"
import { getQuiz, getTeams, getQuestions } from "@/lib/firebase/services"

export default function QuizDetail() {
  const { quizId } = useParams()
  const [quiz, setQuiz] = useState<any>(null)
  const [teams, setTeams] = useState<any[]>([])
  const [questions, setQuestions] = useState<any[]>([])

  const MOCK_ADMIN_UID = "admin-123"

  useEffect(() => {
    if (quizId) {
      getQuiz(MOCK_ADMIN_UID, quizId).then(setQuiz).catch(console.error)
      getTeams(MOCK_ADMIN_UID, quizId).then(setTeams).catch(console.error)
      getQuestions(MOCK_ADMIN_UID, quizId).then(setQuestions).catch(console.error)
    }
  }, [quizId])

  if (!quiz) return <div className="p-8 text-center text-slate-400">Loading quiz...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{quiz.title}</h1>
        <p className="text-slate-400">Quiz ID: {quizId}</p>
      </div>

      <Tabs defaultValue="teams" className="w-full">
        <TabsList className="bg-slate-900 border-slate-800 flex-wrap h-auto p-1 gap-1">
          <TabsTrigger value="teams" className="data-[state=active]:bg-slate-800">
            <Users className="w-4 h-4 mr-2" /> Teams ({teams.length})
          </TabsTrigger>
          <TabsTrigger value="questions" className="data-[state=active]:bg-slate-800">
            <HelpCircle className="w-4 h-4 mr-2" /> Questions ({questions.length})
          </TabsTrigger>
          <TabsTrigger value="invigilators" className="data-[state=active]:bg-slate-800">
            <ShieldCheck className="w-4 h-4 mr-2" /> Invigilators
          </TabsTrigger>
          <TabsTrigger value="results" className="data-[state=active]:bg-slate-800">
            <FileSpreadsheet className="w-4 h-4 mr-2" /> Results
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-slate-800">
            <Settings className="w-4 h-4 mr-2" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="mt-6">
          <div className="text-slate-400 p-4 border border-slate-800 rounded-lg bg-slate-900">
            {teams.length === 0 ? "No teams added yet." : (
              <ul className="space-y-2">
                {teams.map(t => (
                  <li key={t.id} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{backgroundColor: t.color || '#ccc'}}></span>
                    {t.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>
        <TabsContent value="questions" className="mt-6">
          <div className="text-slate-400 p-4 border border-slate-800 rounded-lg bg-slate-900">
             {questions.length === 0 ? "No questions added yet." : (
              <ul className="space-y-2">
                {questions.map(q => (
                  <li key={q.id}>{q.number}: {q.maxMarks} marks</li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>
        <TabsContent value="invigilators" className="mt-6">
          <div className="text-slate-400 p-4 border border-slate-800 rounded-lg bg-slate-900">
            <h3 className="font-semibold text-white mb-2">Invigilator Access</h3>
            <p>Active codes and invigilator sessions will appear here.</p>
          </div>
        </TabsContent>
        <TabsContent value="results" className="mt-6">
          <div className="text-slate-400 p-4 border border-slate-800 rounded-lg bg-slate-900">
            <h3 className="font-semibold text-white mb-2">Quiz Results</h3>
             <p>Score matrix and ranking will appear here once the quiz goes live.</p>
          </div>
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <div className="text-slate-400 p-4 border border-slate-800 rounded-lg bg-slate-900">
            <h3 className="font-semibold text-white mb-2">Quiz Settings</h3>
             <p>General configuration options (Title, Subtitle, Marks configuration).</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
