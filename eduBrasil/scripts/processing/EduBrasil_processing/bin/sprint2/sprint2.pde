  
  
  import processing.core.*;
  import processing.event.TouchEvent;
  
  
    // Global variables
  
    int height=500;
    int width=500;
    int margin;
    int nX, nY;
  
    int length=1;
    int horzstep=0;
    int linethickness=3;
    double barwidth=50;
    
    int[] Y = new int[length]; 
    int[] data = {50}; 
    int[] datas = new int[length];
    String[] label = {"2008"};
    
    float radius = 50;
    boolean dragging=false;
    //length=data.length;
    
    // Setup the Processing Canvas
    public void setup(){    
      size( width, height ); //define the canvas size
      
       //the length of the data array to be used in the for loops
      int maxd = max(data); //get the max data value to use for scaling
      
      frameRate( 15 ); //define the frame rate
      System.out.println(length);
      for(int i=0; i<length;i++){
        Y[i]=height-2*margin; //base point of the bars
        datas[i] = ((height-2*margin)/maxd)*data[i]; //scale the data array to fit within the graph region
      }
      horzstep=(width-2*margin)/(length); //evenly space the bars
      barwidth=0.25*horzstep; //adjust the bar width for aesthetics
    } //end setup()
  
    // Main draw loop
    public void draw(){
      // Fill canvas grey
      background( 100 );   
      fill( 0, 121, 184 );
      stroke(255); 
      bargra(); //draw the bars
      grid(); //draw the grid
    } //end main draw()
  
    public void grid() {
      strokeWeight(1);
      stroke(230,230,0);
      line((float) 0.9*margin, (float) ((float) height-0.9*margin), (float) 0.9*margin, (float) 0.9*margin); //vertical line
      line((float) 0.9*margin, (float) (height-0.9*margin), (float) (width-margin),(float) (height-0.9*margin)); //horizontal line
      for(int i=margin; i<height-margin;i+=40){
        line((float) (0.9*margin-4), (float) (height-i), (float) (0.9*margin+4), (float)(height-i)); //vertical tick marks
      }
    }
  
    public void bargra() {
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
  
        rect((float) (margin+0.5*horzstep-0.5*barwidth+horzstep*i),Y[i]+margin,(float) barwidth,height-2*margin-Y[i]); //draw each bar
        fill(230,230,0);
        text(label[i], (float)  (margin-0.5*barwidth+0.5*horzstep+5+horzstep*i), (float) (height-0.9*margin+14)); //label each bar
      }
    }
  
    public void touchMove(TouchEvent touchEvent) {
      //touchEvent.
      //nX = touchEvent.touches[0].offsetX;
      //nY = touchEvent.touches[0].offsetY;  
    }
  
    public void touchEnd(TouchEvent touchEvent){
      //nX = touchEvent.touches[0].offsetX;
      //nY = touchEvent.touches[0].offsetY;  
    }
  
    public void mouseClicked() {
      nX = mouseX;
      nY = mouseY;
    }
  

