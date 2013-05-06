import java.io.File;
import controlP5.*;
import java.io.*;


PImage indicador,voltar;
Scrollbar hs1,hs2;
float imgPos,imgPos2;
String[] merecem_atencao,temp;
ArrayList indicadores_normais, indicadores_merecem_atencao,indicadores_normais_temporal, indicadores_merecem_atencao_temporal;
boolean update_layout = false;
boolean update_layout_temporal = false;
boolean plot_indicador = false;
boolean plot_indicador_temporal = false;
int id_indicador = 0;
int id_indicador_temporal = 0;
PFont font;
String nome_cidade, Path;
ControlP5 cp5;
DropdownList droplist;
String nome;
File folder;
File[] indicadores;

void setup(){
  size(1400,800);

  font = createFont("Times New Roman",14);
  textFont(font);
  hs1 = new Scrollbar(43, 396,820, 16, 10);
  hs2 = new Scrollbar(43, 770,820, 16, 10);
  setDropDown();
  indicadores_merecem_atencao = new ArrayList();
  indicadores_merecem_atencao_temporal = new ArrayList();
  indicadores_normais_temporal = new ArrayList();
  voltar = loadImage("voltar.png");
  
  Path = "/home/iara/processing-2.0b3/sketchbook/SPRINT2/graphs/";
  folder = new File(dataPath(Path));
  indicadores = folder.listFiles(); 
  indicadores_normais = new ArrayList();
  indicadores_merecem_atencao = new ArrayList();
  indicadores_normais_temporal = new ArrayList();
  indicadores_merecem_atencao_temporal = new ArrayList();
    
}

void draw(){
  background(255);
  noLoop();
     
  update();
  fill(0);

  if(indicadores_merecem_atencao.size()>0){
    hs1.update();
    hs1.display();
    noLoop();
    plot_indicadores(); 
    update(); 
    lista_indicadores();
    line(860, 60,860, 403);
  }else{
    if(nome_cidade!=null){
      lista_indicadores();
      line(860, 60,860, 403);
    }else{
      text("Escolha a cidade que deseja ter informações",250,230);
    }
  }
  
  
  
  if(indicadores_merecem_atencao_temporal.size()>0){
    hs2.update();
    hs2.display();
    noLoop();
    plot_indicadores_temporal();
    update_grid2();
    lista_indicadores_temporal();
  }else{
    if(nome_cidade!=null){
      lista_indicadores_temporal();
      line(860, 60,860, 403);
    }else{
      text("Escolha a cidade que deseja ter informações",250,630);
    }
  }
    
  
  fill(255);
  if(update_layout){
    noStroke();
    rect(43,64,815,341);
  }
  if(update_layout_temporal){
    noStroke();
    rect(43,435,815,343);
  }
  update_indicadores();
  update_indicadores_temporal();

}

void mouseMoved() {
  loop();
}

void mouseDragged() {
  loop();
}

void update(){
  noStroke();
  fill(255);
  rect(860,60,800,350);
  rect(0,60,40,800);
  stroke(230);
  strokeWeight(4);
  noFill();
  rect(40,56,1310,350);
  rect(40,430,1310,350);
  fill(230);
  line(860, 60,860, 403);
  line(860, 430,860, 777);
}

void update_indicadores(){
  if(plot_indicador && id_indicador < indicadores_normais.size()){
        update_layout = true;
        indicador = loadImage("/home/iara/processing-2.0b3/sketchbook/SPRINT2/graphs/" + indicadores_normais.get(id_indicador));
        image(indicador,250,100);
        g.removeCache(indicador);
        image(voltar, 1250,350);
  }else if(!plot_indicador){
     if(indicadores_merecem_atencao.size()>0){
      plot_indicadores(); 
      update(); 
      lista_indicadores();
      hs1.update();
      hs1.display();
     }else{
      if(nome_cidade!=null){
        fill(0);
        font = createFont("Times New Roman",14);
        textFont(font);
        text("Indicadores que merecem atenção", 300,90);
        text("A cidade " + nome_cidade + " não possui indicadores que merecem atenção", 200,230);
        lista_indicadores();
        line(860, 60,860, 403);
      }
    }
  }
}

