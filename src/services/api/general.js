/** Services */
import { useServerURL } from "@/services/config"

export const fetchHead = async () => {
	try {
		const url = new URL(`${useServerURL()}/head`)

		const data = await fetch(url.href).then((r) => r.json())
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchTps = async () => {
	try {
		const url = new URL(`${useServerURL()}/stats/tps`)

		const data = await fetch(url.href).then((r) => r.json())
		return data
	} catch (error) {
		console.error(error)
	}
}
