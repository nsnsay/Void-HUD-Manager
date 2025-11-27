<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ColorPicker } from '@/components/ui/color-picker';
import { Slider } from '@/components/ui/slider'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'


const { t } = useI18n({ useScope: 'global' })

const settings = ref({
  "seriesName_first": "BLAST Rival #1",
  "seriesName_second": "Grand Final",
  "seriesName_third": "VoidHUD",
  "overlayFocusedPlayer": true,
  "overlaySidebars": "row",
  "overlayTopbar": true,
  "overlayRadar": true,
  "ctColor": "286efa",
  "tColor": "f52559",
  "borderRadius": "0",
  "currentMatchId": "current",
  "shortcutKey": "Ctrl+Alt+I",
  "acrylicEnabled": true
})

const default_settings = ref({
  "seriesName_first": "BLAST Rival #1",
  "seriesName_second": "Grand Final",
  "seriesName_third": "VoidHUD",
  "overlayFocusedPlayer": true,
  "overlaySidebars": "row",
  "overlayTopbar": true,
  "overlayRadar": true,
  "ctColor": "286efa",
  "tColor": "f52559",
  "borderRadius": "0",
  "currentMatchId": "current",
  "shortcutKey": "Ctrl+Alt+I",
  "acrylicEnabled": true
})

const modifierOptions = [
  'None',
  'Ctrl',
  'Alt',
  'Shift',
  'Ctrl+Alt',
  'Ctrl+Shift',
  'Alt+Shift',
  'Ctrl+Alt+Shift'
]
const keyOptions = [
  ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
  ...Array.from({ length: 10 }, (_, i) => String(i)),
  ...Array.from({ length: 12 }, (_, i) => `F${i + 1}`)
]

const selectedModifiers = ref<string>('None')
const selectedKey = ref<string>('I')

const parseShortcut = (shortcut: string) => {
  const parts = String(shortcut).split('+')
  const mods = parts.filter(p => ['Ctrl', 'Alt', 'Shift', 'Meta', 'Command'].includes(p))
  const main = parts.find(p => !mods.includes(p)) || 'I'
  selectedModifiers.value = mods.length ? mods.join('+') : 'None'
  selectedKey.value = main
}

parseShortcut(settings.value.shortcutKey)

watch([selectedModifiers, selectedKey], ([m, k]) => {
  settings.value.shortcutKey = (m && m !== 'None' ? m + '+' : '') + k
})

watch(() => settings.value.shortcutKey, (val) => {
  parseShortcut(val)
})
watch(() => settings.value.acrylicEnabled, () => {
  promptRestart()
})

const saveSettings = async () => {
  try {
    await window.db.settings.setAll({ ...settings.value })
    toast.success(t('settings.toast.saved'), { duration: 2500 })
  } catch (error: any) {
    toast.error(t('common.saveFailed'), { description: error?.message ?? t('common.saveFailed'), duration: 3500 })
  }
}

function promptRestart() {
  toast.info(t('common.restartRequired'), {
    duration: 6000,
    action: {
      label: t('common.relaunchNow'),
      onClick: async () => {
        try {
          await window.electron.ipcRenderer.invoke('app:relaunch')
        } catch (err: any) {
          toast.error(t('common.saveFailed'), { description: String(err?.message ?? err) })
        }
      }
    },
    cancel: {
      label: t('common.notNow')
    }
  })
}

const resetSettings = async () => {
  try {
    settings.value = { ...default_settings.value }
    await window.db.settings.setAll({ ...default_settings.value })
    toast.success(t('common.resetSuccess'), { duration: 2500 })
  } catch (error: any) {
    toast.error(t('common.saveFailed'), { description: error?.message ?? t('common.saveFailed'), duration: 3500 })
  }
}

onMounted(async () => {
  try {
    const data = await window.db.settings.getAll()
    settings.value = { ...default_settings.value, ...data }
    parseShortcut(settings.value.shortcutKey)
  } catch (_) { }
})
</script>

