<script setup>
/** Vendor */
import { ref, onMounted } from "vue"

/** API */
import { fetchTps } from "@/services/api/general"

const tps = ref()

onMounted(async () => {
	tps.value = await fetchTps()
})
</script>

<template>
	<Flex direction="column" gap="12">
		<Flex align="center" gap="6">
			<Flex align="center" gap="6">
				<div
					v-for="(bar, idx) in 20"
					:class="[$style.bar, tps && (tps.current * 60 * 100) / (tps.high * 60) > idx * 5 && $style.active]"
				/>
			</Flex>

			<Flex align="center" :class="$style.current">
				<Text size="14" weight="600" color="primary" mono>
					{{ tps ? (tps.current * 60).toFixed(0) : 0 }}
				</Text>
			</Flex>
		</Flex>

		<Text size="12" weight="600" color="tertiary">Transactions per minute</Text>
	</Flex>
</template>

<style module>
.bar {
	width: 4px;
	height: 20px;

	border-radius: 50px;
	background: var(--op-10);

	&.active {
		background: var(--txt-secondary);
		box-shadow: 0 0 10px rgba(255, 255, 255, 50%);
	}
}

.current {
	height: 20px;

	border-radius: 5px;
	background: var(--op-10);

	padding: 0 6px;
}
</style>
