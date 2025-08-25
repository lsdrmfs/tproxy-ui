import { wsConnections } from './api'
import { createSignal } from 'solid-js'
import { onCleanup } from "solid-js"

export default function Connect() {
    const [connections, setConnections] = createSignal<any[]>([])

    const ws = wsConnections((data) => {
        setConnections(data.connections)
    }, 1)

    onCleanup(() => ws.close())

    return (
        <div>
            {connections().map(c => (
                <div class="grid grid-cols-6 justify-center bg-base-200 p-3 text-center">
                    <div class="text-start"> {c.metadata.host || c.metadata.destinationIP}</div>
                    <div> {c.metadata.destinationPort}</div>
                    <div> {c.metadata.network}</div>
                    <div> {c.chains[0]}</div>
                    <div> {(c.download / (1024 * 1024)).toFixed(2)} MB</div>
                    <div>{c.metadata.sourceIP}:{c.metadata.sourcePort}</div>
                </div>
            ))}
        </div>
    )
}