<template>
  <div class="settings-container">
    <Transition name="transform-in" mode="out-in" appear>
      <div class="settings-item">
        <div class="setting-item-title">{{ t('settings.manager.title') }}</div>
        <div class="setting-item-container">
          <div class="setting-item">
            <div class="setting-item-label">
              <div class="title">{{ t('settings.manager.seriesName_first.label') }}</div>
              <div class="description">{{ t('settings.manager.seriesName_first.desc') }}</div>
            </div>
            <Input class="w-60" id="seriesName_first" v-model="settings.seriesName_first" type="text" />
          </div>
          <div class="setting-item">
            <div class="setting-item-label">
              <div class="title">{{ t('settings.manager.seriesName_second.label') }}</div>
              <div class="description">{{ t('settings.manager.seriesName_second.desc') }}</div>
            </div>
            <Input class="w-60" id="seriesName_second" v-model="settings.seriesName_second" type="text" />
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="transform-in" mode="out-in" appear>
      <div class="settings-item">
        <div class="setting-item-title">{{ t('settings.managerSettings.title') }}</div>
        <div class="setting-item-container">
          <div class="setting-item">
            <div class="setting-item-label">
              <div class="title">{{ t('settings.managerSettings.acrylic.label') }}</div>
              <div class="description">{{ t('settings.managerSettings.acrylic.desc') }}</div>
            </div>
            <Switch id="acrylicEnabled" v-model="settings.acrylicEnabled" />
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="transform-in" mode="out-in" appear>
      <div class="settings-item">
        <div class="setting-item-title">{{ t('settings.overlay.color') }}</div>
        <div class="setting-item-container">
          <div class="setting-item">
            <div class="setting-item-label">
              <div class="title">{{ t('settings.overlay.ctColor.label') }}</div>
              <div class="description">{{ t('settings.overlay.ctColor.desc') }}</div>
            </div>
            <ColorPicker id="ctColor" :value="'#' + settings.ctColor as `#${string}`"
              @value-change="val => settings.ctColor = String(val?.hex ?? '').replace('#', '')">
              <div class="color-swatch cursor-pointer"
                :style="{ width: '2rem', height: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', backgroundColor: '#' + settings.ctColor }" />
            </ColorPicker>
          </div>
          <div class="setting-item">
            <div class="setting-item-label">
              <div class="title">{{ t('settings.overlay.tColor.label') }}</div>
              <div class="description">{{ t('settings.overlay.tColor.desc') }}</div>
            </div>
            <ColorPicker id="tColor" :value="'#' + settings.tColor as `#${string}`"
              @value-change="val => settings.tColor = String(val?.hex ?? '').replace('#', '')">
              <div class="color-swatch cursor-pointer"
                :style="{ width: '2rem', height: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', backgroundColor: '#' + settings.tColor }" />
            </ColorPicker>
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="transform-in" mode="out-in" appear>
      <div class="settings-item">
        <div class="setting-item-title">{{ t('settings.overlay.title') }}</div>
        <div class="setting-item-container">
          <div class="setting-item">
            <div class="setting-item-label">
              <div class="title">{{ t('settings.overlay.focusedPlayer.label') }}</div>
              <div class="description">{{ t('settings.overlay.focusedPlayer.desc') }}</div>
            </div>
            <Switch id="overlayFocusedPlayer" v-model="settings.overlayFocusedPlayer" />
          </div>
          <div class="setting-item">
            <div class="setting-item-label">
              <div class="title">{{ t('settings.overlay.sidebars.label') }}</div>
              <div class="description">{{ t('settings.overlay.sidebars.desc') }}</div>
            </div>
            <Select v-model="settings.overlaySidebars">
              <SelectTrigger class="w-[150px]">
                <SelectValue placeholder="Sidebars" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="row">{{ t('settings.overlay.row') }}</SelectItem>
                <SelectItem value="column">{{ t('settings.overlay.column') }}</SelectItem>
                <SelectItem value="undefined">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="setting-item">
            <div class="setting-item-label">
              <div class="title">{{ t('settings.overlay.topbar.label') }}</div>
              <div class="description">{{ t('settings.overlay.topbar.desc') }}</div>
            </div>
            <Switch id="overlayTopbar" v-model="settings.overlayTopbar" />
          </div>
          <div class="setting-item">
            <div class="setting-item-label">
              <div class="title">{{ t('settings.overlay.radar.label') }}</div>
              <div class="description">{{ t('settings.overlay.radar.desc') }}</div>
            </div>
            <Switch id="overlayRadar" v-model="settings.overlayRadar" />
          </div>
          <div class="setting-item">
            <div class="setting-item-label">
              <div class="title">{{ t('settings.overlay.borderRadius.label') }} <div class="border-radius-sims"
                  :style="{ borderRadius: settings.borderRadius + 'px' }">{{
                    settings.borderRadius }}</div>
              </div>
              <div class="description">{{ t('settings.overlay.borderRadius.desc') }}
              </div>
            </div>
            <Slider class="w-60" id="borderRadius" :model-value="[Number(settings.borderRadius)]"
              @update:model-value="val => settings.borderRadius = String(val?.[0] ?? 0)" :min="0" :max="20" :step="1" />
          </div>
          <div class="setting-item">
            <div class="setting-item-label">
              <div class="title">{{ t('settings.other.shortcutKey.label') }}</div>
              <div class="description">{{ t('settings.other.shortcutKey.desc') }}</div>
            </div>
            <div style="display:flex; gap:0.5rem; align-items:center;">
              <Select v-model="selectedModifiers">
                <SelectTrigger class="w-[150px]">
                  <SelectValue placeholder="Modifiers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="m in modifierOptions" :key="m" :value="m">{{ m }}</SelectItem>
                </SelectContent>
              </Select>
              <Select v-model="selectedKey">
                <SelectTrigger class="w-[150px]">
                  <SelectValue placeholder="Key" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="k in keyOptions" :key="k" :value="k">{{ k }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <div class="button-container">
      <Button class="w-30" variant="secondary" @click="resetSettings">Reset</Button>
      <Button class="w-50" variant="default" @click="saveSettings">Save</Button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.settings-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  gap: 1rem;
  padding: 1rem;

  .button-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
    min-height: 50px;
    margin-bottom: auto;
    width: 100%;
  }

  .settings-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;

    .setting-item-title {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--color-zinc-500);
      padding-left: 0.2rem;
      margin-bottom: 0.5rem;
    }

    .setting-item-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      width: 100%;
      background: var(--color-zinc-900);
      padding: 1rem;
      border-radius: var(--radius);

      .setting-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        position: relative;
        margin-bottom: 0.5rem;

        &:last-child {
          margin-bottom: 0;

          &::after {
            display: none;
          }
        }

        &::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 98%;
          height: 1px;
          background: rgba(255, 255, 255, 0.05);
        }

        .setting-item-label {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          width: 100%;
          height: 100%;

          .title {
            display: flex;
            flex-direction: row;
            align-items: center;
            font-size: 0.9rem;
            font-weight: 500;
            color: var(--color-zinc-300);
            padding-left: 0.2rem;
            margin-bottom: 0.2rem;
            position: relative;

            .border-radius-sims {
              position: absolute;
              left: 125%;
              text-align: center;
              background: var(--color-zinc-800);
              padding: 0.4rem 2rem;
              transition: var(--transition);
            }
          }

          .description {
            font-size: 0.8rem;
            font-weight: 400;
            color: var(--color-zinc-400);
            padding-left: 0.2rem;
          }
        }
      }
    }
  }
}
</style>
