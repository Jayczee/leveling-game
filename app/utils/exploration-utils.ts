// 探险系统工具函数

import type { RewardConfig, ExplorationEvent, ExplorationAreaConfig } from './exploration-types'
import { RANDOM_EVENTS } from './exploration-events'

// 生成随机奖励
export function generateRandomRewards(rewardConfig: RewardConfig): Record<string, number> {
  const rewards: Record<string, number> = {}

  if (rewardConfig.spiritualQi && Math.random() < rewardConfig.spiritualQi.probability) {
    const [min, max] = rewardConfig.spiritualQi.range
    rewards.spiritualQi = Math.floor(Math.random() * (max - min + 1)) + min
  }

  if (rewardConfig.spiritualStones && Math.random() < rewardConfig.spiritualStones.probability) {
    const [min, max] = rewardConfig.spiritualStones.range
    rewards.spiritualStones = Math.floor(Math.random() * (max - min + 1)) + min
  }

  if (rewardConfig.enlightenmentExp && Math.random() < rewardConfig.enlightenmentExp.probability) {
    const [min, max] = rewardConfig.enlightenmentExp.range
    const amount = Math.floor(Math.random() * (max - min + 1)) + min
    rewards.enlightenmentExp = amount
    rewards.enlightenmentPath = rewardConfig.enlightenmentExp.path
  }

  return rewards
}

// 处理探险事件
export function processExplorationEvents(areaConfig: ExplorationAreaConfig): Array<{event: ExplorationEvent, rewards: Record<string, number>}> {
  const triggeredEvents: Array<{event: ExplorationEvent, rewards: Record<string, number>}> = []

  // 随机打乱事件顺序
  const shuffledEvents = [...areaConfig.events].sort(() => Math.random() - 0.5)

  for (const eventConfig of shuffledEvents) {
    // 检查是否达到最大事件数量
    if (triggeredEvents.length >= areaConfig.maxEvents) break

    // 检查事件是否触发
    if (Math.random() < eventConfig.probability) {
      const event = RANDOM_EVENTS[eventConfig.eventId]
      if (event) {
        const rewards = generateRandomRewards(eventConfig.rewards)
        triggeredEvents.push({ event, rewards })
      }
    }
  }

  return triggeredEvents
}
