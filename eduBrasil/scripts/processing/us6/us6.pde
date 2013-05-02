import java.io.File;

PImage indicador;
//testando o scrollbar
Scrollbar hs1;
String[] merecem_atencao;
ArrayList indicadores_normais, indicadores_merecem_atencao;
boolean update_layout = false;
boolean plot_indicador = false;
int id_indicador = 0;
PFont font;

void setup(){
  size(1200,1000);
  hs1 = new Scrollbar(40, 452,800, 16, 60);
  read_files();
}

void draw(){
  background(255);

  hs1.update();
  hs1.display();
  
  //plot_indicadores();
  
  
  update();
  lista_indicadores();
  font = createFont("Georgia",18);
  textFont(font);
  fill(0);
  text("Indicadores que merecem atenção", 300,90);
  
  //tamanho/posicao definido de cada nome do indicador:
  //rect(870,105,125+(i*22),20);
 
  
  
  
  fill(255);
  if(update_layout) rect(40,60,800,400);
  update_indicadores();

  
}

void update(){
  noStroke();
  fill(255);
  rect(0,60,40,400);
  rect(840,60,800,400);
  stroke(230);
  strokeWeight(4);
  noFill();
  rect(40,60,1100,400);
  rect(40,530,1100,400);

}

void update_indicadores(){
  if(plot_indicador && id_indicador < indicadores_normais.size()){
        update_layout = true;
         indicador = loadImage("\\Indicadores\\" + indicadores_normais.get(id_indicador));
        image(indicador,250,130);
  }
}

boolean overRect(int x, int y, int width, int height) {
  if (mouseX >= x && mouseX <= x+width && 
      mouseY >= y && mouseY <= y+height) {
    return true;
  } else {
    return false;
  }
}

void mousePressed() {
  if (overRect(870,105,125,20)) {
      plot_indicador = true;
      id_indicador = 0;
  }else if (overRect(870,126,125,20)){
      plot_indicador = true;
      id_indicador = 1;
  }else if (overRect(870,150,125,20)){
      plot_indicador = true;
      id_indicador = 2;
  }else if (overRect(870,170,125,20)){
      plot_indicador = true;
      id_indicador = 3;
  }else if (overRect(870,193,125,20)){
      plot_indicador = true;
      id_indicador = 4;
  }else if (overRect(870,216,125,20)){
      plot_indicador = true;
      id_indicador = 5;
  }else if (overRect(870,236,125,20)){
      plot_indicador = true;
      id_indicador = 6;
  }else if (overRect(870,258,125,20)){
      plot_indicador = true;
      id_indicador = 7;
  }else if (overRect(870,280,125,20)){
      plot_indicador = true;
      id_indicador = 8;
  }else if (overRect(870,304,125,20)){
      plot_indicador = true;
      id_indicador = 9;
  }else if (overRect(870,324,125,20)){
      plot_indicador = true;
      id_indicador = 10;
  }else if (overRect(870,347,125,20)){
      plot_indicador = true;
      id_indicador = 11;
  }else if (overRect(870,367,125,20)){
      plot_indicador = true;
      id_indicador = 12;
  }else if (overRect(870,390,125,20)){
      plot_indicador = true;
      id_indicador = 13;
  }else if (overRect(870,410,125,20)){
      plot_indicador = true;
      id_indicador = 14;
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
  text("Indicadores", 945,90);
  text("Indicadores", 945,560);
  String nome;
  String[] temp;
  
  for(int i = 0; i < indicadores_normais.size(); i++){
    nome = indicadores_normais.get(i).toString();
    temp = split(nome, "_");
    text((temp[1] + " " + temp[2]), 880,120 + (i*22));
    text((temp[1] + " " + temp[2]), 880,590 + (i*22));
  }
}

void plot_indicadores(){
  float imgPos = hs1.getPos() - width/2;
  String nome;

  for(int i = 0; i < indicadores_merecem_atencao.size(); i++){
    indicador = loadImage("\\Indicadores\\" + indicadores_merecem_atencao.get(i));
    image(indicador,((i*400) - imgPos*1.5) - 770, 130);
  }
}

