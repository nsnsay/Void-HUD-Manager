<template>
    <div class="players-card-container">
        <div class="player-card" v-for="player in Players" :key="player.id">
            <div class="player-control left">
                <i class="pi pi-pen-to-square" style="color: var(--color-primary);"
                    @click="openEditPlayerForm(player)"></i>
            </div>
            <div class="player-control">
                <i class="pi pi-trash" style="color: var(--status-error);" @click="deletePlayer(player.id)"></i>
            </div>
            <div class="player-avatar">
                <img :src="player.avatar" alt="">
            </div>
            <div class="player-name">{{ player.name }}</div>
            <div class="player-steamid">{{ player.steamid }}</div>
        </div>
        <div class="player-card-add" @click="openCreatePlayerForm">
            <i class="pi pi-plus"></i>
        </div>
    </div>

    <div class="create-player-form-container" v-if="showCreatePlayerForm">
        <div class="form-title">{{ t('players.createTitle') }}</div>
        <div class="input-container">
            <InputGroup>
                <InputGroupAddon>
                    <i class="pi pi-user"></i>
                </InputGroupAddon>
                <InputText v-model="createPlayerForm.name" :placeholder="t('players.nicknamePlaceholder')" />
            </InputGroup>

            <InputGroup>
                <InputGroupAddon>
                    <i class="pi pi-id-card"></i>
                </InputGroupAddon>
                <InputText v-model="createPlayerForm.realname" :placeholder="t('players.realnamePlaceholder')" />
            </InputGroup>
        </div>
        <div class="input-container">
            <InputGroup>
                <InputGroupAddon>
                    <i class="pi pi-external-link"></i>
                </InputGroupAddon>
                <InputText v-model="createPlayerForm.steamid" :placeholder="t('players.steamidPlaceholder')" />
            </InputGroup>

            <InputGroup>
                <InputGroupAddon>
                    <i class="pi pi-camera"></i>
                </InputGroupAddon>
                <InputText v-model="createPlayerForm.camera" :placeholder="t('players.cameraPlaceholder')" />
            </InputGroup>
        </div>
        <div class="input-container">
            <AvatarUpload v-model="createPlayerForm.avatar" :label="t('players.uploadAvatar')" />
        </div>
        <div class="input-container">
            <SelectButton v-model="createPlayerForm.type" :options="playerTypeOptions" optionLabel="label"
                optionValue="value" />
        </div>
        <div class="input-container" style="margin-top: 0.5rem;">
            <Button :label="t('common.cancel')" severity="danger" outlined @click="closeCreatePlayerForm" />
            <Button :label="t('common.create')" severity="success" outlined @click="createPlayer" />
        </div>
    </div>

    <div class="edit-player-form-container" v-if="showEditPlayerForm">
        <div class="form-title">{{ t('players.editTitle') }}</div>
        <div class="input-container">
            <InputGroup>
                <InputGroupAddon>
                    <i class="pi pi-user"></i>
                </InputGroupAddon>
                <InputText v-model="editPlayerForm.name" :placeholder="t('players.nicknamePlaceholder')" />
            </InputGroup>

            <InputGroup>
                <InputGroupAddon>
                    <i class="pi pi-id-card"></i>
                </InputGroupAddon>
                <InputText v-model="editPlayerForm.realname" :placeholder="t('players.realnamePlaceholder')" />
            </InputGroup>
        </div>
        <div class="input-container">
            <InputGroup>
                <InputGroupAddon>
                    <i class="pi pi-external-link"></i>
                </InputGroupAddon>
                <InputText v-model="editPlayerForm.steamid" :placeholder="t('players.steamidPlaceholder')" />
            </InputGroup>

            <InputGroup>
                <InputGroupAddon>
                    <i class="pi pi-camera"></i>
                </InputGroupAddon>
                <InputText v-model="editPlayerForm.camera" :placeholder="t('players.cameraPlaceholder')" />
            </InputGroup>
        </div>
        <div class="input-container">
            <AvatarUpload v-model="editPlayerForm.avatar" :label="t('players.uploadAvatar')" />
        </div>
        <div class="input-container">
            <SelectButton v-model="editPlayerForm.type" :options="playerTypeOptions" optionLabel="label"
                optionValue="value" />
        </div>
        <div class="input-container" style="margin-top: 0.5rem;">
            <Button :label="t('common.cancel')" severity="danger" outlined @click="closeEditPlayerForm" />
            <Button :label="t('common.save')" severity="success" outlined @click="updatePlayer" />
        </div>
    </div>
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
    gap: 0.5rem;
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
        background: var(--background-weak);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
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
            border-radius: var(--border-radius);
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
                border-radius: var(--border-radius);

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
        border-radius: var(--border-radius);
        padding: 0.5rem;
        cursor: pointer;
        opacity: 0.4;
    }
}
</style>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from 'primevue/inputtext';
import SelectButton from 'primevue/selectbutton';
import AvatarUpload from '../components/AvatarUpload.vue';
import Button from 'primevue/button';
import { useToast } from "primevue/usetoast";
import { useI18n } from 'vue-i18n'

const toast = useToast();
const { t } = useI18n({ useScope: 'global' })


const Players = ref<Player[]>([])

async function loadPlayers() {
    try {
        const list = await window.db.players.getAll()
        Players.value = list as Player[]
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: t('common.loadFailed'),
            detail: error?.message ?? t('common.loadFailed'),
            life: 4000
        })
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
        toast.add({
            severity: 'warn',
            summary: t('common.missingRequired'),
            detail: t('common.pleaseFill', { fields: missing.join(' / ') }),
            life: 3500
        })
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

        toast.add({ severity: 'success', summary: t('players.toast.createSuccess'), detail: `${newItem.name}`, life: 3000 })

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
        toast.add({
            severity: 'error',
            summary: t('players.toast.createFailed'),
            detail: error?.message ?? t('common.dbWriteFailed'),
            life: 4000
        })
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
        toast.add({
            severity: 'warn',
            summary: t('common.missingRequired'),
            detail: t('common.pleaseFill', { fields: missing.join(' / ') }),
            life: 3500
        })
        return
    }

    try {
        const current = await window.db.players.getAll()
        const updated = (current as Player[]).map(p => p.id === id ? { ...editPlayerForm.value } : p)
        await window.db.players.set(updated as any)

        await loadPlayers()
        showEditPlayerForm.value = false
        toast.add({ severity: 'success', summary: t('players.toast.updateSuccess'), detail: `${editPlayerForm.value.name}`, life: 3000 })
    } catch (error: any) {
        toast.add({ severity: 'error', summary: t('players.toast.updateFailed'), detail: error?.message ?? t('common.dbWriteFailed'), life: 4000 })
    }
}

async function deletePlayer(id: string | number) {
    try {
        const ok = await window.db.players.remove(id)
        if (ok) {
            await loadPlayers()
            toast.add({ severity: 'success', summary: t('common.deleteSuccess'), life: 2500 })
        } else {
            toast.add({ severity: 'warn', summary: t('common.deleteFailed'), detail: t('common.recordNotFound'), life: 3000 })
        }
    } catch (error: any) {
        toast.add({ severity: 'error', summary: t('common.deleteFailed'), detail: error?.message ?? t('common.dbWriteFailed'), life: 4000 })
    }
}


</script>
