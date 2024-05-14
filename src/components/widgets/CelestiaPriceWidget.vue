<script setup>
/** Vendor */
import { ref, onMounted } from "vue"
import { DateTime } from "luxon"
import * as d3 from "d3"

/** API */
import { fetchPrice, fetchPriceSeries } from "@/services/api/stats"

const widgetEl = ref()
const chartEl = ref()

const price = ref(0)
const priceSeries = ref([])

const buildChart = () => {
	const data = priceSeries.value

	const width = widgetEl.value.wrapper.getBoundingClientRect().width
	const height = 140
	const marginTop = 0
	const marginRight = 0
	const marginBottom = 0
	const marginLeft = 0

	const MAX_VALUE = d3.max(data, (d) => d.value) ? d3.max(data, (d) => d.value) : 1

	/** Scale */
	const x = d3.scaleUtc(
		d3.extent(data, (d) => d.date),
		[marginLeft, width - marginRight],
	)
	const y = d3.scaleLinear([0, MAX_VALUE], [height - marginBottom - 6, marginTop])
	const line = d3
		.line()
		.x((d) => x(d.date))
		.y((d) => y(d.value))

	/** SVG Container */
	const svg = d3
		.create("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("viewBox", [0, 0, width, height])
		.attr("preserveAspectRatio", "none")
		.attr("style", "max-width: 100%;")
		.style("-webkit-tap-highlight-color", "transparent")

	/** Vertical Lines */
	svg.append("path")
		.attr("fill", "none")
		.attr("stroke", "var(--op-10)")
		.attr("stroke-width", 2)
		.attr("d", `M${marginLeft},${height - marginBottom + 2} L${marginLeft},${height - marginBottom - 5}`)
	svg.append("path")
		.attr("fill", "none")
		.attr("stroke", "var(--op-10)")
		.attr("stroke-width", 2)
		.attr("d", `M${width - 1},${height - marginBottom + 2} L${width - 1},${height - marginBottom - 5}`)

	/** Chart Line */
	svg.append("path")
		.attr("fill", "none")
		.attr("stroke", "var(--green)")
		.attr("stroke-width", 2)
		.attr("stroke-linecap", "round")
		.attr("stroke-linejoin", "round")
		.attr("d", line(data.slice(0, data.length - 1)))
	svg.append("path")
		.attr("fill", "none")
		.attr("stroke", "var(--green)")
		.attr("stroke-width", 2)
		.attr("stroke-linecap", "round")
		.attr("stroke-linejoin", "round")
		.attr("stroke-dasharray", "4")
		.attr("d", line(data.slice(data.length - 2, data.length)))

	if (chartEl.value.children[0]) chartEl.value.children[0].remove()
	chartEl.value.append(svg.node())
}

onMounted(async () => {
	price.value = await fetchPrice()
	priceSeries.value = await fetchPriceSeries({ timeframe: "1d" })
	priceSeries.value = priceSeries.value.reverse().map((s) => {
		return {
			date: DateTime.fromISO(s.time).toJSDate(),
			value: parseFloat(s.close),
		}
	})

	buildChart()
})
</script>

<template>
	<Flex ref="widgetEl" direction="column" justify="between" :class="$style.wrapper">
		<Flex wide justify="between">
			<Flex direction="column" gap="8">
				<Text size="16" weight="500" color="primary">Celestia Price</Text>
				<Flex align="center" gap="12">
					<Text size="13" weight="500" color="tertiary">Market Cap: $1.8B</Text>
					<Text size="13" weight="500" color="tertiary">Volume (24H): $108M</Text>
				</Flex>
			</Flex>

			<Text size="18" weight="600" color="primary" mono>${{ price.close }}</Text>
		</Flex>

		<div ref="chartEl" />
	</Flex>
</template>

<style module>
.wrapper {
	min-width: 500px;

	background: var(--card-background);

	padding: 20px 20px 0 20px;
}
</style>
