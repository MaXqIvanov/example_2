<template>
	<div
		class="ui-date-picker"
		:id="datePickerUniqueId"
		@click.prevent
	>
		<slot />
	</div>
</template>

<script setup lang="ts">
	import Datepicker from '@/assets/js/datepicker';
	import { convertDate, getDateInLocaleString } from '~/helpers/date';
	import { useNotificationStore } from '~/store/notification.store';

	const emit = defineEmits(['update:modelValue', 'blur']);
	const datePicker = ref<HTMLElement | null>(null);

	const props = withDefaults(
		defineProps<{
			modelValue?: Date | Date[] | string;
			datePickerUniqueId: string;
			isNeedFormat?: boolean;
			isDontNeedPosibleOpen?: boolean;
			maxValue?: Date;
			minValue?: Date;
			disabled?: boolean;
			disabledText?: string;
			isRanged?: boolean;
			calendarCount?: number;
			multiple?: boolean;
			firstMonthByCurrent?: number;
		}>(),
		{
			datePickerUniqueId: 'ui-date-picker',
			isNeedFormat: true,
			isRanged: false,
			calendarCount: 1,
			multiple: false,
			firstMonthByCurrent: 0
		}
	);

	const changeHandler = (value: Date | [Date, Date]) => {
		if (!value) return;
		if (!Array.isArray(value) && props.isNeedFormat) {
			emit('update:modelValue', convertDate(value));
			setTimeout(() => {
				emit('blur', value);
			});
			return;
		}

		emit('update:modelValue', value);
		setTimeout(() => {
			emit('blur', value);
		});
	};

	onMounted(() => {
		if (props.isDontNeedPosibleOpen) return;

		const datePickerWrapper = document.getElementById(props.datePickerUniqueId);
		if (datePickerWrapper) {
			const datePicker = datePickerWrapper.firstElementChild as HTMLElement;

			if (!datePicker) return;

			new Datepicker(datePicker, {
				ranged: props.isRanged,
				multiple: props.multiple,
				onChange: changeHandler,
				isOpenDisabled: () => {
					if (props.disabled && props.disabledText) {
						useNotificationStore().addNewAlert(props.disabledText, 4000);
					}
					return props.disabled === true;
				},
				openOn: function () {
					const minDate = props.minValue ? new Date(props.minValue) : false;
					this._opts.max = props.maxValue ? new Date(props.maxValue) : false;
					this._opts.min = minDate ? new Date(minDate.setDate(minDate.getDate() - 1)) : false;

					if (typeof props.modelValue === 'string') {
						this.addDate(new Date(props.modelValue));
						return new Date(props.modelValue);
					} else if (Array.isArray(props.modelValue)) {
						this.addDate(props.modelValue);
						return props.modelValue;
					}
					return null;
				},
				classNames: { node: 'ui-date-picker__wrapper' },
				weekStart: 1,
				i18n: {
					time: ['', '', ''],
					weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
					months: [
						'Январь',
						'Февраль',
						'Март',
						'Апрель',
						'Май',
						'Июнь',
						'Июль',
						'Август',
						'Сентябрь',
						'Октябрь',
						'Ноябрь',
						'Декабрь'
					]
				},
				getFirstMonthByCurrent: () => props.firstMonthByCurrent,
				templates: {
					container: [
						'<div class="datepicker__container">',
						`<% for (var i = ${props.firstMonthByCurrent}; i <= ${props.firstMonthByCurrent + props.calendarCount - 1}; i++) { %>`,
						'<div class="datepicker__pane">',
						'<%= renderHeader(i) %>',
						'<%= renderCalendar(i) %>',
						'</div>',
						'<% } %>',
						'</div>'
					].join('')
				}
			});
		}
	});
</script>

<style lang="scss" src="">
	.datepicker__container {
		display: flex;

		@media (max-width: $lg) {
			flex-direction: column;
		}
	}
	.ui-date-picker {
		display: flex;
		align-items: center;
		justify-content: center;

		.datepicker__daynum {
			font-size: 13px;
			padding: 7px 8px;
		}

		.is-disabled {
			opacity: 0.45;
			cursor: not-allowed !important;
		}

		.is-selected {
			background-color: var(--gray-10);
			border-radius: 50%;
			color: var(--black);
			opacity: 1;
		}

		.is-selected__last {
			background-color: var(--primary);
			color: var(--white);
		}

		.is-selected__first {
			background-color: var(--primary);
			color: var(--white);
		}

		.is-today {
			background-color: var(--blue);
			border-radius: 50%;
			color: var(--white);
			opacity: 1;
		}

		.is-otherMonth {
			opacity: 0.5;
		}
	}
	.ui-date-picker__wrapper {
		width: 100%;
		.datepicker {
			&__container {
				display: flex;
				gap: 50px;
			}
			&__day {
				cursor: pointer;
				div {
					display: flex;
					justify-content: center;
				}
			}
			&__wrapper {
				margin-top: 20px;
				background-color: var(--white);
				padding: 12px;
				box-shadow: 0px 0px 5px var(--gray-200);
				border-radius: 8px;
			}
			&__header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 5px;
			}
			&__prev {
				cursor: pointer;
				font-size: 22px;
			}
			&__next {
				cursor: pointer;
				font-size: 22px;
			}
			&__cal {
				border-spacing: 5px;

				thead {
					tr {
						color: var(--violet-2);
						font-size: 13px;
						font-weight: 600;
					}
				}
			}
		}
	}
</style>
