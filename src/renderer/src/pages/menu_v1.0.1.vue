<template>
  <div class="menu">
    <div class="summary-grid">

      <div class="summary-card" @click="nav('/players')">
        <div class="card-title">{{ t('indicator.players') }}</div>
        <div class="card-count">{{ playersCount }}</div>
        <div class="card-sub">{{ t('multi.menu.items', { n: playersCount }) }}</div>
        <Button :label="t('multi.menu.goManage')" @click.stop="nav('/players')" />
      </div>

      <div class="summary-card" @click="nav('/teams')">
        <div class="card-title">{{ t('indicator.teams') }}</div>
        <div class="card-count">{{ teamsCount }}</div>
        <div class="card-sub">{{ t('multi.menu.items', { n: teamsCount }) }}</div>
        <Button :label="t('multi.menu.goManage')" @click.stop="nav('/teams')" />
      </div>
    </div>

    <div class="last-match" v-if="lastMatch">
      <div class="section-title">{{ t('multi.menu.lastMatch') }}</div>
      <div class="last-row">
        <div class="team">{{ lastMatch.team_a?.name || t('multi.matchForm.teamA') }}</div>
        <div class="vs">VS</div>
        <div class="team">{{ lastMatch.team_b?.name || t('multi.matchForm.teamB') }}</div>
        <div class="bo">{{ lastMatch.type }}</div>
      </div>

      <div class="actions">
        <Button :label="t('multi.menu.openMatchEditor')" @click="nav('/matchs')" />
      </div>
    </div>

    <div class="gsi-tools">
      <div class="section-title">GSI Tools</div>
      <div style="margin-bottom: 0.5rem; color: var(--text-strong);">Choose CS2.exe to place GSI file</div>
      <div class="actions">
        <Button :label="'Autoplace GSI File'" @click="autoPlaceGSI" />
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  width: 100%;
  height: 100%;

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(200px, 1fr));
    gap: 1rem;
    width: 100%;

    .summary-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      border-radius: var(--border-radius);
      background: var(--background-weak);
      box-shadow: var(--shadow);
      cursor: pointer;
      transition: var(--transition);

      &:hover {
        background: var(--background-glass);
      }

      .card-title {
        font-weight: 600;
        opacity: 0.8;
      }

      .card-count {
        font-size: 2rem;
        font-weight: 700;
      }

      .card-sub {
        opacity: 0.6;
      }
    }
  }

  .last-match {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    padding: 1rem;
    border-radius: var(--border-radius);
    background: var(--background-glass);

    .section-title {
      font-weight: 600;
      opacity: 0.8;
    }

    .last-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;

      .team {
        opacity: 0.8;
      }

      .vs {
        opacity: 0.6;
      }

      .bo {
        opacity: 0.6;
        margin-left: auto;
      }
    }

    .maps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 0.5rem;

      .map {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0.5rem;
        border-radius: var(--border-radius);
        background: var(--background-weak);

        .map-name {
          font-weight: 600;
        }

        .map-score {
          opacity: 0.8;
        }

        .map-extra {
          opacity: 0.6;
        }
      }
    }

    .actions {
      display: flex;
      justify-content: flex-end;
    }
  }

  .gsi-tools {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    padding: 1rem;
    border-radius: var(--border-radius);
    background: var(--background-glass);

    .section-title {
      font-weight: 600;
      opacity: 0.8;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const toast = useToast()

const matchesCount = ref<number>(0)
const playersCount = ref<number>(0)
const teamsCount = ref<number>(0)
const lastMatch = ref<Match | null>(null)

function nav(path: string) {
  router.push(path)
}

function normalize<T>(list: any): T[] {
  return Array.isArray(list) ? (list as T[]) : (Object.values(list) as T[])
}

async function loadSummary() {
  try {
    const teamsList = await window.db.teams.getAll()
    teamsCount.value = normalize<Team>(teamsList).length
  } catch { }

  try {
    const playersList = await window.db.players.getAll()
    playersCount.value = normalize<Player>(playersList).length
  } catch { }

  try {
    const matchsList = await window.db.matchs.getAll()
    const items = normalize<Match>(matchsList)
    matchesCount.value = items.length

    // 读取最近比赛：优先 settings.currentMatchId
    let record: any | undefined
    try {
      const currentId = await window.db.settings.get('currentMatchId')
      if (currentId != null) {
        record = await window.db.matchs.getById(currentId)
      }
    } catch { }

    if (!record && items.length) {
      const sorted = [...items].sort((a: any, b: any) => {
        const na = Number(a?.id)
        const nb = Number(b?.id)
        if (Number.isFinite(na) && Number.isFinite(nb)) return nb - na
        return 0
      })
      record = sorted[0]
    }

    if (record) {
      lastMatch.value = {
        id: String(record.id ?? ''),
        team_a: record.team_a ?? { id: '', name: '', name_ingame: '', avatar: '', type: 'Normal' },
        team_b: record.team_b ?? { id: '', name: '', name_ingame: '', avatar: '', type: 'Normal' },
        type: record.type ?? 'BO1',
        maps: Array.isArray(record.maps) ? record.maps : []
      }
    }
  } catch { }
}

onMounted(() => {
  loadSummary()
})

async function autoPlaceGSI() {
  try {
    const res = await window.api.autoPlaceGSI()
    if (res?.success) {
      toast.add({ severity: 'success', summary: 'Success', detail: res.message })
    } else {
      toast.add({ severity: 'warn', summary: 'Not Completed', detail: res?.message ?? 'Operation canceled or failed' })
    }
  } catch (err: any) {
    toast.add({ severity: 'error', summary: 'Error', detail: String(err?.message ?? err) })
  }
}
</script>
