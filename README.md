# StockFlow — AT1 PPDM

Aplicativo React Native/Expo para gerenciamento de produtos e categorias, com integração à API REST desenvolvida na disciplina de PBE 2.

## Funcionalidades

- Autenticação com JWT
- CRUD de Categorias (listar, criar, editar, excluir)
- CRUD de Produtos (listar, criar, editar, excluir)

## Credenciais de acesso

```
Email: admin@admin.com
Senha: admin123
```

## Como rodar

### 1. Configurar o IP do backend

Abra o arquivo `src/api/api.ts` e troque o IP pelo endereço da sua máquina:

```ts
const api = axios.create({
  baseURL: 'http://SEU_IP_AQUI:3000',
  timeout: 10000,
});
```

Para descobrir seu IP: `ipconfig` (Windows) → IPv4 do adaptador Wi-Fi ou Ethernet.

### 2. Configurar o backend

O backend utilizado é o da disciplina de PBE 2. Com as alterações de autenticação JWT aplicadas:

```bash
cd caminho/do/backend
cp .env.example .env
# edite o .env com suas credenciais do banco de dados
npm install
npm run build
npm start
```

### 3. Rodar o app

```bash
npm install
npx expo start
```

Leia o QR Code com o app Expo Go no celular (mesma rede Wi-Fi que o backend).

## Tecnologias

- React Native 0.81.5 + Expo SDK 54
- TypeScript
- Axios (HTTP + JWT no header)
- React Navigation (Native Stack)
- Node.js + Express (backend PBE 2)
- MySQL
- JWT (jsonwebtoken)
