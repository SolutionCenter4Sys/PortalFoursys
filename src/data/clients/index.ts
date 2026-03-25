import type { ClientConfig } from '../../types'
import { santanderClient } from './santander'
import { bradescoClient } from './bradesco'
import { equifaxClient } from './equifax'

export const clients: ClientConfig[] = [
  santanderClient,
  bradescoClient,
  equifaxClient,
]

export function getClientById(id: string): ClientConfig | undefined {
  return clients.find(c => c.id === id)
}

export { santanderClient, bradescoClient, equifaxClient }
