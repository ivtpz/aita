import { Mailgun } from 'mailgun';
import fs from 'fs';
import { arxivRequest } from './arxiv';
import { generateEmail } from '../helpers/email';
import dummy from '../client/src/helpers/dummyArxivData';

const mg = new Mailgun(process.env.MAILGUN_KEY);

const sendMail = async (req, res) => {
  const { body: { email, recommendations, name } } = req;
  //const rawAricleData = await arxivRequest(recommendations);
  const rawAricleData = dummy.feed.entry;
  const emailBody = generateEmail("Ivey", rawAricleData);

  fs.writeFile('email.html', emailBody)

  // const emailBody = generateEmail(name, rawAricleData);
  // mg.sendRaw(
  //   'postmaster@sandbox578359e90d3a4d388e18dfc61088e7d8.mailgun.org', // Sender
  //   email, // Recepient
  //   'From: sender@example.com' +
  //     '\nTo: ' + email +
  //     '\nContent-Type: text/html; charset=utf-8' +
  //     '\nSubject: Your Weekly Recommendations from AITA' +
  //     emailBody,
  //   err => (err ?
  //     res.status(503).send(`Failed to send email: ${err}`) :
  //     res.status(200).send()
  //   ));
};

export {
  sendMail
};
