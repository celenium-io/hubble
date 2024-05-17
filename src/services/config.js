import { useAppStore } from "@/stores/app"

export const endpoints = {
	api: {
		mainnet: "https://api.celenium.io/v1",
		mocha: "https://api-mocha-4.celenium.io/v1",
		arabica: "https://api-arabica-11.celenium.io/v1",
	},
	wss: {
		mainnet: "wss://api.celenium.io/v1/ws",
		mocha: "wss://api-mocha-4.celenium.io/v1/ws",
		arabica: "wss://api-arabica-11.celenium.io/v1/ws",
	},
}

export const useServerURL = () => {
	const appStore = useAppStore()

	switch (appStore.network) {
		case "mainnet":
			return endpoints.api.mainnet

		case "arabica":
			return endpoints.api.arabica

		case "mocha":
			return endpoints.api.mocha

		default:
			return endpoints.api.mainnet
	}
}

export const useSocketURL = () => {
	const appStore = useAppStore()

	switch (appStore.network) {
		case "mainnet":
			return endpoints.wss.mainnet

		case "arabica":
			return endpoints.wss.arabica

		case "mocha":
			return endpoints.wss.mocha

		default:
			return endpoints.wss.mainnet
	}
}
