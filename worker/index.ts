import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { drizzle } from 'drizzle-orm/d1'
import { eq, sql } from 'drizzle-orm'
import { users, referrals } from './schema'
import { verifyTelegramAuth } from './auth'

type Bindings = {
  DB: D1Database
  TELEGRAM_BOT_TOKEN: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())

app.post('/api/auth/login', async (c) => {
  const { initData } = await c.req.json()
  
  const isValid = await verifyTelegramAuth(initData, c.env.TELEGRAM_BOT_TOKEN)
  if (!isValid) {
    return c.json({ error: 'Unauthorized payload' }, 401)
  }

  const urlParams = new URLSearchParams(initData)
  const userStr = urlParams.get('user')
  // Extract structural start_param (Referral Payload) from Telegram URL[cite: 2]
  const startParam = urlParams.get('start_param') || '' 
  
  if (!userStr) {
    return c.json({ error: 'No user data found' }, 400)
  }

  const tgUser = JSON.parse(userStr)
  const db = drizzle(c.env.DB)

  // Check if user is already existing
  let user = await db.select().from(users).where(eq(users.telegramId, tgUser.id.toString())).get()

  if (!user) {
    let referrerId: string | null = null
    
    // Parse referral code if present (Format expected: ref_123456)
    if (startParam.startsWith('ref_')) {
      const potentialReferrer = startParam.replace('ref_', '')
      if (potentialReferrer !== tgUser.id.toString()) {
        referrerId = potentialReferrer
      }
    }

    // Insert new user with referral tracking links
    await db.insert(users).values({
      telegramId: tgUser.id.toString(),
      firstName: tgUser.first_name,
      username: tgUser.username || null,
      referredBy: referrerId,
      points: referrerId ? 100 : 0 // Welcome bonus for joining via link
    }).execute()

    // If referred by another valid active user, handle viral mechanics loop
    if (referrerId) {
      try {
        await db.insert(referrals).values({
          referrerId: referrerId,
          referredId: tgUser.id.toString(),
          pointsAwarded: 250 // Referrer incentive reward
        }).execute()

        // Atomically increment referrer's score balance
        await db.update(users)
          .set({ points: sql`${users.points} + 250` })
          .where(eq(users.telegramId, referrerId))
          .execute()
      } catch (e) {
        // Soft fail on referral collision constraints to protect auth loop pipeline
      }
    }

    user = await db.select().from(users).where(eq(users.telegramId, tgUser.id.toString())).get()
  }

  return c.json({ success: true, user })
})

app.get('/api/referrals/stats/:telegramId', async (c) => {
  const telegramId = c.req.param('telegramId')
  const db = drizzle(c.env.DB)

  const activeReferrals = await db
    .select()
    .from(referrals)
    .where(eq(referrals.referrerId, telegramId))
    .execute()

  return c.json({
    count: activeReferrals.length,
    earnings: activeReferrals.reduce((acc, row) => acc + (row.pointsAwarded || 0), 0)
  })
})

export default app
