<template>
    <div class="window-controls">
        <div class="window-controls-logo">
            <img src="./logo.png" :alt="t('app.logoAlt')" />
        </div>
        <div @click="handleOverlay" class="open-overlay" style="margin-left: auto">
            <Blend :color="overlayColor" />
            <div class="hover-tips">{{ overlayStatus ? 'Close Overlay' : 'Open Overlay' }}</div>
        </div>
        <div class="window-controls-button">
            <i class="pi pi-window-minimize" @click="handleMinimize" style="opacity: 0.6;">
            </i>
            <i class="pi pi-times" @click="handleClose" style="opacity: 0.6;">
            </i>
        </div>
    </div>
</template>

<style scoped lang="scss">
.hover-tips {
    position: absolute;
    top: 120%;
    left: 0;
    padding: 0.5rem 0.75rem;
    text-wrap: nowrap;
    font-size: 0.8rem;
    font-weight: 600;
    opacity: 0;
    transition: var(--transition);
    z-index: 2;
    transform: translateX(-15%);
    border-radius: var(--border-radius);
    background: var(--background-glass);
    pointer-events: none;
}

.window-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    width: 100%;
    height: var(--header-height);
    background: var(--background-weak);
    padding: 0.25rem;
    -webkit-app-region: drag;

    .window-controls-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;

        img {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 2.3rem;
            object-fit: contain;
        }
    }

    .open-overlay {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        margin-right: 8px;
        border-radius: var(--border-radius);
        -webkit-app-region: no-drag;
        cursor: pointer;
        transition: var(--transition);
        position: relative;

        &:hover {
            background: var(--background-glass);
            transition: var(--transition);

            .hover-tips {
                opacity: 1;
            }
        }
    }

    .window-controls-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        gap: 0.3rem;
        height: 100%;
        padding: 0 5px;
        border-left: 1px solid var(--border-color-weak);
        -webkit-app-region: no-drag;

        i {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 32px;
            border-radius: var(--border-radius);
            transition: var(--transition);
            cursor: pointer;
            position: relative;

            &:hover {
                background: var(--background);
                transition: var(--transition);

                .hover-tips {
                    opacity: 1;
                }
            }

        }
    }

}
</style>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Blend } from 'lucide-vue-next'
import { ref, onMounted, computed } from 'vue'
const { t } = useI18n({ useScope: 'global' })
const handleMinimize = () => {
    window.api.minimize()
}

const handleClose = () => {
    window.api.close()
}

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

const overlayColor = computed(() => {
    if (overlayStatus.value) {
        return 'var(--status-success)';
    } else {
        return 'var(--status-error)';
    }
});
</script>
