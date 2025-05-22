<template>
	<UiPopover
		:position="'top'"
		padding="20px"
	>
		<template #button>
			<UiButtonIcon :background="'transparent'">
				<UiIcon
					:name="'smile'"
					folder="chat"
					color="var(--violet)"
				/>
			</UiButtonIcon>
		</template>
		<template #body="props">
			<div class="body">
				<div
					@click="clickHandler(emoji)"
					v-for="emoji in listEmoji"
				>
					<img
						:src="emoji.url"
						class="emoji__item"
					/>
				</div>
			</div>
		</template>
	</UiPopover>
</template>

<script setup lang="ts">
	import { listEmoji } from '~/const/chat';
	const emit = defineEmits(['select']);

	const clickHandler = (item: { url: string; name: string }, actionAfter?: () => void) => {
		emit('select', item);

		if (actionAfter) actionAfter();
	};
</script>

<style scoped lang="scss">
	.body {
		display: flex;
		gap: 5px;
		.emoji {
			&__item {
				height: 25px;
				width: 25px;
				cursor: pointer;
			}
		}
	}
</style>
