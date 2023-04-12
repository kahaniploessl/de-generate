let theShader0;



function preload() {
  // load files
  
  theShader0 = loadShader("shader.vert", "shader4.frag");
 
  
}

function setup() {
  
  createCanvas(windowWidth, windowHeight, WEBGL);

}

function draw() {
  
  background(50,200,200);
  

  let seconds = millis() / 1000;
  
  
    
    // set new shader
    shader(theShader0);
    // set uniform data
    theShader0.setUniform("u_resolution", [width, height]);
    theShader0.setUniform("u_time", seconds);

    
  
  
  
  // draw rectangle relative to window size
  
  rectMode(CENTER);
  rect(0,0,width,height);

}

var pressedOnce = false;



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
