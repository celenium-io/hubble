<script setup>
defineProps({
	disabled: Boolean,
})
</script>

<template>
	<div :class="[$style.wrapper, disabled && $style.disabled]" tabindex="1">
		<slot />
	</div>
</template>

<style module>
.wrapper {
	display: flex;
	align-items: center;

	min-width: 120px;
	padding: 10px 10px;

	transform-style: preserve-3d;
	-webkit-transform-style: preserve-3d;
	backface-visibility: hidden;
	-webkit-backface-visibility: hidden;
	transform: translateZ(0);

	font-size: 14px;
	font-weight: 600;
	line-height: 14px;
	color: var(--txt-body);
	white-space: nowrap;

	cursor: pointer;

	transition: all 0.1s ease;
}

.wrapper.disabled {
	opacity: 0.5;
	pointer-events: none;
}

.wrapper:hover {
	background: var(--op-5);
}

.wrapper:focus {
	outline: none;
	background: rgba(255, 255, 255, 0.05);
}
</style>
