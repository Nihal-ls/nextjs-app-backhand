const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = 5000
// EOy5ImC8mjL8kOpu
// nihallaskar888_db_user
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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const db = client.db('klyvex_db');
        const productCollection = db.collection('products');


 app.get('/products',async(req,res) => {
    const result = await productCollection.find().toArray()
    res.send(result)
 })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
