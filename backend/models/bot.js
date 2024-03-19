const {ChatOpenAI, OpenAIEmbeddings} = require("@langchain/openai");

const chatModelProvider = () => {
  return new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
    // ...otherFields,
  });
};

const chatEmbeddingProvider = () => {
  return new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    // ...otherFields,
  });
};

module.exports = {chatModelProvider, chatEmbeddingProvider};
