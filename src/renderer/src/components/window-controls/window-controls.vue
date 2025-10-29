<template>
    <div class="window-controls">
        <div class="window-controls-logo">
            <img src="./logo.png" :alt="t('app.logoAlt')" />
        </div>
        <div class="window-controls-title">
            <span>{{ t('app.void') }}</span> &nbsp;{{ t('app.hud') }}
        </div>
        <div class="window-controls-button">
            <i class="pi pi-window-minimize" @click="handleMinimize" style="opacity: 0.6;"></i>
            <i class="pi pi-times" @click="handleClose" style="opacity: 0.6;"></i>
        </div>
    </div>
</template>

<style scoped lang="scss">
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

    .window-controls-title {
        opacity: 0;


        span {
            color: var(--color-primary);
            font-weight: 600;
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

            &:hover {
                background: var(--background);
                transition: var(--transition);
            }
        }
    }
}
</style>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })
const handleMinimize = () => {
    window.api.minimize()
}

const handleClose = () => {
    window.api.close()
}
</script>
