<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="closeDialog"
  >
    <div class="bg-paper-100 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <!-- 对话框头部 -->
      <div class="flex justify-between items-center p-4 border-b border-ink-300">
        <h2 class="text-xl font-serif font-semibold text-ink-800">悟道系统</h2>
        <button
          @click="closeDialog"
          class="text-ink-600 hover:text-ink-800 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <!-- 悟道路径列表 -->
      <div class="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 金之道 -->
          <div class="card p-4">
            <div class="flex items-center mb-3">
              <span class="text-2xl mr-3">⚔️</span>
              <div>
                <h3 class="font-serif font-semibold text-ink-800">金之道</h3>
                <p class="text-sm text-ink-600">金主坚固，增强物理防御</p>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span>等级：</span>
                <span class="font-medium">{{ metalPath.level }}/100</span>
              </div>
              <div class="flex justify-between text-sm">
                <span>经验：</span>
                <span class="font-medium">{{ metalPath.experience }}/10</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${(metalPath.experience / 10) * 100}%` }"
                ></div>
              </div>
              <div class="text-xs text-ink-500">
                <p>物理防御 +{{ (metalPath.level * 0.5).toFixed(1) }}%</p>
                <p>法力值 +{{ metalPath.level * 5 }}</p>
              </div>
            </div>
          </div>

          <!-- 木之道 -->
          <div class="card p-4">
            <div class="flex items-center mb-3">
              <span class="text-2xl mr-3">🌳</span>
              <div>
                <h3 class="font-serif font-semibold text-ink-800">木之道</h3>
                <p class="text-sm text-ink-600">木主生机，增强生命力</p>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span>等级：</span>
                <span class="font-medium">{{ woodPath.level }}/100</span>
              </div>
              <div class="flex justify-between text-sm">
                <span>经验：</span>
                <span class="font-medium">{{ woodPath.experience }}/10</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-green-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${(woodPath.experience / 10) * 100}%` }"
                ></div>
              </div>
              <div class="text-xs text-ink-500">
                <p>生命值 +{{ (woodPath.level * 0.5).toFixed(1) }}%</p>
                <p>法力值 +{{ woodPath.level * 5 }}</p>
              </div>
            </div>
          </div>

          <!-- 水之道 -->
          <div class="card p-4">
            <div class="flex items-center mb-3">
              <span class="text-2xl mr-3">💧</span>
              <div>
                <h3 class="font-serif font-semibold text-ink-800">水之道</h3>
                <p class="text-sm text-ink-600">水主柔韧，增强法术防御</p>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span>等级：</span>
                <span class="font-medium">{{ waterPath.level }}/100</span>
              </div>
              <div class="flex justify-between text-sm">
                <span>经验：</span>
                <span class="font-medium">{{ waterPath.experience }}/10</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${(waterPath.experience / 10) * 100}%` }"
                ></div>
              </div>
              <div class="text-xs text-ink-500">
                <p>法术防御 +{{ (waterPath.level * 0.5).toFixed(1) }}%</p>
                <p>法力值 +{{ waterPath.level * 5 }}</p>
              </div>
            </div>
          </div>

          <!-- 火之道 -->
          <div class="card p-4">
            <div class="flex items-center mb-3">
              <span class="text-2xl mr-3">🔥</span>
              <div>
                <h3 class="font-serif font-semibold text-ink-800">火之道</h3>
                <p class="text-sm text-ink-600">火主炽热，增强法力</p>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span>等级：</span>
                <span class="font-medium">{{ firePath.level }}/100</span>
              </div>
              <div class="flex justify-between text-sm">
                <span>经验：</span>
                <span class="font-medium">{{ firePath.experience }}/10</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-red-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${(firePath.experience / 10) * 100}%` }"
                ></div>
              </div>
              <div class="text-xs text-ink-500">
                <p>法力值 +{{ firePath.level * 5 }}</p>
              </div>
            </div>
          </div>

          <!-- 土之道 -->
          <div class="card p-4">
            <div class="flex items-center mb-3">
              <span class="text-2xl mr-3">🏔️</span>
              <div>
                <h3 class="font-serif font-semibold text-ink-800">土之道</h3>
                <p class="text-sm text-ink-600">土主厚重，增强神力</p>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span>等级：</span>
                <span class="font-medium">{{ earthPath.level }}/100</span>
              </div>
              <div class="flex justify-between text-sm">
                <span>经验：</span>
                <span class="font-medium">{{ earthPath.experience }}/10</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-amber-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${(earthPath.experience / 10) * 100}%` }"
                ></div>
              </div>
              <div class="text-xs text-ink-500">
                <p>神力 +{{ (earthPath.level * 0.5).toFixed(1) }}%</p>
                <p>法力值 +{{ earthPath.level * 5 }}</p>
              </div>
            </div>
          </div>

          <!-- 时间之道 -->
          <div class="card p-4">
            <div class="flex items-center mb-3">
              <span class="text-2xl mr-3">⏰</span>
              <div>
                <h3 class="font-serif font-semibold text-ink-800">时间之道</h3>
                <p class="text-sm text-ink-600">时间主流转，提升修炼效率</p>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span>等级：</span>
                <span class="font-medium">{{ timePath.level }}/100</span>
              </div>
              <div class="flex justify-between text-sm">
                <span>经验：</span>
                <span class="font-medium">{{ timePath.experience }}/10</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${(timePath.experience / 10) * 100}%` }"
                ></div>
              </div>
              <div class="text-xs text-ink-500">
                <p>修炼效率 +{{ (timePath.level * 0.5).toFixed(1) }}%</p>
                <p>法力值 +{{ timePath.level * 5 }}</p>
              </div>
            </div>
          </div>

          <!-- 空间之道 -->
          <div class="card p-4">
            <div class="flex items-center mb-3">
              <span class="text-2xl mr-3">🌌</span>
              <div>
                <h3 class="font-serif font-semibold text-ink-800">空间之道</h3>
                <p class="text-sm text-ink-600">空间主距离，减少探险时间</p>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span>等级：</span>
                <span class="font-medium">{{ spacePath.level }}/100</span>
              </div>
              <div class="flex justify-between text-sm">
                <span>经验：</span>
                <span class="font-medium">{{ spacePath.experience }}/10</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${(spacePath.experience / 10) * 100}%` }"
                ></div>
              </div>
              <div class="text-xs text-ink-500">
                <p>探险时间 -{{ (spacePath.level * 0.5).toFixed(1) }}%</p>
                <p>法力值 +{{ spacePath.level * 5 }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

// 计算属性 - 获取各道的数据
const metalPath = computed(() => characterStore.character?.enlightenment?.paths?.metal || { level: 0, experience: 0 })
const woodPath = computed(() => characterStore.character?.enlightenment?.paths?.wood || { level: 0, experience: 0 })
const waterPath = computed(() => characterStore.character?.enlightenment?.paths?.water || { level: 0, experience: 0 })
const firePath = computed(() => characterStore.character?.enlightenment?.paths?.fire || { level: 0, experience: 0 })
const earthPath = computed(() => characterStore.character?.enlightenment?.paths?.earth || { level: 0, experience: 0 })
const timePath = computed(() => characterStore.character?.enlightenment?.paths?.time || { level: 0, experience: 0 })
const spacePath = computed(() => characterStore.character?.enlightenment?.paths?.space || { level: 0, experience: 0 })

// 关闭对话框
function closeDialog() {
  emit('update:show', false)
}
</script>
