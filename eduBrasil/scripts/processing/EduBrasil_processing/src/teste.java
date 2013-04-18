import geomerative.*;
import processing.core.*;


public class teste extends PApplet{
	RShape grp;

	boolean ignoringStyles = true;
	String[] cityNames;

	public void setup(){
		
		cityNames = loadStrings("cityNames.txt");
		
		size(1300, 1300);
		smooth();

		// VERY IMPORTANT: Allways initialize the library before using it
		RG.init(this);
		RG.ignoreStyles(ignoringStyles);

		RG.setPolygonizer(RG.ADAPTATIVE);
		
		grp = RG.loadShape("Paraiba_MesoMicroMunicip.svg");
		grp.centerIn(g, 100, 1, 1);
				
	}

	public void draw(){
		translate(width/2, height/2);

		background(255);
		stroke(0);
		noFill();
		
		grp.draw();
		RPoint p = new RPoint(mouseX-width/2, mouseY-height/2);
		
		for(int i=0;i<grp.children[3].countChildren();i++){	
			if(grp.children[3].children[i].contains(p)){	
		    	fill(0,100,255,250);
				noStroke();
				grp.children[3].children[i].draw();
				System.out.println("Cidade"+cityNames[i]);
			}
			
		}		
	}
	
	
	public void paintOthers(){
//		
//		background(255);
//		stroke(0);
//		noFill();
//
//		for(int i=0;i<grp.children[3].countChildren();i++){		
//			
//			if(grp.children[3].children[i].contains(p)){				
//				RG.ignoreStyles(true);
//		    	fill(0,100,255,250);
//				noStroke();
//				grp.children[3].children[i].draw();
//				System.out.println("Cidade : "+cityNames[i]);
//				RG.ignoreStyles(ignoringStyles);
//			}			
//		}			
	}

	public void mousePressed(){
		//TODO
		
	}
}