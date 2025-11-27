<template>
  <div class="avatar-upload-wrapper" @dragover.prevent="onDragOver" @drop.prevent="onDrop">
    <div class="avatar-upload" :style="uploadStyle" @click="triggerFileSelect">
      <img v-if="modelValue" :src="modelValue" alt="Avatar Preview" />
      <div v-else class="avatar-placeholder">
        <User class="size-8 opacity-60" />
      </div>
      <div class="avatar-overlay">
        <Camera class="size-4 opacity-80" />
        <span>{{ label }}</span>
      </div>
    </div>

    <input ref="fileInputRef" type="file" :accept="accept" @change="onFileChange" hidden />

    <div v-if="showActions" class="upload-actions">
      <Button variant="destructive" @click="clear" :disabled="!modelValue">
        <Trash class="size-4" />
        {{ t('common.remove') }}
      </Button>
      <Button variant="default" @click="triggerFileSelect">
        <Upload class="size-4" />
        {{ t('common.upload') }}
      </Button>
    </div>

    <div class="upload-hints">
      <small v-if="localError" class="error">{{ localError }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { User, Camera, Trash, Upload } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const props = withDefaults(defineProps<{
  modelValue: any
  accept?: string
  maxSize?: number
  label?: string
  size?: number
  rounded?: boolean
  overlayIcon?: string
  placeholderIcon?: string
  showActions?: boolean
}>(), {
  accept: 'image/png,image/jpeg,image/webp',
  maxSize: 4 * 1024 * 1024,
  label: 'Upload',
  size: 140,
  rounded: true,
  overlayIcon: 'pi pi-camera',
  placeholderIcon: 'pi pi-user',
  showActions: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'error', value: string): void
  (e: 'change', file: File): void
  (e: 'clear'): void
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const localError = ref<string>('')
const { t } = useI18n({ useScope: 'global' })

const uploadStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  borderRadius: props.rounded ? '50%' : '8px',
}))

function triggerFileSelect() {
  fileInputRef.value?.click()
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) handleFile(file)
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
}

function onDrop(e: DragEvent) {
  const file = e.dataTransfer?.files?.[0]
  if (file) handleFile(file)
}

function clear() {
  emit('update:modelValue', '')
  localError.value = ''
  emit('error', '')
  if (fileInputRef.value) fileInputRef.value.value = ''
  emit('clear')
}

function handleFile(file: File) {
  localError.value = ''
  const allowed = props.accept.split(',').map((s) => s.trim())
  if (!allowed.includes(file.type)) {
    localError.value = t('common.unsupportedFormat')
    emit('error', localError.value)
    return
  }
  if (file.size > props.maxSize) {
    localError.value = t('common.imageTooLarge', { size: (props.maxSize / 1024 / 1024).toFixed(0) })
    emit('error', localError.value)
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    const result = reader.result as string
    emit('update:modelValue', result)
    emit('change', file)
  }
  reader.onerror = () => {
    localError.value = t('common.readImageFailed')
    emit('error', localError.value)
  }
  reader.readAsDataURL(file)
}
</script>

<style scoped lang="scss">
.avatar-upload-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;

  .avatar-upload {
    position: relative;
    overflow: hidden;
    border: 1px solid var(--border);
    cursor: pointer;
    transition: var(--transition);

    &:hover {
      box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.35);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--border);
      font-size: 2rem;
    }

    .avatar-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      background: linear-gradient(to top,
          rgba(0, 0, 0, 0.45),
          rgba(0, 0, 0, 0));
      color: var(--text-strong);
      font-size: 0.85rem;
      opacity: 0;
      transition: var(--transition);
    }

    &:hover .avatar-overlay {
      opacity: 1;
    }
  }

  .upload-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .upload-hints {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .error {
    color: var(--chart-5);
  }
}
</style>
