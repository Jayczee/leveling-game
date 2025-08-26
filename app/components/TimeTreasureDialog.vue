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
            <div class="flex justify-center items-center space-x-2 mb-3">
              <span class="text-xs px-2 py-1 rounded" :class="getQualityClass(currentTimeTreasure.quality)">
                {{ getQualityName(currentTimeTreasure.quality) }}
              </span>
              <span class="text-sm font-medium text-gold-600">
                修炼 {{ currentTimeTreasure.speedMultiplier }}x 加速
              </span>
            </div>
            <button
              @click="unequipTimeTreasure"
              class="btn-secondary text-sm"
            >
              卸下法宝
            </button>
          </div>
          <div v-else class="text-center text-ink-500">
            <div class="text-3xl mb-2">⚪</div>
            <p>未装备时光法宝</p>
            <p class="text-sm mt-1">当前效率: 1.0x</p>
          </div>
        </div>

        <!-- 可用的时光法宝 -->
        <div>
          <h3 class="font-serif font-semibold text-ink-800 mb-3">可用法宝</h3>
          <div v-if="availableTreasures.length > 0" class="space-y-3">
            <div
              v-for="treasure in availableTreasures"
              :key="treasure.id"
              class="border border-ink-300 rounded-lg p-3 cursor-pointer hover:bg-paper-100 transition-colors"
              :class="{ 'ring-2 ring-gold-400 bg-gold-50': currentTimeTreasure?.id === treasure.id }"
              @click="equipTimeTreasure(treasure.id)"
            >
              <div class="flex items-center space-x-3">
                <div class="text-2xl">{{ treasure.icon }}</div>
                <div class="flex-1">
                  <div class="flex justify-between items-start mb-1">
                    <h4 class="font-medium text-ink-800">{{ treasure.name }}</h4>
                    <span class="text-xs px-2 py-1 rounded" :class="getQualityClass(treasure.quality)">
                      {{ getQualityName(treasure.quality) }}
                    </span>
                  </div>
                  <p class="text-sm text-ink-600 mb-1">{{ treasure.description }}</p>
                  <p class="text-sm font-medium text-gold-600">
                    修炼加速: {{ treasure.speedMultiplier }}x
                  </p>
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

// 获取角色拥有的时光法宝
const availableTreasures = computed(() => {
  const character = characterStore.character
  if (!character) return []

  return character.inventory.timeTreasures
    .map(id => TIME_TREASURES[id])
    .filter(Boolean)
})

// 关闭弹窗
function closeDialog() {
  emit('update:show', false)
}

// 装备时光法宝
function equipTimeTreasure(treasureId: string) {
  const character = characterStore.character
  if (!character) return

  // 检查是否拥有该法宝
  if (!character.inventory.timeTreasures.includes(treasureId)) {
    return
  }

  characterStore.equipTimeTreasure(treasureId)
}

// 卸下时光法宝
function unequipTimeTreasure() {
  characterStore.equipTimeTreasure(null)
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
