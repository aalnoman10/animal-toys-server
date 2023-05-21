const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000

const corsConfig = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}

app.use(express.json())
app.use(cors(corsConfig))
app.options("", cors(corsConfig))

const uri = `mongodb+srv://${process.env.NAME}:${process.env.PASS}@cluster0.hrkpt8c.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const toysCollection = client.db("animalToy").collection("toys");
        const lionsCollection = client.db("animalToy").collection("lions");
        const tigersCollection = client.db("animalToy").collection("tigers");
        const zebrasCollection = client.db("animalToy").collection("zebras");

        // toys 
        app.get('/toys', async (req, res) => {
            let query = {}
            const email = req.query?.email
            if (email) {
                query = { email };
            }
            const result = await toysCollection.find(query).toArray();
            res.send(result)
        })

        app.post('/toys', async (req, res) => {
            const body = req.body
            const result = await toysCollection.insertOne(body)
            res.send(result)
        })

        app.delete('/toys/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.deleteOne(query)
            res.send(result)
        })


        // single toys 
        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }

            const result = await toysCollection.findOne(query)
            res.send(result)
        })

        app.put('/toys/:id', async (req, res) => {
            const id = req.params.id
            const body = req.body
            const filter = { _id: new ObjectId(id) };

            const options = {
                upsert: true
            }

            const updatedToy = {
                $set: {
                    price: body.price,
                    quantity: body.quantity,
                    description: body.description
                }
            }

            const result = await toysCollection.updateOne(filter, updatedToy, options)
            res.send(result)
        })


        //  lions , tigers & zebras get for home page
        app.get('/lions', async (req, res) => {
            const result = await lionsCollection.find().toArray();
            res.send(result)
        })

        app.get('/tigers', async (req, res) => {
            const result = await tigersCollection.find().toArray();
            res.send(result)
        })

        app.get('/zebras', async (req, res) => {
            const result = await zebrasCollection.find().toArray();
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('run ...')
})

app.listen(port, () => {
    console.log(port);
})