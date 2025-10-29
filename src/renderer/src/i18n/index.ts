import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    app: {
      void: 'Void',
      hud: 'HUD',
      logoAlt: 'Void HUD Manager'
    },
    indicator: {
      menu: 'Menu',
      matchs: 'Matchs',
      players: 'Players',
      teams: 'Teams',
      settings: 'Settings'
    },
    common: {
      cancel: 'Cancel',
      create: 'Create',
      save: 'Save',
      loadFailed: 'Load failed',
      dbWriteFailed: 'Database write failed',
      missingRequired: 'Missing required fields',
      pleaseFill: 'Please fill: {fields}',
      deleteSuccess: 'Deleted',
      deleteFailed: 'Delete failed',
      recordNotFound: 'Record not found',
      upload: 'Upload',
      remove: 'Remove',
      readImageFailed: 'Failed to read image, please retry',
      unsupportedFormat: 'Only PNG/JPEG/WebP images are supported',
      imageTooLarge: 'Image exceeds {size}MB, please compress and retry',
      // 新增常用文案
      reset: 'Reset',
      submit: 'Submit',
      resetSuccess: 'Reset successfully',
      validateFailed: 'Validation failed',
      modifySuccess: 'Updated successfully',
      addSuccess: 'Added successfully',
      saveFailed: 'Save failed'
    },
    teams: {
      name: 'Team Name',
      nameIngame: 'Team Name In Game',
      type: 'Team Type',
      avatar: 'Team Avatar'
    },
    players: {
      createTitle: 'Create Player',
      editTitle: 'Edit Player',
      nickname: 'Nickname',
      realname: 'Real Name',
      steamid: 'SteamID',
      cameraUrl: 'Camera URL',
      nicknamePlaceholder: 'Nickname *',
      realnamePlaceholder: 'Real Name',
      steamidPlaceholder: 'SteamID *',
      cameraPlaceholder: 'Camera URL',
      uploadAvatar: 'Upload Avatar',
      type: {
        player: 'Player',
        coach: 'Coach',
        spectator: 'Spectator'
      },
      toast: {
        createClosed: 'Create Player Form Closed',
        editClosed: 'Edit Player Form Closed',
        createSuccess: 'Created successfully',
        createFailed: 'Creation failed',
        updateSuccess: 'Update successful',
        updateFailed: 'Update failed'
      }
    },
    // 地图名
    maps: {
      inferno: 'Inferno',
      mirage: 'Mirage',
      dust2: 'Dust2',
      ancient: 'Ancient',
      nuke: 'Nuke',
      overpass: 'Overpass',
      train: 'Train',
      vertigo: 'Vertigo',
      anubis: 'Anubis',
      cache: 'Cache',
      office: 'Office',
      cbble: 'Cobblestone'
    },
    matchForm: {
      map: 'Select Map',
      pickBy: 'Select By',
      team_a: {
        score: 'Team A Score'
      },
      team_b: {
        score: 'Team B Score'
      },
      decider: 'Decider'
    },
    // 比赛页面文案
    multi: {
      matchForm: {
        title: 'Match Form',
        type: 'Best of',
        teamA: 'Team A',
        teamB: 'Team B',
        mapNumber: 'Map {n}',
        selectTeamA: 'Select Team A',
        selectTeamB: 'Select Team B',
        selectMap: 'Select Map',
        selectPicker: 'Select Picker'
      },
      menu: {
        items: '{n} items',
        goManage: 'Manage',
        lastMatch: 'Last Match',
        openMatchEditor: 'Open Match Editor'
      }
    }
  },
  zh: {
    app: {
      void: 'Void',
      hud: 'HUD',
      logoAlt: 'Void HUD 管理器'
    },
    indicator: {
      menu: '菜单',
      matchs: '比赛',
      players: '选手',
      teams: '战队',
      settings: '设置'
    },
    common: {
      cancel: '取消',
      create: '创建',
      save: '保存',
      loadFailed: '加载失败',
      dbWriteFailed: '数据库写入失败',
      missingRequired: '缺少必填项',
      pleaseFill: '请填写：{fields}',
      deleteSuccess: '已删除',
      deleteFailed: '删除失败',
      recordNotFound: '记录不存在',
      upload: '上传',
      remove: '移除',
      readImageFailed: '读取图片失败，请重试',
      unsupportedFormat: '仅支持 PNG/JPEG/WebP 格式的图片',
      imageTooLarge: '图片超过 {size}MB，请压缩后再上传',
      // 新增常用文案
      reset: '重置',
      submit: '提交',
      resetSuccess: '已重置',
      validateFailed: '校验失败',
      modifySuccess: '修改成功',
      addSuccess: '添加成功',
      saveFailed: '保存失败'
    },
    teams: {
      name: '队伍名称',
      nameIngame: '队伍名称（游戏内）',
      type: '队伍类型',
      avatar: '队伍头像'
    },
    players: {
      createTitle: '创建选手',
      editTitle: '编辑选手',
      nickname: '昵称',
      realname: '真实姓名',
      steamid: 'SteamID',
      cameraUrl: '摄像头地址',
      nicknamePlaceholder: '昵称 *',
      realnamePlaceholder: '真实姓名',
      steamidPlaceholder: 'SteamID *',
      cameraPlaceholder: '摄像头地址',
      uploadAvatar: '上传头像',
      type: {
        player: '选手',
        coach: '教练',
        spectator: '观众'
      },
      toast: {
        createClosed: '创建选手表单已关闭',
        editClosed: '编辑选手表单已关闭',
        createSuccess: '创建成功',
        createFailed: '创建失败',
        updateSuccess: '更新成功',
        updateFailed: '更新失败'
      }
    },
    // 地图名
    maps: {
      inferno: 'Inferno',
      mirage: 'Mirage',
      dust2: 'Dust2',
      ancient: 'Ancient',
      nuke: 'Nuke',
      overpass: 'Overpass',
      train: 'Train',
      vertigo: 'Vertigo',
      anubis: 'Anubis',
      cache: 'Cache',
      office: 'Office',
      cbble: 'Cobblestone'
    },
    // 比赛表单字段
    matchForm: {
      map: '选择地图',
      pickBy: '选择选图方',
      team_a: {
        score: 'A 队比分'
      },
      team_b: {
        score: 'B 队比分'
      },
      decider: 'Decider'
    },
    // 比赛页面文案
    multi: {
      matchForm: {
        title: '比赛表单',
        type: '赛制',
        teamA: '战队 A',
        teamB: '战队 B',
        mapNumber: '地图 {n}',
        selectTeamA: '选择战队 A',
        selectTeamB: '选择战队 B',
        selectMap: '选择地图',
        selectPicker: '选择选图方'
      },
      menu: {
        items: '{n} 项',
        goManage: '管理',
        lastMatch: '最近比赛',
        openMatchEditor: '打开比赛编辑'
      }
    }
  }
}

const initialLocale = localStorage.getItem('locale') || 'zh'

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages
})
