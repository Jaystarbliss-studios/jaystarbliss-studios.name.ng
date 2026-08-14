const fs = require('fs');

let hero = fs.readFileSync('src/components/Hero.tsx', 'utf8');
hero = hero.replace("import { Link, useNavigate } from 'react-router-dom';", "import { Link } from 'react-router-dom';");
fs.writeFileSync('src/components/Hero.tsx', hero);

let orbitals = fs.readFileSync('src/components/home/AtomicOrbitals.tsx', 'utf8');
orbitals = orbitals.replace("Icon: React.ElementType<any>;", "Icon: any;");
fs.writeFileSync('src/components/home/AtomicOrbitals.tsx', orbitals);

