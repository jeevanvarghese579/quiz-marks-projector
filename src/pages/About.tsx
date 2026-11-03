import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-4">
      <Card className="w-full max-w-md bg-slate-900 text-slate-100 border-slate-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-indigo-400">Quiz Marks Projector</CardTitle>
          <CardDescription className="text-slate-400">
            Real-Time Quiz Competition Management and Animated Live Leaderboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-slate-800/50 p-6 text-center space-y-2 border border-slate-700/50">
            <h3 className="font-semibold text-lg">Developed by Jeevan Varghese</h3>
            <p className="text-sm text-slate-300">HSST Jr. Botany</p>
            <p className="text-sm text-slate-300">St. Gemma's Girls' HSS, Malappuram</p>
          </div>

          <div className="space-y-3">
            <Button asChild variant="outline" className="w-full bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-100">
              <a href="https://itsjeevanvarghese.web.app" target="_blank" rel="noopener noreferrer">
                Visit itsjeevanvarghese.web.app for more softwares.
              </a>
            </Button>

            <Button asChild variant="ghost" className="w-full text-slate-400 hover:text-slate-100 hover:bg-slate-800">
              <a href="https://github.com/jeevanvarghese579/quiz-marks-projector" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
