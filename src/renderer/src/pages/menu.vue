<template>
  <div class="menu-container">
    <div class="menu-title">{{ t('menu.title') }}</div>
    <div class="menu-item">
      <div class="menu-item-title">{{ t('menu.step1.title') }}</div>
      <div class="menu-item-content">{{ t('menu.step1.content1_prefix') }}<span>CS2.exe</span>{{
        t('menu.step1.content1_suffix') }}</div>
      <Button variant="secondary" style="margin-top: 0.5rem;" @click="autoPlaceGSI">
        {{ t('common.select') }}
      </Button>
    </div>
    <div class="menu-item">
      <div class="menu-item-title">{{ t('menu.step2.title') }}</div>
      <div class="menu-item-content">{{ t('menu.step2.content1_beforeIcon') }}
        <Blend style="margin: 0 0.25rem;" color="var(--color-rose-800)" :size="16" />{{
          t('menu.step2.content1_afterIcon')
        }}
      </div>
      <div class="menu-item-content">{{ t('menu.step2.content2_prefix') }} <span>cl_draw_only_deathnotices 1</span> {{
        t('menu.step2.content2_suffix') }}</div>
    </div>
    <div class="menu-item">
      <div class="menu-item-title">{{ t('menu.step3.title') }}</div>
      <div class="menu-item-content">{{ t('menu.step3.content1_prefix') }}<span>http://localhost:5031/overlay</span>{{
        t('menu.step3.content1_suffix') }}
      </div>
      <div class="menu-item-content">{{ t('menu.step3.content2') }}</div>
    </div>
    <div class="menu-item">
      <div class="menu-item-title">{{ t('menu.hlae.titlePrefix') }} <a style="color: var(--color-secondary);"
          href="https://github.com/advancedfx/advancedfx" target="_blank">HLAE</a></div>
      <div class="menu-item-content">{{ t('menu.hlae.desc') }}</div>
      <div class="menu-item-content">{{ t('menu.hlae.deathmsgTitle') }}
        <span class="copy" @click="copyToClipboard(ctColorGet)">{{ ctColorGet }}</span> | <span class="copy"
          @click="copyToClipboard(tColorGet)">{{ tColorGet }}</span>
      </div>
      <div class="menu-item-content">
        {{ t('menu.hlae.moreInfoPrefix') }}<a style="color: var(--color-secondary);" href="
          https://github.com/advancedfx/advancedfx/wiki/Source2%3Amirv_colors" target="_blank">HLAE
          Wiki</a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.menu-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 0.55rem;
  width: 100%;
  height: 100%;
  padding: 1rem;

  .menu-title {
    width: 100%;
    text-align: center;
    font-size: 1.2rem;
    font-weight: 600;
    opacity: 0.7;
  }

  .menu-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
    min-height: 4rem;
    padding: 1rem;
    border-radius: 0.5rem;
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease-in-out;

    .menu-item-title {
      font-size: 1rem;
      font-weight: 500;
      color: #fff;
    }

    .menu-item-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;

      span {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        font-weight: 500;
        color: #fff;
        font-family: 'Consolas', monospace;
        background: var(--background);
        padding: 0.1rem 0.5rem;
        border-radius: var(--radius);

        &.copy {
          cursor: pointer;
        }
      }

      a {
        color: var(--color-primary);
      }
    }

    &:hover {
      border-color: var(--color-primary);
    }
  }
}
</style>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Blend } from 'lucide-vue-next'

const { t } = useI18n({ useScope: 'global' })

async function autoPlaceGSI() {
  try {
    const res = await window.api.autoPlaceGSI()
    if (res?.success) {
      toast.success('Success', { description: res.message })
    } else {
      toast.warning('Not Completed', { description: res?.message ?? 'Operation canceled or failed' })
    }
  } catch (err: any) {
    toast.error('Error', { description: String(err?.message ?? err) })
  }
}

async function getSettings() {
  try {
    const res = await window.db.settings.getAll()
    return res
  } catch (err: any) {
    toast.error('Error', { description: String(err?.message ?? err) })
    return null
  }
}

const settings = ref<any>(null)

onMounted(async () => {
  settings.value = await getSettings()
})

const ctColorGet = computed(() => {
  const color = '#' + settings.value?.ctColor?.toUpperCase()
  const toRgb = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `mirv_deathmsg colors ct ${r} ${g} ${b} 255`
  }
  return toRgb(color)
})

const tColorGet = computed(() => {
  const color = '#' + settings.value?.tColor?.toUpperCase()
  const toRgb = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `mirv_deathmsg colors t ${r} ${g} ${b} 255`
  }
  return toRgb(color)
})

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  toast.success('Success', { description: `Copied to clipboard: '${text}'` })
}
</script>
