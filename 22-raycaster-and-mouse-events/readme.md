# Three.js Journey

## Setup

Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

```bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

Un Raycaster, en Three.js, lance un rayon invisible depuis un point dans une direction donnée, puis détecte les objets 3D qu'il traverse.

On s'en sert surtout pour savoir sur quel objet la souris clique ou passe (picking), et aussi pour les collisions simples ou les tirs dans un jeu.
