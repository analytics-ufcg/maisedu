import org.gicentre.utils.colour.*;
import org.gicentre.utils.io.*;
import org.gicentre.utils.gui.*;
import org.gicentre.utils.multisketch.*;
import org.gicentre.utils.move.*;
import org.gicentre.utils.stat.*;
import org.gicentre.utils.*;
import org.gicentre.utils.network.*;
import org.gicentre.utils.spatial.*;
import org.gicentre.utils.geom.*;
import org.gicentre.utils.network.traer.animation.*;
import org.gicentre.utils.text.*;
import org.gicentre.utils.network.traer.physics.*;
import java.awt.Color;
import java.util.List;
import org.geotools.shapefile.Shapefile;
import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jump.feature.Feature;
import com.vividsolutions.jump.feature.FeatureCollection;
import com.vividsolutions.jump.io.DriverProperties;
import com.vividsolutions.jump.io.ShapefileReader;

int x = 10;
int y = 50;
int w = 250;
int h = 30;

int nIndicators = 10;
Button[] indicators = new Button[nIndicators];

PImage heatMap;
String[] testBase;
String[] line25;
BarChart barChart;
List features;
float symbolRadius;
Color symbolColor;
Shapefile shp;
  
float minx,miny,maxx,maxy,mwidth,mheight;
float ceny,cenx,panx,pany;
float scalex,scaley,mapscale,mapoffsetx,mapoffsety;
float zoomfactor;
float mpointx, mpointy, mpointz, jpointx, jpointy, jpointz;
FeatureCollection fc ;
Shape[] shapes;
int width = 1000;
int height = 500;
  
void setup(){
 heatMap = loadImage("paraiba.png");
 size(1300,700);
 background(255);
 createButtons();
 testBase = loadStrings("baseTeste2.txt");
 line25 = testBase[25].split(",");
 smooth();
 colorMode(HSB,255);
 shapes = new Shape[223];
 String filename= "25mu2500gsr.shp";
 
 try {
   
   //First thing is to create a shapefile reader
   ShapefileReader reader = new ShapefileReader();

   //Then we can retrieve all features as a collection (FeatureCollection in OpenJUMP)
   fc = reader.read(new DriverProperties(filename));

   //We want to retrieve individual features so we put them in a List. No knowledge of their geometry type is required at this point.
   features = fc.getFeatures();

   System.out.println("Shapefile opened!");
   System.out.println("Found "+features.size()+" features.");

   //Store the minimum and maximum values of the bounding box, we need them to calculate the scale
   minx=(float) fc.getEnvelope().getMinX();
   miny=(float) fc.getEnvelope().getMinY();
   maxx=(float) fc.getEnvelope().getMaxX();
   maxy=(float) fc.getEnvelope().getMaxY();
 }
 catch (Exception e)
 {
   println("Oops�could not open that shapefile�Make sure the full path and filename is correct and always include the .shp extension!");
   println(e.getMessage());
 }

 //By changing this we can zoom in and out.
 zoomfactor=1;

 //Change this (according to the units of the shapefile) to draw a different region of the shapefile, or use it in a pan control
 panx=0;
 pany=0;

 //Calculate the scale
 mwidth = maxx-minx;
 mheight = maxy-miny;
 cenx = minx+(mwidth)/2 + panx;
 ceny = miny+(mheight)/2 + pany;
 scalex = abs(mwidth)/width;
 scaley = abs(mheight)/height;
 mapscale = max(scaley,scalex);

 //If we define a zoomfactor or some pan distance, the next lines will take them into account. It can be placed within a Zoom In/Out function
 mapoffsetx= (mwidth - mwidth * zoomfactor) / 2;
 mapoffsety= (mheight - mheight * zoomfactor) / 2 ;
 minx = minx + mapoffsetx + panx;
 miny = miny + mapoffsety + pany;
 maxx = maxx - mapoffsetx + panx;
 maxy = maxy - mapoffsety + pany;
 mwidth = maxx-minx;
 mheight = maxy-miny;
 scalex = abs(mwidth)/width;
 scaley = abs(mheight)/height;
 mapscale = max(scaley,scalex);
 //drawShapeFile();
}

void draw(){
 barChart = new BarChart(this);
 background(255);
 image(heatMap,210,20); 
 showAllButtons();
 hoverQuery(line25[10],line25[11],line25[12]);
 barChart.draw(970,200,300,200);
}

void showAllButtons(){
  for(int i=0; i < indicators.length; i++){
    showButton(indicators[i],indicators[i].R,indicators[i].G,indicators[i].B);
  }
   
}

void alternateHeatMap(int id){
  
  if(id==0){
    heatMap = loadImage("paraiba.png");
  }else if(id==1){
    heatMap = loadImage("paraiba2.png");
  }else if(id==2){
    heatMap = loadImage("paraiba3.png");
  }else if(id==3){
    heatMap = loadImage("paraiba4.png");
  }else if(id==4){
    heatMap = loadImage("paraiba5.png");
  }else if(id==5){
    heatMap = loadImage("paraiba6.png");
  }else if(id==6){
    heatMap = loadImage("paraiba2.png");
  }else if(id==7){
    heatMap = loadImage("paraiba3.png");
  }else if(id==8){
    heatMap = loadImage("paraiba4.png");
  }else if(id==9){
    heatMap = loadImage("paraiba5.png");
  }else if(id==10){
    heatMap = loadImage("paraiba6.png");
  }
}

