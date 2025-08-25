// 游戏常量配置

// 天赋系统
export const TALENTS = {
  SPIRITUAL_ROOT: {
    id: 'spiritual_root',
    name: '天灵根',
    description: '修炼速度提升50%，悟性+2',
    effects: {
      cultivationSpeed: 1.5,
      comprehension: 2
    }
  },
  IRON_BODY: {
    id: 'iron_body',
    name: '铁骨铮铮',
    description: '体质+3，炼体效率提升30%',
    effects: {
      constitution: 3,
      bodyTrainingSpeed: 1.3
    }
  },
  WISE_MIND: {
    id: 'wise_mind',
    name: '慧心通明',
    description: '悟性+3，突破几率提升20%',
    effects: {
      comprehension: 3,
      breakthroughChance: 1.2
    }
  },
  LUCKY_STAR: {
    id: 'lucky_star',
    name: '福星高照',
    description: '探险获得稀有物品几率提升100%',
    effects: {
      luckBonus: 2.0
    }
  }
} as const

// 境界系统
export const REALMS = {
  MORTAL: {
    id: 'mortal',
    name: '凡人',
    maxLevel: 0,
    description: '未踏入修行之路的凡人'
  },
  QI_REFINING: {
    id: 'qi_refining',
    name: '练气期',
    maxLevel: 12,
    description: '初入修行，炼化天地灵气'
  },
  FOUNDATION: {
    id: 'foundation',
    name: '筑基期',
    maxLevel: 9,
    description: '筑建修行根基，脱胎换骨'
  },
  GOLDEN_CORE: {
    id: 'golden_core',
    name: '金丹期',
    maxLevel: 9,
    description: '凝结金丹，寿元大增'
  },
  NASCENT_SOUL: {
    id: 'nascent_soul',
    name: '元婴期',
    maxLevel: 9,
    description: '元婴出窍，神通广大'
  }
} as const

// 修炼活动
export const ACTIVITIES = {
  MEDITATION: {
    id: 'meditation',
    name: '打坐静修',
    description: '吸纳天地灵气，提升修为',
    baseGain: 1,
    type: 'cultivation'
  },
  BODY_TRAINING: {
    id: 'body_training',
    name: '炼体修行',
    description: '锤炼肉身，增强体质',
    baseGain: 1,
    type: 'body'
  },
  EXPLORATION: {
    id: 'exploration',
    name: '外出探险',
    description: '探索未知区域，寻找机缘',
    baseGain: 0.5,
    type: 'adventure'
  }
} as const

// 奖励配置接口
export interface RewardConfig {
  spiritualQi?: { range: [number, number], probability: number }
  experience?: { range: [number, number], probability: number }
  spiritualStones?: { range: [number, number], probability: number }
}

// 探险事件配置
export interface ExplorationEvent {
  id: string
  name: string
  description: string
}

// 区域事件配置（包含概率和奖励）
export interface AreaEventConfig {
  eventId: string
  probability: number  // 事件触发概率 (0-1)
  rewards: RewardConfig
}

// 探险区域配置
export interface ExplorationAreaConfig {
  id: string
  name: string
  description: string
  level: number
  events: AreaEventConfig[]
  maxEvents: number  // 单次探险最大事件数量
}

// 探险区域
export const EXPLORATION_AREAS: Record<string, ExplorationAreaConfig> = {
  BAMBOO_FOREST: {
    id: 'bamboo_forest',
    name: '竹林小径',
    description: '清幽竹林，偶有灵草',
    level: 1,
    maxEvents: 2,
    events: [
      {
        eventId: 'find_herb',
        probability: 0.6,
        rewards: {
          spiritualQi: { range: [40, 60], probability: 0.8 },
          experience: { range: [8, 12], probability: 0.9 }
        }
      },
      {
        eventId: 'meet_animal',
        probability: 0.4,
        rewards: {
          spiritualQi: { range: [25, 35], probability: 0.7 },
          experience: { range: [12, 18], probability: 0.8 }
        }
      },
      {
        eventId: 'peaceful_meditation',
        probability: 0.3,
        rewards: {
          experience: { range: [20, 30], probability: 0.9 }
        }
      }
    ]
  },
  MISTY_MOUNTAIN: {
    id: 'misty_mountain',
    name: '云雾山峰',
    description: '云雾缭绕，灵气浓郁',
    level: 2,
    maxEvents: 3,
    events: [
      {
        eventId: 'find_spirit_stone',
        probability: 0.3,
        rewards: {
          spiritualStones: { range: [1, 1], probability: 0.9 },
          spiritualQi: { range: [80, 120], probability: 0.8 }
        }
      },
      {
        eventId: 'encounter_beast',
        probability: 0.5,
        rewards: {
          experience: { range: [40, 60], probability: 0.8 },
          spiritualQi: { range: [70, 90], probability: 0.7 }
        }
      },
      {
        eventId: 'discover_cave',
        probability: 0.2,
        rewards: {
          spiritualStones: { range: [1, 3], probability: 0.6 },
          spiritualQi: { range: [180, 220], probability: 0.9 }
        }
      }
    ]
  },
  ANCIENT_RUINS: {
    id: 'ancient_ruins',
    name: '古迹遗址',
    description: '古老遗迹，藏有秘宝',
    level: 3,
    maxEvents: 2,
    events: [
      {
        eventId: 'find_artifact',
        probability: 0.2,
        rewards: {
          spiritualStones: { range: [4, 6], probability: 0.7 },
          experience: { range: [90, 110], probability: 0.8 }
        }
      },
      {
        eventId: 'trigger_formation',
        probability: 0.4,
        rewards: {
          experience: { range: [70, 90], probability: 0.8 },
          spiritualQi: { range: [140, 160], probability: 0.7 }
        }
      },
      {
        eventId: 'ancient_inheritance',
        probability: 0.1,
        rewards: {
          experience: { range: [180, 220], probability: 0.9 },
          spiritualStones: { range: [2, 4], probability: 0.6 }
        }
      }
    ]
  }
} as const

