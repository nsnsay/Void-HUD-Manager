<template>
    <div class="players-card-container">
        <TransitionGroup name="transform-in" mode="out-in" appear>
            <div v-for="player in Players" :key="player.id">
                <DropdownMenu :open="openedContextPlayerId === player.id"
                    @update:open="val => { if (!val && openedContextPlayerId === player.id) openedContextPlayerId = null }">
                    <DropdownMenuTrigger asChild>
                        <div class="player-card" @contextmenu.prevent="openedContextPlayerId = player.id">
                            <div class="player-avatar">
                                <img :src="player.avatar" alt="">
                            </div>
                            <div class="player-name">{{ player.name }}</div>
                            <div class="player-steamid">{{ player.steamid }}</div>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem @click="openEditPlayerForm(player)">编辑</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" @click="deletePlayer(player.id)">删除</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </TransitionGroup>
        <Transition name="transform-in" mode="out-in">
            <div class="player-card-add" @click="openCreatePlayerForm">
                <Plus class="size-6" />
            </div>
        </Transition>
    </div>

    <Transition name="fade" mode="out-in">
        <div class="create-player-form-container" v-if="showCreatePlayerForm">
            <div class="form-title">{{ t('players.createTitle') }}</div>
            <div class="input-container">
                <div class="form-input-group">
                    <User class="size-4 opacity-60" />
                    <Input v-model="createPlayerForm.name" :placeholder="t('players.nicknamePlaceholder')" />
                </div>

                <div class="form-input-group">
                    <IdCard class="size-4 opacity-60" />
                    <Input v-model="createPlayerForm.realname" :placeholder="t('players.realnamePlaceholder')" />
                </div>
            </div>
            <div class="input-container">
                <div class="form-input-group">
                    <ExternalLink class="size-4 opacity-60" />
                    <Input v-model="createPlayerForm.steamid" :placeholder="t('players.steamidPlaceholder')" />
                </div>

                <div class="form-input-group">
                    <Camera class="size-4 opacity-60" />
                    <Input v-model="createPlayerForm.camera" :placeholder="t('players.cameraPlaceholder')" />
                </div>
            </div>
            <div class="input-container">
                <AvatarUpload v-model="createPlayerForm.avatar" :label="t('players.uploadAvatar')" />
            </div>
            <div class="input-container">
                <Select v-model="createPlayerForm.type">
                    <SelectTrigger class="min-w-[180px]">
                        <SelectValue :placeholder="t('players.type.player')" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="opt in playerTypeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div class="input-container" style="margin-top: 0.5rem;">
                <Button variant="destructive" @click="closeCreatePlayerForm">{{ t('common.cancel') }}</Button>
                <Button variant="default" @click="createPlayer">{{ t('common.create') }}</Button>
            </div>
        </div>
    </Transition>

    <Transition name="fade" mode="out-in">
        <div class="edit-player-form-container" v-if="showEditPlayerForm">
            <div class="form-title">{{ t('players.editTitle') }}</div>
            <div class="input-container">
                <div class="form-input-group">
                    <User class="size-4 opacity-60" />
                    <Input v-model="editPlayerForm.name" :placeholder="t('players.nicknamePlaceholder')" />
                </div>

                <div class="form-input-group">
                    <IdCard class="size-4 opacity-60" />
                    <Input v-model="editPlayerForm.realname" :placeholder="t('players.realnamePlaceholder')" />
                </div>
            </div>
            <div class="input-container">
                <div class="form-input-group">
                    <ExternalLink class="size-4 opacity-60" />
                    <Input v-model="editPlayerForm.steamid" :placeholder="t('players.steamidPlaceholder')" />
                </div>

                <div class="form-input-group">
                    <Camera class="size-4 opacity-60" />
                    <Input v-model="editPlayerForm.camera" :placeholder="t('players.cameraPlaceholder')" />
                </div>
            </div>
            <div class="input-container">
                <AvatarUpload v-model="editPlayerForm.avatar" :label="t('players.uploadAvatar')" />
            </div>
            <div class="input-container">
                <Select v-model="editPlayerForm.type">
                    <SelectTrigger class="min-w-[180px]">
                        <SelectValue :placeholder="t('players.type.player')" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="opt in playerTypeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div class="input-container" style="margin-top: 0.5rem;">
                <Button variant="destructive" @click="closeEditPlayerForm">{{ t('common.cancel') }}</Button>
                <Button variant="default" @click="updatePlayer">{{ t('common.save') }}</Button>
            </div>
        </div>
    </Transition>
</template>

<style scoped lang="scss">
.create-player-form-container,
.edit-player-form-container {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    height: 100%;
    background: var(--background-glass);
    backdrop-filter: blur(10px);

    .form-title {
        font-size: 1.2rem;
        font-weight: 600;
        opacity: 0.7;
    }

}

