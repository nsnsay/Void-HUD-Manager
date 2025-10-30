<template>
    <div class="match-form">
        <div class="form-title top">{{ t('multi.matchForm.title') }}</div>
        <div class="input-container">
            <div class="inp-lab">
                <div class="title">
                    <div v-if="selectedTeamA?.name">{{ selectedTeamA?.name }}</div>
                    <div v-else>{{ t('multi.matchForm.teamA') }}</div>
                </div>
                <InputGroup>
                    <Select v-model="matchForm.team_a.id" :options="availableTeamsForA" optionLabel="name"
                        optionValue="id" :placeholder="t('multi.matchForm.selectTeamA')" show-clear />
                </InputGroup>
            </div>
            <div class="inp-lab">
                <div class="title right">
                    <div v-if="selectedTeamB?.name">{{ selectedTeamB?.name }}</div>
                    <div v-else>{{ t('multi.matchForm.teamB') }}</div>
                </div>
                <InputGroup>
                    <Select v-model="matchForm.team_b.id" :options="availableTeamsForB" optionLabel="name"
                        optionValue="id" :placeholder="t('multi.matchForm.selectTeamB')" show-clear />
                </InputGroup>
            </div>
        </div>
        <div class="input-container">
            <div class="inp-lab">
                <div class="title">
                    {{ t('multi.matchForm.type') }}
                </div>
                <Select v-model="matchForm.type" :options="types" optionLabel="name" optionValue="label" />
            </div>
        </div>
        <div class="maps-container">
            <div v-for="(map, index) in matchForm.maps" :key="index" class="map-item">
                <div class="map-number">{{ t('multi.matchForm.mapNumber', { n: index + 1 }) }}</div>
                <div class="input-container">
                    <div class="inp-lab">
                        <div class="title">
                            {{ t('matchForm.map') }}
                        </div>
                        <Select v-model="map.name" :options="mapOptions" default-value="de_inferno" optionLabel="name"
                            optionValue="label" :placeholder="t('multi.matchForm.selectMap')"
                            style="min-width: 140px; max-width: 140px" />
                    </div>
                    <div class="inp-lab">
                        <div class="title">
                            {{ t('matchForm.pickBy') }}
                        </div>
                        <Select v-model="map.pickby" :options="teamOptionsForPickby" optionLabel="name" optionValue="id"
                            :placeholder="t('multi.matchForm.selectPicker')" style="min-width: 160px; max-width: 160px"
                            :disabled="map.decider" />
                    </div>
                    <div class="inp-lab">
                        <div class="title">
                            {{ t('matchForm.team_a.score') }}
                        </div>
                        <InputText v-model="map.ascore" :min="0" style="width: 100px" />
                    </div>
                    <div class="inp-lab">
                        <div class="title">
                            {{ t('matchForm.team_b.score') }}
                        </div>
                        <InputText v-model="map.bscore" :min="0" style="width: 100px" />
                    </div>
                    <div class="inp-lab center">
                        <div class="title">
                            {{ t('matchForm.decider') }}
                        </div>
                        <Checkbox v-model="map.decider" binary />
                    </div>
                </div>
            </div>
        </div>
        <div class="input-container">
            <Button @click="resetForm" type="reset" :label="t('common.reset')" />
            <Button @click="submitForm" type="submit" :label="t('common.submit')" />
        </div>

    </div>
</template>

