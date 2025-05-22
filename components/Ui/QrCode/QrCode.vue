<template>
	<div ref="qrCode"></div>
</template>

<script setup lang="ts">
	import type QRCodeStyling from 'qr-code-styling';
	import QrCodeImage from '~/public/android-chrome-192x192.png';
	import QrCodeImageGold from '~/public/android-chrome-192x192-gold.png';
	import { useBaseStore } from '~/store/base.store';

	const props = withDefaults(
		defineProps<{
			data: string;
			width?: number;
			height?: number;
		}>(),
		{
			width: 300,
			height: 300
		}
	);

	const { $qrCodeStyling } = useNuxtApp();
	const baseStore = useBaseStore();
	const qrCode = ref<HTMLElement | null>(null);

	// Default options
	const options = ref({
		width: props.width,
		height: props.height,
		type: 'svg',
		data: props.data,
		image: baseStore.isDarkMode ? QrCodeImageGold : QrCodeImage,
		dotsOptions: {
			color: '#000',
			type: 'rounded'
		},
		backgroundOptions: {
			color: '#fff'
		},
		imageOptions: {
			crossOrigin: 'anonymous',
			margin: 5
		}
	});

	let qrCodeStyling: QRCodeStyling = null;

	onMounted(() => {
		qrCodeStyling = $qrCodeStyling(options.value);
		// Append QR code to DOM element
		qrCodeStyling.append(qrCode.value);
		// Add viewbox to make it resizable
		if (qrCode.value?.firstChild)
			qrCode.value!.firstChild!?.setAttribute('viewBox', `0 0 ${props.width} ${props.height}`);
	});

	watch(
		() => props.data,
		(newValue: string) => {
			// Update QR code data when props change
			options.value.data = newValue;
			qrCodeStyling.update(options.value);
			// Add viewbox to make it resizable
			qrCode.value!.firstChild!.setAttribute('viewBox', `0 0 ${props.width} ${props.height}`);
		},
		{ deep: true }
	);
</script>

<style scoped>
	svg {
		width: 100%;
		height: 100%;
	}
</style>
