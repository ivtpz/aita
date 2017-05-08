import { get, post } from 'axios';
import X2JS from 'x2js';
import fs from 'fs';
import { SubjectCountYears } from '../db/config';
import cats from '../client/src/helpers/arxivCategories';

const url = 'http://export.arxiv.org/oai2';

const x2js = new X2JS();

let resume = '1720817|846001';

const findCat = (catList) => {
  console.log('searching ', catList);
  let found = false;
  let name, id;
  while (catList.length && !found) {
    const curr = catList.shift();
    const lookups = curr.split('.');
    if (lookups.length === 1) lookups.unshift('noPrefix');
    const general = cats[lookups[0]];
    name = general && general[lookups[1]];
    if (name) {
      found = true;
      id = lookups.join('.');
    }
  }
  return { name, id };
};

const processData = async () => {
  console.log('processing...')
  const records = await request();
  for (const r of records) {
    if (r.metadata) {
      const { metadata: { arXiv: { created, categories } } } = r;
      console.log('processing ', created, categories);
      const year = created.slice(0, 4);
      const cat = categories.split(' ');
      const { name, id } = findCat(cat);
      if (name) {
        console.log('Saving ', cat, year, name, id);
        const dbRecord = await SubjectCountYears.findOne({ id, year }).exec();
        if (dbRecord) {
          dbRecord.count++;
          const update = await dbRecord.save();
          console.log('updated: ', update);
        } else {
          const entry = await new SubjectCountYears({ name, id, year, count: 1 }).save();
          console.log('added new category and year: ', entry);
        }
      } else {
        console.log('could not save name ', name, 'with id ', id);
      }
    }
  }
  console.log('setting timeout to run again');
  setTimeout(processData, 30000);
};


const request = async () => {
  console.log('requesting ');
  console.log()
  const params = {
    verb: 'ListRecords'
  };
  if (resume) {
    params.resumptionToken = resume;
  } else {
    params.metadataPrefix = 'arXiv';
    // params.from = '2013-01-01';
    // params.until = '2017-05-02';
  }
  console.log('params: ', params);
  try {
    const { data } = await get(url, { params });
    const { ['OAI-PMH']: { ListRecords: { record, resumptionToken } } } = await x2js.xml2js(data);
    console.log('# records: ', record.length);
    resume = resumptionToken.toString();
    fs.appendFile('/home/ivey/log.txt', `token: ${resume}\n`);
    console.log('token ', resume);
    return record;
  } catch (err) {
    fs.appendFile('/home/ivey/log.txt', `ERROR: ${err}\n`);
    return [];
  }
};


export default processData;
