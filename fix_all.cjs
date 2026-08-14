const fs = require('fs');
let hero = fs.readFileSync('src/components/Hero.tsx', 'utf8');
// Remove unused imports
hero = hero.replace("import { Code, Paintbrush, Database, BookOpen, MonitorPlay, ArrowRight } from 'lucide-react';", "import { ArrowRight } from 'lucide-react';");
hero = hero.replace("import { motion } from 'framer-motion';\n", "");
hero = hero.replace("const navigate = useNavigate();", "");
fs.writeFileSync('src/components/Hero.tsx', hero);

let orbitals = fs.readFileSync('src/components/home/AtomicOrbitals.tsx', 'utf8');
orbitals = orbitals.replace("import { Code, Paintbrush, Cpu, Hash, Type } from 'lucide-react';", "import { Paintbrush, Cpu, Hash, Type } from 'lucide-react';");
orbitals = orbitals.replace("Icon: React.ElementType;", "Icon: React.ElementType<any>;");
fs.writeFileSync('src/components/home/AtomicOrbitals.tsx', orbitals);
