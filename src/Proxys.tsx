import { getNodes, getDelays, switchGroup, getTraffic, getMemory, getVersion } from './api'
import { createSignal, onMount } from 'solid-js'
import { effect } from 'solid-js/web'
export default function Proxys() {
  const [current, setCurrent] = createSignal<string>()
  const [proxys, setProxys] = createSignal<string[]>([])
  const [delays, setDelays] = createSignal<(number | null)[]>([])
  const [traffic, setTraffic] = createSignal<string>()
  const [memory, setMemory] = createSignal<string>()
  const [version, setVersion] = createSignal<string>()

  onMount(async () => {
    try {
      const version = await getVersion()
      setVersion(version.version)
      const proxys = await getNodes()
      setProxys(proxys.all)
      const delays = await getDelays(proxys.all)
      setDelays(delays)
    } catch (err) {
      console.error(err)
    }
  })

  effect(async () => {
    const group = await getNodes()
    setCurrent(group.now)
  })

  const changeProxy = async (proxy: string) => {
    await switchGroup(proxy)
    setCurrent(proxy)
  }

  return <div class='flex flex-col items-center gap-3 p-3 bg-base-100 h-screen'>
    <div class='flex gap-3'>
      <span>traffic</span>
      <span>memory</span>
      <span onClick={e => e}>connect</span>
    </div>
    <div class='grid grid-cols-3 items-center gap-6 h-full'>
      {proxys().map((proxy, i) => {
        return <div class='flex flex-col items-center gap-3' >
          <button
            class={`btn btn-base-content btn-lg rounded-full ${proxy === current() ? 'btn-primary' : ''}`}
            onClick={() => changeProxy(proxy)}
          >
            {proxy}
          </button>
          <div>
            {delays()[i] != null ? `${delays()[i]}` : '-'}
          </div>
        </div>
      })}
    </div>
  </div>
}
