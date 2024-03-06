// const { DocxLoader } = require("langchain/document_loaders/fs/docx");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { ChatbotVectorStore } = require("../utils/orm");
const { embeddings } = require("../utils/embeddings");
const { DocxLoader } = require("../models/docx-loader");

const DocxController = async (source) => {
  console.log("Loading docx...");

  const location = source.location;
  const loader = new DocxLoader(location);
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
    }
  );
};

module.exports = { DocxController };
