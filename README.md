# Monitor de aljibe

## Configuracion local

Instala las dependencias y crea el archivo de variables de entorno:

```bash
npm install
cp .env
```

Completa `.env` con la configuracion de la aplicacion web del proyecto Firebase y
arranca el servidor:

```bash
npm run dev
```

Las variables de Vite se leen al iniciar el servidor. Reinicia `npm run dev`
despues de modificar `.env`.

## Acceso administrativo

El registro manual se encuentra en `/admin` y utiliza Firebase Authentication.
Para habilitarlo:

1. Activa el proveedor **Correo/contraseña** en Firebase Authentication.
2. Crea el usuario administrador desde la consola de Firebase.
3. Copia su UID y reemplaza `REEMPLAZAR_UID_ADMIN` en
   `database.rules.json`.
4. Publica las reglas con `firebase deploy --only database`.

Las reglas mantienen lectura pública, permiten al Arduino continuar escribiendo
sin autenticación únicamente en `aljibe/tiempo_real` y `aljibe/historial`, y
reservan `aljibe/manual` para el UID administrador. Las lecturas de ambas ramas
se combinan automáticamente en el nivel actual, el gráfico y el historial.

Si la aplicación se publica con Firebase Hosting, la reescritura incluida en
`firebase.json` permite abrir `/admin` directamente sin recibir un error 404.

## Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
