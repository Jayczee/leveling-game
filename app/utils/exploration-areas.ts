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
  SPIRIT_SPRING: {
    id: 'spirit_spring',
    name: '灵泉幽谷',
    description: '清澈灵泉，滋养心神',
    level: 5,
    maxEvents: 1,
    events: [
      {
        eventId: 'drink_spring_water',
        probability: 0.5,
        rewards: {
          spiritualQi: { range: [60, 90], probability: 0.8 },
          spiritualStones: { range: [8, 15], probability: 0.6 },
          spiritCrystals: { range: [2, 4], probability: 0.25 },
          enlightenmentExp: { range: [2, 4], probability: 0.3, path: 'water' }
        }
      },
      {
        eventId: 'meet_spirit',
        probability: 0.3,
        rewards: {
          spiritualQi: { range: [80, 120], probability: 0.9 },
          spiritCrystals: { range: [3, 6], probability: 0.4 },
          enlightenmentExp: { range: [3, 5], probability: 0.4, path: 'wood' }
        }
      },
      {
        eventId: 'gather_spirit_herb',
        probability: 0.2,
        rewards: {
          spiritualQi: { range: [100, 150], probability: 0.9 },
          spiritCrystals: { range: [5, 8], probability: 0.5 },
          enlightenmentExp: { range: [2, 6], probability: 0.3, path: 'earth' }
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

  THUNDER_CLIFF: {
    id: 'thunder_cliff',
    name: '雷鸣悬崖',
    description: '雷电交加，蕴含雷之奥义',
    level: 7,
    maxEvents: 1,
    events: [
      {
        eventId: 'lightning_strike',
        probability: 0.4,
        rewards: {
          spiritualQi: { range: [90, 130], probability: 0.8 },
          spiritualStones: { range: [15, 25], probability: 0.7 },
          spiritCrystals: { range: [3, 7], probability: 0.3 },
          divinePower: { powerIds: ['IRON_BONE'], probability: 0.04 },
          enlightenmentExp: { range: [2, 5], probability: 0.35, path: 'fire' }
        }
      },
      {
        eventId: 'thunder_meditation',
        probability: 0.3,
        rewards: {
          spiritualQi: { range: [110, 160], probability: 0.9 },
          spiritCrystals: { range: [4, 8], probability: 0.35 },
          enlightenmentExp: { range: [3, 6], probability: 0.4, path: 'metal' }
        }
      },
      {
        eventId: 'find_thunder_crystal',
        probability: 0.15,
        rewards: {
          spiritualQi: { range: [140, 200], probability: 0.9 },
          spiritCrystals: { range: [8, 15], probability: 0.6 },
          enlightenmentExp: { range: [4, 8], probability: 0.5, path: 'fire' }
        }
      }
    ]
  },

  ANCIENT_RUINS: {
    id: 'ancient_ruins',
    name: '古迹遗址',
    description: '古老遗迹，藏有秘宝',
    level: 10,
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
    level: 13,
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
  },

  MYSTIC_FOREST: {
    id: 'mystic_forest',
    name: '神秘密林',
    description: '古木参天，灵兽出没',
    level: 15,
    maxEvents: 1,
    events: [
      {
        eventId: 'ancient_tree_spirit',
        probability: 0.3,
        rewards: {
          spiritualQi: { range: [900, 1300], probability: 0.9 },
          spiritualStones: { range: [450, 650], probability: 0.8 },
          spiritCrystals: { range: [140, 200], probability: 0.8 },
          divinePower: { powerIds: ['IMMORTAL_FLESH', 'DRAGON_ELEPHANT_POWER'], probability: 0.16 },
          enlightenmentExp: { range: [28, 45], probability: 0.8, path: 'wood' }
        }
      },
      {
        eventId: 'spirit_beast_king',
        probability: 0.2,
        rewards: {
          spiritualQi: { range: [1100, 1500], probability: 0.9 },
          spiritualStones: { range: [550, 800], probability: 0.9 },
          spiritCrystals: { range: [180, 260], probability: 0.9 },
          divinePower: { powerIds: ['DRAGON_ELEPHANT_POWER'], probability: 0.2 },
          enlightenmentExp: { range: [35, 55], probability: 0.85, path: 'earth' }
        }
      },
      {
        eventId: 'world_tree_blessing',
        probability: 0.1,
        rewards: {
          spiritualQi: { range: [1300, 2000], probability: 0.9 },
          spiritualStones: { range: [700, 1100], probability: 0.9 },
          spiritCrystals: { range: [220, 350], probability: 0.9 },
          enlightenmentExp: { range: [40, 70], probability: 0.9, path: 'wood' }
        }
      }
    ]
  },

  CRYSTAL_CAVE: {
    id: 'crystal_cave',
    name: '水晶洞窟',
    description: '晶莹剔透的洞窟，蕴含纯净能量',
    level: 17,
    maxEvents: 1,
    events: [
      {
        eventId: 'mine_crystal',
        probability: 0.4,
        rewards: {
          spiritualQi: { range: [180, 240], probability: 0.8 },
          spiritualStones: { range: [80, 120], probability: 0.8 },
          spiritCrystals: { range: [12, 20], probability: 0.6 },
          divinePower: { powerIds: ['GOLDEN_BODY'], probability: 0.06 },
          enlightenmentExp: { range: [4, 8], probability: 0.4, path: 'metal' }
        }
      },
      {
        eventId: 'resonate_crystal',
        probability: 0.3,
        rewards: {
          spiritualQi: { range: [200, 280], probability: 0.9 },
          spiritCrystals: { range: [15, 25], probability: 0.7 },
          enlightenmentExp: { range: [5, 10], probability: 0.5, path: 'space' }
        }
      },
      {
        eventId: 'crystal_formation',
        probability: 0.15,
        rewards: {
          spiritualQi: { range: [250, 350], probability: 0.9 },
          spiritualStones: { range: [100, 150], probability: 0.8 },
          spiritCrystals: { range: [20, 35], probability: 0.8 },
          enlightenmentExp: { range: [6, 12], probability: 0.6, path: 'earth' }
        }
      }
    ]
  },

  FLAME_ABYSS: {
    id: 'flame_abyss',
    name: '烈焰深渊',
    description: '炽热火海，试炼意志',
    level: 20,
    maxEvents: 1,
    events: [
      {
        eventId: 'fire_trial',
        probability: 0.3,
        rewards: {
          spiritualQi: { range: [280, 380], probability: 0.8 },
          spiritualStones: { range: [150, 220], probability: 0.8 },
          spiritCrystals: { range: [25, 40], probability: 0.7 },
          divinePower: { powerIds: ['VAJRA_BODY', 'IMMORTAL_FLESH'], probability: 0.1 },
          enlightenmentExp: { range: [8, 15], probability: 0.6, path: 'fire' }
        }
      },
      {
        eventId: 'flame_phoenix',
        probability: 0.2,
        rewards: {
          spiritualQi: { range: [350, 450], probability: 0.9 },
          spiritualStones: { range: [200, 280], probability: 0.8 },
          spiritCrystals: { range: [35, 55], probability: 0.8 },
          divinePower: { powerIds: ['DRAGON_ELEPHANT_POWER'], probability: 0.15 },
          enlightenmentExp: { range: [10, 20], probability: 0.7, path: 'fire' }
        }
      },
      {
        eventId: 'molten_treasure',
        probability: 0.1,
        rewards: {
          spiritualQi: { range: [400, 600], probability: 0.9 },
          spiritualStones: { range: [250, 350], probability: 0.9 },
          spiritCrystals: { range: [50, 80], probability: 0.9 },
          enlightenmentExp: { range: [12, 25], probability: 0.8, path: 'metal' }
        }
      }
    ]
  },

  VOID_SANCTUARY: {
    id: 'void_sanctuary',
    name: '虚空圣域',
    description: '空间扭曲，法则显现',
    level: 23,
    maxEvents: 1,
    events: [
      {
        eventId: 'spatial_rift',
        probability: 0.25,
        rewards: {
          spiritualQi: { range: [400, 550], probability: 0.8 },
          spiritualStones: { range: [200, 300], probability: 0.8 },
          spiritCrystals: { range: [40, 60], probability: 0.8 },
          divinePower: { powerIds: ['IMMORTAL_FLESH', 'DRAGON_ELEPHANT_POWER'], probability: 0.12 },
          enlightenmentExp: { range: [10, 18], probability: 0.7, path: 'space' }
        }
      },
      {
        eventId: 'void_comprehension',
        probability: 0.3,
        rewards: {
          spiritualQi: { range: [350, 500], probability: 0.9 },
          spiritCrystals: { range: [30, 50], probability: 0.8 },
          enlightenmentExp: { range: [12, 22], probability: 0.8, path: 'time' }
        }
      },
      {
        eventId: 'dimensional_treasure',
        probability: 0.08,
        rewards: {
          spiritualQi: { range: [500, 800], probability: 0.9 },
          spiritualStones: { range: [300, 450], probability: 0.9 },
          spiritCrystals: { range: [60, 100], probability: 0.9 },
          enlightenmentExp: { range: [15, 30], probability: 0.9, path: 'space' }
        }
      }
    ]
  },

  CELESTIAL_PEAK: {
    id: 'celestial_peak',
    name: '天帝峰',
    description: '九天之巅，仙气缭绕',
    level: 26,
    maxEvents: 1,
    events: [
      {
        eventId: 'celestial_blessing',
        probability: 0.2,
        rewards: {
          spiritualQi: { range: [600, 800], probability: 0.9 },
          spiritualStones: { range: [300, 500], probability: 0.9 },
          spiritCrystals: { range: [80, 120], probability: 0.9 },
          divinePower: { powerIds: ['DRAGON_ELEPHANT_POWER'], probability: 0.18 },
          enlightenmentExp: { range: [20, 35], probability: 0.8, path: 'time' }
        }
      },
      {
        eventId: 'heavenly_dao',
        probability: 0.15,
        rewards: {
          spiritualQi: { range: [700, 1000], probability: 0.9 },
          spiritCrystals: { range: [100, 150], probability: 0.9 },
          enlightenmentExp: { range: [25, 50], probability: 0.9, path: 'time' }
        }
      },
      {
        eventId: 'immortal_artifact',
        probability: 0.05,
        rewards: {
          spiritualQi: { range: [800, 1200], probability: 0.9 },
          spiritualStones: { range: [500, 800], probability: 0.9 },
          spiritCrystals: { range: [120, 200], probability: 0.9 },
          enlightenmentExp: { range: [30, 60], probability: 0.95, path: 'metal' }
        }
      }
    ]
  },

  SHADOW_MARSH: {
    id: 'shadow_marsh',
    name: '幽影沼泽',
    description: '诡异沼泽，暗影重重',
    level: 29,
    maxEvents: 1,
    events: [
      {
        eventId: 'shadow_wraith',
        probability: 0.4,
        rewards: {
          spiritualQi: { range: [500, 700], probability: 0.8 },
          spiritualStones: { range: [250, 400], probability: 0.8 },
          spiritCrystals: { range: [60, 90], probability: 0.7 },
          divinePower: { powerIds: ['IMMORTAL_FLESH'], probability: 0.1 },
          enlightenmentExp: { range: [15, 25], probability: 0.6, path: 'water' }
        }
      },
      {
        eventId: 'dark_ritual',
        probability: 0.2,
        rewards: {
          spiritualQi: { range: [600, 900], probability: 0.9 },
          spiritCrystals: { range: [80, 120], probability: 0.8 },
          enlightenmentExp: { range: [18, 30], probability: 0.7, path: 'earth' }
        }
      },
      {
        eventId: 'forbidden_knowledge',
        probability: 0.1,
        rewards: {
          spiritualQi: { range: [800, 1200], probability: 0.9 },
          spiritualStones: { range: [400, 600], probability: 0.8 },
          spiritCrystals: { range: [100, 150], probability: 0.9 },
          enlightenmentExp: { range: [25, 45], probability: 0.85, path: 'time' }
        }
      }
    ]
  },

  STAR_OBSERVATORY: {
    id: 'star_observatory',
    name: '观星台',
    description: '仰望星空，参悟天机',
    level: 32,
    maxEvents: 1,
    events: [
      {
        eventId: 'star_alignment',
        probability: 0.3,
        rewards: {
          spiritualQi: { range: [700, 1000], probability: 0.9 },
          spiritualStones: { range: [350, 500], probability: 0.8 },
          spiritCrystals: { range: [90, 130], probability: 0.8 },
          divinePower: { powerIds: ['DRAGON_ELEPHANT_POWER'], probability: 0.12 },
          enlightenmentExp: { range: [20, 35], probability: 0.8, path: 'time' }
        }
      },
      {
        eventId: 'cosmic_insight',
        probability: 0.2,
        rewards: {
          spiritualQi: { range: [800, 1200], probability: 0.9 },
          spiritCrystals: { range: [120, 180], probability: 0.9 },
          enlightenmentExp: { range: [30, 50], probability: 0.9, path: 'space' }
        }
      },
      {
        eventId: 'stellar_treasure',
        probability: 0.08,
        rewards: {
          spiritualQi: { range: [1000, 1500], probability: 0.9 },
          spiritualStones: { range: [600, 900], probability: 0.9 },
          spiritCrystals: { range: [150, 250], probability: 0.9 },
          enlightenmentExp: { range: [35, 60], probability: 0.9, path: 'metal' }
        }
      }
    ]
  },

  IMMORTAL_GARDEN: {
    id: 'immortal_garden',
    name: '仙人花园',
    description: '仙人培植的神奇花园，生机盎然',
    level: 35,
    maxEvents: 1,
    events: [
      {
        eventId: 'immortal_fruit',
        probability: 0.25,
        rewards: {
          spiritualQi: { range: [800, 1200], probability: 0.9 },
          spiritualStones: { range: [400, 600], probability: 0.9 },
          spiritCrystals: { range: [120, 180], probability: 0.8 },
          divinePower: { powerIds: ['IMMORTAL_FLESH', 'DRAGON_ELEPHANT_POWER'], probability: 0.15 },
          enlightenmentExp: { range: [25, 40], probability: 0.8, path: 'wood' }
        }
      },
      {
        eventId: 'life_essence',
        probability: 0.3,
        rewards: {
          spiritualQi: { range: [600, 1000], probability: 0.9 },
          spiritualStones: { range: [300, 500], probability: 0.8 },
          spiritCrystals: { range: [100, 150], probability: 0.8 },
          enlightenmentExp: { range: [22, 38], probability: 0.8, path: 'earth' }
        }
      },
      {
        eventId: 'garden_guardian',
        probability: 0.15,
        rewards: {
          spiritualQi: { range: [1000, 1400], probability: 0.9 },
          spiritualStones: { range: [500, 800], probability: 0.9 },
          spiritCrystals: { range: [150, 220], probability: 0.9 },
          enlightenmentExp: { range: [30, 50], probability: 0.85, path: 'water' }
        }
      }
    ]
  },

  CHAOS_REALM: {
    id: 'chaos_realm',
    name: '混沌之域',
    description: '天地初开之地，混沌法则弥漫',
    level: 40,
    maxEvents: 1,
    events: [
      {
        eventId: 'chaos_energy',
        probability: 0.2,
        rewards: {
          spiritualQi: { range: [1200, 1800], probability: 0.9 },
          spiritualStones: { range: [600, 1000], probability: 0.9 },
          spiritCrystals: { range: [200, 300], probability: 0.9 },
          divinePower: { powerIds: ['DRAGON_ELEPHANT_POWER'], probability: 0.2 },
          enlightenmentExp: { range: [40, 70], probability: 0.9, path: 'time' }
        }
      },
      {
        eventId: 'primordial_law',
        probability: 0.15,
        rewards: {
          spiritualQi: { range: [1500, 2200], probability: 0.9 },
          spiritCrystals: { range: [250, 400], probability: 0.9 },
          enlightenmentExp: { range: [50, 80], probability: 0.95, path: 'space' }
        }
      },
      {
        eventId: 'chaos_artifact',
        probability: 0.05,
        rewards: {
          spiritualQi: { range: [2000, 3000], probability: 0.9 },
          spiritualStones: { range: [1000, 1500], probability: 0.9 },
          spiritCrystals: { range: [300, 500], probability: 0.9 },
          enlightenmentExp: { range: [60, 100], probability: 0.95, path: 'metal' }
        }
      }
    ]
  }
} as const
