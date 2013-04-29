package visual;

import processing.core.*;
import processing.event.TouchEvent;

public class Sprint2 extends PApplet{
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
	float[] data = {50}; 
	int[] datas = new int[length];
	String[] label = {"2008"};

	float radius = 50;
	boolean dragging=false;
	String[] dataFile, dataFile2;
	float maxd;
	
	// Setup the Processing Canvas
	public void setup(){		
		size( width+100, height +50); //define the canvas size
		dataFile = loadStrings("tabela_com_todos_os_indicadores_selecionados_e_outliers.csv");
		dataFile2 = loadStrings("medianas_para_todos_os_indicadores_agrupados_por_ano_e_regiao.csv");
		
		// Teste de entrada
		String cidade = "\"Areial\"";
		String ano = "2010";
		String indicador = "\"INDICADOR_329\"";

		data = buscaValor(cidade,ano,indicador);
		
		//the length of the data array to be used in the for loops
		maxd = max(data)+1; //get the max data value to use for scaling

		frameRate( 15 ); //define the frame rate

		for(int i=0; i<length;i++){
			Y[i]=height-2*margin; //base point of the bars
			datas[i] = (int) (((height-2*margin)/maxd)*data[i]); //scale the data array to fit within the graph region
		}
		horzstep=(width-2*margin)/(length); //evenly space the bars
		barwidth=0.25*horzstep; //adjust the bar width for aesthetics

	} 

	private float[] buscaValor(String cidade, String ano, String indicador) {

		String[] colunas,linhas;
		float[] res = new float[4];
		
		colunas = split(dataFile[0],",");

		for(int i = 0; i < colunas.length; i++){

			if(colunas[i].equals(indicador)){
				
				for(int j=0; j < dataFile.length; j++){
					
					linhas = split(dataFile[j],",");
					if(ano.equals(linhas[4]) && cidade.equals(linhas[9])){
						res[0] = Float.parseFloat(linhas[i]); // referente aos dados do municipio 
						res[1] = Float.parseFloat(busca(ano,linhas[8],colunas[i])); // referente aos dados da microrregiao
						res[2] = Float.parseFloat(busca(ano,linhas[6],colunas[i])); // referente aos dados do mesorregiao
						res[3] = Float.parseFloat(busca(ano,linhas[2],colunas[i])); // referente aos dados do estado
					}
				}
			}
		}
		return res;
	}
	
	private String busca(String ano, String regiao, String indicador){
		
		String[] colunas,linhas;
		String res = "";
		
		colunas = split(dataFile2[0],",");

		for(int i = 0; i < colunas.length; i++){

			if(colunas[i].equals(indicador)){
				
				for(int j=0; j < dataFile2.length; j++){
					
					linhas = split(dataFile2[j],",");
					if(ano.equals(linhas[2]) && regiao.equals(linhas[1])){
						res = linhas[i]; // referente aos dados da regiao
					}
				}
			}
		}
		
		return res;
		
	}

	// Main draw loop
	public void draw(){
		// Fill canvas grey
		background( 100 );   
		fill( 0, 121, 184 );
		stroke(255); 
		bargra(); //draw the bars
		grid(); //draw the grid
		plotLines();
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
	
	public void plotLines(){
		
		int micro = (int) (((height-2*margin)/maxd)*data[1]);
		int meso= (int) (((height-2*margin)/maxd)*data[2]);
		int estado = (int) (((height-2*margin)/maxd)*data[3]);
		
		//margin+0.5*horzstep-0.5*barwidth+horzstep*i),Y[i]+margin,(float) barwidth,height-2*margin-Y[i]
		text(" Micro", (float) (margin+width), (float) (height-2*margin-micro)); //label each bar		
		line((float) (0.9*margin-4), (float) (height-2*margin-micro), (float) (margin+width),(float) (height-2*margin-micro)); // MICRO
		
		text(" Meso", (float) (margin+width), (float) (height-2*margin-meso)); //label each bar
		line((float) (0.9*margin-4), (float) (height-2*margin-meso), (float) (margin+width), (float) (height-2*margin-meso)); // MESO
		
		text(" Estado", (float) (margin+width), (float) (height-2*margin-estado)); //label each bar
		line((float) (0.9*margin-4), (float) (height-2*margin-estado), (float) (margin+width), (float) (height-2*margin-estado)); // ESTADO
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
			text(label[i], (float)  (margin-0.5*barwidth+0.5*horzstep+45+horzstep*i), (float) (height-0.9*margin+14)); //label each bar
		}
	}

	public void mouseClicked() {
		nX = mouseX;
		nY = mouseY;
	}
}