<style scoped lang="scss">
.match-form {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    height: 100%;
    position: relative;

    .maps-container {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: column;
        gap: 1rem;
        width: 75%;
        height: 300px;
        background: var(--background-glass);
        border-radius: var(--border-radius);
        overflow-y: auto;
        padding: 1rem;

        .map-item {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
            height: 33%;
            background: var(--background-glass);
            border-radius: var(--border-radius);
            overflow: hidden;
            position: relative;
            flex-shrink: 0;

            .map-number {
                position: absolute;
                left: 1rem;
                font-weight: 600;
                font-size: 0.7rem;
                opacity: 0.7;
            }
        }
    }
}
</style>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import InputGroup from 'primevue/inputgroup';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import { Checkbox } from 'primevue';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const { t } = useI18n()
const teams = ref<Team[]>([])
const types = ref([
    { name: 'BO1', label: 'BO1' },
    { name: 'BO2', label: 'BO2' },
    { name: 'BO3', label: 'BO3' },
    { name: 'BO4', label: 'BO4' },
    { name: 'BO5', label: 'BO5' },
])
/*
const maps = ref([
    { name: 'Inferno', label: 'de_inferno' },
    { name: 'Mirage', label: 'de_mirage' },
    { name: 'Dust2', label: 'de_dust2' },
    { name: 'Ancient', label: 'de_ancient' },
    { name: 'Nuke', label: 'de_nuke' },
    { name: 'Overpass', label: 'de_overpass' },
    { name: 'Train', label: 'de_train' },
    { name: 'Vertigo', label: 'de_vertigo' },
    { name: 'Anubis', label: 'de_anubis' },
    { name: 'Cache', label: 'de_cache' },
])
*/


const mapOptions = computed(() => [
    { name: t('maps.inferno'), label: 'de_inferno' },
    { name: t('maps.mirage'), label: 'de_mirage' },
    { name: t('maps.dust2'), label: 'de_dust2' },
    { name: t('maps.ancient'), label: 'de_ancient' },
    { name: t('maps.nuke'), label: 'de_nuke' },
    { name: t('maps.overpass'), label: 'de_overpass' },
    { name: t('maps.train'), label: 'de_train' },
    { name: t('maps.vertigo'), label: 'de_vertigo' },
    { name: t('maps.anubis'), label: 'de_anubis' },
    { name: t('maps.cache'), label: 'de_cache' },
])

// Normalize team options to string id for pickby binding
const teamOptionsForPickby = computed(() => teams.value.map(t => ({ ...t, id: String(t.id) })))

// filter available teams for team_a (exclude team_b)
// 统一队伍选项 id 为字符串，确保与表单绑定一致
const teamOptions = computed(() => teams.value.map(t => ({ ...t, id: String(t.id) })))

const availableTeamsForA = computed(() => {
    const currentA = String(matchForm.value.team_a.id ?? '')
    const currentB = String(matchForm.value.team_b.id ?? '')
    return teamOptions.value.filter(team => team.id === currentA || team.id !== currentB)
})

// filter available teams for team_b (exclude team_a)
const availableTeamsForB = computed(() => {
    const currentA = String(matchForm.value.team_a.id ?? '')
    const currentB = String(matchForm.value.team_b.id ?? '')
    return teamOptions.value.filter(team => team.id === currentB || team.id !== currentA)
})

const selectedTeamA = computed(() => teams.value.find(team => String(team.id) === String(matchForm.value.team_a.id)))
const selectedTeamB = computed(() => teams.value.find(team => String(team.id) === String(matchForm.value.team_b.id)))

async function loadTeams() {
    try {
        const list = await window.db.teams.getAll()
        teams.value = Array.isArray(list) ? list as Team[] : (Object.values(list) as Team[])
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: t('common.loadFailed'),
            detail: error?.message ?? t('common.loadFailed'),
            life: 4000
        })
    }
}
const matchForm = ref<Match>({
    id: '',
    team_a: {
        id: '',
        name: '',
        name_ingame: '',
        avatar: '',
        type: 'Normal',
    },
    team_b: {
        id: '',
        name: '',
        name_ingame: '',
        avatar: '',
        type: 'Normal',
    },
    type: 'BO1',
    maps: [
        {
            name: 'de_inferno',
            pickby: '',
            decider: true,
            ascore: 0,
            bscore: 0,
            aid: '',
            bid: ''
        }
    ],
})

const DEFAULT_MAP = (): PickMap => ({
    name: 'de_inferno',
    pickby: '',
    decider: false,
    ascore: 0,
    bscore: 0,
    aid: '',
    bid: ''
})

