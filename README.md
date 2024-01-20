# BonAppetit

## Structure

    BonAppetit
      ├── back
      │   ├── public
      │   ├── app
      │   │   ├── config
      │   │   ├── controllers
      │   │   ├── helpers
      │   │   ├── middleware
      │   │   ├── models
      │   │   ├── routes
      │   │   └── utils
      │   │
      |   ├── ressources
      │   │   ├── static
      |   |       ├──assets
      |   |          ├──uploads
      │   │
      │   ├── server.js
      │   ├── socket.manager.js
      │   ├── swagger.js
      │   └── package.json
      |   
      │
      ├── front
      │   ├── public
      │   ├── src
      │   │   ├── assets
      │   │   ├── components
      │   │   ├── config
      │   │   ├── contexts
      │   │   ├── database
      │   │   ├── fonts
      │   │   ├── layout
      │   │   ├── pages
      │   │   ├── routes
      │   │   ├── services
      │   │   ├── types
      │   │   ├── App.tsx
      │   │   ├── http-common.ts
      │   │   ├── index.css
      │   │   ├── main.tsx
      │   │   └── vite-env.d.ts
      |   |
      │   ├── tailwind.config.js
      │   ├── vite.config.ts
      │   └── package.json
      │
      └── README.md

## Setup and Running

- Prerequisites
  - Node
  - MySQL (or Postgres / Sqlite / MSSQL)

- Clone repo `git clone https://github.com/Zora029/BonAppetit.git`

- Switch to `BonAppetit` directory `cd BonAppetit`

- Configurations
  - Create a new db and modify `/back/app/config/db.config.js`
  - Change back PORT on `/back/server.js` (optional)
  - Change front PORT on `/front/vite.config.ts` (optional)
  - Modify `/front/src/http-common.ts` for API URL (optional if you haven't changed back PORT)

- Setup
  - API: Install packages `cd back` and `npm install` and `npm run swagger`
  - Webapp: Install packages `cd front` and `npm install`

- Development
  - Run API `cd back` and `npm start`, browse at <http://localhost:8080/api-docs> for API documentation
  - Run Webapp `cd front` and `npm run dev`, browse webapp at <http://localhost:8081/>
