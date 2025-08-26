<template>
  <div class="create-character-page">
    <!-- 背景装饰 -->
    <div class="page-background">
      <div class="bg-gradient"></div>
      <div class="paper-texture-overlay"></div>
      <div class="decorative-elements">
        <div class="decoration decoration-1"></div>
        <div class="decoration decoration-2"></div>
        <div class="decoration decoration-3"></div>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="page-container">
      <div class="content-wrapper">
        <!-- 页面标题 -->
        <header class="page-header">
          <div class="title-container">
            <h1 class="page-title">
              创建角色
              <div class="title-decoration"></div>
            </h1>
            <p class="page-subtitle">踏上修仙之路的第一步</p>
            <div class="loading-dots">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
        </header>



        <!-- 创建表单 -->
        <main class="form-main">
          <div class="form-container">
            <form @submit.prevent="createCharacter" class="character-form">
              <!-- 道号输入 -->
              <div class="form-field">
                <div class="field-header">
                  <label class="field-label">
                    <span class="label-icon">📜</span>
                    <span class="label-text">道号</span>
                  </label>
                </div>
                
                <div class="input-container">
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="请输入你的道号"
                    class="form-input"
                    :class="{ 'error': formErrors.name }"
                    maxlength="20"
                    required
                    @blur="validateForm"
                  />
                  <div class="input-counter">{{ form.name.length }}/20</div>
                </div>
                
                <div class="field-feedback">
                  <p v-if="formErrors.name" class="feedback-error">
                    {{ formErrors.name }}
                  </p>
                  <p v-else class="feedback-hint">
                    道号将伴随你的整个修仙之路
                  </p>
                </div>
              </div>

              <!-- 性别选择 -->
              <div class="form-field">
                <div class="field-header">
                  <label class="field-label">
                    <span class="label-icon">⚊</span>
                    <span class="label-text">性别</span>
                  </label>
                </div>
                
                <div class="gender-selection">
                  <label class="gender-option" :class="{ 'selected': form.gender === 'male' }">
                    <input
                      v-model="form.gender"
                      type="radio"
                      value="male"
                      class="sr-only"
                    />
                    <div class="option-card">
                      <div class="option-icon">👨</div>
                      <span class="option-text">男</span>
                    </div>
                  </label>
                  
                  <label class="gender-option" :class="{ 'selected': form.gender === 'female' }">
                    <input
                      v-model="form.gender"
                      type="radio"
                      value="female"
                      class="sr-only"
                    />
                    <div class="option-card">
                      <div class="option-icon">👩</div>
                      <span class="option-text">女</span>
                    </div>
                  </label>
                </div>
              </div>

              <!-- 修炼方向 -->
              <div class="form-field">
                <div class="field-header">
                  <label class="field-label">
                    <span class="label-icon">🌟</span>
                    <span class="label-text">修炼方向</span>
                  </label>
                </div>
                
                <div class="cultivation-selection">
                  <label
                    v-for="(path, key) in CULTIVATION_PATHS"
                    :key="key"
                    class="cultivation-option"
                    :class="{ 'selected': form.cultivationPath === key }"
                  >
                    <input
                      v-model="form.cultivationPath"
                      type="radio"
                      :value="key"
                      class="sr-only"
                    />
                    <div class="cultivation-card">
                      <div class="card-header">
                        <div class="cultivation-info">
                          <span class="cultivation-icon">{{ getCultivationIcon(key) }}</span>
                          <h4 class="cultivation-name">{{ path.name }}</h4>
                        </div>
                        <div class="selection-indicator">
                          <div class="selection-dot"></div>
                        </div>
                      </div>
                      
                      <p class="cultivation-desc">{{ path.description }}</p>
                      
                      <div class="cultivation-stats">
                        <div class="stat-item">
                          <span class="stat-label">灵气效率</span>
                          <span class="stat-value" :class="getEfficiencyClass(path.effects.spiritualQiEfficiency)">
                            {{ (path.effects.spiritualQiEfficiency * 100).toFixed(0) }}%
                          </span>
                        </div>
                        <div class="stat-item">
                          <span class="stat-label">体质成长</span>
                          <span class="stat-value" :class="getEfficiencyClass(path.effects.constitutionGrowthRate)">
                            {{ (path.effects.constitutionGrowthRate * 100).toFixed(0) }}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- 天赋选择 -->
              <div class="form-field">
                <div class="field-header">
                  <label class="field-label">
                    <span class="label-icon">✨</span>
                    <span class="label-text">天赋</span>
                  </label>
                </div>
                
                <div class="talent-selection">
                  <label
                    v-for="(talent, key) in TALENTS"
                    :key="key"
                    class="talent-option"
                    :class="{ 'selected': form.talent === key }"
                  >
                    <input
                      v-model="form.talent"
                      type="radio"
                      :value="key"
                      class="sr-only"
                    />
                    <div class="talent-card">
                      <div class="card-header">
                        <div class="talent-info">
                          <span class="talent-icon">{{ getTalentIcon(key) }}</span>
                          <h4 class="talent-name">{{ talent.name }}</h4>
                        </div>
                        <div class="selection-indicator">
                          <div class="selection-dot"></div>
                        </div>
                      </div>
                      <p class="talent-desc">{{ talent.description }}</p>
                    </div>
                  </label>
                </div>
              </div>

              <!-- 属性分配 -->
              <div class="form-field">
                <div class="field-header">
                  <label class="field-label">
                    <span class="label-icon">⚡</span>
                    <span class="label-text">属性分配</span>
                  </label>
                </div>
                
                <div class="attribute-points" :class="{ 'error': formErrors.attributes }">
                  <div class="points-display">
                    <span class="points-label">剩余点数</span>
                    <span class="points-value">{{ remainingPoints }}</span>
                  </div>
                </div>
                
                <div v-if="formErrors.attributes" class="field-feedback">
                  <p class="feedback-error">{{ formErrors.attributes }}</p>
                </div>

                <div class="attributes-list">
                  <!-- 体质 -->
                  <div class="attribute-item">
                    <div class="attribute-info">
                      <div class="attribute-header">
                        <span class="attribute-icon">💪</span>
                        <h4 class="attribute-name">体质</h4>
                      </div>
                      <p class="attribute-desc">影响生命力和炼体效率</p>
                    </div>
                    <div class="attribute-controls">
                      <button
                        type="button"
                        @click="adjustAttribute('constitution', -1)"
                        :disabled="form.attributes.constitution <= 1"
                        class="control-btn decrease"
                        :class="{ 'disabled': form.attributes.constitution <= 1 }"
                      >
                        <span>−</span>
                      </button>
                      <div class="attribute-value">
                        {{ form.attributes.constitution }}
                      </div>
                      <button
                        type="button"
                        @click="adjustAttribute('constitution', 1)"
                        :disabled="remainingPoints <= 0"
                        class="control-btn increase"
                        :class="{ 'disabled': remainingPoints <= 0 }"
                      >
                        <span>+</span>
                      </button>
                    </div>
                  </div>

                  <!-- 灵力 -->
                  <div class="attribute-item">
                    <div class="attribute-info">
                      <div class="attribute-header">
                        <span class="attribute-icon">🔮</span>
                        <h4 class="attribute-name">灵力</h4>
                      </div>
                      <p class="attribute-desc">影响法术威力和练气效率</p>
                    </div>
                    <div class="attribute-controls">
                      <button
                        type="button"
                        @click="adjustAttribute('spiritualPower', -1)"
                        :disabled="form.attributes.spiritualPower <= 1"
                        class="control-btn decrease"
                        :class="{ 'disabled': form.attributes.spiritualPower <= 1 }"
                      >
                        <span>−</span>
                      </button>
                      <div class="attribute-value">
                        {{ form.attributes.spiritualPower }}
                      </div>
                      <button
                        type="button"
                        @click="adjustAttribute('spiritualPower', 1)"
                        :disabled="remainingPoints <= 0"
                        class="control-btn increase"
                        :class="{ 'disabled': remainingPoints <= 0 }"
                      >
                        <span>+</span>
                      </button>
                    </div>
                  </div>

                  <!-- 悟性 -->
                  <div class="attribute-item">
                    <div class="attribute-info">
                      <div class="attribute-header">
                        <span class="attribute-icon">🧠</span>
                        <h4 class="attribute-name">悟性</h4>
                      </div>
                      <p class="attribute-desc">影响突破成功率和学习速度</p>
                    </div>
                    <div class="attribute-controls">
                      <button
                        type="button"
                        @click="adjustAttribute('comprehension', -1)"
                        :disabled="form.attributes.comprehension <= 1"
                        class="control-btn decrease"
                        :class="{ 'disabled': form.attributes.comprehension <= 1 }"
                      >
                        <span>−</span>
                      </button>
                      <div class="attribute-value">
                        {{ form.attributes.comprehension }}
                      </div>
                      <button
                        type="button"
                        @click="adjustAttribute('comprehension', 1)"
                        :disabled="remainingPoints <= 0"
                        class="control-btn increase"
                        :class="{ 'disabled': remainingPoints <= 0 }"
                      >
                        <span>+</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="form-actions">
                <button
                  type="button"
                  @click="goBack"
                  class="action-button secondary"
                >
                  <span class="button-icon">↩️</span>
                  <span class="button-text">返回</span>
                </button>
                
                <button
                  type="submit"
                  :disabled="!canCreate"
                  class="action-button primary"
                  :class="{ 
                    'disabled': !canCreate,
                    'loading': isCreating,
                    'success': showSuccess
                  }"
                >
                  <span v-if="isCreating" class="button-icon loading">⏳</span>
                  <span v-else-if="showSuccess" class="button-icon">✅</span>
                  <span v-else class="button-icon">🚀</span>
                  
                  <span class="button-text">
                    <span v-if="isCreating">创建中...</span>
                    <span v-else-if="showSuccess">创建成功！</span>
                    <span v-else>开始修仙</span>
                  </span>
                  
                  <div v-if="!canCreate && !isCreating" class="button-tooltip">
                    {{ remainingPoints > 0 ? '请分配完所有属性点' : '请输入道号' }}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CULTIVATION_PATHS, TALENTS } from '~/utils/constants'

