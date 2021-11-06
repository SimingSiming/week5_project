let state = 'collect';

// for drawing purpose
let myX = [];
let myY = [];

function setup() {
  let cnv = createCanvas(800, 800);
  cnv.position(200,200);

  let options = {
    inputs: ['x'], 
    outputs: ['y'],
    task: 'regression',
    debug: 'true'
  }
  model = ml5.neuralNetwork(options);
}


function keyPressed(){
  if (key == 't'){
    state = 'train'; 
    console.log('training started');
    model.normalizeData();
    let options = {
      epochs: 100
    };
    model.train(options, whileTraining, finishedTraining);
  }
}
function whileTraining(epoch, loss){
  console.log(epoch);
}

function finishedTraining(){
  console.log('training finished'); 
  state = 'predict';
}

function mousePressed(){
  let inputs = {
    x: mouseX
  };
  let target_y = mouseY;

  // for drawing 
  myX.push(mouseX); 
  myY.push(mouseY);

  if (state == 'collect'){
    let target = {
      y: target_y 
    };
    model.addData(inputs, target);
    }
  else if (state == 'predict'){
    model.predict(inputs, myResults);
  }
} 

let myVal;
function myResults(error, results){
  if (error){
    console.error(error);
    return;
  }
  console.log(results[0].y);
  myVal = results[0].y;
}

function aperson(x,y){
  circle(x, y-25, 20);
  line(x, y-7, x, y-15);
  line(x, y-7, x+6, y+8);
  line(x-10, y-7, x + 10, y-7);
  line(x, y-10, x-6, y+8);
}

function draw(){
  background(220);
  if (state == 'collect'){
   textSize(15);
   text('Press your mouse to create humans', 250, 80);
   textSize(15);
   text('When you are ready, press \" t \" to create social expectation', 170, 100);

   for (let i = 0; i < myX.length; i+=1){
   aperson(myX[i], myY[i]);
   }
  }
  else if (state == 'predict'){
    textSize(15); 
    text('Press mouse again to create new humans', 250, 80); 

    let last = myX.length - 1;
    for (let i = 0; i < myX.length; i+=1){
      aperson(myX[i], myY[i]);
      }

    if (myY[last] != myVal){
      let step = (myVal - myY[last]) / 100;
      myY[last] += step; 
    }
  }
}
