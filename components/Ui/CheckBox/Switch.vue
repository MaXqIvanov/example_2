<template>
	<label class="switch">
		<input
			type="checkbox"
			v-model="modelValue"
			:disabled="isDisabled"
		/>
		<span class="slider round"></span>
	</label>
</template>

<script setup lang="ts">
	const modelValue = defineModel('modelValue', { required: true, type: Boolean });
	const props = withDefaults(
		defineProps<{
			isDisabled: boolean;
		}>(),
		{}
	);
</script>

<style scoped lang="scss">
	/* The switch - the box around the slider */
	.switch {
		position: relative;
		display: inline-block;
		width: 40px;
		min-width: 40px;
		height: 24px;
	}

	/* Hide default HTML checkbox */
	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	/* The slider */
	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		-webkit-transition: 0.4s;
		transition: 0.4s;
	}

	.slider:before {
		position: absolute;
		content: '';
		height: 20px;
		width: 20px;
		left: 3px;
		bottom: 2.5px;
		background-color: white;
		-webkit-transition: 0.4s;
		transition: 0.4s;
	}

	input:checked + .slider {
		background-color: var(--color_radiobutton_font);
	}

	input:focus + .slider {
		box-shadow: 0 0 1px var(--color_radiobutton_font);
	}

	input:checked + .slider:before {
		-webkit-transform: translateX(14px);
		-ms-transform: translateX(14px);
		transform: translateX(14px);
	}

	/* Rounded sliders */
	.slider.round {
		border-radius: 34px;
	}

	.slider.round:before {
		border-radius: 50%;
	}
</style>
