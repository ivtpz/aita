import X2JS from 'x2js';
import { get } from 'axios';
import { SubjectCounts, SubjectCountYears } from '../db/config';

const x2js = new X2JS();


const arxivRequest = async (ids) => {
  const url = 'http://export.arxiv.org/api/query';
  const { data } = await get(url, {
    params: {
      id_list: ids.join(','),
      start: 0
    }
  });
  const { feed: { entry } } = x2js.xml2js(data);
  return Array.isArray(entry) ? entry : [entry];
};

const getArxivDataById = async (req, res) => {
  const { query: { ids } } = req;
  const data = await arxivRequest(ids);
  res.status(200).send(data);
};

const getArxivSubjectCounts = async (req, res) => {
  const { year } = req.query;
  if (year) {
    const subByYear = await SubjectCountYears.find({ year }).exec();
    res.status(200).send(subByYear);
  } else {
    const subjects = await SubjectCounts.find({}).exec();
    res.status(200).send(subjects);
  }
};

const updateSubjectCount = async (req, res) => {
  const { id, count } = req.body;
  try {
    const subject = await SubjectCounts.findOne({ id });
    subject.count = count;
    const update = await subject.save();
    res.status(200).send(update);
  } catch (err) {
    res.status(401).send(err);
  }
};

export {
  getArxivDataById,
  getArxivSubjectCounts,
  updateSubjectCount
};
