import { defineStore } from 'pinia'
import { ACTIVITIES, GAME_CONFIG } from '~/utils/constants'
import { EXPLORATION_AREAS } from '~/utils/exploration-areas'
import { processExplorationEvents } from '~/utils/exploration-utils'

export type ActivityType = keyof typeof ACTIVITIES
export type ExplorationArea = keyof typeof EXPLORATION_AREAS

export interface GameState {
  isPlaying: boolean
  currentActivity: ActivityType | null
  gameSpeed: number
  lastUpdateTime: number
  isExploring: boolean
  explorationArea: ExplorationArea | null
  explorationStartTime: number
  messages: GameMessage[]
  hiddenTime: number // 页面隐藏时的时间戳
}

export interface GameMessage {
  id: string
  text: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: number
}

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    isPlaying: false,
    currentActivity: null,
    gameSpeed: 1,
    lastUpdateTime: Date.now(),
    isExploring: false,
    explorationArea: null,
    explorationStartTime: 0,
    messages: [],
    hiddenTime: 0
  }),

  getters: {
    // 获取当前活动信息
    currentActivityInfo: (state) => {
      if (!state.currentActivity) return null
      return ACTIVITIES[state.currentActivity]
    },

    // 获取当前探险区域信息
    currentExplorationAreaInfo: (state) => {
      if (!state.explorationArea) return null
      return EXPLORATION_AREAS[state.explorationArea]
    },

    // 计算探险剩余时间（只受游戏速度影响）
    explorationTimeRemaining: (state) => {
      if (!state.isExploring) return 0
      const elapsed = Date.now() - state.explorationStartTime
      const actualExplorationTime = GAME_CONFIG.EXPLORATION_TIME / state.gameSpeed
      return Math.max(0, actualExplorationTime - elapsed)
    },

    // 检查探险是否完成
    isExplorationComplete: (state) => {
      if (!state.isExploring) return false
      const elapsed = Date.now() - state.explorationStartTime
      const actualExplorationTime = GAME_CONFIG.EXPLORATION_TIME / state.gameSpeed
      return elapsed >= actualExplorationTime
    }
  },

  actions: {
    // 开始游戏
    startGame() {
      this.isPlaying = true
      this.lastUpdateTime = Date.now()
      this.addMessage('开始修仙之路...', 'info')
    },

    // 暂停游戏
    pauseGame() {
      this.isPlaying = false
      this.addMessage('游戏已暂停', 'info')
    },

    // 设置当前活动
    setActivity(activity: ActivityType | null) {
      this.currentActivity = activity
      
      if (activity) {
        const activityInfo = ACTIVITIES[activity]
        this.addMessage(`开始${activityInfo.name}`, 'info')
      } else {
        this.addMessage('停止当前活动', 'info')
      }
    },

    // 获取实际探险时间（只受游戏速度影响，不受时光法宝影响）
    getActualExplorationTime() {
      return GAME_CONFIG.EXPLORATION_TIME / this.gameSpeed
    },

    // 开始探险
    startExploration(area: ExplorationArea) {
      if (this.isExploring) return false

      this.isExploring = true
      this.explorationArea = area
      this.explorationStartTime = Date.now()

      const areaInfo = EXPLORATION_AREAS[area]
      if (!areaInfo) return false
      this.addMessage(`前往${areaInfo.name}探险`, 'info')

      // 不再使用定时器自动完成，由UI组件检查完成状态

      return true
    },

    // 完成探险
    completeExploration() {
      if (!this.isExploring || !this.explorationArea) return null

      const areaInfo = EXPLORATION_AREAS[this.explorationArea]
      if (!areaInfo) return null

      // 处理探险事件
      const triggeredEvents = processExplorationEvents(areaInfo)

      // 重置探险状态
      this.isExploring = false
      this.explorationArea = null
      this.explorationStartTime = 0

      // 增加探险统计
      const characterStore = useCharacterStore()
      characterStore.addExploration()

      if (triggeredEvents.length === 0) {
        this.addMessage('探险完成：一无所获', 'info')
        return {
          events: [],
          totalRewards: {}
        }
      }

      // 合并所有奖励
      const totalRewards: Record<string, number> = {}
      const eventMessages: string[] = []

      for (const { event, rewards } of triggeredEvents) {
        eventMessages.push(`${event.name} - ${event.description}`)

        // 合并奖励
        for (const [key, value] of Object.entries(rewards)) {
          totalRewards[key] = (totalRewards[key] || 0) + value
        }
      }

      this.addMessage(`探险完成：${eventMessages.join('；')}`, 'success')

      return {
        events: triggeredEvents,
        totalRewards
      }
    },

    // 取消探险
    cancelExploration() {
      if (!this.isExploring) return

      this.isExploring = false
      this.explorationArea = null
      this.explorationStartTime = 0
      
      this.addMessage('取消探险', 'warning')
    },

    // 设置游戏速度
    setGameSpeed(speed: number) {
      this.gameSpeed = Math.max(0.5, Math.min(5, speed))
      this.addMessage(`游戏速度设置为 ${this.gameSpeed}x`, 'info')
    },

    // 更新游戏状态
    updateGame() {
      const now = Date.now()
      const deltaTime = (now - this.lastUpdateTime) / 1000 // 转换为秒
      this.lastUpdateTime = now

      const characterStore = useCharacterStore()
      if (!characterStore.character) return

      // 增加游戏时间
      characterStore.addPlayTime(deltaTime)

      // 处理当前活动（只有在游戏运行状态下才处理活动）
      if (this.isPlaying && this.currentActivity) {
        this.processActivity(deltaTime)
      }
    },

    // 处理活动逻辑
    processActivity(deltaTime: number) {
      const characterStore = useCharacterStore()
      if (!characterStore.character || !this.currentActivity) return

      const activity = ACTIVITIES[this.currentActivity]
      // 应用游戏速度和时光法宝加速效果
      const timeTreasureMultiplier = characterStore.getTimeTreasureSpeedMultiplier()
      const baseGain = activity.baseGain * deltaTime * this.gameSpeed * timeTreasureMultiplier

      switch (activity.type) {
        case 'cultivation':
          // 修炼获得练气经验，直接使用修炼方向的灵气获取效率
          const cultivationPath = characterStore.getCurrentCultivationPath()
          const qiEfficiency = cultivationPath?.effects.spiritualQiEfficiency || 1

          const qiExpGain = baseGain * qiEfficiency

          characterStore.gainQiExperience(qiExpGain)
          break

        case 'body':
          // 炼体获得炼体经验，直接使用修炼方向的体质成长效率
          const bodyPath = characterStore.getCurrentCultivationPath()
          const bodyEfficiency = bodyPath?.effects.constitutionGrowthRate || 1

          const bodyExpGain = baseGain * bodyEfficiency
          characterStore.gainBodyExperience(bodyExpGain)
          break

        case 'adventure':
          // 探险模式下不进行常规活动处理
          break
      }
    },

    // 添加消息
    addMessage(text: string, type: GameMessage['type'] = 'info') {
      const message: GameMessage = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
        text,
        type,
        timestamp: Date.now()
      }

      this.messages.unshift(message)

      // 限制消息数量
      if (this.messages.length > 50) {
        this.messages = this.messages.slice(0, 50)
      }
    },

    // 清除消息
    clearMessages() {
      this.messages = []
    },

    // 删除指定消息
    removeMessage(id: string) {
      const index = this.messages.findIndex(msg => msg.id === id)
      if (index > -1) {
        this.messages.splice(index, 1)
      }
    },

    // 记录页面隐藏时间
    recordHiddenTime() {
      this.hiddenTime = Date.now()
    },

    // 处理离线时间
    processOfflineTime() {
      if (this.hiddenTime === 0) return

      const now = Date.now()
      const offlineTime = (now - this.hiddenTime) / 1000 // 转换为秒
      this.hiddenTime = 0

      // 如果离线时间太短（小于5秒），忽略
      if (offlineTime < 5) return

      const characterStore = useCharacterStore()
      if (!characterStore.character || !this.currentActivity) return

      // 计算离线收益
      const activity = ACTIVITIES[this.currentActivity]
      const timeTreasureMultiplier = characterStore.getTimeTreasureSpeedMultiplier()
      const baseGain = activity.baseGain * offlineTime * this.gameSpeed * timeTreasureMultiplier

      let offlineRewards: string[] = []

      switch (activity.type) {
        case 'cultivation':
          const cultivationPath = characterStore.getCurrentCultivationPath()
          const qiEfficiency = cultivationPath?.effects.spiritualQiEfficiency || 1
          const qiExpGain = baseGain * qiEfficiency
          characterStore.gainQiExperience(qiExpGain)
          offlineRewards.push(`练气经验+${Math.floor(qiExpGain)}`)
          break

        case 'body':
          const bodyPath = characterStore.getCurrentCultivationPath()
          const bodyEfficiency = bodyPath?.effects.constitutionGrowthRate || 1
          const bodyExpGain = baseGain * bodyEfficiency
          characterStore.gainBodyExperience(bodyExpGain)
          offlineRewards.push(`炼体经验+${Math.floor(bodyExpGain)}`)
          break
      }

      // 显示离线收益消息
      if (offlineRewards.length > 0) {
        // 简单的时间格式化函数
        const formatTime = (seconds: number): string => {
          const hours = Math.floor(seconds / 3600)
          const minutes = Math.floor((seconds % 3600) / 60)
          const secs = Math.floor(seconds % 60)

          if (hours > 0) {
            return `${hours}时${minutes}分${secs}秒`
          } else if (minutes > 0) {
            return `${minutes}分${secs}秒`
          } else {
            return `${secs}秒`
          }
        }

        this.addMessage(`离线${formatTime(offlineTime)}，获得：${offlineRewards.join(', ')}`, 'success')
      }
    }
  }
})