function adjustMapsLengthByType() {
    const count = Number(matchForm.value.type.replace('BO', '')) || 1
    const current = matchForm.value.maps.length
    if (current < count) {
        for (let i = current; i < count; i++) {
            matchForm.value.maps.push(DEFAULT_MAP())
        }
    } else if (current > count) {
        matchForm.value.maps.splice(count)
    }
    matchForm.value.maps.forEach((m, idx) => {
        m.decider = idx === count - 1
    })
}

watch(() => matchForm.value.type, () => {
    adjustMapsLengthByType()
})

// Sync selected team details into form when ID changes (keep id as string)
watch(() => matchForm.value.team_a.id, (id) => {
    const picked = teams.value.find(t => String(t.id) === String(id))
    if (picked) {
        matchForm.value.team_a.name = picked.name ?? ''
        matchForm.value.team_a.name_ingame = picked.name_ingame ?? ''
        matchForm.value.team_a.avatar = picked.avatar ?? ''
        matchForm.value.team_a.type = (picked as any)?.type ?? matchForm.value.team_a.type
    } else {
        matchForm.value.team_a.name = ''
        matchForm.value.team_a.name_ingame = ''
        matchForm.value.team_a.avatar = ''
    }
})

watch(() => matchForm.value.team_b.id, (id) => {
    const picked = teams.value.find(t => String(t.id) === String(id))
    if (picked) {
        matchForm.value.team_b.name = picked.name ?? ''
        matchForm.value.team_b.name_ingame = picked.name_ingame ?? ''
        matchForm.value.team_b.avatar = picked.avatar ?? ''
        matchForm.value.team_b.type = (picked as any)?.type ?? matchForm.value.team_b.type
    } else {
        matchForm.value.team_b.name = ''
        matchForm.value.team_b.name_ingame = ''
        matchForm.value.team_b.avatar = ''
    }
})

// Autoload match info: use settings.currentMatchId first, otherwise load latest record
async function autoLoadMatch() {
    try {
        let record: any | undefined
        try {
            const currentId = await window.db.settings.get('currentMatchId')
            if (currentId != null) {
                record = await window.db.matchs.getById(currentId)
            }
        } catch (_) {
            // ignore settings read error
        }
        if (!record) {
            const list = await window.db.matchs.getAll()
            const items = Array.isArray(list) ? list : Object.values(list)
            if (items.length === 0) {
                return
            }
            // 选择最新（按数值 id 排序，无法转换时按原顺序）
            const sorted = [...items].sort((a: any, b: any) => {
                const na = Number(a?.id)
                const nb = Number(b?.id)
                if (Number.isFinite(na) && Number.isFinite(nb)) return nb - na
                return 0
            })
            record = sorted[0]
        }
        if (!record) return
        const loaded: Match = {
            id: record.id,
            team_a: {
                ...(record.team_a ?? matchForm.value.team_a),
                id: String(record.team_a?.id ?? matchForm.value.team_a.id ?? '')
            },
            team_b: {
                ...(record.team_b ?? matchForm.value.team_b),
                id: String(record.team_b?.id ?? matchForm.value.team_b.id ?? '')
            },
            type: record.type ?? 'BO1',
            maps: Array.isArray(record.maps) && record.maps.length > 0
                ? record.maps.map((m: any) => ({
                    name: (m?.name ?? 'de_inferno') as PickMap['name'],
                    pickby: String(m?.pickby ?? ''),
                    decider: !!m?.decider,
                    ascore: typeof m?.ascore === 'number' ? m.ascore : Number(m?.ascore ?? 0) || 0,
                    bscore: typeof m?.bscore === 'number' ? m.bscore : Number(m?.bscore ?? 0) || 0,
                    aid: String(m?.aid ?? record.team_a?.id ?? ''),
                    bid: String(m?.bid ?? record.team_b?.id ?? '')
                }))
                : [DEFAULT_MAP()]
        }
        matchForm.value = loaded
        // Fix data and decider by type
        adjustMapsLengthByType()
    } catch (error: any) {
        toast.add({ severity: 'warn', summary: t('common.loadFailed'), detail: error?.message ?? t('common.loadFailed'), life: 3000 })
    }
}

