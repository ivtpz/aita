import { get, post } from 'axios';
import X2JS from 'x2js';
import { SubjectCountYears } from '../db/config';
import cats from '../client/src/helpers/arxivCategories';

const url = 'http://export.arxiv.org/oai2';

const x2js = new X2JS();

const generals = Object.keys(cats);
let generalIndex = 0;

let currSubjects = Object.keys(cats[generals[generalIndex]]);
let subjIndex = 0;

console.log(cats, generals, currSubjects);

let name;
let id;
let year = 1995;

const perReq = 1000;
let start = 0;

let count = 0;
let resultsIndex = 0;
let currResults;
let numResults;

// Actually talks to the database;
const processNextPage = () => {
  console.log('**********8',currResults[resultsIndex].published.slice(0, 4))
  while (
    parseInt(currResults[resultsIndex].published.slice(0, 4), 10) <= year
    &&
    resultsIndex < currResults.length - 1
  ) {
    count++;
    resultsIndex++;
  }
  console.log('exited while loop with count ', count, 'index ', resultsIndex);
  if (resultsIndex < currResults.length - 1) {
    new SubjectCountYears({ name, id, year, count }).save()
    .then((record) => {
      console.log('saved ', record);
      year++;
      console.log('processing year ', year, 'on index ', resultsIndex);
      console.log('total in array ', currResults.length);
      setTimeout(() => processNextPage(), 1000);
    });
  } else {
    console.log('getting page starting with ', start + perReq);
    start += perReq;
    process();
  }
};

// Make a request with the current variables
// and decide whether to process it or go to the next thing
const process = async () => {
  console.log('processing...')
  resultsIndex = 0;
  const res = await request();
  currResults = res[0];
  numResults = res[1];
  console.log('GOT ', numResults, 'results');
  if (currResults && numResults > 1 && currResults.title !== 'Error') {
    setTimeout(() => processNextPage(), 3000);
  } else if (subjIndex < currSubjects.length - 1) {
    setTimeout(() => processNextSubject(), 100);
  } else if (generalIndex < generals.length - 1) {
    setTimeout(() => processNextGeneral(), 100);
  }
};

const resetSubjData = () => {
  start = 0;
  count = 0;
  year = 1995;
};

const processNextSubject = () => {
  subjIndex++;
  console.log('processing ', currSubjects[subjIndex]);
  resetSubjData();
  return process();
};

const processNextGeneral = () => {
  generalIndex++;
  if (generalIndex < generals.length) {
    console.log('processing ', generals[generalIndex]);
    subjIndex = 0;
    currSubjects = Object.keys(cats[generals[generalIndex]]);
    resetSubjData();
    return process();
  }
  return;
};

const request = async () => {
  const g = generals[generalIndex];
  const s = currSubjects[subjIndex];
  id = [g, s].join('.');
  const cat = g === 'noPrefix' ? s : id;
  name = cats[g][s];
  console.log('requesting ', cat);
  console.log()
  const { data } = await get(url, {
    params: {
      search_query: `cat:${cat}`,
      sortBy: 'submittedDate',
      sortOrder: 'ascending',
      start,
      max_results: perReq
    }
  });
  const { feed: { entry, totalResults } } = await x2js.xml2js(data);
  return [entry, parseInt(totalResults.toString(), 10)];
};


export default process;
