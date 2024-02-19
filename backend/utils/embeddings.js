const { OpenAIEmbeddings } = require("langchain/embeddings/openai");

const embeddings = (embeddingsType) => {
  if (embeddingsType === 'openai') {
    return new OpenAIEmbeddings();
  } else {
    throw new Error(`Invalid embeddings type: ${embeddingsType}`);
  }
};

module.exports = { embeddings };
