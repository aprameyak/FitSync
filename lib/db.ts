import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { getCloudflareContext } from '@opennextjs/cloudflare'

const clients = new WeakMap<object, PrismaClient>()

function create() {
  return new PrismaClient({
    adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
  })
}

function getClient(): PrismaClient {
  const { ctx } = getCloudflareContext()
  let client = clients.get(ctx)
  if (!client) {
    client = create()
    clients.set(ctx, client)
  }
  return client
}

export const prisma = new Proxy({} as PrismaClient, {
  get: (_, prop) => Reflect.get(getClient(), prop),
})
