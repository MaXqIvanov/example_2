<template>
	<div class="rating">
		<div
			v-if="view === 'with_number'"
			:class="['with-number', `with-number--${size}`]"
		>
			<TypographyKTypographyBody3
				v-if="showLabel"
				tag-type="span"
				color="var(--dark-gray)"
			>
				Рейтинг
			</TypographyKTypographyBody3>
			<div class="with-number__value">
				<UiIcon
					name="star"
					:width="STAR_SIZES.with_number[size]"
					:height="STAR_SIZES.with_number[size]"
					color="var(--orange-3)"
				/>
				<span class="with-number__number">{{ rating }}</span>
			</div>
		</div>

		<ul
			v-else-if="view === 'multistars'"
			:class="['multistars', `multistars--${size}`]"
			@mouseenter="isEdit ? (isHover = true) : null"
			@mouseleave="isEdit ? (isHover = false) : null"
		>
			<li
				v-for="star in MAX_CANDIDATE_RATING"
				:key="star"
				class="multistars__item"
				@click="isEdit ? chooseRating(star) : null"
				@mouseenter="isEdit ? mouseEnterHandler(star) : null"
				:style="{ cursor: isEdit ? 'pointer' : 'default' }"
			>
				<UiIcon
					name="star"
					:width="STAR_SIZES.multistars[size]"
					:height="STAR_SIZES.multistars[size]"
					:color="star <= +currentRating ? 'var(--orange-3)' : 'var(--blue-light-2)'"
				/>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
	import { MAX_CANDIDATE_RATING } from '~/const/candidate';

	const emit = defineEmits(['choose']);

	type Props = {
		view: 'multistars' | 'with_number';
		showLabel?: boolean; // for 'with_number' view
		rating: number | string;
		size: 'S' | 'M' | 'L';
		isEdit?: boolean;
	};

	const props = withDefaults(defineProps<Props>(), {
		isEdit: false,
		showLabel: true
	});

	const STAR_SIZES = {
		with_number: {
			S: '14',
			M: '20',
			L: '30'
		},
		multistars: {
			S: '14.49',
			M: '21.41',
			L: '29'
		}
	};

	const chooseRating = (rating: number) => {
		emit('choose', rating);
	};

	const mouseEnterHandler = (rating: number) => {
		hoverValue.value = rating;
	};

	const isHover = ref(false);
	const hoverValue = ref(0);

	const currentRating = computed(() => (props.isEdit && isHover.value ? hoverValue.value : Number(props.rating)));
</script>

<style scoped lang="scss">
	.rating {
		width: fit-content;
	}

	.with-number {
		display: flex;
		width: fit-content;
		flex-direction: column;
		align-items: center;

		gap: 6px;

		&__value {
			display: flex;
			width: 100%;
			align-items: center;

			gap: 4px;
		}

		&--S {
			& .with-number__number {
				@include body-4-bold;
			}
		}

		&--M {
			& .with-number__number {
				@include body-1-bold;
			}
		}

		&--L {
			& .with-number__number {
				@include title-4;
			}
		}
	}

	.multistars {
		display: flex;
		width: fit-content;
		flex-direction: row;

		transition: all linear 0.1s;

		&__item {
			display: flex;
			width: fit-content;
		}

		&--L {
			gap: 6.49px;
		}

		&--M {
			gap: 6.49px;
		}

		&--S {
			gap: 4.5px;
		}
	}
</style>
