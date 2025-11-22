<template>
    <div class="settings-container">
        <div class="settings-clms manager-settings">
            <div v-for="(column, cIdx) in managerSettings" :key="cIdx" class="settings-clm">
                <div v-if="column.titleKey" class="settings-clm-title">{{ t(column.titleKey) }}</div>
                <div v-for="item in column.items" :key="item.key" :class="['settings-item', item.type]">
                    <div class="settings-item-text">
                        <div class="label">{{ t(item.labelKey) }}</div>
                        <div class="desc">{{ item.descKey ? t(item.descKey) : '' }}</div>
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
            <div v-for="(column, cIdx) in overlaySettings" :key="cIdx" class="settings-clm">
                <div v-if="column.titleKey" class="settings-clm-title">{{ t(column.titleKey) }}</div>
                <div v-for="item in column.items" :key="item.key" :class="['settings-item', item.type]">
                    <div class="settings-item-text">
                        <div class="label">{{ t(item.labelKey) }}</div>
                        <div class="desc">{{ item.descKey ? t(item.descKey) : '' }}</div>
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
            <div v-for="(column, cIdx) in otherSettings" :key="cIdx" class="settings-clm">
                <div v-if="column.titleKey" class="settings-clm-title">{{ t(column.titleKey) }}</div>
                <div v-for="item in column.items" v-if="column.items.length > 0" :key="item.key"
                    :class="['settings-item', item.type]">
                    <div class="settings-item-text">
                        <div class="label">{{ t(item.labelKey) }}</div>
                        <div class="desc">{{ item.descKey ? t(item.descKey) : '' }}</div>
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
            gap: 0.5rem;
            background: rgba(0, 0, 0, 0.25);
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
                background: rgba(0, 0, 0, 0.6);
                padding: 0.25rem 0;
                font-weight: 400;
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
                        color: white;
                    }

                    .desc {
                        font-size: 0.9rem;
                        font-weight: 400;
                        opacity: 0.5;
                        color: white;
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
import { useI18n } from 'vue-i18n'
const toast = useToast()
const { t } = useI18n({ useScope: 'global' })

// Explicit types so the template knows column.items, item.label, item.type, etc.
type SettingValue = string | boolean
type SettingType = 'boolean' | 'input' | 'color'
interface SettingItem {
    key: string
    labelKey: string
    descKey?: string
    type: SettingType
    value: SettingValue
    // 兼容旧版本：历史上曾以 label 作为键存储
    legacyLabel?: string
}
interface SettingColumn {
    titleKey?: string
    items: SettingItem[]
}

const managerSettings = ref<SettingColumn[]>([
    {
        titleKey: 'settings.manager.title',
        items: [
            {
                key: 'seriesName_first',
                labelKey: 'settings.manager.seriesName_first.label',
                descKey: 'settings.manager.seriesName_first.desc',
                type: 'input',
                value: 'VoidHUD',
                legacyLabel: 'Series Name (#1)'
            },
            {
                key: 'seriesName_second',
                labelKey: 'settings.manager.seriesName_second.label',
                descKey: 'settings.manager.seriesName_second.desc',
                type: 'input',
                value: 'VoidHUD',
                legacyLabel: 'Series Name (#2)'
            },
            {
                key: 'seriesName_third',
                labelKey: 'settings.manager.seriesName_third.label',
                descKey: 'settings.manager.seriesName_third.desc',
                type: 'input',
                value: 'VoidHUD',
                legacyLabel: 'Series Name (#3) (Not available)'
            },
        ]
    },
])

const overlaySettings = ref<SettingColumn[]>([
    {
        titleKey: 'settings.overlay.title',
        items: [
            {
                key: 'overlayFocusedPlayer',
                labelKey: 'settings.overlay.focusedPlayer.label',
                descKey: 'settings.overlay.focusedPlayer.desc',
                type: 'boolean',
                value: true,
                legacyLabel: 'Focused Player'
            },
            {
                key: 'overlaySidebars',
                labelKey: 'settings.overlay.sidebars.label',
                descKey: 'settings.overlay.sidebars.desc',
                type: 'boolean',
                value: true,
                legacyLabel: 'Sidebars'
            },
            {
                key: 'overlayTopbar',
                labelKey: 'settings.overlay.topbar.label',
                descKey: 'settings.overlay.topbar.desc',
                type: 'boolean',
                value: true,
                legacyLabel: 'Topbar'
            },
            {
                key: 'overlayRadar',
                labelKey: 'settings.overlay.radar.label',
                descKey: 'settings.overlay.radar.desc',
                type: 'boolean',
                value: true,
                legacyLabel: 'Radar'
            }
        ]
    },
    {
        items: [
            {
                key: 'ctColor',
                labelKey: 'settings.overlay.ctColor.label',
                descKey: 'settings.overlay.ctColor.desc',
                type: 'color',
                value: '#286bfa',
                legacyLabel: 'Counter Terrorist Color'
            },
            {
                key: 'tColor',
                labelKey: 'settings.overlay.tColor.label',
                descKey: 'settings.overlay.tColor.desc',
                type: 'color',
                value: '#f52559',
                legacyLabel: 'Terrorist Color'
            },
            {
                key: 'borderRadius',
                labelKey: 'settings.overlay.borderRadius.label',
                descKey: 'settings.overlay.borderRadius.desc',
                type: 'input',
                value: '8px',
                legacyLabel: 'Border Radius'
            }
        ]
    }
])

const otherSettings = ref<SettingColumn[]>([
    {
        titleKey: 'settings.other.title',
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
                const key = item.key
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
                    const key = item.key
                    if (key in existing) {
                        item.value = existing[key] as any
                    } else if ((item as any).legacyLabel && ((item as any).legacyLabel in existing)) {
                        // 兼容旧版本：历史上以 label 作为键存储
                        item.value = existing[(item as any).legacyLabel] as any
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
            toast.add({ severity: 'success', summary: t('common.save'), detail: t('settings.toast.saved') })
        } catch (err) {
            console.error('Auto-save settings failed:', err)
        }
    }, 1500)
}

onMounted(() => {
    loadSettings()
})

// deep watch settings to auto save
watch([managerSettings, overlaySettings, otherSettings], () => scheduleAutoSave(), { deep: true })
</script>