// 表单数据
const form = reactive({
  name: '',
  gender: 'male' as 'male' | 'female',
  cultivationPath: 'QI_CULTIVATION' as keyof typeof CULTIVATION_PATHS,
  talent: 'SPIRITUAL_ROOT' as keyof typeof TALENTS,
  attributes: {
    constitution: 10,
    spiritualPower: 10,
    comprehension: 5
  }
})

// 状态管理
const isCreating = ref(false)
const showSuccess = ref(false)
const formErrors = reactive({
  name: '',
  attributes: ''
})

// 计算属性
const remainingPoints = computed(() => {
  const totalUsed = form.attributes.constitution + form.attributes.spiritualPower + form.attributes.comprehension
  return 30 - totalUsed
})

const canCreate = computed(() => {
  return form.name.trim().length > 0 && remainingPoints.value === 0 && !isCreating.value
})

// 表单验证
const isFormValid = computed(() => {
  validateForm()
  return !formErrors.name && !formErrors.attributes
})



// 调整属性
function adjustAttribute(attr: keyof typeof form.attributes, delta: number) {
  const newValue = form.attributes[attr] + delta
  if (newValue >= 1 && (delta < 0 || remainingPoints.value > 0)) {
    form.attributes[attr] = newValue
    validateForm()
  }
}

