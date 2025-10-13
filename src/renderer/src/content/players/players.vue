<template>
  <div class="players-container">
    <div class="create-player" @click="createPlayer">{{ isEditing ? 'Edit Player' : 'Create Player' }}</div>
    <div class="players-cardlists">
      <div class="player-card" v-for="player in players" :key="player.id">
        <div class="player-name">{{ player.name }}</div>
        <div class="player-avatar">
          <img :src="player.avatar || '../../../public/img/avatar.png'" alt="">
        </div>
        <div class="player-controls">
          <div @click="editPlayer(player.id)" class="player-controls-edit">
            <img src="../../../public/img/edit_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="edit-player" />
          </div>
          <div @click="deletePlayer(String(player.id))" class="player-controls-delete">
            <img src="../../../public/img/delete_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="delete-player" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div @click="handleOverlayClick" v-if="create_player_forms_active" class="create-players-form-container">
    <div class="create-players-form" @click.stop>
      <div class="create-players-form-title" style="font-size: 1.2rem;font-weight: 600;">{{ isEditing ? 'Edit Player' :
        'Create Player' }}</div>
      <input class="create-players-form-input name" type="text" v-model="createPlayerForm.name" placeholder="* Name">
      <input class="create-players-form-input steam-id" type="text" v-model="createPlayerForm.steamId"
        placeholder="* Steam ID">
      <input class="create-players-form-input real-name" type="text" v-model="createPlayerForm.realName"
        placeholder="Real Name">
      <input class="create-players-form-input camera-url" type="text" v-model="createPlayerForm.cameraUrl"
        placeholder="Camera URL">
      <div class="create-players-form-avatar-upload" @dragover.prevent @dragenter.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false" @drop.prevent="onDrop">
        <input ref="fileInputRef" type="file" accept="image/*" @change="onFileChange" hidden />
        <div class="upload-dropzone" :class="{ dragging: isDragging }" @click="onClickUpload">
          <div v-if="!avatarPreview" class="upload-placeholder">
            <img src="../../../public/img/upload_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.png" alt="upload" />
            <div class="upload-text">Drag & Drop or Click to Upload</div>
            <div class="upload-hint">Supports JPG/PNG/WebP/GIF, Max 2MB</div>
          </div>
          <div v-else class="upload-preview">
            <img :src="avatarPreview" alt="avatar preview" />
            <div class="upload-actions">
              <button class="btn change" @click.stop="onClickUpload">Update</button>
              <button class="btn remove" @click.stop="clearAvatar">Remove</button>
            </div>
          </div>
        </div>
      </div>
      <div class="create-button" @click="createPlayerFormSubmit">{{ isEditing ? 'Update' : 'Create' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify'

const create_player_forms_active = ref(false)
type Player = {
  id: string | number
  name: string
  realName?: string
  steamId?: string
  cameraUrl?: string
  avatar?: string | null
}
const players = ref<Player[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const avatarPreview = ref<string | null>(null)
const editingId = ref<string | number | null>(null)

const createPlayerForm = reactive({
  name: '',
  realName: '',
  steamId: '',
  avatar: null as File | null,
  cameraUrl: ''
})

const createPlayer = () => {
  create_player_forms_active.value = true
}

const onClickUpload = () => {
  fileInputRef.value?.click()
}

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    if (!/^image\/(png|jpe?g|webp|gif)$/.test(file.type)) {
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      return
    }
    createPlayerForm.avatar = file
    if (avatarPreview.value) {
      URL.revokeObjectURL(avatarPreview.value)
    }
    avatarPreview.value = URL.createObjectURL(file)
  }
}

const onDrop = (e: DragEvent) => {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (!file) return
  if (!/^image\/(png|jpe?g|webp|gif)$/.test(file.type)) return
  if (file.size > 2 * 1024 * 1024) return
  createPlayerForm.avatar = file
  if (avatarPreview.value) {
    URL.revokeObjectURL(avatarPreview.value)
  }
  avatarPreview.value = URL.createObjectURL(file)
}

const clearAvatar = () => {
  createPlayerForm.avatar = null
  if (avatarPreview.value) {
    URL.revokeObjectURL(avatarPreview.value)
  }
  avatarPreview.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
}

const handleOverlayClick = () => {
  create_player_forms_active.value = false
  isEditing.value = false
  createPlayerForm.name = ''
  createPlayerForm.realName = ''
  createPlayerForm.steamId = ''
  createPlayerForm.avatar = null
  createPlayerForm.cameraUrl = ''
  if (avatarPreview.value) {
    URL.revokeObjectURL(avatarPreview.value)
  }
  avatarPreview.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
}

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const createPlayerFormSubmit = async () => {
  // 编辑模式：使用 modify
  if (editingId.value !== null) {
    const patch: Record<string, any> = {
      name: createPlayerForm.name,
      realName: createPlayerForm.realName,
      steamId: createPlayerForm.steamId,
      cameraUrl: createPlayerForm.cameraUrl
    }
    if (createPlayerForm.avatar) {
      patch.avatar = await fileToDataUrl(createPlayerForm.avatar)
    }

    await window.api.database.modify('players', editingId.value as any, patch)

    // 同步本地列表数据
    const idx = players.value.findIndex(p => p.id === editingId.value)
    if (idx !== -1) {
      players.value[idx] = { ...players.value[idx], ...patch }
    }

    toast.success('Player updated successfully', { autoClose: 3000 })
    // 复位状态
    editingId.value = null
    create_player_forms_active.value = false
    createPlayerForm.name = ''
    createPlayerForm.realName = ''
    createPlayerForm.steamId = ''
    createPlayerForm.avatar = null
    createPlayerForm.cameraUrl = ''
    if (avatarPreview.value) {
      URL.revokeObjectURL(avatarPreview.value)
    }
    avatarPreview.value = null
    if (fileInputRef.value) fileInputRef.value.value = ''
    return
  }

  // 创建模式：使用 add
  if (!createPlayerForm.name || Number.isNaN(Number(createPlayerForm.steamId)) || !createPlayerForm.avatar) {
    toast.error('Please fill in all fields', { autoClose: 3000 })
    return
  }

  const avatarDataUrl = await fileToDataUrl(createPlayerForm.avatar)
  const newPlayer: Player = {
    id: crypto.randomUUID(),
    name: createPlayerForm.name,
    realName: createPlayerForm.realName,
    steamId: createPlayerForm.steamId,
    cameraUrl: createPlayerForm.cameraUrl,
    avatar: avatarDataUrl
  }

  await window.api.database.add('players', newPlayer)
  players.value.push(newPlayer)

  create_player_forms_active.value = false
  createPlayerForm.name = ''
  createPlayerForm.realName = ''
  createPlayerForm.steamId = ''
  createPlayerForm.avatar = null
  createPlayerForm.cameraUrl = ''
  if (avatarPreview.value) {
    URL.revokeObjectURL(avatarPreview.value)
  }
  avatarPreview.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
  toast.success('Player created successfully', { autoClose: 3000 })
}

const deletePlayer = async (id: string) => {
  await window.api.database.delete('players', id)
  players.value = players.value.filter(p => p.id !== id)
  toast.success('Player deleted successfully', { autoClose: 3000 })
}

const isEditing = ref(false)

const editPlayer = (id: string | number) => {
  const player = players.value.find(p => p.id === id)
  if (player) {
    editingId.value = id
    createPlayerForm.name = player.name || ''
    createPlayerForm.realName = player.realName || ''
    createPlayerForm.steamId = player.steamId || ''
    createPlayerForm.cameraUrl = player.cameraUrl || ''
    // 展示已有头像预览（不重置为文件对象）
    avatarPreview.value = player.avatar || null
    if (fileInputRef.value) fileInputRef.value.value = ''
    isEditing.value = true
    create_player_forms_active.value = true
  }
}



onMounted(async () => {
  const list = (await window.api.database.get('players')) as Array<Record<string, any>>
  players.value = list.map((p, idx) => ({
    id: p.id ?? idx,
    name: p.name ?? '',
    realName: p.realName ?? '',
    steamId: p.steamId ?? '',
    cameraUrl: p.cameraUrl ?? '',
    avatar: p.avatar ?? null
  }))
})
</script>

<style scoped lang="scss">
.create-players-form-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);

  .create-players-form {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    width: 360px;
    border-radius: var(--border-radius);
    background: var(--glass-bg);
    box-shadow: var(--shadow-dark);

    .create-players-form-input {
      all: unset;
      background: var(--bg-secondary);
      padding: 0.5rem;
      width: 280px;
      border-radius: var(--border-radius);
      color: var(--text-white);
      transition: 0.3s ease;

      &:focus {
        outline: 1px solid var(--primary);
      }
    }

    .create-button {
      all: unset;
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius);
      background: var(--bg-white);
      color: var(--text-inverse);
      cursor: pointer;
      transition: 0.3s ease;
      font-weight: 600;

      &:hover {
        background: var(--glass-bg);
        color: var(--text-primary);
      }
    }

    .create-players-form-avatar-upload {
      width: 280px;

      .upload-dropzone {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 160px;
        border: 2px dashed var(--border-light);
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: all 0.3s ease-in-out;

        &:hover {
          border-color: var(--primary-dark);
          background: var(--glass-bg);
        }

        &.dragging {
          border-color: var(--primary);
          background: var(--glass-bg);
        }

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          color: var(--text-white);
          opacity: 0.85;

          img {
            width: 24px;
            height: 24px;
            opacity: 0.8;
          }

          .upload-text {
            font-weight: 600;
          }

          .upload-hint {
            font-size: 0.8rem;
            color: var(--text-muted, #a8a8a8);
          }
        }

        .upload-preview {
          position: relative;
          width: 100%;
          height: 100%;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: var(--border-radius);
          }

          .upload-actions {
            position: absolute;
            bottom: 8px;
            right: 8px;
            display: flex;
            gap: 0.5rem;

            .btn {
              all: unset;
              padding: 0.2rem 0.5rem;
              border-radius: var(--border-radius);
              background: var(--glass-bg);
              color: var(--text-white);
              border: 1px solid var(--border-light);
              cursor: pointer;
              transition: 0.3s ease;

              &:hover {
                background: var(--bg-secondary);
              }
            }

            .btn.remove {
              border-color: var(--error);
              color: var(--error);
            }
          }
        }
      }
    }
  }
}

.players-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  width: 100%;


  .create-player {
    background: var(--bg-white);
    color: var(--text-inverse);
    border-radius: var(--border-radius);
    cursor: pointer;
    padding: 0.5rem 0.5rem;
    font-weight: 600;
    margin-left: auto;
    transition: all 0.3s ease-in-out;

    &:hover {
      background: var(--glass-bg);
      color: var(--text-white);
    }
  }

  .players-cardlists {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    gap: 1rem;

    .player-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: column;
      padding: 0.4rem;
      width: 160px;
      height: 200px;
      border-radius: var(--border-radius);
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);

      .player-name {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-white);
      }

      .player-avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid var(--primary);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .player-controls {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.5rem;
        width: 100%;

        .player-controls-edit,
        .player-controls-delete {
          display: flex;
          border: 1px solid var(--border-light);
          padding: 0.2rem;
          border-radius: var(--border-radius);

          img {
            height: 20px;
            cursor: pointer;
            opacity: 0.7;
            transition: all 0.3s ease-in-out;

            &:hover {
              opacity: 1;
            }
          }
        }
      }
    }
  }

}
</style>