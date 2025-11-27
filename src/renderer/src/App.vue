<script setup lang="ts">
import WindowControls from './components/window-controls/window-controls.vue'
import Pages from './pages.vue'
import { onMounted } from 'vue'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'

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
          toast.info(t('updater.title'), { description: t('updater.checking'), duration: 3000 })
          break
        case 'available': {
          const version = payload?.info?.version ?? ''
          toast.warning(t('updater.title'), { description: t('updater.available', { version }), duration: 6000 })
          break
        }
        case 'notAvailable':
          toast.success(t('updater.title'), { description: t('updater.notAvailable'), duration: 3000 })
          break
        case 'downloading': {
          const percent = Math.floor(payload?.progress?.percent ?? 0)
          toast.info(t('updater.title'), { description: t('updater.downloading', { percent }), duration: 3000 })
          break
        }
        case 'downloaded':
          toast.success(t('updater.title'), { description: t('updater.downloaded'), duration: 5000 })
          break
        case 'error':
          toast.error(t('updater.title'), { description: t('updater.error'), duration: 5000 })
          console.error(payload)
          break
      }
    })
    // 应用加载后主动检查一次更新
    window.update.check()
  }
})
</script>

<template>
  <Toaster position="top-center" />
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

    &.right {
      align-items: flex-end;
      justify-content: flex-end;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.transform-in-enter-active,
.transform-in-leave-active {
  transition: transform 0.3s ease;
}

.transform-in-enter-from,
.transform-in-leave-to {
  transform: translateY(-5%);
}

.transform-in-enter-to,
.transform-in-leave-from {
  transform: translateY(0);
}
</style>
