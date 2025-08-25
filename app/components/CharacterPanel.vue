<template>
  <div class="space-y-3 md:space-y-4">
    <!-- 角色基础信息 -->
    <div class="card p-3 md:p-4">
      <h3 class="font-serif font-semibold text-ink-800 mb-2 md:mb-3 text-sm md:text-base">角色信息</h3>
      <div class="space-y-1 md:space-y-2 text-xs md:text-sm">
        <div class="flex justify-between">
          <span class="text-ink-600">道号：</span>
          <span class="text-ink-800 font-medium">{{ character?.name }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-ink-600">性别：</span>
          <span class="text-ink-800">{{ character?.gender === 'male' ? '男' : '女' }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-ink-600">天赋：</span>
          <span class="text-ink-800">{{ currentTalent?.name }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-ink-600">总战力：</span>
          <span class="text-gold-500 font-medium">{{ formatNumber(totalPower) }}</span>
        </div>
      </div>
    </div>

    <!-- 修炼境界 -->
    <div class="card p-3 md:p-4">
      <h3 class="font-serif font-semibold text-ink-800 mb-2 md:mb-3 text-sm md:text-base">修炼境界</h3>
      <div class="space-y-2 md:space-y-3">
        <div>
          <div class="flex justify-between items-center mb-1">
            <span class="text-ink-700 font-medium text-sm md:text-base">{{ currentRealm?.name }}</span>
            <span class="text-ink-600 text-xs md:text-sm">{{ character?.cultivation.level }}层</span>
          </div>
          <div class="w-full bg-ink-200 rounded-full h-2">
            <div
              class="bg-gold-400 h-2 rounded-full transition-all duration-300"
              :style="{ width: experiencePercentage + '%' }"
            ></div>
          </div>
          <div class="flex justify-between text-xs text-ink-500 mt-1">
            <span>{{ formatNumber(character?.cultivation.experience || 0) }}</span>
            <span>{{ formatNumber(requiredExp) }}</span>
          </div>
        </div>

        <!-- 突破按钮 -->
        <button
          v-if="canBreakthrough"
          @click="attemptBreakthrough"
          class="btn-primary w-full text-xs md:text-sm py-2"
        >
          尝试突破 ({{ formatPercentage(breakthroughChance) }})
        </button>
      </div>
    </div>

    <!-- 属性面板 -->
    <div class="card p-3 md:p-4">
      <h3 class="font-serif font-semibold text-ink-800 mb-2 md:mb-3 text-sm md:text-base">属性</h3>
      <div class="grid grid-cols-2 gap-2 md:space-y-2 md:block text-xs md:text-sm">
        <div class="flex justify-between md:mb-2">
          <span class="text-ink-600">体质：</span>
          <span class="text-ink-800 font-medium">{{ character?.attributes.constitution }}</span>
        </div>
        <div class="flex justify-between md:mb-2">
          <span class="text-ink-600">灵力：</span>
          <span class="text-ink-800 font-medium">{{ character?.attributes.spiritualPower }}</span>
        </div>
        <div class="flex justify-between md:mb-2">
          <span class="text-ink-600">悟性：</span>
          <span class="text-ink-800 font-medium">{{ character?.attributes.comprehension }}</span>
        </div>
        <div class="flex justify-between md:mb-2">
          <span class="text-ink-600">炼体：</span>
          <span class="text-ink-800 font-medium">{{ Math.floor(character?.cultivation.bodyLevel || 0) }}</span>
        </div>
        <div class="flex justify-between col-span-2 md:col-span-1">
          <span class="text-ink-600">练气：</span>
          <span class="text-ink-800 font-medium">{{ Math.floor(character?.cultivation.spiritLevel || 0) }}</span>
        </div>
      </div>
    </div>

    <!-- 资源面板 -->
    <div class="card p-3 md:p-4">
      <h3 class="font-serif font-semibold text-ink-800 mb-2 md:mb-3 text-sm md:text-base">资源</h3>
      <div class="space-y-1 md:space-y-2 text-xs md:text-sm">
        <div class="flex justify-between">
          <span class="text-ink-600">灵气：</span>
          <span class="text-blue-600 font-medium">{{ formatNumber(character?.resources.spiritualQi || 0) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-ink-600">灵石：</span>
          <span class="text-gold-500 font-medium">{{ formatNumber(character?.resources.spiritualStones || 0) }}</span>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="card p-3 md:p-4">
      <h3 class="font-serif font-semibold text-ink-800 mb-2 md:mb-3 text-sm md:text-base">统计</h3>
      <div class="space-y-1 md:space-y-2 text-xs md:text-sm">
        <div class="flex justify-between">
          <span class="text-ink-600">游戏时间：</span>
          <span class="text-ink-800 font-medium">{{ formatTime(character?.stats.totalPlayTime || 0) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-ink-600">探险次数：</span>
          <span class="text-ink-800 font-medium">{{ character?.stats.totalExploration || 0 }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-ink-600">突破成功率：</span>
          <span class="text-ink-800 font-medium">
            {{ character?.stats.breakthroughAttempts ?
              formatPercentage(character.stats.successfulBreakthroughs / character.stats.breakthroughAttempts) :
              '0%'
            }}
          </span>
        </div>
      </div>
    </div>

    <!-- 修炼效率 -->
    <div class="card p-3 md:p-4">
      <h3 class="font-serif font-semibold text-ink-800 mb-2 md:mb-3 text-sm md:text-base">修炼效率</h3>
      <div class="space-y-1 md:space-y-2 text-xs md:text-sm">
        <div class="flex justify-between">
          <span class="text-ink-600">修炼倍率：</span>
          <span class="text-green-600 font-medium">{{ cultivationSpeedMultiplier.toFixed(2) }}x</span>
        </div>
        <div class="flex justify-between">
          <span class="text-ink-600">突破几率：</span>
          <span class="text-blue-600 font-medium">{{ formatPercentage(breakthroughChance) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const characterStore = useCharacterStore()
const { formatNumber, formatPercentage } = useNumberFormatter()
const { formatTime } = useTimeFormatter()
const { attemptBreakthrough } = useGameEvents()

// 计算属性
const character = computed(() => characterStore.character)
const currentRealm = computed(() => characterStore.currentRealm)
const currentTalent = computed(() => characterStore.currentTalent)
const totalPower = computed(() => characterStore.totalPower)
const requiredExp = computed(() => characterStore.requiredExp)
const canBreakthrough = computed(() => characterStore.canBreakthrough)
const breakthroughChance = computed(() => characterStore.breakthroughChance)
const cultivationSpeedMultiplier = computed(() => characterStore.cultivationSpeedMultiplier)

// 经验百分比
const experiencePercentage = computed(() => {
  if (!character.value) return 0
  const current = character.value.cultivation.experience
  const required = requiredExp.value
  return required > 0 ? Math.min(100, (current / required) * 100) : 0
})
</script>
