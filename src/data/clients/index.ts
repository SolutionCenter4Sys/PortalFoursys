import type { ClientConfig } from '../../types'
import type { Language } from '../../i18n/types'
import { santanderClient, getSantanderClient } from './santander'
import { bradescoClient, getBradescoClient } from './bradesco'
import { equifaxClient, getEquifaxClient } from './equifax'
import { itauClient, getItauClient } from './itau'
import { itforumClient, getItforumClient } from './itforum'

export const clients: ClientConfig[] = [
  itforumClient,
  santanderClient,
  bradescoClient,
  equifaxClient,
  itauClient,
]

export function getAllClients(lang?: Language): ClientConfig[] {
  const l = lang ?? 'pt'
  return [
    getItforumClient(l),
    getSantanderClient(l),
    getBradescoClient(l),
    getEquifaxClient(l),
    getItauClient(l),
  ]
}

export function getClientById(id: string, lang?: Language): ClientConfig | undefined {
  return getAllClients(lang).find(c => c.id === id)
}

export { santanderClient, bradescoClient, equifaxClient, itauClient, itforumClient }
