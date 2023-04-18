<template>
	<body :class="{ 'body-light': isDark, 'body-dark': !isDark }">
		<RouterView />
	</body>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { useStore } from './stores/Store'

const store = useStore();

const isDark = computed(() => {
	return store.getIsDark();
})
</script>
<style lang="scss">
:root {
	--primary: #2d76b4;
	--primary-alt: #194162;
	--grey: #64748b;
	--dark: #1e293b;
	--dark-alt: #334155;
	--light: #f1f5f9;
	--sidebar-width: 300px;
}

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-family: 'Fira sans', sans-serif;

}

body {
	font-weight: 100;
	overflow-y: hidden;
}

.body-light {
	font-weight: 100;
	background-color: #021a2e;
	overflow-y: hidden;
}

.body-dark {
	font-weight: 100;
	background-color: #cccdcf;
	overflow-y: hidden;
}

button {
	cursor: pointer;
	appearance: none;
	border: none;
	outline: none;
	background: none;
}

.app {
	display: flex;

	main {
		flex: 1 1 0;
		padding: 2rem;

		@media (max-width: 1024px) {
			padding-left: 6rem;
		}
	}
}</style>