// 随机事件配置
export const RANDOM_EVENTS: Record<string, ExplorationEvent> = {
  find_herb: {
    id: 'find_herb',
    name: '发现灵草',
    description: '在路边发现了一株灵草'
  },
  meet_animal: {
    id: 'meet_animal',
    name: '遇见灵兽',
    description: '遇到了一只温顺的灵兽，获得了它的祝福'
  },
  peaceful_meditation: {
    id: 'peaceful_meditation',
    name: '静心冥想',
    description: '在宁静的环境中冥想，心境得到提升'
  },
  find_spirit_stone: {
    id: 'find_spirit_stone',
    name: '发现灵石',
    description: '在山洞中发现了一块灵石'
  },
  encounter_beast: {
    id: 'encounter_beast',
    name: '遭遇妖兽',
    description: '遭遇妖兽，经过一番搏斗后获胜'
  },
  discover_cave: {
    id: 'discover_cave',
    name: '发现洞府',
    description: '发现了一个隐秘的洞府，获得了一些修炼资源'
  },
  find_artifact: {
    id: 'find_artifact',
    name: '发现法器',
    description: '在遗迹中发现了一件古老的法器'
  },
  trigger_formation: {
    id: 'trigger_formation',
    name: '触发阵法',
    description: '意外触发了古老的阵法，获得了阵法的感悟'
  },
  ancient_inheritance: {
    id: 'ancient_inheritance',
    name: '古老传承',
    description: '获得了古老的修炼传承，修为大增'
  }
} as const

// 时光法宝品质
export enum TimeTreasureQuality {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

// 时光法宝配置
export interface TimeTreasure {
  id: string
  name: string
  description: string
  quality: TimeTreasureQuality
  speedMultiplier: number
  icon: string
}

// 时光法宝定义
export const TIME_TREASURES: Record<string, TimeTreasure> = {
  BRONZE_HOURGLASS: {
    id: 'bronze_hourglass',
    name: '青铜沙漏',
    description: '古老的青铜沙漏，能够轻微加速时间流逝',
    quality: TimeTreasureQuality.COMMON,
    speedMultiplier: 1.5,
    icon: '⏳'
  },
  SILVER_CHRONOMETER: {
    id: 'silver_chronometer',
    name: '白银时计',
    description: '精致的白银时计，蕴含着时间的奥秘',
    quality: TimeTreasureQuality.RARE,
    speedMultiplier: 2.0,
    icon: '⏰'
  }
} as const

// 游戏配置
export const GAME_CONFIG = {
  // 基础属性点数
  INITIAL_ATTRIBUTE_POINTS: 10,
  
  // 挂机间隔（毫秒）
  IDLE_INTERVAL: 1000,
  
  // 升级所需经验基数
  LEVEL_EXP_BASE: 100,
  LEVEL_EXP_MULTIPLIER: 1.5,
  
  // 突破成功率基础值
  BREAKTHROUGH_BASE_CHANCE: 0.6,
  
  // 探险时间（毫秒）
  EXPLORATION_TIME: 5000,
  
  // 存档数量限制
  MAX_SAVE_SLOTS: 5
} as const

// 计算升级所需经验
export function getRequiredExp(level: number): number {
  return Math.floor(GAME_CONFIG.LEVEL_EXP_BASE * Math.pow(GAME_CONFIG.LEVEL_EXP_MULTIPLIER, level - 1))
}

// 生成随机奖励
export function generateRandomRewards(rewardConfig: RewardConfig): Record<string, number> {
  const rewards: Record<string, number> = {}

  if (rewardConfig.spiritualQi && Math.random() < rewardConfig.spiritualQi.probability) {
    const [min, max] = rewardConfig.spiritualQi.range
    rewards.spiritualQi = Math.floor(Math.random() * (max - min + 1)) + min
  }

  if (rewardConfig.experience && Math.random() < rewardConfig.experience.probability) {
    const [min, max] = rewardConfig.experience.range
    rewards.experience = Math.floor(Math.random() * (max - min + 1)) + min
  }

  if (rewardConfig.spiritualStones && Math.random() < rewardConfig.spiritualStones.probability) {
    const [min, max] = rewardConfig.spiritualStones.range
    rewards.spiritualStones = Math.floor(Math.random() * (max - min + 1)) + min
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

// 计算属性对修炼速度的影响
export function getCultivationSpeedMultiplier(constitution: number, spiritualPower: number, comprehension: number): number {
  return 1 + (constitution * 0.05) + (spiritualPower * 0.1) + (comprehension * 0.08)
}

// 计算突破成功率
export function getBreakthroughChance(comprehension: number, currentLevel: number): number {
  const baseChance = GAME_CONFIG.BREAKTHROUGH_BASE_CHANCE
  const comprehensionBonus = comprehension * 0.02
  const levelPenalty = currentLevel * 0.01
  return Math.max(0.1, Math.min(0.95, baseChance + comprehensionBonus - levelPenalty))
}