function resetForm() {
    matchForm.value = {
        id: '',
        team_a: {
            id: '',
            name: '',
            name_ingame: '',
            avatar: '',
            type: 'Normal',
        },
        team_b: {
            id: '',
            name: '',
            name_ingame: '',
            avatar: '',
            type: 'Normal',
        },
        type: 'BO1',
        maps: [
            {
                name: 'de_inferno',
                pickby: '',
                decider: true,
                ascore: 0,
                bscore: 0,
                aid: '',
                bid: ''
            }
        ],
    }
    toast.add({
        severity: 'info',
        summary: t('common.resetSuccess') ?? 'Reset',
        life: 2000
    })
}

function validateForm(): string | null {
    if (!matchForm.value.team_a?.id || !matchForm.value.team_b?.id) {
        return t('multi.matchForm.pickTeams') ?? 'Please select Team A and Team B'
    }
    if (matchForm.value.team_a.id === matchForm.value.team_b.id) {
        return t('multi.matchForm.teamsUnique') ?? 'Teams must be different'
    }
    const count = Number(matchForm.value.type.replace('BO', '')) || 1
    if (matchForm.value.maps.length !== count) {
        return t('multi.matchForm.mapsCountMismatch') ?? 'Maps count does not match BO'
    }
    for (const m of matchForm.value.maps) {
        if (m.ascore == null || m.bscore == null) {
            return t('common.invalid') ?? 'Scores invalid'
        }
        if (m.ascore < 0 || m.bscore < 0) {
            return t('common.invalid') ?? 'Scores must be >= 0'
        }
    }
    return null
}

async function submitForm() {
    const err = validateForm()
    if (err) {
        toast.add({
            severity: 'warn',
            summary: t('common.validateFailed') ?? 'Validation Failed',
            detail: err,
            life: 4000
        })
        return
    }
    // Ensure selected team details are hydrated before saving
    {
        const ta = teams.value.find(t => String(t.id) === String(matchForm.value.team_a.id))
        if (ta) {
            matchForm.value.team_a = {
                ...matchForm.value.team_a,
                name: ta.name ?? '',
                name_ingame: (ta as any)?.name_ingame ?? '',
                avatar: ta.avatar ?? '',
                type: (ta as any)?.type ?? matchForm.value.team_a.type
            }
        }
        const tb = teams.value.find(t => String(t.id) === String(matchForm.value.team_b.id))
        if (tb) {
            matchForm.value.team_b = {
                ...matchForm.value.team_b,
                name: tb.name ?? '',
                name_ingame: (tb as any)?.name_ingame ?? '',
                avatar: tb.avatar ?? '',
                type: (tb as any)?.type ?? matchForm.value.team_b.type
            }
        }
    }
    matchForm.value.maps = matchForm.value.maps.map(m => ({
        ...m,
        pickby: String(m.pickby ?? ''),
        aid: matchForm.value.team_a.id,
        bid: matchForm.value.team_b.id
    }))
    const item = JSON.parse(JSON.stringify(matchForm.value))
    try {
        // Always save to a single record ID
        const existingId = await window.db.settings.get('currentMatchId').catch(() => null)
        const targetId = String(item.id || existingId || 'current')
        item.id = targetId

        // Upsert logic: modify if exists, otherwise add
        let didModify = false
        try {
            const existing = await window.db.matchs.getById(targetId)
            if (existing) {
                await window.db.matchs.modify(targetId, item)
                didModify = true
            } else {
                await window.db.matchs.add(item)
            }
        } catch (_) {
            // If getById fails, fallback to add
            await window.db.matchs.add(item)
        }

        await window.db.settings.set('currentMatchId', targetId)
        matchForm.value.id = targetId
        toast.add({
            severity: 'success',
            summary: didModify ? (t('common.modifySuccess') ?? 'Updated') : (t('common.addSuccess') ?? 'Added'),
            life: 3000
        })
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: t('common.saveFailed') ?? 'Save Failed',
            detail: error?.message ?? t('common.saveFailed'),
            life: 4000
        })
    }
}

onMounted(async () => {
    await loadTeams()
    await autoLoadMatch()
    adjustMapsLengthByType()
})
</script>
