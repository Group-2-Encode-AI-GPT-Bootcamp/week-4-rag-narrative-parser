# RAG-narrative-parser

RAG-narrative-parser is a Next.js application that uses Retrieval-Augmented Generation (RAG) to analyze and extract character information from uploaded text files. It provides a user-friendly interface for uploading books or similar content, extracting character details, and displaying the results in a structured format.

## Features

- File upload for .txt files containing narrative content
- Character extraction using RAG technology
- Display of extracted character information (name, description, personality)
- Presentation of results in a table format
- Integration with a story-telling application for character reuse

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for building web applications
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [LlamaIndex](https://www.llamaindex.ai/) - Data framework for LLM applications
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible UI components (Shadcn/ui)

## Prerequisites

- Node.js (version 14 or later)
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/rag-narrative-parser.git
   cd rag-narrative-parser
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

Make sure to set your OpenAI key: `export OPENAI_API_KEY-="sk-..."`

## Running the Application

To run the development server:

```
npm run dev
```
or
```
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Building for Production

To create a production build:

```
npm run build
```
or
```
yarn build
```

To start the production server:

```
npm start
```
or
```
yarn start
```

## Project Structure

- `/pages` - Next.js pages
- `/components` - React components
- `/styles` - CSS and Tailwind styles
- `/lib` - Utility functions and RAG implementation
- `/public` - Static assets