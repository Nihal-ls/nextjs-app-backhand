const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

const uri = "mongodb+srv://nihallaskar888_db_user:EOy5ImC8mjL8kOpu@klyvex-cluster.a1rycxp.mongodb.net/?appName=klyvex-cluster";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Root route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

async function run() {
    try {
        // Lazy connection: do NOT call client.connect() here
        const db = client.db('klyvex_db');
        const productCollection = db.collection('products');

        // Routes
        app.get('/products', async (req, res) => {
            try {
                const result = await productCollection.find().toArray();
                res.send(result);
            } catch (err) {
                console.error(err);
                res.status(500).send({ error: 'Internal Server Error' });
            }
        });

        app.get('/latest-products', async (req, res) => {
            try {
                const result = await productCollection.find().limit(6).toArray();
                res.send(result);
            } catch (err) {
                console.error(err);
                res.status(500).send({ error: 'Internal Server Error' });
            }
        });

        app.post('/add-products', async (req, res) => {
            try {
                const data = req.body;
                await productCollection.insertOne(data);
                res.send({ success: true });
            } catch (err) {
                console.error(err);
                res.status(500).send({ error: 'Internal Server Error' });
            }
        });

        app.get('/users-products', async (req, res) => {
            try {
                const email = req.query.email;
                const result = await productCollection.find({ owner_email: email }).toArray();
                res.send(result);
            } catch (err) {
                console.error(err);
                res.status(500).send({ error: 'Internal Server Error' });
            }
        });

        app.delete('/user-products/:id', async (req, res) => {
            try {
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

        console.log("MongoDB setup complete. Server is ready!");
    } catch (err) {
        console.error(err);
    }
}

run().catch(console.dir);