void read_files(){
  for(int i = 0; i < indicadores.length; i++){
    nome = indicadores[i].getName();
    temp = split(nome, "_");
    if(nome.contains("-4")){
       if(temp[0].equals(nome_cidade)){
         if(nome.contains("SERIE")){
             indicadores_merecem_atencao_temporal.add(nome);
         }else{
             indicadores_merecem_atencao.add(nome);
         }
       }
    }else{
      if(temp[0].equals(nome_cidade)){
         if(nome.contains("SERIE")){
           indicadores_normais_temporal.add(nome);
         }else{
           indicadores_normais.add(nome);
         }
      }
    } 
  }
}

void lista_indicadores(){
  font = createFont("Times New Roman",14);
  textFont(font);
  fill(0);
  text("Indicadores normais", 1010,80);
  text("Indicadores normais ao longo do tempo", 960,460);
  font = createFont("Times New Roman",12);
  textFont(font);
  String nome;
  String[] temp;
  
  for(int i = 0; i < indicadores_normais.size(); i++){
    nome = indicadores_normais.get(i).toString();
    temp = split(nome, "_");
    text(getNomeIndicador(Integer.parseInt(temp[2])), 880,105 + (i*20));
  }
  
  noStroke();
  fill(3,55,255);//estado
  rect(870,390,12,12);
  fill(255,5,26);//mesorregiao
  rect(940,390,12,12);
  fill(72,232,5);//microregiao
  rect(1040,390,12,12);
  fill(0);
  font = createFont("Times New Roman",12);
  textFont(font);
  text("Paraíba",885,400);
  text("Mesorregião",955,400);
  text("Microrregião",1055,400);
}

void plot_indicadores(){
  font = createFont("Times New Roman",14);
  textFont(font);
  fill(0);
  text("Indicadores que merecem atenção", 300,90);
  imgPos = hs1.getPos() - width/2;

  
  for(int i = 0; i < indicadores_merecem_atencao.size(); i++){
      indicador = loadImage("/home/iara/processing-2.0b3/sketchbook/SPRINT2/graphs/" + indicadores_merecem_atencao.get(i));
      image(indicador,((i*400) - imgPos*1.5) - 920, 100);
      g.removeCache(indicador);
  }
}

void lista_indicadores_temporal(){
  textFont(createFont("Times New Roman",12));
  fill(0);
  String nome;
  String[] temp;
  
  for(int i = 0; i < indicadores_normais_temporal.size(); i++){
    nome = indicadores_normais_temporal.get(i).toString();
      temp = split(nome, "_");
      text(getNomeIndicador(Integer.parseInt(temp[3])), 880,482 + (i*20));
  }
  //adicionar legenda dos graficos de henrique
}

void plot_indicadores_temporal(){
  textFont(createFont("Times New Roman",14));
  fill(0);
  text("Indicadores que merecem atenção ao longo do tempo", 250,465);
  imgPos2 = hs2.getPos() - width/2;

  for(int i = 0; i < indicadores_merecem_atencao_temporal.size(); i++){
      indicador = loadImage("/home/iara/processing-2.0b3/sketchbook/SPRINT2/graphs/" + indicadores_merecem_atencao_temporal.get(i));
      image(indicador, ((i * 400) - imgPos2*1.5) - 920, 470);   
      g.removeCache(indicador);   
  }
}

void update_indicadores_temporal(){
  if(plot_indicador_temporal && id_indicador_temporal < indicadores_normais_temporal.size()){
       update_layout_temporal = true;
       indicador = loadImage("/home/iara/processing-2.0b3/sketchbook/SPRINT2/graphs/" + indicadores_normais_temporal.get(id_indicador_temporal));
       image(indicador,250,455);
       g.removeCache(indicador);
       image(voltar, 1250,725);
  }else if(!plot_indicador_temporal){
    if(indicadores_merecem_atencao_temporal.size()>0){
      plot_indicadores_temporal();
      update_grid2();
      lista_indicadores_temporal();
      hs2.update();
      hs2.display();
    }else{
      if(nome_cidade!=null){
        lista_indicadores_temporal();
        fill(0);
        font = createFont("Times New Roman",14);
        textFont(font);
        text("Indicadores que merecem atenção ao longo do tempo", 200,450);
        text("A cidade " + nome_cidade + " não possui indicadores que merecem atenção ao longo do tempo", 120,600);
        line(860, 60,860, 403);
      }
    }
  }
}


