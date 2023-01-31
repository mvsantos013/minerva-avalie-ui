# avalie-ui

avalie-ui is a frontend application written in Vue2, it has a backend (avalie-bff) that exposes endpoints for the UI. The backend is responsible for communicating with downstream microservices and bringing it back to the frontend. The Backend For Frontend (BFF) application architecture is applied here.

## Local Development

```bash
# Start frontend development server
npm install
npm start
```

Finally, <b>copy <i>.env.example</i> to <i>.env</i></b>

## Development experience

Install the following vscode extensions:

- Vue
- Vetur
- Vue VSCode Snippets
- Eslint
- Stylelint
- Prettier
- Tailwind CSS Intellisense

Take a look in these topics before surfing in the code:

- Vue 2 - Frontend Framework
- Vuex - State Management for Vue 2
- vuex-pathify - Lib for writing less Vuex code
- TailwindCSS - CSS Framework (contains bult-in css classes)
- CSS Pre-processors (Postcss, SASS). Cleaner and more efficient way to write CSS.
- Quasar v1 - UI Components Library
  
## Tips
- Install the Visual Studio Code extensions.
- Don't disable auto-format on save. This is necessary to keep code organization.
- Try to follow the current project structure and patterns.
- Always use Tailwind classes in your code, avoid using plain text CSS. Exceptions may occur.
- If your component file becoming large you should split it in multiple components.