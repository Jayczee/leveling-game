<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="closeDialog"
  >
    <div class="bg-paper-100 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- 弹窗头部 -->
      <div class="flex justify-between items-center p-4 border-b border-ink-300">
        <h2 class="text-xl font-serif font-semibold text-ink-800">探险</h2>
        <button
          @click="closeDialog"
          class="text-ink-600 hover:text-ink-800 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <!-- 弹窗内容 -->
      <div class="p-4 space-y-4">
        <!-- 探险状态 -->
        <div v-if="gameStore.isExploring" class="card p-4">
          <h3 class="font-serif font-semibold text-ink-800 mb-3">探险中</h3>
          <div class="text-center">
            <div class="text-3xl mb-2">🗺️</div>
            <h4 class="font-medium text-ink-800 mb-2">
              {{ currentExplorationAreaInfo?.name }}
            </h4>
            <p class="text-sm text-ink-600 mb-4">
              {{ currentExplorationAreaInfo?.description }}
            </p>

            <p class="text-sm text-ink-600 mb-4">
              剩余时间: {{ formatTime(explorationTimeRemaining / 1000) }}
            </p>

            <button
              @click="cancelExploration"
              class="btn-secondary"
            >
              取消探险
            </button>
          </div>
        </div>

        <!-- 探险地点选择 -->
        <div v-else>
          <h3 class="font-serif font-semibold text-ink-800 mb-3">选择探险地点</h3>

          <div class="space-y-2">
            <div
              v-for="(area, key) in EXPLORATION_AREAS"
              :key="key"
              class="border border-ink-300 rounded-lg p-2 cursor-pointer hover:bg-paper-100 transition-colors"
              :class="{
                'opacity-50 cursor-not-allowed': !gameStore.canEnterExplorationArea(key),
                'hover:bg-paper-50': !gameStore.canEnterExplorationArea(key)
              }"
              @click="startExploration(key)"
            >
              <div class="flex justify-between items-start mb-1">
                <h4 class="font-serif font-medium text-ink-800 text-sm flex-1 mr-2">
                  {{ area.name }}
                </h4>
                <span class="text-xs px-2 py-1 bg-ink-100 text-ink-600 rounded whitespace-nowrap">
                  {{ getLevelRequirementText(area.level) }}
                </span>
              </div>
              <p class="text-xs text-ink-600 mb-1">
                {{ area.description }}
              </p>
              <div class="text-xs text-ink-500 space-y-0.5">
                <p>探险时间: {{ formatTime(GAME_CONFIG.EXPLORATION_TIME / 1000) }}</p>
                <p>最大事件数: {{ area.maxEvents }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GAME_CONFIG } from '~/utils/constants'
import { EXPLORATION_AREAS } from '~/utils/exploration-areas'
import { RANDOM_EVENTS } from '~/utils/exploration-events'
import { getLevelRequirementText } from '~/utils/cultivation-levels'

// Props
interface Props {
  show: boolean
}

// Emits
interface Emits {
  (e: 'update:show', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const gameStore = useGameStore()
const characterStore = useCharacterStore()
const { formatTime } = useTimeFormatter()
const { handleExplorationComplete } = useGameEvents()

// 响应式状态
const currentTime = ref(Date.now())

// 计算属性
const currentExplorationAreaInfo = computed(() => gameStore.currentExplorationAreaInfo)

// 获取实际探险时间（只受游戏速度影响，不受时光法宝影响）
const actualExplorationTime = computed(() => {
  return GAME_CONFIG.EXPLORATION_TIME / gameStore.gameSpeed
})

// 计算探险剩余时间（使用响应式currentTime确保实时更新）
const explorationTimeRemaining = computed(() => {
  if (!gameStore.isExploring) return 0
  const elapsed = currentTime.value - gameStore.explorationStartTime
  const remaining = Math.max(0, actualExplorationTime.value - elapsed)
  return remaining
})



// 定时器更新当前时间
let progressTimer: NodeJS.Timeout | null = null

// 监听探险状态变化
watch(() => gameStore.isExploring, (isExploring) => {
  if (isExploring) {
    // 开始探险时启动进度更新定时器
    progressTimer = setInterval(() => {
      currentTime.value = Date.now()

      // 检查探险是否完成
      if (explorationTimeRemaining.value <= 0) {
        handleExplorationComplete()
        if (progressTimer) {
          clearInterval(progressTimer)
          progressTimer = null
        }
      }
    }, 100)
  } else {
    // 探险结束时清除定时器
    if (progressTimer) {
      clearInterval(progressTimer)
      progressTimer = null
    }
  }
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (progressTimer) {
    clearInterval(progressTimer)
  }
})

// 关闭弹窗
function closeDialog() {
  emit('update:show', false)
}

// 获取区域事件名称
function getAreaEventNames(eventConfigs: any[]): string[] {
  return eventConfigs.map(config => RANDOM_EVENTS[config.eventId]?.name || config.eventId).filter(Boolean)
}

// 开始探险
function startExploration(areaKey: string) {
  // 检查是否可以进入该区域
  if (!gameStore.canEnterExplorationArea(areaKey)) {
    return
  }

  gameStore.startExploration(areaKey as keyof typeof EXPLORATION_AREAS)
}

// 取消探险
function cancelExploration() {
  if (confirm('确定要取消当前探险吗？')) {
    gameStore.cancelExploration()
  }
}
</script>
