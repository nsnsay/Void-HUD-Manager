<template>
    <div class="settings-container">
        <div class="settings-clms manager-settings">
            <div v-for="column in managerSettings" :key="column.title" class="settings-clm">
                <div v-if="column.title" class="settings-clm-title">{{ column.title }}</div>
                <div v-for="item in column.items" :key="item.label" :class="['settings-item', item.type]">
                    <div class="settings-item-text">
                        <div class="label">{{ item.label }}</div>
                        <div class="desc">{{ item.desc }}</div>
                    </div>
                    <div v-if="item.type === 'boolean'">
                        <Checkbox v-model="item.value" binary size="large" />
                    </div>
                    <div v-else-if="item.type === 'input'">
                        <InputText v-model="item.value as any" />
                    </div>
                </div>
            </div>
        </div>
        <div class="settings-clms overlay-settings">
            <div v-for="column in overlaySettings" :key="column.title" class="settings-clm">
                <div v-if="column.title" class="settings-clm-title">{{ column.title }}</div>
                <div v-for="item in column.items" :key="item.label" :class="['settings-item', item.type]">
                    <div class="settings-item-text">
                        <div class="label">{{ item.label }}</div>
                        <div class="desc">{{ item.desc }}</div>
                    </div>
                    <div v-if="item.type === 'boolean'">
                        <Checkbox v-model="item.value" binary size="large" />
                    </div>
                    <div v-else-if="item.type === 'input'">
                        <InputText v-model="item.value as any" />
                    </div>
                    <div v-else-if="item.type === 'color'">
                        <ColorPicker v-model="item.value" format="hex" />
                    </div>
                </div>
            </div>
        </div>
        <div class="settings-clms other-settings">
            <div v-for="column in otherSettings" :key="column.title" class="settings-clm">
                <div v-if="column.title" class="settings-clm-title">{{ column.title }}</div>
                <div v-for="item in column.items" :key="item.label" :class="['settings-item', item.type]">
                    <div class="settings-item-text">
                        <div class="label">{{ item.label }}</div>
                        <div class="desc">{{ item.desc }}</div>
                    </div>
                    <div v-if="item.type === 'boolean'">
                        <Checkbox v-model="item.value" binary size="large" />
                    </div>
                    <div v-else-if="item.type === 'input'">
                        <InputText v-model="item.value as any" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.settings-container {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-direction: row;
    gap: 1rem;
    width: 100%;
    height: 100%;

    .settings-clms {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        gap: 1rem;
        width: 100%;
        flex-direction: column;
        gap: 1rem;

        .settings-clm {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            width: 100%;
            flex-direction: column;
            padding: 0.75rem;
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.01);
            border-radius: var(--border-radius);
            gap: 0.5rem;
            box-shadow: var(--shadow);
            border: 1px solid var(--border-color-strong);

            .settings-clm-title {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
                font-weight: 500;
                opacity: 0.6;
                color: white;
            }

            .settings-item {
                display: flex;
                align-items: center;
                width: 100%;
                justify-content: space-between;
                gap: 0.5rem;
                flex-direction: row;

                .settings-item-text {
                    font-size: 1rem;

                    .label {
                        font-size: 1.1rem;
                        font-weight: 500;
                        opacity: 0.8;
                        background: linear-gradient(to left, var(--color-primary), var(--color-secondary));
                        background-clip: text;
                        color: transparent;
                    }

                    .desc {
                        font-size: 0.9rem;
                        font-weight: 400;
                        opacity: 0.5;
                        background: linear-gradient(to right, white, var(--color-secondary));
                        background-clip: text;
                        color: transparent;
                    }
                }

                &.input {
                    flex-direction: column;
                    align-items: flex-start;
                }
            }
        }
    }
}
</style>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import { useToast } from 'primevue'
import ColorPicker from 'primevue/colorpicker'
const toast = useToast()

// Explicit types so the template knows column.items, item.label, item.type, etc.
type SettingValue = string | boolean
type SettingType = 'boolean' | 'input' | 'color'
interface SettingItem {
    key: string
    label: string
    desc?: string
    type: SettingType
    value: SettingValue
}
interface SettingColumn {
    title?: string
    items: SettingItem[]
}

