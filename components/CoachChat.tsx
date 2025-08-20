'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

type Msg = { role: 'user' | 'assistant' | 'tool'; text: string }

export function CoachChatDock() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>([])
  const esRef = useRef<EventSource | null>(null)

  function connect() {
    if (esRef.current) esRef.current.close()
    const es = new EventSource('/api/chat', { withCredentials: true } as any)
    esRef.current = es
    es.addEventListener('tool.call', (e: MessageEvent) => {
      const data = JSON.parse(e.data)
      setMessages((m) => [...m, { role: 'tool', text: JSON.stringify(data.args).slice(0, 200) + '…' }])
    })
    es.addEventListener('done', () => { es.close(); esRef.current = null })
    es.addEventListener('error', () => { es.close(); esRef.current = null })
  }

  async function send() {
    const text = input.trim()
    if (!text) return
    setMessages((m) => [...m, { role: 'user', text }])
    setInput('')
    await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text }) })
    connect()
  }

  useEffect(() => () => { if (esRef.current) esRef.current.close() }, [])

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button aria-label="Open coach chat">Coach Chat</Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[90vw] sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Coach</SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex flex-col h-[80vh]">
            <div className="flex-1 overflow-auto space-y-2 border rounded p-3">
              {messages.map((m, i) => (
                <div key={i} className="text-sm">
                  <b>{m.role}:</b> {m.text}
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input className="flex-1 border rounded px-3 py-2" value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Adjust the plan…" />
              <Button onClick={send}>Send</Button>
            </div>
            <div className="mt-2 flex gap-2 text-xs">
              {['Add a long Z2 ride Sunday','Deload next week','Shift intervals to Wed'].map((t)=>(
                <button key={t} onClick={()=>setInput(t)} className="px-2 py-1 border rounded">{t}</button>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

