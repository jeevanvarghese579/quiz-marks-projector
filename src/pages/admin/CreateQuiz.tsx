import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createQuiz } from "@/lib/firebase/services"

export default function CreateQuiz() {
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // In a real app, you would get the UID from an Auth provider context
  const MOCK_ADMIN_UID = "admin-123"

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const id = await createQuiz(MOCK_ADMIN_UID, { title, subtitle })
      navigate(`/admin/quizzes/${id}`)
    } catch (err) {
      console.error(err)
      alert("Failed to create quiz.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create New Quiz</h1>
      </div>
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle>Quiz Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Programme Name</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-slate-950 border-slate-800"
                placeholder="e.g. Inter-School Science Quiz 2026"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle (Optional)</Label>
              <Input
                id="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="bg-slate-950 border-slate-800"
                placeholder="e.g. Live Championship Leaderboard"
              />
            </div>
            <div className="pt-4 flex justify-end">
              <Button type="button" variant="outline" className="mr-2" onClick={() => navigate("/admin/quizzes")}>Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                {loading ? "Creating..." : "Create Quiz"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
