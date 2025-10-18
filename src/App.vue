<script setup lang="ts">
    import { computed } from 'vue';
    import appController from '@controllers/AppController';

    //const currentComponent = computed(() => components[current.value])
    const currentComponent = computed(() => appController.mountedSceneComponent);
	const currentComponentProps = computed(() => appController.mountedSceneComponentProps);
    //appController.mountedSceneComponent = SceneMainMenu;
	//const currentComponent2 = ref(GameWrapper);
</script>

<template>
    <header id="header">
		<div class="">
			<div class=""><div class="homepagelink underline"><a href="https://mileswhiticker.xyz/"><< Home</a></div></div>
			<div class="mb-0 flex justify-center font-bold text-lg p-4">
				<h1 class="text-5xl font-bold rainbow-text animate-rainbow-glow">Ballot Barrage 2025</h1>
			</div>
		</div>
    </header>

    <div id="appWrapper" v-if="currentComponent.value">
        <component :is="currentComponent.value" v-bind="currentComponentProps.value" />
    </div>
</template>

<style scoped>
	/* Gradient text */
.rainbow-text {
	background: linear-gradient(270deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff);
	background-size: 1400% 1400%;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

/* Glow + rainbow animation */
@keyframes rainbowGlow {
	0% { background-position: 0% 50%; text-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000; }
	50% { background-position: 100% 50%; text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00; }
	100% { background-position: 0% 50%; text-shadow: 0 0 10px #8b00ff, 0 0 20px #8b00ff, 0 0 30px #8b00ff; }
}

.animate-rainbow-glow {
	animation: rainbowGlow 3s ease infinite;
}
</style>
