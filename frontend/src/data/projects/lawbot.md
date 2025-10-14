# Building a Legal Aid AI Chatbot for Jamaicans

Legal assistance is expensive, even for the most basic questions. Many people can't afford to consult a lawyer, leaving them without access to essential legal knowledge. At the same time, large language models (LLMs) have revolutionized how people interact with and search for information, offering conversational and intuitive ways to find answers. However, LLMs have a significant drawback: they can **hallucinate**, providing incorrect or fabricated information. This makes them unreliable for domains like the law, where accuracy is critical.

Inspired by systems like Perplexity and Google's Generative Search, which ground LLM outputs in factual data, we set out to create an AI chatbot for Jamaicans. This bot would allow users to ask legal questions about Jamaican law and receive accurate, reliable answers. By deploying the bot on WhatsApp, we aimed to make it easily accessible to anyone with a smartphone. In this post, we'll share how we built the bot, the challenges we faced, and the considerations we had to make during development.

## Data

One of the first hurdles we encountered was the lack of a central repository for Jamaican laws in a structured, accessible format. Most legal documents were available only as scanned images on the Ministry of Justice's website. To make this information usable, we needed to convert unstructured image data into structured text.

For text extraction, we used **Optical Character Recognition (OCR)**, a technology designed to extract text from images. However, the process wasn't straightforward. The scanned legal documents varied significantly in image quality and resolution. Handwritten annotations and stamps often interfered with text recognition, while degraded or damaged documents led to incomplete extractions. Additionally, the mixed-use of British and local legal terminology caused inconsistencies in spelling and word usage across documents. These linguistic variations needed to be accounted for during text processing.

To ensure high-quality data, we used a combination of human effort and machine learning. Human labelers manually annotated text of interest in about 10% of our dataset (1,000 images). We then trained an **object detection model** on this labeled data to identify relevant sections in the remaining images. Once labeled, the text was extracted using OCR and formatted into a structured format.

## LLMs, RAG and System Architecture

To provide relevant and grounded answers, we employed **Retrieval-Augmented Generation (RAG)**. RAG combines the power of LLMs with a retrieval mechanism that grounds their outputs in real data. In this setup, the legal data we structured was stored in a vector database. When a user asked a question, the system retrieved the most relevant documents from the database and provided them as context to the LLM, ensuring accurate responses.

We evaluated several vector database options, including Weaviate, Pinecone, and LanceDB, and ultimately chose **Pinecone** for its ease of use and performance. Concurrently, we tested different LLMs, including open-source models like Llama 3. In the end, we selected **GPT-4o**, served through Azure's API, due to its performance and multimodal capabilities. While our bot currently only accepts text input, using GPT-4o positions us to potentially accept image inputs in the future.

Once the RAG setup was finalized, we focused on deployment. In Jamaica, WhatsApp is the most widely used communication platform, making it the obvious choice for the chatbot's frontend interface. Using a serverless backend and the **Twilio API**, we connected our bot to WhatsApp, allowing users to chat with it seamlessly. However, the serverless architecture introduced a slight delay: if the bot had been idle for a while, the first response could take 1–2 minutes to generate. Despite this, the system was functional and ready for real-world use.

## Validation

In a bot that advises about the law, correctness is paramount so we enlisted a lawyer to validate the quality of the bot's outputs. This step was critical to ensure the system provided correct and reliable answers. Continuous validation with legal professionals remains necessary to maintain the system's quality and adapt to any updates in the law.

## Considerations and Future Work

Jamaican Patois, a language distinct from Standard English, posed a potential challenge. We were initially concerned about the bot's ability to understand Patois queries. Surprisingly, GPT-4o performed well with Patois text but unsurprisingly struggled with Patois audio. This limitation has led us to explore developing a speech recognition system that natively understands Jamaican Patois and reliably converts it to text.

In addition to audio capabilities, we aim to enhance the bot's functionality by incorporating image understanding. This would allow users to upload photos of legal documents or forms and receive assistance, making the system even more versatile and user-friendly.

## Conclusion

Building a WhatsApp-based legal aid chatbot for Jamaican law was a complex yet rewarding endeavor. From dealing with unstructured legal data to ensuring accuracy and accessibility, the project presented significant challenges across technical, legal, and practical domains. Success required a careful balance of OCR accuracy, language processing, legal validity, and user experience. Moving forward, continuous monitoring and improvement will be essential to maintain the bot's quality and expand its capabilities. Through building this, we hope to have taken a significant step toward democratizing access to legal information in Jamaica.

---

**Project Repository:** [WhatsApp-Law-Bot-Azure-Models](https://github.com/J-A-I-A/WhatsApp-Law-Bot-Azure-Models)

### Key Technologies

- **Azure GPT-4o** - Large language model
- **Pinecone** - Vector database for document retrieval
- **Twilio API** - WhatsApp integration
- **OCR** - Text extraction from legal documents
- **RAG (Retrieval-Augmented Generation)** - Grounded response generation
- **Azure Functions** - Serverless backend deployment

