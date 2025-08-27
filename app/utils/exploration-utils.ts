// 探险系统工具函数

import type { RewardConfig, ExplorationEvent, ExplorationAreaConfig } from './exploration-types'
import { RANDOM_EVENTS } from './exploration-events'

// 计算受悟性影响的悟道经验概率
export function calculateEnlightenmentProbability(baseProbability: number, comprehension: number): number {
  // 实际概率 = 基础概率 * (1 + 0.01% * 悟性)
  // 注意：0.01% = 0.0001
  const multiplier = 1 + (comprehension * 0.0001)
  const actualProbability = baseProbability * multiplier

  // 最高不超过50%
  return Math.min(actualProbability, 0.5)
}

// 生成随机奖励
export function generateRandomRewards(rewardConfig: RewardConfig, comprehension: number = 0): Record<string, any> {
  const rewards: Record<string, any> = {}

  if (rewardConfig.spiritualQi && Math.random() < rewardConfig.spiritualQi.probability) {
    const [min, max] = rewardConfig.spiritualQi.range
    rewards.spiritualQi = Math.floor(Math.random() * (max - min + 1)) + min
  }

  if (rewardConfig.spiritualStones && Math.random() < rewardConfig.spiritualStones.probability) {
    const [min, max] = rewardConfig.spiritualStones.range
    rewards.spiritualStones = Math.floor(Math.random() * (max - min + 1)) + min
  }

  if (rewardConfig.enlightenmentExp) {
    // 使用悟性值计算实际概率
    const actualProbability = calculateEnlightenmentProbability(rewardConfig.enlightenmentExp.probability, comprehension)

    if (Math.random() < actualProbability) {
      const [min, max] = rewardConfig.enlightenmentExp.range
      const amount = Math.floor(Math.random() * (max - min + 1)) + min
      rewards.enlightenmentExp = amount
      rewards.enlightenmentPath = rewardConfig.enlightenmentExp.path
    }
  }

  return rewards
}

// 处理探险事件
export function processExplorationEvents(areaConfig: ExplorationAreaConfig, comprehension: number = 0): Array<{event: ExplorationEvent, rewards: Record<string, any>}> {
  const triggeredEvents: Array<{event: ExplorationEvent, rewards: Record<string, any>}> = []

  // 随机打乱事件顺序
  const shuffledEvents = [...areaConfig.events].sort(() => Math.random() - 0.5)

  for (const eventConfig of shuffledEvents) {
    // 检查是否达到最大事件数量
    if (triggeredEvents.length >= areaConfig.maxEvents) break

    // 检查事件是否触发
    if (Math.random() < eventConfig.probability) {
      const event = RANDOM_EVENTS[eventConfig.eventId]
      if (event) {
        const rewards = generateRandomRewards(eventConfig.rewards, comprehension)
        triggeredEvents.push({ event, rewards })
      }
    }
  }

  return triggeredEvents
}
