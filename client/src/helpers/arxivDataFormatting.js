const translate = {
  math: 'Math',
  physics: 'Classical Physics',
  stat: 'Statistics',
  'q-bio': 'Biology',
  cs: 'Computer Science',
  nlin: 'Non Linear',
  'cond-mat': 'Condensed Matter',
  noPrefix: 'Physics',
  'astro-ph': 'Astrophysics'
};

const physicsSubCats = ['physics', 'nlin', 'cond-mat', 'astro-ph'];

const addChild = (tree, general, name, count, id) => {
  const current = tree.children.find(c => c.id === general);
  if (current) {
    current.children.push({ name, count, id });
  } else {
    tree.children.push({
      id: general,
      name: translate[general],
      children: [{ name, count, id }]
    });
  }
};

// TODO: astrophysics gets subdivided at some point - need to
// divide up the data category

const createHierarchy = (data) => {
  const tree = {
    name: 'All Subjects',
    id: 'root',
    children: []
  };
  // TODO: make this recursive to handle astoph better
  // ALSO, this change is completely untested.

  // ALSO, put physics into no prefix, and non-linear, and condensed matter
  data.forEach(({ name, id, count }) => {
    const general = id.split('.')[0];
    if (physicsSubCats.indexOf(general) > -1) {
      const noPrefix = tree.children.find(c => c.id === 'noPrefix');
      if (noPrefix) {
        addChild(noPrefix, general, name, count, id);
      } else {
        tree.children.push({
          id: 'noPrefix',
          name: translate.noPrefix,
          children: [{
            id: general,
            name: translate[general],
            children: [{ name, count, id }]
          }]
        });
      }
    } else {
      addChild(tree, general, name, count, id);
    }
  });
  return tree;
};

export default createHierarchy;
