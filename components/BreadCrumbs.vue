<template>
	<div
		class="bread-crumbs"
		itemscope
		itemtype="http://schema.org/BreadcrumbList"
	>
		<div
			v-for="(crumb, index) in crumbs"
			:key="crumb.link || index"
			class="crumb"
			@click="clickHandler(crumb)"
		>
			<TypographyKTypographyBody4 color="currentColor">
				<NuxtLink
					v-if="index !== crumbs.length - 1"
					:href="(crumb.linkActive && crumb.link) || undefined"
				>
					<meta
						itemprop="position"
						:content="`${index + 1}`"
					/>
					<div
						class="crumb__title"
						:class="{ crumb__title_crop: crumb.title.length > 25 }"
					>
						{{ crumb.title }}
					</div>
					<span>·</span></NuxtLink
				>
				<div v-else>{{ crumb.title }}</div>
			</TypographyKTypographyBody4>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { AlertsTypes } from '~/const/notification';
	import { useBaseStore } from '~/store/base.store';
	import { useNotificationStore } from '~/store/notification.store';

	const route = useRoute();
	const notification = useNotificationStore();
	const baseStore = useBaseStore();

	const clickHandler = (crumb: (typeof crumbs.value)[0]) => {
		if (
			crumb.title === route.params.vacancyId ||
			crumb.title === route.params.responsesId ||
			crumb.title === route.params.userId
		) {
			navigator.clipboard.writeText(`${crumb.title}`);
			notification.addNewAlert('ID скопирован в буфер обмена', 2000, AlertsTypes.SUCCESS);
		}
	};

	const crumbs = computed(() => {
		let routePath = route.path;
		if (route.params.vacancyId) {
			routePath = routePath.replace('vacancies', 'vacancies_management');
		}

		let routePathArray = routePath.split('/');

		if (routePathArray.length === 2 && routePathArray[0] === '') {
			return [baseStore.breadCrumbs['general_page']];
		}
		routePathArray.shift();
		const result = routePathArray.map((bread, index) => {
			let currentLink = '';
			for (let i = 0; i <= index; i++) {
				currentLink += `${baseStore.breadCrumbs[routePathArray[i]]?.link || `/${routePathArray[i]}`}`;
			}

			return {
				title: baseStore.breadCrumbs[bread]?.title || bread,
				link: currentLink,
				linkActive:
					baseStore.breadCrumbs[bread]?.linkActive || baseStore.breadCrumbs[routePathArray[index - 1]]?.afterLinkActive
			};
		});

		return result;
	});
</script>

<style scoped lang="scss">
	.bread-crumbs {
		@include body-4;
		display: flex;
		gap: 5px;
		margin-top: 7px;

		.crumb {
			width: fit-content;
			color: var(--black);
			text-transform: lowercase;

			span {
				font-weight: 800;
			}

			a {
				display: flex;
				gap: 5px;
			}
			&__title {
				&_crop {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					max-width: 60px;
				}
			}

			&:last-child {
				color: var(--dark-gray);
			}
		}
	}
</style>
