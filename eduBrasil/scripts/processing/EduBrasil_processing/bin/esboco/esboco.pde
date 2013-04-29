import org.gicentre.utils.colour.*;
import org.gicentre.utils.io.*;
import org.gicentre.utils.gui.*;
import org.gicentre.utils.move.*;
import org.gicentre.utils.multisketch.*;
import org.gicentre.utils.stat.*;
import org.gicentre.utils.*;
import org.gicentre.utils.network.*;
import org.gicentre.utils.spatial.*;
import org.gicentre.utils.geom.*;
import java.applet.*; 
import java.awt.Dimension; 
import java.awt.Frame; 
import java.awt.event.MouseEvent; 
import java.awt.event.KeyEvent; 
import java.awt.event.FocusEvent; 
import java.awt.Image; 
import java.io.*; 
import java.net.*; 
import java.text.*; 
import java.util.*; 
import java.util.zip.*; 
import java.util.regex.*; 
import java.awt.event.MouseWheelEvent;
import java.awt.event.MouseWheelListener;

private static final long serialVersionUID = -2966275549875495232L;

  XYChart lineChart;
  BarChart barChart;
 
  public void setup() {

    size(900, 700);
    smooth();

    PFont font = createFont("Helvetica", 15);
    textFont(font, 14);
    lineChart = new XYChart(this);

    lineChart.setData(new float[] { 2007, 2008, 2009, 2010, 2011 }, new float[] { 150, 100, 200, 50, 300 });
    lineChart.setMinY(100);
    lineChart.setMaxY(300);
    lineChart.showXAxis(true);
    lineChart.showYAxis(true);
    lineChart.setYFormat("0"); // Frequency
    lineChart.setXFormat("0"); // Day
    lineChart.setPointSize(7); //TODO
    lineChart.setLineWidth(2);
    lineChart.setLineColour(color(255, 100, 50));
    lineChart.setPointColour(color(255, 100, 50));
    
    addMouseWheelListener(new MouseWheelListener() {
      public void mouseWheelMoved(MouseWheelEvent mwe) {
        // Re-Draw...
        loop();
      }
    });
    

    barChart = new BarChart(this);
    
    barChart.setData(new float[] {100, 150, 200, 250});
 
    // Scaling
    barChart.setMinValue(50);
    barChart.setMaxValue(300);

    barChart.showValueAxis(true);
    barChart.setBarGap(20);
    //barChart.setValueFormat("#%");
    barChart.setBarLabels(new String[] {"Cidade","Estado","Mesorregiao","Microrregiao"});
    barChart.showCategoryAxis(true);
  }

  public void mouseMoved() {
    loop();
  }

  public void draw() {
    
    background(255);
    fill(0);
    
  
    textAlign(LEFT);
    lineChart.draw(50, 52, 700, 300);
    barChart.draw(230,450,400,200);
 
    noLoop();
  }  



