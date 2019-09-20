
class Character {
  constructor(args) {
    this.stats = {
      STR: 10,
      DEX: 10,
      CON: 10,
      INT: 10,
      WIS: 10,
      CHA: 10
    };
    this.name = "Ole' No Name";
    this.class = "Commoner";
    Object.assign(this, args);
    this.mods = stats2mods(this.stats);
  }
}

class Fighter extends Character {
  constructor(args) {
    super(args);
    this.statPrimary = "STR";
    this.statSecondary = "DEX";
    this.dumpStat = "INT";
    this.hitDie = 10;
    this.attacks = ["Shortsword","Longsword","Greatsword","Defend"];
  }
}

function stats2mods(stats) {
  let mods = {};
  Object.keys(stats).map(function(key, index) {
    mods[key] = Math.floor((stats[key]-10)/2);
  });
  return mods;
}

function roll(num, d, mod) {
  mod = !mod ? 0 : mod;
  for (i=0;i<num;i++) {
    mod += Math.ceil(Math.random()*d);
  }
  return mod;
}

function rollStats() {
  let out = [];
  // For each of your 6 stat values
  for (let i=0;i<6;i++) {
    let stat = [];
    // Roll a 6 sided die, 4 times
    for (let j=0;j<4;j++) {
      stat.push(roll(1,6));
    }
    // Drop the lowest (sort and shift) and sum, before adding to list of stats
    stat = stat.sort();
    stat.shift();
    stat = stat.reduce((a, b) => a + b, 0);
    out.push(stat);
  }
  return out;
}

console.log(rollStats());

//          __  _ ___ __  _
//   __  __/ /_(_) (_) /_(_)__  _____
//  / / / / __/ / / / __/ / _ \/ ___/
// / /_/ / /_/ / / / /_/ /  __(__  )
// \__,_/\__/_/_/_/\__/_/\___/____/

function statLongName(statKey) {
  return {STR:"Strength",DEX:"Dexterity",CON:"Constitution",INT:"Intelligence",WIS:"Wisdom",CHA:"Charisma"}[statKey];
}

function removeSmallest(numbers) {
    var min = Math.min.apply(null, numbers);
    numbers.forEach((v, k, arr) => v !== min || arr.splice(k,1));
    return numbers;
}
