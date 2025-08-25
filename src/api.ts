const BASE = 'http://10.1.1.1:99'
const SECRET = 'secret'

export interface SelectorData {
    name: string
    type: string
    now: string
    all: string[]
    udp?: boolean
    history?: { time: string; delay: number }[]
}

export async function getNodes(): Promise<SelectorData> {
    const res = await fetch(`${BASE}/proxies/${encodeURIComponent('GLOBAL')}`, {
        headers: { Authorization: `Bearer ${SECRET}` }
    })
    if (!res.ok) throw new Error(await res.text())
    const data: SelectorData = await res.json()
    return data
}

export async function getDelays(nodeNames: string[] | undefined): Promise<(number | null)[]> {
    if (!Array.isArray(nodeNames)) {
        console.warn('getDelays: nodeNames is not an array, returning empty array.')
        return []
    }
    const delays = await Promise.all(
        nodeNames.map(async (node) => {
            try {
                const r = await fetch(`${BASE}/proxies/${encodeURIComponent(node)}/delay?timeout=3000&url=https://amd.com:`, {
                    headers: { Authorization: `Bearer ${SECRET}` }
                })
                if (!r.ok) throw new Error(await r.text())
                const delayData = await r.json() as { delay: number }
                return delayData.delay
            } catch (err: any) {
                console.warn(`Failed to get delay for ${node}:`, err.message)
                return null
            }
        })
    )
    return delays
}

export async function switchGroup(target: string): Promise<void> {
    const res = await fetch(`${BASE}/proxies/${encodeURIComponent('GLOBAL')}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SECRET}`
        },
        body: JSON.stringify({ name: target })
    })
    if (!res.ok) throw new Error(await res.text())
    console.log(`${target}`)
}

export function wsConnections(onMessage: (data: any) => void, interval = 1) {
    const url = `${BASE.replace(/^http/, "ws")}/connections?interval=${interval}&token=${SECRET}`

    const ws = new WebSocket(url)

    ws.onopen = () => {
        console.log("✅ Connected to /connections")
    }

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data)
            onMessage(data) // 把数据回调出去
        } catch (err) {
            console.error("❌ Parse error:", err)
        }
    }

    ws.onclose = () => {
        console.log("❌ WebSocket closed")
    }

    ws.onerror = (err) => {
        console.error("❌ WebSocket error:", err)
    }

    return ws
}

export async function getTraffic() {
    const res = await fetch(`${BASE}/traffic`, {
        headers: { Authorization: `Bearer ${SECRET}` }
    })
    if (!res.ok) throw new Error(await res.text())
    const data = await res.json()
    return data
}
export async function getMemory() {
    const res = await fetch(`${BASE}/memory`, {
        headers: { Authorization: `Bearer ${SECRET}` }
    })
    if (!res.ok) throw new Error(await res.text())
    const data = await res.json()
    return data
}
export async function getVersion() {
    const res = await fetch(`${BASE}/version`, {
        headers: { Authorization: `Bearer ${SECRET}` }
    })
    if (!res.ok) throw new Error(await res.text())
    const data = await res.json()
    return data
}