import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Plus } from "lucide-react"
import { getQuizzes } from "@/lib/firebase/services"

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState<any[]>([])

  // In a real app, this would come from auth context
  const MOCK_ADMIN_UID = "admin-123"

  useEffect(() => {
    getQuizzes(MOCK_ADMIN_UID).then(setQuizzes).catch(console.error)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quizzes</h1>
          <p className="text-slate-400">Manage your quiz competitions.</p>
        </div>
        <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
          <Link to="/admin/quizzes/new">
            <Plus className="w-4 h-4 mr-2" />
            Create Quiz
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 border border-dashed border-slate-700 rounded-lg">
            No quizzes found. Create one to get started!
          </div>
        ) : quizzes.map(quiz => (
          <Card key={quiz.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">{quiz.title}</CardTitle>
              {quiz.subtitle && <div className="text-sm text-slate-400 mt-1">{quiz.subtitle}</div>}
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mt-4">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${quiz.status === 'Live' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-300'}`}>
                  {quiz.status || 'Draft'}
                </span>
                <Button asChild variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300">
                  <Link to={`/admin/quizzes/${quiz.id}`}>Manage</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
