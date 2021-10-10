title = "Slide Hero";

description = ` [slide] to move`;

characters = [
  `
  l  l
   cc
   cc
  l  l
  `,
  `
  p p
 ppppp
 ppppp
  ppp
   p
 `,
 `
  p p
 p p p
 p   p
  p p
   p
 `,
];

options = {
  isReplayEnabled: true,
  viewSize: {
    x: 100,
    y: 100,
  },
  theme: "pixel",
  seed: 77,
  isPlayingBgm: true,
};

//Player Pointer/Crosshair Object
let ptr = {
  initx: 49,
  x: 49,
  y: 85,
  dir: 1,
  diff: 18,
  move(t){
    if(t == null){
      this.x += this.dir*this.diff;
      if(this.x == this.initx + (this.diff*2) || this.x == this.initx - (this.diff*2)) {
        this.dir *= -1;
      }
    } else {
      (t == 0) ? this.x = 49-18-18 : t = t;
      (t == 1) ? this.x = 49-18 : t = t;
      (t == 2) ? this.x = 49 : t = t;
      (t == 3) ? this.x = 49+18 : t = t;
      (t == 4) ? this.x = 49+18+18 : t = t;
    }
  },
  currentSpace(){
    if(this.x == this.initx) {
      return 2;
    } else if(this.x == this.initx - (2*this.diff)) {
      return 0;
    } else if(this.x == this.initx + (2*this.diff)) {
      return 4;
    } else if(this.x == this.initx - this.diff) {
      return 1;
    } else if(this.x == this.initx + this.diff) {
      return 3;
    }
  },
}

//Note Class
class Note {
  constructor(x,y,w,p,c,f){
    this.x = x;
    this.y = y;
    this.w = w;
    this.posIndex = p;
    this.color = c;
    this.fallSpeed = f;
  }
  draw(){
    color(this.color);
    rect(this.x, this.y, this.w, this.w);
  }
  update(){
    this.y += this.fallSpeed;
  }
  collisionTest(){
    if(this.y == 82){
      if(ptr.currentSpace() == this.posIndex){
        // let soundStr = notesounds[this.posIndex]
        // play(soundStr);
        return true;
      } else {
        return false;
      }
    }
  }
}

let noteArray = [];

let tickCount = 0;

let allcolors = ["black","blue","cyan","green","light_black","light_blue","light_cyan","light_green","light_purple","light_red","light_yellow","purple","red","yellow"];
// let allsounds = ["coin","laser","explosion","powerUp","hit","jump","select","lucky"]
// let notesounds = ["coin","hit","laser","select","coin"];

let hearts = 3;

let sqr1x = 46-18-18;
let sqr2x = 46-18;
let sqr3x = 46;
let sqr4x = 46+18;
let sqr5x = 46+18+18;
let sqry = 81;
let sqrw = 12;


function update() {
  if (!ticks) {
    
  }
  //Increase Counter
  tickCount++;

  if(spawnChance()) {
    spawnNote();
  }

  //Draw notes
  for(const element of noteArray) {
    element.draw();
    element.update();
  }

  //Score and Bounds Detection
  remove(noteArray, (n) => {
    if(n.collisionTest()) {
      addScore(1);
      color(n.color);
      particle(n.x,n.y);
      play("coin");
      return true;
    } else if(n.y> 100){
      play("explosion");
      hearts--;
      return true;
    } else {
      return false
    }
  });

  //HEARTS
  if(hearts > 2) {
    color("red");
    char("b", 15,3);
    char("b", 22,3);
    char("b", 29,3);
  } else if(hearts > 1) {
    color("red");
    char("b", 15,3);
    char("b", 22,3);
    char("c", 29,3);
  } else if(hearts > 0) {
    color("red");
    char("b", 15,3);
    char("c", 22,3);
    char("c", 29,3);
  } else if(hearts < 1) {
    color("red");
    char("c", 15,3);
    char("c", 22,3);
    char("c", 29,3);
    end();
  }
  
  
  //ARRAY of TARGETS
  color("black");
  emptyRect(sqr1x,sqry,sqrw);
  emptyRect(sqr2x,sqry,sqrw);
  emptyRect(sqr3x,sqry,sqrw);
  emptyRect(sqr4x,sqry,sqrw);
  emptyRect(sqr5x,sqry,sqrw);

  //CURSOR/POINTER
  color("black");
  char("a",ptr.x,ptr.y);

  //MOVE CURSOR/POINTER
  let mouseX = input.pos.x;
  (mouseX > 49-18-18-4 && mouseX < 49-18-18+13) ? ptr.move(0) : mouseX = mouseX;
  (mouseX > 49-18-4 && mouseX < 49-18+13) ? ptr.move(1) : mouseX = mouseX;
  (mouseX > 49-4 && mouseX < 49+13) ? ptr.move(2) : mouseX = mouseX;
  (mouseX > 49+18-4 && mouseX < 49+18+13) ? ptr.move(3) : mouseX = mouseX;
  (mouseX > 49+18+18-4 && mouseX < 49+18+18+13) ? ptr.move(4) : mouseX = mouseX;
}

function emptyRect(x,y,w,h){
  w-=1;
  x-=1;
  y-=1;
  if(h==null){
    line(x,y,x+w,y);
    line(x+w,y, x+w, y+w);
    line(x+w, y+w, x, y+w);
    line(x, y+w, x, y);
  } else {
    h-=1;
    line(x,y,x+w,y);
    line(x+w,y, x+w, y+h);
    line(x+w, y+h, x, y+h);
    line(x, y+h, x, y);
  }
}

function randItem(selectedArray) {
  return selectedArray[Math.floor(Math.random()*selectedArray.length)];
}

function spawnChance(){
  let seed = Math.random();
  let bool = false;
  (tickCount%20==0 && seed>0.90) ? bool = true : seed = seed;
  (tickCount%40==0 && seed>0.80) ? bool = true : seed = seed;
  (tickCount%60==0 && seed>0.70) ? bool = true : seed = seed;
  (tickCount%80==0 && seed>0.60) ? bool = true : seed = seed;
  (tickCount%100==0 && seed>0.50) ? bool = true : seed = seed;
  (tickCount%120==0 && seed>0.30) ? bool = true : seed = seed;
  (tickCount%140==0 && seed>0.10) ? bool = true : seed = seed;
  return bool;
}

function spawnNote(){
  let xArray = [11,29,47,65,83];
  let w = 6; //width
  let x = randItem(xArray); //x value
  let y = 0-w; //y value
  let p = xArray.indexOf(x); //pointer lane
  let c; //color
  (p == 0) ? c = "green" : c = c;
  (p == 1) ? c = "red" : c = c;
  (p == 2) ? c = "yellow" : c = c;
  (p == 3) ? c = "blue" : c = c;
  (p == 4) ? c = "light_red" : c = c;
  let f = 1; //fallSpeed
  let newNote = new Note(x,y,w,p,c,f);
  noteArray.push(newNote);
}