// 探险系统相关类型定义

// 奖励配置接口
export interface RewardConfig {
  spiritualQi?: { range: [number, number], probability: number }  // 灵气（练气经验）
  spiritualStones?: { range: [number, number], probability: number }  // 灵石（炼体经验）
  spiritCrystals?: { range: [number, number], probability: number }  // 灵晶（神通升级货币）
  divinePower?: {
    powerIds: string[],  // 可能获得的神通ID列表
    probability: number  // 获得神通的概率
  }  // 神通奖励
  enlightenmentExp?: {
    range: [number, number],
    probability: number,
    path: 'metal' | 'wood' | 'water' | 'fire' | 'earth' | 'time' | 'space'  // 指定哪条道
  }  // 悟道经验
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
