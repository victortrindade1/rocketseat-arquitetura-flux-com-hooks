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

`json-server foobar.json -p 3333 --H 0.0.0.0 --watch`

> A porta 3333 é a padrão para backend

> A flag -w (watch) é para ver o JSON sendo atualizado ao vivo enquanto roda

> A flag --H 0.0.0.0 é um localhost genérico q serve melhor. Ele resolveu um bug

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

## Bug (axios + json-server + react native)

Pode ser q precise trocar o `localhost` pro IP local da máquina. Para saber o ip
local: `hostname -I`. O axios e o json-server possuem uma incompatibilidade pois
o json-server lança um http em vez de https, o q faz o axios rejeitar. Para não
dar bug:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.7:3333', // 'http://<ip_local>:3333'
});

export default api;
```

android/app/src/main/AndroidManifest.xml:

```diff
<application
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:allowBackup="false"
      android:theme="@style/AppTheme"
+      android:usesCleartextTraffic="true">
      <activity
```

package.json:
`"server": "json-server foobar.json -p 3333 --H 0.0.0.0 --watch"`

> Coloque o --H 0.0.0.0 --watch
