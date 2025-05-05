# 🌳 Projeto de Reflorestamento

Um sistema web para gerenciamento de ações de reflorestamento, desenvolvido como parte do curso JoinvilleMaisTec. Este projeto front-end permite que usuários registrem suas contribuições para o meio ambiente através do plantio de árvores.

## 📹 Demonstração

https://github.com/user-attachments/assets/a3c069a5-3aef-49e3-a852-b66ca6450b6e

![image](https://github.com/user-attachments/assets/a262fab6-7ed6-410d-bbfd-09bdfc17adc5)


![image-1](https://github.com/user-attachments/assets/2e512ba2-f526-400d-808f-6fbccbf05cc7)

![image-2](https://github.com/user-attachments/assets/939c03ff-206d-4570-8a82-4706ddd33a6d)


![image-3](https://github.com/user-attachments/assets/b2aa1243-fee7-4dd8-82e7-fb9b90f124c4)

![image-4](https://github.com/user-attachments/assets/7a3bd69b-4fe1-4644-a0ce-a0600eca6f77)



## 📋 Funcionalidades

- **Cadastro de Usuários**:
  - Registro de novos usuários com seleção de avatar (Pau-Brasil, Castanheira ou Peroba-Rosa)
  - Sistema de autenticação
  - Esquema de cores personalizadas baseado na árvore escolhida

- **Registro de Ações de Reflorestamento**:
  - Cadastro de quantidade e espécies de árvores plantadas (Ipês, Angicos, Aroeiras, Jequitibás e Peroba do campo)
  - Registro de local e data do plantio

- **Perfil de Usuário**:
  - Visualização e edição da biografia do usuário
  - Exibição de estatísticas de reflorestamento
  - Avatar que evolui conforme a quantidade de árvores plantadas (estágios: semente, plantada, broto, jovem e madura)
  - Barra de progresso visual para acompanhamento

- **Relatórios**:
  - Busca por usuário e/ou tipo de árvore
  - Exibição detalhada de registros de reflorestamento
  - Contabilização automática de árvores plantadas

- **Destaques**:
  - Exibição dos 3 usuários que mais contribuíram com o reflorestamento

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estruturação das páginas
- **CSS3**: Estilização e layout responsivo
- **JavaScript**: Lógica de programação client-side
- **LocalStorage**: Armazenamento de dados no navegador

## 📱 Layout Responsivo

O projeto foi desenvolvido com foco em responsividade, adaptando-se a diferentes tamanhos de tela:

- Desktop
- Tablet
- Mobile

## 🚀 Como Executar o Projeto

1. Clone este repositório:
   ```bash
   git clone https://github.com/danitavareslobo/miniprojeto-reflorestamento.git
   ```

2. Navegue até a pasta do projeto:
   ```bash
   cd miniprojeto-reflorestamento
   ```

3. Abra o arquivo `cadastro.html` no seu navegador ou utilize um servidor local como Live Server no VS Code.

## 🏗️ Estrutura do Projeto

```
├── cadastroUsuario/        # Registro de novos usuários
├── acoesReflorestamento/   # Cadastro de ações de plantio
├── perfilUsuario/          # Perfil e estatísticas do usuário
├── relatorioReflorestamento/ # Busca e exibição de relatórios
├── destaquesReflorestamento/ # Usuários em destaque
├── menuComponente/         # Componente de navegação
├── assets/                 # Imagens e recursos visuais
└── data/                   # Dados simulados em JSON
```

## 📋 Regras de Negócio

- Os usuários podem escolher entre três tipos de árvores como avatar: Pau-Brasil, Castanheira e Peroba-Rosa
- O estilo visual da aplicação muda conforme a árvore escolhida pelo usuário
- O avatar evolui conforme a quantidade de árvores plantadas:
  - Semente: 0-99 árvores
  - Plantada: 100-299 árvores
  - Broto: 300-699 árvores
  - Jovem: 700-1499 árvores
  - Madura: 1500+ árvores
- As espécies disponíveis para plantio são: Ipês, Angicos, Aroeiras, Jequitibás e Peroba do campo
- Os usuários só podem alterar sua BIO no perfil

## 🔜 Melhorias Futuras

- Implementação de back-end para persistência de dados
- Mapa interativo de áreas reflorestadas
- Compartilhamento em redes sociais

## 👩‍💻 Autor

**Daniele Tavares Lobo**
- GitHub: https://github.com/danitavareslobo 
- Linkedin: https://www.linkedin.com/in/danitavareslobo


---

Desenvolvido como parte do curso JoinvilleMaisTec © 2025
