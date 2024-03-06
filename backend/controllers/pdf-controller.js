// const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { ChatbotVectorStore } = require("../utils/orm");
const { embeddings } = require("../utils/embeddings");
const { PDFLoader } = require("../models/pdf-loader");

const PdfController = async (source) => {
  console.log("Loading pdf...");

  const location = source.location;
  const loader = new PDFLoader(location);
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

module.exports = { PdfController };