void update_grid2(){
  noStroke();
  fill(255);
  rect(0,60,40,800);
  rect(862,430,800,800);
  stroke(230);
  strokeWeight(4);
  noFill();
  rect(40,56,1310,350);
  rect(40,430,1310,350);
  fill(230);
  line(860, 60,860, 403);
  line(860, 430,860, 777);
}


void setDropDown(){
 cp5 = new ControlP5(this);
 
  //font = createFont("Arial",14);
  cp5.setFont(createFont("Times New Roman",14));
  
  // add a dropdownlist at position (50,100)
  droplist = cp5.addDropdownList("Escolha sua cidade:").setPosition(40, 50);
  
  //
  droplist.setSize(260,200);
  droplist.setScrollbarWidth(10);
  droplist.setItemHeight(20);
  droplist.setBackgroundColor(color(0));
  droplist.setItemHeight(20);
  droplist.setBarHeight(20);
  droplist.setColorActive(color(255,128));
  droplist.setColorBackground(color(200));
  droplist.setColorLabel(color(0));
  
  // add items to the dropdownlist
  droplist.addItem("Água Branca ", 0);
  droplist.addItem("Aguiar", 1);
  droplist.addItem("Alagoa Grande", 2);
  droplist.addItem("Alagoa Nova", 3);
  droplist.addItem("Alagoinha", 4);
  droplist.addItem("Alcantil", 5);
  droplist.addItem("Algodão de Jandaíra", 6);
  droplist.addItem("Alhandra", 7);
  droplist.addItem("Amparo", 8);
  droplist.addItem("Aparecida", 9);
  droplist.addItem("Araçagi", 10);
  droplist.addItem("Arara", 11);
  droplist.addItem("Araruna", 12);
  droplist.addItem("Areia", 13);
  droplist.addItem("Areia de Baraúnas", 14);
  droplist.addItem("Areial", 15);
  droplist.addItem("Aroeiras", 16);
  droplist.addItem("Assunção", 17);
  droplist.addItem("Baía da Traição", 18);
  droplist.addItem("Bananeiras", 19);
  droplist.addItem("Baraúna", 20);
  droplist.addItem("Barra de Santa Rosa", 21);
  droplist.addItem("Barra de Santana", 22);
  droplist.addItem("Barra de São Miguel", 23);
  droplist.addItem("Bayeux", 24);
  droplist.addItem("Belém", 25);
  droplist.addItem("Belém do Brejo do Cruz", 26);
  droplist.addItem("Bernardino Batista", 27);
  droplist.addItem("Boa Ventura", 28);
  droplist.addItem("Boa Vista", 29);
  droplist.addItem("Bom Jesus", 30);
  droplist.addItem("Bom Sucesso", 31);
  droplist.addItem("Bonito de Santa Fé", 32);
  droplist.addItem("Boqueirão", 33);
  droplist.addItem("Borborema", 34);
  droplist.addItem("Brejo do Cruz", 35);
  droplist.addItem("Brejo dos Santos", 36);
  droplist.addItem("Caaporã", 37);
  droplist.addItem("Cabaceiras", 38);
  droplist.addItem("Cabedelo", 39);
  droplist.addItem("Cachoeira dos Índios", 40);
  droplist.addItem("Cacimba de Areia", 41);
  droplist.addItem("Cacimba de Dentro", 42);
  droplist.addItem("Cacimbas", 43);
  droplist.addItem("Caiçara", 44);
  droplist.addItem("Cajazeiras", 45);
  droplist.addItem("Cajazeirinhas", 46);
  droplist.addItem("Caldas Brandão", 47);
  droplist.addItem("Camalaú", 48);
  droplist.addItem("Campina Grande", 49);
  droplist.addItem("Campo de Santana", 50);
  droplist.addItem("Capim", 51);
  droplist.addItem("Caraúbas", 52);
  droplist.addItem("Carrapateira", 53);
  droplist.addItem("Casserengue", 54);
  droplist.addItem("Catingueira", 55);
  droplist.addItem("Catolé do Rocha", 56);
  droplist.addItem("Caturité", 57);
  droplist.addItem("Conceição", 58);
  droplist.addItem("Condado", 59);
  droplist.addItem("Conde", 60);
  droplist.addItem("Congo", 61);
  droplist.addItem("Coremas", 62);
  droplist.addItem("Coxixola", 63);
  droplist.addItem("Cruz do Espírito Santo", 64);
  droplist.addItem("Cubati", 65);
  droplist.addItem("Cuité", 66);
  droplist.addItem("Cuitegi", 67);
  droplist.addItem("Cuité de Mamanguape", 68);
  droplist.addItem("Curral de Cima", 69);
  droplist.addItem("Curral Velho", 70);
  droplist.addItem("Damião", 71);
  droplist.addItem("Desterro", 72);
  droplist.addItem("Diamante", 73);
  droplist.addItem("Dona Inês", 74);
  droplist.addItem("Duas Estradas", 75);
  droplist.addItem("Emas", 76);
  droplist.addItem("Esperança", 77);
  droplist.addItem("Fagundes", 78);
  droplist.addItem("Frei Martinho", 79);
  droplist.addItem("Gado Bravo", 80);
  droplist.addItem("Guarabira", 81);
  droplist.addItem("Gurinhém", 82);
  droplist.addItem("Gurjão", 83);
  droplist.addItem("Ibiara", 84);
  droplist.addItem("Igaracy", 85);
  droplist.addItem("Imaculada", 86);
  droplist.addItem("Ingá", 87);
  droplist.addItem("Itabaiana", 88);
  droplist.addItem("Itaporanga", 89);
  droplist.addItem("Itapororoca", 90);
  droplist.addItem("Itatuba", 91);
  droplist.addItem("Jacaraú", 92);
  droplist.addItem("Jericó", 93);
  droplist.addItem("João Pessoa", 94);
  droplist.addItem("Juarez Távora", 95);
  droplist.addItem("Juazeirinho", 96);
  droplist.addItem("Junco do Seridó", 97);
  droplist.addItem("Juripiranga", 98);
  droplist.addItem("Juru", 99);
  droplist.addItem("Lagoa", 100);
  droplist.addItem("Lagoa de Dentro", 101);
  droplist.addItem("Lagoa Seca", 102);
  droplist.addItem("Lastro", 103);
  droplist.addItem("Livramento", 104);
  droplist.addItem("Logradouro", 105);
  droplist.addItem("Lucena", 106);
  droplist.addItem("Mãe d'Água", 107);
  droplist.addItem("Malta", 108);
  droplist.addItem("Mamanguape", 109);
  droplist.addItem("Manaíra", 110);
  droplist.addItem("Marcação", 111);
  droplist.addItem("Mari", 112);
  droplist.addItem("Marizópolis", 113);
  droplist.addItem("Massaranduba", 114);
  droplist.addItem("Mataraca", 115);
  droplist.addItem("Matinhas", 116);
  droplist.addItem("Mato Grosso", 117);
  droplist.addItem("Maturéia", 118);
  droplist.addItem("Mogeiro", 119);
  droplist.addItem("Montadas", 120);
  droplist.addItem("Monte Horebe", 121);
  droplist.addItem("Monteiro", 122);
  droplist.addItem("Mulungu", 123);
  droplist.addItem("Natuba", 124);
  droplist.addItem("Nazarezinho", 125);
  droplist.addItem("Nova Floresta", 126);
  droplist.addItem("Nova Olinda", 127);
  droplist.addItem("Nova Palmeira", 128);
  droplist.addItem("Olho d'Água", 129);
  droplist.addItem("Olivedos", 130);
  droplist.addItem("Ouro Velho", 131);
  droplist.addItem("Parari", 132);
  droplist.addItem("Passagem", 133);
  droplist.addItem("Patos", 134);
  droplist.addItem("Paulista", 135);
  droplist.addItem("Pedra Branca", 136);
  droplist.addItem("Pedra Lavrada", 137);
  droplist.addItem("Pedras de Fogo", 138);
  droplist.addItem("Pedro Régis", 139);
  droplist.addItem("Piancó", 140);
  droplist.addItem("Picuí", 141);
  droplist.addItem("Pilar", 142);
  droplist.addItem("Pilões", 143);
  droplist.addItem("Pilõezinhos", 144);
  droplist.addItem("Pirpirituba", 145);
  droplist.addItem("Pitimbu", 146);
  droplist.addItem("Pocinhos", 147);
  droplist.addItem("Poço Dantas", 148);
  droplist.addItem("Poço de José de Moura", 149);
  droplist.addItem("Pombal", 150);
  droplist.addItem("Prata", 151);
  droplist.addItem("Princesa Isabel", 152);
  droplist.addItem("Puxinanã", 153);
  droplist.addItem("Queimadas", 154);
  droplist.addItem("Quixaba", 155);
  droplist.addItem("Remígio", 156);
  droplist.addItem("Riachão", 157);
  droplist.addItem("Riachão do Bacamarte", 158);
  droplist.addItem("Riachão do Poço", 159);
  droplist.addItem("Riacho de Santo Antônio", 160);
  droplist.addItem("Riacho dos Cavalos", 161);
  droplist.addItem("Rio Tinto", 162);
  droplist.addItem("Salgadinho", 163);
  droplist.addItem("Salgado de São Félix", 164);  
  droplist.addItem("Santa Cecília", 165);
  droplist.addItem("Santa Cruz", 166);
  droplist.addItem("Santa Helena", 167);
  droplist.addItem("Santa Inês", 168);
  droplist.addItem("Santa Luzia", 169);
  droplist.addItem("Santa Rita", 170);
  droplist.addItem("Santa Teresinha", 171);
  droplist.addItem("Santana de Mangueira", 172);
  droplist.addItem("Santana dos Garrotes", 173);
  droplist.addItem("Santarém", 174); 
  droplist.addItem("Santo André", 175);
  droplist.addItem("São Bentinho", 176);
  droplist.addItem("São Bento", 177);
  droplist.addItem("São Domingos", 178);
  droplist.addItem("São Domingos do Cariri", 179);
  droplist.addItem("São Francisco", 180);
  droplist.addItem("São João do Cariri", 181);
  droplist.addItem("São João do Rio do Peixe", 182);
  droplist.addItem("São João do Tigre", 183);  
  droplist.addItem("São José da Lagoa Tapada", 184);
  droplist.addItem("São José de Caiana", 185);
  droplist.addItem("São José de Espinharas", 186);
  droplist.addItem("São José dos Ramos", 187);
  droplist.addItem("São José de Piranhas", 188);
  droplist.addItem("São José de Princesa", 189);
  droplist.addItem("São José do Bonfim", 190);
  droplist.addItem("São José do Brejo do Cruz", 191);
  droplist.addItem("São José do Sabugi", 192);
  droplist.addItem("São José dos Cordeiros", 193);
  droplist.addItem("São Mamede", 194);
  droplist.addItem("São Miguel de Taipu", 195);
  droplist.addItem("São Sebastião de Lagoa de Roça", 196);
  droplist.addItem("São Sebastião do Umbuzeiro", 197);
  droplist.addItem("Sapé", 198);
  droplist.addItem("Seridó", 199);
  droplist.addItem("Serra Branca", 200);
  droplist.addItem("Serra Grande", 201);
  droplist.addItem("Serra da Raiz", 202);
  droplist.addItem("Serra Redonda", 203);
  droplist.addItem("Serraria", 204);
  droplist.addItem("Sertãozinho", 205);
  droplist.addItem("Sobrado", 206);
  droplist.addItem("Solânea", 207);
  droplist.addItem("Soledade", 208);
  droplist.addItem("Sossêgo", 209);
  droplist.addItem("Sousa", 210);
  droplist.addItem("Sumé", 211);
  droplist.addItem("Tacima", 212);
  droplist.addItem("Taperoá", 213);
  droplist.addItem("Tavares", 214);
  droplist.addItem("Teixeira", 215);
  droplist.addItem("Tenório", 216);
  droplist.addItem("Triunfo", 217);
  droplist.addItem("Uiraúna", 218);
  droplist.addItem("Umbuzeiro", 219);
  droplist.addItem("Várzea", 220);
  droplist.addItem("Vieirópolis", 221);
  droplist.addItem("Vista Serrana", 222); 
  droplist.addItem("Zabelê", 223);
    
}
  
