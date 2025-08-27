import { ref, onMounted, onUnmounted, readonly } from 'vue'
import { GAME_CONFIG } from '~/utils/constants'

export function useGameLoop() {
  const gameStore = useGameStore()
  const characterStore = useCharacterStore()
  const saveStore = useSaveStore()
  
  let gameLoopInterval: NodeJS.Timeout | null = null
  let saveInterval: NodeJS.Timeout | null = null
  
  const isRunning = ref(false)

  // 开始游戏循环
  function startGameLoop() {
    if (isRunning.value) return

    isRunning.value = true
    
    // 主游戏循环
    gameLoopInterval = setInterval(() => {
      gameStore.updateGame()
    }, GAME_CONFIG.IDLE_INTERVAL)

    // 自动保存循环（每30秒）
    saveInterval = setInterval(() => {
      if (characterStore.character) {
        saveStore.saveCurrentGame(characterStore.character)
      }
    }, 30000)
  }

  // 停止游戏循环
  function stopGameLoop() {
    if (!isRunning.value) return

    isRunning.value = false
    
    if (gameLoopInterval) {
      clearInterval(gameLoopInterval)
      gameLoopInterval = null
    }

    if (saveInterval) {
      clearInterval(saveInterval)
      saveInterval = null
    }

    // 停止时保存一次
    if (characterStore.character) {
      saveStore.saveCurrentGame(characterStore.character)
    }
  }

  // 页面可见性变化处理
  function handleVisibilityChange() {
    if (document.hidden) {
      // 页面隐藏时记录时间，但不暂停游戏循环
      gameStore.recordHiddenTime()
    } else {
      // 页面显示时计算离线时间并应用离线收益
      gameStore.processOfflineTime()
    }
  }

  // 页面卸载前保存
  function handleBeforeUnload() {
    if (characterStore.character) {
      saveStore.saveCurrentGame(characterStore.character)
    }
  }

  onMounted(() => {
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // 监听页面卸载
    window.addEventListener('beforeunload', handleBeforeUnload)
  })

  onUnmounted(() => {
    stopGameLoop()
    
    // 清理事件监听器
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })

  return {
    isRunning: readonly(isRunning),
    startGameLoop,
    stopGameLoop
  }
}

// 格式化时间显示
export function useTimeFormatter() {
  function formatTime(seconds: number): string {
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

  function formatDate(timestamp: number): string {
    const date = new Date(timestamp)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return {
    formatTime,
    formatDate
  }
}

// 数值格式化
export function useNumberFormatter() {
  function formatNumber(num: number): string {
    if (num >= 1e12) {
      return (num / 1e12).toFixed(1) + '万亿'
    } else if (num >= 1e8) {
      return (num / 1e8).toFixed(1) + '亿'
    } else if (num >= 1e4) {
      return (num / 1e4).toFixed(1) + '万'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + '千'
    } else {
      return Math.floor(num).toString()
    }
  }

  function formatPercentage(num: number): string {
    return (num * 100).toFixed(1) + '%'
  }

  return {
    formatNumber,
    formatPercentage
  }
}

// 游戏事件处理
export function useGameEvents() {
  const gameStore = useGameStore()
  const characterStore = useCharacterStore()

  // 处理探险完成
  function handleExplorationComplete() {
    const result = gameStore.completeExploration()
    if (result && characterStore.character) {
      // 应用总奖励
      if (result.totalRewards.spiritualQi) {
        characterStore.gainQiExperience(result.totalRewards.spiritualQi)
      }
      if (result.totalRewards.spiritualStones) {
        characterStore.gainBodyExperience(result.totalRewards.spiritualStones)
      }
      if (result.totalRewards.enlightenmentExp) {
        // 使用指定的道，如果没有指定则随机选择
        const path = result.totalRewards.enlightenmentPath ||
          ['metal', 'wood', 'water', 'fire', 'earth', 'time', 'space'][Math.floor(Math.random() * 7)]
        characterStore.gainEnlightenmentExperience(path, result.totalRewards.enlightenmentExp)
      }

      // 如果有奖励，显示奖励信息
      if (Object.keys(result.totalRewards).length > 0) {
        gameStore.addMessage(`获得奖励：${formatRewards(result.totalRewards)}`, 'success')
      }
    }
  }

  // 格式化奖励文本
  function formatRewards(rewards: any): string {
    const parts = []
    if (rewards.spiritualQi) parts.push(`练气经验+${rewards.spiritualQi}`)
    if (rewards.spiritualStones) parts.push(`炼体经验+${rewards.spiritualStones}`)
    if (rewards.enlightenmentExp) {
      const pathNames: Record<string, string> = {
        metal: '金之道',
        wood: '木之道',
        water: '水之道',
        fire: '火之道',
        earth: '土之道',
        time: '时间之道',
        space: '空间之道'
      }
      const pathName = pathNames[rewards.enlightenmentPath] || '悟道'
      parts.push(`${pathName}经验+${rewards.enlightenmentExp}`)
    }
    return parts.join(', ')
  }

  return {
    handleExplorationComplete,
    formatRewards
  }
}
