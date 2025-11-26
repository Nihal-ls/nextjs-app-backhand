const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const cors = require('cors');
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

app.get('/', (req, res) => {
    res.send('Hello World!')
})

async function run() {
    try {
        // await client.connect();

        const db = client.db('klyvex_db');
        const productCollection = db.collection('products');


        app.get('/products', async (req, res) => {
            const result = await productCollection.find().toArray()
            res.send(result)
        })
        app.get('/latest-products', async (req, res) => {
            const result = await productCollection.find().limit(6).toArray()
            res.send(result)
        })
        app.post('/add-products', async (req, res) => {
            const data = req.body
            const result = await productCollection.insertOne(data)
            res.send({
                succeess: true
            })
        })
        app.get('/users-products', async (req, res) => {
            const email = req.query.email;
            const result = await productCollection.find({ owner_email: email }).toArray();
            res.send(result);
        });
        app.delete('/user-products/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: new ObjectId(id) };
            const result = await productCollection.deleteOne(query);

            res.send({
                success: true,
                deletedCount: result.deletedCount
            });
        });

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })

        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}

run().catch(console.dir);