void geraIndicadoresOutlier(String cidade) {
  try{  

    //String path = "\"C:\\Program Files\\R\\R-2.15.0\\bin\\Rscript.exe\" " + "C:\\Users\\Rodolfo\\Documents\\GitHub\\eduBrasil\\eduBrasil\\scripts\\processing\\mainScreen\\mainScreen\\cria_imagens.R" + " " + cidade;
    String path = "/usr/bin/Rscript " + "/home/iara/processing-2.0b3/sketchbook/SPRINT2/cria_imagens.R" + " " + cidade;
    System.setProperty("user.dir", "/home/iara/processing-2.0b3/sketchbook/SPRINT2");
    //String path = "\"C:\\Program Files\\R\\R-3.0.0\\bin\\x64\\Rscript.exe\" " + "C:\\Users\\Iara\\Documents\\GitHub\\eduBrasil\\eduBrasil\\scripts\\processing\\SPRINT2\\cria_imagens.R" + " " + cidade;
    
    println(path);
    println(new File(".").getAbsolutePath());
    Runtime r = Runtime.getRuntime();
    Process pr=r.exec(path);
    pr.waitFor();
    println(pr.exitValue());
    }catch(Exception e){
    System.out.println(e.getMessage());
  }
}

void geraIndicadoresTempo(String cidade) {
  try {
    
   // String path2 = "\"C:\\Program Files\\R\\R-3.0.0\\bin\\x64\\Rscript.exe\" " + "C:\\Users\\Iara\\Documents\\GitHub\\eduBrasil\\eduBrasil\\scripts\\processing\\SPRINT2\\gera_imagens_series_temporais(US-7).R" + " " + cidade; 
    String path2 = "/usr/bin/Rscript " + "/home/iara/processing-2.0b3/sketchbook/SPRINT2/gera_imagens_series_temporais(US-7).R" + " " + cidade;
    System.setProperty("user.dir", "/home/iara/processing-2.0b3/sketchbook/SPRINT2");
    println(path2);
    println(new File(".").getAbsolutePath());
    Runtime r2 = Runtime.getRuntime();
    Process pr2=r2.exec(path2);
    pr2.waitFor();
    println(pr2.exitValue());
    }catch(Exception e){
    System.out.println(e.getMessage());
  }
}
 
