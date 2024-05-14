<template>
	<Flex direction="column" gap="8" :class="$style.wrapper">
		<Flex v-for="item in 9" gap="8">
			<Flex direction="column" align="center" gap="8">
				<div :class="$style.circle" />
				<div :class="$style.line" />
			</Flex>

			<Flex direction="column" gap="8">
				<Flex align="center" gap="6">
					<Text size="14" weight="600" color="primary" mono> <Text color="secondary">Tx</Text> AA1B...87A1 </Text>
					<Icon name="arrow-top-right" size="14" color="tertiary" />
				</Flex>
				<Text size="14" weight="500" color="tertiary" mono> UpdateClient, RecvPacket </Text>
				<Text size="13" weight="600" color="support" mono :class="$style.when"> 5 sec ago </Text>
			</Flex>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	flex: 1;

	overflow: hidden;
	min-height: 0;
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
