import {Callbacks} from "@langchain/core/dist/callbacks/manager";

const { PrismaClient } = require("@prisma/client");
const { Document } = require("langchain/document");
const { Embeddings } = require("langchain/embeddings/base");
const { BaseRetriever } = require("langchain/schema/retriever");
const { CallbackManagerForRetrieverRun } = require("langchain/callbacks");

const prisma = new PrismaClient();

// interface SearchEmbeddingsResponse {
//   id: number;
//   content: string;
//   metadata: object;
//   similarity: number;
// }

export class HybridRetriever extends BaseRetriever {
  // callbacks?: Callbacks;
  // tags?: string[];
  // metadata?: Record<string, unknown>;
  // verbose?: boolean;
  static lc_name() {
    return "HybridRetriever";
  }

  constructor(embeddings, args) {
    super(args);
    this.lc_namespace = ["langchain", "retrievers", "dialoqbase"];
    // this.botId = args.botId;
    // this.sourceId = args.sourceId;
    this.embeddings = embeddings;
    this.similarityK = 5;
    this.keywordK = 4;
  }

  async similaritySearch(query, k, _callbacks) {
    try {
      const embeddedQuery = await this.embeddings.embedQuery(query);
      const vector = `[${embeddedQuery.join(",")}]`;
      // const bot_id = this.botId;

      // const data = await prisma.$queryRaw`
      //   SELECT * FROM "similarity_search_v2"(query_embedding := ${vector}::vector, botId := ${bot_id}::text,match_count := ${k}::int)
      // `;

      const data = await prisma.$queryRaw`
        SELECT * FROM "similarity_search_v2"(query_embedding := ${vector}::vector, match_count := ${k}::int)
      `;

      const result = data.map((resp) => [
        new Document({
          metadata: resp.metadata,
          pageContent: resp.content,
        }),
        resp.similarity * 10,
        resp.id,
      ]);
      return result;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async keywordSearch(query, k) {
    const query_text = query;
    const bot_id = this.botId;

    // const data = await prisma.$queryRaw`
    //   SELECT * FROM "kw_match_documents"(query_text := ${query_text}::text, bot_id := ${bot_id}::text,match_count := ${k}::int)
    // `;

    const data = await prisma.$queryRaw`
      SELECT * FROM "kw_match_documents"(query_text := ${query_text}::text, match_count := ${k}::int)
    `;

    const result = data.map((resp) => [
      new Document({
        metadata: resp.metadata,
        pageContent: resp.content,
      }),
      resp.similarity * 10,
      resp.id,
    ]);

    return result;
  }

  async hybridSearch(query, similarityK, keywordK, callbacks) {
    const similarity_search = this.similaritySearch(query, similarityK, callbacks);
    const keyword_search = this.keywordSearch(query, keywordK);

    return Promise.all([similarity_search, keyword_search])
      .then((results) => results.flat())
      .then((results) => {
        const picks = new Map();

        results.forEach((result) => {
          const id = result[2];
          const nextScore = result[1];
          const prevScore = picks.get(id)?.[1];

          if (prevScore === undefined || nextScore > prevScore) {
            picks.set(id, result);
          }
        });

        return Array.from(picks.values());
      })
      .then((results) => results.sort((a, b) => b[1] - a[1]));
  }

  async _getRelevantDocuments(query, runManager) {
    const searchResults = await this.hybridSearch(query, this.similarityK, this.keywordK, runManager?.getChild("hybrid_search"));
    return searchResults.map(([doc]) => doc);
  }
}
