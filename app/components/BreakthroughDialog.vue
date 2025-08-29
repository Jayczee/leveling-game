<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="closeDialog"
  >
    <div class="bg-paper-100 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <!-- 对话框头部 -->
      <div class="flex justify-between items-center p-4 border-b border-ink-300">
        <div class="flex items-center space-x-3">
          <h2 class="text-xl font-serif font-semibold text-ink-800">
            {{ cultivationType === 'qi' ? '练气' : '炼体' }}境界突破
          </h2>
          <div class="flex items-center space-x-2 text-sm text-ink-600">
            <span>{{ currentRealmName }} → {{ nextRealmName }}</span>
          </div>
        </div>
        <button
          @click="closeDialog"
          class="text-ink-600 hover:text-ink-800 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <!-- 突破信息内容 -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
        <!-- 当前境界信息 -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-ink-800 mb-3">当前境界</h3>
          <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <div class="flex justify-between items-center">
              <span class="font-medium text-blue-800">{{ currentRealmName }}</span>
              <span class="text-blue-600">{{ currentLevelName }}</span>
            </div>
          </div>
        </div>

        <!-- 下一境界信息 -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-ink-800 mb-3">目标境界</h3>
          <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
            <div class="flex justify-between items-center">
              <span class="font-medium text-green-800">{{ nextRealmName }}</span>
              <span class="text-green-600">{{ nextLevelName }}</span>
            </div>
          </div>
        </div>

        <!-- 突破成功率 -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-ink-800 mb-3">突破成功率</h3>
          <div class="bg-yellow-50 p-4 rounded-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="font-medium text-yellow-800">预期成功率</span>
              <span class="text-xl font-bold" :class="getSuccessRateColor(successRate?.finalRate || 0)">
                {{ (successRate?.finalRate || 0).toFixed(1) }}%
              </span>
            </div>
            <div v-if="successRate?.breakdown" class="text-sm text-yellow-700 space-y-1">
              <div v-for="line in successRate.breakdown" :key="line">{{ line }}</div>
            </div>
          </div>
        </div>

        <!-- 突破条件 -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-ink-800 mb-3">突破条件</h3>
          
          <!-- 必要条件 -->
          <div class="mb-4">
            <h4 class="font-medium text-ink-700 mb-2 flex items-center">
              <span class="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              必要条件
            </h4>
            <div class="bg-red-50 p-4 rounded-lg space-y-2">
              <div v-if="conditions?.details.required.length" class="text-sm">
                <div 
                  v-for="detail in conditions.details.required" 
                  :key="detail"
                  :class="detail.startsWith('✓') ? 'text-green-700' : 'text-red-700'"
                >
                  {{ detail }}
                </div>
              </div>
              <div v-else class="text-sm text-red-700">
                暂无必要条件
              </div>
            </div>
          </div>

          <!-- 可选条件 -->
          <div v-if="conditions?.details.optional.length">
            <h4 class="font-medium text-ink-700 mb-2 flex items-center">
              <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              可选条件（提升成功率）
            </h4>
            <div class="bg-blue-50 p-4 rounded-lg space-y-2">
              <div class="text-sm">
                <div 
                  v-for="detail in conditions.details.optional" 
                  :key="detail"
                  :class="detail.startsWith('✓') ? 'text-green-700' : 'text-blue-700'"
                >
                  {{ detail }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 突破尝试统计 -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-ink-800 mb-3">突破统计</h3>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="text-center">
                <div class="font-medium text-gray-800">总尝试次数</div>
                <div class="text-xl font-bold text-gray-700">
                  {{ characterStore.character?.stats.breakthroughAttempts || 0 }}
                </div>
              </div>
              <div class="text-center">
                <div class="font-medium text-gray-800">成功次数</div>
                <div class="text-xl font-bold text-green-600">
                  {{ characterStore.character?.stats.successfulBreakthroughs || 0 }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end space-x-3">
          <button
            @click="closeDialog"
            class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            @click="attemptBreakthrough"
            :disabled="!canAttemptBreakthrough"
            class="px-6 py-2 rounded-md font-medium transition-colors"
            :class="canAttemptBreakthrough 
              ? 'bg-gold-600 text-white hover:bg-gold-700' 
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'"
          >
            <span v-if="isAttempting">突破中...</span>
            <span v-else>开始突破</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useCharacterStore } from '~/stores/character'

interface Props {
  show: boolean
  cultivationType: 'qi' | 'body'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  success: [result: any]
  failure: [result: any]
}>()

const characterStore = useCharacterStore()
const isAttempting = ref(false)
const hasSucceeded = ref(false)

// 监听弹窗显示状态，重置成功标记
watch(() => props.show, (newShow) => {
  if (newShow) {
    hasSucceeded.value = false
  }
})

// 计算属性
const config = computed(() => {
  return props.cultivationType === 'qi' 
    ? characterStore.qiRealmBreakthroughConfig 
    : characterStore.bodyRealmBreakthroughConfig
})

const conditions = computed(() => {
  return props.cultivationType === 'qi'
    ? characterStore.qiBreakthroughConditions
    : characterStore.bodyBreakthroughConditions
})

const successRate = computed(() => {
  return props.cultivationType === 'qi'
    ? characterStore.qiBreakthroughSuccessRate
    : characterStore.bodyBreakthroughSuccessRate
})

const currentLevelInfo = computed(() => {
  return props.cultivationType === 'qi'
    ? characterStore.currentQiLevelInfo
    : characterStore.currentBodyLevelInfo
})

const canAttemptBreakthrough = computed(() => {
  return conditions.value?.canBreakthrough && !isAttempting.value && !hasSucceeded.value
})

// 显示名称
const currentRealmName = computed(() => {
  return currentLevelInfo.value?.realm?.name || '未知境界'
})

const currentLevelName = computed(() => {
  return currentLevelInfo.value?.levelInfo?.name || '未知等级'
})

const nextRealmName = computed(() => {
  const realmNames: Record<string, string> = {
    qi_refining: '炼气期',
    foundation_building: '筑基期',
    golden_core: '金丹期',
    nascent_soul: '元婴期',
    soul_transformation: '化神期',
    void_refinement: '炼虚期',
    unity_dao: '合道期',
    body_forging: '锻体期',
    bone_refining: '炼骨期',
    blood_transformation: '换血期',
    muscle_transformation: '易筋期',
    marrow_cleansing: '洗髓期',
    divine_body: '神体期',
    immortal_body: '仙体期'
  }
  return realmNames[config.value?.toRealmId || ''] || '未知境界'
})

const nextLevelName = computed(() => {
  // 下一境界的第一级
  const realmFirstLevelNames: Record<string, string> = {
    qi_refining: '炼气一层',
    foundation_building: '筑基一层',
    golden_core: '金丹一层',
    nascent_soul: '元婴一层',
    soul_transformation: '化神一层',
    void_refinement: '炼虚一层',
    unity_dao: '合道一层',
    body_forging: '锻体一层',
    bone_refining: '炼骨一层',
    blood_transformation: '换血一层',
    muscle_transformation: '易筋一层',
    marrow_cleansing: '洗髓一层',
    divine_body: '神体一层',
    immortal_body: '仙体一层'
  }
  return realmFirstLevelNames[config.value?.toRealmId || ''] || '未知等级'
})

// 方法
const closeDialog = () => {
  emit('close')
}

const getSuccessRateColor = (rate: number) => {
  if (rate >= 80) return 'text-green-600'
  if (rate >= 60) return 'text-yellow-600'
  if (rate >= 40) return 'text-orange-600'
  return 'text-red-600'
}

const attemptBreakthrough = async () => {
  if (!canAttemptBreakthrough.value) return

  isAttempting.value = true

  try {
    // 添加一些视觉延迟以增加仪式感
    await new Promise(resolve => setTimeout(resolve, 1000))

    const result = props.cultivationType === 'qi'
      ? characterStore.attemptQiRealmBreakthrough()
      : characterStore.attemptBodyRealmBreakthrough()

    if (result) {
      if (result.success) {
        hasSucceeded.value = true // 标记为已成功，防止重复点击
        emit('success', result)
        // 突破成功后立即关闭弹窗，防止重复点击
        closeDialog()
      } else {
        emit('failure', result)
        // 突破失败后延迟关闭弹窗，让用户看到失败信息
        setTimeout(() => {
          closeDialog()
        }, 2000)
      }
    }
  } finally {
    // 确保在关闭弹窗前重置状态
    setTimeout(() => {
      isAttempting.value = false
    }, 100)
  }
}
</script>

<style scoped>
/* 添加一些自定义样式 */
.card {
  @apply bg-white border border-gray-200 rounded-lg shadow-sm;
}
</style>