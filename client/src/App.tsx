import ProfilePage from '@/pages/ProfilePage'
import { useAuthStore } from '@/store/useAuthStore'
import { Loader } from 'lucide-react'
import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/ui/Navbar'
import { HomePage, LoginPage, RegisterPage, SettingsPage } from './pages'
import { useThemeStore } from './store/useThemeStore'

type AppProps = {}

const App: React.FC<AppProps> = ({}) => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()
  const { theme, setTheme } = useThemeStore()
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader
          size={64}
          className="animate-spin"
        />
      </div>
    )
  }

  return (
    <main data-theme={theme}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/register"
          element={!authUser ? <RegisterPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/settings"
          element={<SettingsPage />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </main>
  )
}

export default App
