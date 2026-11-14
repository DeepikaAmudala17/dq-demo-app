import { app } from './app';

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`dq-demo-app listening on port ${port}`);
});
