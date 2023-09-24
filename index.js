const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();



// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d4qhn1l.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();

        const hotelsInfoCollection = client.db("travelEra").collection("hotelsInfo");
        const hotelsCollection = client.db("travelEra").collection("hotels");
        const photosCollection = client.db("travelEra").collection("photos");
        const bookingCollection = client.db("travelEra").collection("booking");

        // hotel info related apis
        app.get('/hotelsInfo', async(req, res) => {
            const result = await hotelsInfoCollection.find().toArray();
            res.send(result);
        })

        app.get('/singlehotel/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await hotelsInfoCollection.findOne(query);
            res.send(result);
        })

        // hotel related apis
        app.get('/hotels', async(req, res) => {
            const result = await hotelsCollection.find().toArray();
            res.send(result);
        })

        // photos related apis
        app.get('/photos', async(req, res) => {
            const result = await photosCollection.find().toArray();
            res.send(result);
        })

        // booking details related apis
        app.post('/booking', async(req, res) => {
            const newBooking = req.body;
            const result = await bookingCollection.insertOne(newBooking);
            res.send(result);
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
    res.send('TravelEra Server Is Running')
})

app.listen(port, () => {
    console.log(`TravelEra is sitting on port ${port}`)
})