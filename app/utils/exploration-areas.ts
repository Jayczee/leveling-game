// 探险区域配置

import type { ExplorationAreaConfig } from './exploration-types'

// 探险区域
export const EXPLORATION_AREAS: Record<string, ExplorationAreaConfig> = {
  BAMBOO_FOREST: {
    id: 'bamboo_forest',
    name: '竹林小径',
    description: '清幽竹林，偶有灵草',
    level: 1,
    maxEvents: 1,
    events: [
      {
        eventId: 'find_herb',
        probability: 0.6,
        rewards: {
          spiritualQi: { range: [48, 72], probability: 0.9 }
        }
      },
      {
        eventId: 'meet_animal',
        probability: 0.4,
        rewards: {
          spiritualQi: { range: [25, 35], probability: 0.7 },
          spiritualStones: { range: [12, 18], probability: 0.8 }
        }
      },
      {
        eventId: 'peaceful_meditation',
        probability: 0.3,
        rewards: {
          spiritualQi: { range: [20, 30], probability: 0.9 }
        }
      }
    ]
  },
  MISTY_MOUNTAIN: {
    id: 'misty_mountain',
    name: '云雾山峰',
    description: '云雾缭绕，灵气浓郁',
    level: 2,
    maxEvents: 1,
    events: [
      {
        eventId: 'find_spirit_stone',
        probability: 0.3,
        rewards: {
          spiritualStones: { range: [80, 120], probability: 0.8 },  // 现在作为炼体经验
          spiritualQi: { range: [1, 1], probability: 0.9 }  // 少量练气经验
        }
      },
      {
        eventId: 'encounter_beast',
        probability: 0.5,
        rewards: {
          spiritualStones: { range: [40, 60], probability: 0.8 },
          spiritualQi: { range: [70, 90], probability: 0.7 }
        }
      },
      {
        eventId: 'discover_cave',
        probability: 0.2,
        rewards: {
          spiritualStones: { range: [180, 220], probability: 0.9 },  // 大量炼体经验
          spiritualQi: { range: [1, 3], probability: 0.6 }  // 少量练气经验
        }
      }
    ]
  },
  ANCIENT_RUINS: {
    id: 'ancient_ruins',
    name: '古迹遗址',
    description: '古老遗迹，藏有秘宝',
    level: 3,
    maxEvents: 1,
    events: [
      {
        eventId: 'find_artifact',
        probability: 0.2,
        rewards: {
          spiritualStones: { range: [90, 110], probability: 0.8 },  // 炼体经验
          spiritualQi: { range: [4, 6], probability: 0.7 }  // 练气经验
        }
      },
      {
        eventId: 'trigger_formation',
        probability: 0.4,
        rewards: {
          spiritualQi: { range: [210, 250], probability: 0.8 }
        }
      },
      {
        eventId: 'ancient_inheritance',
        probability: 0.1,
        rewards: {
          spiritualQi: { range: [180, 220], probability: 0.9 },
          spiritualStones: { range: [2, 4], probability: 0.6 }
        }
      }
    ]
  }
} as const
