<template>
    <div class="team-card-container">
        <div v-for="team in teams" :key="team.id" class="team-card">
            <div class="team-control left">
                <i class="pi pi-pen-to-square" style="color: var(--color-primary);" @click="openEditTeam(team)"></i>
            </div>
            <div class="team-control">
                <i class="pi pi-trash" style="color: var(--status-error);" @click="deleteTeam(team.id)"></i>
            </div>
            <div class="team-avatar">
                <img :src="team.avatar" alt="Team Avatar" />
            </div>
            <div class="team-name">{{ team.name }}</div>
            <div class="team-name-ingame">{{ team.name_ingame }}</div>
        </div>
        <div class="team-card-add" @click="openCreateTeamForm">
            <i class="pi pi-plus"></i>
        </div>
    </div>

    <div v-if="showCreateTeamForm" class="create-team-form-container">
        <div class="form-title">Create Team</div>
        <div class="input-container">
            <InputGroup>
                <InputGroupAddon>
                    <i class="pi pi-user"></i>
                </InputGroupAddon>
                <InputText v-model="createTeamForm.name" :placeholder="t('teams.name')" />
            </InputGroup>

            <InputGroup>
                <InputGroupAddon>
                    <i class="pi pi-id-card"></i>
                </InputGroupAddon>
                <InputText v-model="createTeamForm.name_ingame" :placeholder="t('teams.nameIngame')" />
            </InputGroup>
        </div>
        <div class="input-container">
            <AvatarUpload v-model="createTeamForm.avatar" />
        </div>
        <div class="input-container">
            <SelectButton v-model="createTeamForm.type" :options="teamTypeOptions" optionLabel="label"
                optionValue="value" />
        </div>
        <div class="input-container" style="margin-top: 1rem;">
            <Button :label="t('common.cancel')" severity="danger" outlined @click="closeCreateTeamForm" />
            <Button :label="t('common.save')" severity="success" outlined
                @click="isEditing ? updateTeam() : createTeam()" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.create-team-form-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 0.3rem;
    background: var(--background-glass);
    backdrop-filter: blur(10px);
}

.team-card-container {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    height: 100%;
    width: 100%;
    flex-wrap: wrap;
    gap: 0.5rem;

    --team-card-width: 160px;
    --team-card-height: 180px;


    .team-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: column;
        width: var(--team-card-width);
        height: var(--team-card-height);
        border-radius: var(--border-radius);
        background: var(--background-weak);
        color: var(--text-strong);
        box-shadow: var(--shadow);
        font-size: 0.85rem;
        padding: 0.5rem;
        position: relative;

        .team-avatar {
            height: 6.5rem;
            border-radius: 50%;
            border: 2px solid var(--color-primary);

            overflow: hidden;

            img {
                height: 100%;
                object-fit: cover;
            }
        }

        .team-name {
            font-size: 1rem;
            font-weight: 600;
        }

        .team-name-ingame {
            font-size: 0.8rem;
            font-weight: 400;
            opacity: 0.7;
        }

        .team-control {
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
    }

    .team-card-add {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        gap: 0.2rem;
        width: var(--team-card-width);
        height: var(--team-card-height);
        background: var(--background-weak);
        border-radius: var(--border-radius);
        padding: 0.5rem;
        cursor: pointer;
        opacity: 0.4;
    }
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from 'primevue/inputtext';
import AvatarUpload from '../components/AvatarUpload.vue';
import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';
import { useToast } from 'primevue/usetoast'
const { t } = useI18n({ useScope: 'global' })
const toast = useToast()

const showCreateTeamForm = ref(false)
const isEditing = ref(false)
const teams = ref<Team[]>([])
const createTeamForm = ref<Team>({
    id: 0,
    name: '',
    name_ingame: '',
    avatar: '',
    type: 'Normal'
})

const teamTypeOptions = ref([
    { label: 'Normal', value: 'Normal' },
    { label: 'Faceit', value: 'Faceit' },
])

const closeCreateTeamForm = () => {
    showCreateTeamForm.value = false
    isEditing.value = false
    // reset form
    createTeamForm.value = {
        id: '',
        name: '',
        name_ingame: '',
        avatar: '',
        type: 'Normal'
    }
}

const openCreateTeamForm = () => {
    showCreateTeamForm.value = true
}

async function loadTeams() {
    try {
        const list = await window.db.teams.getAll()
        teams.value = list as Team[]
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: t('common.loadFailed'),
            detail: error?.message ?? t('common.loadFailed'),
            life: 4000
        })
    }
}

onMounted(() => {
    loadTeams()
})

// create team
async function createTeam() {
    const { name, name_ingame, type } = createTeamForm.value
    const missing: string[] = []
    if (!name) missing.push(t('teams.name'))
    if (!name_ingame) missing.push(t('teams.nameIngame'))
    if (!type) missing.push(t('teams.type'))

    if (missing.length) {
        toast.add({
            severity: 'warn',
            summary: t('common.missingRequired'),
            detail: t('common.pleaseFill', { fields: missing.join(' / ') }),
            life: 3500
        })
        return
    }

    const newItem = {
        ...createTeamForm.value,
        id: Date.now()
    }

    try {
        await window.db.teams.add(newItem)
        await loadTeams()

        toast.add({ severity: 'success', summary: t('common.save'), detail: `${newItem.name}`, life: 3000 })

        // reset form
        closeCreateTeamForm()
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: t('common.dbWriteFailed'),
            detail: error?.message ?? t('common.dbWriteFailed'),
            life: 4000
        })
    }
}

// edit team
function openEditTeam(team: Team) {
    createTeamForm.value = { ...team }
    isEditing.value = true
    showCreateTeamForm.value = true
}

// update team
async function updateTeam() {
    const { id, name, name_ingame, type } = createTeamForm.value
    const missing: string[] = []
    if (!name) missing.push(t('teams.name'))
    if (!name_ingame) missing.push(t('teams.nameIngame'))
    if (!type) missing.push(t('teams.type'))

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
        const current = await window.db.teams.getAll()
        const updated = (current as Team[]).map(t => t.id === id ? { ...createTeamForm.value } : t)
        await window.db.teams.set(updated as any)

        await loadTeams()
        showCreateTeamForm.value = false
        isEditing.value = false
        toast.add({ severity: 'success', summary: t('common.save'), detail: `${createTeamForm.value.name}`, life: 3000 })
    } catch (error: any) {
        toast.add({ severity: 'error', summary: t('common.dbWriteFailed'), detail: error?.message ?? t('common.dbWriteFailed'), life: 4000 })
    }
}

// delete team
async function deleteTeam(id: string | number) {
    try {
        const ok = await window.db.teams.remove(id)
        if (ok) {
            await loadTeams()
            toast.add({ severity: 'success', summary: t('common.deleteSuccess'), life: 2500 })
        } else {
            toast.add({ severity: 'warn', summary: t('common.deleteFailed'), detail: t('common.recordNotFound'), life: 3000 })
        }
    } catch (error: any) {
        toast.add({ severity: 'error', summary: t('common.deleteFailed'), detail: error?.message ?? t('common.dbWriteFailed'), life: 4000 })
    }
}
</script>
