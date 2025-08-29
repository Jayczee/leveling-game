<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="closeDialog"
  >
    <div class="bg-paper-100 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <!-- 对话框头部 -->
      <div class="flex justify-between items-center p-4 border-b border-ink-300">
        <h2 class="text-xl font-serif font-semibold text-ink-800">储物戒</h2>
        <button
          @click="closeDialog"
          class="text-ink-600 hover:text-ink-800 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <!-- 储物戒内容 -->
      <div class="p-4">
        <!-- 容量显示 -->
        <div class="flex justify-between items-center mb-4">
          <div class="text-sm text-ink-600">
            储物戒容量: {{ capacity.used }}/{{ capacity.total }}
          </div>
          <div class="text-xs text-ink-500">
            左键点击物品查看详情
          </div>
        </div>

        <!-- 8x5 网格布局 -->
        <div class="grid grid-cols-8 gap-2 bg-paper-50 p-4 rounded-lg border-2 border-ink-300">
          <!-- 遍历40个格子 -->
          <div
            v-for="slotIndex in 40"
            :key="slotIndex"
            class="aspect-square border border-ink-200 rounded bg-white hover:bg-gray-50 transition-colors cursor-pointer relative"
            :class="getSlotClass(slotIndex - 1)"
            @click="onSlotClick(slotIndex - 1)"
          >
            <!-- 如果这个格子有物品 -->
            <div
              v-if="getItemAtSlot(slotIndex - 1)"
              class="w-full h-full flex flex-col items-center justify-center p-1"
            >
              <!-- 物品图标 -->
              <div class="text-lg mb-1">{{ getItemAtSlot(slotIndex - 1)?.icon }}</div>
              
              <!-- 数量显示 -->
              <div class="text-xs font-medium text-ink-700 bg-white bg-opacity-80 rounded px-1">
                {{ getItemStackAtSlot(slotIndex - 1)?.quantity }}
              </div>

              <!-- 品质边框 -->
              <div
                class="absolute inset-0 rounded border-2 pointer-events-none"
                :class="getQualityBorderClass(getItemAtSlot(slotIndex - 1)?.quality)"
              ></div>
            </div>

            <!-- 空格子 -->
            <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
              <div class="text-xl">+</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 物品详情模态框 -->
  <ItemDetailModal
    v-model:show="showItemDetail"
    :item-id="selectedItemId"
    :quantity="selectedItemQuantity"
    @use-item="onUseItem"
    @discard-item="onDiscardItem"
  />
</template>

<script setup lang="ts">
import { STORAGE_ITEMS, StorageItemQuality, type StorageItemStack } from '~/utils/constants'

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

// 状态管理
const characterStore = useCharacterStore()

// 本地状态
const showItemDetail = ref(false)
const selectedItemId = ref('')
const selectedItemQuantity = ref(0)

// 计算属性
const capacity = computed(() => characterStore.getStorageRingCapacity())

// 获取指定格子的物品堆叠
function getItemStackAtSlot(slotIndex: number): StorageItemStack | null {
  const character = characterStore.character
  if (!character) return null
  
  return character.inventory.storageRing[slotIndex] || null
}

// 获取指定格子的物品信息
function getItemAtSlot(slotIndex: number) {
  const stack = getItemStackAtSlot(slotIndex)
  if (!stack) return null
  
  return STORAGE_ITEMS[stack.itemId] || null
}

// 获取格子样式类
function getSlotClass(slotIndex: number): string {
  const item = getItemAtSlot(slotIndex)
  if (!item) return ''
  
  return 'hover:shadow-md'
}

// 获取品质边框样式
function getQualityBorderClass(quality?: StorageItemQuality): string {
  if (!quality) return ''
  
  switch (quality) {
    case StorageItemQuality.COMMON:
      return 'border-gray-400'
    case StorageItemQuality.RARE:
      return 'border-blue-400'
    case StorageItemQuality.EPIC:
      return 'border-purple-400'
    case StorageItemQuality.LEGENDARY:
      return 'border-gold-400'
    default:
      return 'border-gray-400'
  }
}

// 格子点击处理
function onSlotClick(slotIndex: number) {
  const stack = getItemStackAtSlot(slotIndex)
  if (!stack) return
  
  const item = STORAGE_ITEMS[stack.itemId]
  if (!item) return
  
  // 显示物品详情
  selectedItemId.value = stack.itemId
  selectedItemQuantity.value = stack.quantity
  showItemDetail.value = true
}

// 使用物品
function onUseItem(itemId: string, quantity: number) {
  characterStore.useStorageItem(itemId, quantity)
  
  // 更新选中物品的数量
  const newQuantity = characterStore.getStorageItemQuantity(itemId)
  if (newQuantity === 0) {
    showItemDetail.value = false
  } else {
    selectedItemQuantity.value = newQuantity
  }
}

// 丢弃物品
function onDiscardItem(itemId: string, quantity: number) {
  characterStore.discardStorageItem(itemId, quantity)
  
  // 更新选中物品的数量
  const newQuantity = characterStore.getStorageItemQuantity(itemId)
  if (newQuantity === 0) {
    showItemDetail.value = false
  } else {
    selectedItemQuantity.value = newQuantity
  }
}

// 关闭对话框
function closeDialog() {
  emit('update:show', false)
  showItemDetail.value = false
}
</script>