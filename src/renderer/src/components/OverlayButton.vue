<template>
    <div class="overlay-button">
        <button @click="handleOverlay" :class="{ 'active': overlayStatus }" style="color: white; font-weight: 600;">{{
            overlayStatus ? 'Close Overlay' :
                'Open Overlay' }}</button>
    </div>
</template>

<style scoped lang="scss">
.overlay-button {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 0.2rem;

    button {
        all: unset;
        text-align: center;
        width: 125px;
        padding: 0.5rem 0rem;
        border-radius: var(--border-radius);
        border: none;
        background-color: var(--color-secondary);
        cursor: pointer;
        transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

        &.active {
            background-color: var(--status-error);
        }

        &:hover {
            background-color: var(--color-primary);
            color: black;
            transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
        }
    }
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
const overlayStatus = ref(false);
const handleOverlay = () => {
    if (overlayStatus.value) {
        window.api.closeWindow();
        overlayStatus.value = false;
    } else {
        window.api.openWindow();
        overlayStatus.value = true;
    }
}

onMounted(async () => {
    const status = await window.api.getOverlayStatus();
    overlayStatus.value = status.isOpen;
});


</script>