// controlEvent monitors clicks on the gui
void controlEvent(ControlEvent theEvent) {
  if (theEvent.isGroup()) {
    println("Peguei");

    println(theEvent.getGroup() + " => " + theEvent.getGroup().getValue());
    int index = (int)theEvent.getGroup().getValue();
    println(index);
    println(droplist.getItem(index));
    ListBoxItem cidade = droplist.getItem(index);
    println("Pequei" + " => " + cidade.getName());
    nome_cidade = cidade.getName();
    
    if(!existeArquivoDaCidade(nome_cidade)){
       geraIndicadoresOutlier(nome_cidade);
       geraIndicadoresTempo(nome_cidade);
    }   
    read_files();    
  }
}

private boolean existeArquivoDaCidade(String cidade){
  
  String nome;
  
 // File folder = new File(dataPath("C:\\Users\\Iara\\Documents\\GitHub\\eduBrasil\\eduBrasil\\scripts\\processing\\SPRINT2\\graphs\\"));
 
 File folder = new File(dataPath("/home/iara/processing-2.0b3/sketchbook/SPRINT2/graphs"));
  File[] indicadores = folder.listFiles(); 
  String[] temp;
  
  for(int i = 0; i < indicadores.length; i++){
    nome = indicadores[i].getName();
    temp = split(nome, "_");
    if(cidade.equals(temp[0])){
      println("Já existe arquivo!");
       return true;  
    }
  }
  return false;  
}


