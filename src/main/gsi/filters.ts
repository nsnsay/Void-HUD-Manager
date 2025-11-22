import type { CSGO, PlayerExtension } from '../csgo-extended'
import { databaseService } from '../database/database'
export type Filter = (data: CSGO) => CSGO | Promise<CSGO>
export interface FilterOptions {
  sortPlayersByObserverSlot?: boolean
  replaceTeamName?: boolean
}

const defaultOptions: Required<FilterOptions> = {
  sortPlayersByObserverSlot: true,
  replaceTeamName: true
}

const customFilters: Filter[] = []

export function registerFilter(filter: Filter): void {
  customFilters.push(filter)
}

export function clearFilters(): void {
  customFilters.length = 0
}

export function getFilters(): Filter[] {
  return [...customFilters]
}

export function composeFilters(filters: Filter[]): (data: CSGO) => Promise<CSGO> {
  return async (data: CSGO) => {
    let acc: CSGO = data
    for (const f of filters) {
      try {
        const next = await Promise.resolve(f(acc))
        acc = (next ?? acc) as CSGO
      } catch {
        // swallow and keep current acc
      }
    }
    return acc
  }
}

// 内置过滤器：按 observer_slot 升序排序 players
export function sortPlayersByObserverSlotFilter(data: CSGO): CSGO {
  try {
    const players = (data as any)?.players as PlayerExtension[] | undefined
    if (!Array.isArray(players) || players.length === 0) return data

    const toSlot = (value: unknown): number => {
      const n = Number(value)
      if (!Number.isFinite(n)) return Number.POSITIVE_INFINITY
      return n + 1
    }

    const slotOf = (p: PlayerExtension): number => toSlot((p as any)?.observer_slot)
    const sorted = players.slice().sort((a, b) => slotOf(a) - slotOf(b))

    return { ...(data as any), players: sorted } as CSGO
  } catch {
    return data
  }
}
export async function injectTeamInfo(data: CSGO): Promise<CSGO> {
  try {
    const teamsRaw = await databaseService.teams.getAll()
    const teamsList = Array.isArray(teamsRaw) ? (teamsRaw as any[]) : Object.values(teamsRaw as any)

    // Build lookup: name_ingame -> full team record
    const teamLookup = new Map<string, any>()
    for (const t of teamsList) {
      const ingame = String((t as any)?.name_ingame ?? '').trim()
      if (!ingame) continue
      teamLookup.set(ingame, t)
    }

    if (teamLookup.size === 0) return data

    const attachInfos = (team: any) => {
      if (!team || typeof team !== 'object') return team
      const key = String(team?.name ?? '').trim()
      const info = teamLookup.get(key)
      if (info) {
        const nextInfo = { ...info }
        delete nextInfo.avatar
        return { ...team, infos: nextInfo }
      }
      return team
    }

    const currentMap = (data as any)?.map
    if (!currentMap || typeof currentMap !== 'object') return data

    const nextMap = {
      ...currentMap,
      team_ct: Array.isArray(currentMap.team_ct)
        ? currentMap.team_ct.map(attachInfos)
        : attachInfos(currentMap.team_ct),
      team_t: Array.isArray(currentMap.team_t)
        ? currentMap.team_t.map(attachInfos)
        : attachInfos(currentMap.team_t)
    }

    return { ...(data as any), map: nextMap } as CSGO
  } catch {
    return data
  }
}

export function playerGrenadesFilter(data: CSGO): CSGO {
  try {
    const players = (data as any)?.players as any[] | undefined

    const order: Record<string, number> = {
      weapon_hegrenade: 1,
      weapon_flashbang: 2,
      weapon_smokegrenade: 3,
      weapon_incgrenade: 4,
      weapon_molotov: 4
    }

    const weightOf = (w: any): number => {
      const name = w?.name
      return typeof name === 'string' && name in order ? order[name] : 9999
    }

    const transformPlayer = (p: any) => {
      if (!p || typeof p !== 'object') return p
      const weapons: any[] = Array.isArray(p.weapons) ? p.weapons : []
      const grenades = weapons
        .filter((w: any) => String(w?.type ?? '').toLowerCase() === 'grenade')
        .sort((a: any, b: any) => weightOf(a) - weightOf(b))
      const nonGrenades = weapons.filter(
        (w: any) => String(w?.type ?? '').toLowerCase() !== 'grenade'
      )
      return { ...p, grenades, weapons: nonGrenades }
    }

    const nextPlayers = Array.isArray(players) ? players.map(transformPlayer) : players
    const nextPlayer = transformPlayer((data as any)?.player)

    return { ...(data as any), players: nextPlayers, player: nextPlayer } as CSGO
  } catch {
    return data
  }
}

