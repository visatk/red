import { useState, useEffect } from 'react'

export default function Dashboard({ user, initData }: { user: any, initData: string }) {
  const [activeTab, setActiveTab] = useState<'home' | 'quests' | 'leaderboard'>('home')
  const [leaders, setLeaders] = useState<any[]>([])

  useEffect(() => {
    if (activeTab === 'leaderboard') {
      fetch('/api/leaderboard').then(r => r.json()).then(data => setLeaders(data.leaders))
    }
  }, [activeTab])

  const completeTask = async (taskId: string, url: string) => {
    window.Telegram?.WebApp?.openLink(url) // Open the link
    // Wait slightly, then reward (Lean MVP fake-verify)
    setTimeout(async () => {
      const res = await fetch('/api/tasks/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, taskId })
      })
      if (res.ok) {
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success')
        // In a real app, refresh user state here
        alert('Task Complete! +50 Points') 
      }
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 font-sans pb-24">
      <div className="max-w-md mx-auto space-y-6">
        
        <header className="text-center py-6">
          <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            {user.points} <span className="text-xl text-neutral-400">PTS</span>
          </h1>
          <div className="mt-2 inline-block bg-neutral-900 px-4 py-1.5 rounded-full text-sm font-medium border border-neutral-800">
            🔥 Day {user.loginStreak} Streak
          </div>
        </header>

        {activeTab === 'home' && (
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-center">
            <h2 className="font-bold text-lg mb-2">Invite to Earn</h2>
            <p className="text-neutral-400 text-sm mb-4">Get 250 PTS for every friend you invite.</p>
            <button 
              onClick={() => {/* Share Logic Here */}}
              className="w-full bg-white text-black font-bold py-3.5 rounded-xl active:scale-95 transition-transform"
            >
              Share Link
            </button>
          </section>
        )}

        {activeTab === 'quests' && (
          <section className="space-y-3">
            <h2 className="font-bold text-lg px-2">Earn More Points</h2>
            <button onClick={() => completeTask('join_tg', 'https://t.me/your_channel')} className="w-full flex items-center justify-between bg-neutral-900 p-4 rounded-xl border border-neutral-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">✈️</div>
                <div className="text-left"><p className="font-semibold">Join Channel</p></div>
              </div>
              <span className="font-bold text-yellow-500">+50</span>
            </button>
            <button onClick={() => completeTask('follow_x', 'https://x.com/your_handle')} className="w-full flex items-center justify-between bg-neutral-900 p-4 rounded-xl border border-neutral-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-white">𝕏</div>
                <div className="text-left"><p className="font-semibold">Follow on X</p></div>
              </div>
              <span className="font-bold text-yellow-500">+50</span>
            </button>
          </section>
        )}

        {activeTab === 'leaderboard' && (
          <section className="space-y-3">
            <h2 className="font-bold text-lg px-2">Global Top 50</h2>
            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
              {leaders.map((leader, i) => (
                <div key={i} className="flex justify-between items-center p-4 border-b border-neutral-800/50 last:border-0">
                  <div className="flex items-center space-x-3">
                    <span className="text-neutral-500 font-bold w-4">{i + 1}</span>
                    <span className="font-semibold">{leader.firstName}</span>
                  </div>
                  <span className="text-yellow-500 font-bold">{leader.points}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Navigation */}
        <nav className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-neutral-900/90 backdrop-blur border border-neutral-800 rounded-2xl p-1.5 flex justify-between">
          {['home', 'quests', 'leaderboard'].map(tab => (
            <button
              key={tab}
              onClick={() => window.Telegram?.WebApp?.HapticFeedback?.selectionChanged() && setActiveTab(tab as any)}
              className={`flex-1 py-3 text-sm font-semibold capitalize rounded-xl transition-colors ${activeTab === tab ? 'bg-neutral-800 text-white' : 'text-neutral-500'}`}
            >
              {tab}
            </button>
          ))}
        </nav>

      </div>
    </div>
  )
}
