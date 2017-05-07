const translate = {
  math: 'Math',
  physics: 'Physics',
  stat: 'Statistics',
  'q-bio': 'Biology',
  cs: 'Computer Science',
  nlin: 'Non Linear',
  'cond-mat': 'Condensed Matter',
  noPrefix: 'Other'
};

// TODO: astrophysics gets subdivided at some point - need to
// divide up the data category

const createHierarchy = (data) => {
  const tree = {
    name: 'All Subjects',
    id: 'root',
    children: []
  };
  data.forEach(({ name, id, count }) => {
    const general = id.split('.')[0];
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
  });
  return tree;
};

export default createHierarchy;
