# Configurando API

## JSON Server

JSON Server é uma lib q simula uma API do back-end, porém é uma API fake. Mt bom
para desenvolvimento front-end, sem depender do back-end pra desenvolver.

`yarn global add json-server`

Veja a documentação:
`https://github.com/typicode/json-server`

É assim q funciona:
Vc cria um arquivo JSON com o conteúdo que vc esperaria de uma response.

Ex:
foobar.json

```json
{
  "posts": [{ "id": 1, "title": "json-server", "author": "typicode" }],
  "comments": [{ "id": 1, "body": "some comment", "postId": 1 }],
  "profile": { "name": "typicode" }
}
```

Coloca este arquivo no root do projeto.

Starta o servidor fake:

`json-server foobar.json -p 3333 -w`

> A porta 3333 é a padrão para backend

> A flag -w (watch) é para ver o JSON sendo atualizado ao vivo enquanto roda

Pronto! Agora vc pode fazer requests com GET, POST, PUT, DELETE, com rotas
padrões.

## src/services/api.js

Tenha o axios instalado.

`yarn add axios`

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333',
});

export default api;
```