export function playerWeaponsFilter(data: CSGO): CSGO {
  try {
    const transformPlayer = (p: any) => {
      if (!p || typeof p !== 'object') return p
      const weapons: any[] = Array.isArray(p.weapons) ? p.weapons : []

      const activeList = weapons.filter((w: any) => w?.state === 'active' || w?.state === 'reload')
      const primaryTypes = new Set([
        'SniperRifle',
        'Submachine Gun',
        'Shotgun',
        'Machine Gun',
        'Rifle'
      ])
      const primaryList = weapons.filter((w: any) => primaryTypes.has(w?.type))
      const secondaryList = weapons.filter((w: any) => w?.type === 'Pistol')
      const bombList = weapons.filter((w: any) => w?.type === 'C4')

      const pick = (arr: any[]) => (arr.length === 0 ? null : arr.length === 1 ? arr[0] : arr)

      return {
        ...p,
        active_weapon: pick(activeList),
        primary_weapon: pick(primaryList),
        secondary_weapon: pick(secondaryList),
        bomb: pick(bombList)
      }
    }

    const nextPlayers = Array.isArray((data as any)?.players)
      ? ((data as any).players as any[]).map(transformPlayer)
      : (data as any)?.players

    const nextPlayer = transformPlayer((data as any)?.player)

    return { ...(data as any), players: nextPlayers, player: nextPlayer } as CSGO
  } catch {
    return data
  }
}

export async function injectPlayerInfo(data: CSGO): Promise<CSGO> {
  try {
    const playersRaw = await databaseService.players.getAll()
    const playersList = Array.isArray(playersRaw)
      ? (playersRaw as any[])
      : Object.values(playersRaw as any)

    if (!Array.isArray(playersList) || playersList.length === 0) return data

    // Build lookup: steamid -> full player record
    const lookup = new Map<string, any>()
    for (const p of playersList) {
      const sid = String(
        (p as any)?.steamid ?? (p as any)?.steamID ?? (p as any)?.steamId ?? ''
      ).trim()
      if (!sid) continue
      lookup.set(sid, p)
    }

    const attachInfos = (pl: any) => {
      if (!pl || typeof pl !== 'object') return pl
      const sid = String(
        (pl as any)?.steamid ?? (pl as any)?.steamID ?? (pl as any)?.steamId ?? ''
      ).trim()
      if (!sid) return pl
      const info = lookup.get(sid)
      if (info) {
        const nextInfo = { ...info }
        delete nextInfo.avatar
        return { ...pl, infos: nextInfo }
      }
      return pl
    }

    const nextPlayers = Array.isArray((data as any)?.players)
      ? ((data as any).players as any[]).map(attachInfos)
      : (data as any)?.players

    const nextPlayer = attachInfos((data as any)?.player)

    return { ...(data as any), players: nextPlayers, player: nextPlayer } as CSGO
  } catch {
    return data
  }
}

function playerIsFocused(data: CSGO): CSGO {
  try {
    const players = (data as any)?.players as any[] | undefined
    const focused = (data as any)?.player

    if (!Array.isArray(players) || players.length === 0) return data

    const getSteamId = (obj: any): string =>
      String(obj?.steamid ?? obj?.steamID ?? obj?.steamId ?? '').trim()

    const focusedId = getSteamId(focused)
    const isSame = (p: any): boolean => {
      if (!focused) return false
      const pid = getSteamId(p)
      if (pid && focusedId) return pid === focusedId
      return p === focused
    }

    const nextPlayers = players.map((p) => ({ ...p, isFocused: isSame(p) }))

    return { ...(data as any), players: nextPlayers } as CSGO
  } catch {
    return data
  }
}

export async function applyFilters(
  gamedata: CSGO,
  options: FilterOptions = defaultOptions
): Promise<CSGO> {
  const filters: Filter[] = []

  if (options.sortPlayersByObserverSlot) {
    filters.push(sortPlayersByObserverSlotFilter)
  }

  if (options.replaceTeamName) {
    filters.push(injectTeamInfo)
  }

  // Inject player infos by steamid
  filters.push(injectPlayerInfo)

  // Always extract grenades from players & focused player
  filters.push(playerGrenadesFilter)
  // Extract active/primary/secondary/bomb weapons while keeping weapons intact
  filters.push(playerWeaponsFilter)
  // Mark focused player in players array
  filters.push(playerIsFocused)

  if (customFilters.length) {
    filters.push(...customFilters)
  }

  if (!filters.length) return gamedata

  return composeFilters(filters)(gamedata)
}
