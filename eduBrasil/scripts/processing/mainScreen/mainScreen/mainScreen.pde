import controlP5.*;
import java.io.*;
ControlP5 cp5;
 
int myColorBackground = color(0,0,0);



 
void setup() {
  try{
    Runtime r = Runtime.getRuntime();
    Process p = r.exec("C:/Users/Rodolfo/Documents/GitHub/eduBrasil/eduBrasil/scripts/processing/mainScreen/mainScreen.pde");
  }catch(IOException e){
    System.out.println("IOException");
  }
  
  size(800, 640);
  cp5 = new ControlP5(this);
 
  // add a dropdownlist at position (50,100)
  DropdownList droplist = cp5.addDropdownList("Escolha sua cidade:").setPosition(50, 100);
 
  // add items to the dropdownlist
  
  droplist.addItem("Água Branca ", 1);
  droplist.addItem("Aguiar", 2);
  droplist.addItem("Alagoa Grande", 3);
  droplist.addItem("Alagoa Nova", 4);
  droplist.addItem("Alagoinha", 5);
  droplist.addItem("Alcantil", 6);
  droplist.addItem("Algodão de Jandaíra", 7);
  droplist.addItem("Alhandra", 8);
  droplist.addItem("São João do Rio do Peixe", 182);
  droplist.addItem("Amparo", 9);
  droplist.addItem("Aparecida", 10);
  droplist.addItem("Araçagi", 11);
  droplist.addItem("Arara", 12);
  droplist.addItem("Araruna", 13);
  droplist.addItem("Areia", 14);
  droplist.addItem("Areia de Baraúnas", 15);
  droplist.addItem("Areial", 16);
  droplist.addItem("Aroeiras", 17);
  droplist.addItem("Assunção", 18);
  droplist.addItem("Baía da Traição", 19);
  droplist.addItem("Bananeiras", 20);
  droplist.addItem("Baraúna", 21);
  droplist.addItem("Barra de Santa Rosa", 22);
  droplist.addItem("Barra de Santana", 23);
  droplist.addItem("Barra de São Miguel", 24);
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
  droplist.addItem("Igaracy", 85);
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
  droplist.addItem("Cuitegi", 68);
  droplist.addItem("Cuité de Mamanguape", 67);
  droplist.addItem("Curral de Cima", 69);
  droplist.addItem("Curral Velho", 70);
  droplist.addItem("Damião", 71);
  droplist.addItem("Desterro", 72);
  droplist.addItem("Vista Serrana", 213);  
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
  droplist.addItem("Imaculada", 86);
  droplist.addItem("Ingá", 87);
  droplist.addItem("Itabaiana", 88);
  droplist.addItem("Itaporanga", 89);
  droplist.addItem("Itapororoca", 90);
  droplist.addItem("Itatuba", 91);
  droplist.addItem("Jacaraú", 92);
  droplist.addItem("Jericó", 93);
  droplist.addItem("João Pessoa", 94);
  //droplist.addItem("Joca Claudino", 95);
  droplist.addItem("Juarez Távora", 96);
  droplist.addItem("Juazeirinho", 97);
  droplist.addItem("Junco do Seridó", 98);
  droplist.addItem("Juripiranga", 99);
  droplist.addItem("Juru", 100);
  droplist.addItem("Lagoa", 101);
  droplist.addItem("Lagoa de Dentro", 102);
  droplist.addItem("Lagoa Seca", 103);
  droplist.addItem("Lastro", 104);
  droplist.addItem("Livramento", 105);
  droplist.addItem("Logradouro", 106);
  droplist.addItem("Lucena", 107);
  droplist.addItem("Mãe d'Água", 108);
  droplist.addItem("Malta", 109);
  droplist.addItem("Mamanguape", 110);
  droplist.addItem("Manaíra", 111);
  droplist.addItem("Marcação", 112);
  droplist.addItem("Mari", 113);
  droplist.addItem("Marizópolis", 114);
  droplist.addItem("Massaranduba", 115);
  droplist.addItem("Mataraca", 116);
  droplist.addItem("Matinhas", 117);
  droplist.addItem("Mato Grosso", 118);
  droplist.addItem("Maturéia", 119);
  droplist.addItem("Mogeiro", 120);
  droplist.addItem("Montadas", 121);
  droplist.addItem("Monte Horebe", 122);
  droplist.addItem("Monteiro", 123);
  droplist.addItem("Mulungu", 124);
  droplist.addItem("Natuba", 125);
  droplist.addItem("Nazarezinho", 126);
  droplist.addItem("Nova Floresta", 127);
  droplist.addItem("Nova Olinda", 128);
  droplist.addItem("Nova Palmeira", 129);
  droplist.addItem("Olho d'Água", 130);
  droplist.addItem("Olivedos", 131);
  droplist.addItem("Ouro Velho", 132);
  droplist.addItem("Parari", 133);
  droplist.addItem("Passagem", 134);
  droplist.addItem("Patos", 135);
  droplist.addItem("Paulista", 136);
  droplist.addItem("Pedra Branca", 137);
  droplist.addItem("Pedra Lavrada", 138);
  droplist.addItem("Pedras de Fogo", 139);
  droplist.addItem("Pedro Régis", 140);
  droplist.addItem("Piancó", 141);
  droplist.addItem("Picuí", 142);
  droplist.addItem("Pilar", 143);
  droplist.addItem("Pilões", 144);
  droplist.addItem("Pilõezinhos", 145);
  droplist.addItem("Pirpirituba", 146);
  droplist.addItem("Pitimbu", 147);
  droplist.addItem("Pocinhos", 148);
  droplist.addItem("Poço Dantas", 149);
  droplist.addItem("Poço de José de Moura", 150);
  droplist.addItem("Pombal", 151);
  droplist.addItem("Prata", 152);
  droplist.addItem("Princesa Isabel", 153);
  droplist.addItem("Puxinanã", 154);
  droplist.addItem("Queimadas", 155);
  droplist.addItem("Quixaba", 156);
  droplist.addItem("Remígio", 157);
  droplist.addItem("Riachão", 158);
  droplist.addItem("Riachão do Bacamarte", 159);
  droplist.addItem("Riachão do Poço", 160);
  droplist.addItem("Riacho de Santo Antônio", 161);
  droplist.addItem("Riacho dos Cavalos", 162);
  droplist.addItem("Rio Tinto", 163);
  droplist.addItem("Salgadinho", 164);
  droplist.addItem("Salgado de São Félix", 165);
  droplist.addItem("Santa Cecília", 166);
  droplist.addItem("Santa Cruz", 167);
  droplist.addItem("Santa Helena", 168);
  droplist.addItem("Santa Inês", 169);
  droplist.addItem("Santa Luzia", 170);
  droplist.addItem("Santa Rita", 171);
  droplist.addItem("Santa Teresinha", 172);
  droplist.addItem("Santana de Mangueira", 173);
  droplist.addItem("Santana dos Garrotes", 174);
  droplist.addItem("Santarém", 214); 
  droplist.addItem("Santo André", 175);
  droplist.addItem("São Bentinho", 176);
  droplist.addItem("São Bento", 177);
  droplist.addItem("São Domingos", 178);
  droplist.addItem("São Domingos do Cariri", 179);
  droplist.addItem("São Francisco", 180);
  droplist.addItem("São João do Cariri", 181);
  droplist.addItem("São João do Tigre", 183);
  droplist.addItem("São José da Lagoa Tapada", 184);
  droplist.addItem("São José de Caiana", 185);
  droplist.addItem("São José de Espinharas", 186);
  droplist.addItem("São José dos Ramos", 215);
  droplist.addItem("São José de Piranhas", 187);
  droplist.addItem("São José de Princesa", 188);
  droplist.addItem("São José do Bonfim", 189);
  droplist.addItem("São José do Brejo do Cruz", 190);
  droplist.addItem("São José do Sabugi", 191);
  droplist.addItem("São José dos Cordeiros", 216);
  droplist.addItem("São Mamede", 192);
  droplist.addItem("São Miguel de Taipu", 193);
  droplist.addItem("São Sebastião de Lagoa de Roça", 194);
  droplist.addItem("São Sebastião do Umbuzeiro", 195);
  droplist.addItem("Sapé", 217);
  droplist.addItem("Seridó", 196);
  droplist.addItem("Serra Branca", 197);
  droplist.addItem("Serra Grande", 198);
  droplist.addItem("Serra da Raiz", 199);
  droplist.addItem("Serra Redonda", 200);
  droplist.addItem("Serraria", 201);
  droplist.addItem("Sertãozinho", 202);
  droplist.addItem("Sobrado", 203);
  droplist.addItem("Solânea", 204);
  droplist.addItem("Soledade", 218);
  droplist.addItem("Sossêgo", 205);
  droplist.addItem("Sousa", 219);
  droplist.addItem("Sumé", 220);
  droplist.addItem("Tacima", 206);
  droplist.addItem("Taperoá", 221);
  droplist.addItem("Tavares", 207);
  droplist.addItem("Teixeira", 195);
  droplist.addItem("Tenório", 208);
  droplist.addItem("Triunfo", 209);
  droplist.addItem("Uiraúna", 195);
  droplist.addItem("Umbuzeiro", 221);
  droplist.addItem("Várzea", 222);
  droplist.addItem("Vieirópolis", 211);
  droplist.addItem("Zabelê", 212);
  
}
 
void draw() {
  background(128);
  // controlp5 autodraw is on by default (if you use the default JAVA2D renderer)
  // this means the gui is automatically drawn at the end
}
 
// controlEvent monitors clicks on the gui
void controlEvent(ControlEvent theEvent) {
  if (theEvent.isGroup()) {
    println(theEvent.getGroup() + " => " + theEvent.getGroup().getValue());
  }
}
