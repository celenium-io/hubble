import { ref, computed } from "vue"
import { defineStore } from "pinia"

export const useAppStore = defineStore("app", () => {
	const network = ref("mainnet")
	const head = ref()

	return { network, head }
})
