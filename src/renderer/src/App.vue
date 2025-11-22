<script setup lang="ts">
import WindowControls from './components/window-controls/window-controls.vue'
import Pages from './pages.vue'
import Toast from 'primevue/toast'
import { onMounted } from 'vue'
import { useToast } from 'primevue'
import { useI18n } from 'vue-i18n'

const toast = useToast()
const { t } = useI18n({ useScope: 'global' })

onMounted(() => {
  // 订阅主进程的更新事件并提示 Toast
  interface UpdatePayload {
    type: string
    info?: {
      version: string
    }
    progress?: {
      percent: number
    }
  }

  if (window.update) {
    window.update.on((payload: UpdatePayload) => {
      switch (payload?.type) {
        case 'checking':
          toast.add({
            severity: 'info',
            summary: t('updater.title'),
            detail: t('updater.checking'),
            life: 3000
          })
          break
        case 'available': {
          const version = payload?.info?.version ?? ''
          toast.add({
            severity: 'warn',
            summary: t('updater.title'),
            detail: t('updater.available', { version }),
            life: 6000
          })
          break
        }
        case 'notAvailable':
          toast.add({
            severity: 'success',
            summary: t('updater.title'),
            detail: t('updater.notAvailable'),
            life: 3000
          })
          break
        case 'downloading': {
          const percent = Math.floor(payload?.progress?.percent ?? 0)
          toast.add({
            severity: 'info',
            summary: t('updater.title'),
            detail: t('updater.downloading', { percent }),
            life: 3000
          })
          break
        }
        case 'downloaded':
          toast.add({
            severity: 'success',
            summary: t('updater.title'),
            detail: t('updater.downloaded'),
            life: 5000
          })
          break
        case 'error':
          toast.add({
            severity: 'error',
            summary: t('updater.title'),
            detail: t('updater.error'),
            life: 5000
          })
          break
      }
    })
    // 应用加载后主动检查一次更新
    window.update.check()
  }
})
</script>

<template>
  <Toast position="bottom-right" />
  <div class="VHApp">
    <WindowControls />
    <Pages />
  </div>
</template>

<style lang="scss">
.VHApp {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.input-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 50%;

  .inp-lab {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;

    &.center {
      align-items: center;
      justify-content: center;

      .title {
        transform: translateY(-50%);
      }
    }

    .title {
      font-size: 0.8rem;
      font-weight: 500;
      opacity: 0.7;

      &.right {
        margin-left: auto;
      }
    }
  }
}

.form-title {
  font-size: 1.2rem;
  font-weight: 600;
  opacity: 0.7;

  &.top {
    position: absolute;
    top: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
