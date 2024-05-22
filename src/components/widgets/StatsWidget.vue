<script setup>
/** Vendor */
import { ref, watch, onMounted } from "vue"
import { DateTime } from "luxon"

/** Services */
import { comma } from "@/services/amounts"
import { formatBytes } from "@/services/general"

/** API */
import { fetchHead } from "@/services/api/general"

/** Store  */
import { useAppStore } from "@/stores/app"
const appStore = useAppStore()

const head = ref({})
const when = ref(0)

const getHead = async () => {
	head.value = await fetchHead()
	when.value = new Date().getTime()

	appStore.head = head.value
}

onMounted(async () => {
	getHead()
	setInterval(() => {
		getData()
	}, 60_000 * 60)
})

watch(
	() => appStore.network,
	() => {
		getHead()
	},
)
</script>

<template>
	<Flex :class="$style.wrapper">
		<Flex direction="column" gap="4" wide :class="$style.table">
			<Flex direction="column" justify="between" :class="$style.items">
				<Flex align="center" gap="12">
					<Text size="14" weight="500" color="tertiary" no-wrap> Total Transactions </Text>

					<div :class="$style.dots" />

					<Text size="14" weight="600" color="primary" mono> {{ comma(head.total_tx) }} </Text>
				</Flex>
				<Flex align="center" gap="12">
					<Text size="14" weight="500" color="tertiary" no-wrap> Blobs Size </Text>

					<div :class="$style.dots" />

					<Text size="14" weight="600" color="primary" mono no-wrap> {{ formatBytes(head.total_blobs_size) }} </Text>
				</Flex>
				<Flex align="center" gap="12">
					<Text size="14" weight="500" color="tertiary" no-wrap> Total Fees </Text>

					<div :class="$style.dots" />

					<Text size="14" weight="600" color="primary" mono no-wrap>
						{{ comma(parseInt(head.total_fee / 1_000_000)) }} <Text color="tertiary">TIA</Text>
					</Text>
				</Flex>
				<Flex align="center" gap="12">
					<Text size="14" weight="500" color="tertiary" no-wrap> Total Supply</Text>

					<div :class="$style.dots" />

					<Text size="14" weight="600" color="primary" mono no-wrap>
						{{ comma(parseInt(head.total_supply / 1_000_000)) }} <Text color="tertiary">TIA</Text>
					</Text>
				</Flex>
			</Flex>

			<Flex align="center" justify="between" :class="$style.bottom">
				<Text size="13" weight="500" color="tertiary">
					Celestia Metrics by <a href="https://celenium.io" target="_blank">Celenium</a>
				</Text>
				<Text size="13" weight="500" color="support">Updated {{ DateTime.fromMillis(when).toFormat("T") }}</Text>
			</Flex>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	min-height: 220px;

	background: var(--card-background);

	padding: 20px;
}

.table {
	overflow: hidden;

	border-radius: 12px;
	border: 2px solid var(--op-10);
	background: rgba(0, 0, 0, 20%);
}

.items {
	height: 100%;

	padding: 16px;
}

.dots {
	width: 100%;
	height: 3px;

	background-image: linear-gradient(to right, var(--op-10) 33%, rgba(255, 255, 255, 0) 0%);
	background-position: bottom;
	background-size: 6px 3px;
	background-repeat: repeat-x;
}

.bottom {
	background: var(--op-5);

	padding: 12px 16px;
}
</style>
