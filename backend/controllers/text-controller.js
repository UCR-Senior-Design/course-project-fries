const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { ChatbotVectorStore } = require("../utils/orm");
const { embeddings } = require("../utils/embeddings");

const TextController = async (source) => {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await textSplitter.splitDocuments([
    {
      pageContent: source.content,
      metadata: { source: `text-${source.id}` },
    }
  ]);

  await ChatbotVectorStore.fromDocuments(
    chunks,
    embeddings(source.embedding),
    {
      botId: source.botId,
      sourceId: source.id,
    },
  );
};

module.exports = { TextController };
