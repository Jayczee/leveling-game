<template>
  <div>
    <h3 class="font-serif font-semibold text-ink-800 mb-2 md:mb-4 text-base md:text-lg">修炼活动</h3>

    <div class="grid grid-cols-3 gap-2">
      <!-- 打坐静修 -->
      <div
        class="card cursor-pointer transition-all hover:shadow-md p-2 relative"
        :class="{ 'ring-2 ring-gold-400 bg-gold-50': currentActivity === 'MEDITATION' }"
        @click="setActivity('MEDITATION')"
      >
        <!-- 进行中状态指示器 -->
        <div v-if="currentActivity === 'MEDITATION'" class="absolute top-1 right-1">
          <div class="w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse"></div>
        </div>

        <div class="text-center">
          <div class="text-lg mb-1">🧘</div>
          <h4 class="font-serif font-medium text-ink-800 mb-1 text-xs">
            {{ ACTIVITIES.MEDITATION.name }}
          </h4>
          <div class="text-xs text-ink-500">
            <p>+{{ (ACTIVITIES.MEDITATION.baseGain * qiEfficiency * cultivationTotalMultiplier).toFixed(1) }}/秒</p>
          </div>
        </div>
      </div>

      <!-- 炼体修行 -->
      <div
        class="card cursor-pointer transition-all hover:shadow-md p-2 relative"
        :class="{ 'ring-2 ring-gold-400 bg-gold-50': currentActivity === 'BODY_TRAINING' }"
        @click="setActivity('BODY_TRAINING')"
      >
        <!-- 进行中状态指示器 -->
        <div v-if="currentActivity === 'BODY_TRAINING'" class="absolute top-1 right-1">
          <div class="w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse"></div>
        </div>

        <div class="text-center">
          <div class="text-lg mb-1">💪</div>
          <h4 class="font-serif font-medium text-ink-800 mb-1 text-xs">
            {{ ACTIVITIES.BODY_TRAINING.name }}
          </h4>
          <div class="text-xs text-ink-500">
            <p>+{{ (ACTIVITIES.BODY_TRAINING.baseGain * bodyEfficiency * cultivationTotalMultiplier).toFixed(1) }}/秒</p>
          </div>
        </div>
      </div>

      <!-- 停止修炼 -->
      <div
        class="card cursor-pointer transition-all hover:shadow-md p-2 relative"
        :class="{ 'ring-2 ring-gray-400 bg-gray-50': currentActivity === null }"
        @click="setActivity(null)"
      >
        <!-- 进行中状态指示器 -->
        <div v-if="currentActivity === null" class="absolute top-1 right-1">
          <div class="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
        </div>

        <div class="text-center">
          <div class="text-lg mb-1">⏸️</div>
          <h4 class="font-serif font-medium text-ink-800 mb-1 text-xs">
            停止修炼
          </h4>
          <div class="text-xs text-ink-500">
            <p>无获得</p>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ACTIVITIES } from '~/utils/constants'

const gameStore = useGameStore()
const characterStore = useCharacterStore()

// 计算属性
const currentActivity = computed(() => gameStore.currentActivity)

// 获取修炼方向效率
const cultivationPath = computed(() => characterStore.getCurrentCultivationPath())
const qiEfficiency = computed(() => cultivationPath.value?.effects.spiritualQiEfficiency || 1)
const bodyEfficiency = computed(() => cultivationPath.value?.effects.constitutionGrowthRate || 1)

// 修炼总倍率（游戏速度 × 时光法宝倍率，只影响修炼）
const cultivationTotalMultiplier = computed(() => {
  const timeTreasureMultiplier = characterStore.getTimeTreasureSpeedMultiplier()
  return gameStore.gameSpeed * timeTreasureMultiplier
})



// 设置活动
function setActivity(activity: keyof typeof ACTIVITIES | null) {
  gameStore.setActivity(activity)
}
</script>
