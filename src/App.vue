<script setup lang="ts">
    import { computed } from 'vue';
    import appController from '@controllers/AppController';

    //const currentComponent = computed(() => components[current.value])
    const currentComponent = computed(() => appController.mountedSceneComponent);
    //appController.mountedSceneComponent = SceneMainMenu;
	//const currentComponent2 = ref(GameWrapper);
</script>

<template>
    <header id="header">

		<div class="">
			<div class=""><div class="homepagelink underline"><a href="https://mileswhiticker.xyz/"><< Home</a></div></div>
			<div class="mb-4 flex justify-center font-bold text-lg p-4">
				<h1>Ballot Barrage 2025</h1>
			</div>
		</div>
    </header>

    <div id="appWrapper" v-if="currentComponent.value">
        <component :is="currentComponent.value" />
    </div>
</template>

<style scoped>
</style>
