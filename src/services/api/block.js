/** Services */
import { useServerURL } from "@/services/config"

export const fetchBlockByHeight = async (height) => {
	try {
		const data = await fetch(`${useServerURL()}/block/${height}?stats=true`).then((r) => r.json())
		return data
	} catch (error) {
		console.error(error)
	}
}
