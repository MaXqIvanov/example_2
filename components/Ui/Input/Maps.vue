<template>
	<div
		class="map"
		@click="openMapHandler"
	>
		<UiInput
			v-model="input"
			:label="label"
			:labelClass="labelClass"
			:maxWidth="maxWidth"
			:placeholder="placeHolder"
			:height="height"
			:readonly="readonly"
			:error="error"
			:required="required"
		>
			<template #right-icon>
				<UiIcon name="location" />
			</template>
		</UiInput>
		<UiModalDefault
			v-model="isOpenMap"
			width="90vw"
			height="90vh"
			title="Укажите место на карте"
		>
			<div
				class="map__container"
				id="map__container"
			></div>
		</UiModalDefault>
	</div>
</template>

<script setup lang="ts">
	import { useBaseStore } from '~/store/base.store';

	const baseStore = useBaseStore();
	const runtimeConfig = useRuntimeConfig();

	const isOpenMap = ref(false);

	useHead({
		script: [
			{
				...(!baseStore.isLoadMap && {
					src: `https://api-maps.yandex.ru/v3/?apikey=${runtimeConfig.public.tokenYMap}&lang=ru_RU`,
					async: true,
					value: 'load-map',
					id: 'load-map',
					onload: () => {
						baseStore.isLoadMap = true;
					}
				})
			}
		]
	});
	const emits = defineEmits(['update:modelValue', 'blur']);

	const props = withDefaults(
		defineProps<{
			modelValue: {
				address: string;
				comment?: string;
				latitude: number;
				longitude: number;
				id?: string;
			};
			label?: string;
			labelClass?: string;
			maxWidth?: string;
			placeHolder?: string;
			height?: string;
			readonly?: boolean;
			error?: { status: boolean; msg?: string | undefined };
			required?: boolean;
			latitudeDefault?: number;
			longitudeDefault?: number;
		}>(),
		{
			latitudeDefault: 55.733842,
			longitudeDefault: 37.588144
		}
	);

	const input = computed({
		get() {
			return props.modelValue.address;
		},
		set(v) {
			emits('update:modelValue', v);
		}
	});

	const openMapHandler = () => {
		isOpenMap.value = true;
		initMap();
	};

	const chooseHandler = async (object, event) => {
		const address = await getAddress(event.coordinates);
		const name = address[0].properties.name || '';
		const description = address[0].properties.description;

		emits('update:modelValue', {
			address: `${name}, ${description}`,
			longitude: address[0].geometry.coordinates[0],
			latitude: address[0].geometry.coordinates[1],
			comment: '',
			...(props.modelValue?.id && { id: props.modelValue.id })
		});
		isOpenMap.value = false;

		setTimeout(() => {
			emits('blur');
		});
	};

	const getAddress = async (coordinats: number[]) => {
		return await ymaps3.search({
			text: coordinats
		});
	};

	async function initMap() {
		// Промис `ymaps3.ready` будет зарезолвлен, когда загрузятся все компоненты основного модуля API
		await ymaps3.ready;

		const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls, YMapListener } = ymaps3;
		const { YMapGeolocationControl } = await ymaps3.import('@yandex/ymaps3-controls@0.0.1');
		const { YMapDefaultMarker } = await ymaps3.import('@yandex/ymaps3-markers@0.0.1');

		const coordinateCenter = [
			props.modelValue.longitude || props.longitudeDefault,
			props.modelValue.latitude || props.latitudeDefault
		];

		// Иницилиазируем карту
		const map = new YMap(
			// Передаём ссылку на HTMLElement контейнера
			document.getElementById('map__container'),

			// Передаём параметры инициализации карты
			{
				location: {
					// Координаты центра карты
					center: coordinateCenter,

					// Уровень масштабирования
					zoom: props.modelValue?.longitude ? 16 : 13
				}
			},
			[
				// Add a map scheme layer
				new YMapDefaultSchemeLayer({}),
				// Add a layer of geo objects to display the geolocation marker
				new YMapDefaultFeaturesLayer({})
			]
		);

		map
			.addChild(
				// Using YMapControls you can change the position of the control
				new YMapControls({ position: 'left bottom' })
					// Add the geolocation control to the map
					.addChild(new YMapGeolocationControl({}))
			)
			.addChild(
				new YMapListener({
					layer: 'any',
					onClick: chooseHandler
				})
			)
			.addChild(
				new YMapDefaultMarker({
					coordinates: coordinateCenter,
					color: 'var(--blue)'
				})
			);
	}
</script>

<style scoped lang="scss">
	.map {
		position: relative;

		&__container {
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;

			padding-top: $p-5;

			z-index: 1000;
			overflow: hidden;
		}
	}
</style>
