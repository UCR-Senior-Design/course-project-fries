# MedShare Web App

## Team Fries
- [Megan Chan](https://github/mgnChn)
- [Dave Quichocho](https://github/quichochodd)
- [Jenny Quan](https://github/jquan026)
- [Jingbo Su](https://github/sujingbo0217)

## Instructions for running on your computer

#### On team github repo
- Click the green ‘<> Code’ button
- Download ZIP then unzip.

#### In terminal
- `cd` into the project folder
- run `code .`

#### In VSCode
- run `npm install`
- `cd` into 'frontend'
- Run `npm start`

#### Open a different terminal while keeping the previous open
- `cd` into backend
- Run `npm start`

#### Web app is running
- If a web browser has not openned directly to the app, go to [http://localhost:3000](https://localhost:3000)

## Dependencies
- [“React – A JavaScript Library for Building User Interfaces.” React, Facebook](https://reactjs.org/)
- [“4.x API.” Express, StrongLoop](https://expressjs.com/en/4x/api.html)
- [“Node.js Documentation.” Open JS Foundation, OpenJS Foundation](https://nodejs.org/en/docs/) 
- [“Node.js MongoDB Driver API.”](https://mongodb.github.io/node-mongodb-native/3.6/api/)
- [MongoDB](https://www.mongodb.com/)
- [OpenAPI](https://swagger.io/specification/)
- [LLaMA](https://github.com/facebookresearch/llama/tree/main)
- [Supervised Fine Tuning (SFT)](https://huggingface.co/docs/trl/main/en/sft_trainer)
- [Parameter-Efficient Fine-Tuning (PEFT)](https://huggingface.co/docs/peft/index)
- [Clinical domain datasets](https://clinical-nlp.github.io/2023/resources.html)

## About Medshare

#### Problem to solve
Currently, communication between doctors and patients is very inefficient regarding follow-up questions to appointments and after-care tasks. Communication relies on emails or phone calls, which may involve long waits due to the limited number of doctors who have to work. This results in delayed medical care and confusion about treatments and diagnosis.

#### Goal of MedShare
The goal of this project is to create a medical management system for patients to gain a greater understanding of their healthcare and take action on the next steps quickly. Patients will be able to view their post-visit summaries online and see explanations of medical terms found in the post-visit summaries. Additionally, we decided to integrate the large language models (LLMs) to our project. By fine-tuning the model, patients will be able to ask the LLM-based chatbot questions related to their diagnosis and other notes mentioned in their post-visit summaries. Scheduling follow-up appointments or calls/messages with the live doctor will also be automated.

#### Why is it important?
Currently, communication between doctors and patients is very slow regarding follow-up questions to appointments and after-care tasks. Communication relies on emails or phone calls, which may take a long time since doctors’ time is limited. With this project, we hope to reduce delays in medical care and confusion about treatments and diagnosis. With an AI chatbot to answer patients’ follow-up questions, the time doctors take to answer emails and return calls will be freed so that they can fit more live appointments into their schedules. Additionally, patients do not have to wait to communicate important developments in their health and can become more informed about their treatments and diagnosis. This will help them make more informed decisions about their healthcare. 
