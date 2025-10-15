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
        <div class="leftcol"><div class="homepagelink"><a href="http://mileswhiticker.xyz/">Home</a></div></div>

        <div class="gametitle">
            <h1>Ballot Barrage 2025</h1>
            <p>Have fun!</p>
        </div>
    </header>

    <div id="appWrapper" v-if="currentComponent.value">
        <component :is="currentComponent.value" />
    </div>
</template>

<style scoped>
#header{
    display: flex;
}
	.leftcol {
		width: 10%;
		display: flex;
	}
.homepagelink{
}
</style>
