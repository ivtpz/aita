import X2JS from 'x2js';
import { Mailgun } from 'mailgun';
import { get } from 'axios';
import { Users, SubjectCounts } from '../db/config';
import { generateEmail } from '../helpers/email';

const x2js = new X2JS();

const mg = new Mailgun(process.env.MAILGUN_KEY);

const addUser = async email =>
  new Users({ email }).save();

const findOrAddUser = async ({ query: { email } }, res) => {
  let user = await Users
    .findOne({ email })
    .exec();
  if (!user) user = await addUser(email);
  res.status(200).send(user);
};

const addReference = async (req, res) => {
  const { body: { refId, userId } } = req;
  try {
    const user = await Users
      .findById(userId)
      .exec();
    user.references.push(refId);
    await user.save();
    res.status(200).send(`Added ${refId}`);
  } catch (err) {
    res.status(400).send('User not found');
  }
};

const removeReference = async (req, res) => {
  const { body: { refId, userId } } = req;
  try {
    const user = await Users
      .findById(userId)
      .exec();
    const i = user.references.indexOf(refId);
    user.references.splice(i, 1);
    await user.save();
    res.status(200).send(`Removed ${refId}`);
  } catch (err) {
    res.status(400).send('User not found');
  }
};

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

const sendMail = async (req, res) => {
  const { body: { email, recommendations, name } } = req;
  const rawAricleData = await arxivRequest(recommendations);
  const emailBody = generateEmail(name, rawAricleData);
  mg.sendRaw(
    'postmaster@sandbox578359e90d3a4d388e18dfc61088e7d8.mailgun.org', // Sender
    email, // Recepient
    'From: sender@example.com' +
      '\nTo: ' + email +
      '\nContent-Type: text/html; charset=utf-8' +
      '\nSubject: I Love Email' +
      emailBody,
    err => (err ?
      res.status(503).send(`Failed to send email: ${err}`) :
      res.status(200).send()
    ));
};

export {
  findOrAddUser,
  addReference,
  removeReference,
  addUser,
  getArxivDataById,
  updateSubjectCount,
  sendMail
};
