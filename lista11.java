package primeiroProjeto;

import java.util.Scanner;

public class lista11 {

	public static void main(String[] args) {
		
		Scanner scanner = new Scanner(System.in);

        // 1 - Contador:
        System.out.println("------------------------");
        int contador = 1;
        do {
            System.out.println(contador);
            contador += 2;
        } while (contador <= 31);

        // 2 - Adivinhação de número: 
        System.out.println("------------------------");
        int numero = 0;
        do {
            System.out.println("Digite um número:");
            numero = scanner.nextInt();
        } while (numero != 100);
        

        // 3 - Menu interativo
        System.out.println("------------------------");
        int opcao;
        do {
            System.out.println("Escolha uma opção:");
            System.out.println("1 - Continuar");
            System.out.println("2 - Sair");
            opcao = scanner.nextInt();

            if (opcao == 1) {
                System.out.println("Você escolheu continuar!");
            } else if (opcao == 2) {
                System.out.println("Encerrando");
            } else {
                System.out.println("Opção inválida!");
            }
        } while (opcao != 2);

        // 4 - Classificação de números
        System.out.println("------------------------");
        int cont4 = 1;
        int valor;
        do {
            System.out.println("Digite um número:");
            valor = scanner.nextInt();

            if (valor < 10) {
                System.out.println("Tipo A");
            } else if (valor < 20) {
                System.out.println("Tipo B");
            } else {
                System.out.println("Fora da Categoria");
            }
            cont4++;
        } while (cont4 <= 5);

        // 5 - Temperatura do forno
        System.out.println("------------------------");
        int temperatura;
        do {
            System.out.println("Digite a temperatura do forno:");
            temperatura = scanner.nextInt();

            if (temperatura >= 200) {
                System.out.println("ALERTA! Temperatura muito alta!");
            }
        } while (temperatura >= 200);
        System.out.println("Temperatura dentro da faixa segura!");

        // 6 - Verificação de bateria
        System.out.println("------------------------");
        int bateria;
        do {
            System.out.println("Digite o nível da bateria (%):");
            bateria = scanner.nextInt();

            if (bateria <= 20) {
                System.out.println("Bateria baixa!");
            }
        } while (bateria <= 20);
        System.out.println("Bateria em nível seguro!");

        // 7 - Deseja fazer uma conta?
        System.out.println("------------------------");
        String resposta;
        System.out.println("Deseja fazer uma conta? (sim/não)");
        resposta = scanner.next();

        if (resposta.equalsIgnoreCase("sim")) {
            System.out.println("Digite o primeiro número:");
            int n1 = scanner.nextInt();
            System.out.println("Digite o segundo número:");
            int n2 = scanner.nextInt();
            int soma = n1 + n2;
            System.out.println("Resultado da soma: " + soma);
        } else {
      
        }

        
    }


	}


