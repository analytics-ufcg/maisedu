
PImage teste_indicador,teste_indicador2;
//testando o scrollbar
Scrollbar hs1;
String[] merecem_atencao;
PFont font;

void setup(){
  size(1200,1000);
  teste_indicador = loadImage("Miniatura.png");
  teste_indicador2 = loadImage("miniatura2.png");
  
  //teste do scrollbar
  hs1 = new Scrollbar(840, 69,398, 16, 16);
}

void draw(){
  background(255);
 // merecem_atencao = new String[4]; //("Indicador A", "Indicador B", "Indicador C");

  //teste do scrollbar
  
  float imgPos = hs1.getPos() - width/2;
  image(teste_indicador,50, -680 -imgPos*1.5 );
  //image(teste_indicador,450, -680 -imgPos*1.5 );
  hs1.update();
  hs1.display();

  selecao_indicadores();
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

void lista_indicadores(){
  
  font = createFont("Georgia",16);
  textFont(font);
  fill(0);
  text("Indicadores", 945,100);

  //for(int i = 0; i < merecem_atencao.length; i++){
    
    text("Indicador B", 880,140);
    text("Indicador C", 880,170);
    //text(merecem_atencao[i], 880, 100 + (i*30))
  //}
}

void selecao_indicadores(){
 
  if(overRect(880,125,100,20) && mousePressed){
   // fadein();
    teste_indicador = teste_indicador2;
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

void fadein(){
  for(int i = 0; i < 20; i++){
    tint(255,127 - (i*10));
  }  
}
