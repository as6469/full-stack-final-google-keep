const express = require('express')
const app = express()
const cors = require("cors");
const bodyParser = require('body-parser'); // middleware making object 
const {MongoClient} = require('mongodb');
const ObjectId = require("mongodb").ObjectId;

app.use(cors()); // middleware 
app.use(bodyParser.json());
const uri = "mongodb+srv://as6469:randompasswordforfullstack123@s23-w4111.p4yd7np.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);
const db = client.db("S23-W4111"); 

async function main(){
    try {
        await client.connect();
        app.listen(5000,()=>{console.log("server started on port 5000")});
 
    } catch (e) {
        console.error(e);
    }
}

app.get("/api", async (req, res) =>{
    const data = await db.collection("notes").find().toArray();
    res.send(data);
});

app.post("/api/postData", async (req, res) => {
    console.log("post req received");
    const data = req?.body;

    const result = await db.collection("notes").insertOne(data);
    res.send(result);
})

app.delete("/api/deleteData", async (req, res) => {
    console.log("delete req received");
    const { id } = req.body;
   
    const result = await db.collection("notes").deleteOne({_id: new ObjectId(id)});
    res.send(result);
})

main().catch(console.error);