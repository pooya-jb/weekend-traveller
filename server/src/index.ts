import 'dotenv/config';

import express, { Request, Response, Application } from 'express';

const PORT: number = process.env.PORT;
const URL: string = process.env.URL;

const app: Application = express();

app.get('/', (req: Request, res: Response) => {
  console.log('Default response');
});

app.listen(PORT, URL, () => {
  console.log('Server listening');
});
