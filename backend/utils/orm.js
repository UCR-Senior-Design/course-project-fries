// const { Embeddings } = require("langchain/embeddings/base");
const {Document} = require("langchain/document");
const {PrismaClient} = require("@prisma/client");
const {VectorStore} = require("langchain/vectorstores/base");

const prisma = new PrismaClient();

class ChatbotVectorStore extends VectorStore {
  constructor(embeddings, args) {
    super(embeddings, args);
    // this.botId = args.botId;
    // this.sourceId = args.sourceId;
    this.embeddings = embeddings;
  }

  async addVectors(vectors, documents) {
    const rows = vectors.map((embedding, idx) => ({
      content: documents[idx].pageContent,
      embedding,
      metadata: documents[idx].metadata,
      // botId: this.botId,
      // sourceId: this.sourceId,
    }));

    try {
      for (const row of rows) {
        if (row.embedding) {
          const vector = `[${row.embedding.join(",")}]`;
          const content = row.content.replace(/\x00/g, "").trim();
          await prisma.$executeRaw`INSERT INTO "BotDocument" ("content", "embedding", "metadata", "botId", "sourceId") VALUES (${content}, ${vector}::vector, ${row.metadata}, ${row.botId}, ${row.sourceId})`;
        }
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async addDocuments(documents) {
    const texts = documents.map(({pageContent}) => pageContent);
    const embeddings = await this.embeddings.embedDocuments(texts);
    return this.addVectors(embeddings, documents);
  }

  static async fromDocuments(docs, embeddings, dbConfig) {
    const instance = new this(embeddings, dbConfig);
    await instance.addDocuments(docs);
    return instance;
  }

  static async fromTexts(texts, metadatas, embeddings, dbConfig) {
    const docs = [];
    for (let i = 0; i < texts.length; i++) {
      const metadata = Array.isArray(metadatas) ? metadatas[i] : metadatas;
      const newDoc = new Document({
        pageContent: texts[i],
        metadata,
      });
      docs.push(newDoc);
    }
    return this.fromDocuments(docs, embeddings, dbConfig);
  }

  static async fromExistingIndex(embeddings, dbConfig) {
    const instance = new this(embeddings, dbConfig);
    return instance;
  }

  async similaritySearchVectorWithScore(query, k, filter) {
    console.log(this.botId);
    const vector = `[${query.join(",")}]`;
    // const bot_id = this.botId;

    // const data = await prisma.$queryRaw`
    //  SELECT * FROM "similarity_search_v2"(query_embedding := ${vector}::vector, botId := ${bot_id}::text,match_count := ${k}::int)
    // `;

    const data = await prisma.$queryRaw`
     SELECT * FROM "similarity_search_v2"(query_embedding := ${vector}::vector, match_count := ${k}::int)
    `;

    const result = data.map((resp) => [
      new Document({
        metadata: resp.metadata,
        pageContent: resp.content,
      }),
      resp.similarity,
    ]);
    return result;
  }

  _vectorstoreType() {
    return "chatbot";
  }
}

module.exports = {ChatbotVectorStore};
