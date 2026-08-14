for f in script_block_*.js; do
  echo "Checking $f"
  node -c $f
done
