<template>
    <div class="multi-window">
        <div class="window-indicator">
            <div class="window-indicator-left">
                <div class="window-indicator-item" v-for="item in indicatorItems" :key="item.path"
                    :class="{ 'window-indicator-item-active': item.path === selectedItem }"
                    @click="navigate(item.path)">
                    {{ t(item.label) }}
                </div>
            </div>

            <div v-if="selectedItem === '/settings'" class="window-indicator-right">
                <Dropdown v-model="selectedLocale" :options="localeOptions" optionLabel="label" optionValue="value"
                    class="locale-switcher" />
            </div>
        </div>
        <div class="window-content">
            <router-view></router-view>
        </div>
    </div>
</template>

<style scoped lang="scss">
.multi-window {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    width: 100%;
    flex-grow: 1;


    .window-indicator {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
        height: 48px;
        width: 100%;
        border-bottom: 2px solid var(--border-color-weak);
        background: rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(10px);
        padding: 0 0.5rem;

        .window-indicator-left {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: row;
        }

        .window-indicator-right {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        .window-indicator-item {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 1rem;
            cursor: pointer;
            opacity: 1;
            transition: color 0.2s ease-in-out;
            position: relative;

            &::after {
                content: '';
                position: absolute;
                bottom: -10px;
                left: 50%;
                width: 75%;
                height: 2px;
                background: var(--color-primary);
                transform: translateX(-50%) scaleX(0);
                transition: transform 0.2s ease-in-out;
            }
        }

        .window-indicator-item:hover {
            color: var(--color-primary);
        }

        .window-indicator-item-active {
            color: var(--color-primary);

            &::after {
                transform: translateX(-50%) scaleX(1);
            }
        }
    }

    .window-content {
        flex-grow: 1;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 1rem;
        position: relative;
    }
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import Dropdown from 'primevue/dropdown'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n({ useScope: 'global' })

const indicatorItems = ref([
    { label: 'indicator.menu', path: '/' },
    { label: 'indicator.matchs', path: '/matchs' },
    { label: 'indicator.players', path: '/players' },
    { label: 'indicator.teams', path: '/teams' },
    { label: 'indicator.settings', path: '/settings' }
])
const router = useRouter()
const route = useRoute()

const selectedItem = ref(route.path)

watch(
    () => route.path,
    (newPath) => {
        selectedItem.value = newPath
    }
)

const navigate = (path: string) => {
    if (path && path !== route.path) {
        router.push(path)
    }
}

const localeOptions = [
    { label: 'English', value: 'en' },
    { label: 'Chinese', value: 'zh' }
]

const selectedLocale = ref<string>(locale.value)

watch(selectedLocale, (val) => {
    locale.value = val
    localStorage.setItem('locale', val)
})
</script>
