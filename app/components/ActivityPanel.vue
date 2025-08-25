<template>
  <div>
    <h3 class="font-serif font-semibold text-ink-800 mb-2 md:mb-4 text-base md:text-lg">修炼活动</h3>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
      <!-- 打坐静修 -->
      <div
        class="card cursor-pointer transition-all hover:shadow-md p-3 relative"
        :class="{ 'ring-2 ring-gold-400 bg-gold-50': currentActivity === 'MEDITATION' }"
        @click="setActivity('MEDITATION')"
      >
        <!-- 进行中状态指示器 -->
        <div v-if="currentActivity === 'MEDITATION'" class="absolute top-2 right-2">
          <div class="flex items-center space-x-1">
            <div class="w-2 h-2 bg-gold-500 rounded-full animate-pulse"></div>
            <span class="text-xs text-gold-600 font-medium">进行中</span>
          </div>
        </div>

        <div class="text-center">
          <div class="text-xl mb-1">🧘</div>
          <h4 class="font-serif font-medium text-ink-800 mb-1 text-sm">
            {{ ACTIVITIES.MEDITATION.name }}
          </h4>
          <div class="text-xs text-ink-500 space-y-1">
            <p>经验: +{{ (ACTIVITIES.MEDITATION.baseGain * cultivationSpeedMultiplier * totalSpeedMultiplier).toFixed(1) }}/秒</p>
          </div>
        </div>
      </div>

      <!-- 炼体修行 -->
      <div
        class="card cursor-pointer transition-all hover:shadow-md p-3 relative"
        :class="{ 'ring-2 ring-gold-400 bg-gold-50': currentActivity === 'BODY_TRAINING' }"
        @click="setActivity('BODY_TRAINING')"
      >
        <!-- 进行中状态指示器 -->
        <div v-if="currentActivity === 'BODY_TRAINING'" class="absolute top-2 right-2">
          <div class="flex items-center space-x-1">
            <div class="w-2 h-2 bg-gold-500 rounded-full animate-pulse"></div>
            <span class="text-xs text-gold-600 font-medium">进行中</span>
          </div>
        </div>

        <div class="text-center">
          <div class="text-xl mb-1">💪</div>
          <h4 class="font-serif font-medium text-ink-800 mb-1 text-sm">
            {{ ACTIVITIES.BODY_TRAINING.name }}
          </h4>
          <div class="text-xs text-ink-500 space-y-1">
            <p>炼体: +{{ (ACTIVITIES.BODY_TRAINING.baseGain * bodyTrainingMultiplier * totalSpeedMultiplier).toFixed(1) }}/秒</p>
          </div>
        </div>
      </div>

      <!-- 停止修炼 -->
      <div
        class="card cursor-pointer transition-all hover:shadow-md p-3 relative"
        :class="{ 'ring-2 ring-gray-400 bg-gray-50': currentActivity === null }"
        @click="setActivity(null)"
      >
        <!-- 进行中状态指示器 -->
        <div v-if="currentActivity === null" class="absolute top-2 right-2">
          <span class="text-xs text-gray-600 font-medium">空闲</span>
        </div>

        <div class="text-center">
          <div class="text-xl mb-1">⏸️</div>
          <h4 class="font-serif font-medium text-ink-800 mb-1 text-sm">
            停止修炼
          </h4>
          <div class="text-xs text-ink-500">
            <p>无资源获得</p>
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
const cultivationSpeedMultiplier = computed(() => characterStore.cultivationSpeedMultiplier)

// 炼体修炼倍率
const bodyTrainingMultiplier = computed(() => {
  const character = characterStore.character
  if (!character) return 1
  return 1 + character.attributes.constitution * 0.1
})

// 总速度倍率（游戏速度 × 时光法宝倍率）
const totalSpeedMultiplier = computed(() => {
  const timeTreasureMultiplier = characterStore.getTimeTreasureSpeedMultiplier()
  return gameStore.gameSpeed * timeTreasureMultiplier
})

// 设置活动
function setActivity(activity: keyof typeof ACTIVITIES | null) {
  gameStore.setActivity(activity)
}
</script>
