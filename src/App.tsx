import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import About from "./pages/About"
import AdminLayout from "./pages/admin/Layout"
import Dashboard from "./pages/admin/Dashboard"
import Quizzes from "./pages/admin/Quizzes"
import QuizDetail from "./pages/admin/QuizDetail"
import CreateQuiz from "./pages/admin/CreateQuiz"
import InvigilatorLogin from "./pages/InvigilatorLogin"
import InvigilatorScoring from "./pages/InvigilatorScoring"
import Projector from "./pages/Projector"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/about" element={<About />} />

        {/* Invigilator Routes */}
        <Route path="/invigilator/login" element={<InvigilatorLogin />} />
        <Route path="/invigilator/:quizId" element={<InvigilatorScoring />} />

        {/* Projector Route */}
        <Route path="/projector" element={<Projector />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="quizzes/new" element={<CreateQuiz />} />
          <Route path="quizzes/:quizId" element={<QuizDetail />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
