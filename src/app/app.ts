const papercups = require('@papercups-io/papercups')('SFMyNTY.g2gDbAAAAAJoAmQAB3VzZXJfaWRiAAAX82gCZAAKYWNjb3VudF9pZG0AAAAkMjNiOTI5YmYtMTMzOS00N2M3LTljYWMtZTYwNGM2ZTVhMTEwam4GANII9cqFAWIAAVGA.LkxmLEj2ru7MgjohZHe9N-TKvHsOuCn92BGp-JfNF74');
const cors = require('cors');
const express = require('express')
const { dockStart } = require('@nlpjs/basic');

let nlp
(async () => {
  const dock = await dockStart({ use: ['Basic']});
  nlp = dock.get('nlp');
  nlp.addLanguage('en');

  nlp.addDocument('en', 'sweepstakes dont work', 'sweepstakes')
  nlp.addDocument('en', 'missing sweepstakes prize', 'sweepstakes')
  nlp.addDocument('en', 'how does sweepstake work ?', 'sweepstakes')
  nlp.addDocument('en', 'cant enter sweepstakes', 'sweepstakes')

  nlp.addDocument('en', 'how can I swap tokens ?', 'swaps')
  nlp.addDocument('en', 'swap dont work', 'swaps')
  nlp.addDocument('en', 'how to I transfer my tokens ', 'swaps')


  nlp.addAnswer('en', 'sweepstakes', 'Sweepstakes answer is...');
  nlp.addAnswer('en', 'swaps', 'Swaps answer is...');
  await nlp.train();
})();

const app = express()

app.use(cors());
app.use(express.json());

const port = 3000
  export interface Metadata {
    appVersion: string;
    codepush: string;
    device: string;
    platform: string;
  }

  export interface Customer {
    browser?: any;
    company_id?: any;
    created_at: Date;
    current_url?: any;
    email: string;
    external_id: string;
    host?: any;
    id: string;
    metadata: Metadata;
    name: string;
    object: string;
    os?: any;
    pathname?: any;
    phone?: any;
    profile_photo_url?: any;
    title: string;
    updated_at: Date;
  }

  export interface Message {
    account_id: string;
    attachments: any[];
    body: string;
    content_type: string;
    conversation_id: string;
    created_at: Date;
    customer: Customer;
    customer_id: string;
    id: string;
    metadata?: any;
    object: string;
    private: boolean;
    seen_at?: any;
    sent_at: Date;
    source: string;
    type: string;
    user?: any;
    user_id?: any;
  }



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/', async(req, res) => {
  const {event, payload} = req.body;
  switch (event) {
    case 'message:created':
      const data = payload as Message;
      if(data.customer_id) {
        const response = await nlp.process('en', data.body);
        console.log(response.answer);
        if(response.answer) {
          await papercups.messages
            .create({
              body: response.answer,
              conversation_id: data.conversation_id,
            })
        }
      }
      break
    case 'conversation:created':
    case 'customer:created':
      return res.json({ok: true});
  }
  return res.json({ok: true});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
