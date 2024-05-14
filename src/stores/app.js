import { ref, computed } from "vue"
import { defineStore } from "pinia"

export const useAppStore = defineStore("app", () => {
	const network = ref("mainnet")

	return { network }
})
