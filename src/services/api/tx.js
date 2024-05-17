/** Services */
import { useServerURL } from "@/services/config"

export const fetchThxByHeight = async ({ limit, offset, sort, height, from, status, type, excluded_types }) => {
	try {
		const url = new URL(`${useServerURL()}/tx`)

		url.searchParams.append("height", height)
		if (from) url.searchParams.append("from", from)
		if (limit) url.searchParams.append("limit", limit)
		if (sort) url.searchParams.append("sort", sort)
		if (offset) url.searchParams.append("offset", offset)
		if (status) url.searchParams.append("status", status)
		if (type) url.searchParams.append("msg_type", type)
		if (excluded_types) url.searchParams.append("excluded_msg_type", excluded_types)

		const data = await fetch(url.href).then((r) => r.json())
		return data
	} catch (error) {
		console.error(error)
	}
}
