"use client";
import { useEffect, useRef, useState } from "react";

export default function CoachPage() {
  const [messages, setMessages] = useState<{ role: 'user'|'assistant'; text: string }[]>([])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)

  async function send() {
    const text = input.trim()
    if (!text) return
    setMessages((m)=>[...m,{ role:'user', text }])
    setInput('')
    setPending(true)
    try {
      await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message: text }) })
      // For now, append a placeholder assistant response
      setMessages((m)=>[...m,{ role:'assistant', text: 'Got it — I will adjust your plan.' }])
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mx-auto max-w-[920px] px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-100 mb-2">Coach</h1>
      <p className="text-zinc-400 mb-6">Chat with your coach to adjust your plan in real time.</p>
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4 min-h-[50vh] flex flex-col">
        <div className="flex-1 space-y-3 overflow-auto">
          {messages.map((m,i)=> (
            <div key={i} className={m.role==='user'?'text-right':''}>
              <div className={`inline-block rounded-xl px-3 py-2 text-sm ${m.role==='user'?'bg-blue-600 text-white':'bg-neutral-900 text-zinc-200'}`}>{m.text}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input className="flex-1 rounded-md border border-neutral-800 bg-black px-3 py-2 text-sm text-zinc-100 outline-none focus-visible:ring-2 focus-visible:ring-zinc-700" placeholder="Ask your coach…" value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send() } }} />
          <button onClick={send} disabled={pending} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-600/90 disabled:opacity-50">Send</button>
        </div>
        <div className="mt-2 flex gap-2 text-xs">
          {['Add a long Z2 ride Sunday','Deload next week','Shift intervals to Wed'].map((s)=> (
            <button key={s} onClick={()=>setInput(s)} className="px-3 py-1 rounded-full border border-neutral-800 text-zinc-400 hover:text-zinc-100">{s}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

