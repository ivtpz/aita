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

const descending = (a, b) => b.count - a.count;

const createHierarchy = (data) => {
  const tree = {
    name: 'Subjects',
    id: 'subjects',
    children: []
  };
  data.forEach(({ name, id, count }) => {
    const general = id.split('.')[0];
    const current = tree.children.find(c => c.id === general);
    if (current) {
      current.hiddenChildren.push({ name, count });
    } else {
      tree.children.push({
        id: general,
        name: translate[general],
        hiddenChildren: [{ name, count, id }]
      });
    }
    tree.children.forEach((cat) => {
      cat.count = cat.hiddenChildren.reduce((sum, c) => sum + c.count, 0);
      cat.hiddenChildren.sort(descending);
    });
    tree.children.sort(descending);
  });
  return tree;
};

export default createHierarchy;
