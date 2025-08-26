<template>
  <!-- 右下角悬浮按钮 -->
  <div class="fixed bottom-4 right-4 z-50">
    <button
      @click="showFunctionMenu = true"
      class="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
      title="功能菜单"
    >
      <span class="text-2xl">⚙️</span>
    </button>
  </div>

  <!-- 功能选择对话框 -->
  <div
    v-if="showFunctionMenu"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="closeFunctionMenu"
  >
    <div class="bg-paper-100 rounded-lg shadow-xl max-w-md w-full">
      <!-- 对话框头部 -->
      <div class="flex justify-between items-center p-4 border-b border-ink-300">
        <h2 class="text-xl font-serif font-semibold text-ink-800">功能菜单</h2>
        <button
          @click="closeFunctionMenu"
          class="text-ink-600 hover:text-ink-800 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <!-- 功能按钮列表 -->
      <div class="p-4 space-y-3">
        <!-- 探险按钮 -->
        <button
          @click="openExploration"
          class="w-full flex items-center space-x-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
        >
          <span class="text-2xl">🗺️</span>
          <div class="text-left">
            <div class="font-medium text-ink-800">探险</div>
            <div class="text-sm text-ink-600">前往各地探险寻宝</div>
          </div>
        </button>

        <!-- 时光法宝按钮 -->
        <button
          @click="openTimeTreasure"
          class="w-full flex items-center space-x-3 p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <span class="text-2xl">⏰</span>
          <div class="text-left">
            <div class="font-medium text-ink-800">时光法宝</div>
            <div class="text-sm text-ink-600">装备法宝提升修炼效率</div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Emits
interface Emits {
  (e: 'openExploration'): void
  (e: 'openTimeTreasure'): void
}

const emit = defineEmits<Emits>()

// 状态
const showFunctionMenu = ref(false)

// 关闭功能菜单
function closeFunctionMenu() {
  showFunctionMenu.value = false
}

// 打开探险
function openExploration() {
  emit('openExploration')
  closeFunctionMenu()
}

// 打开时光法宝
function openTimeTreasure() {
  emit('openTimeTreasure')
  closeFunctionMenu()
}
</script>
