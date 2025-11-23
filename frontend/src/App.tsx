import { Routes, Route, Navigate } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Groups from './pages/Groups'
import Students from './pages/Students'
import Subjects from './pages/Subjects'
import UsersManagement from './pages/UsersManagement';
import AssignDisciplines from './pages/AssignDisciplines';
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/onboarding" replace />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/groups" element={<Groups />} />
                    <Route path="/students" element={<Students />} />
                    <Route path="/subjects" element={<Subjects />} />
                    <Route path="/users-management" element={<UsersManagement />} />
                    <Route path="/assign-disciplines" element={<AssignDisciplines />} />
                </Route>
            </Route>
        </Routes>
    )
}

export default App
