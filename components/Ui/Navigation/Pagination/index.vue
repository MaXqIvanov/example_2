<template>
	<div class="pagination">
		<div class="pagination__size">
			<div
				v-for="size in pageSizeList"
				@click="changePageHandler(pageNumber, size)"
			>
				<UiButtonIcon
					:href="`?pageNumber=${pageNumber}&pageSize=${size}`"
					background="var(--white)"
					:class="{ 'btn-icon_active': size === pageSize }"
				>
					<TypographyKTypographyBody3 color="var(--violet)">
						{{ size }}
					</TypographyKTypographyBody3>
				</UiButtonIcon>
			</div>
		</div>
		<div class="pagination__pages">
			<div @click="getPageSizeBack ? changePageHandler(getPageSizeBack, pageSize) : null">
				<UiButtonIcon :href="getPageSizeBack ? `?pageNumber=${getPageSizeBack}&pageSize=${pageSize}` : ''">
					<UiIcon
						name="direction"
						width="16"
						height="16"
						rotation="180"
						:color="getPageSizeBack ? 'var(--violet)' : 'var(--gray-2)'"
					/>
				</UiButtonIcon>
			</div>
			<div
				@click="changePageHandler(page, pageSize)"
				v-for="page in getListArraySlice"
				:key="page"
			>
				<UiButtonIcon
					:href="`?pageNumber=${page}&pageSize=${pageSize}`"
					:class="{ 'btn-icon_active': page === pageNumber }"
				>
					<TypographyKTypographyBody3>
						{{ page }}
					</TypographyKTypographyBody3>
				</UiButtonIcon>
			</div>
			<div @click="getPageSizeForward ? changePageHandler(getPageSizeForward, pageSize) : null">
				<UiButtonIcon :href="getPageSizeForward ? `?pageNumber=${getPageSizeForward}&pageSize=${pageSize}` : ''">
					<UiIcon
						name="direction"
						width="16"
						height="16"
						:color="getPageSizeForward ? 'var(--violet)' : 'var(--gray-2)'"
					/>
				</UiButtonIcon>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const emit = defineEmits(['changePage']);

	const props = withDefaults(
		defineProps<{
			pageNumber: number;
			pageSize: number;
			pageSizeList: Array<number>;
			totalPages: number;
		}>(),
		{}
	);

	const getPageSizeBack = computed(() => (props.pageNumber - 1 > 0 ? props.pageNumber - 1 : null));
	const getPageSizeForward = computed(() => (props.pageNumber + 1 <= props.totalPages ? props.pageNumber + 1 : null));
	const getListArray = computed(() => {
		return Array.from({ length: props.totalPages }, (v, i) => i + 1);
	});

	const getListArraySlice = computed(() => {
		if (props.totalPages - 6 < 0) return getListArray.value;
		return getListArray.value.slice(
			props.pageNumber - 2 >= 1
				? props.pageNumber - 2 > props.totalPages - 6
					? props.totalPages - 6
					: props.pageNumber - 2
				: 0,
			props.pageNumber + 4 >= props.totalPages ? props.totalPages : props.pageNumber + 4
		);
	});

	const changePageHandler = (page: number, size: number) => {
		emit('changePage', page, size);
	};
</script>

<style scoped lang="scss">
	.pagination {
		display: flex;
		justify-content: space-between;

		&__size {
			display: flex;
			gap: 10px;
		}

		&__pages {
			display: flex;
			gap: 10px;
		}
	}

	.btn-icon {
		transition: all linear 0.000001s;
		min-width: 40px;
		min-height: 40px;
		background-color: var(--white);

		.typography-body-3 {
			color: var(--violet);
		}

		&_active {
			background-color: var(--blue);

			.typography-body-3 {
				color: var(--white);
			}
		}
	}
</style>
