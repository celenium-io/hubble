export const formatBytes = (bytes, decimals = 2) => {
	if (!+bytes) return "0 Byte"

	const dm = decimals < 0 ? 0 : decimals
	const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"]

	const i = Math.floor(Math.log(bytes) / Math.log(1024))

	return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(dm))} ${sizes[i]}`
}

export const getCeleniumURL = (network) => {
	switch (network) {
		case "mainnet":
			return "https://celenium.io"

		case "mocha":
			return "https://mocha.celenium.io"

		case "arabica":
			return "https://arabica.celenium.io"
	}
}
