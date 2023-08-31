<p align="center"><img src="https://media.discordapp.net/attachments/679383239948894220/1146645237050114129/1637075117552__1_-removebg-preview.png" width="30%" height="20%"></p>

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

Front-end
- React(Com framework Next.js)
- Typescript
- React Query
- SCSS

Back-end
- REST-Api
- Node.js
- Typescript
- Express
- ValidatorJS
- NeDB



## Como rodar

Baixe o arquivo ZIP do projeto e descompacte-o onde preferir.

Execute estes passos para as 2 partes da aplicação:

Front-end:
- Requisitos: Node.js, npm.
- Abra um terminal dentro da pasta "client", instale as dependências do Node presentes no arquivo "package.json" executando o comando: "npm i".
- Após instalar as dependências no passo anterior, execute o comando "npm run build" no mesmo diretório para construir a aplicação.
- Ao finalizar os passos anteriores, execute o comando "npm run start" no diretório "client".

Back-end:
- Requisitos: Node.js, npm.
- Abra um outro terminal(diferente do anterior que esta rodando o client) dentro da pasta "server", instale as dependências do Node presentes no arquivo "package.json" executando o comando: "npm i".
- Após concluir os passos anteriores, execute o comando "npm run start" no diretório "server".


## Descrição da solução

<p align="center" style="margin:50px;"><img src="https://media.discordapp.net/attachments/679383239948894220/1146646488588505178/Sem_Titulo-1.png?width=989&height=347" width="50%" height="40%"></p>

Com base nos requisitos, nós da Remind-me Company implementamos um sistema completo que conta com:
- Criação de usuários específicos, com login e senha.
- Criação de grupos de serviço, possibilitando não apenas a visualização dos dados de cada participante do grupo (como nome, email e telefone), mas também a organização por projetos e tarefas.
- Além disso, na parte de grupos, existe um sistema básico de hierarquia com base em um valor singular chamado "level". Dessa forma, usuários com níveis mais altos em um grupo têm um controle maior sobre ele, possibilitando a exclusão do grupo e a remoção de participantes.


Esperamos que nosso sistema possa auxiliá-los. Muito obrigado pela oportunidade!



## Manual
Abaixo, descrevo uma breve instrução sobre como usar a aplicação e suas funcionalidades:

## Tela Inicial
Login:
- Acessar com um usuário já existente, inserindo seu nome de usuário e senha.

Sign Up:
- Criar um novo usuário na tela de Cadastro para efetuar o login no sistema.

## Tela Principal

Header:
- No canto superior esquerdo, há um botão escrito "Sair" para efetuar o logout do usuário.
- No canto superior direito, encontra-se um pequeno círculo com a imagem do usuário logado. Ao clicar neste círculo:
  - Você será redirecionado para uma tela de perfil do usuário, onde é possível visualizar e editar seus dados.

## Corpo Central
No centro, a aplicação informará caso o usuário logado não esteja em nenhum grupo. Além disso, nesta seção os times serão exibidos. Inicialmente, todos os times estarão minimizados.

Botão Inferior Esquerdo:
- Este botão é o gerador de times. Ao clicar nele, você poderá criar quantos times desejar para o usuário logado.

Times:
- Na parte superior direita de cada grupo, haverão opções "Sair" do time ou "Excluir" o time (É importante observar que apenas os usuários com leveis mais altos no time podem excluí-lo).
- Na seção de time minimizado, existe uma pequena seta que, ao ser clicada, expandirá o grupo.
- Com o grupo expandido, todos os usuários pertencentes ao grupo serão exibidos, cada um no segmento correspondente ao seu level no time.
- Ao clicar em um usuário, todas as suas informações serão mostradas. Se o level do seu usuário logado atender a certos requisitos (detalhados na seção de "Level" do manual, logo abaixo), você poderá remover o usuário do grupo ou aumentar o level dele.
- Clicando em seu usuário no time, é possível aumentar o seu próprio nível, caso tenha capacidade para fazê-lo.
- Na parte inferior da seção do time expandido, acima do ícone de expandir/contrair o grupo, existe um botão para adicionar novos membros ao grupo. Ao clicar nele, o "Buscador de Usuários" será aberto.

Level:
- Cada usuário possui um level em cada grupo ao qual pertence. Com base nesse número, algumas permissões especiais serão concedidas.
- Se o level do seu usuário logado for igual ao level mais alto do grupo, ele pode excluí-lo e aumentar/diminuir o level de outros usuários, podendo até mesmo removê-los.
- Usuários com leveis mais baixos do que o usuário logado podem ser removidos, e também é possível aumentar ou diminuir o level deles. O limite é o próprio level do usuário no grupo (a menos que a observação anterior seja aplicável; nesse caso, você pode alterar o level do usuário indefinidamente).

Buscador de Usuários:
- Nessa tela destinada a buscar novos usuários, você pode realizar a busca com base no "Nome, Email e Telefone". Ao clicar em "Buscar", os usuários correspondentes serão exibidos de forma paginada.
- Ao clicar em um usuário encontrado, ele será adicionado ao grupo.
