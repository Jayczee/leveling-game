<template>
  <div class="min-h-screen flex items-center justify-center p-4 safe-area-inset-top safe-area-inset-bottom">
    <div class="max-w-2xl w-full">
      <!-- 标题 -->
      <div class="text-center mb-6 md:mb-8 fade-in">
        <h1 class="text-3xl md:text-4xl font-serif font-bold text-ink-800 mb-2">
          创建角色
        </h1>
        <p class="text-ink-600 text-sm md:text-base">
          踏上修仙之路的第一步
        </p>
      </div>

      <!-- 创建表单 -->
      <div class="card ink-border fade-in">
        <form @submit.prevent="createCharacter" class="space-y-4 md:space-y-6">
          <!-- 角色名称 -->
          <div>
            <label class="block text-ink-700 font-serif font-medium mb-2 text-sm md:text-base">
              道号
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="请输入你的道号"
              class="input-field w-full"
              maxlength="20"
              required
            />
            <p class="text-xs md:text-sm text-ink-500 mt-1">
              {{ form.name.length }}/20 字符
            </p>
          </div>

          <!-- 性别选择 -->
          <div>
            <label class="block text-ink-700 font-serif font-medium mb-2 text-sm md:text-base">
              性别
            </label>
            <div class="flex space-x-6 md:space-x-4">
              <label class="flex items-center cursor-pointer">
                <input
                  v-model="form.gender"
                  type="radio"
                  value="male"
                  class="mr-2 w-4 h-4"
                />
                <span class="text-ink-700 text-sm md:text-base">男</span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input
                  v-model="form.gender"
                  type="radio"
                  value="female"
                  class="mr-2 w-4 h-4"
                />
                <span class="text-ink-700 text-sm md:text-base">女</span>
              </label>
            </div>
          </div>

          <!-- 天赋选择 -->
          <div>
            <label class="block text-ink-700 font-serif font-medium mb-2 text-sm md:text-base">
              天赋
            </label>
            <div class="grid grid-cols-1 gap-2 md:gap-3">
              <label
                v-for="(talent, key) in TALENTS"
                :key="key"
                class="flex items-start p-3 border border-ink-300 rounded-lg cursor-pointer hover:bg-paper-100 transition-colors"
                :class="{ 'bg-ink-100 border-ink-500': form.talent === key }"
              >
                <input
                  v-model="form.talent"
                  type="radio"
                  :value="key"
                  class="mt-1 mr-3 w-4 h-4"
                />
                <div class="flex-1">
                  <h4 class="font-serif font-medium text-ink-800 text-sm md:text-base">
                    {{ talent.name }}
                  </h4>
                  <p class="text-xs md:text-sm text-ink-600 mt-1">
                    {{ talent.description }}
                  </p>
                </div>
              </label>
            </div>
          </div>

          <!-- 属性分配 -->
          <div>
            <label class="block text-ink-700 font-serif font-medium mb-2 text-sm md:text-base">
              属性分配
            </label>
            <p class="text-xs md:text-sm text-ink-600 mb-3 md:mb-4">
              剩余点数：<span class="font-medium text-gold-600">{{ remainingPoints }}</span>
            </p>

            <div class="space-y-3 md:space-y-4">
              <!-- 体质 -->
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-ink-800 text-sm md:text-base">体质</h4>
                  <p class="text-xs md:text-sm text-ink-600">影响生命力和炼体效率</p>
                </div>
                <div class="flex items-center space-x-2 md:space-x-3 ml-4">
                  <button
                    type="button"
                    @click="adjustAttribute('constitution', -1)"
                    :disabled="form.attributes.constitution <= 1"
                    class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-ink-200 hover:bg-ink-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    -
                  </button>
                  <span class="w-8 md:w-10 text-center font-medium text-sm md:text-base">
                    {{ form.attributes.constitution }}
                  </span>
                  <button
                    type="button"
                    @click="adjustAttribute('constitution', 1)"
                    :disabled="remainingPoints <= 0"
                    class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-ink-200 hover:bg-ink-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- 灵力 -->
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-ink-800 text-sm md:text-base">灵力</h4>
                  <p class="text-xs md:text-sm text-ink-600">影响法术威力和练气效率</p>
                </div>
                <div class="flex items-center space-x-2 md:space-x-3 ml-4">
                  <button
                    type="button"
                    @click="adjustAttribute('spiritualPower', -1)"
                    :disabled="form.attributes.spiritualPower <= 1"
                    class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-ink-200 hover:bg-ink-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    -
                  </button>
                  <span class="w-8 md:w-10 text-center font-medium text-sm md:text-base">
                    {{ form.attributes.spiritualPower }}
                  </span>
                  <button
                    type="button"
                    @click="adjustAttribute('spiritualPower', 1)"
                    :disabled="remainingPoints <= 0"
                    class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-ink-200 hover:bg-ink-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- 悟性 -->
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-ink-800 text-sm md:text-base">悟性</h4>
                  <p class="text-xs md:text-sm text-ink-600">影响突破成功率和学习速度</p>
                </div>
                <div class="flex items-center space-x-2 md:space-x-3 ml-4">
                  <button
                    type="button"
                    @click="adjustAttribute('comprehension', -1)"
                    :disabled="form.attributes.comprehension <= 1"
                    class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-ink-200 hover:bg-ink-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    -
                  </button>
                  <span class="w-8 md:w-10 text-center font-medium text-sm md:text-base">
                    {{ form.attributes.comprehension }}
                  </span>
                  <button
                    type="button"
                    @click="adjustAttribute('comprehension', 1)"
                    :disabled="remainingPoints <= 0"
                    class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-ink-200 hover:bg-ink-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 按钮组 -->
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              type="button"
              @click="goBack"
              class="btn-secondary flex-1 order-2 sm:order-1"
            >
              返回
            </button>
            <button
              type="submit"
              :disabled="!canCreate"
              class="btn-primary flex-1 order-1 sm:order-2"
              :class="{ 'opacity-50 cursor-not-allowed': !canCreate }"
            >
              开始修仙
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TALENTS, GAME_CONFIG } from '~/utils/constants'

