const fs = require('fs');
let content = fs.readFileSync('src/components/home/LogoGlobe.tsx', 'utf8');
content = content.replace("import { useTexture } from '@react-three/drei';", "import { useTexture } from '@react-three/drei';\nimport faviconUrl from '/favicon.png?url';");
content = content.replace("const colorMap = useTexture('/favicon.png');", "const colorMap = useTexture(faviconUrl);");
fs.writeFileSync('src/components/home/LogoGlobe.tsx', content);
