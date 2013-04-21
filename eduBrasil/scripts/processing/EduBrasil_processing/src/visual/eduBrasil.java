package visual;
import org.gicentre.utils.stat.*;
import geomerative.*;
import processing.core.*;
import controlP5.*;

public class eduBrasil extends PApplet{

	private static final long serialVersionUID = 1L;

	ControlP5 controlP5;

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

	String[] buttonNames = new String[nIndicators];
	String[] cityNames;
	String[] outliersFile;
	String[] posList = new String[223];
	String[] negList = new String[223];

	PImage heatMap;
	BarChart barChart;

	boolean barChartClicked = false;
	boolean outliers = true;
	boolean listInfoClicked  = false;
	boolean ignoringStyles = true;

	String[] indicators;
	String[] ano1,ano2,ano3,ano4,ano5,ano6;
	Municipio[] municipios = new Municipio[223];;

	PImage scroll;
	RShape grp;
	RShape Municipios;

	ControlFont cf1 = new ControlFont(createFont("Arial",14));
	ControlFont cf2 = new ControlFont(createFont("Arial",9));
	PFont font = createFont("Serif",14);

	int backgroundColor = color(225,253,255);
	int outCityClicked = -1;
	int indicatorClicked = -1;

	public void setup(){

		// Setting graphical info
		size(screenWidth,screenHeight);
		smooth();
		background(backgroundColor);
		textFont(font);

		// Reading files
		cityNames = loadStrings("cityNames.txt");
		outliersFile = loadStrings("outliers.txt");
		indicators = loadStrings("tabela_com_todos_os_indicadores_selecionados_e_outliers.csv");

		// Setting Buttons and Map
		setButtonLabels();
		setListButtons();
		setMap();
		setPosAndNegList();
		setIndicatorsInfo();

		// Initiating barChart
		barChart = new BarChart(this);
	}

	public void setIndicatorsInfo(){

		int m = 0;
		//o arquivo � formado por 5 linhas de infomacoes de cada cidade
		//2009 cidade1
		//2010 cidade1
		//por isso o for que armazena os indicadores d� o pulo de 5 em 5 linhas
		for(int index = 1; index < indicators.length; index++){
			municipios[m] = new Municipio(indicators[index]);
			municipios[m].dadosPorAno(split(indicators[index],","),(split(indicators[index+1],",")),(split(indicators[index+2],",")),
					(split(indicators[index+3],",")),(split(indicators[index+4],",")),(split(indicators[index+5],",")));
			index = index + 5;
			m++;
		}
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

		text("Muito Acima da M�dia",screenWidth-390,340);
		text("Muito Abaixo da M�dia",screenWidth-250,340);

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

	public void updateIndicatorsTo(float e){

		Municipios = grp.children[3];

		float cor = 0;
		int ind = (int)e+1;

		for(int index = 0; index < Municipios.countChildren(); index++){

			// Treating NA cases
			if(municipios[index].ano2010[ind].equals("NA")){
				cor = 255;
			}else{
				cor = Float.parseFloat(municipios[index].ano2010[ind]);
			}
			//a cor � feita com base na metrica
			//lembrando que a ordem de cores sao vermelho, azul e verde.
			//multipliquei por tres pra aumentar a variacao dos tons
			fill(color(51,cor*3,255));

			Municipios.children[index].draw();

		}

		outliers = false;
		indicatorClicked = (int) e;		

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
			updateIndicatorsTo(theEvent.group().value());
			outliers = false;

		}else{
			if(theEvent.controller().name().equals("Cidades que se destacam")){
				outliers = true;
				updateToOutliersMap();
				println(theEvent.controller().name());
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

		stroke(0);
		if(!outliers){
			stroke(0);
			updateIndicatorsTo(indicatorClicked);
		}else{

		}

		// Sees if the mouse (p) is over a city 
		for(int i=0;i<grp.children[3].countChildren();i++){	
			
			if(grp.children[3].children[i].contains(p)){
				float cor = 0;
				if(!outliers){
					stroke(color(255,50,50));
					
					if(municipios[i].ano2010[indicatorClicked+1].equals("NA")){
						cor = 255;
					}else{
						cor = Float.parseFloat(municipios[i].ano2010[indicatorClicked+1]);
					}
					fill(color(51,cor*3,255));

					Municipios.children[i].draw();
				}else{
					stroke(227,32,32);
					grp.children[3].children[i].draw();
				}
				stroke(0);

				fill(255,200);
				rect(mouseX+10, mouseY-10, cityNames[i].length()*7+30, 20);
				fill(0);
				text(cityNames[i],mouseX+18, mouseY+5);

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

		controlP5 = new ControlP5(this);

		l = controlP5.addListBox("indicadores").setPosition(5, 230).setSize(210, 320).setItemHeight(15).setBarHeight(50);

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

		l2 = controlP5.addMultiList("destaque",5,130,210,50);

		// Creating buttons for multilist
		MultiListButton b = l2.add("Cidades que se destacam",1);
		b.captionLabel().setFont(cf1);
	}
}