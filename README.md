# MyShopTools

## Configuração do CORS para Firebase Storage

Para configurar o CORS no Firebase Storage, siga estes passos:

1. Instale o Firebase CLI globalmente:
   ```
   npm install -g firebase-tools
   ```

2. Faça login no Firebase:
   ```
   firebase login
   ```

3. Configure o projeto:
   ```
   firebase init
   ```
   Selecione apenas a opção "Storage" quando solicitado.

4. Crie um arquivo chamado `cors.json` na raiz do projeto com o seguinte conteúdo:
   ```json
   [
     {
       "origin": ["*"],
       "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
       "maxAgeSeconds": 3600
     }
   ]
   ```

5. Aplique as regras CORS:
   ```
   firebase storage:cors set cors.json
   ```

Isso permitirá que o Firebase Storage aceite solicitações do seu domínio.
