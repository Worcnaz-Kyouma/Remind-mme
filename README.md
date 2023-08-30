<p align="center"><a href="https://www.aquicob.com.br/" target="_blank"><img src="https://www.aquicob.com.br/assets/img/logo/logo1.png" width="400"></a></p>

## Proposta do projeto/desafio
Problema: PROPOSTA A

Aqui somos um time muito unido e integrado, gostamos de nos comunicar, porém somos esquecidos. :(

Você pode nos ajudar criando um sisteminha que permita a armazenagem do nome, email e telefone de cada pessoa do time?
 
Vai ser legal se você criar uma aplicação em Node + React/Angular, mas fique livre para escolher suas tecnologias. No banco, você pode usar NeDB para facilitar. 

Alguns pontos importantes:
- Use sua criatividade, valorizamos muito o frontend e a experiência;
- Não se esqueça das validações;
- Faça um CRUD completo.

## Sobre a implementação

O sistema consiste em 2 partes: 

- Front-end
  - React(Com framework Next.js)
  - Typescript
  - React Query
  - SCSS
- Back-end
  - REST-Api
  - Node.js
  - Typescript
  - Express
  - ValidatorJS
  - NeDB

## Como rodar

Execute estes passos para as 2 partes da aplicação:

- Front-end: 
  - Requesitos: Node.js
  - Dentro da pasta client, instalar dependencias node presentes no arquivo "package.json". Caso possua o npm execute: "npm i"
  - Executar no diretorio client o comando: "npm run start"
- Back-end:
  - Requesitos: Node.js
  - Dentro da pasta server, instalar dependencias node presentes no arquivo "package.json". Caso possua o npm execute: "npm i"
  - Executar no diretorio server o comando: "npm run start"

## Descrição da solução

Com base nos requisitos, nos, da Remind-mme Company implementamos um sistema completo, que conta com:
- Criação de usuários especificos, com login e senha
- Criação de grupos de serviço, possibilitando não apenas ver os dados de cada participante do grupo, mas tambem se organizar mediante a projetos e tarefas
- Ainda na parte de grupos, existe um basico sistema de hierarquia com base em um valor singular chamado "level". Assim, usuarios com leveis mais altos em um grupo tem um controle maior sobre ele, possibilitando deleção do grupo e a remoção de participantes

Esperamos que nosso sistema possa auxili-los, muito obrigado pela oportunidade!

## Manual

Tela inicial
Login:
- Entrar em um usuario ja existente, com seu username e password
Sign Up:
- Criar usuario na tela de Sign up para logar no sistema


Tela principal
Header:
- Na esquerda superior há um botão escrito "Logout", para deslogar o usuario
- Na direita superior há um pequeno circulo com a imagem de seu proprio usuario logado. Ao clicar neste circulo:
  - Entrará em uma tela de showcase do usuario, ou é possivel ver todos seus dados e tambem edita-los

Botão inferior:
- Este botão é o gerador de times, é nele que você irá clicar para gerar quantos times quiser para o usuario logado

Corpo central:
- Será aqui que os grupos vão aparecer, a principio todos estão minimizados
- Times:
  - Na parte direita superior do grupo haverão opções de "Sair" do time ou "Deletar" o time(Vale notar que apenas os usuarios de maior level no time podem deleta-lo)
  - Na parte do time minimazado, existe uma pequena flecha, que ao ser clicada abrirá o grupo
  - Com o grupo aberto, mostraram todos os usuarios que pertencem ao grupo, de tal forma que cada um deles estará no segmento referente ao seu level no time.
  - Ao clicar em um usuario apareceram todas as suas informações, se caso o level de seu usuario logado cumprir alguns requisitos, ele poderá remover o usuario do grupo ou aumentar seu level nele
  - Na parte mais inferior no time aberto, acima do icone de abrir e fechar o grupo, existe um botão para inserir novos membros no grupo, ao clicar nele abrirá o "Buscador de usuarios"

Level: Cada usuario tem um level em cada grupo que tiver, com base neste numero terá algumas permissões especiais
- Caso seu usuario logado tenha um level que seja igual ao maior do grupo, ele pode deleta-lo e aumentar/diminuir indefinidamente o level de outros usuarios, podendo ate remove-los
- Usuario de level menor que o usuario logado podem ser removidos, e alem disto pode-se aumentar o diminuir seu level, com o limite sendo o seu proprio level no grupo(a não ser que a observação de cima seja verdadeira, neste caso, você pode alterar indefinidamente o level do usuario)

Buscador de usuarios:
- Nesta tela designada a buscar novos usuario, pode-se buscar com base no "Nome, Email e Telefone", e ao clicar em "Search" encontrará os usuarios, que serão dispostos de maneira paginada
- Ao clicar em um usuario encontrado ele será adicionado no grupo