// 表单验证
function validateForm() {
  formErrors.name = ''
  formErrors.attributes = ''

  if (!form.name.trim()) {
    formErrors.name = '请输入道号'
  } else if (form.name.trim().length < 2) {
    formErrors.name = '道号至少需要2个字符'
  } else if (form.name.trim().length > 20) {
    formErrors.name = '道号不能超过20个字符'
  }

  if (remainingPoints.value > 0) {
    formErrors.attributes = `还有 ${remainingPoints.value} 点属性点未分配`
  }
}

// 创建角色
async function createCharacter() {
  if (!canCreate.value) return

  isCreating.value = true

  try {
    // 模拟创建过程
    await new Promise(resolve => setTimeout(resolve, 1500))

    const characterStore = useCharacterStore()
    const saveStore = useSaveStore()

    // 创建角色
    characterStore.createCharacter({
      name: form.name.trim(),
      gender: form.gender,
      cultivationPath: form.cultivationPath,
      talent: form.talent,
      attributes: { ...form.attributes }
    })

    // 创建存档
    if (characterStore.character) {
      saveStore.createSave(characterStore.character)
      showSuccess.value = true

      // 延迟跳转，让用户看到成功状态
      setTimeout(() => {
        navigateTo('/game')
      }, 1000)
    }
  } catch (error) {
    console.error('创建角色失败:', error)
  } finally {
    isCreating.value = false
  }
}

