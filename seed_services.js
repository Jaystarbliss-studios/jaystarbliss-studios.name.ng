import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_lq2Z4qBrZZkzYmEMPPMtCKQmfSx2rkY",
  authDomain: "jaystarbliss-studios.firebaseapp.com",
  projectId: "jaystarbliss-studios",
  storageBucket: "jaystarbliss-studios.firebasestorage.app",
  messagingSenderId: "885364100276",
  appId: "1:885364100276:web:1159c4cbd9159aaa0e1be1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-jaystarblissdyna-085e16ac-52ee-43ae-9c0c-52f6db7f8f7c");

async function seed() {
  console.log("Cleaning old services...");
  const oldServices = await getDocs(collection(db, 'services'));
  for (const docSnapshot of oldServices.docs) {
    await deleteDoc(docSnapshot.ref);
  }

  const services = [
    {
      title: "Web Development",
      slug: "web-development",
      iconName: "Monitor",
      shortDescription: "Professional websites and web experiences designed around your actual goals — not just another template.",
      content: "A website should do more than look good. It should explain what you offer, make it easy for people to trust you and guide visitors toward taking action.\n\n### Business Websites\nProfessional websites for companies, organizations and individuals.\n\n### School Websites\nModern school websites for communicating programs, activities and information to parents and students.\n\n### Landing Pages\nFocused pages designed around a specific product, service or campaign.\n\n### E-Commerce\nOnline stores and product experiences for businesses ready to sell online.",
      status: "PUBLISHED",
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      title: "Graphic Design",
      slug: "graphic-design",
      iconName: "Paintbrush",
      shortDescription: "Professional graphics for businesses, schools, events, campaigns and digital platforms.",
      content: "Good design isn't just decoration. It helps people understand who you are, what you're offering and why they should pay attention.\n\nOur Graphic Design services include:\n- Flyers & Posters\n- Social Media Graphics\n- Business Cards & Stationery\n- Presentations & Pitch Decks\n- Brochures & Magazines\n- Digital Marketing Materials",
      status: "PUBLISHED",
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      title: "Branding",
      slug: "branding",
      iconName: "Briefcase",
      shortDescription: "Visual identities that help people recognize your business and understand what you stand for.",
      content: "Your brand is more than a logo. It is the collection of visual details and experiences people associate with your business.\n\nOur Branding services cover:\n- Logo Design & Iconography\n- Complete Brand Identity Systems\n- Color Palettes & Typography\n- Brand Guidelines & Documentation\n- Social Media Brand Assets",
      status: "PUBLISHED",
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      title: "Digital Infrastructure",
      slug: "digital-infrastructure",
      iconName: "Globe",
      shortDescription: "Help with domains, DNS, hosting, deployment, SSL, and the technical details that keep a website online.",
      content: "A beautiful website still needs the right technical foundation. We can help with the infrastructure that connects your domain, hosting, DNS, security and deployment.\n\nWe provide technical help with:\n- Domain Setup & Configuration\n- DNS & Cloudflare Management\n- Hosting Setup & Migration\n- SSL Certificate Installation\n- Website Performance Optimization\n- General Technical Troubleshooting",
      status: "PUBLISHED",
      isFeatured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      title: "AI & Digital Solutions",
      slug: "ai-digital-solutions",
      iconName: "Cpu",
      shortDescription: "Practical ways to use AI and digital tools to improve learning, productivity and business workflows.",
      content: "Stay ahead of the curve by integrating modern Artificial Intelligence and automation tools into your daily workflows. We consult, design, and build custom digital solutions that solve real problems.\n\nOur solutions include:\n- Workflow Automation\n- AI Integration Consulting\n- Custom API Connections\n- Productivity System Design",
      status: "PUBLISHED",
      isFeatured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  for (const s of services) {
    await addDoc(collection(db, 'services'), s);
  }
  
  console.log("Seeded services!");
  process.exit(0);
}
seed();
