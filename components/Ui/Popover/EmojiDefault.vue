<template>
	<UiPopover padding="15px">
		<template #button>
			<UiButtonIcon :background="'transparent'">
				<UiIcon
					:name="'smile'"
					folder="chat"
					color="var(--violet)"
					class="icon"
					width="20px"
				/>
			</UiButtonIcon>
		</template>
		<template #body="props">
			<div class="body">
				<div
					@click="clickHandler(emoji)"
					v-for="emoji in listEmoji"
					class="emoji"
				>
					{{ emoji }}
				</div>
			</div>
		</template>
	</UiPopover>
</template>

<script setup lang="ts">
	import { listEmoji } from '~/const/emoji';
	const emit = defineEmits(['select']);

	const clickHandler = (item: string, actionAfter?: () => void) => {
		emit('select', item);

		if (actionAfter) actionAfter();
	};
</script>

<style scoped lang="scss">
	.body {
		display: flex;
		max-width: 211px;
		min-width: 211px;
		flex-wrap: wrap;
		word-break: break-word;
		gap: 5px;
		.emoji {
			cursor: pointer;
		}
	}
</style>
