import express from 'express';
import { urlencoded, json } from 'body-parser';
// import { AuthenticationClient } from 'auth0';
import path from 'path';
import morgan from 'morgan';
import {
  findOrAddUser,
  addReference,
  removeReference,
  sendMail,
  getArxivDataById,
  updateSubjectCount
} from './routes/routes';
import { checkOrigin } from './routes/auth';

const app = express();
const port = process.env.PORT || 6543;

// const auth0 = new AuthenticationClient({
//   clientId: '9ktoTjI4KL8e1qLEcTCY1SAd57LCpivK',
//   domain: 'aita.eu.auth0.com'
// });
app.use(morgan('dev'));
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(express.static(path.join(__dirname, '/client/public')));

app.get('/user', findOrAddUser);
app.put('/user/add', addReference);
app.put('/user/remove', removeReference);
app.get('/arxiv/byid', getArxivDataById);
app.put('/arxiv/subject', updateSubjectCount);
app.post('/api/sendmail', checkOrigin, sendMail);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/public/index.html'));
});

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
