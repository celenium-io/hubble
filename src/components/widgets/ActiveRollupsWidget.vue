<script setup>
/** Vendor */
import { ref, watch, onMounted, onBeforeUnmount } from "vue"
import { DateTime } from "luxon"

/** Utils */
import { formatBytes, getCeleniumURL } from "@/services/general"

/** API */
import { fetchRollups, fetchRollupsCount } from "@/services/api/rollup"

/** Store */
import { useAppStore } from "@/stores/app"
const appStore = useAppStore()

const rollups = ref([])
const total = ref(0)
const totalSize = ref(0)

const availableSize = ref(0)

const rollupsEl = ref()

const getData = async () => {
	const rawRollups = await fetchRollups({ limit: 20, sort_by: "size" })
	rollups.value = rawRollups || []

	const rawCount = await fetchRollupsCount()
	total.value = rawCount

	totalSize.value = rawRollups.reduce((acc, curr) => (acc += curr.size), 0)
}

onMounted(async () => {
	availableSize.value = Math.floor((rollupsEl.value.wrapper.getBoundingClientRect().height - 32) / 68)

	getData()
	setInterval(() => {
		getData()
	}, 60_000 * 5)

	window.addEventListener("resize", onResize)
})

onBeforeUnmount(() => {
	window.removeEventListener("resize", onResize)
})

watch(
	() => appStore.network,
	() => {
		getData()
	},
)

const onResize = () => {
	availableSize.value = Math.floor((rollupsEl.value.wrapper.getBoundingClientRect().height - 32) / 72)
}
</script>

<template>
	<Flex direction="column" gap="24" :class="$style.wrapper">
		<Text size="16" weight="600" color="primary">Active Rollups</Text>

		<Flex align="center" gap="40">
			<Flex direction="column" gap="8">
				<Text size="24" weight="500" color="primary" mono>{{ formatBytes(totalSize) }}</Text>
				<Text size="14" weight="500" color="tertiary">Total Size</Text>
			</Flex>

			<Flex direction="column" gap="8">
				<Text size="24" weight="500" color="primary" mono>{{ total }}</Text>
				<Text size="14" weight="500" color="tertiary">Total Rollups</Text>
			</Flex>
		</Flex>

		<Flex ref="rollupsEl" direction="column" gap="8" :class="$style.rollups">
			<a
				v-for="(rollup, idx) in rollups.slice(0, availableSize)"
				:href="`${getCeleniumURL(appStore.network)}/rollup/${rollup.slug}`"
				target="_blank"
			>
				<Flex align="center" justify="between" :class="$style.rollup">
					<Flex align="center" gap="12">
						<Text size="16" weight="500" color="tertiary" :class="$style.counter">{{ idx + 1 }}</Text>

						<img :src="rollup.logo" />

						<Flex direction="column" gap="6">
							<Text size="14" weight="600" color="primary"> {{ rollup.name }} </Text>
							<Text size="13" weight="500" color="tertiary">
								{{ DateTime.fromISO(rollup.last_message_time).setLocale("en").toRelative() }}
							</Text>
						</Flex>
					</Flex>

					<Text size="14" weight="600" color="primary">{{ formatBytes(rollup.size) }}</Text>
				</Flex>
			</a>

			<a v-if="rollups.length > 0" href="https://celenium.io/rollups" target="_blank">
				<Flex justify="center" align="center" gap="6" :class="$style.btn">
					<Text size="13" weight="600" color="secondary">View all on Celenium Explorer</Text>
					<Icon name="arrow-top-right" size="14" color="secondary" />
				</Flex>
			</a>
		</Flex>

		<Text size="12" weight="500" color="support">Refetch every 5 minutes</Text>
	</Flex>
</template>

<style module>
.wrapper {
	height: 100%;

	background: var(--card-background);

	padding: 20px;
}

.rollups {
	flex: 1;
}

.rollup {
	min-height: 60px;

	box-shadow: 0 0 0 2px var(--op-5);
	border-radius: 8px;

	padding: 0 16px;

	& img {
		width: 40px;
		height: 40px;

		border-radius: 50%;
		background: var(--card-background);
	}

	& .counter {
		min-width: 20px;
	}
}

.btn {
	min-height: 32px;

	background: var(--card-background);
	border-radius: 8px;
	cursor: pointer;

	& span {
		transition: all 0.2s ease;
	}

	&:hover {
		box-shadow: inset 0 0 0 1px var(--op-5);

		& span {
			color: var(--txt-primary);
		}
	}
}
</style>
