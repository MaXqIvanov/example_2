<template>
	<div
		class="special-block"
		id="special-block"
	>
		<div class="date-picker-wrapper">
			<UiDatePicker
				v-model="currentDate"
				:date-picker-unique-id="'date-picker-wrapper-special-block'"
			>
				<UiInput
					:readonly="true"
					labelClass="input__label"
					height="50px"
					:modelValue="currentDate"
					background-color-input="var(--blue-light)"
					border-width-input="0px"
					:inputSpecialStyle="{
						color: 'var(--violet)',
						maxWidth: '110px'
					}"
					:inputWrapperSpecialStyle="{
						display: 'flex',
						justifyContent: 'center',
						gap: baseStore.isHiddenAdsBlock ? '5px' : '8px'
					}"
					:inputSpecialClass="'k-typography-body-2-bold'"
					max-width="none"
				>
					<template #left-icon>
						<UiIcon
							name="calendar"
							additional-color="var(--orange)"
							:style="{ marginLeft: baseStore.isHiddenAdsBlock ? '6px' : '0px' }"
						/>
					</template>
				</UiInput>
			</UiDatePicker>
		</div>

		<div class="advertising-block">
			<img
				:src="AdsImg2xWebp"
				width="280"
				height="554"
				alt="ads"
			/>
		</div>

		<div class="button__wrapper">
			<UiButton
				@click="clickHiddenHandler"
				color="underline"
				:borderColor="baseStore.isHiddenAdsBlock ? 'transparent' : 'var(--blue-light-7)'"
				:button-padding="'0px'"
				:size="ButtonSizeType.extra_small"
			>
				<template #after>
					<TypographyKTypographyBody4
						:style="{ minWidth: 'max-content' }"
						color="var(--violet)"
						font-type="bold"
						v-if="!baseStore.isHiddenAdsBlock"
					>
						Скрыть боковую панель
					</TypographyKTypographyBody4>
					<UiIcon
						name="arrow"
						width="8"
						height="8"
						:rotation="baseStore.isHiddenAdsBlock ? '90' : '-90'"
					/>
				</template>
			</UiButton>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { convertDate } from '~/helpers/date';
	import { ButtonSizeType } from '~/interfaces/ui';
	import { useBaseStore } from '~/store/base.store';
	import AdsImg2xWebp from '~/assets/image/ads-block/background@2x.webp';
	import { useProfileStore } from '~/store/profile.store';
	import { USER_SETTINGS_UI_FIELDS } from '~/const/profile';

	const baseStore = useBaseStore();
	const profile = useProfileStore();
	const currentDate = ref(convertDate(new Date()));

	const width = computed(() => {
		return !baseStore.isHiddenAdsBlock ? '280px' : '60px';
	});

	const clickHiddenHandler = () => {
		baseStore.isHiddenAdsBlock = !baseStore.isHiddenAdsBlock;
		profile.updateProfileSettins(baseStore.isHiddenAdsBlock, USER_SETTINGS_UI_FIELDS.IsHiddenAdsBlock, 2500);
	};
</script>

<style scoped lang="scss">
	$min-width-default: 60px;

	.date-picker-wrapper {
		display: flex;
		border-radius: 14px;
		cursor: pointer;
		width: 100%;

		#date-picker-wrapper-special-block {
			width: 100%;
		}
	}

	.special-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: v-bind(width);
		min-width: v-bind(width);
		transition: all linear 0.42s;
		gap: 30px;
		margin-top: -10px;

		@media (max-width: 1400px) {
			max-width: max($min-width-default, calc(v-bind(width) - 20px));
			min-width: max($min-width-default, calc(v-bind(width) - 20px));
		}

		.button__wrapper {
			margin-top: -15px;
			overflow: hidden;
			max-width: 100%;
		}

		.advertising-block {
			position: relative;
			background: var(--white);
			width: 100%;
			height: 100%;
			max-height: 554px;
			border-radius: 16px;
			border-top-right-radius: 0;
			overflow: hidden;

			img {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				height: 100%;
				width: 100%;
				object-fit: cover;
			}
		}
	}
</style>
