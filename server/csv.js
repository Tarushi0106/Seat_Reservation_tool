const { MongoClient } = require("mongodb");
const { Parser } = require("json2csv");
const fs = require("fs");

const uri = "mongodb+srv://UBER:UBER@cluster0.7ygwh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function exportToCSV() {
  try {
    console.log("📡 Connecting to MongoDB...");
    await client.connect();
    console.log("✅ Connected.");

    const db = client.db("test");
    const collectionNames = ["seats", "users", "userdetails", "cancelledseats"];

    for (const name of collectionNames) {
      console.log(`\n📥 Fetching data from '${name}' collection...`);
      const collection = db.collection(name);
      const data = await collection.find({}).toArray();
      console.log(`📊 Fetched ${data.length} documents from '${name}'.`);

      if (data.length === 0) {
        console.log(`⚠️ No data found in '${name}' collection.`);
        continue;
      }

      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(data);

      const fileName = `${name}.csv`;
      fs.writeFileSync(fileName, csv);
      console.log(`✅ CSV file created: ${fileName}`);
    }

  } catch (err) {
    console.error("❌ Error exporting to CSV:", err);
  } finally {
    await client.close();
    console.log("\n🔌 Connection closed.");
  }
}

exportToCSV();
