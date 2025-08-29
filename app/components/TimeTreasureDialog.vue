<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="closeDialog"
  >
    <div class="bg-paper-100 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
      <!-- 弹窗头部 -->
      <div class="flex justify-between items-center p-4 border-b border-ink-300">
        <h2 class="text-xl font-serif font-semibold text-ink-800">时光法宝</h2>
        <button
          @click="closeDialog"
          class="text-ink-600 hover:text-ink-800 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <!-- 弹窗内容 -->
      <div class="p-4 space-y-4">
        <!-- 当前装备的时光法宝 -->
        <div class="card p-4">
          <h3 class="font-serif font-semibold text-ink-800 mb-3">当前装备</h3>
          <div v-if="currentTimeTreasure" class="text-center">
            <div class="text-3xl mb-2">{{ currentTimeTreasure.icon }}</div>
            <h4 class="font-medium text-ink-800 mb-1">{{ currentTimeTreasure.name }}</h4>
            <p class="text-sm text-ink-600 mb-2">{{ currentTimeTreasure.description }}</p>
            <div class="text-base font-semibold text-gold-600 bg-gold-50 px-3 py-1 rounded inline-block mb-3">
              修炼 {{ currentTimeTreasure.speedMultiplier }}x 加速
            </div>
            <br>
            <button
              @click="unequipTimeTreasure"
              class="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              卸下法宝
            </button>
          </div>
          <div v-else class="text-center text-ink-500">
            <div class="text-3xl mb-2">⚪</div>
            <p class="mb-2">未装备时光法宝</p>
            <p class="text-sm bg-gray-50 px-3 py-2 rounded inline-block">当前效率: 1.0x</p>
          </div>
        </div>

        <!-- 可用的时光法宝 -->
        <div>
          <h3 class="font-serif font-semibold text-ink-800 mb-3">可用法宝</h3>
          <div v-if="availableTreasures.length > 0" class="space-y-3">
            <div
              v-for="treasure in availableTreasures"
              :key="treasure.id"
              class="border rounded-lg p-3 transition-all duration-200 cursor-pointer"
              :class="currentTimeTreasure?.id === treasure.id 
                ? 'border-gold-400 bg-gold-50 shadow-md' 
                : 'border-ink-300 hover:border-ink-400 hover:shadow-sm'"
              @click="toggleEquipment(treasure.id)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="text-2xl">{{ treasure.icon }}</div>
                  <div>
                    <div class="flex items-center space-x-2 mb-1">
                      <h4 class="font-medium text-ink-800">{{ treasure.name }}</h4>
                      <span class="text-xs px-2 py-1 rounded" :class="getQualityClass(treasure.quality)">
                        {{ getQualityName(treasure.quality) }}
                      </span>
                      <!-- 装备状态 -->
                      <span v-if="currentTimeTreasure?.id === treasure.id" 
                            class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                        ✓ 已装备
                      </span>
                    </div>
                    <p class="text-sm text-ink-600 mb-1">{{ treasure.description }}</p>
                    <p class="text-sm font-medium text-gold-600">
                      修炼加速: {{ treasure.speedMultiplier }}x
                    </p>
                  </div>
                </div>
                
                <!-- 右侧操作按钮 -->
                <div class="ml-4">
                  <button
                    v-if="currentTimeTreasure?.id === treasure.id"
                    @click.stop="unequipTimeTreasure"
                    class="text-xs text-gray-600 hover:text-gray-800 underline"
                  >
                    卸下
                  </button>
                  <div v-else class="text-xs text-gray-400">
                    点击装备
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-ink-500 py-4">
            <p>暂无可用的时光法宝</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TIME_TREASURES, TimeTreasureQuality } from '~/utils/constants'

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

const characterStore = useCharacterStore()

// 计算属性
const currentTimeTreasure = computed(() => characterStore.getCurrentTimeTreasure())

// 监听装备状态变化
watch(currentTimeTreasure, (newValue, oldValue) => {
  // Equipment status changed
}, { deep: true })

// 获取角色拥有的时光法宝
const availableTreasures = computed(() => {
  const character = characterStore.character
  if (!character) {
    return []
  }

  if (!character.inventory.timeTreasures || character.inventory.timeTreasures.length === 0) {
    return []
  }

  const treasures = character.inventory.timeTreasures
    .map(id => {
      // Find treasure by matching the id field, not the key
      const treasure = Object.values(TIME_TREASURES).find(t => t.id === id)
      return treasure
    })
    .filter(Boolean)
  
  return treasures
})

// 关闭弹窗
function closeDialog() {
  emit('update:show', false)
}

// 切换装备状态
function toggleEquipment(treasureId: string) {
  if (currentTimeTreasure.value?.id === treasureId) {
    // 如果点击的是当前装备，则卸下
    unequipTimeTreasure()
  } else {
    // 否则装备新的法宝
    equipTimeTreasure(treasureId)
  }
}

// 装备时光法宝
function equipTimeTreasure(treasureId: string) {
  const character = characterStore.character
  if (!character) {
    return
  }

  // 检查是否拥有该法宝
  if (!character.inventory.timeTreasures.includes(treasureId)) {
    return
  }

  // 装备新法宝
  const success = characterStore.equipTimeTreasure(treasureId)
  
  if (success) {
    const treasure = Object.values(TIME_TREASURES).find(t => t.id === treasureId)
    if (treasure) {
      // 添加装备消息
      const gameStore = useGameStore()
      gameStore.addMessage(`装备时光法宝：${treasure.name}`, 'success')
    }
  }
}

// 卸下时光法宝
function unequipTimeTreasure() {
  const currentTreasure = currentTimeTreasure.value
  
  const success = characterStore.equipTimeTreasure(null)
  
  if (success && currentTreasure) {
    // 添加卸下消息
    const gameStore = useGameStore()
    gameStore.addMessage(`卸下时光法宝：${currentTreasure.name}`, 'info')
  }
}

// 获取品质样式类
function getQualityClass(quality: TimeTreasureQuality): string {
  switch (quality) {
    case TimeTreasureQuality.COMMON:
      return 'bg-gray-100 text-gray-700'
    case TimeTreasureQuality.RARE:
      return 'bg-blue-100 text-blue-700'
    case TimeTreasureQuality.EPIC:
      return 'bg-purple-100 text-purple-700'
    case TimeTreasureQuality.LEGENDARY:
      return 'bg-gold-100 text-gold-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

// 获取品质名称
function getQualityName(quality: TimeTreasureQuality): string {
  switch (quality) {
    case TimeTreasureQuality.COMMON:
      return '普通'
    case TimeTreasureQuality.RARE:
      return '稀有'
    case TimeTreasureQuality.EPIC:
      return '史诗'
    case TimeTreasureQuality.LEGENDARY:
      return '传说'
    default:
      return '未知'
  }
}
</script>
