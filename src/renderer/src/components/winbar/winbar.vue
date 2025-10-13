<template>
    <div class="drag-region"></div>
    <div class="electron-controller">
        <div class="buttons">
            <img class="minimize" @click="minimizeWindow" src="./winbar_minimize_icons.png" alt="">
            <img class="close" @click="closeWindow" src="./winbar_close_icons.png" alt="">
        </div>
    </div>
</template>

<style scoped lang="scss">
.drag-region {
    position: fixed;
    left: 0;
    right: 64px;
    top: 0;
    height: 42px;
    -webkit-app-region: drag;
}

.electron-controller {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: fixed;
    right: 0;
    left: var(--content-width);
    padding: 0.5rem;
    z-index: 100;

    .buttons {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;

        .close {
            height: 20px;
            border-radius: 4px;
            padding: 0.1rem;
            border: 1px solid rgba(255, 255, 255, 0.3);
            cursor: pointer;
            z-index: 100;
        }

        .minimize {
            height: 20px;
            border-radius: 4px;
            padding: 0.1rem;
            border: 1px solid rgba(255, 255, 255, 0.3);
            cursor: pointer;
            z-index: 100;
        }
    }
}
</style>

<script setup lang="ts">
const minimizeWindow = () => window.api.minimizeWindow()
const closeWindow = () => window.api.closeWindow()
</script>