public String getNomeIndicador(int indicador){
  
  switch (indicador) {
            case 329:
                return("Analfabestimo pessoas com 18 ou mais");
            case 62:
                return("Despesa com pessoal e encargos sociais");
            case 89:
                return("IDEB - 5º ano do ensino fundamental");
            case 90:
                return("IDEB - 9º ano do ensino fundamental");
            case 333:
                return("Atendimento escolar p/ entre 4 e 17 anos de idade");
            case 73:
                return("Abandono total - ensino fundamental");
            case 74:
                return("Abandono - ensino médio");
            case 80:
                return("Aprovação total - ensino fundamental");
            case 81:
                return("Aprovação - ensino médio");
            case 176:
                return("Docentes com formação superior");
            case 177:
                return("Docentes temporários e de contratos indefinidos");
             case 202:
                return("Índice de precariedade de infraestrutura");
            case 184:
                return("Razão aluno por docente");
            case 7:
                return("Despesa corrente por aluno");
            case 201:
                return("Índice de eficiência da educação básica");
            default:
                 return("Deu erro!");
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
  loop();
  
  if (overRect(870,90,250,20)) {
      plot_indicador = true;
      id_indicador = 0;
  }else if (overRect(870,110,250,20)){
      plot_indicador = true;
      id_indicador = 1;
  }else if (overRect(870,130,250,20)){
      plot_indicador = true;
      id_indicador = 2;
  }else if (overRect(870,150,250,20)){
      plot_indicador = true;
      id_indicador = 3;
  }else if (overRect(870,170,300,20)){
      plot_indicador = true;
      id_indicador = 4;
  }else if (overRect(870,190,250,20)){
      plot_indicador = true;
      id_indicador = 5;
  }else if (overRect(870,210,250,20)){
      plot_indicador = true;
      id_indicador = 6;
  }else if (overRect(870,230,250,20)){
      plot_indicador = true;
      id_indicador = 7;
  }else if (overRect(870,250,250,20)){
      plot_indicador = true;
      id_indicador = 8;
  }else if (overRect(870,270,250,20)){
      plot_indicador = true;
      id_indicador = 9;
  }else if (overRect(870,290,250,20)){
      plot_indicador = true;
      id_indicador = 10;
  }else if (overRect(870,310,250,20)){
      plot_indicador = true;
      id_indicador = 11;
  }else if (overRect(870,330,250,20)){
      plot_indicador = true;
      id_indicador = 12;
  }else if (overRect(870,350,250,20)){
      plot_indicador = true;
      id_indicador = 13;
  }else if (overRect(870,370,250,20)){
      plot_indicador = true;
      id_indicador = 14;
  }else if(overRect(875,468,250,20)){
      plot_indicador_temporal = true;
      id_indicador_temporal = 0;
  }else if(overRect(875,488,250,20)){
      plot_indicador_temporal = true;
      id_indicador_temporal = 1;
  }else if(overRect(875,508,250,20)){
      plot_indicador_temporal = true;
      id_indicador_temporal = 2;
  }else if(overRect(875,528,250,20)){
      plot_indicador_temporal = true;
      id_indicador_temporal = 3;
  }else if(overRect(875,548,250,20)){
      plot_indicador_temporal = true;
      id_indicador_temporal = 4;
  }else if(overRect(875,568,250,20)){
      plot_indicador_temporal = true;
      id_indicador_temporal = 5;
  }else if(overRect(875,588,250,20)){
      plot_indicador_temporal = true;
      id_indicador_temporal = 6;
  }else if(overRect(875,608,250,20)){
      plot_indicador_temporal = true;
      id_indicador_temporal = 7;
  }else if(overRect(875,628,250,20)){
      plot_indicador_temporal = true;
      id_indicador_temporal = 8;
  }else if(overRect(875,648,250,20)){
      plot_indicador_temporal = true;
      id_indicador_temporal = 9;
  }else if(overRect(875,668,250,20)){
      plot_indicador_temporal = true;
      id_indicador_temporal = 10;
  }else if(overRect(875,688,250,20)){
      plot_indicador_temporal = true;
      id_indicador_temporal = 11;
  }else if(overRect(875,708,250,20)){
      plot_indicador_temporal = true;
      id_indicador_temporal = 12;
  }else if(overRect(875,728,250,20)){
      plot_indicador_temporal = true;
      id_indicador_temporal = 13;
  }else if(overRect(875,748,250,20)){
      plot_indicador_temporal = true;
      id_indicador_temporal = 14;
  }
   if(overRect(1250,350,85,40)){
    plot_indicador = false;
   }
   if(overRect(1250,725,80,35)){
    plot_indicador_temporal = false;
   }
}
