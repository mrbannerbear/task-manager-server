import express from "express";
import cors from "cors";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

const uri =
  "mongodb+srv://workplacesaqlain:3r8Em7shW9iqKBi5@project-pilot-cluster1.vcrculm.mongodb.net/?retryWrites=true&w=majority";

const port = process.env.PORT || 3150;

const app = express();

// Middleware
app.use(express.json()); // Parses incoming json requests
app.use(cors()); // Allows server to handle incoming requests
dotenv.config(); // Loads .env file contents into process.env by default

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = client.db("database")
const tasks = db.collection("tasks")

app.get("/", (req, res) => {
    res.send("Running")
})

async function run() {
  try {

    app.get("/tasks",async (req, res) => {
        const result = await tasks.find().toArray()
        res.send(result)
    })

    app.post("/tasks", async(req, res) => {
        const body = req.body
        const result = await tasks.insertOne(body)
        res.send(result)
    })

    app.patch("/tasks/:id", async (req, res) => {
        const id = req.params.id;
        const body = req.body;
        const filter = { _id: new ObjectId(id) };
        const existingTask = await tasks.findOne(filter);
  
        const updatedTask = {
          $set: {
            title: body?.title || existingTask.title,
            description: body?.description || existingTask.description,
            deadline: body?.deadline || existingTask.deadline,
            status: body?.status || existingTask.status,
            priority: body?.priority || existingTask.priority,
          },
        };
        const result = await tasks.updateOne(filter, updatedTask);
        res.send(result);
      });

        app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tasks.deleteOne(query);
      res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}

app.listen(port, () => {
    console.log("Successfully running port", port);
  });

run().catch(console.dir);
