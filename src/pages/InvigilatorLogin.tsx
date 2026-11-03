import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShieldCheck } from "lucide-react"

// Import firebase config
import { auth, functions } from "@/lib/firebase/config"
import { signInAnonymously } from "firebase/auth"
import { httpsCallable } from "firebase/functions"

export default function InvigilatorLogin() {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code) return

    setLoading(true)
    setError("")

    try {
      // 1. Sign in anonymously
      await signInAnonymously(auth)

      // 2. Call cloud function to redeem code
      const redeemCode = httpsCallable(functions, "quizMarksRedeemAccessCode")
      const result = await redeemCode({ code })
      const data = result.data as any

      if (data.success) {
        navigate(`/invigilator/${data.quizId}?owner=${data.ownerUid}`)
      }
    } catch (err: any) {
      setError(err.message || "Invalid or expired code")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-4">
      <Card className="w-full max-w-sm bg-slate-900 text-slate-100 border-slate-800">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-indigo-500/10 p-3 rounded-full w-fit">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
          </div>
          <CardTitle className="text-2xl">Invigilator Access</CardTitle>
          <CardDescription className="text-slate-400">
            Enter your access code to begin scoring.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="e.g. SCIENCE-4827"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="bg-slate-950 border-slate-800 uppercase text-center text-lg tracking-widest"
                required
              />
            </div>
            {error && <p className="text-destructive text-sm text-center">{error}</p>}
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
              {loading ? "Verifying..." : "Access Quiz"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
