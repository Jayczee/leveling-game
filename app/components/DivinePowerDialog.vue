<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="closeDialog"
  >
    <div class="bg-paper-100 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
      <!-- 对话框头部 -->
      <div class="flex justify-between items-center p-4 border-b border-ink-300">
        <div class="flex items-center space-x-3">
          <h2 class="text-xl font-serif font-semibold text-ink-800">神通系统</h2>
          <div class="flex items-center space-x-2 text-sm">
            <span class="text-ink-600">灵晶:</span>
            <span class="font-medium text-gold-600">{{ characterStore.character?.resources.spiritCrystals || 0 }}</span>
          </div>
        </div>
        <button
          @click="closeDialog"
          class="text-ink-600 hover:text-ink-800 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <!-- 神通列表 -->
      <div class="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- 遍历所有神通 -->
          <div
            v-for="(power, powerId) in DIVINE_POWERS"
            :key="powerId"
            class="card p-4 relative"
            :class="getDivinePowerCardClass(powerId)"
          >
            <!-- 神通图标和名称 -->
            <div class="flex items-center mb-3">
              <span class="text-3xl mr-3">{{ power.icon }}</span>
              <div class="flex-1">
                <h3 class="font-serif font-semibold text-ink-800">{{ power.name }}</h3>
                <div class="flex items-center space-x-2">
                  <span class="text-xs px-2 py-1 rounded" :class="getQualityClass(power.quality)">
                    {{ getQualityName(power.quality) }}
                  </span>
                  <span v-if="characterStore.hasDivinePower(powerId)" class="text-xs text-green-600 font-medium">
                    已获得
                  </span>
                  <span v-else class="text-xs text-gray-500">
                    未获得
                  </span>
                </div>
              </div>
            </div>

            <!-- 神通描述 -->
            <p class="text-sm text-ink-600 mb-3">{{ power.description }}</p>

            <!-- 神通等级和效果 -->
            <div v-if="characterStore.hasDivinePower(powerId)" class="space-y-2">
              <div class="flex justify-between text-sm">
                <span>等级:</span>
                <span class="font-medium">{{ getDivinePowerLevel(powerId) }}/{{ power.maxLevel }}</span>
              </div>

              <!-- 当前效果 -->
              <div class="text-xs text-ink-500 space-y-1">
                <div v-if="power.effects.health">
                  生命值: +{{ power.effects.health * getDivinePowerLevel(powerId) }}
                </div>
                <div v-if="power.effects.divineStrength">
                  神力: +{{ power.effects.divineStrength * getDivinePowerLevel(powerId) }}
                </div>
                <div v-if="power.effects.physicalDefense">
                  物抗: +{{ power.effects.physicalDefense * getDivinePowerLevel(powerId) }}
                </div>
                <div v-if="power.effects.magicalDefense">
                  法抗: +{{ power.effects.magicalDefense * getDivinePowerLevel(powerId) }}
                </div>
              </div>

              <!-- 升级按钮 -->
              <div v-if="getDivinePowerLevel(powerId) < power.maxLevel" class="mt-3">
                <div class="flex justify-between items-center text-xs mb-2">
                  <span>升级消耗:</span>
                  <span class="font-medium text-gold-600">
                    {{ getUpgradeCost(powerId) }} 灵晶
                  </span>
                </div>
                <button
                  @click="upgradeDivinePower(powerId)"
                  :disabled="!canUpgrade(powerId)"
                  class="w-full btn-primary text-xs py-1"
                  :class="{ 'opacity-50 cursor-not-allowed': !canUpgrade(powerId) }"
                >
                  升级
                </button>
              </div>
              <div v-else class="mt-3 text-center text-xs text-gold-600 font-medium">
                已满级
              </div>
            </div>

            <!-- 未获得状态 -->
            <div v-else class="text-center py-4">
              <div class="text-gray-400 text-sm mb-2">通过探险获得</div>
              <div class="text-xs text-gray-500 space-y-1">
                <div v-if="power.effects.health">
                  生命值: +{{ power.effects.health }}/级
                </div>
                <div v-if="power.effects.divineStrength">
                  神力: +{{ power.effects.divineStrength }}/级
                </div>
                <div v-if="power.effects.physicalDefense">
                  物抗: +{{ power.effects.physicalDefense }}/级
                </div>
                <div v-if="power.effects.magicalDefense">
                  法抗: +{{ power.effects.magicalDefense }}/级
                </div>
              </div>
            </div>

            <!-- 未获得遮罩 -->
            <div v-if="!characterStore.hasDivinePower(powerId)" 
                 class="absolute inset-0 bg-gray-200 bg-opacity-75 rounded-lg flex items-center justify-center">
              <div class="text-gray-500 font-medium">未获得</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DIVINE_POWERS, DivinePowerQuality } from '~/utils/constants'

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

// 关闭对话框
function closeDialog() {
  emit('update:show', false)
}

// 获取神通等级
function getDivinePowerLevel(powerId: string): number {
  return characterStore.getDivinePowerLevel(powerId)
}

// 获取升级消耗
function getUpgradeCost(powerId: string): number {
  return characterStore.getDivinePowerUpgradeCost(powerId)
}

// 检查是否可以升级
function canUpgrade(powerId: string): boolean {
  const cost = getUpgradeCost(powerId)
  const crystals = characterStore.character?.resources.spiritCrystals || 0
  const currentLevel = getDivinePowerLevel(powerId)
  const power = DIVINE_POWERS[powerId]
  
  return crystals >= cost && currentLevel < power.maxLevel
}

// 升级神通
function upgradeDivinePower(powerId: string) {
  if (canUpgrade(powerId)) {
    characterStore.upgradeDivinePower(powerId)
  }
}

// 获取神通卡片样式
function getDivinePowerCardClass(powerId: string): string {
  if (!characterStore.hasDivinePower(powerId)) {
    return 'opacity-75'
  }
  return ''
}

// 获取品质样式类
function getQualityClass(quality: DivinePowerQuality): string {
  switch (quality) {
    case DivinePowerQuality.COMMON:
      return 'bg-gray-100 text-gray-700'
    case DivinePowerQuality.RARE:
      return 'bg-blue-100 text-blue-700'
    case DivinePowerQuality.EPIC:
      return 'bg-purple-100 text-purple-700'
    case DivinePowerQuality.LEGENDARY:
      return 'bg-gold-100 text-gold-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

// 获取品质名称
function getQualityName(quality: DivinePowerQuality): string {
  switch (quality) {
    case DivinePowerQuality.COMMON:
      return '普通'
    case DivinePowerQuality.RARE:
      return '稀有'
    case DivinePowerQuality.EPIC:
      return '史诗'
    case DivinePowerQuality.LEGENDARY:
      return '传说'
    default:
      return '普通'
  }
}
</script>
