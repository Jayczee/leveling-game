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
          spiritualQi: { range: [48, 72], probability: 0.9 },
          spiritCrystals: { range: [1, 3], probability: 0.2 },  // 少量灵晶
          enlightenmentExp: { range: [1, 3], probability: 0.3, path: 'wood' }  // 草药 → 木之道
        }
      },
      {
        eventId: 'meet_animal',
        probability: 0.4,
        rewards: {
          spiritualQi: { range: [25, 35], probability: 0.7 },
          spiritualStones: { range: [12, 18], probability: 0.8 },
          spiritCrystals: { range: [1, 2], probability: 0.15 },  // 少量灵晶
          enlightenmentExp: { range: [1, 2], probability: 0.2, path: 'earth' }  // 动物 → 土之道
        }
      },
      {
        eventId: 'peaceful_meditation',
        probability: 0.3,
        rewards: {
          spiritualQi: { range: [20, 30], probability: 0.9 },
          enlightenmentExp: { range: [2, 4], probability: 0.4, path: 'time' }  // 冥想 → 时间之道
        }
      }
    ]
  },
  MISTY_MOUNTAIN: {
    id: 'misty_mountain',
    name: '云雾山峰',
    description: '云雾缭绕，灵气浓郁',
    level: 3,
    maxEvents: 1,
    events: [
      {
        eventId: 'find_spirit_stone',
        probability: 0.3,
        rewards: {
          spiritualStones: { range: [80, 120], probability: 0.8 },  // 现在作为炼体经验
          spiritualQi: { range: [1, 1], probability: 0.9 },  // 少量练气经验
          spiritCrystals: { range: [3, 8], probability: 0.4 },  // 中等灵晶
          divinePower: { powerIds: ['IRON_BONE'], probability: 0.05 },  // 低概率获得铁骨神通
          enlightenmentExp: { range: [2, 4], probability: 0.4, path: 'metal' }  // 灵石 → 金之道
        }
      },
      {
        eventId: 'encounter_beast',
        probability: 0.5,
        rewards: {
          spiritualStones: { range: [40, 60], probability: 0.8 },
          spiritualQi: { range: [70, 90], probability: 0.7 },
          spiritCrystals: { range: [2, 5], probability: 0.3 },  // 中等灵晶
          divinePower: { powerIds: ['DIVINE_STRENGTH'], probability: 0.03 },  // 低概率获得神力通天
          enlightenmentExp: { range: [1, 3], probability: 0.3, path: 'fire' }  // 野兽 → 火之道
        }
      },
      {
        eventId: 'discover_cave',
        probability: 0.2,
        rewards: {
          spiritualStones: { range: [180, 220], probability: 0.9 },  // 大量炼体经验
          spiritualQi: { range: [1, 3], probability: 0.6 },  // 少量练气经验
          enlightenmentExp: { range: [3, 6], probability: 0.5, path: 'space' }  // 洞穴 → 空间之道
        }
      }
    ]
  },
  ANCIENT_RUINS: {
    id: 'ancient_ruins',
    name: '古迹遗址',
    description: '古老遗迹，藏有秘宝',
    level: 5,
    maxEvents: 1,
    events: [
      {
        eventId: 'find_artifact',
        probability: 0.2,
        rewards: {
          spiritualStones: { range: [90, 110], probability: 0.8 },  // 炼体经验
          spiritualQi: { range: [4, 6], probability: 0.7 },  // 练气经验
          spiritCrystals: { range: [8, 15], probability: 0.6 },  // 较多灵晶
          divinePower: { powerIds: ['GOLDEN_BODY', 'VAJRA_BODY'], probability: 0.08 },  // 中等概率获得高级神通
          enlightenmentExp: { range: [3, 5], probability: 0.4, path: 'metal' }  // 神器 → 金之道
        }
      },
      {
        eventId: 'trigger_formation',
        probability: 0.4,
        rewards: {
          spiritualQi: { range: [210, 250], probability: 0.8 },
          spiritCrystals: { range: [5, 12], probability: 0.5 },  // 较多灵晶
          divinePower: { powerIds: ['IMMORTAL_FLESH'], probability: 0.06 },  // 中等概率获得不死血肉
          enlightenmentExp: { range: [4, 7], probability: 0.5, path: 'water' }  // 法阵 → 水之道
        }
      },
      {
        eventId: 'ancient_inheritance',
        probability: 0.1,
        rewards: {
          spiritualQi: { range: [180, 220], probability: 0.9 },
          spiritualStones: { range: [2, 4], probability: 0.6 },
          enlightenmentExp: { range: [5, 10], probability: 0.8, path: 'time' }  // 传承 → 时间之道
        }
      }
    ]
  },

  DRAGON_VALLEY: {
    id: 'dragon_valley',
    name: '龙谷秘境',
    description: '传说中的龙族栖息地，蕴含强大的神通传承',
    level: 6,
    maxEvents: 1,
    events: [
      {
        eventId: 'ancient_inheritance',
        probability: 0.15,
        rewards: {
          spiritualStones: { range: [150, 200], probability: 0.9 },
          spiritualQi: { range: [200, 300], probability: 0.8 },
          spiritCrystals: { range: [20, 50], probability: 0.7 },  // 大量灵晶
          divinePower: { powerIds: ['DRAGON_ELEPHANT_POWER'], probability: 0.12 },  // 较高概率获得传说神通
          enlightenmentExp: { range: [8, 15], probability: 0.6, path: 'time' }  // 传承 → 时间之道
        }
      },
      {
        eventId: 'encounter_dragon',
        probability: 0.25,
        rewards: {
          spiritualStones: { range: [100, 150], probability: 0.8 },
          spiritualQi: { range: [150, 200], probability: 0.7 },
          spiritCrystals: { range: [15, 30], probability: 0.6 },
          divinePower: { powerIds: ['GOLDEN_BODY', 'VAJRA_BODY', 'IMMORTAL_FLESH'], probability: 0.1 },
          enlightenmentExp: { range: [5, 10], probability: 0.5, path: 'space' }  // 龙族 → 空间之道
        }
      }
    ]
  }
} as const
