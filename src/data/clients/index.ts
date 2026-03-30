import type { ClientConfig } from '../../types'
import { santanderClient } from './santander'
import { bradescoClient } from './bradesco'
import { equifaxClient } from './equifax'
import { itauClient } from './itau'

export const clients: ClientConfig[] = [
  itauClient,
  santanderClient,
  bradescoClient,
  equifaxClient,
]

export function getClientById(id: string): ClientConfig | undefined {
  return clients.find(c => c.id === id)
}

export { santanderClient, bradescoClient, equifaxClient, itauClient }
