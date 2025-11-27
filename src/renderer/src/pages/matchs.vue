<template>
  <div class="container mx-auto max-w-5xl p-4 sm:p-6">
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight">{{ t('multi.matchForm.title') }}</h1>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <div class="text-sm font-medium text-muted-foreground">
            {{ selectedTeamA?.name ?? t('multi.matchForm.teamA') }}
          </div>
          <Select v-model="matchForm.team_a.id"
            @update:model-value="val => matchForm.team_a.id = (val === '__none__' ? '' : String(val))">
            <SelectTrigger class="w-full sm:w-[220px]">
              <SelectValue :placeholder="t('multi.matchForm.selectTeamA')" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">{{ t('common.select') }}</SelectItem>
              <SelectItem v-for="team in availableTeamsForA" :key="team.id" :value="String(team.id)">{{ team.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <div class="text-sm font-medium text-muted-foreground">
            {{ selectedTeamB?.name ?? t('multi.matchForm.teamB') }}
          </div>
          <Select v-model="matchForm.team_b.id"
            @update:model-value="val => matchForm.team_b.id = (val === '__none__' ? '' : String(val))">
            <SelectTrigger class="w-full sm:w-[220px]">
              <SelectValue :placeholder="t('multi.matchForm.selectTeamB')" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">{{ t('common.select') }}</SelectItem>
              <SelectItem v-for="team in availableTeamsForB" :key="team.id" :value="String(team.id)">{{ team.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="space-y-2">
          <div class="text-sm font-medium text-muted-foreground">{{ t('multi.matchForm.type') }}</div>
          <Select v-model="matchForm.type">
            <SelectTrigger class="w-full md:w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="it in types" :key="it.label" :value="it.label">{{ it.name }}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div class="space-y-4">
        <div class="max-h-[420px] overflow-y-auto">
          <TransitionGroup tag="div" class="space-y-4" enter-active-class="transition duration-200"
            enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150" leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1">
            <div v-for="(map, index) in matchForm.maps" :key="index"
              class="rounded-lg border bg-card text-card-foreground shadow-sm p-4 md:p-5 transition-colors">
              <div class="flex items-center justify-between mb-3">
                <div class="text-xs font-medium text-muted-foreground">{{ t('multi.matchForm.mapNumber', {
                  n: index + 1
                }) }}</div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-7 gap-3 md:gap-4">
                <div class="md:col-span-2 space-y-2">
                  <div class="text-xs font-medium text-muted-foreground">{{ t('matchForm.map') }}</div>
                  <Select v-model="map.name">
                    <SelectTrigger class="w-full">
                      <SelectValue :placeholder="t('multi.matchForm.selectMap')" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="m in mapOptions" :key="m.label" :value="m.label">{{ m.name }}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="md:col-span-2 space-y-2">
                  <div class="text-xs font-medium text-muted-foreground">{{ t('matchForm.pickBy') }}</div>
                  <Select v-model="map.pickby" :disabled="map.decider"
                    @update:model-value="val => map.pickby = (val === '__none__' ? '' : String(val))">
                    <SelectTrigger class="w-full">
                      <SelectValue :placeholder="t('multi.matchForm.selectPicker')" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">{{ t('common.select') }}</SelectItem>
                      <SelectItem v-for="t in teamOptions" :key="t.id" :value="String(t.id)">{{ t.name }}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="md:col-span-1 space-y-2">
                  <div class="text-xs font-medium text-muted-foreground">{{ t('matchForm.team_a.score') }}</div>
                  <Input v-model="map.ascore" type="number" :min="0" class="w-full" />
                </div>
                <div class="md:col-span-1 space-y-2">
                  <div class="text-xs font-medium text-muted-foreground">{{ t('matchForm.team_b.score') }}</div>
                  <Input v-model="map.bscore" type="number" :min="0" class="w-full" />
                </div>
                <div class="md:col-span-1 flex md:items-center md:justify-center">
                  <div class="space-y-2">
                    <div class="text-xs font-medium text-muted-foreground">{{ t('matchForm.decider') }}</div>
                    <Checkbox v-model="map.decider" aria-label="decider" />
                  </div>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 pt-2">
        <Button @click="resetForm" variant="outline" type="reset" aria-label="reset">{{ t('common.reset') }}</Button>
        <Button @click="submitForm" type="submit" aria-label="submit">{{ t('common.submit') }}</Button>
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'vue-sonner'


const { t } = useI18n()
const teams = ref<Team[]>([])
const types = ref([
  { name: 'BO1', label: 'BO1' },
  { name: 'BO2', label: 'BO2' },
  { name: 'BO3', label: 'BO3' },
  { name: 'BO4', label: 'BO4' },
  { name: 'BO5', label: 'BO5' },
])
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
    toast.error(t('common.loadFailed'), { description: error?.message ?? t('common.loadFailed'), duration: 4000 })
  }
}
const matchForm = ref<Match>({
  id: '',
  team_a: {
    id: '',
    name: '',
    name_ingame: '',
    type: 'Normal',
  },
  team_b: {
    id: '',
    name: '',
    name_ingame: '',
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
    if (m.decider) {
      m.pickby = ''
    }
    m.ascore = Math.max(0, Number(m.ascore ?? 0) || 0)
    m.bscore = Math.max(0, Number(m.bscore ?? 0) || 0)
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
    matchForm.value.team_a.type = (picked as any)?.type ?? matchForm.value.team_a.type
  } else {
    matchForm.value.team_a.name = ''
    matchForm.value.team_a.name_ingame = ''
  }
})

watch(() => matchForm.value.team_b.id, (id) => {
  const picked = teams.value.find(t => String(t.id) === String(id))
  if (picked) {
    matchForm.value.team_b.name = picked.name ?? ''
    matchForm.value.team_b.name_ingame = picked.name_ingame ?? ''
    matchForm.value.team_b.type = (picked as any)?.type ?? matchForm.value.team_b.type
  } else {
    matchForm.value.team_b.name = ''
    matchForm.value.team_b.name_ingame = ''
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
          pickby: !!m?.decider ? '' : String(m?.pickby ?? ''),
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
    toast.warning(t('common.loadFailed'), { description: error?.message ?? t('common.loadFailed'), duration: 3000 })
  }
}

function resetForm() {
  matchForm.value = {
    id: '',
    team_a: {
      id: '',
      name: '',
      name_ingame: '',
      type: 'Normal',
    },
    team_b: {
      id: '',
      name: '',
      name_ingame: '',
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
  toast.info(t('common.resetSuccess') ?? 'Reset', { duration: 2000 })
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
    if (m.decider && m.pickby) {
      return t('multi.matchForm.deciderNoPicker') ?? 'Decider should not have picker'
    }
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
    toast.warning(t('common.validateFailed') ?? 'Validation Failed', { description: err, duration: 4000 })
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
        type: (ta as any)?.type ?? matchForm.value.team_a.type
      }
    }
    const tb = teams.value.find(t => String(t.id) === String(matchForm.value.team_b.id))
    if (tb) {
      matchForm.value.team_b = {
        ...matchForm.value.team_b,
        name: tb.name ?? '',
        name_ingame: (tb as any)?.name_ingame ?? '',
        type: (tb as any)?.type ?? matchForm.value.team_b.type
      }
    }
  }
  matchForm.value.maps = matchForm.value.maps.map(m => ({
    ...m,
    pickby: m.decider ? '' : String(m.pickby ?? ''),
    ascore: Math.max(0, Number(m.ascore ?? 0) || 0),
    bscore: Math.max(0, Number(m.bscore ?? 0) || 0),
    aid: matchForm.value.team_a.id,
    bid: matchForm.value.team_b.id
  }))
  const item = JSON.parse(JSON.stringify(matchForm.value))
  if (item.team_a) delete item.team_a.avatar
  if (item.team_b) delete item.team_b.avatar
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
    toast.success(didModify ? (t('common.modifySuccess') ?? 'Updated') : (t('common.addSuccess') ?? 'Added'), { duration: 3000 })
  } catch (error: any) {
    toast.error(t('common.saveFailed') ?? 'Save Failed', { description: error?.message ?? t('common.saveFailed'), duration: 4000 })
  }
}

onMounted(async () => {
  await loadTeams()
  await autoLoadMatch()
})
</script>
