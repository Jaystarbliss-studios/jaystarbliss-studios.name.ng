// Curated, license-free (Pexels License — free for commercial use, no attribution required)
// placeholder photography used to give cards real imagery instead of flat icon tiles.
// NOTE FOR JOHN: these are demo/placeholder images to show the layout working with real
// photography. Swap the URLs below for your own photos of real classes, students' work,
// or licensed stock before this goes live — see the note at the end of the chat for details.
const pexels = (id: number, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const stockImages = {
  learn: pexels(6550408),      // open books + laptop on a desk
  build: pexels(9909092),      // overhead hands typing on a laptop
  create: pexels(3747282),     // creative desk, sketches, art supplies
  partner: pexels(30105085),   // sunlit modern classroom
  students: pexels(6550408),
  parents: pexels(26775361),   // close-up of parent & child holding hands (b&w)
  schools: pexels(30105085),
  businesses: pexels(8519252), // team collaborating, hands together
  tutors: pexels(9909092),
  webDev: pexels(9909092),
  database: pexels(17323801),  // server room, blue light
  design: pexels(3747282),
  consulting: pexels(8519252),
  global: pexels(17323801),
  tech: pexels(17323801),
  care: pexels(26775361),
  music: pexels(7521202),      // hands on piano keys with sheet music
};

const categoryImageMap: Record<string, string> = {
  academics: stockImages.learn,
  digital_and_technology: stockImages.build,
  creative: stockImages.create,
  music: stockImages.music,
  exam_preparation: stockImages.learn,
  personalized_learning: stockImages.care,
  school_programs: stockImages.partner,
};

export const getProgramImage = (categoryId?: string) => {
  const key = (categoryId || '').toLowerCase().replace(/\s+/g, '_');
  return categoryImageMap[key] || stockImages.learn;
};
