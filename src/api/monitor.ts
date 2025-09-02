const BASE = 'http://10.1.1.1:99'
const SECRET = 'secret'

export async function getTraffic(onLine) {
  const res = await fetch(`${BASE}/traffic`, {
    headers: { Authorization: `Bearer ${SECRET}` },
  })

  const decoder = new TextDecoder()
  let buffer = ""

  for await (const chunk of res.body) {
    buffer += decoder.decode(chunk, { stream: true })
    const lines = buffer.split("\n")
    buffer = lines.pop()

    lines.forEach((line) => {
      if (line.trim()) onLine?.(line)
    })
  }

  if (buffer.trim()) onLine?.(buffer)
}

export async function getVersion() {
  const res = await fetch(`${BASE}/version`, {
    headers: { Authorization: `Bearer ${SECRET}` }
  })
  if (!res.ok) throw new Error(await res.text())
  const data = await res.json()
  return data
}