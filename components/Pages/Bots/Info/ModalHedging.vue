<template>
	<UiModalDefault
		v-model="isOpen"
		padding-card="27px"
		height="fit-content"
		width="100%"
		max-width="500px"
		:title="'Хеджирование'"
		:z-index="100000"
	>
		<div class="modal__wrapper">
			<TypographyKTypographyBody3 class="description">
				С открытием длинной спотовой позиции, бот автоматически открывает фьючерсную позицию в сторону понижения, на 50%
				объема от этой позиции. При снижении цены и покупки следующего спотового шага, фьючерс на понижение закрывается
				в плюс, компенсирую тем самым примерно 50% просадки от снижения спотового ордера. В случае если цена выросла и
				спотовый ордер продался, фьючерсная позиция закроется с убытком, который будет составлять примерно 50% прибыли
				полученной в спотовой позиции.
			</TypographyKTypographyBody3>
			<TypographyKTypographyBody3
				class="mt-2"
				font-type="bold"
			>
				Основные требования:
			</TypographyKTypographyBody3>
			<ul class="mt-2">
				<li>1. Минимальная сумма позиции на споте 200 usdt</li>
				<li>2. Минимальная сумма хеджирующей позиции 100 usdt</li>
				<li>3. Необходимо контролировать чтобы баланс на аккаунте был достаточен для всех хеджированных позиций</li>
				<li>4. Минимальный шаг 2%, иначе комиссия биржи съест всю прибыль</li>
				<li>
					5. Последняя позиция в сетке не хеджериуется, но она обязательно должна быть, для привязки тейк-профита
					пердпоследней хеджированной позиции.
				</li>
				<li>6. Комиссия PinnX по прибыльнным сделкам ордеров хеджирования составляет 20%</li>
			</ul>
			<TypographyKTypographyBody3
				class="mt-2"
				font-type="bold"
			>
				Рекомендации:
			</TypographyKTypographyBody3>
			<ul class="mt-2">
				1. Запускать на отдельном субаккаунте
			</ul>
		</div>

		<template #btn-close>
			<UiIcon
				name="close_v2"
				height="15"
				width="15"
				@click="closeHandler"
			></UiIcon>
		</template>
	</UiModalDefault>
</template>

<script setup lang="ts">
	const isOpen = defineModel('isOpen', { type: Boolean, required: true });

	const closeHandler = () => {
		isOpen.value = false;
	};
</script>

<style scoped lang="scss">
	.modal__wrapper {
		max-height: 60vh;
		overflow: auto;
		padding-right: 10px;
		margin-right: -10px;
	}
	.description {
		&::first-letter {
			padding-left: 10px;
		}
	}
	ul {
		li {
			&::first-letter {
				font-weight: 600;
			}
		}
	}
</style>
