<script setup>
/** Vendor */
import { watch } from "vue"

/** Services */
import { getCeleniumURL } from "@/services/general"

/** Store */
import { useAppStore } from "@/stores/app"
const appStore = useAppStore()

const props = defineProps({
	txs: {
		type: Array,
		default: [],
	},
})
</script>

<template>
	<Flex direction="column" gap="16" :class="$style.wrapper">
		<Text size="12" weight="600" color="tertiary">Latest Transactions</Text>

		<a v-for="tx in txs" gap="8" :href="`${getCeleniumURL(appStore.network)}/tx/${tx.hash}`" target="_blank">
			<Flex gap="8">
				<Flex direction="column" align="center" gap="8">
					<div :class="$style.circle" />
					<div :class="$style.line" />
				</Flex>

				<Flex direction="column" gap="6">
					<Flex align="center" gap="6">
						<Text size="14" weight="600" color="primary" mono style="text-transform: uppercase">
							<Text color="secondary" style="text-transform: capitalize"> Tx</Text> {{ tx.hash.slice(0, 4) }}...{{
								tx.hash.slice(-4)
							}}
						</Text>
						<Icon name="arrow-top-right" size="14" color="tertiary" />
					</Flex>
					<Text size="14" weight="500" height="140" color="tertiary" mono> {{ tx.message_types.join(", ") }} </Text>
					<Text size="13" weight="600" color="support" mono :class="$style.when"> Events: {{ tx.events_count }} </Text>
				</Flex>
			</Flex>
		</a>
	</Flex>
</template>

<style module>
.wrapper {
	max-width: 300px;
	flex: 1;

	overflow: auto;
	min-height: 0;
}

.wrapper::-webkit-scrollbar {
	display: none;
}

.circle {
	min-width: 10px;
	min-height: 10px;

	border-radius: 50%;
	border: 2px solid var(--green);

	margin-top: 3px;
}

.line {
	width: 2px;
	height: 100%;

	background: var(--op-5);
}

.when {
	margin-bottom: 14px;
}
</style>