const managerSettings = ref<SettingColumn[]>([
    {
        title: 'Manager Settings',
        items: [
            {
                key: 'seriesName_first',
                label: 'Series Name (#1)',
                desc: 'Name of tournament or what ever you want',
                type: 'input',
                value: 'VoidHUD',
            },
            {
                key: 'seriesName_second',
                label: 'Series Name (#2)',
                desc: 'Name of tournament or what ever you want',
                type: 'input',
                value: 'VoidHUD',
            },
            {
                key: 'seriesName_third',
                label: 'Series Name (#3) (Not available)',
                desc: 'Name of tournament or what ever you want',
                type: 'input',
                value: 'VoidHUD',
            },
        ]
    },
])

const overlaySettings = ref<SettingColumn[]>([
    {
        title: 'Overlay Settings',
        items: [
            {
                key: 'overlayFocusedPlayer',
                label: 'Focused Player',
                desc: 'Show current focusing player on the overlay',
                type: 'boolean',
                value: true,
            },
            {
                key: 'overlaySidebars',
                label: 'Sidebars',
                desc: 'Show sidebars on the overlay',
                type: 'boolean',
                value: true,
            },
            {
                key: 'overlayTopbar',
                label: 'Topbar',
                desc: 'Show topbar on the overlay',
                type: 'boolean',
                value: true,
            },
            {
                key: 'overlayRadar',
                label: 'Radar',
                desc: 'Show radar on the overlay',
                type: 'boolean',
                value: true,
            }
        ]
    },
    {
        items: [
            {
                key: 'ctColor',
                label: 'Counter Terrorist Color',
                desc: 'Color of the counter terrorist team',
                type: 'color',
                value: '#286bfa',
            },
            {
                key: 'tColor',
                label: 'Terrorist Color',
                desc: 'Color of the terrorist team',
                type: 'color',
                value: '#f52559',
            },
            {
                key: 'borderRadius',
                label: 'Border Radius',
                desc: 'Border radius of the overlay elements',
                type: 'input',
                value: '8px',
            }
        ]
    }
])

const otherSettings = ref<SettingColumn[]>([
    {
        title: 'Other Settings',
        items: [
        ]
    },
])

// mark initialized to avoid auto save on first load
const initialized = ref(false)
let saveTimer: number | null = null

function buildKVFromAll(): Record<string, unknown> {
    const kv: Record<string, unknown> = {}
    const collect = (columns: SettingColumn[]) => {
        for (const column of columns) {
            for (const item of column.items) {
                const key = (item as any).key ?? (item as any).label
                kv[key] = item.value
            }
        }
    }
    collect(managerSettings.value)
    collect(overlaySettings.value)
    collect(otherSettings.value)
    return kv
}

async function loadSettings() {
    try {
        const existing = await window.db.settings.getAll()
        const hasExisting = existing && Object.keys(existing).length > 0

        // Read existing settings from DB
        const applyExisting = (columns: SettingColumn[]) => {
            for (const column of columns) {
                for (const item of column.items) {
                    const key = (item as any).key ?? (item as any).label
                    if (key in existing) {
                        item.value = existing[key] as any
                    } else if (item.label in existing) {
                        // Compatibility: read old label-key and migrate to key
                        item.value = existing[item.label] as any
                    }
                    // Normalize input type to string to ensure InputText renders correctly
                    if ((item as any).type === 'input' && typeof item.value !== 'string') {
                        item.value = String(item.value ?? '')
                    }
                }
            }
        }
        applyExisting(managerSettings.value)
        applyExisting(overlaySettings.value)
        applyExisting(otherSettings.value)

        // Write settings to DB if not initialized
        const kv = buildKVFromAll()
        if (!hasExisting) {
            await window.db.settings.setAll(kv)
        } else {
            // Merge existing settings with new values
            const merged = { ...existing, ...kv }
            await window.db.settings.setAll(merged)
        }
    } catch (err) {
    } finally {
        initialized.value = true
    }
}

function scheduleAutoSave() {
    if (!initialized.value) return
    if (saveTimer) {
        clearTimeout(saveTimer)
        saveTimer = null
    }
    // easy debounce
    saveTimer = window.setTimeout(async () => {
        try {
            const existing = await window.db.settings.getAll()
            const kv = buildKVFromAll()
            await window.db.settings.setAll({ ...existing, ...kv })
            toast.add({ severity: 'success', summary: 'Success', detail: 'Settings saved' })
        } catch (err) {
            console.error('Auto-save settings failed:', err)
        }
    }, 300)
}

onMounted(() => {
    loadSettings()
})

// deep watch settings to auto save
watch([managerSettings, overlaySettings, otherSettings], () => scheduleAutoSave(), { deep: true })
</script>
