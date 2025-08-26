// 测试升级机制的脚本
// 在浏览器控制台中运行此脚本来测试升级功能

console.log('开始测试升级机制...');

// 获取角色store
const characterStore = useCharacterStore();

if (!characterStore.character) {
  console.log('请先创建角色');
} else {
  console.log('当前角色信息:');
  console.log('练气等级:', characterStore.character.cultivation.qiCultivation.level);
  console.log('练气经验:', characterStore.character.resources.spiritualQi);
  console.log('炼体等级:', characterStore.character.cultivation.bodyCultivation.level);
  console.log('炼体经验:', characterStore.character.resources.spiritualStones);
  
  // 测试练气升级
  console.log('\n测试练气升级...');
  console.log('当前练气等级信息:', characterStore.currentQiLevelInfo);
  
  // 给予足够的练气经验来升级
  const qiExpNeeded = characterStore.currentQiLevelInfo?.levelInfo?.requiredExp || 100;
  console.log('需要经验:', qiExpNeeded);
  
  // 给予经验
  characterStore.gainQiExperience(qiExpNeeded);
  
  console.log('升级后:');
  console.log('练气等级:', characterStore.character.cultivation.qiCultivation.level);
  console.log('练气经验:', characterStore.character.resources.spiritualQi);
  
  // 测试炼体升级
  console.log('\n测试炼体升级...');
  console.log('当前炼体等级信息:', characterStore.currentBodyLevelInfo);
  
  const bodyExpNeeded = characterStore.currentBodyLevelInfo?.levelInfo?.requiredExp || 100;
  console.log('需要经验:', bodyExpNeeded);
  
  // 给予经验
  characterStore.gainBodyExperience(bodyExpNeeded);
  
  console.log('升级后:');
  console.log('炼体等级:', characterStore.character.cultivation.bodyCultivation.level);
  console.log('炼体经验:', characterStore.character.resources.spiritualStones);
  
  // 测试连续升级
  console.log('\n测试连续升级...');
  characterStore.gainQiExperience(1000); // 给予大量经验
  console.log('大量经验后练气等级:', characterStore.character.cultivation.qiCultivation.level);
  console.log('剩余练气经验:', characterStore.character.resources.spiritualQi);
  
  characterStore.gainBodyExperience(1000); // 给予大量经验
  console.log('大量经验后炼体等级:', characterStore.character.cultivation.bodyCultivation.level);
  console.log('剩余炼体经验:', characterStore.character.resources.spiritualStones);
  
  // 测试突破按钮显示
  console.log('\n测试突破按钮显示:');
  console.log('需要练气突破:', characterStore.needQiBreakthrough);
  console.log('需要炼体突破:', characterStore.needBodyBreakthrough);
  console.log('可以获得练气经验:', characterStore.canGainQiExperience);
  console.log('可以获得炼体经验:', characterStore.canGainBodyExperience);
}

console.log('测试完成');
