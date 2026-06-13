import { useState, useEffect } from 'react'

interface User {
  telegramId: string;
  firstName: string;
  username?: string;
  points: number;
}

export default function Dashboard({ user }: { user: User }) {
  const [refStats, setRefStats] = useState({ count: 0, earnings: 0 })
  const [copied, setCopied] = useState(false)
  
  // Set dynamic configurations dynamically optimized for clean distributions
  const botUsername = "YOUR_BOT_USERNAME" // Replace with native BotFather alias
  const appSlug = "king_app" // Replace with direct URL configuration slug from BotFather
  const referralLink = `https://t.me/${botUsername}/${appSlug}?startapp=ref_${user?.telegramId}`

  useEffect(() => {
    if (user?.telegramId) {
      fetch(`/api/referrals/stats/${user.telegramId}`)
        .then(res => res.json())
        .then(data => setRefStats(data))
        .catch(() => {})
    }
  }, [user])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success')[cite: 2]
    } catch (err) {
      // Fallback
    }
  }

  const shareViaTelegram = () => {
    const shareText = encodeURIComponent(`👑 Join King App with me! Claim 100 welcome bonus points instantly. 🚀`)
    const tgShareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${shareText}`
    window.Telegram?.WebApp?.openTelegramLink(tgShareUrl)[cite: 2]
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 font-sans selection:bg-blue-500/30">
      <div className="max-w-md mx-auto space-y-5">
        
        {/* Dynamic Context Header Profile Layout */}
        <header className="flex items-center justify-between bg-neutral-900/40 border border-neutral-800/60 p-4 rounded-2xl backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full flex items-center justify-center font-bold text-white shadow-md">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-sm font-medium text-neutral-400">Account Verified</h1>
              <p className="text-base font-bold leading-tight">{user?.firstName}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
              ⚡ {user?.points + refStats.earnings} PTS
            </span>
          </div>
        </header>

        {/* Viral Loop Engine Hook Card Interface Component */}
        <section className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-600/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              Invite Friends. Earn Crypto.
            </h2>
            <p className="text-sm text-neutral-400 max-w-xs mx-auto">
              Get <span className="text-white font-semibold">250 points</span> for every user who registers through your personal network invitation.
            </p>
          </div>

          {/* Referral Analytics Engine Grid Tracking View */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-neutral-950/60 border border-neutral-800/40 p-4 rounded-xl text-center">
              <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-0.5">Total Invited</p>
              <p className="text-2xl font-black text-white">{refStats.count}</p>
            </div>
            <div className="bg-neutral-950/60 border border-neutral-800/40 p-4 rounded-xl text-center">
              <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-0.5">Bonus Generated</p>
              <p className="text-2xl font-black text-green-400">+{refStats.earnings}</p>
            </div>
          </div>

          {/* High Conversion Loop Actions Call to Execution */}
          <div className="space-y-2">
            <button
              onClick={shareViaTelegram}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/20 active:scale-[0.99]"
            >
              <span>Send Invite Link</span>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.62.15-.15 2.73-2.5 2.78-2.7.01-.03.01-.15-.06-.21-.07-.06-.17-.04-.25-.02-.11.02-1.83 1.16-5.16 3.42-.49.34-.93.51-1.33.5-.44-.01-1.29-.25-1.92-.45-.77-.25-1.39-.39-1.34-.83.03-.23.35-.46.97-.71 3.82-1.66 6.37-2.75 7.64-3.28 3.65-1.53 4.41-1.8 4.9-.19l.06.02-.03.14z"/>
              </svg>
            </button>
            
            <button
              onClick={copyToClipboard}
              className={`w-full font-semibold py-3 rounded-xl border transition-all duration-200 text-sm ${
                copied 
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                  : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              {copied ? '✓ Link Copied' : 'Copy Personal Invite Link'}
            </button>
          </div>
        </section>

        {/* Footer actions controls layout UI */}
        <footer className="pt-2">
          <button 
            onClick={() => window.Telegram?.WebApp?.close()}[cite: 2]
            className="w-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-sm font-medium py-3 rounded-xl transition-colors border border-neutral-800/40"
          >
            Exit Hub
          </button>
        </footer>
      </div>
    </div>
  )
}
