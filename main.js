
$( document ).ready(function() {
  $('.char-add').hide();
  $('.roll-stats').hide();
  $('.stat-list').hide();
});

function showCharAdd() {$('.char-add').show();}
function showRollStats() {$('.roll-stats').show();}
function showStatList() {$('.stat-list').show();}

let charList = [];
// TAB NAVIGATION - Ripped from StackOverflow *thumbs-up*
function tabNav(evt, tabName) {
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

function classNav(evt, className) {
  // For notes
  document.getElementById("classSelected").innerHTML = className;
  document.getElementById("statPrimary").innerHTML = statLongName(sp[className]);
  document.getElementById("statSecondary").innerHTML = statLongName(ss[className]);
  document.getElementById("dumpStat").innerHTML = statLongName(ds[className]);

  var i, classcontent, classlinks;
  classlinks = document.getElementsByClassName("classlinks");
  for (i = 0; i < classlinks.length; i++) {
    classlinks[i].className = classlinks[i].className.replace(" class-selected", "");
  }
  evt.currentTarget.className += " class-selected";
}

function swapStatLeft() {

}

function swapStatRight() {

}

class Character {
  constructor(args) {
    this.stats = {STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10};
    this.name = "Ole' No Name";
    this.class = "Commoner";
    this.hitDie = 6;
    Object.assign(this, args);
    this.statsStr = "";
    for (const [key, value] of Object.entries(this.stats)) {
      this.statsStr += (`  ${key} : ${value},  `);
    }
    this.statsStr = this.statsStr.slice(0, -3);
    this.mods = stats2mods(this.stats);
    this.maxhp = this.hitDie + this.mods.CON;
    this.hp = this.maxhp;
    this.level = 1;
    this.xp = 0;
  }

  updateMaxHP() {this.maxhp = this.hitDie + this.mods.CON + (this.level-1) * Math.ceil(this.hitDie/2);}

  refillHP() {this.hp = this.maxhp;}
}

class Fighter extends Character {
  constructor(args) {
    super(args);
    this.class = "Fighter";
    this.hitDie = 10;
    this.updateMaxHP();
    this.refillHP();
    this.attacks = ["Shortsword","Longsword","Greatsword","Defend"];
  }
}

class Rogue extends Character {
  constructor(args) {
    super(args);
    this.class = "Rogue";
    this.hitDie = 8;
    this.updateMaxHP();
    this.refillHP();
    this.attacks = ['Sneaky Dagger','Also Sneaky Arrow','Distract','Hide'];
  }
}

class Wizard extends Character {
  constructor(args) {
    super(args);
    this.class = "Wizard";
    this.hitDie = 6;
    this.updateMaxHP();
    this.refillHP();
    this.attacks = [];
  }
}

class Bard extends Character {
  constructor(args) {
    super(args);
    this.class = "Bard";
    this.hitDie = 8;
    this.updateMaxHP();
    this.refillHP();
    this.attacks = ['Rapier','Lil Crossbow','Sing-a-song!','Mock Relentlessly'];
  }
}

let statHeaders = ["STR","DEX","CON","INT","WIS","CHA"];
let sp = {Fighter:"STR", Rogue:"DEX", Wizard:"INT", Bard:"CHA"};
let ss = {Fighter:"DEX", Rogue:"WIS", Wizard:"CON", Bard:"DEX"};
let ds = {Fighter:"INT", Rogue:"CON", Wizard:"STR", Bard:"WIS"};

function addCharacter(character) {
  charList.push(character);
  let context = {chars: charList};
  let source = $('#char-template').html();
  let template = Handlebars.compile(source);
  let charListHtml = template(context);
  $('.char-list').html(charListHtml);
}

addCharacter(new Fighter({name:"Terry", stats:{STR:20,DEX:20,CON:15,INT:3,WIS:4,CHA:5}}));
addCharacter(new Bard({name: "Wolfgang Wallace"}));
// AddCharacterFromPage();

function AddCharacterFromPage() {
  let statArray = $('.stat-num');
  console.log("this shouuld be the stat arrary" + Object.entries(statArray));
  let out = {name: $('.char-name')[0].value, stats:{}};
  console.log("This should be the name and empty stat array: " + Object.entries(out));

  for (i=0;i<statArray.length;i++) {
    out.stats[statHeaders[i]] = Number(statArray[i].innerHTML.split("<")[0]);
  }
  let classNameSelected = document.getElementById("classSelected").innerHTML;
  console.log(classNameSelected);
  console.log("This is the object going into addCharacter(): " + Object.entries(out.stats));

  if (classNameSelected == 'Fighter') {addCharacter(new Fighter(out));
  } else if (classNameSelected == 'Rogue') {addCharacter(new Rogue(out));
  } else if (classNameSelected == 'Wizard') {addCharacter(new Wizard(out));
  } else if (classNameSelected == 'Bard') {addCharacter(new Bard(out));
  } else {addCharacter(new Character(out));}

}

//          __  _ ___ __  _
//   __  __/ /_(_) (_) /_(_)__  _____
//  / / / / __/ / / / __/ / _ \/ ___/
// / /_/ / /_/ / / / /_/ /  __(__  )
// \__,_/\__/_/_/_/\__/_/\___/____/

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
  // Update the stat objects on the html page
  let statlist = document.getElementsByClassName("stat-num");
  for (let i=0;i<statlist.length;i++) {
    statlist[i].innerHTML = out[i].toString().concat(statlist[i].innerHTML.slice(-14));
  }
  return out;
}

function statLongName(statKey) {
  return {STR:"Strength",DEX:"Dexterity",CON:"Constitution",INT:"Intelligence",WIS:"Wisdom",CHA:"Charisma"}[statKey];
}
