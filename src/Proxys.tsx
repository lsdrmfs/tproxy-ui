import { getNodes, getDelays, switchGroup, getTraffic } from './api'
import { createSignal, onMount } from 'solid-js'
import { effect } from 'solid-js/web'
export default function Proxys() {
  const [current, setCurrent] = createSignal<string>()
  const [proxys, setProxys] = createSignal<string[]>([])
  const [delays, setDelays] = createSignal<(number | null)[]>([])
  const [traffic, setTraffic] = createSignal({ up: 0, down: 0 })

  onMount(() => {
    getTraffic((line) => {
      try {
        const obj = JSON.parse(line) // 解析 JSON
        setTraffic(obj)              // 更新 signal
      } catch (e) {
        console.error("JSON 解析失败:", line)
      }
    })
  })

  onMount(async () => {
    const proxys = await getNodes()
    setProxys(proxys.all)
    const delays = await getDelays(proxys.all)
    setDelays(delays)
  })

  effect(async () => {
    const group = await getNodes()
    setCurrent(group.now)
  })

  const changeProxy = async (proxy: string) => {
    await switchGroup(proxy)
    setCurrent(proxy)
  }

  return <div class='flex flex-col justify-center items-center gap-3 p-3 h-dvh'>
    <div class='flex gap-11 text-lg p-3'>
      <span>↑ {(traffic()?.up / 1024).toFixed(2)} k/s</span>
      <span>↓ {(traffic()?.down / 1024).toFixed(2)} k/s</span>
    </div>
    <div class='grid sm:grid-cols-3 place-items-center gap-6'>
      {proxys().map((proxy, i) => {
        return <div class='flex flex-col items-center gap-3' >
          <button
            class={`btn btn-lg rounded-full ${proxy === current() ? 'btn-primary' : ''}`}
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