.players-card-container {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: row;
    gap: 0.5rem;
    width: 100%;
    height: 100%;
    padding: 1rem;
    --player-card-width: 160px;
    --player-card-height: 180px;

    .player-card {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 0.6rem;
        width: var(--player-card-width);
        height: var(--player-card-height);
        border-radius: var(--radius);
        border: 1px solid var(--border);
        box-shadow: var(--shadow-2xs);
        padding: 0.5rem;
        position: relative;

        .player-control {
            position: absolute;
            top: 0.25rem;
            right: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: row;
            gap: 0.3rem;
            background: var(--background-weak);
            border-radius: var(--radius);
            opacity: 0.4;

            &.left {
                left: 0.5rem;
                right: unset;
            }

            i {
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: var(--transition);
                width: 24px;
                height: 24px;
                border-radius: var(--radius);

                &:hover {
                    background: var(--background-glass);
                }
            }
        }

        .player-avatar {
            height: 6.5rem;
            border-radius: 50%;
            border: 2px solid var(--color-primary);

            overflow: hidden;

            img {
                height: 100%;
                object-fit: cover;
            }
        }

        .player-name {
            font-size: 1rem;
            font-weight: 600;
        }

        .player-steamid {
            font-size: 0.8rem;
            font-weight: 400;
            opacity: 0.7;
        }
    }

    .player-card-add {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        gap: 0.2rem;
        width: var(--player-card-width);
        height: var(--player-card-height);
        background: var(--background-weak);
        border-radius: var(--radius);
        padding: 0.5rem;
        cursor: pointer;
        opacity: 0.4;
    }
}

.form-input-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
}
</style>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import AvatarUpload from '../components/AvatarUpload.vue';
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { User, IdCard, ExternalLink, Camera, Plus } from 'lucide-vue-next'


const { t } = useI18n({ useScope: 'global' })


const Players = ref<Player[]>([])
const openedContextPlayerId = ref<any>(null)

async function loadPlayers() {
    try {
        const list = await window.db.players.getAll()
        Players.value = list as Player[]
    } catch (error: any) {
        toast.error(t('common.loadFailed'), { description: error?.message ?? t('common.loadFailed'), duration: 4000 })
    }
}

const createPlayerForm = ref<Player>({
    id: '',
    name: '',
    realname: '',
    steamid: '',
    camera: '',
    avatar: '',
    type: 'player'
})

const playerTypeOptions = computed(() => [
    { label: t('players.type.player'), value: 'player' },
    { label: t('players.type.coach'), value: 'coach' },
    { label: t('players.type.spectator'), value: 'spectator' }
])

const showCreatePlayerForm = ref(false)
function openCreatePlayerForm() {
    showCreatePlayerForm.value = true
}
function closeCreatePlayerForm() {
    showCreatePlayerForm.value = false
}
onMounted(() => {
    loadPlayers()
})
async function createPlayer() {
    // verify required fields
    const { name, steamid, type } = createPlayerForm.value
    const missing: string[] = []
    if (!name) missing.push(t('players.nickname'))
    if (!steamid) missing.push(t('players.steamid'))
    if (!type) missing.push(t('players.type.player'))

    if (missing.length) {
        toast.warning(t('common.missingRequired'), { description: t('common.pleaseFill', { fields: missing.join(' / ') }), duration: 3500 })
        return
    }

    // create id
    const newItem = {
        ...createPlayerForm.value,
        id: Date.now()
    }

    try {
        await window.db.players.add(newItem)
        await loadPlayers()

        toast.success(t('players.toast.createSuccess'), { description: `${newItem.name}`, duration: 3000 })

        // clear form
        createPlayerForm.value = {
            id: '',
            name: '',
            realname: '',
            steamid: '',
            camera: '',
            avatar: '',
            type: 'player'
        }
        showCreatePlayerForm.value = false
    } catch (error: any) {
        toast.error(t('players.toast.createFailed'), { description: error?.message ?? t('common.dbWriteFailed'), duration: 4000 })
    }
}


const showEditPlayerForm = ref(false)
const editPlayerForm = ref<Player>({
    id: '',
    name: '',
    realname: '',
    steamid: '',
    camera: '',
    avatar: '',
    type: 'player'
})

function openEditPlayerForm(player: Player) {
    editPlayerForm.value = { ...player }
    showEditPlayerForm.value = true
}

function closeEditPlayerForm() {
    showEditPlayerForm.value = false
}

async function updatePlayer() {
    const { id, name, steamid, type } = editPlayerForm.value
    const missing: string[] = []
    if (!name) missing.push(t('players.nickname'))
    if (!steamid) missing.push(t('players.steamid'))
    if (!type) missing.push(t('players.type.player'))

    if (missing.length) {
        toast.warning(t('common.missingRequired'), { description: t('common.pleaseFill', { fields: missing.join(' / ') }), duration: 3500 })
        return
    }

    try {
        const current = await window.db.players.getAll()
        const updated = (current as Player[]).map(p => p.id === id ? { ...editPlayerForm.value } : p)
        await window.db.players.set(updated as any)

        await loadPlayers()
        showEditPlayerForm.value = false
        toast.success(t('players.toast.updateSuccess'), { description: `${editPlayerForm.value.name}`, duration: 3000 })
    } catch (error: any) {
        toast.error(t('players.toast.updateFailed'), { description: error?.message ?? t('common.dbWriteFailed'), duration: 4000 })
    }
}

async function deletePlayer(id: string | number) {
    try {
        const ok = await window.db.players.remove(id)
        if (ok) {
            await loadPlayers()
            toast.success(t('common.deleteSuccess'), { duration: 2500 })
        } else {
            toast.warning(t('common.deleteFailed'), { description: t('common.recordNotFound'), duration: 3000 })
        }
    } catch (error: any) {
        toast.error(t('common.deleteFailed'), { description: error?.message ?? t('common.dbWriteFailed'), duration: 4000 })
    }
}


</script>
