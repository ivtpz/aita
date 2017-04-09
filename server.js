import express from 'express';
import { urlencoded, json } from 'body-parser';
import { AuthenticationClient } from 'auth0';
import { findOrAddUser, addReference } from './routes';

const app = express();
const port = process.env.PORT || 6543;

const auth0 = new AuthenticationClient({
  clientId: '9ktoTjI4KL8e1qLEcTCY1SAd57LCpivK',
  domain: 'aita.eu.auth0.com'
});

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(express.static('public'));

app.get('/user', findOrAddUser);
app.put('/user', addReference);

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
