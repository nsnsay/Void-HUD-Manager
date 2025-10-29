<script setup lang="ts">
import OverlayButton from './components/OverlayButton.vue';
import WindowControls from './components/window-controls/window-controls.vue'
import MultiWindow from './multiwindow.vue'
import Toast from 'primevue/toast'
</script>

<template>
  <Toast position="bottom-right" />
  <div class="VHApp">
    <WindowControls />
    <MultiWindow />
  </div>
  <OverlayButton />
</template>

<style lang="scss">
.VHApp {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.input-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 50%;

  .inp-lab {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;

    &.center {
      align-items: center;
      justify-content: center;

      .title {
        transform: translateY(-50%);
      }
    }

    .title {
      font-size: 0.8rem;
      font-weight: 500;
      opacity: 0.7;

      &.right {
        margin-left: auto;
      }
    }
  }
}

.form-title {
  font-size: 1.2rem;
  font-weight: 600;
  opacity: 0.7;

  &.top {
    position: absolute;
    top: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>