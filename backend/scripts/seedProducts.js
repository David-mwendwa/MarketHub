import dotenv from 'dotenv';
import Product from '../models/Product.js';
import { readFile } from 'fs/promises';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory path in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Add mongoose strictQuery warning suppression
mongoose.set('strictQuery', false);

// ---------------------------------------------------
let CATEGORY = 'smartphones'
// ---------------------------------------------------

const seedSmartphones = async () => {
  try {
    // Connect to MongoDB
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set');
    }

    const DB = process.env.MONGO_PASSWORD
      ? process.env.MONGO_URI.replace('<PASSWORD>', process.env.MONGO_PASSWORD)
      : process.env.MONGO_URI;

    const mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(DB, mongooseOptions);
    console.log('✅ MongoDB connection successful');

    // Read the smartphones data file
    const data = await readFile(
      path.join(__dirname, '../data/smartphones.json'),
      'utf-8'
    );

    const products = JSON.parse(data);

    // Remove all categories products first to prevent duplicates
    await Product.deleteMany({ category: CATEGORY });
    console.log(`Cleared existing ${CATEGORY} products`);

    // Remove id field from products to prevent duplicate key errors
    const productsToInsert = products.map(({ id, ...rest }) => ({
      ...rest,
      category: CATEGORY,
      vendor: '693ef1a59d48a0deb8755f56',
    }));

    console.log(`Inserting ${CATEGORY} products...`);

    // First insert all products
    const result = await Product.insertMany(productsToInsert, {
      ordered: false,
    });

    console.log(`Successfully seeded ${result.length} ${CATEGORY}`);

    // Update configurable options with correct productId
    for (const product of result) {
      if (product.configurableOptions?.length > 0) {
        await Product.updateOne(
          { _id: product._id },
          {
            $set: {
              'configurableOptions.$[].productId': product._id,
            },
          }
        );
        console.log(`Updated configurable options for product ${product._id}`);
      }
    }

    // Close the connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error seeding ${CATEGORY}:`, error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('✅ Database connection closed after error');
    }
    process.exit(1);
  }
};

seedSmartphones().catch((error) => {
  console.error(`Error in seeding ${CATEGORY}:`, error);
  process.exit(1);
});
