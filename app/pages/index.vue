<template>
  <div class="min-h-screen flex items-center justify-center p-4 safe-area-inset-top safe-area-inset-bottom">
    <div class="max-w-4xl w-full mx-auto">
      <!-- 游戏标题 -->
      <div class="text-center mb-8 md:mb-12 fade-in">
        <h1 class="text-4xl md:text-6xl font-serif font-bold text-ink-800 mb-2 md:mb-4">
          修仙挂机
        </h1>
        <p class="text-lg md:text-xl text-ink-600 font-serif">
          仙途无量，道心永恒
        </p>
      </div>

      <!-- 主要内容区域 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <!-- 新建存档 -->
        <div class="card ink-border fade-in">
          <h2 class="text-xl md:text-2xl font-serif font-semibold text-ink-800 mb-3 md:mb-4">
            新建存档
          </h2>
          <p class="text-ink-600 mb-4 md:mb-6 text-sm md:text-base">
            踏上修仙之路，开启全新的仙途
          </p>
          <button
            @click="createNewGame"
            :disabled="!canCreateNewSave"
            class="btn-primary w-full text-base md:text-lg py-3"
            :class="{ 'opacity-50 cursor-not-allowed': !canCreateNewSave }"
          >
            <span v-if="canCreateNewSave">开始修仙</span>
            <span v-else>存档已满 ({{ saves.length }}/{{ maxSaves }})</span>
          </button>
        </div>

        <!-- 存档列表 -->
        <div class="card ink-border fade-in">
          <h2 class="text-xl md:text-2xl font-serif font-semibold text-ink-800 mb-3 md:mb-4">
            选择存档
          </h2>

          <div v-if="saves.length === 0" class="text-center text-ink-500 py-6 md:py-8">
            <p class="text-sm md:text-base">暂无存档</p>
            <p class="text-xs md:text-sm mt-2">创建新存档开始游戏</p>
          </div>

          <div v-else class="space-y-2 md:space-y-3 max-h-80 md:max-h-96 overflow-y-auto">
            <div
              v-for="save in sortedSaves"
              :key="save.id"
              class="bg-paper-50 border border-ink-200 rounded-lg p-3 md:p-4 hover:bg-paper-100 transition-colors"
            >
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-serif font-semibold text-ink-800 text-sm md:text-base">
                  {{ save.name }}
                </h3>
                <div class="flex space-x-1 md:space-x-2">
                  <button
                    @click="loadGame(save.id)"
                    class="text-xs md:text-sm px-2 md:px-3 py-1 bg-ink-700 text-paper-100 rounded hover:bg-ink-600 transition-colors"
                  >
                    载入
                  </button>
                  <button
                    @click="deleteSave(save.id)"
                    class="text-xs md:text-sm px-2 md:px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    删除
                  </button>
                </div>
              </div>

              <div class="text-xs md:text-sm text-ink-600 space-y-1">
                <p>练气：{{ save.character.cultivation.qiCultivation.level }}级 | 炼体：{{ save.character.cultivation.bodyCultivation.level }}级</p>
                <p>游戏时间：{{ formatTime(save.playTime) }}</p>
                <p class="hidden md:block">最后游戏：{{ formatDate(save.lastPlayedAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部信息 -->
      <div class="text-center mt-8 md:mt-12 text-ink-500">
        <p class="text-xs md:text-sm">
          存档统计：{{ saves.length }}/{{ maxSaves }} |
          总游戏时间：{{ formatTime(totalPlayTime) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">


// 页面元数据
definePageMeta({
  title: '修仙挂机 - 仙途无量'
})

// 存档管理
const saveStore = useSaveStore()
const { formatTime, formatDate } = useTimeFormatter()

// 初始化存档系统
onMounted(async () => {
  await saveStore.initSaveSystem()
})

// 计算属性
const saves = computed(() => saveStore.saves)
const sortedSaves = computed(() => saveStore.sortedSaves)
const canCreateNewSave = computed(() => saveStore.canCreateNewSave)
const maxSaves = computed(() => saveStore.getSaveStats().maxSaves)
const totalPlayTime = computed(() => saveStore.getSaveStats().totalPlayTime)



// 创建新游戏
function createNewGame() {
  if (!canCreateNewSave.value) return
  navigateTo('/create')
}

// 载入游戏
function loadGame(saveId: string) {
  const character = saveStore.loadSave(saveId)
  if (character) {
    const characterStore = useCharacterStore()
    characterStore.loadCharacter(character)
    navigateTo('/game')
  }
}

// 删除存档
function deleteSave(saveId: string) {
  if (confirm('确定要删除这个存档吗？此操作不可恢复！')) {
    saveStore.deleteSave(saveId)
  }
}
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.8s ease-in-out;
}

.fade-in:nth-child(2) {
  animation-delay: 0.2s;
  animation-fill-mode: both;
}

.fade-in:nth-child(3) {
  animation-delay: 0.4s;
  animation-fill-mode: both;
}
</style>
