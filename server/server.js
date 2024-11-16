import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${PORT}`)
})