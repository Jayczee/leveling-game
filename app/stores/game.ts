import { defineStore } from 'pinia'
import { ACTIVITIES, EXPLORATION_AREAS, RANDOM_EVENTS, GAME_CONFIG, processExplorationEvents } from '~/utils/constants'

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
    messages: []
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

    // 计算探险剩余时间
    explorationTimeRemaining: (state) => {
      if (!state.isExploring) return 0
      const elapsed = Date.now() - state.explorationStartTime
      return Math.max(0, GAME_CONFIG.EXPLORATION_TIME - elapsed)
    },

    // 检查探险是否完成
    isExplorationComplete: (state) => {
      if (!state.isExploring) return false
      return Date.now() - state.explorationStartTime >= GAME_CONFIG.EXPLORATION_TIME
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

    // 开始探险
    startExploration(area: ExplorationArea) {
      if (this.isExploring) return false

      this.isExploring = true
      this.explorationArea = area
      this.explorationStartTime = Date.now()
      
      const areaInfo = EXPLORATION_AREAS[area]
      if (!areaInfo) return false
      this.addMessage(`前往${areaInfo.name}探险`, 'info')
      
      // 设置探险完成的定时器
      setTimeout(() => {
        this.completeExploration()
      }, GAME_CONFIG.EXPLORATION_TIME)

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
      if (!this.isPlaying) return

      const now = Date.now()
      const deltaTime = (now - this.lastUpdateTime) / 1000 // 转换为秒
      this.lastUpdateTime = now

      const characterStore = useCharacterStore()
      if (!characterStore.character) return

      // 增加游戏时间
      characterStore.addPlayTime(deltaTime)

      // 处理当前活动
      if (this.currentActivity) {
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
          // 修炼获得经验和灵气
          const expGain = baseGain * characterStore.cultivationSpeedMultiplier
          const qiGain = baseGain * 10 * characterStore.cultivationSpeedMultiplier
          
          characterStore.gainExperience(expGain)
          characterStore.gainResources({ spiritualQi: qiGain })
          break

        case 'body':
          // 炼体提升体质相关属性
          const bodyExpGain = baseGain * (1 + characterStore.character.attributes.constitution * 0.1)
          characterStore.gainExperience(bodyExpGain * 0.8)
          characterStore.character.cultivation.bodyLevel += bodyExpGain * 0.1
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
    }
  }
})
