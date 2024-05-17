<script setup>
/** Vendor */
import { ref, onMounted } from "vue"
import { DateTime } from "luxon"

/** UI */
import Tooltip from "@/components/ui/Tooltip.vue"

/** API */
import { fetchGasPriceSeries } from "@/services/api/stats"

const gasPriceSeries = ref([])
const maxValue = ref(0)

onMounted(async () => {
	gasPriceSeries.value = (
		await fetchGasPriceSeries({
			timeframe: "day",
			from: parseInt(DateTime.now().minus({ days: 30 }).ts / 1_000),
			to: parseInt(DateTime.now().plus({ minutes: 1 }).ts / 1_000),
		})
	).reverse()

	maxValue.value = Math.max(...gasPriceSeries.value.map((s) => parseFloat(s.value)))
})
</script>

<template>
	<Flex direction="column" justify="between" gap="16" :class="$style.wrapper">
		<Flex direction="column" gap="8">
			<Text size="16" weight="500" color="primary">Gas Price</Text>
			<Text size="13" weight="500" color="tertiary">Last 30 days</Text>
		</Flex>

		<Flex :class="$style.chart">
			<Tooltip v-for="bar in gasPriceSeries" wide tall alignEnd side="top" :class="$style.bar_wrapper">
				<div :style="{ height: `${parseFloat((bar.value * 100) / maxValue)}%` }" :class="[$style.bar]" />

				<template #content>
					<Flex direction="column" align="center" gap="6">
						<Text> {{ parseFloat(bar.value).toFixed(4) }} UTIA </Text>
						<Text color="tertiary"> {{ DateTime.fromISO(bar.time).setLocale("en").toFormat("ff") }} </Text>
					</Flex>
				</template>
			</Tooltip>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	min-width: 500px;
	min-height: 220px;

	background: var(--card-background);

	padding: 20px;
}

.chart {
	height: 100%;

	border-radius: 10px;
	overflow: hidden;
	background-image: url("/point.svg");
}

.bar_wrapper {
	display: flex;
	flex-direction: column;
	justify-content: flex-end;

	width: 100%;
	height: 100%;
}

.bar {
	width: 100%;
	height: 0%;

	background: linear-gradient(rgba(255, 255, 255, 15%), rgba(255, 255, 255, 00%));
	border-top: 2px solid var(--txt-secondary);
}
</style>