class Button {

    int id;
    String name;
    int x, y, w, h;
    boolean clicked = false;
    int R,G,B;

    public Button(int id, String name, int x, int y, int w, int h) {
      this.id = id;
      this.name = name;
      this.x  = x;
      this.y = y;
      this.w = w;
      this.h = h;
      R = G = B = 255;
    }
    
    public void click(){
      clicked = true;
      R = G = B = 100;
    }
    
    public void off(){
      clicked = false;
      R = G = B = 255;
    }
}

void createButtons(){
  
 int c = 40;
 
 for(int i=0; i < indicators.length; i++){
   indicators[i] = new Button(i+1, "Ind"+i, x, y+c, w, h);
   c += 40;
 } 
 indicators[0].click();
 
}

private void showButton(Button button, int r, int g, int b) {
    stroke(150);
    fill(color(r,g,b));
    rect(button.x, button.y, button.w+20, button.h);
    fill(0);
    text(button.name, button.x + 12, button.y + button.h * 3 / 4);
}

void mousePressed() {
  
  for(int i = 0; i< indicators.length; i++){
    if (isOver(indicators[i])){
      updateIndicators(i);
    }
  }
 
}

void updateIndicators(int ind){
  
  for(int i = 0; i < indicators.length; i++){
    if(i != ind){
      indicators[i].off();
    }    
  }
  indicators[ind].click();
  alternateHeatMap(ind);

}


private boolean isOver(Button b){
   if(mouseX > b.x && mouseX < b.x + b.w && mouseY >b.y && mouseY < b.y + b.h){
     return true;
   }else{
     return false;
   }
}


public void hoverQuery(String x1, String y1, String k1) {
  
    
    Float x = Float.parseFloat(x1)+(930);
    Float y = Float.parseFloat(y1)+(310);
    Float k = Float.parseFloat(k1);
    
    if(mouseX > x && mouseX < x + 30 && mouseY > y && mouseY < y + 30){      
      fill(0);
      text("JOÃO PESSOA",mouseX+5,mouseY+10);      
      if(mousePressed){
         //Teste
         createBarChart("JOÃO PESSOA", "2000", "1000", "1500", "500");
         
      }
    }
}

public void createBarChart(String city, String d1, String d2, String d3, String d4){
  
  Float meanClicked = Float.parseFloat(d1);
  Float meanState = Float.parseFloat(d2);
  Float meanRegion = Float.parseFloat(d3);
  Float meanWhat = Float.parseFloat(d4);
  
  barChart.setData(new float[] {meanClicked, meanState, meanRegion, meanWhat});
    
  // Scaling
  barChart.setMinValue(100);
  barChart.setMaxValue(2000);
    
  barChart.showValueAxis(true);
  //barChart.setValueFormat("##");
  barChart.setBarLabels(new String[] {city,"Estado","Mesoregião","Outro"});
  barChart.showCategoryAxis(true);

  // Bar colours and appearance
  barChart.setBarColour(color(200,80,80));
  barChart.setBarGap(1);
  
  // Bar layout
  barChart.transposeAxes(true);
}

public class Shape{

    public Geometry geo;
    public String cidade;
    public float jpointx,jpointy;

    public Shape(Geometry geo, String cidade, float jpointx, float jpointy){

      this.geo = geo;
      this.cidade = cidade;
      this.jpointx = jpointx;
      this.jpointy = jpointy;
    }


  }

  private boolean isOver(){

    float x2, y2;

    for (int i=0;i<223;i++)
    {
      Coordinate centroid = new Coordinate();
      centroid = ((Feature) features.get(i)).getGeometry().getCentroid().getCoordinate();
      x2 = (float) ((centroid.x-minx)/ (float) mapscale);
      y2 = (float) ((centroid.y-miny)/ (float) mapscale);
      y2 = height-y2;

      if(mouseX > x2-10 && mouseX < x2+10 && mouseY > y2-10 && mouseY < y2+10){

        String cidade = ((Feature) features.get(i)).getAttribute(4).toString();
        fill(255);
        rect(mouseX-5,mouseY-5,cidade.length()*6+40,20);
        fill(0);
        text(((Feature) features.get(i)).getAttribute(4).toString(),mouseX+5,mouseY+10); 
      }

    }
    return false; 
  }

  public void drawPoints(){

    float x2,y2;

    for (int i=0;i<223;i++)
    {
      Coordinate centroid = new Coordinate();
      centroid = ((Feature) features.get(i)).getGeometry().getCentroid().getCoordinate();
      x2 = (float) ((centroid.x-minx)/ (float) mapscale);
      y2 = (float) ((centroid.y-miny)/ (float) mapscale);

      y2 = height-y2;
      fill(color(255,0,0));
      point(x2,y2);      
    }
  }

