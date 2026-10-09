// const OpenAI = require("openai");

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// exports.createEmbedding = async (text) => {
//   const response = await openai.embeddings.create({
//     model: "text-embedding-3-small",
//     input: text,
//   });

//   return response.data[0].embedding;
// };


// ---------------------------------------------------------------------------

// working wiht the hugging face api
//   const axios = require("axios");

// const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

// // const MODEL = "sentence-transformers/all-MiniLM-L6-v2";
// const MODEL = "BAAI/bge-small-en-v1.5";

// exports.createEmbedding = async (text) => {
//   try {
//     if (!text || typeof text !== "string") {
//       throw new Error("Text is required");
//     }

//     const response = await axios.post(
//       `https://router.huggingface.co/hf-inference/models/${MODEL}`,
//       {
//         inputs: text,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     let embedding = response.data;

//     if (Array.isArray(embedding) && Array.isArray(embedding[0])) {
//       embedding = embedding[0];
//     }

//     if (!Array.isArray(embedding)) {
//       throw new Error("Invalid embedding response");
//     }

//     return embedding;

//   } catch (error) {
//     console.error(
//       "Embedding Error:",
//       error.response?.data || error.message
//     );

//     throw new Error("Failed to generate embedding");
//   }
// };
// ----------------------------------------------------------------------------------------

const { pipeline } = require("@huggingface/transformers");

let extractorPromise;

async function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline(
      "feature-extraction",
      "Xenova/bge-small-en-v1.5"
    ).catch((error) => {
      extractorPromise = null;
      throw error;
    });
  }

  return extractorPromise;
}

async function createEmbedding(text) {
  if (!text || !text.trim()) {
    throw new Error("Cannot create embedding from empty text");
  }

  const extractor = await getExtractor();

  const output = await extractor(text, {
    pooling: "cls",
    normalize: true,
  });

  return Array.from(output.data);
}

module.exports = { createEmbedding };