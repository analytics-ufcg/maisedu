package visual;
import processing.core.PApplet;

//objeto do tipo municipio que contem todas as informaçoes disponiveis deste
// uma lista com os valores de cada indicador por ano

//"","COD_UF","NOME_UF","COD_MUNICIPIO","ANO","COD_MESO","NOME_MESO","COD_MICRO","NOME_MICRO","NOME_MUNICIPIO","INDICADOR_329","OUTLIER_INDICADOR_329",
//"INDICADOR_62","OUTLIER_INDICADOR_62","INDICADOR_89","OUTLIER_INDICADOR_89","INDICADOR_90","OUTLIER_INDICADOR_90","INDICADOR_333","OUTLIER_INDICADOR_333",
//"INDICADOR_73","OUTLIER_INDICADOR_73","INDICADOR_74","OUTLIER_INDICADOR_74","INDICADOR_80","OUTLIER_INDICADOR_80","INDICADOR_81","OUTLIER_INDICADOR_81",
//"INDICADOR_176","OUTLIER_INDICADOR_176","INDICADOR_177","OUTLIER_INDICADOR_177","INDICADOR_202","OUTLIER_INDICADOR_202","INDICADOR_184","OUTLIER_INDICADOR_184",
//"INDICADOR_7","OUTLIER_INDICADOR_7","INDICADOR_201","OUTLIER_INDICADOR_201"

//pensar em uma forma de informar a quantidade de anos de forma automatica

public class Municipio extends PApplet{
	String nome;
	String micro_regiao;
	String meso_regiao;
	String codigo;
	String[] ano2000,ano2007,ano2008,ano2009,ano2010,ano2011;
	int quantidade_indicadores = 30;

	public Municipio(String nome){
		String[] tmp = split(nome,",");
		this.nome = tmp[9];
		this.micro_regiao = tmp[8];
		this.meso_regiao = tmp[6];
		this.codigo = tmp[5];
		this.ano2000 = new String[quantidade_indicadores];
		this.ano2007 = new String[quantidade_indicadores];
		this.ano2008 = new String[quantidade_indicadores];
		this.ano2009 = new String[quantidade_indicadores];
		this.ano2010 = new String[quantidade_indicadores];
		this.ano2011 = new String[quantidade_indicadores];
	}

	public void dadosPorAno(String[] ano1, String[] ano2, String[] ano3, String[] ano4, String[] ano5, String[] ano6 ){    
		for(int index = 0; index < quantidade_indicadores; index++){
			ano2000[index] = ano1[index+9];
			ano2007[index] = ano2[index+9];
			ano2008[index] = ano3[index+9];
			ano2009[index] = ano4[index+9];
			ano2010[index] = ano5[index+9];
			ano2011[index] = ano6[index+9];
		}
	}
}