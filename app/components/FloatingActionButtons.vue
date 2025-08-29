<template>
  <!-- PC端：多个独立悬浮按钮 -->
  <div class="hidden md:flex fixed bottom-4 right-4 z-50 flex-row gap-3">
    <!-- 探险按钮 -->
    <button
      @click="openExploration"
      class="floating-action-btn"
      title="前往各地探险寻宝"
    >
      <span class="btn-icon">🗺️</span>
      <span class="btn-text">探险</span>
    </button>

    <!-- 时光法宝按钮 -->
    <button
      @click="openTimeTreasure"
      class="floating-action-btn"
      title="装备法宝提升修炼效率"
    >
      <span class="btn-icon">⏰</span>
      <span class="btn-text">法宝</span>
    </button>

    <!-- 悟道按钮 -->
    <button
      @click="openEnlightenment"
      class="floating-action-btn"
      title="感悟天地之道，提升属性"
    >
      <span class="btn-icon">🧘</span>
      <span class="btn-text">悟道</span>
    </button>

    <!-- 神通按钮 -->
    <button
      @click="openDivinePower"
      class="floating-action-btn"
      title="修炼神通，强化身体属性"
    >
      <span class="btn-icon">✨</span>
      <span class="btn-text">神通</span>
    </button>

    <!-- 储物戒按钮 -->
    <button
      @click="openStorageRing"
      class="floating-action-btn"
      title="管理背包物品，使用消耗品"
    >
      <span class="btn-icon">🎒</span>
      <span class="btn-text">储物戒</span>
    </button>
  </div>

  <!-- 移动端：单个悬浮按钮和功能菜单 -->
  <div class="md:hidden fixed bottom-4 right-4 z-50">
    <button
      @click="showFunctionMenu = true"
      class="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
      title="功能菜单"
    >
      <span class="text-2xl">⚙️</span>
    </button>
  </div>

  <!-- 移动端功能选择对话框 -->
  <div
    v-if="showFunctionMenu"
    class="md:hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
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

        <!-- 悟道按钮 -->
        <button
          @click="openEnlightenment"
          class="w-full flex items-center space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
        >
          <span class="text-2xl">🧘</span>
          <div class="text-left">
            <div class="font-medium text-ink-800">悟道</div>
            <div class="text-sm text-ink-600">感悟天地之道，提升属性</div>
          </div>
        </button>

        <!-- 神通按钮 -->
        <button
          @click="openDivinePower"
          class="w-full flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
        >
          <span class="text-2xl">✨</span>
          <div class="text-left">
            <div class="font-medium text-ink-800">神通</div>
            <div class="text-sm text-ink-600">修炼神通，强化身体属性</div>
          </div>
        </button>

        <!-- 储物戒按钮 -->
        <button
          @click="openStorageRing"
          class="w-full flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
        >
          <span class="text-2xl">🎒</span>
          <div class="text-left">
            <div class="font-medium text-ink-800">储物戒</div>
            <div class="text-sm text-ink-600">管理背包物品，使用消耗品</div>
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
  (e: 'openEnlightenment'): void
  (e: 'openDivinePower'): void
  (e: 'openStorageRing'): void
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

// 打开悟道
function openEnlightenment() {
  emit('openEnlightenment')
  closeFunctionMenu()
}

// 打开神通
function openDivinePower() {
  emit('openDivinePower')
  closeFunctionMenu()
}

// 打开储物戒
function openStorageRing() {
  emit('openStorageRing')
  closeFunctionMenu()
}
</script>

<style scoped>
/* PC端悬浮按钮样式 */
.floating-action-btn {
  @apply transition-all duration-200 flex flex-col items-center justify-center text-center;
  width: 80px;
  height: 80px;
  min-width: 80px;
  min-height: 80px;
  padding: 8px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: transparent;
  color: #374151;
}

.btn-icon {
  font-size: 2.5rem;
  line-height: 1;
  margin-bottom: 6px;
  display: block;
}

.btn-text {
  font-size: 0.875rem;
  font-weight: 600;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1;
  display: block;
  color: #4b5563;
}

/* 按钮悬停效果 */
.floating-action-btn:hover {
  transform: translateY(-4px) scale(1.1);
}

.floating-action-btn:hover .btn-icon {
  transform: scale(1.1);
}

.floating-action-btn:hover .btn-text {
  color: #1f2937;
  font-weight: 700;
}

.floating-action-btn:active {
  transform: translateY(-2px) scale(1.05);
}

/* 响应式设计 - 确保在较小的桌面屏幕上也能正常显示 */
@media (max-width: 1200px) {
  .floating-action-btn {
    width: 72px;
    height: 72px;
    min-width: 72px;
    min-height: 72px;
    padding: 6px;
  }
  
  .btn-icon {
    font-size: 2.25rem;
    margin-bottom: 5px;
  }
  
  .btn-text {
    font-size: 0.8rem;
  }
}

/* 中等屏幕调整 */
@media (max-width: 900px) {
  .floating-action-btn {
    width: 64px;
    height: 64px;
    min-width: 64px;
    min-height: 64px;
    padding: 5px;
  }
  
  .btn-icon {
    font-size: 2rem;
    margin-bottom: 4px;
  }
  
  .btn-text {
    font-size: 0.75rem;
  }
}
</style>
