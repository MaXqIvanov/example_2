<template>
	<div class="ui-table">
		<table :style="{ ...styleTable }">
			<thead>
				<tr>
					<slot name="custom-cell-header__before" />
					<th v-for="item in header">
						<TypographyKTypographyBody2
							font-type="bold"
							color="var(--violet)"
							>{{ item.title }}</TypographyKTypographyBody2
						>
					</th>
					<slot name="custom-cell-header" />
					<th
						v-if="$slots['custom-cell-actions-header']"
						style="width: 0px"
					>
						<slot name="custom-cell-actions-header" />
					</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-if="body?.length"
					v-for="(item, index) in body"
					:key="item?.id"
					@click="clickRowHandler(item, index)"
				>
					<slot
						name="custom-cell-body__before"
						:item="item"
						:index="index"
					/>
					<td
						v-for="row in header"
						:style="{ width: row.ui?.width || 'auto' }"
					>
						<TypographyKTypographyBody3 :color="row.ui?.body?.color || 'var(--black)'">
							{{ getRow(item, row) }}
							{{ row?.postfix }}
						</TypographyKTypographyBody3>
					</td>
					<slot
						name="custom-cell-body"
						:item="item"
					/>
					<td
						v-if="$slots['custom-cell-actions-body']"
						style="width: 0px"
					>
						<slot
							name="custom-cell-actions-body"
							:item="item"
						/>
					</td>
				</tr>

				<td
					v-else
					:colspan="header.length"
					:rowspan="4"
					class="data-empty"
				>
					<TypographyKTypographyBody3
						font-type="bold"
						color="black"
					>
						данных нет
					</TypographyKTypographyBody3>
				</td>
			</tbody>
			<tfoot>
				<td :colspan="header.length">
					<slot name="bottom" />
				</td>
			</tfoot>
		</table>
	</div>
</template>

<script setup lang="ts">
	const emit = defineEmits(['clickRowHandler']);
	const props = withDefaults(
		defineProps<{
			header: { id: string; title: string; ui?: { body?: { color?: string }; width: string }; postfix?: string }[];
			body: Record<string, string | number>[];
			fieldEmpty?: string;
			styleTable?: Record<string, string>;
		}>(),
		{}
	);

	const getRow = (item: any, row: any) => {
		if (typeof row.id === 'string') {
			return item[row.id] || '-';
		} else if (Array.isArray(row.id)) {
			if (row.id.length === 1) {
				return item[row.id[0]] || '-';
			} else if (row.id.length === 2) {
				return item[row.id[0]]?.[row.id[1]] || '-';
			}
		}
		return props.fieldEmpty || '';
	};

	const clickRowHandler = (item: Record<string, string | number>, index: number) => {
		emit('clickRowHandler', item, index);
	};
</script>

<style scoped lang="scss">
	.ui-table {
		background-color: var(--white);
		overflow: hidden;
		border-radius: 15px;
		//height: fit-content;
		min-height: 300px;
		max-height: 90vh;
		overflow: auto;
	}
	table {
		width: 100%;
		height: 100%;
		border-spacing: 0px;
		padding-bottom: 15px;

		tfoot {
			height: 100%;
			position: sticky;
			bottom: 0px;
			background-color: var(--white);

			td {
				display: table-cell;
				vertical-align: bottom;
			}
		}

		thead {
			position: sticky;
			top: 0px;
			z-index: 999;
			tr {
				th {
					font-weight: bold;
					padding: 21px 15px;
					background: var(--table-default-header);
					border: 1px solid var(--blue-light-2);
					border-top: 0px;
					border-right: 0px;
					text-align: left;

					&:first-child {
						border-left: 0px;
						padding-left: 30px;
					}
					&:last-child {
						padding-right: 30px;
					}

					@media (max-width: $laptop) {
						padding: 16px 10px;

						&:first-child {
							padding-left: 20px;
						}
						&:last-child {
							padding-right: 20px;
						}
					}
				}
			}
		}

		tbody {
			position: relative;
			word-break: break-word;
			.data-empty {
				width: fit-content;
				position: inherit;
				top: 10px;
				left: 50%;
				border: 0px;
				height: 100px;
				transform: translate(-50%, -10px);
				text-align: center;
			}
			tr {
				height: 51px;
				td {
					border: 1px solid var(--blue-light-2);
					border-top: 0px;
					border-right: 0px;
					padding: 8px 10px;

					&:first-child {
						border-left: 0px;
						padding-left: 30px;
					}
					&:last-child {
						padding-right: 30px;
					}

					@media (max-width: $laptop) {
						padding: 8px 10px;

						&:first-child {
							padding-left: 20px;
						}
						&:last-child {
							padding-right: 20px;
						}
					}
				}
			}
		}
	}
</style>
