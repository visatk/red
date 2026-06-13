import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { drizzle } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import { users } from './schema'
import { verifyTelegramAuth } from './auth'

type Bindings = {
  DB: D1Database
  TELEGRAM_BOT_TOKEN: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())

app.post('/api/auth/login', async (c) => {
  const { initData } = await c.req.json()
  
  // Validate request via Telegram initData 
  const isValid = await verifyTelegramAuth(initData, c.env.TELEGRAM_BOT_TOKEN)
  if (!isValid) {
    return c.json({ error: 'Unauthorized payload' }, 401)
  }

  const urlParams = new URLSearchParams(initData)
  const userStr = urlParams.get('user')
  if (!userStr) {
    return c.json({ error: 'No user data found' }, 400)
  }

  const tgUser = JSON.parse(userStr)
  const db = drizzle(c.env.DB)

  // Auto-Login: Check existing or Insert new user
  let user = await db.select().from(users).where(eq(users.telegramId, tgUser.id.toString())).get()

  if (!user) {
    await db.insert(users).values({
      telegramId: tgUser.id.toString(),
      firstName: tgUser.first_name,
      username: tgUser.username || null,
    }).execute()
    user = await db.select().from(users).where(eq(users.telegramId, tgUser.id.toString())).get()
  }

  return c.json({ success: true, user })
})

export default app
