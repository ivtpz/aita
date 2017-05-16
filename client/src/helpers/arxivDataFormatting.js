import categories from './arxivCategories';

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

const groups = {
  math: 6,
  physics: 3,
  stat: 7,
  'q-bio': 9,
  cs: 8,
  nlin: 5,
  'cond-mat': 4,
  noPrefix: 1,
  'astro-ph': 2
};

// TODO: make sure this thingie works...
const colorGroups = Object.keys(categories).reduce((obj, g) => {
  let i = 0;
  for (const c in categories[g]) {
    obj[`${g}.${c}`] = [groups[g], i];
    i++;
  }
  return obj;
}, {});

console.log(colorGroups);

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

export const createHierarchy = (data) => {
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

const deepClone = (data) => {
  if (typeof data !== 'object') return data;
  let clone;
  if (!Array.isArray(data)) {
    clone = {};
    Object.keys(data).forEach((k) => {
      clone[k] = deepClone(data[k]);
    });
  } else {
    clone = [];
    data.forEach(d => clone.push(deepClone(d)));
  }
  return clone;
};

const getMainSubject = (papers) => {
  console.log('need to get main subject from: ', papers)
  const count = {};
  papers.forEach((p) => {
    const catName = p.category._term.split('.');
    const category = catName.length === 1 ? `noPrefix.${catName[0]}` : catName.join('.');
    count[category] = count[category] ? count[category] + 1 : 1;
  });
  console.log('counts: ', count);
  return Object.keys(count).sort((a, b) => count[b] - count[a])[0];
};

/**
 * Takes in previous authors and papers, and adds
 * connections for new author
 * @param {{nodes: {id: string, group: number}[], links: Object[]}} prevData
 * @param {{id: string, paperData: {id: string, category: object}[]}} newAuthor
 * @return {Object} - same form as prevData
 */
export const formatConnections = (prevData, newAuthor) => {
  let newData = {};
  console.log('prev data ', prevData)
  if (!prevData.nodes || !prevData.links) {
    newData = {
      nodes: [],
      links: []
    };
  } else {
    newData = deepClone(prevData);
    prevData.nodes.forEach((author) => {
      const value = newAuthor.paperData.reduce((connects, paper) =>
        (author.paperData.indexOf(paper.id) > -1 ? connects + 1 : connects)
      , 0);
      if (value) {
        newData.links.push({
          source: newAuthor.id,
          target: author.id,
          value
        });
      }
    });
  }
  newData.nodes.push({
    ...newAuthor,
    paperData: newAuthor.paperData.map(p => p.id),
    group: colorGroups[getMainSubject(newAuthor.paperData)]
  });
  console.log('formatted: ', newData)
  return newData;
};

export default createHierarchy;
