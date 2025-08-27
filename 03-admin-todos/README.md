# Development
Pasos para levantar la app en desarrollo

1. levantar la base de datos
 ```
 docker compose up -d
 ```
2. Crear copia de .env.template y renombrar a .env
3. Reemplazar las variables de entorno
4. Ejecutar el comando  ```npm install ``` 
5. Ejecutar el comando  ```npm run dev ``` 
5. Ejecutar los comandos de prisma  
``` npx prisma migrate dev```
``` npx prisma generate ```

7. Ejecutar el SEED para [crear la base de datos local](localhost:3000/api/seed)


## Nota: Usuario por defecto
__usuario:__ test1@google.com   
__password__ 123456


# Prisma commands

```
npx prisma init
npx prisma migrate dev
npx prisma generate

```


# Prod


# Stage