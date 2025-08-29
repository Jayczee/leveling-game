<template>
  <div class="min-h-screen bg-paper-100">
    <!-- 顶部导航栏 -->
    <header class="bg-paper-200 border-b border-ink-300 px-4 py-3 sticky top-0 z-10">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-2 md:space-x-4 min-w-0">
          <h1 class="text-lg md:text-xl font-serif font-bold text-ink-800 truncate">
            {{ character?.name || '修仙者' }}
          </h1>
          <div class="text-xs md:text-sm text-ink-600 whitespace-nowrap">
            修仙者
          </div>
        </div>

        <div class="flex items-center space-x-2 md:space-x-4">
          <!-- 移动端菜单按钮 -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden btn-secondary text-sm px-2 py-1"
          >
            ☰
          </button>

          <!-- 游戏控制 -->
          <button
            @click="toggleGame"
            :class="gameStore.isPlaying ? 'btn-secondary' : 'btn-primary'"
            class="text-xs md:text-sm px-2 md:px-3 py-1"
          >
            {{ gameStore.isPlaying ? '暂停' : '开始' }}
          </button>

          <!-- 返回首页 -->
          <button
            @click="goHome"
            class="btn-secondary text-xs md:text-sm px-2 md:px-3 py-1 hidden sm:block"
          >
            返回首页
          </button>
        </div>
      </div>
    </header>

    <!-- 移动端侧边栏遮罩 -->
    <div
      v-if="showMobileMenu"
      class="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden mobile-menu-overlay"
      @click="closeMobileMenu"
    ></div>

    <!-- 主要游戏区域 -->
    <div class="flex flex-col md:flex-row h-[calc(100vh-64px)]">
      <!-- 移动端侧边栏 -->
      <div
        class="fixed left-0 top-16 bottom-0 w-80 bg-paper-50 border-r border-ink-300 p-4 overflow-y-auto transform transition-transform duration-300 z-30 md:hidden mobile-sidebar"
        :class="showMobileMenu ? 'translate-x-0' : '-translate-x-full'"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-serif font-semibold text-ink-800">角色信息</h3>
          <button @click="closeMobileMenu" class="text-ink-600 hover:text-ink-800">×</button>
        </div>
        <CharacterPanel />
      </div>

      <!-- 桌面端左侧面板 - 角色信息 -->
      <div class="hidden md:block w-80 bg-paper-50 border-r border-ink-300 p-4 overflow-y-auto">
        <CharacterPanel />
      </div>

      <!-- 中间区域 - 主要游戏内容 -->
      <div class="flex-1 flex flex-col min-h-0">
        <!-- 活动选择区域 -->
        <div class="bg-paper-100 border-b border-ink-300 p-2 md:p-4">
          <ActivityPanel />
        </div>

        <!-- 游戏消息区域 -->
        <div class="flex-1 p-2 md:p-4 min-h-0">
          <MessagePanel />
        </div>
      </div>

    </div>

    <!-- 浮动功能按钮 -->
    <FloatingActionButtons
      @open-exploration="showExplorationDialog = true"
      @open-time-treasure="showTimeTreasureDialog = true"
      @open-enlightenment="showEnlightenmentDialog = true"
      @open-divine-power="showDivinePowerDialog = true"
      @open-storage-ring="showStorageRingDialog = true"
    />

    <!-- 探险弹窗 -->
    <ExplorationDialog
      v-model:show="showExplorationDialog"
    />

    <!-- 时光法宝弹窗 -->
    <TimeTreasureDialog
      v-model:show="showTimeTreasureDialog"
    />

    <!-- 悟道弹窗 -->
    <EnlightenmentDialog
      v-model:show="showEnlightenmentDialog"
    />

    <!-- 神通弹窗 -->
    <DivinePowerDialog
      v-model:show="showDivinePowerDialog"
    />

    <!-- 储物戒弹窗 -->
    <StorageRingDialog
      v-model:show="showStorageRingDialog"
    />
  </div>
</template>

<script setup lang="ts">
// 页面元数据
definePageMeta({
  title: '修仙挂机 - 游戏中',
  middleware: 'game'
})

// 状态管理
const characterStore = useCharacterStore()
const gameStore = useGameStore()
const saveStore = useSaveStore()

// 游戏循环
const { startGameLoop, stopGameLoop } = useGameLoop()

// 移动端菜单状态
const showMobileMenu = ref(false)

// 弹窗状态
const showExplorationDialog = ref(false)
const showTimeTreasureDialog = ref(false)
const showEnlightenmentDialog = ref(false)
const showDivinePowerDialog = ref(false)
const showStorageRingDialog = ref(false)

// 计算属性
const character = computed(() => characterStore.character)

// 页面初始化
onMounted(() => {
  // 检查是否有角色数据
  if (!character.value) {
    navigateTo('/')
    return
  }

  // 开始游戏
  gameStore.startGame()
  startGameLoop()
})

// 页面卸载
onUnmounted(() => {
  stopGameLoop()
})

// 切换游戏状态
function toggleGame() {
  if (gameStore.isPlaying) {
    gameStore.pauseGame()
  } else {
    gameStore.startGame()
  }
}

// 返回首页
function goHome() {
  if (confirm('确定要返回首页吗？游戏进度会自动保存。')) {
    stopGameLoop()
    navigateTo('/')
  }
}

// 切换移动端菜单
function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value
}

// 关闭移动端菜单
function closeMobileMenu() {
  showMobileMenu.value = false
}

// 监听屏幕尺寸变化，大屏幕时自动关闭移动端菜单
onMounted(() => {
  const handleResize = () => {
    if (window.innerWidth >= 768) { // md breakpoint
      showMobileMenu.value = false
    }
  }

  window.addEventListener('resize', handleResize)

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
})
</script>
