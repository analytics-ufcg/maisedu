import java.io.File;

PImage indicador;
//testando o scrollbar
Scrollbar hs1;
String[] merecem_atencao;
ArrayList indicadores_normais, indicadores_merecem_atencao;
PFont font;

void setup(){
  size(1200,1000);
  //teste do scrollbar
  hs1 = new Scrollbar(840, 69,398, 16, 16);
  read_files();
  
 // indicadores_merecem_atencao = new ArrayList();
  
}

void draw(){
  background(255);

  hs1.update();
  hs1.display();
  
  plot_indicadores();
  lista_indicadores();
  fill(255);
  rect(0,0,1200,60);
  rect(40,60,800,40);
  stroke(230);
  strokeWeight(4);
  noFill();
  rect(40,60,1100,400);
  
  font = createFont("Georgia",18);
  textFont(font);
  fill(0);
  text("Indicadores que merecem atenção", 300,90);

}

boolean overRect(int x, int y, int width, int height) {
  if (mouseX >= x && mouseX <= x+width && 
      mouseY >= y && mouseY <= y+height) {
    return true;
  } else {
    return false;
  }
}

void read_files(){
  //substituir depois pelo caminho no servidor para a pasta com as miniaturas
  //o windows usa duas barras
  String nome;
  File folder = new File(dataPath("C:\\Users\\Iara\\Documents\\Processing\\us6\\Indicadores"));
  File[] indicadores = folder.listFiles(); 
  indicadores_normais = new ArrayList();
  indicadores_merecem_atencao = new ArrayList();
  
  for(int i = 0; i < indicadores.length; i++){
    nome = indicadores[i].getName();
    if(nome.toLowerCase().contains("-4")){
      indicadores_merecem_atencao.add(nome);
    }else{
      indicadores_normais.add(nome);
    }
  }
}


void lista_indicadores(){
  font = createFont("Georgia",14);
  textFont(font);
  fill(0);
  text("Indicadores", 945,100);
  String nome;
  String[] temp;
  
  for(int i = 0; i < indicadores_normais.size(); i++){
    nome = indicadores_normais.get(i).toString();
    temp = split(nome, "_");
    text((temp[1] + " " + temp[2]), 880,130 + (i*25));
  }
}

void plot_indicadores(){
  float imgPos = hs1.getPos() - width/2;
  String nome;
  
  for(int i = 0; i < indicadores_merecem_atencao.size(); i++){
    indicador = loadImage("\\Indicadores\\" + indicadores_merecem_atencao.get(i));
    image(indicador,50 + (i*400), -680 -imgPos*1.5 );
  }
}

