import { EventEmitter } from 'events'

// Minimal in-proc pub/sub for dev. Swap to Pusher/Ably in prod.
const bus = new EventEmitter()

export function publishPlanUpdated(userId: string, payload: any) {
  bus.emit(`plan:updated:${userId}`, payload)
}

export function subscribePlanUpdated(userId: string, cb: (p: any)=>void) {
  const ch = `plan:updated:${userId}`
  bus.on(ch, cb)
  return () => bus.off(ch, cb)
}

