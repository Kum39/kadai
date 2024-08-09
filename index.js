const express = require('express');
const app = express();
const path = require('node:path');
const { MongoClient, ObjectId } = require('mongodb');
const methodOverride = require('method-override');

// MongoDBの接続設定
const client = new MongoClient('mongodb://localhost:27017');

app.use(methodOverride('_method')); // クエリパラメータやフォームでHTTPメソッドを上書きする
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'public')));

async function main() {
  try {
    await client.connect();
    const db = client.db('my-app');

    app.get('/', async (req, res) => {
      try {
        const items = await db.collection('item').find().toArray();
        res.render('index', { items: items });
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
    });

    app.post('/api/item', async (req, res) => {
      try {
        const { name } = req.body;
        if (!name) {
          res.status(400).send('Bad Request');
          return;
        }
        await db.collection('item').insertOne({ name: name });
        res.redirect('/');
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
    });

    app.delete('/api/item/:id', async (req, res) => {
      try {
        const itemId = req.params.id;
        await db.collection('item').deleteOne({ _id: new ObjectId(itemId) });
        res.redirect('/');
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
    });

    app.listen(3000, () => {
      console.log('start listening');
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // 失敗した場合はプロセスを終了する
  }
}

main();



