<template>
  <div class="h-full flex flex-col">
    <!-- 标题栏 -->
    <div class="flex justify-between items-center mb-2 md:mb-4">
      <h3 class="font-serif font-semibold text-ink-800 text-sm md:text-base">修炼日志</h3>
      <button
        @click="clearMessages"
        class="btn-secondary text-xs px-2 py-1"
      >
        清空日志
      </button>
    </div>

    <!-- 消息列表 -->
    <div
      ref="messageContainer"
      class="flex-1 bg-paper-50 border border-ink-200 rounded-lg p-2 overflow-y-auto space-y-1 min-h-0 max-h-32 md:max-h-48"
    >
      <div v-if="messages.length === 0" class="text-center text-ink-500 py-4 md:py-8">
        <p class="text-sm md:text-base">暂无修炼记录</p>
        <p class="text-xs md:text-sm mt-1">开始修炼后会显示相关信息</p>
      </div>

      <TransitionGroup name="message" tag="div">
        <div
          v-for="message in messages"
          :key="message.id"
          class="message-item p-2 rounded border transition-all duration-300"
          :class="getMessageClass(message.type)"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1 min-w-0">
              <p class="text-xs break-words" :class="getMessageTextClass(message.type)">
                <span v-html="formatMessageContent(message.text)"></span>
              </p>
            </div>
            <div class="flex items-center space-x-1 ml-2 flex-shrink-0">
              <span class="text-xs text-ink-400 whitespace-nowrap">
                {{ formatMessageTime(message.timestamp) }}
              </span>
              <button
                @click="removeMessage(message.id)"
                class="text-ink-400 hover:text-ink-600 text-xs w-3 h-3 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- 快捷操作 -->
    <div class="mt-2 md:mt-4 flex space-x-2">
      <button
        @click="addTestMessage"
        class="btn-secondary text-xs px-2 md:px-3 py-1 flex-1 md:flex-none"
      >
        测试消息
      </button>
      <button
        @click="scrollToBottom"
        class="btn-secondary text-xs px-2 md:px-3 py-1 flex-1 md:flex-none"
      >
        滚动到底部
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const gameStore = useGameStore()
const { formatTime } = useTimeFormatter()

// 引用
const messageContainer = ref<HTMLElement>()

// 计算属性
const messages = computed(() => gameStore.messages)

// 获取消息样式类
function getMessageClass(type: string) {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200'
    case 'warning':
      return 'bg-yellow-50 border-yellow-200'
    case 'error':
      return 'bg-red-50 border-red-200'
    default:
      return 'bg-blue-50 border-blue-200'
  }
}

// 获取消息文本样式类
function getMessageTextClass(type: string) {
  switch (type) {
    case 'success':
      return 'text-green-800'
    case 'warning':
      return 'text-yellow-800'
    case 'error':
      return 'text-red-800'
    default:
      return 'text-blue-800'
  }
}

// 格式化消息时间
function formatMessageTime(timestamp: number) {
  const now = Date.now()
  const diff = now - timestamp
  
  if (diff < 60000) { // 1分钟内
    return '刚刚'
  } else if (diff < 3600000) { // 1小时内
    return Math.floor(diff / 60000) + '分钟前'
  } else if (diff < 86400000) { // 1天内
    return Math.floor(diff / 3600000) + '小时前'
  } else {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

// 清空消息
function clearMessages() {
  gameStore.clearMessages()
}

// 删除消息
function removeMessage(id: string) {
  gameStore.removeMessage(id)
}

// 滚动到底部
function scrollToBottom() {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}

// 格式化消息内容，美化奖励显示
function formatMessageContent(text: string): string {
  // 检查是否是奖励消息
  if (text.includes('获得奖励：')) {
    const parts = text.split('获得奖励：')
    if (parts.length === 2) {
      const prefix = parts[0]
      const rewards = parts[1]

      // 解析奖励内容
      const formattedRewards = rewards
        .split('，')
        .map(reward => {
          const trimmed = reward.trim()
          if (trimmed.includes('灵气')) {
            return `<span class="inline-flex items-center space-x-1"><span class="text-blue-600">💧</span><span>${trimmed}</span></span>`
          } else if (trimmed.includes('经验')) {
            return `<span class="inline-flex items-center space-x-1"><span class="text-green-600">⭐</span><span>${trimmed}</span></span>`
          } else if (trimmed.includes('灵石')) {
            return `<span class="inline-flex items-center space-x-1"><span class="text-purple-600">💎</span><span>${trimmed}</span></span>`
          }
          return trimmed
        })
        .join(' ')

      return `${prefix}获得奖励：${formattedRewards}`
    }
  }

  return text
}

// 添加测试消息
function addTestMessage() {
  const testMessages = [
    '感受到一丝灵气波动...',
    '修为略有精进',
    '心境渐趋平静',
    '体内真气运转顺畅',
    '悟性有所提升'
  ]
  const randomMessage = testMessages[Math.floor(Math.random() * testMessages.length)]
  gameStore.addMessage(randomMessage, 'info')
}

// 监听消息变化，保持在顶部（新消息在顶部显示）
watch(messages, () => {
  nextTick(() => {
    // 新消息在顶部，不需要滚动
    if (messageContainer.value) {
      messageContainer.value.scrollTop = 0
    }
  })
}, { deep: true })
</script>

<style scoped>
/* 消息动画 */
.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.message-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.message-move {
  transition: transform 0.3s ease;
}

/* 滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f5f2e8;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #adb5bd;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #6c757d;
}
</style>
