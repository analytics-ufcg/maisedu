import org.gicentre.utils.stat.*;
import geomerative.*;
import processing.core.*;
import controlP5.*;

public class eduBrasil extends PApplet{

	private static final long serialVersionUID = 1L;

	ControlP5 cp5,controlP5;

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
	String[] posList = new String[223];
	String[] negList = new String[223];

	PImage heatMap;
	BarChart barChart;

	boolean barChartClicked = false;
	boolean outliers = false;
	boolean listInfoClicked  = false;
	boolean ignoringStyles = true;

	RShape grp;

	ControlFont cf1 = new ControlFont(createFont("Arial",14));
	ControlFont cf2 = new ControlFont(createFont("Arial",9));
	PFont font = createFont("Serif",14);

	int backgroundColor = color(225,253,255);
	int outCityClicked = -1;

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
		setPosAndNegList();

		// Initiating barChart
		barChart = new BarChart(this);
	}

	public void draw(){		

		background(backgroundColor);

		if(outliers){
			updateToOutliersMap();

			if(listInfoClicked){
				listInfoOutliers(outCityClicked);
			}
		}

		if(barChartClicked && !outliers){
			barChart.draw(screenWidth-400,300,400,200);
		}

		hoverQuery();
		showAbout();
	}

	private void listInfoOutliers(int i) {

		fill(255);
		stroke(100);
		rect(screenWidth-400,300,300,200);
		fill(0);
		text("Cidade selecionada: "+cityNames[i],screenWidth-390,320);

		text("Maior que indicadores",screenWidth-390,340);
		text("Menor que indicadores",screenWidth-250,340);

		line(screenWidth-258,340, screenWidth-258, 500);
		line(screenWidth-100,340, screenWidth-400, 340);

		text(posList[i],screenWidth-390,360);
		text(negList[i],screenWidth-250,360);

	}

	private void setPosAndNegList(){

		// Setting positive and negative lists
		for(int j = 0; j < outliersFile.length; j++){
			String[] info = outliersFile[j].split(",");
			posList[j] = info[8];
			negList[j] = info[9];
		}
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

		if (theEvent.isGroup()) {
			// an event from a group e.g. scrollList
			println(theEvent.group().value()+" from "+theEvent.group());
		}

		if(theEvent.isGroup() && theEvent.name().equals("myList")){
			int test = (int)theEvent.group().value();
			println("test "+test);
			if(theEvent.controller().name().equals("Cidades que se destacam")){
				
			}
		}else{
			if(theEvent.controller().name().equals("Cidades que se destacam")){
				outliers = true;
				updateToOutliersMap();
			}
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
				fill(255);
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
			//TODO Be replaced with real color according to heat

			if(!outliers){
				fill(color(255,i,i));
			}else{

			}			
			grp.children[3].children[i].draw();

		}

		// Sees if the mouse (p) is over a city 
		for(int i=0;i<grp.children[3].countChildren();i++){	
			if(grp.children[3].children[i].contains(p)){

				if(!outliers){
					fill(color(255,i,i));
					stroke(color(0,58,250));
					grp.children[3].children[i].draw();
				}else{
					stroke(227,32,32);
					grp.children[3].children[i].draw();
				}
				stroke(0);

				fill(255,200);
				rect(mouseX+10, mouseY-10, cityNames[i].length()*7+30, 20);
				fill(0);
				text("   "+cityNames[i],mouseX+18, mouseY+5);

				if(mousePressed){
					//TODO Integrate with files

					if(!outliers){
						barChartClicked = true;
						createBarChart(cityNames[i],"30","20","10","1");

					}else{
						listInfoClicked = true;
						listInfoOutliers(i);
						outCityClicked = i;
					}

				}				
			}			
		}
	}

	public void showAbout(){

		int pX = (screenWidth/2)-180;
		int pY = 700;
		int pW = 100;
		int pH = 30;

		fill(255);
		rect(pX,pY,pW,pH);
		fill(color(4,51,255));
		text("Sobre o projeto",pX+7,pY+20);

		if (mouseX > pX && mouseX < pX+pW && mouseY > pY && mouseY < pY+pH) {
			fill(color(255,19,52));
			text("Sobre o projeto",pX+7,pY+20);
			cursor(HAND);
		}else{
			cursor(ARROW);
		}

		if(mousePressed){
			if(mouseX > pX && mouseX < pX+pW && mouseY > pY && mouseY < pY+pH){
				link("https://docs.google.com/document/d/1jIrsMg9oIH74gXQ8yHE45i03_sO1usI1CJf2zvC_Re8/edit"); 
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
		l = cp5.addListBox("indicadores").setPosition(5, 230).setSize(210, 320).setItemHeight(15).setBarHeight(50);

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

		l2 = controlP5.addMultiList("destaque",5,130,210,50);
		
		// Creating buttons for multilist
		MultiListButton b = null;				
		b = l2.add("Cidades que se destacam",1);
		b.captionLabel().setFont(cf1);
	}
}