const BASE = import.meta.env.VITE_BASE
const SECRET = import.meta.env.VITE_SECRET

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