// 探险随机事件配置

import type { ExplorationEvent } from './exploration-types'

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
