import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin(),
      // Copy overlay static files for the main process output
      viteStaticCopy({
        targets: [
          {
            src: 'src/main/overlay/file/**/*',
            dest: 'overlay/file'
          },
          {
            src: 'src/renderer/src/pages/gamestate_integration_voidhud.cfg',
            dest: 'gsi'
          }
        ]
      })
    ],
    build: {
      rollupOptions: {
        external: ['ws', 'bufferutil', 'utf-8-validate']
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [vue(), vueDevTools(), tailwindcss() as any]
  }
})
