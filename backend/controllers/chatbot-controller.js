const {HNSWLib} = require("@langchain/community/vectorstores/hnswlib");
const {RecursiveCharacterTextSplitter} = require("langchain/text_splitter");
const {formatDocumentsAsString} = require("langchain/util/document");

const {StringOutputParser} = require("@langchain/core/output_parsers");
const {
  RunnableSequence,
  // RunnableWithMessageHistory
} = require("@langchain/core/runnables");
// const {BaseMessage, HumanMessage, AIMessage} = require('@langchain/core/messages');

const fs = require("fs");
const pdf = require("pdf-parse");

const {chatModelProvider, chatEmbeddingProvider} = require("../models/bot");
const User = require("../models/Users");
const {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  // MessagesPlaceholder
} = require("@langchain/core/prompts");
// const {ConversationChain} = require("langchain/chains");
// const {ConversationSummaryBufferMemory} = require("langchain/memory");
// const {ChatMessageHistory} = require("langchain/stores/message/in_memory");

exports.query = async (req, res) => {
  const {patientId, userQuery} = req.body;

  try {
    const patient = await User.findById(patientId);

    if (!patient || patient.isDoctor) {
      return res.status(404).json({error: 'Patient not found'});
    }

    const diagnoses = (await patient.populate('diagnoses')).diagnoses;
    const diagnosisTexts = [];

    for (const diagnosis of diagnoses) {
      try {
        const filePath = diagnosis.fileData.toString();
        const fileBuffer = fs.readFileSync(filePath);
        const fileContents = await pdf(fileBuffer);
        diagnosisTexts.push(fileContents.text);
        // console.log(fileContents.text);
      } catch (err) {
        console.error(`Error reading file ${diagnosis.fileName}: ${err}`);
      }
    }

    const textSplitter = new RecursiveCharacterTextSplitter({chunkSize: 1000});
    const docs = await textSplitter.createDocuments(diagnosisTexts);

    const model = chatModelProvider();
    const embeddings = chatEmbeddingProvider();
    const vectorStore = await HNSWLib.fromDocuments(docs, embeddings);
    const vectorStoreRetriever = vectorStore.asRetriever();

    // Define a function to format the chat history
    // const formatChatHistory = (history) => {
    //   return history.map((message, index) => {
    //     if (index % 2 === 0) {
    //       return new HumanMessage({content: message, additional_kwargs: {}});
    //     } else {
    //       return new AIMessage({content: message, additional_kwargs: {}});
    //     }
    //   });
    // };

    // Create a system & human prompt for the chat model
    const SYSTEM_TEMPLATE = `You are a helpful medical AI chatbot. Use the following pieces of context to answer the users question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------------
{context}`;

    const messages = [
      SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
      // new MessagesPlaceholder('chat_history'),
      HumanMessagePromptTemplate.fromTemplate("{question}"),
    ];

    const prompt = ChatPromptTemplate.fromMessages(messages);

    // const chatHistory = new ChatMessageHistory();

    const chain = RunnableSequence.from([
      {
        sourceDocuments: RunnableSequence.from([
          (input) => input.question,
          vectorStoreRetriever,
        ]),
        question: (input) => input.question,
        // chat_history: (input) => input.chat_history || [],
      },
      {
        sourceDocuments: (previousStepResult) => previousStepResult.sourceDocuments,
        question: (previousStepResult) => previousStepResult.question,
        // chat_history: (previousStepResult) => previousStepResult.chat_history,
        context: (previousStepResult) =>
          formatDocumentsAsString(previousStepResult.sourceDocuments),
      },
      {
        result: (previousStepResult) => prompt.pipe(model).pipe(new StringOutputParser()),
        sourceDocuments: (previousStepResult) => previousStepResult.sourceDocuments,
        // chat_history: (previousStepResult) => previousStepResult.chat_history,
      },
    ]);


    // const chatPromptMemory = new ConversationSummaryBufferMemory({
    //   llm: model,
    //   maxTokenLimit: 10,
    //   returnMessages: true,
    //   chatHistory: chatHistory,
    // });

    // const chatPrompt = ChatPromptTemplate.fromMessages([
    //   SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
    //   new MessagesPlaceholder("chat_history"),
    //   HumanMessagePromptTemplate.fromTemplate("{input}"),
    // ]);
    //
    // const chain = new chatPrompt.pipe(model, { chat_history: [] });


    // const chainWithHistory = new RunnableWithMessageHistory({
    //   runnable: chain,
    //   getMessageHistory: (_sessionId) => chatHistory,
    //   inputMessagesKey: "question",
    //   historyMessagesKey: "chat_history",
    // })

    // const result = await chainWithHistory.invoke({
    //     input: userQuery,
    //   },
    //   { configurable: { sessionId: "unused" } });

    // const result = await chain.invoke({ question: userQuery, chat_history: chatHistory });
    //
    // // console.log(JSON.stringify(result, null, 2));
    // console.log(result);
    //
    // await chatHistory.addMessage(
    //   new HumanMessage({content: userQuery})
    // );
    //
    // await chatHistory.addMessage(
    //   new AIMessage({content: result.result})
    // );

    // const chain = RunnableSequence.from([
    //   {
    //     sourceDocuments: RunnableSequence.from([
    //       (input) => input.question,
    //       vectorStoreRetriever,
    //     ]),
    //     question: (input) => input.question,
    //     chat_history: (input) => input.chat_history || [], // Pass the chat_history from input
    //   },
    //   {
    //     sourceDocuments: (previousStepResult) => previousStepResult.sourceDocuments,
    //     question: (previousStepResult) => previousStepResult.question,
    //     chat_history: (previousStepResult) => previousStepResult.chat_history, // Use the chat_history from previous step
    //     context: (previousStepResult) =>
    //       formatDocumentsAsString(previousStepResult.sourceDocuments),
    //   },
    //   {
    //     result: (previousStepResult) => {
    //       // Create the prompt with chat_history
    //       const chatHistoryString = (previousStepResult.chat_history || [])
    //         .map((message) => `${message.role}: ${message.content}`)
    //         .join('\n');
    //       const promptWithHistory = `${chatHistoryString}\nHuman: ${previousStepResult.question}\nAssistant:`;
    //
    //       return prompt.pipe(model, {prompt: promptWithHistory}).pipe(new StringOutputParser());
    //     },
    //     sourceDocuments: (previousStepResult) => previousStepResult.sourceDocuments,
    //     chat_history: (previousStepResult) => previousStepResult.chat_history, // Use the chat_history from previous step
    //   },
    // ]);

    const result = await chain.invoke({question: userQuery});

// console.log(JSON.stringify(result, null, 2));
    console.log(result);

    // await chatHistory.addMessage(new HumanMessage({content: userQuery}));

    // await chatHistory.addMessage(new AIMessage({content: result.result}));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal server error'});
  }
}
