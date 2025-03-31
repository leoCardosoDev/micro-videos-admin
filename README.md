### Docker com Node.js

Este tutorial vai te guiar pela configuração inicial de um ambiente Docker para uma aplicação Node.js. Vamos criar um `Dockerfile`, um `docker-compose.yaml` e um script `start.sh` para gerenciar a instalação de dependências com `npm` e manter o container em execução.

## Estrutura do Projeto

Antes de começar, a estrutura do diretório do projeto deve ser semelhante a esta:

```
/seu-projeto
|-- .docker/
|   |-- start.sh
|-- docker-compose.yaml
|-- Dockerfile
|-- package.json
|-- [outros arquivos do projeto Node]

```

### Passo 1: Criar o `Dockerfile`

O `Dockerfile` define a imagem base e o ambiente que será configurado para executar a aplicação. Aqui está o conteúdo do seu `Dockerfile`:

### `Dockerfile`

```
# Usa a imagem base do Node.js versão slim (menor)
FROM node:20.5.1-slim

# Define o usuário 'node' para evitar rodar o container como root
USER node

# Define o diretório de trabalho dentro do container
WORKDIR /home/node/app

# Comando padrão ao iniciar o container (chama o script start.sh)
CMD [".docker/start.sh"]

```

### Passo 2: Criar o `docker-compose.yaml`

O `docker-compose.yaml` define como o Docker deve construir e rodar os containers, além de especificar as portas, volumes e o comando inicial.

### `docker-compose.yaml`

```yaml
version: "3"
services:
  app:
    build: .                      # Usa o Dockerfile atual para construir a imagem
    command: ./.docker/start.sh    # Define o script que será executado ao iniciar o container
    ports:
      - 3000:3000                 # Mapeia a porta 3000 do container para a máquina local
    volumes:
      - .:/home/node/app          # Sincroniza o diretório do projeto na máquina local com o container

```

### Passo 3: Criar o script `start.sh`

Esse script será responsável por instalar as dependências do projeto e manter o container em execução.

### `.docker/start.sh`

```bash
#!/bin/bash

# Instala as dependências do projeto
npm install

# Mantém o container rodando sem parar
tail -f /dev/null

```

> Nota: A linha #!/bin/bash no início do script é o "shebang", que informa ao sistema que o script deve ser executado no Bash. O comando tail -f /dev/null mantém o container em execução para que ele não seja encerrado imediatamente.
> 

### Passo 4: Configurar as permissões para o script

Antes de iniciar o container, é importante garantir que o arquivo `start.sh` tenha permissões de execução. Para isso, rode o seguinte comando no terminal:

```bash
chmod +x .docker/start.sh

```

### Passo 5: Inicializar o container com Docker Compose

Agora que todos os arquivos estão configurados, podemos iniciar o container. Rode o seguinte comando no terminal, dentro do diretório raiz do projeto:

```bash
docker-compose up --build

```

Este comando vai:

- Construir a imagem com base no `Dockerfile`.
- Executar o script `start.sh` dentro do container.
- Instalar as dependências do projeto com `npm install`.
- Manter o container em execução para que você possa interagir com ele.

### Passo 6: Acessar o container

Com o container em execução, você pode acessar o terminal dentro do container para rodar comandos adicionais do Node.js ou inspecionar o ambiente. Use o seguinte comando para abrir um terminal no container:

```bash
docker-compose exec app bash

```

Agora você está dentro do container e pode rodar qualquer comando como `npm start` ou `node app.js`.

### Passo 7: Executar a aplicação Node.js

Caso sua aplicação tenha um arquivo `app.js` ou outro arquivo de inicialização, você pode rodar o comando para iniciar a aplicação dentro do container.

Por exemplo, se o arquivo principal da aplicação for `app.js`, rode:

```bash
node app.js

```

A partir desse ponto, a aplicação estará rodando dentro do container e acessível pela porta `3000` no seu navegador via `http://localhost:3000`.

### Conclusão

Este tutorial cobre o processo de configuração inicial do Docker para uma aplicação Node.js, desde a criação do `Dockerfile`, configuração do `docker-compose.yaml`, até a execução dos comandos dentro do container. Agora você tem um ambiente Docker configurado e pode usar containers para rodar e testar sua aplicação Node.js.