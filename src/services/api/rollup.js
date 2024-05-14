/** Services */
import { useServerURL } from "@/services/config"

export const fetchRollups = async ({ limit, offset, sort, sort_by }) => {
	try {
		const url = new URL(`${useServerURL()}/rollup`)

		if (limit) url.searchParams.append("limit", limit)
		if (offset) url.searchParams.append("offset", offset)
		if (sort) url.searchParams.append("sort", sort)
		if (sort_by) url.searchParams.append("sort_by", sort_by)

		const data = await fetch(url.href).then((r) => r.json())
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchRollupsCount = async () => {
	try {
		const url = new URL(`${useServerURL()}/rollup/count`)

		const data = await fetch(url.href).then((r) => r.json())
		return data
	} catch (error) {
		console.error(error)
	}
}
