# Burger Queen - API con Node.js

## Índice

* [1. Preámbulo](#1-pre%C3%A1mbulo)
* [2. Resumen del proyecto](#2-resumen-del-proyecto)
* [3. Objetivos de aprendizaje](#3-objetivos-de-aprendizaje)
* [4. Consideraciones generales](#4-consideraciones-generales)
* [5. Criterios de aceptación mínimos del proyecto](#5-criterios-de-aceptaci%C3%B3n-m%C3%ADnimos-del-proyecto)
* [6. Pistas, tips y lecturas complementarias](#6-pistas-tips-y-lecturas-complementarias)
* [7 HTTP API Checklist](#7-http-api-checklist)

## 1. Preámbulo

![Node.js logo](https://nodejs.org/static/images/logos/nodejs-new-pantone-black.svg)

Un pequeño restaurante de hamburguesas, que está creciendo, necesita un
sistema a través del cual puedan tomar pedidos usando una _tablet_, y enviarlos
a la cocina para que se preparen ordenada y eficientemente.

Este proyecto tiene dos áreas: interfaz web (cliente) y API (servidor). Nuestra
clienta nos ha solicitado desarrollar la API que se debe integra con la
interfaz, que otro equipo de desarrolladoras está trabajando simultáneamente. 

## 5. Criterios de aceptación mínimos del proyecto

### 5.1 API

Según lo establecido por la [documentación](https://laboratoria.github.io/burger-queen-api/)
entregada por nuestra clienta, la API debe exponer los siguientes endpoints:
 
### 5.2 CLI

La clienta nos ha solicitado que la aplicación cuente un comando **`npm start`**
que se debe encargar de ejecutar nuestra aplicación node y que además pueda
recibir información de configuración, como el puerto en el que escuchar, a qué
base datos conectarse, etc. Estos datos de configuración serán distintos entre
diferentes entornos (desarrollo, producción, ...). El _boilerplate_ ya implementa
[el código necesario](config.js) para leer esta información de los
[argumentos de invocación](https://nodejs.org/docs/latest/api/process.html#process_process_argv)
y el
[entorno](https://nodejs.org/docs/latest/api/process.html#process_process_env).

#### 5.2.1 Argumentos de línea de comando

Podemos especificar el puerto en el que debe arrancar la aplicación pasando un
argumento a la hora de invocar nuestro programa:

```sh
# Arranca la aplicación el puerto 8888 usando npm
npm start 8888
```
  

### 5.1 `/` - EJEMPLOS DE PETICIONES Y RESPUESTA


#### 5.1.2 `/auth`


* `POST /auth`

```sh
Body 

{ 
    "email": "admin@localhost.com",
    "password": "QWERTY12345678"
}   

Body Response

{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MGQ5ZTQzZjIxMzY2ODYzZWNkOWMwNzQiLCJlbWFpbCI6ImFkbWluQGxvY2FsaG9zdC5jb20iLCJyb2xlcyI6eyJhZG1pbiI6dHJ1ZX0sImlhdCI6MTYyNDk0MjYyNiwiZXhwIjoxNjI0OTQ2MjI2fQ.YQpo4cZylNMlsAhJLfMHPIxG2-YpxT3CabRVZm5e0mA"
}
``` 
#### 5.1.3 `/users`


* `GET /users`

```sh
https://nodejs-bq-api.herokuapp.com/users?limit=2&page=1
https://nodejs-bq-api.herokuapp.com/users (Default: limit = 10 and page = 1)
(Requiere solo Authenthicación (token))


Body Response

[
    {
        "roles": {
            "admin": true
        },
        "_id": "60d9e43f21366863ecd9c074",
        "email": "admin@localhost.com",
        "password": "$2b$10$ypVUwIBq41YGOrQmiK/TOevnPdxEXCVwYq.Z6WnAuJG3m4yFs4AAW"
    },
    {
        "roles": {
            "admin": true
        },
        "_id": "60daa899fc51e50015689ed3",
        "email": "milumon@outlook.com",
        "password": "$2b$10$9JyJ1KOaFdaAVhwL51Kc8Oy0u2Jc.a1SREtV6mQ76yy11YRk8AxY."
    }
]

```

* `GET /users/:uid`

```sh
https://nodejs-bq-api.herokuapp.com/users/60d9e43f21366863ecd9c074 
(Requiere solo Authenthicación (token))


Body Response

{
    "_id": "60d9e43f21366863ecd9c074",
    "email": "admin@localhost.com",
    "password": "$2b$10$ypVUwIBq41YGOrQmiK/TOevnPdxEXCVwYq.Z6WnAuJG3m4yFs4AAW",
    "roles": {
        "admin": true
    }
}
```


* `POST /users`

```sh

https://nodejs-bq-api.herokuapp.com/users
(Requiere Authenthicación (token) con permisos de administrador)

Body

{
    "email": "milumon@outlook.com",
    "password": "santaclaus",
    "roles" :  {
        "admin": false
     } 
}

Body Response 

{
    "_id": "60d9e43f21366863ecd9c074",
    "email": "admin@localhost.com",
    "password": "$2b$10$ypVUwIBq41YGOrQmiK/TOevnPdxEXCVwYq.Z6WnAuJG3m4yFs4AAW",
    "roles": {
        "admin": true
    }
}
```

* `PUT /users/:uid`

```sh

https://nodejs-bq-api.herokuapp.com/users/60d9e43f21366863ecd9c074
(Requiere Authenthicación (token) con permisos de administrador)

Body

{
    "email": "milumon@outlook.com",
    "password": "papanoel",
    "roles" :  {
        "admin": false
     } 
}

Body Response 

{
    "roles": {
        "admin": false
    },
    "_id": "60daa899fc51e50015689ed3",
    "email": "milumon@outlook.com",
    "password": "$2b$10$MBMf1uVzYFrbcn47uL3QfOwqYo2tnRY/Ms8btpbGK5FpHUnLjh1Zm"
}
```

* `DELETE /users/:uid`

```sh
https://nodejs-bq-api.herokuapp.com/users/60daa899fc51e50015689ed3
(Requiere Authenthicación (token) con permisos de administrador)


Body Response

{
    "roles": {
        "admin": false
    },
    "_id": "60daa899fc51e50015689ed3",
    "email": "milumon@outlook.com",
    "password": "$2b$10$MBMf1uVzYFrbcn47uL3QfOwqYo2tnRY/Ms8btpbGK5FpHUnLjh1Zm"
} 
```

#### 5.1.4 `/products`

* `GET /products`

```sh
https://nodejs-bq-api.herokuapp.com/products?limit=2&page=1
https://nodejs-bq-api.herokuapp.com/products (Default: limit = 10 and page = 1)
(Requiere solo Authenthicación (token))


Body Response

[
    {
        "_id": "60d9fe6a89a1160015125baa",
        "name": "arroz con pollo",
        "price": 10,
        "type": "criollo",
        "image": "https://i.ytimg.com/vi/hXBU-wYE_l0/maxresdefault.jpg",
        "dateEntry": "2021-06-28T16:52:58.800Z"
    },
    {
        "_id": "60da073589a1160015125bae",
        "name": "agua",
        "price": 5,
        "type": "drink",
        "image": "https://i.ytimg.com/vi/hXBU-wYE_l0/maxresdefault.jpg",
        "dateEntry": "2021-06-28T17:30:29.307Z"
    }
]

```

* `GET /products/:productid`

```sh
https://nodejs-bq-api.herokuapp.com/products/60d9fe6a89a1160015125baa
(Requiere solo Authenthicación (token))


Body Response

{
    "_id": "60d9fe6a89a1160015125baa",
    "name": "arroz con pollo",
    "price": 10,
    "type": "criollo",
    "image": "https://i.ytimg.com/vi/hXBU-wYE_l0/maxresdefault.jpg",
    "dateEntry": "2021-06-28T16:52:58.800Z"
}
``` 

* `POST /products`

```sh
https://nodejs-bq-api.herokuapp.com/products
(Requiere Authenthicación (token) con permisos de administrador)


Body 

{ 
    "name": "arroz con pollo",
    "price": 10,
    "type": "criollo",
    "image": "https://i.ytimg.com/vi/hXBU-wYE_l0/maxresdefault.jpg"
}

Body Response

{
    "_id": "60daac5dfc51e50015689ed4",
    "name": "arroz con pollo",
    "price": 10,
    "type": "criollo",
    "image": "https://i.ytimg.com/vi/hXBU-wYE_l0/maxresdefault.jpg",
    "dateEntry": "2021-06-29T05:15:09.200Z"
}

``` 
 

* `PUT /products/:productid`


```sh
https://nodejs-bq-api.herokuapp.com/products/60d9fe6a89a1160015125baa
(Requiere Authenthicación (token) con permisos de administrador)


Body 

{ 
    "name": "arroz con pollito",
    "price": 8,
    "type": "criollo",
    "image": "https://i.ytimg.com/vi/hXBU-wYE_l0/maxresdefault.jpg"
}

Body Response

{
    "_id": "60d9fe6a89a1160015125baa",
    "name": "arroz con pollito",
    "price": 8,
    "type": "criollo",
    "image": "https://i.ytimg.com/vi/hXBU-wYE_l0/maxresdefault.jpg",
    "dateEntry": "2021-06-28T16:52:58.800Z"
}
``` 



* `DELETE /products/:productid`

```sh
https://nodejs-bq-api.herokuapp.com/products/60d9fe6a89a1160015125baa
(Requiere Authenthicación (token) con permisos de administrador) 

Body Response

{
    "_id": "60d9fe6a89a1160015125baa",
    "name": "arroz con pollito",
    "price": 8,
    "type": "criollo",
    "image": "https://i.ytimg.com/vi/hXBU-wYE_l0/maxresdefault.jpg",
    "dateEntry": "2021-06-28T16:52:58.800Z"
}
``` 

#### 5.1.5 `/orders`

* `GET /orders`

```sh
https://nodejs-bq-api.herokuapp.com/orders?limit=2&page=1
https://nodejs-bq-api.herokuapp.com/orders
(Solo Requiere Authenthicación (token))
 

Body Response

[
    {
        "status": "pending",
        "_id": "60daadaefc51e50015689eda",
        "userId": "60d9e43f21366863ecd9c074",
        "client": "Sonia",
        "products": [
            {
                "_id": "60daadaefc51e50015689edb",
                "qty": 1,
                "product": {
                    "_id": "60daada4fc51e50015689ed7",
                    "name": "arroz con pollito",
                    "price": 8,
                    "type": "criollo",
                    "image": "https://i.ytimg.com/vi/hXBU-wYE_l0/maxresdefault.jpg",
                    "dateEntry": "2021-06-29T05:20:36.300Z"
                }
            }
        ],
        "dateEntry": "2021-06-29T05:20:46.361Z",
        "dateProcessed": "2021-06-29T05:20:46.361Z"
    },
    {
        "status": "pending",
        "_id": "60dab08ffc51e50015689ee5",
        "userId": "60d9e43f21366863ecd9c074",
        "client": "Sonia",
        "products": [
            {
                "_id": "60dab08ffc51e50015689ee6",
                "qty": 1,
                "product": {
                    "_id": "60daada4fc51e50015689ed7",
                    "name": "arroz con pollito",
                    "price": 8,
                    "type": "criollo",
                    "image": "https://i.ytimg.com/vi/hXBU-wYE_l0/maxresdefault.jpg",
                    "dateEntry": "2021-06-29T05:20:36.300Z"
                }
            }
        ],
        "dateEntry": "2021-06-29T05:33:03.720Z",
        "dateProcessed": "2021-06-29T05:33:03.720Z"
    }
]

``` 

* `GET /orders/:orderId`

```sh
https://nodejs-bq-api.herokuapp.com/orders/60daadaefc51e50015689eda
(Solo Requiere Authenthicación (token))

 

Body Response

{
    "status": "pending",
    "_id": "60daadaefc51e50015689eda",
    "userId": "60d9e43f21366863ecd9c074",
    "client": "Sonia",
    "products": [
        {
            "_id": "60daadaefc51e50015689edb",
            "qty": 1,
            "product": {
                "_id": "60daada4fc51e50015689ed7",
                "name": "arroz con pollito",
                "price": 8,
                "type": "criollo",
                "image": "https://i.ytimg.com/vi/hXBU-wYE_l0/maxresdefault.jpg",
                "dateEntry": "2021-06-29T05:20:36.300Z"
            }
        }
    ],
    "dateEntry": "2021-06-29T05:20:46.361Z",
    "dateProcessed": "2021-06-29T05:20:46.361Z"
}

``` 

* `POST /orders`

```sh
https://nodejs-bq-api.herokuapp.com/orders
(Requiere Authenthicación (token) con permisos de administrador)


Body 

{
    "status": "pending",
    "userId": "60d9e43f21366863ecd9c074",
    "client": "Sonia",
    "products": [
        {
            "productId": "60da073589a1160015125bae",
            "qty": 1
        }
    ]
}

Body Response

{
    "status": "pending",
    "_id": "60daaee1fc51e50015689ee2",
    "userId": "60d9e43f21366863ecd9c074",
    "client": "Sonia",
    "products": [
        {
            "_id": "60daaee1fc51e50015689ee3",
            "qty": 1,
            "product": {
                "_id": "60da073589a1160015125bae",
                "name": "agua",
                "price": 5,
                "type": "drink",
                "image": "https://i.ytimg.com/vi/hXBU-wYE_l0/maxresdefault.jpg",
                "dateEntry": "2021-06-28T17:30:29.307Z"
            }
        }
    ],
    "dateEntry": "2021-06-29T05:25:53.803Z",
    "dateProcessed": "2021-06-29T05:25:53.803Z"
}

``` 

* `PUT /orders/:orderId`

```sh
https://nodejs-bq-api.herokuapp.com/orders
(Requiere Authenthicación (token) con permisos de administrador)


Body 

{
    "status": "delivered",
    "userId": "60d9e43f21366863ecd9c074",
    "client": "Sonia",
    "products": [
        {
            "productId": "60da073589a1160015125bae",
            "qty": 1
        }
    ],
    "dateEntry": "2021-06-29T05:25:53.803Z",
    "dateProcessed": "2021-06-29T05:25:53.803Z"
}

Body Response

{
    "status": "delivered",
    "_id": "60daaee1fc51e50015689ee2",
    "userId": "60d9e43f21366863ecd9c074",
    "client": "Sonia",
    "products": [
        {
            "_id": "60daaf66fc51e50015689ee4",
            "qty": 1
        }
    ],
    "dateEntry": "2021-06-29T05:25:53.803Z",
    "dateProcessed": "2021-06-29T05:25:53.803Z"
}

``` 

* `DELETE /orders/:orderId`

```sh
https://nodejs-bq-api.herokuapp.com/orders/60daaee1fc51e50015689ee2
(Requiere Authenthicación (token) con permisos de administrador)

 
Body Response

{
    "status": "delivered",
    "_id": "60daaee1fc51e50015689ee2",
    "userId": "60d9e43f21366863ecd9c074",
    "client": "Sonia",
    "products": [
        {
            "_id": "60daaf66fc51e50015689ee4",
            "qty": 1
        }
    ],
    "dateEntry": "2021-06-29T05:25:53.803Z",
    "dateProcessed": "2021-06-29T05:25:53.803Z"
}

``` 
   

### Node

* [x] Instalar y usar módulos. ([npm](https://www.npmjs.com/))
* [x] [Configuración de package.json.](https://docs.npmjs.com/files/package.json)
* [x] [Configuración de npm-scripts](https://docs.npmjs.com/misc/scripts)

### Testing

* [x] [Testeo unitario.](https://jestjs.io/docs/es-ES/getting-started)
* [x] [Testeo asíncrono.](https://jestjs.io/docs/es-ES/asynchronous)
* [x] Tests de integración.

### Estructura del código y guía de estilo

* [x] Organizar y dividir el código en módulos (Modularización)
* [x] Uso de identificadores descriptivos (Nomenclatura | Semántica)
* [x] Uso de linter (ESLINT)

### Git y GitHub

* [x] Uso de comandos de git (add | commit | pull | status | push)
* [x] Manejo de repositorios de GitHub (clone | fork | gh-pages)
* [x] Colaboración en Github (branches | pull requests | |tags)
* [x] Organización en Github (projects | issues | labels | milestones)

### Express

* [x] Rutas.
* [x ] `middlewares`

### HTTP

* [x] [Request, Response.](https://developer.mozilla.org/es/docs/Web/HTTP/Messages)
* [x] Headers.
* [x] Body.
* [x] [Verbos HTTP.](https://developer.mozilla.org/es/docs/Web/HTTP/Methods)
* [x] [Codigos de status de HTTP.](https://dev.to/khaosdoctor/the-complete-guide-to-status-codes-for-meaningful-rest-apis-1-5c5)
* [x] Encodings y `JSON`.
* [x] [CORS.](https://developer.mozilla.org/es/docs/Web/HTTP/Access_control_CORS)

### Autenticación

* [x] `JWT`
* [x] Almacenamiento y acceso de contraseñas.

### WebOps

* [x] Variables de entorno.
* [ ] Contenedores (Docker).
* [ ] Docker compose.

### Base de datos (MongoDB)

* [x] Instalación.
* [x] Conexión a través de cliente.
* [x] Connection string.
* [x] Queries y comandos (creación, lectura, actualización, eliminación)