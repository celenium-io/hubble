<script setup>
/** Vendor */
import { ref, watch, onMounted } from "vue"
import { DateTime } from "luxon"

/** Services */
import { formatBytes } from "@/services/general"

/** API */
import { fetchSeries } from "@/services/api/stats"

/** Store */
import { useAppStore } from "@/stores/app"
const appStore = useAppStore()

const series = ref([])
const maxSize = ref(0)

const getData = async () => {
	series.value = await fetchSeries({
		table: "blobs_size",
		period: "day",
		from: parseInt(DateTime.now().minus({ day: 60 }).ts / 1_000),
		to: parseInt(DateTime.now().ts / 1_000),
	})

	for (let i = 0; i < 40; i++) {
		series.value.push({ time: null, value: null })
	}

	maxSize.value = Math.max(...series.value.map((s) => s.value))
}

onMounted(() => {
	getData()
})

watch(
	() => appStore.network,
	() => {
		getData()
	},
)
</script>

<template>
	<Flex direction="column" justify="between" gap="24" :class="$style.wrapper">
		<Flex justify="between">
			<Flex direction="column" gap="8">
				<Text size="16" weight="500" color="primary">Blobs Flow</Text>
				<Text size="13" weight="500" color="tertiary">Highest in 60 days: {{ formatBytes(maxSize) }}</Text>
			</Flex>

			<Flex direction="column" align="end" gap="8">
				<Text size="18" weight="600" color="primary" mono>+{{ formatBytes(series[0]?.value) }}</Text>
				<Text size="13" weight="500" color="tertiary">Today</Text>
			</Flex>
		</Flex>

		<Flex gap="8" :class="$style.days">
			<Flex v-for="day in series" align="end" :class="$style.day">
				<div
					:style="{ height: ` ${day.value ? (day.value * 100) / maxSize : 5}%` }"
					:class="[$style.bar, day.value && $style.active]"
				/>
			</Flex>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	width: 100%;

	background: var(--card-background);

	padding: 20px;
}

.days {
	height: 100%;
}

.day {
	height: 100%;
}

.bar {
	width: 1px;
	height: 10px;

	background: var(--op-30);

	&.active {
		background: var(--green);
		box-shadow: 0 0 10px rgba(10, 222, 113, 40%);
	}
}
</style>
