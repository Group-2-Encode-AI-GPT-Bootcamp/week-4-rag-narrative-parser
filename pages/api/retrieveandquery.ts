import type { NextApiRequest, NextApiResponse } from "next";
import {
  IndexDict,
  OpenAI,
  RetrieverQueryEngine,
  TextNode,
  VectorStoreIndex,
  serviceContextFromDefaults,
} from "llamaindex";

interface Character {
  id: number;
  name: string;
  description: string;
  personality: string;
}

type Input = {
  query: string;
  topK?: number;
  nodesWithEmbedding: {
    text: string;
    embedding: number[];
  }[];
  temperature: number;
  topP: number;
  structuredOutput?: boolean;
};

type Output = {
  error?: string;
  payload?: {
    response: string;
    characters?: Character[];
  };
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Output>
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { query, topK, nodesWithEmbedding, temperature, topP, structuredOutput }: Input =
      req.body;

  const embeddingResults = nodesWithEmbedding.map((config) => {
    return new TextNode({ text: config.text, embedding: config.embedding });
  });
  const indexDict = new IndexDict();
  for (const node of embeddingResults) {
    indexDict.addNode(node);
  }

  const index = await VectorStoreIndex.init({
    indexStruct: indexDict,
    serviceContext: serviceContextFromDefaults({
      llm: new OpenAI({
        model: "gpt-4",
        temperature: temperature,
        topP: topP,
      }),
    }),
  });

  index.vectorStore.add(embeddingResults);
  if (!index.vectorStore.storesText) {
    await index.docStore.addDocuments(embeddingResults, true);
  }
  await index.indexStore?.addIndexStruct(indexDict);
  index.indexStruct = indexDict;

  const retriever = index.asRetriever();
  retriever.similarityTopK = topK ?? 2;

  const queryEngine = new RetrieverQueryEngine(retriever);

  if (structuredOutput) {
    const structuredQuery = `
      Extract all characters from the text. For each character, provide their name, a brief description, and key personality traits.
      Format the output as a JSON array of objects, where each object has the following properties:
      - id: a unique number for each character
      - name: the character's name
      - description: a brief description of the character
      - personality: key personality traits of the character
      
      Example format:
      [
        {
          "id": 1,
          "name": "Character Name",
          "description": "Brief description",
          "personality": "Key personality traits"
        },
        ...
      ]
    `;

    const result = await queryEngine.query(structuredQuery);

    let characters: Character[] = [];
    try {
      characters = JSON.parse(result.response);
    } catch (error) {
      console.error("Failed to parse character data:", error);
      res.status(500).json({ error: "Failed to parse character data" });
      return;
    }

    res.status(200).json({
      payload: {
        response: "Characters extracted successfully",
        characters: characters,
      },
    });
  } else {
    const result = await queryEngine.query(query);
    res.status(200).json({ payload: { response: result.response } });
  }
}