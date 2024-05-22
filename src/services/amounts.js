export const comma = (target, symbol = ",", fixed = 2) => {
	if (!target) return 0

	let num = parseFloat(target)

	if (num % 1 === 0) {
		num = num.toFixed(0)
	} else {
		num = num.toFixed(fixed)
	}

	if (num.includes(".")) {
		while (num[num.length - 1] === "0") {
			num = num.slice(0, num.length - 1)
		}
		if (num[num.length - 1] === ".") {
			num = num.slice(0, num.length - 1)
		}
	}

	if (num.split(".").length > 1 && fixed !== 2) {
		return `${num
			.split(".")[0]
			.toString()
			.replace(/\B(?=(\d{3})+(?!\d))/g, symbol)}.${num.split(".")[1]}`
		x
	} else {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, symbol)
	}
}

export const abbreviate = (n, h = 1) => {
	if (n < 1e3) return n
	if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(h) + "K"
	if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(h) + "M"
	if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(h) + "B"
	if (n >= 1e12) return +(n / 1e12).toFixed(h) + "T"
}