// 页面元数据
definePageMeta({
  title: '创建角色 - 修仙挂机'
})

// 表单数据
const form = reactive({
  name: '',
  gender: 'male' as 'male' | 'female',
  talent: 'SPIRITUAL_ROOT' as keyof typeof TALENTS,
  attributes: {
    constitution: 3,
    spiritualPower: 4,
    comprehension: 3
  }
})

// 计算属性
const totalUsedPoints = computed(() => {
  return form.attributes.constitution + form.attributes.spiritualPower + form.attributes.comprehension
})

const remainingPoints = computed(() => {
  return GAME_CONFIG.INITIAL_ATTRIBUTE_POINTS - totalUsedPoints.value
})

const canCreate = computed(() => {
  return form.name.trim().length > 0 && remainingPoints.value === 0
})

// 调整属性
function adjustAttribute(attr: keyof typeof form.attributes, delta: number) {
  const newValue = form.attributes[attr] + delta
  if (newValue >= 1 && (delta < 0 || remainingPoints.value > 0)) {
    form.attributes[attr] = newValue
  }
}

// 创建角色
function createCharacter() {
  if (!canCreate.value) return

  const characterStore = useCharacterStore()
  const saveStore = useSaveStore()

  // 创建角色
  characterStore.createCharacter({
    name: form.name.trim(),
    gender: form.gender,
    talent: form.talent,
    attributes: { ...form.attributes }
  })

  // 创建存档
  if (characterStore.character) {
    saveStore.createSave(characterStore.character)
    navigateTo('/game')
  }
}

// 返回首页
function goBack() {
  navigateTo('/')
}
</script>
