import org.gicentre.utils.stat.*;
import java.util.ArrayList;
import geomerative.*;
import processing.core.*;
import controlP5.*;

public class eduBrasil extends PApplet{

	private static final long serialVersionUID = 1L;
	ArrayList<PVector>coords;    // Projected GPS coordinates.
	PImage backgroundMap;        // OpenStreetMap.
	PVector tlCorner,brCorner;   // Corners of map in WebMercator coordinates.
	ControlP5 controlP5,cp5;
	int cnt = 0;
	MultiList l2;
	ListBox l;

	int screenX = 1600;
	int screenY = 600;
	int x = 10;
	int y = 80;
	int w = 250;
	int h = 30;

	int nIndicators = 15;

	Button[] indicators = new Button[nIndicators];
	String[] buttonNames = new String[nIndicators];

	PImage heatMap;
	BarChart barChart;
	boolean barChartClicked = false;

	RShape grp;
	boolean ignoringStyles = true;
	String[] cityNames;

	ControlFont cf1 = new ControlFont(createFont("Arial",14));
	ControlFont cf2 = new ControlFont(createFont("Arial",9));

	public void setup(){

		size(screenX,screenY);
		smooth();
		background(255);
		barChart = new BarChart(this);
		buttonNames[0] = "Despesa na função educação por aluno";
		buttonNames[1] = "Despesa com pessoal e encargos sociais";
		buttonNames[2] = "Taxa de abandono - fundamental";
		buttonNames[3] = "Taxa de abandono - ensino médio";
		buttonNames[4] = "Taxa de aprovação - fundamental";
		buttonNames[5] = "Taxa de aprovação - ensino médio";
		buttonNames[6] = "IDEB 5º ano fundamental";
		buttonNames[7] = "IDEB 9º ano fundamental";
		buttonNames[8] = "Razão aluno por docente";
		buttonNames[9] = "Índice de eficiência da educação básica";
		buttonNames[10] = "Analfabetismo p/ pessoas >= 18 anos";
		buttonNames[11] = "Atendimento escolar para até 3 anos";
		buttonNames[12] = "Atendimento escolar entre 11 e 14 anos";
		buttonNames[13] = "Atendimento escolar entre 15 e 17 anos";
		buttonNames[14] = "Atendimento escolar entre 4 e 17 anos";
		cityNames = loadStrings("cityNames.txt");

		textSize(20);

		// VERY IMPORTANT: Allways initialize the library before using it
		RG.init(this);
		RG.ignoreStyles(ignoringStyles);
		RG.setPolygonizer(RG.ADAPTATIVE);

		// Loading the shape of Paraiba 
		grp = RG.loadShape("Paraiba_MesoMicroMunicip.svg");

		grp.centerIn(g, 1, 1, 1);
		grp.transform(200, 0, screenY+400,screenY+100);
		setListButtons();

	}


	public void controlEvent(ControlEvent theEvent) {
		println(theEvent.controller().name()+" = "+theEvent.value());  
		// uncomment the line below to remove a multilist item when clicked.
		// theEvent.controller().remove();
	}

	public void draw(){		

		background(255); 
		hoverQuery();	
		if(barChartClicked){
			barChart.draw(screenX-400,200,400,200);
		}	
	}

	/**
	 * 
	 * @param x1
	 * @param y1
	 * @param k1
	 */
	public void hoverQuery() {

		RPoint p = new RPoint(mouseX, mouseY);
		noFill();

		for(int i=0;i<grp.children[3].countChildren();i++){	
			stroke(0);
			grp.children[3].children[i].draw();

		}

		for(int i=0;i<grp.children[3].countChildren();i++){	
			if(grp.children[3].children[i].contains(p)){

				fill(0,100,255,250);
				grp.children[3].children[i].draw();
				fill(255);
				rect(mouseX+10, mouseY-10, cityNames[i].length()*5+28, 20);
				fill(0);
				text(cityNames[i],mouseX+12, mouseY+5);

				if(mousePressed){
					//TODO Adaptar aos arquivos já criados	
					barChartClicked = true;
					createBarChart(cityNames[i],"30","20","10","1");
				}				
			}			
		}
	}


	/**
	 * Generates the barchart of the city that has been clicked
	 * @param city
	 * @param d1
	 * @param d2
	 * @param d3
	 * @param d4
	 */
	public void createBarChart(String city, String d1, String d2, String d3, String d4){

		Float meanClicked = Float.parseFloat(d1);
		Float meanState = Float.parseFloat(d2);
		Float meanRegion = Float.parseFloat(d3);
		Float meanWhat = Float.parseFloat(d4);
		smooth();

		//barChart = new BarChart(this);
		barChart.setData(new float[] {meanClicked, meanState, meanRegion, meanWhat});

		// Scaling
		barChart.setMinValue(0);
		barChart.setMaxValue(30);

		// Axis appearance
		PFont font = createFont("Serif",14);
		textFont(font,14);

		barChart.showValueAxis(true);
		barChart.setBarGap(2);
		//barChart.setValueFormat("#%");
		barChart.setBarLabels(new String[] {city,"Estado","Mesoregião","Outro"});
		barChart.showCategoryAxis(true);
	}

	public void setListButtons(){

		cp5 = new ControlP5(this);
		l = cp5.addListBox("myList").setPosition(5, 230).setSize(210, 320).setItemHeight(15).setBarHeight(50);

		l.captionLabel().toUpperCase(true);		
		l.captionLabel().set("Escolha de indicadores");
		l.captionLabel().setColor(255);
		l.captionLabel().style().marginTop = 3;
		l.valueLabel().style().marginTop = 3;
		l.captionLabel().setFont(cf1);

		for (int i=0;i<nIndicators;i++) {
			ListBoxItem lbi = l.addItem(buttonNames[i], i);
		}

		frameRate(30);
		controlP5 = new ControlP5(this);

		l2 = controlP5.addMultiList("myList",5,130,210,50);

		// Creating buttons for multilist
		MultiListButton b,c = null;				
		b = l2.add("Cidades que se destacam",1);
		b.captionLabel().setFont(cf1);
	}
}