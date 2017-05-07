import { get, post } from 'axios';
import X2JS from 'x2js';
import { SubjectCountYears } from '../db/config';
import cats from '../client/src/helpers/arxivCategories';

const url = 'http://export.arxiv.org/oai2';

const x2js = new X2JS();

let resume;


const processData = async () => {
  console.log('processing...')
  const records = await request();
  for (const r of records) {
    const { metadata: { arXiv: { created, categories } } } = r;
    console.log('processing ', created, categories);
    const year = created.slice(0, 4);
    const cat = categories.split(' ')[0];
    const lookUp = cat.split('.');
    if (lookUp.length === 1) lookUp.unshift('noPrefix');
    const id = lookUp.join('.');
    const general = cats[lookUp[0]];
    const name = general && general[lookUp[1]];
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
      console.log('could not save ', name);
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
  }
  console.log('params: ', params);
  const { data } = await get(url, { params });
  const { ['OAI-PMH']: { ListRecords: { record, resumptionToken } } } = await x2js.xml2js(data);
  console.log('# records: ', record.length);
  resume = resumptionToken.toString();
  console.log('token ', resume);
  return record;
};


export default processData;
