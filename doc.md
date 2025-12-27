Como pensei na ordem de implementação

Na primeira fase, foquei em entender a estrutura do código base e os comportamentos da api. Para isso, subi o backend utilizando Docker e explorei os endpoints disponíveis. Em seguida, analisei o mock-up do frontend para identificar as funcionalidades pendentes.

Após essa análise, os próximos passos serão (frontend):

1. Implementar o src/index.js para configurar a aplicação React e integrar com a API backend.
2. src/styles.css: Adicionar estilos básicos para garantir uma boa experiência de usuário.
3. src/api.js: Criar funções para interagir com os endpoints da API, facilitando operações CRUD.
4. src/App.js: Desenvolver a estrutura principal da aplicação, incluindo roteamento e layout.

Em uma segunda fase, pretendo focar de fato no CRUD, implementando as funcionalidades de criação, leitura, atualização e exclusão de dados, garantindo que todas as interações com a API estejam funcionando corretamente (Listar pessoas + delete + criar pessoa + editar pessoa + botões next e previous).

5. src/components/PersonList.js: Implementar a listagem de pessoas, incluindo botões de navegação (next e previous).
6. src/components/PersonForm.js: Criar o formulário para adicionar e editar pessoas.

Fase 3: Tarefas assincronas e funcionalidades extras

src/components/LongTaskPanel.js: Start task + Polling status
filtro por data (de criação ou de última atualização)
cálculo de média e desvio padrão (utilizando Celery)

Alguns comandos importantes:

- docker-compose up --build: Para subir o backend com Docker.
- docker-compose down: Para parar o backend.
- npm start: Para iniciar o frontend React.