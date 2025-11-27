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
      select: 'Select',
      checkUpdate: 'Check Update',
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
      saveFailed: 'Save failed',
      restartRequired: 'Settings changed, please restart the client to take effect.',
      relaunchNow: 'Relaunch Now',
      notNow: 'Not Now'
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
    },
    // 菜单页文案
    menu: {
      title: 'Menu - Setup & Configuration',
      step1: {
        title: 'Step 1: Configure GSI (Important)',
        content1_prefix: 'In the file picker, choose',
        content1_suffix: 'to auto-configure GSI.'
      },
      step2: {
        title: 'Step 2: Open Overlay',
        content1_beforeIcon: 'Open CS2, enter Observer mode, then click the top-right',
        content1_afterIcon: 'to open HUD mapping.',
        content2_prefix: 'Run in console',
        content2_suffix: 'to hide the game HUD'
      },
      step3: {
        title: 'Step 3: Configure OBS or vMix',
        content1_prefix: 'In OBS or vMix, add a Browser Source, set URL to',
        content1_suffix: ', ensure the Browser Source is on top.',
        content2: 'Set the Browser Source width and height to your screen width in px.'
      },
      hlae: {
        titlePrefix: 'Optional: Configure',
        desc: 'HLAE improves viewing experience. Below are commands you can add to your CFG:',
        deathmsgTitle: 'Kill feed - player name color customization (CT | T):',
        moreInfoPrefix: 'More info:'
      }
    },
    // Settings page i18n
    settings: {
      manager: {
        title: 'Series Name',
        seriesName_first: {
          label: 'Series Name (#1)',
          desc: 'Name of tournament or whatever you want'
        },
        seriesName_second: {
          label: 'Series Name (#2)',
          desc: 'Name of tournament or whatever you want'
        },
        seriesName_third: {
          label: 'Series Name (#3) (Not available)',
          desc: 'Name of tournament or whatever you want'
        }
      },
      overlay: {
        color: 'Overlay Color',
        title: 'Overlay Settings',
        focusedPlayer: {
          label: 'Focused Player',
          desc: 'Show current focusing player on the overlay'
        },
        sidebars: {
          label: 'Sidebars',
          desc: 'Show sidebars on the overlay'
        },
        topbar: {
          label: 'Topbar',
          desc: 'Show topbar on the overlay'
        },
        radar: {
          label: 'Radar',
          desc: 'Show radar on the overlay'
        },
        ctColor: {
          label: 'Counter Terrorist Color',
          desc: 'Color of the counter terrorist team'
        },
        tColor: {
          label: 'Terrorist Color',
          desc: 'Color of the terrorist team'
        },
        borderRadius: {
          label: 'Border Radius',
          desc: 'Border radius of the overlay elements'
        },
        row: 'Row Direction',
        column: 'Column Direction'
      },
      other: {
        title: 'Other Settings',
        shortcutKey: {
          label: 'Shortcut Key',
          desc: 'Key to refresh overlay (Restart required)'
        }
      },
      toast: {
        saved: 'Settings saved'
      }
      ,
      managerSettings: {
        title: 'Manager Settings',
        acrylic: {
          label: 'Acrylic Blur',
          desc: 'Enable Windows acrylic blur background'
        },
        acrylicShortcut: {
          label: 'Acrylic Shortcut',
          desc: 'Global shortcut to toggle acrylic blur (Restart required)'
        }
      }
    },
    updater: {
      title: 'Update',
      checking: 'Checking for updates…',
      available: 'Update available: {version}',
      notAvailable: 'You are up to date',
      downloading: 'Downloading update… {percent}%',
      downloaded: 'Update downloaded. Restarting to install…',
      error: 'Update error'
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
      select: '选择',
      checkUpdate: '检查更新',
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
      saveFailed: '保存失败',
      restartRequired: '设置已更改，但是需要重启客户端后生效。',
      relaunchNow: '立即重启',
      notNow: '暂不'
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
    },
    // 菜单页文案
    menu: {
      title: '菜单 - 安装与配置',
      step1: {
        title: '步骤 1：配置 GSI（重要）',
        content1_prefix: '在弹出的文件选择窗口中，选择',
        content1_suffix: '，将自动配置 GSI。'
      },
      step2: {
        title: '步骤 2：打开 Overlay',
        content1_beforeIcon: '打开 CS2，进入观察者模式，并点击右上角的',
        content1_afterIcon: '打开 HUD 映射。',
        content2_prefix: '在控制台中输入',
        content2_suffix: '隐藏游戏 HUD'
      },
      step3: {
        title: '步骤 3：配置 OBS 或 vMix',
        content1_prefix: '在 OBS 或 vMix 中，添加一个新的浏览器源，URL 填写',
        content1_suffix: '，请确保浏览器源置于最上层。',
        content2: '设置浏览器源的高度、宽度为你的屏幕宽度，单位为 px。'
      },
      hlae: {
        titlePrefix: '可选：配置',
        desc: 'HLAE 的功能可以更好地帮助观众的观赛体验，以下是 HLAE 命令，可以放置到你自己的 CFG 中：',
        deathmsgTitle: '击杀信息 - 玩家名字 颜色自定义（CT/T）：',
        moreInfoPrefix: '其他信息浏览'
      }
    },
    // Settings page i18n
    settings: {
      manager: {
        title: '赛事名',
        seriesName_first: {
          label: '赛事名（#1）',
          desc: '赛事或任意你想要的名字'
        },
        seriesName_second: {
          label: '赛事名（#2）',
          desc: '赛事或任意你想要的名字'
        },
        seriesName_third: {
          label: '赛事名（#3）（不可用）',
          desc: '赛事或任意你想要的名字'
        }
      },
      overlay: {
        color: '颜色',
        title: 'UI设置',
        focusedPlayer: {
          label: '当前聚焦选手',
          desc: '在UI中显示当前聚焦的选手'
        },
        sidebars: {
          label: '侧边栏',
          desc: '在UI中显示侧边栏'
        },
        topbar: {
          label: '顶部栏',
          desc: '在UI中显示顶部栏'
        },
        radar: {
          label: '雷达',
          desc: '在UI中显示雷达'
        },
        ctColor: {
          label: 'CT 颜色',
          desc: '反恐精英队伍的颜色'
        },
        tColor: {
          label: 'T 颜色',
          desc: '恐怖分子队伍的颜色'
        },
        borderRadius: {
          label: 'UI圆角',
          desc: 'UI的圆角'
        },
        row: '水平方向',
        column: '垂直方向'
      },
      other: {
        title: '其他设置',
        shortcutKey: {
          label: '刷新快捷键',
          desc: '刷新UI快捷键 (重启后生效)'
        }
      },
      toast: {
        saved: '设置已保存'
      }
      ,
      managerSettings: {
        title: '管理器设置',
        acrylic: {
          label: '毛玻璃特效',
          desc: '开启 Windows 毛玻璃（Acrylic）背景'
        },
        acrylicShortcut: {
          label: '毛玻璃快捷键',
          desc: '用于切换毛玻璃的全局快捷键（重启后生效）'
        }
      }
    },
    updater: {
      title: '更新',
      checking: '正在检查更新…',
      available: '发现新版本：{version}',
      notAvailable: '当前已是最新版本',
      downloading: '正在下载更新… {percent}%',
      downloaded: '更新已下载，正在自动安装并重启',
      error: '更新检查出错'
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
