cat src/pages/Home.tsx | grep -v 'export default Home;' > src/pages/Home.tsx.new
sed -i 's/import MainLayout from '"'"'..\/components\/layout\/MainLayout'"'"';/import MainLayout from '"'"'..\/components\/layout\/MainLayout'"'"';\nimport SEO from '"'"'..\/components\/ui\/SEO'"'"';/' src/pages/Home.tsx.new
sed -i 's/<MainLayout>/<MainLayout>\n      <SEO title="Home" description="Empowering minds through dynamic tech and creative education." \/>/' src/pages/Home.tsx.new
echo "export default Home;" >> src/pages/Home.tsx.new
mv src/pages/Home.tsx.new src/pages/Home.tsx
