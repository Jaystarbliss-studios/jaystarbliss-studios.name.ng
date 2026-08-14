const fs = require('fs');
let content = fs.readFileSync('src/components/home/LogoGlobe.tsx', 'utf8');

// Replace useTexture('/favicon.png') with a static import or proper Vite handling.
// Actually, let's just make sure it's robust, we can import it:
// import faviconSrc from '/favicon.png?url';

content = content.replace("import { useTexture } from '@react-three/drei';", "import { useTexture } from '@react-three/drei';\nimport faviconUrl from '/favicon.png?url';");
content = content.replace("useTexture('/favicon.png');", "useTexture(faviconUrl);");

fs.writeFileSync('src/components/home/LogoGlobe.tsx', content);
