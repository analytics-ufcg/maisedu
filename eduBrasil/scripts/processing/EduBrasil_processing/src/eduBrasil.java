import org.gicentre.utils.stat.*;
import geomerative.*;
import processing.core.*;
import controlP5.*;

public class eduBrasil extends PApplet{

	private static final long serialVersionUID = 1L;
	
	ControlP5 controlP5,cp5;

	MultiList l2; 		
	ListBox l;

	int screenWidth = 1600;
	int screenHeight = 800;
	int x = 10;
	int y = 80;
	int w = 250;
	int h = 30;

	// Total number of indicators chosen
	int nIndicators = 15;

	Button[] indicators = new Button[nIndicators];
	String[] buttonNames = new String[nIndicators];
	String[] cityNames;
	String[] outliersFile;
	
	PImage heatMap;
	BarChart barChart;

	boolean barChartClicked = false;
	boolean outliers = false;
	boolean ignoringStyles = true;

	RShape grp;

	ControlFont cf1 = new ControlFont(createFont("Arial",14));
	ControlFont cf2 = new ControlFont(createFont("Arial",9));
	PFont font = createFont("Serif",14);

	int backgroundColor = color(225,253,255);
	
	public void setup(){

		// Setting graphical info
		size(screenWidth,screenHeight);
		smooth();
		background(backgroundColor);
		textFont(font);

		// Reading files
		cityNames = loadStrings("cityNames.txt");
		outliersFile = loadStrings("outliers.txt");

		// Setting Buttons and Map
		setButtonLabels();
		setListButtons();
		setMap();
		
		// Initiating barChart
		barChart = new BarChart(this);
	}
	
	public void draw(){		

		background(backgroundColor);

		if(outliers){
			updateToOutliersMap();
		}

		if(barChartClicked && !outliers){
			barChart.draw(screenWidth-400,300,400,200);
		}

		hoverQuery();
	}

	/**
	 * Map settings and creation
	 */
	public void setMap(){
		
		// VERY IMPORTANT: Allways initialize the library before using it
		RG.init(this);
		RG.ignoreStyles(ignoringStyles);
		RG.setPolygonizer(RG.ADAPTATIVE);

		// Loading the shape of Paraiba 
		grp = RG.loadShape("Paraiba_MesoMicroMunicip.svg");

		// Position and scale
		grp.centerIn(g, 1, 1, 1);
		grp.transform(30, 0, screenHeight+200,screenHeight+200);
	}

	/**
	 * Setting the button labels
	 */
	public void setButtonLabels(){
		buttonNames[0] = "Despesa na funcao educaca por aluno";
		buttonNames[1] = "Despesa com pessoal e encargos sociais";
		buttonNames[2] = "Taxa de abandono - fundamental";
		buttonNames[3] = "Taxa de abandono - ensino medio";
		buttonNames[4] = "Taxa de aprovacao - fundamental";
		buttonNames[5] = "Taxa de aprovacao - ensino medio";
		buttonNames[6] = "IDEB 5 ano fundamental";
		buttonNames[7] = "IDEB 9 ano fundamental";
		buttonNames[8] = "Razao aluno por docente";
		buttonNames[9] = "Indice de eficiencia da educacao basica";
		buttonNames[10] = "Analfabetismo p/ pessoas >= 18 anos";
		buttonNames[11] = "Atendimento escolar para ate 3 anos";
		buttonNames[12] = "Atendimento escolar entre 11 e 14 anos";
		buttonNames[13] = "Atendimento escolar entre 15 e 17 anos";
		buttonNames[14] = "Atendimento escolar entre 4 e 17 anos";
	}
	
	/**
	 * Controlling the event of click
	 * TODO : create redirections to the rest of the buttons (only working for "Cidades que se destacam")
	 */
	@SuppressWarnings("deprecation")
	public void controlEvent(ControlEvent theEvent) {
		println(theEvent.controller().name()+" = "+theEvent.value());  
		// uncomment the line below to remove a multilist item when clicked.
		// theEvent.controller().remove();

		if(theEvent.controller().name().equals("Cidades que se destacam")){
			outliers = true;
			updateToOutliersMap();
		}
	}

	/**
	 * Changes the map to the outliers Map
	 */
	public void updateToOutliersMap(){

		// Getting info about outliers
		String[] outInfo = new String[outliersFile.length];

		for(int j = 0; j < outliersFile.length; j++){
			String[] info = outliersFile[j].split(",");
			outInfo[j] = info[7];
		}

		// Refills the cities according to the outInfo values
		for(int i=0;i<grp.children[3].countChildren();i++){	

			if(Integer.parseInt(outInfo[i])<0){
				fill(Integer.parseInt(outInfo[i])*(-1));

			}else if(Integer.parseInt(outInfo[i])>0){
				fill(Integer.parseInt(outInfo[i])*150);

			}else{
				fill(backgroundColor);
			}
			grp.children[3].children[i].draw();
		}

	}

	/**
	 * Changes the colors of the cities where the mouse is over and if clicked updates bar chart
	 */
	public void hoverQuery() {

		RPoint p = new RPoint(mouseX, mouseY);
		noFill();

		// Draws each city
		for(int i=0;i<grp.children[3].countChildren();i++){	
			stroke(0);
			grp.children[3].children[i].draw();

		}

		// Sees if the mouse (p) is over a city 
		for(int i=0;i<grp.children[3].countChildren();i++){	
			if(grp.children[3].children[i].contains(p)){

				if(!outliers){
					fill(0,100,255,250);
					grp.children[3].children[i].draw();
				}else{
					stroke(227,32,32);
					fill(backgroundColor);
					grp.children[3].children[i].draw();
				}

				fill(255);
				rect(mouseX+10, mouseY-10, cityNames[i].length()*7+30, 20);
				fill(0);
				text(cityNames[i],mouseX+12, mouseY+5);

				if(mousePressed){
					//TODO Integrate with files
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

		barChart.showValueAxis(true);
		barChart.setBarGap(20);
		//barChart.setValueFormat("#%");
		barChart.setBarLabels(new String[] {city,"Estado","Mesorregião","Microrregião"});
		barChart.showCategoryAxis(true);

	}

	/**
	 * First settings of the List buttons
	 */
	@SuppressWarnings("deprecation")
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
			l.addItem(buttonNames[i], i);
		}

		frameRate(30);
		controlP5 = new ControlP5(this);

		l2 = controlP5.addMultiList("myList",5,130,210,50);

		// Creating buttons for multilist
		MultiListButton b = null;				
		b = l2.add("Cidades que se destacam",1);
		b.captionLabel().setFont(cf1);
	}
}