# BuyBye Backend
## Projeto Programação para Web e Desenvolvimento de Software para a Nuvem

### Backend application NodeJS + ExpressJS + MongoDB.


[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/) [![Node.js](https://img.shields.io/badge/Node.js-18-green?logo=node.js)](https://nodejs.org/) [![Express.js](https://img.shields.io/badge/Express.js-4.18-black?logo=express)](https://expressjs.com/) [![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?logo=mongodb)](https://www.mongodb.com/) [![Docker](https://img.shields.io/badge/Docker-24.0-blue?logo=docker)](https://www.docker.com/) [![Version](https://img.shields.io/badge/Version-1.0-blue)](https://semver.org/)

A aplicação ouve em:
http://localhost:3000/


## Referências API

### Autenticação

Registar novo utilizador

```html
POST /api/auth/register
```

```json
{
  "name": "Cão Baloiço",
  "email": "caoauau@email.com",
  "password": "SportingCampeao2"
}
```

Fazer login

```html
POST /api/auth/register
```

```json
{
  "email": "pato@email.com",
  "password": "123321"
}
```

### Produtos

Listar todos os produtos

```html
GET /api/products
```

```json
{
  "page": "1",
  "limit": "10",
  "sort": "nome_az", // Ordenar pelo nome de A a Z
  "search": "",
}
```

Criar um novo produto

```html
POST /api/products
```

```json
{
  "name": "Mala Bonita Bué Gira e Estilosa",
  "description": "Esta mala é bué linda, nunca mais vais precisar de outra mala",
  "price": 49.99,
  "stock": 20,
  "category": "", // Id de uma categoria existente
  "images": ["caminho/para/a/imagem1", "caminho/para/a/imagem2"]
}
```

Obter um produto pelo seu ID

```html
GET /api/products/:id
```

Atualizar um produto pelo seu ID

```html
PUT /api/products/:id
```

```json
{
  "name": "Mala Lindona e Fofinha",
  "description": "Mala bué fofa e estilosa e fixe e bacana"
}
```

Apagar um produto pelo seu ID

```html
DELETE /api/products/:id
```

### Avaliações

Listar todas as avaliações

```html
GET /api/reviews
```

Criar uma nova avaliação

```html
POST /api/reviews
```

```json
{
  "productId": "", // Id de um produto existente
  "rating": 4,
  "comment": "Adorei o produto muito bom!!!!!",
}
```

Obter uma acaliação pelo seu ID

```html
GET /api/reviews/:id
```

Atualizar uma avaliação pelo seu ID

```html
PUT /api/reviews/:id
```

```json
{
  "rating": 3,
}
```

Apagar uma avaliação pelo seu ID

```html
DELETE /api/reviews/:id
```

Listar todas as avaliação de um produto pelo seu ID

```html
GET /api/reviews/product/:id
```

Listar todas as avaliação de um utilizador pelo seu ID

```html
GET /api/reviews/user/:id
```

Listar todas as avaliação que um utilizador escreveu num produto

```html
GET /api/reviews/user/:userId/product/:productId
```

Listar a soma da quantidade de estrelas de cada avaliação num produto

```html
GET /api/reviews/product/:id/stats
```

### Categorias

Listar todas as categorias

```html
GET /api/categories
```

```json
{
  "page": "1",
  "limit": "20",
  "sort": "mais_recente",
  "search": "Roupa",
}
```

Criar uma nova categoria

```html
POST /api/categories
```

```json
{
  "name": "Roupa Desportiva",
  "description": "A melhor roupa desportiva do universo",
}
```

Obter uma categoria pelo seu ID

```html
GET /api/categories/:id
```

Atualizar uma categoria pelo seu ID

```html
PUT /api/categories/:id
```

```json
{
  "description": "Roupa para praticar desporto"
}
```

Apagar uma categoria pelo seu ID

```html
DELETE /api/categories/:id
```

### Utilizadores

Listar todos os utilizadores

```html
GET /api/users
```

```json
{
  "page": "1",
  "limit": "20",
  "sort": "nome_za", // Ordenar pelo nome de Z a A
  "search": "",
}
```

Obter um utilizador pelo seu ID

```html
GET /api/users/:id
```

Atualizar um utilizador pelo seu ID

```html
PUT /api/users/:id
```

```json
{
  "name": "Estagiário Novo",
  "role": "Admin"
}
```

Apagar um utilizador pelo seu ID

```html
DELETE /api/users/:id
```

Remover a imagem de um utilizador pelo seu ID

```html
PUT /api/users/:id/image
```

## Estrutura da Pasta do Projeto

```bash
dsa-backend/
├── docker-compose.yml
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── cartController.js
│   │   │   ├── categoryController.js
│   │   │   ├── checkoutController.js
│   │   │   ├── productController.js
│   │   │   ├── reviewController.js
│   │   │   ├── userController.js
│   │   │   └── wishlistController.js
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js
│   │   ├── models/
│   │   │   ├── Cart.js
│   │   │   ├── Category.js
│   │   │   ├── Order.js
│   │   │   ├── Product.js
│   │   │   ├── Review.js
│   │   │   ├── User.js
│   │   │   └── Wishlist.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── checkoutRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── reviewRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   └── authRoutes.js
│   │   ├── utils/
│   │   │   └── updateProductRating.js
│   │   └── app.js
│   ├── .env
│   ├── Dockerfile
│   └── package.json
├── .gitattributes
├── docker-compose.yml
├── mongo-init.js
└── README.md
```

## Documentação

[Express JS](https://expressjs.com/)

[Json Web Tokens](https://www.npmjs.com/package/jsonwebtoken)

[MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database)

[Docker](https://docs.docker.com/)


## Autores

- [@He1senb0rg](https://github.com/He1senb0rg)
- [@william-217](https://github.com/william-217)
- [@fgiwp](https://github.com/fgiwp)