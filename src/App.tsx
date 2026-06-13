import { useEffect, useState } from 'react'
import Dashboard from './Dashboard'

declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    }
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    const initData = tg?.initData

    if (initData) {
      // Ready & expand telegram view
      tg.ready()
      tg.expand()
      
      // Setup dynamic UI colors based on telegram theme
      document.body.style.backgroundColor = tg.themeParams.bg_color || '#000'
      document.body.style.color = tg.themeParams.text_color || '#fff'

      // Auto-Login
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUserData(data.user)
          setIsAuthenticated(true)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return <div className="flex h-screen items-center justify-center font-semibold text-lg">Loading App...</div>
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col h-screen items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">King App</h1>
        <p className="opacity-70">Please open this application directly inside Telegram to continue.</p>
      </div>
    )
  }

  return <Dashboard user={userData} />
}

export default App
