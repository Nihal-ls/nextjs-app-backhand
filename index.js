const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

const uri = "mongodb+srv://nihallaskar888_db_user:EOy5ImC8mjL8kOpu@klyvex-cluster.a1rycxp.mongodb.net/?appName=klyvex-cluster";

let cachedClient = null;

// Helper to get a connected client
async function getClient() {
    if (cachedClient && cachedClient.isConnected && cachedClient.isConnected()) {
        return cachedClient;
    }
    cachedClient = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    await cachedClient.connect();
    return cachedClient;
}

// Root route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// /products
app.get('/products', async (req, res) => {
    try {
        const client = await getClient();
        const productCollection = client.db('klyvex_db').collection('products');
        const result = await productCollection.find().toArray();
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// /latest-products
app.get('/latest-products', async (req, res) => {
    try {
        const client = await getClient();
        const productCollection = client.db('klyvex_db').collection('products');
        const result = await productCollection.find().limit(6).toArray();
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// /add-products
app.post('/add-products', async (req, res) => {
    try {
        const client = await getClient();
        const productCollection = client.db('klyvex_db').collection('products');
        await productCollection.insertOne(req.body);
        res.send({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// /users-products
app.get('/users-products', async (req, res) => {
    try {
        const client = await getClient();
        const productCollection = client.db('klyvex_db').collection('products');
        const email = req.query.email;
        const result = await productCollection.find({ owner_email: email }).toArray();
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// /user-products/:id
app.delete('/user-products/:id', async (req, res) => {
    try {
        const client = await getClient();
        const productCollection = client.db('klyvex_db').collection('products');
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await productCollection.deleteOne(query);
        res.send({ success: true, deletedCount: result.deletedCount });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
