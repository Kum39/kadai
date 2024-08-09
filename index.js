const express = require('express');
const app = express();
const path = require('node:path');
const { MongoClient, ObjectId } = require('mongodb');
const methodOverride = require('method-override');

app.use(methodOverride('_method')); // クエリパラメータやフォームでHTTPメソッドを上書きする


const client = new MongoClient('mongodb://localhost:27017');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use('/static', express.static(path.join(__dirname, 'public')));

async function main() {
  await client.connect();
  const db = client.db('my-app');

  app.get('/', async (req, res) => {
    const items = await db.collection('item').find().toArray();
    res.render('index', { items: items });
  });

  app.post('/api/item', async (req, res) => {
    const { name } = req.body;
    if (!name) {
      res.status(400).send('Bad Request');
      return;
    }
    await db.collection('item').insertOne({ name: name });
    res.redirect('/');
  });

  app.delete('/api/item/:id', async (req, res) => {
    const itemId = req.params.id;
    await db.collection('item').deleteOne({ _id: new ObjectId(itemId) });
    res.redirect('/');
  });

  app.listen(3000, () => {
    console.log('start listening');
  });
}

main();


