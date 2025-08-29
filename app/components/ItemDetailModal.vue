<template>
  <div
    v-if="show && item"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4"
    @click.self="closeModal"
  >
    <div class="bg-paper-100 rounded-lg shadow-xl max-w-md w-full relative">
      <!-- 关闭按钮 -->
      <button
        @click="closeModal"
        class="absolute top-3 right-3 text-ink-600 hover:text-ink-800 text-xl leading-none z-10"
      >
        ×
      </button>

      <!-- 物品信息 -->
      <div class="p-6">
        <!-- 物品名称和数量 -->
        <div class="text-center mb-4">
          <div class="text-3xl mb-2">{{ item.icon }}</div>
          <h3 class="text-xl font-serif font-semibold text-ink-800 mb-1">{{ item.name }}</h3>
          <div class="text-sm text-ink-600">数量: {{ quantity }}</div>
          
          <!-- 品质标签 -->
          <div class="mt-2">
            <span class="text-xs px-3 py-1 rounded-full" :class="getQualityClass(item.quality)">
              {{ getQualityName(item.quality) }}
            </span>
          </div>
        </div>

        <!-- 物品描述 -->
        <div class="mb-6">
          <h4 class="font-medium text-ink-700 mb-2">物品介绍</h4>
          <p class="text-sm text-ink-600 leading-relaxed">{{ item.description }}</p>
          
          <!-- 物品效果 -->
          <div v-if="item.effects" class="mt-3 p-3 bg-blue-50 rounded-lg">
            <h5 class="font-medium text-blue-800 mb-2">使用效果</h5>
            <div class="text-sm text-blue-700 space-y-1">
              <div v-if="item.effects.qiExperience">
                练气经验: +{{ item.effects.qiExperience }}
              </div>
              <div v-if="item.effects.bodyExperience">
                炼体经验: +{{ item.effects.bodyExperience }}
              </div>
              <div v-if="item.effects.divinePowerId">
                {{ getDivinePowerEffectText(item.effects.divinePowerId, item.effects.divinePowerExperience) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 数量输入和操作按钮 -->
        <div class="space-y-4">
          <!-- 数量选择 -->
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-2">使用数量</label>
            <div class="flex items-center space-x-3">
              <button
                @click="decrementQuantity"
                :disabled="useQuantity <= 1"
                class="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 rounded text-sm font-medium"
              >
                -
              </button>
              <input
                v-model.number="useQuantity"
                type="number"
                :min="1"
                :max="quantity"
                class="w-20 text-center border border-ink-300 rounded px-2 py-1 text-sm"
              >
              <button
                @click="incrementQuantity"
                :disabled="useQuantity >= quantity"
                class="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 rounded text-sm font-medium"
              >
                +
              </button>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex space-x-3">
            <button
              @click="useItem"
              :disabled="useQuantity <= 0 || useQuantity > quantity"
              class="flex-1 btn-primary text-sm py-2"
              :class="{ 'opacity-50 cursor-not-allowed': useQuantity <= 0 || useQuantity > quantity }"
            >
              使用 ({{ useQuantity }})
            </button>
            <button
              @click="discardItem"
              :disabled="useQuantity <= 0 || useQuantity > quantity"
              class="flex-1 btn-secondary text-sm py-2"
              :class="{ 'opacity-50 cursor-not-allowed': useQuantity <= 0 || useQuantity > quantity }"
            >
              丢弃 ({{ useQuantity }})
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { STORAGE_ITEMS, DIVINE_POWERS, StorageItemQuality } from '~/utils/constants'

// Props
interface Props {
  show: boolean
  itemId: string
  quantity: number
}

// Emits
interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'useItem', itemId: string, quantity: number): void
  (e: 'discardItem', itemId: string, quantity: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 状态管理
const characterStore = useCharacterStore()

// 本地状态
const useQuantity = ref(1)

// 计算属性
const item = computed(() => {
  if (!props.itemId) return null
  return STORAGE_ITEMS[props.itemId] || null
})

// 监听属性变化，重置使用数量
watch(() => props.itemId, () => {
  useQuantity.value = 1
})

watch(() => props.quantity, (newQuantity) => {
  if (useQuantity.value > newQuantity) {
    useQuantity.value = Math.min(1, newQuantity)
  }
})

// 获取神通效果文本
function getDivinePowerEffectText(powerId: string, experience?: number): string {
  const power = DIVINE_POWERS[powerId]
  if (!power) return ''
  
  const hasOwned = characterStore.hasDivinePower(powerId)
  if (hasOwned) {
    return `已拥有${power.name}，获得${experience || 10}灵晶`
  } else {
    return `学会神通：${power.name}`
  }
}

// 获取品质样式类
function getQualityClass(quality: StorageItemQuality): string {
  switch (quality) {
    case StorageItemQuality.COMMON:
      return 'bg-gray-100 text-gray-700'
    case StorageItemQuality.RARE:
      return 'bg-blue-100 text-blue-700'
    case StorageItemQuality.EPIC:
      return 'bg-purple-100 text-purple-700'
    case StorageItemQuality.LEGENDARY:
      return 'bg-gold-100 text-gold-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

// 获取品质名称
function getQualityName(quality: StorageItemQuality): string {
  switch (quality) {
    case StorageItemQuality.COMMON:
      return '普通'
    case StorageItemQuality.RARE:
      return '稀有'
    case StorageItemQuality.EPIC:
      return '史诗'
    case StorageItemQuality.LEGENDARY:
      return '传说'
    default:
      return '普通'
  }
}

// 递增数量
function incrementQuantity() {
  if (useQuantity.value < props.quantity) {
    useQuantity.value++
  }
}

// 递减数量
function decrementQuantity() {
  if (useQuantity.value > 1) {
    useQuantity.value--
  }
}

// 使用物品
function useItem() {
  if (useQuantity.value <= 0 || useQuantity.value > props.quantity) return
  
  emit('useItem', props.itemId, useQuantity.value)
}

// 丢弃物品
function discardItem() {
  if (useQuantity.value <= 0 || useQuantity.value > props.quantity) return
  
  if (confirm(`确定要丢弃 ${item.value?.name} x${useQuantity.value} 吗？`)) {
    emit('discardItem', props.itemId, useQuantity.value)
  }
}

// 关闭模态框
function closeModal() {
  emit('update:show', false)
}
</script>