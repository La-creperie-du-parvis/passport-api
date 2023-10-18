
# La Crêperie du Parvis

## Prérequis

Avant de commencer, assurez-vous d'avoir installé Node.js et npm sur votre machine.

## Installation

1. **Installez Prisma CLI** : Exécutez la commande suivante dans votre terminal pour installer Prisma CLI dans votre projet :

    ```bash
    npm install prisma --save-dev
    npm install @prisma/cli --save-dev
    ```

2. **Initialisez Prisma** : Initialisez Prisma dans votre projet en utilisant la commande suivante :

    ```bash
    npx prisma
    npx prisma init
    ```

    Cette commande crée un nouveau fichier `prisma/.env` et un fichier `prisma/schema.prisma` dans votre projet.

3. **Configurez la source de données** : Ouvrez le fichier `prisma/.env` et ajoutez votre URL de base de données. Par exemple, pour une base de données PostgreSQL, cela pourrait ressembler à :

    ```bash
    DATABASE_URL="mysql://user:password@localhost:3306/db_test"
    ```

    Assurez-vous de remplacer `user`, `password`, `localhost`, `3306` et `db_test` par vos propres informations de connexion à la base de données.

4. **Exécutez l'introspection de Prisma** : Exécutez l'introspection de Prisma pour générer le schéma Prisma à partir de votre base de données existante. Exécutez la commande suivante dans votre terminal :

    ```bash
    npx prisma db pull
    ```

    Cette commande met à jour le fichier `prisma/schema.prisma` en fonction de la structure actuelle de votre base de données.

5. **Générez le client Prisma** : Générez le client Prisma en utilisant la commande suivante :

    ```bash
    npx prisma generate
    ```

    Cette commande génère le client Prisma dans `node_modules/@prisma/client`. Vous pouvez maintenant utiliser ce client pour interagir avec votre base de données.

## Utilisation

Une fois que vous avez généré le client Prisma, vous pouvez l'utiliser pour interagir avec votre base de données. Consultez la [documentation de Prisma](https://www.prisma.io/docs/) pour plus d'informations sur l'utilisation de Prisma.

