import app from './app'
import { prisma } from './lib/prisma'

const PORT = process.env.PORT || 4000

async function bootstrap() {
  try {
    await prisma.$connect()
    console.log('Connected to database')

    app.listen(PORT, () => {
      console.log(`MediStore server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

bootstrap()
