/// <reference types="vite/client" />

interface Window {
  api: {
    minimize: () => void
    close: () => void
    openWindow: () => void
    closeWindow: () => void
    autoPlaceGSI: () => Promise<{ success: boolean; message: string; targetPath?: string }>
    getOverlayStatus: () => Promise<{
      isOpen: boolean
      isVisible: boolean
      isFocused: boolean
      isFullScreen: boolean
      url: string
      id: number | null
    }>
  }
}

interface Player {
  id: string | number
  name: string
  realname: string
  steamid: string
  camera: string
  avatar: string
  type: 'player' | 'coach' | 'spectator'
}

interface Team {
  id: string | number
  name: string
  name_ingame: string
  avatar?: string
  type: 'Normal' | 'Faceit'
}

interface PickMap {
  name:
    | 'de_mirage'
    | 'de_inferno'
    | 'de_dust2'
    | 'de_nuke'
    | 'de_overpass'
    | 'de_train'
    | 'de_vertigo'
    | 'de_cache'
    | 'de_office'
    | 'de_cbble'
    | 'de_anubis'
    | 'de_ancient'
  pickby: string
  decider: boolean
  ascore: any
  aid: string | number
  bscore: any
  bid: string | number
}

interface Match {
  id: string | number
  team_a: Team
  team_b: Team
  type: 'BO1' | 'BO2' | 'BO3' | 'BO4' | 'BO5'
  maps: PickMap[]
}
