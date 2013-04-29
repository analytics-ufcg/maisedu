// Global variables
float radius = 50.0;
boolean dragging=false;

//Canvas Variables
int height=400;
int width=550;
int margin=50;
int nX, nY;

//Bargraph Variables
int length=5;
int horzstep=0;
int linethickness=3;
int barwidth=50;

//Data variables
int[] Y=new int[length]; //used to invert data[] while drawing the graph since (0,0) is at the top of the canvas
int[] data=new int[length]; //the data array
int[] datas=new int[length]; //the data array scaled to fit within the graphing region
string[] label=new string[length]; //the labels for the data array

//Define the data and labels to be graphed
data = {50,75,200,150,35,60,120,45,200,35};
label = {"2008","2009","2010","2011","2012","2013","2014","2015","2016","2017"};
length=data.length; //the length of the data array to be used in the for loops

// Setup the Processing Canvas
void setup(){
  int maxd = max(data); //get the max data value to use for scaling
  size( width, height ); //define the canvas size
  frameRate( 15 ); //define the frame rate
  for(int i=0; i<length;i++){
    Y[i]=height-2*margin; //base point of the bars
    datas[i] = ((height-2*margin)/maxd)*data[i]; //scale the data array to fit within the graph region
  }
  horzstep=(width-2*margin)/(length); //evenly space the bars
  barwidth=0.6*horzstep; //adjust the bar width for aesthetics
} //end setup()

// Main draw loop
void draw(){
  // Fill canvas grey
  background( 100 );   
  fill( 0, 121, 184 );
  stroke(255); 
  bargra(); //draw the bars
  grid(); //draw the grid
} //end main draw()

void grid() {
  strokeWeight(1);
  stroke(230,230,0);
  line(0.9*margin,height-0.9*margin,0.9*margin,0.9*margin); //vertical line
  line(0.9*margin,height-0.9*margin,width-margin,height-0.9*margin); //horizontal line
  for(int i=margin; i<height-margin;i+=40){
  line(0.9*margin-4,height-i,0.9*margin+4,height-i); //vertical tick marks
  }
}

void bargra() {
  strokeWeight( linethickness ); //bar border thickness     
  for(int i=0;i<length;i++){
    if(Y[i]>(height-2*margin-datas[i])) {
      if(Y[i]-30>0){Y[i]-=30;}else{Y[i]=height-2*margin-datas[i];} //grow each bar
    }

    if((nX>(margin+0.5*horzstep-0.5*barwidth+horzstep*i))&(nX<(margin+0.5*horzstep-0.5*barwidth+horzstep*i+barwidth))&(nY>Y[i]+margin)&nY<(Y[i]+margin+height-2*margin-Y[i])){
      fill(121,121,184);
    } else {
      fill(0,121,184);
    }

    rect(margin+0.5*horzstep-0.5*barwidth+horzstep*i,Y[i]+margin,barwidth,height-2*margin-Y[i]); //draw each bar
    fill(230,230,0);
    text(label[i],margin-0.5*barwidth+0.5*horzstep+5+horzstep*i,height-0.9*margin+14); //label each bar
  }
}

void touchMove(TouchEvent touchEvent) {
  nX = touchEvent.touches[0].offsetX;
  nY = touchEvent.touches[0].offsetY;  
}
void touchEnd(TouchEvent touchEvent){
  nX = touchEvent.touches[0].offsetX;
  nY = touchEvent.touches[0].offsetY;  
}
void mouseClicked() {
  nX = mouseX;
  nY = mouseY;
}
