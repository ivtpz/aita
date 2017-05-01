import { get, post } from 'axios';
import X2JS from 'x2js';
import { SubjectCountYears } from '../db/config';
import cats from '../client/src/helpers/arxivCategories';

const url = 'http://export.arxiv.org/oai2';

const x2js = new X2JS();

let resume;


const process = async () => {
  console.log('processing...')
  const records = await request();
  Promise.all(records.map(async (r) => {
    const { metadata: { arXiv: { created, categories } } } = r;
    const year = created.slice(0, 4);
    const cat = categories.split(' ')[0];
    const lookUp = cat.split('.');
    if (lookUp.length === 1) lookUp.unshift('noPrefix');
    const id = lookUp.join('.');
    const name = cats[lookUp[0]][lookUp[1]];
    const dbRecord = await SubjectCountYears.findOne({ id, year }).exec();
    if (dbRecord) {
      dbRecord.count++;
      const update = await dbRecord.save();
      console.log('updated: ', update);
    } else {
      const entry = await new SubjectCountYears({ name, id, year, count: 1 }).save();
      console.log('added new category and year: ', entry);
    }
  }));
  setTimeout(process, 30000);
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


export default process;