// 返回首页
function goBack() {
  navigateTo('/')
}

// 获取修炼方向图标
function getCultivationIcon(key: string) {
  const icons = {
    QI_CULTIVATION: '🌊',
    BODY_CULTIVATION: '⛰️',
    DUAL_CULTIVATION: '☯️'
  }
  return icons[key as keyof typeof icons] || '🌟'
}

// 获取天赋图标
function getTalentIcon(key: string) {
  const icons = {
    SPIRITUAL_ROOT: '🌱',
    IRON_BODY: '🛡️',
    WISE_MIND: '💡',
    LUCKY_STAR: '🍀'
  }
  return icons[key as keyof typeof icons] || '✨'
}

// 获取效率等级样式
function getEfficiencyClass(value: number) {
  if (value >= 1.5) return 'text-green-600 font-semibold'
  if (value >= 1.0) return 'text-blue-600 font-medium'
  if (value >= 0.5) return 'text-yellow-600'
  return 'text-red-600'
}
</script>

<style scoped>
/* ===========================================
   页面布局
   =========================================== */

.create-character-page {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.page-background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #fefefe 0%, #fdfcf8 25%, #faf8f0 75%, #f5f2e8 100%);
}

.paper-texture-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.6;
}

.decorative-elements {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.decoration {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  animation: float 6s ease-in-out infinite;
}

.decoration-1 {
  top: 10%;
  left: 10%;
  width: 8rem;
  height: 8rem;
  background: radial-gradient(circle, rgba(120, 119, 108, 0.2) 0%, transparent 70%);
}

.decoration-2 {
  bottom: 15%;
  right: 15%;
  width: 12rem;
  height: 12rem;
  background: radial-gradient(circle, rgba(217, 119, 6, 0.3) 0%, transparent 70%);
  animation-delay: -2s;
}

.decoration-3 {
  top: 50%;
  left: 20%;
  width: 6rem;
  height: 6rem;
  background: radial-gradient(circle, rgba(120, 119, 108, 0.15) 0%, transparent 70%);
  animation-delay: -4s;
}

.page-container {
  position: relative;
  z-index: 10;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.content-wrapper {
  width: 100%;
  max-width: 56rem;
  margin: 0 auto;
}

/* ===========================================
   页面标题样式
   =========================================== */

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeInUp 0.8s ease-out;
}

.title-container {
  position: relative;
}

.page-title {
  font-size: 3.5rem;
  font-family: serif;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1rem;
  position: relative;
}

.title-decoration {
  position: absolute;
  bottom: -0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 6rem;
  height: 0.25rem;
  background: linear-gradient(to right, transparent, #d97706, transparent);
  border-radius: 9999px;
}

.page-subtitle {
  color: #6b7280;
  font-size: 1.25rem;
  font-family: serif;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.dot {
  width: 0.5rem;
  height: 0.5rem;
  background-color: #d97706;
  border-radius: 50%;
  animation: bounce 1s infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.1s;
}

.dot:nth-child(3) {
  animation-delay: 0.2s;
}

/* ===========================================
   表单容器样式
   =========================================== */

.form-main {
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.form-container {
  position: relative;
  background: linear-gradient(135deg, rgba(253, 252, 248, 0.95) 0%, rgba(250, 248, 240, 0.95) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(206, 212, 218, 0.3);
  border-radius: 1.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 3rem;
}

.character-form {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* ===========================================
   表单字段通用样式
   =========================================== */

.form-field {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.field-label {
  display: flex;
  align-items: center;
  font-family: serif;
  font-weight: 600;
  font-size: 1.25rem;
  color: #374151;
}

.label-icon {
  font-size: 1.5rem;
  margin-right: 0.75rem;
}

.label-text {
  user-select: none;
}

/* ===========================================
   输入框和选择组件样式
   =========================================== */

.input-container {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 1rem;
  font-size: 1.125rem;
  font-family: serif;
  border: 2px solid #d1d5db;
  border-radius: 0.75rem;
  background-color: #f9fafb;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-input:focus {
  outline: none;
  border-color: #d97706;
  background-color: #fefbf3;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.form-input.error {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.form-input.error:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.input-counter {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.875rem;
  color: #9ca3af;
  font-weight: 500;
}

.field-feedback {
  margin-top: 0.5rem;
}

.feedback-error {
  font-size: 0.875rem;
  color: #dc2626;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.feedback-error::before {
  content: '⚠️';
  margin-right: 0.5rem;
}

.feedback-hint {
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
}

/* 性别选择 */
.gender-selection {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.gender-option {
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border: 2px solid #d1d5db;
  border-radius: 0.75rem;
  background-color: #f9fafb;
  transition: all 0.3s ease;
  min-height: 120px;
}

.option-card:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.gender-option.selected .option-card {
  border-color: #d97706;
  background-color: #fef3c7;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2);
}

.option-icon {
  font-size: 3rem;
  margin-bottom: 0.75rem;
}

.option-text {
  font-family: serif;
  font-weight: 600;
  font-size: 1.125rem;
  color: #1f2937;
}

/* 修炼方向和天赋选择 */
.cultivation-selection,
.talent-selection {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.talent-selection {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.cultivation-option,
.talent-option {
  cursor: pointer;
  transition: all 0.3s ease;
}

.cultivation-card,
.talent-card {
  padding: 1.5rem;
  border: 2px solid #d1d5db;
  border-radius: 0.75rem;
  background-color: #f9fafb;
  transition: all 0.3s ease;
}

.cultivation-card:hover,
.talent-card:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cultivation-option.selected .cultivation-card,
.talent-option.selected .talent-card {
  border-color: #d97706;
  background-color: #fef3c7;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.cultivation-info,
.talent-info {
  display: flex;
  align-items: center;
}

.cultivation-icon,
.talent-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.cultivation-name,
.talent-name {
  font-family: serif;
  font-weight: bold;
  font-size: 1.25rem;
  color: #1f2937;
}

.cultivation-desc,
.talent-desc {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.cultivation-stats {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  min-width: 100px;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.stat-value {
  font-size: 0.875rem;
  font-weight: bold;
}

.selection-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
}

.selection-dot {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #9ca3af;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.selected .selection-dot {
  border-color: #d97706;
  background-color: #d97706;
  box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.2);
}

/* ===========================================
   属性分配样式
   =========================================== */

.attribute-points {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 0.75rem;
  border: 1px solid #f59e0b;
  transition: all 0.3s ease;
}

.attribute-points.error {
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
  border-color: #ef4444;
}

.points-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.points-label {
  font-size: 1.125rem;
  font-family: serif;
  font-weight: 500;
  color: #374151;
}

.points-value {
  font-size: 2rem;
  font-weight: bold;
  color: #d97706;
  padding: 0.5rem 1rem;
  background-color: #fef3c7;
  border-radius: 0.5rem;
  border: 1px solid #f59e0b;
  min-width: 60px;
  text-align: center;
}

.attributes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.attribute-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  border: 1px solid #d1d5db;
  transition: all 0.3s ease;
}

.attribute-item:hover {
  background-color: #f3f4f6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.attribute-info {
  flex: 1;
}

.attribute-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.attribute-icon {
  font-size: 1.5rem;
  margin-right: 0.75rem;
}

.attribute-name {
  font-family: serif;
  font-weight: bold;
  font-size: 1.125rem;
  color: #1f2937;
}

.attribute-desc {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

.attribute-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.control-btn {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 2px solid;
  font-weight: bold;
  font-size: 1.25rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.control-btn:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.control-btn:active {
  transform: scale(0.95);
}

.control-btn.decrease {
  border-color: #fca5a5;
  background-color: #fef2f2;
  color: #dc2626;
}

.control-btn.decrease:hover {
  background-color: #fecaca;
  border-color: #ef4444;
}

.control-btn.increase {
  border-color: #86efac;
  background-color: #f0fdf4;
  color: #16a34a;
}

.control-btn.increase:hover {
  background-color: #dcfce7;
  border-color: #22c55e;
}

.control-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.control-btn.disabled:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #f9fafb;
}

.attribute-value {
  width: 4rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
}

/* ===========================================
   操作按钮样式
   =========================================== */

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid #d1d5db;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-family: serif;
  font-weight: bold;
  font-size: 1.125rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-height: 60px;
  cursor: pointer;
}

.action-button:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.action-button:active {
  transform: scale(0.98);
}

.action-button.secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: 2px solid #9ca3af;
}

.action-button.secondary:hover {
  background-color: #e5e7eb;
  border-color: #6b7280;
}

.action-button.primary {
  background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
  color: white;
  border: 2px solid #d97706;
}

.action-button.primary:hover {
  background: linear-gradient(135deg, #b45309 0%, #d97706 100%);
  border-color: #b45309;
}

.action-button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.action-button.disabled:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-button.loading {
  cursor: wait;
}

.action-button.success {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  border-color: #10b981;
}

.button-icon {
  font-size: 1.25rem;
  margin-right: 0.75rem;
}

.button-icon.loading {
  animation: spin 1s linear infinite;
}

.button-text {
  font-family: serif;
  font-weight: 600;
}

.button-tooltip {
  position: absolute;
  top: -3.5rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 0.75rem;
  background-color: #1f2937;
  color: white;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  white-space: nowrap;
  z-index: 20;
}

.action-button:hover .button-tooltip {
  opacity: 1;
}

.button-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: #1f2937;
}

/* ===========================================
   动画效果
   =========================================== */

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translateY(0);
  }
  40%, 43% {
    transform: translateY(-8px);
  }
  70% {
    transform: translateY(-4px);
  }
  90% {
    transform: translateY(-2px);
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.cultivation-option:hover .cultivation-icon,
.talent-option:hover .talent-icon {
  animation: float 2s ease-in-out infinite;
}

/* ===========================================
   响应式设计
   =========================================== */

/* 大屏幕设备 (1024px+) */
@media (min-width: 1024px) {
  .form-actions {
    flex-direction: row;
    justify-content: space-between;
  }

  .action-button {
    flex: 1;
    max-width: 200px;
  }
}

/* 平板设备 (768px - 1023px) */
@media (max-width: 1023px) {
  .content-wrapper {
    max-width: 48rem;
  }

  .form-container {
    padding: 2rem;
  }

  .talent-selection {
    grid-template-columns: 1fr;
  }

  .cultivation-stats {
    justify-content: center;
  }
}

/* 移动设备 (最大767px) */
@media (max-width: 767px) {
  .page-container {
    padding: 1rem;
  }

  .content-wrapper {
    max-width: 100%;
  }

  .page-title {
    font-size: 2.5rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }



  .form-container {
    padding: 1.5rem;
  }

  .character-form {
    gap: 2rem;
  }

  .field-label {
    font-size: 1.125rem;
  }

  .label-icon {
    font-size: 1.25rem;
    margin-right: 0.5rem;
  }

  .form-input {
    padding: 0.75rem;
    font-size: 1rem;
  }

  .gender-selection {
    gap: 1rem;
  }

  .option-card {
    padding: 1.5rem;
    min-height: 100px;
  }

  .option-icon {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .option-text {
    font-size: 1rem;
  }

  .cultivation-card,
  .talent-card {
    padding: 1.25rem;
  }

  .cultivation-icon,
  .talent-icon {
    font-size: 1.75rem;
    margin-right: 0.75rem;
  }

  .cultivation-name,
  .talent-name {
    font-size: 1.125rem;
  }

  .cultivation-stats {
    gap: 0.5rem;
  }

  .stat-item {
    padding: 0.5rem 0.75rem;
    min-width: 80px;
  }

  .attribute-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.25rem;
  }

  .attribute-controls {
    align-self: flex-end;
  }

  .form-actions {
    gap: 0.75rem;
  }

  .action-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    min-height: 52px;
  }
}

/* 小屏幕设备 (最大479px) */
@media (max-width: 479px) {
  .page-container {
    padding: 0.75rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .form-container {
    padding: 1rem;
  }

  .cultivation-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .attribute-item {
    padding: 1rem;
  }

  .control-btn {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.125rem;
  }

  .attribute-value {
    width: 3.5rem;
    height: 2.5rem;
    font-size: 1.125rem;
  }
}
</style>
