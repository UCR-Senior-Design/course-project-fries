const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { ChatbotVectorStore } = require("../utils/orm");
const { embeddings } = require("../utils/embeddings");
const { TextLoader } = require("langchain/document_loaders/fs/text");

const TxtController = async (source) => {
  console.log("Loading txt...");

  const location = source.location;
  const loader = new TextLoader(location);
  const docs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await textSplitter.splitDocuments(docs);

  await ChatbotVectorStore.fromDocuments(
    chunks,
    embeddings(source.embedding),
    {
      botId: source.botId,
      sourceId: source.id,
    },
  );
};

module.exports = { TxtController };
