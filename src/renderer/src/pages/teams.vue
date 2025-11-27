<template>
    <div class="team-card-container">
        <TransitionGroup name="transform-in" mode="out-in" appear>
            <div v-for="team in teams" :key="team.id">
                <DropdownMenu :open="openedContextTeamId === team.id"
                    @update:open="val => { if (!val && openedContextTeamId === team.id) openedContextTeamId = null }">
                    <DropdownMenuTrigger asChild>
                        <div class="team-card" @contextmenu.prevent="openedContextTeamId = team.id">
                            <div class="team-avatar">
                                <img :src="team.avatar" alt="Team Avatar" />
                            </div>
                            <div class="team-name">{{ team.name }}</div>
                            <div class="team-name-ingame">{{ team.name_ingame }}</div>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem @click="openEditTeam(team)">编辑</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" @click="deleteTeam(team.id)">删除</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </TransitionGroup>
        <Transition name="transform-in" mode="out-in">
            <div class="team-card-add" @click="openCreateTeamForm">
                <Plus class="size-6" />
            </div>
        </Transition>
    </div>

    <Transition name="fade" mode="out-in">
        <div v-if="showCreateTeamForm" class="create-team-form-container">
            <div class="form-title">Create Team</div>
            <div class="input-container">
                <div class="form-input-group">
                    <User class="size-4 opacity-60" />
                    <Input v-model="createTeamForm.name" :placeholder="t('teams.name')" />
                </div>

                <div class="form-input-group">
                    <IdCard class="size-4 opacity-60" />
                    <Input v-model="createTeamForm.name_ingame" :placeholder="t('teams.nameIngame')" />
                </div>
            </div>
            <div class="input-container">
                <AvatarUpload v-model="createTeamForm.avatar" />
            </div>
            <div class="input-container">
                <Select v-model="createTeamForm.type">
                    <SelectTrigger class="min-w-[180px]">
                        <SelectValue :placeholder="t('teams.type')" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="opt in teamTypeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div class="input-container" style="margin-top: 1rem;">
                <Button variant="destructive" @click="closeCreateTeamForm">{{ t('common.cancel') }}</Button>
                <Button variant="default" @click="isEditing ? updateTeam() : createTeam()">{{ t('common.save')
                    }}</Button>
            </div>
        </div>
    </Transition>
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
    gap: 1rem;
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
    padding: 1rem;

    --team-card-width: 160px;
    --team-card-height: 180px;


    .team-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: column;
        width: var(--team-card-width);
        height: var(--team-card-height);
        border-radius: var(--radius);
        color: var(--text-strong);
        font-size: 0.85rem;
        padding: 0.5rem;
        position: relative;
        border: 1px solid var(--border);
        box-shadow: var(--shadow-2xs);

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
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Input } from '@/components/ui/input'
import AvatarUpload from '../components/AvatarUpload.vue';
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { toast } from 'vue-sonner'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { User, IdCard, Plus } from 'lucide-vue-next'
const { t } = useI18n({ useScope: 'global' })


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

const openedContextTeamId = ref<any>(null)

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
        toast.error(t('common.loadFailed'), { description: error?.message ?? t('common.loadFailed'), duration: 4000 })
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
        toast.warning(t('common.missingRequired'), { description: t('common.pleaseFill', { fields: missing.join(' / ') }), duration: 3500 })
        return
    }

    const newItem = {
        ...createTeamForm.value,
        id: Date.now()
    }

    try {
        await window.db.teams.add(newItem)
        await loadTeams()

        toast.success(t('common.save'), { description: `${newItem.name}`, duration: 3000 })

        // reset form
        closeCreateTeamForm()
    } catch (error: any) {
        toast.error(t('common.dbWriteFailed'), { description: error?.message ?? t('common.dbWriteFailed'), duration: 4000 })
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
        toast.warning(t('common.missingRequired'), { description: t('common.pleaseFill', { fields: missing.join(' / ') }), duration: 3500 })
        return
    }

    try {
        const current = await window.db.teams.getAll()
        const updated = (current as Team[]).map(t => t.id === id ? { ...createTeamForm.value } : t)
        await window.db.teams.set(updated as any)

        await loadTeams()
        showCreateTeamForm.value = false
        isEditing.value = false
        toast.success(t('common.save'), { description: `${createTeamForm.value.name}`, duration: 3000 })
    } catch (error: any) {
        toast.error(t('common.dbWriteFailed'), { description: error?.message ?? t('common.dbWriteFailed'), duration: 4000 })
    }
}

// delete team
async function deleteTeam(id: string | number) {
    try {
        const ok = await window.db.teams.remove(id)
        if (ok) {
            await loadTeams()
            toast.success(t('common.deleteSuccess'), { duration: 2500 })
        } else {
            toast.warning(t('common.deleteFailed'), { description: t('common.recordNotFound'), duration: 3000 })
        }
    } catch (error: any) {
        toast.error(t('common.deleteFailed'), { description: error?.message ?? t('common.dbWriteFailed'), duration: 4000 })
    }
}
</script>
