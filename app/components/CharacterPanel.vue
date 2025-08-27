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
          <span class="text-ink-600">修炼方向：</span>
          <span class="text-ink-800">{{ currentCultivationPath?.name }}</span>
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



    <!-- 基础属性面板 -->
    <div class="card p-3 md:p-4">
      <h3 class="font-serif font-semibold text-ink-800 mb-2 md:mb-3 text-sm md:text-base">基础属性</h3>
      <div class="grid grid-cols-2 gap-2 md:space-y-2 md:block text-xs md:text-sm">
        <div class="flex justify-between md:mb-2">
          <span class="text-ink-600">体质：</span>
          <span class="text-ink-800 font-medium">{{ character?.attributes.constitution }}</span>
        </div>
        <div class="flex justify-between md:mb-2">
          <span class="text-ink-600">灵力：</span>
          <span class="text-ink-800 font-medium">{{ character?.attributes.spiritualPower }}</span>
        </div>
        <div class="flex justify-between col-span-2 md:col-span-1">
          <span class="text-ink-600">悟性：</span>
          <span class="text-ink-800 font-medium">{{ character?.attributes.comprehension }}</span>
        </div>
      </div>
    </div>

    <!-- 衍生属性面板 -->
    <div class="card p-3 md:p-4">
      <h3 class="font-serif font-semibold text-ink-800 mb-2 md:mb-3 text-sm md:text-base">战斗属性</h3>
      <div class="grid grid-cols-2 gap-2 md:space-y-2 md:block text-xs md:text-sm">
        <div class="flex justify-between md:mb-2">
          <span class="text-ink-600">生命值：</span>
          <span class="text-red-600 font-medium">{{ character?.derivedAttributes.maxHealth }}</span>
        </div>
        <div class="flex justify-between md:mb-2">
          <span class="text-ink-600">法力：</span>
          <span class="text-blue-600 font-medium">{{ character?.derivedAttributes.mana }}</span>
        </div>
        <div class="flex justify-between md:mb-2">
          <span class="text-ink-600">神力：</span>
          <span class="text-orange-600 font-medium">{{ character?.derivedAttributes.divineStrength }}</span>
        </div>
        <div class="flex justify-between md:mb-2">
          <span class="text-ink-600">物抗：</span>
          <span class="text-green-600 font-medium">{{ character?.derivedAttributes.physicalDefense }}</span>
        </div>
        <div class="flex justify-between col-span-2 md:col-span-1">
          <span class="text-ink-600">法抗：</span>
          <span class="text-purple-600 font-medium">{{ character?.derivedAttributes.magicalDefense }}</span>
        </div>
      </div>
    </div>

    <!-- 修炼等级面板 -->
    <div class="card p-3 md:p-4">
      <h3 class="font-serif font-semibold text-ink-800 mb-2 md:mb-3 text-sm md:text-base">修炼等级</h3>
      <div class="space-y-3">
        <!-- 练气等级 -->
        <div>
          <div class="flex justify-between items-center mb-1">
            <span class="text-ink-700 font-medium text-sm">练气</span>
            <div class="flex items-center space-x-2">
              <span class="text-ink-600 text-xs">{{ currentQiLevelInfo?.levelInfo?.name || '未入门' }}</span>
              <button
                v-if="characterStore.needQiBreakthrough"
                class="px-2 py-1 text-xs bg-gold-500 text-white rounded hover:bg-gold-600 transition-colors"
                @click="handleQiBreakthrough"
              >
                突破
              </button>
            </div>
          </div>
          <div class="w-full bg-ink-200 rounded-full h-2">
            <div
              class="bg-blue-400 h-2 rounded-full transition-all duration-300"
              :style="{ width: qiExperiencePercentage + '%' }"
            ></div>
          </div>
          <div class="flex justify-between text-xs text-ink-500 mt-1">
            <span>{{ formatNumber(character?.resources.spiritualQi || 0) }}</span>
            <span>{{ formatNumber(nextQiLevelExp) }}</span>
          </div>
        </div>

        <!-- 炼体等级 -->
        <div>
          <div class="flex justify-between items-center mb-1">
            <span class="text-ink-700 font-medium text-sm">炼体</span>
            <div class="flex items-center space-x-2">
              <span class="text-ink-600 text-xs">{{ currentBodyLevelInfo?.levelInfo?.name || '未入门' }}</span>
              <button
                v-if="characterStore.needBodyBreakthrough"
                class="px-2 py-1 text-xs bg-gold-500 text-white rounded hover:bg-gold-600 transition-colors"
                @click="handleBodyBreakthrough"
              >
                突破
              </button>
            </div>
          </div>
          <div class="w-full bg-ink-200 rounded-full h-2">
            <div
              class="bg-orange-400 h-2 rounded-full transition-all duration-300"
              :style="{ width: bodyExperiencePercentage + '%' }"
            ></div>
          </div>
          <div class="flex justify-between text-xs text-ink-500 mt-1">
            <span>{{ formatNumber(character?.resources.spiritualStones || 0) }}</span>
            <span>{{ formatNumber(nextBodyLevelExp) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 资源面板 -->
    <div class="card p-3 md:p-4">
      <h3 class="font-serif font-semibold text-ink-800 mb-2 md:mb-3 text-sm md:text-base">资源</h3>
      <div class="space-y-1 md:space-y-2 text-xs md:text-sm">
        <div class="flex justify-between">
          <span class="text-ink-600">灵晶:</span>
          <span class="font-medium text-gold-600">{{ formatNumber(character?.resources.spiritCrystals || 0) }}</span>
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
          <span class="text-ink-600">累积练气经验：</span>
          <span class="text-blue-600 font-medium">{{ formatNumber(character?.stats.totalSpiritualQiGained || 0) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-ink-600">累积炼体经验：</span>
          <span class="text-orange-600 font-medium">{{ formatNumber(character?.stats.totalSpiritualStonesGained || 0) }}</span>
        </div>

      </div>
    </div>

    <!-- 修炼方向效率 -->
    <div class="card p-3 md:p-4">
      <h3 class="font-serif font-semibold text-ink-800 mb-2 md:mb-3 text-sm md:text-base">修炼效率</h3>
      <div class="space-y-1 md:space-y-2 text-xs md:text-sm">
        <div class="flex justify-between">
          <span class="text-ink-600">灵气获取效率：</span>
          <span class="text-blue-600 font-medium">{{ (currentCultivationPath?.effects.spiritualQiEfficiency || 1).toFixed(2) }}x</span>
        </div>
        <div class="flex justify-between">
          <span class="text-ink-600">体质成长效率：</span>
          <span class="text-orange-600 font-medium">{{ (currentCultivationPath?.effects.constitutionGrowthRate || 1).toFixed(2) }}x</span>
        </div>
        <div class="flex justify-between">
          <span class="text-ink-600">修炼方向：</span>
          <span class="text-ink-800 font-medium">{{ currentCultivationPath?.name || '未知' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const characterStore = useCharacterStore()
const { formatNumber, formatPercentage } = useNumberFormatter()
const { formatTime } = useTimeFormatter()

// 计算属性
const character = computed(() => characterStore.character)
const currentTalent = computed(() => characterStore.currentTalent)
const currentCultivationPath = computed(() => characterStore.getCurrentCultivationPath())
const totalPower = computed(() => characterStore.totalPower)
const currentQiLevelInfo = computed(() => characterStore.currentQiLevelInfo)
const currentBodyLevelInfo = computed(() => characterStore.currentBodyLevelInfo)



// 练气经验百分比
const qiExperiencePercentage = computed(() => {
  if (!character.value || !currentQiLevelInfo.value?.levelInfo) return 0
  const current = character.value.resources.spiritualQi
  const required = currentQiLevelInfo.value.levelInfo.requiredExp
  return required > 0 ? Math.min(100, (current / required) * 100) : 0
})

// 炼体经验百分比（现在使用 spiritualStones）
const bodyExperiencePercentage = computed(() => {
  if (!character.value || !currentBodyLevelInfo.value?.levelInfo) return 0
  const current = character.value.resources.spiritualStones
  const required = currentBodyLevelInfo.value.levelInfo.requiredExp
  return required > 0 ? Math.min(100, (current / required) * 100) : 0
})

// 下一级练气所需经验
const nextQiLevelExp = computed(() => {
  return currentQiLevelInfo.value?.levelInfo?.requiredExp || 0
})

// 下一级炼体所需经验
const nextBodyLevelExp = computed(() => {
  return currentBodyLevelInfo.value?.levelInfo?.requiredExp || 0
})

// 突破处理函数
const handleQiBreakthrough = () => {
  // 暂时只显示提示，突破功能待实现
  const gameStore = useGameStore()
  gameStore.addMessage('练气突破功能暂未开放，敬请期待！', 'info')
}

const handleBodyBreakthrough = () => {
  // 暂时只显示提示，突破功能待实现
  const gameStore = useGameStore()
  gameStore.addMessage('炼体突破功能暂未开放，敬请期待！', 'info')
}


</script>
