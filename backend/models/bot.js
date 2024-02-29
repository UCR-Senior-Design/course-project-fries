const {ChatOpenAI} = require("langchain/chat_models/openai");

const chatModelProvider = () => {
  return new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
    // ...otherFields,
    configuration: {
      // ...otherFields.configuration,
      baseURL: process.env.OPENAI_API_URL,
    },
  });
};

module.exports = {chatModelProvider};
