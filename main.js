
// tabNav(evt,"Home")

function tabNav(evt, tabName) {
  console.log("I'm in the tabNav function");
  console.log(evt);
  console.log(tabName);
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("game-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("nav-link");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" selected", "");
  }
  document.getElementById(tabName).style.display = "inherit";
  evt.currentTarget.className += " selected";
}

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

class Rogue extends Character {
  constructor(args) {
    super(args);
    this.statPrimary = "DEX";
    this.statSecondary = "WIS";
    this.dumpStat = "CON";
    this.hitDie = 8;
    this.attacks = ['Sneaky Dagger','Also Sneaky Arrow','Distract','Hide'];
  }
}

class Wizard extends Character {
  constructor(args) {
    super(args);
    this.statPrimary = "INT";
    this.statSecondary = "CON";
    this.dumpStat = "STR";
    this.hitDie = 6;
    this.attacks = [];
  }
}

class Bard extends Character {
  constructor(args) {
    super(args);
    this.statPrimary = "CHA";
    this.statSecondary = "DEX";
    this.dumpStat = "WIS";
    this.hitDie = 8;
    this.attacks = ['Rapier','Lil Crossbow','Sing-a-song!','Mock Relentlessly'];
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
    for (let j=0;j<4;j++) {stat.push(roll(1,6));}
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
