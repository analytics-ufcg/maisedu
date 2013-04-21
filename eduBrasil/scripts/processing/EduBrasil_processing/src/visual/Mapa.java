package visual;
import geomerative.*;
import processing.core.*;

public class Mapa extends PApplet{

	RShape grp;
	RShape Municipios;
	String[] indicadores,ano1,ano2,ano3,ano4,ano5,ano6;
	Municipio[] municipio;
	PImage scroll;

	public void setup(){
		size(1200,1000);

		smooth();
		RG.init(this);
		RG.ignoreStyles(true);
		grp = RG.loadShape("Paraiba_MesoMicroMunicip.svg");
		grp.centerIn(g, 10, 1, 1);
		//scroll = loadImage("middle_button_scroll.png");

		indicadores = loadStrings("tabela_com_todos_os_indicadores_selecionados_e_outliers.csv");
		municipio = new Municipio[223];
		int m = 0;
		//o arquivo é formado por 5 linhas de infomacoes de cada cidade
		//2009 cidade1
		//2010 cidade1
		//por isso o for que armazena os indicadores dá o pulo de 5 em 5 linhas
		for(int index = 1; index < indicadores.length; index++){
			municipio[m] = new Municipio(indicadores[index]);
			municipio[m].dadosPorAno(split(indicadores[index],","),(split(indicadores[index+1],",")),(split(indicadores[index+2],",")),
					(split(indicadores[index+3],",")),(split(indicadores[index+4],",")),(split(indicadores[index+5],",")));
			index = index + 5;
			m++;
		}
	}

	public void draw(){
		translate(width/2, 450);
		//image(scroll,100,0);
		background(255);
		rect(100,10,20,30);
		stroke(0);
		noFill();

		RPoint p = new RPoint(mouseX-width/2, mouseY-height/2);
		Municipios = grp.children[3];
		Municipios.draw();
		fill(200);

		float cor = 0;
		for(int index = 0; index < Municipios.countChildren(); index++){
			cor = Float.parseFloat(municipio[index].ano2000[1]);
			//a cor é feita com base na metrica
			//lembrando que a ordem de cores sao vermelho, azul e verde.
			//multipliquei por tres pra aumentar a variacao dos tons
			fill(color(51,cor*3,255));

			Municipios.children[index].draw();
		}

	}
}