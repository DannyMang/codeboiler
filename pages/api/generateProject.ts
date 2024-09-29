// pages/api/generateProject.ts

import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import Cors from 'cors';

const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'],
  origin: '*', // Allow all origins (You can restrict this later)
});

interface FileData {
  dir: string;
  content: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const session = await getSession({ req });
  // if (!session) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }


  // Helper function to run middleware
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
    return new Promise((resolve, reject) => {
      fn(req, res, (result: unknown) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
  }

  // Run the CORS middleware
  await runMiddleware(req, res, cors);

  const { prompt } = req.body;
  // Call AI API to generate files
  const aiResponse = await fetch('https://api.anthropic.com/v1/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.CLAUDE_API_KEY || ''
    },
    body: JSON.stringify({
      prompt: `Generate code for a React project based on: ${prompt}. 
      You can modify "package.json" to include any necessary dependencies and "index.ts" for the main entry point. 
      Return a JSON response like this: [ { "dir": "src/components/ComponentName.js", "content": "import React...component code" }, { "dir": "package.json", "content": "updated package.json" } ]`,
      model: 'claude-v1',
      max_tokens_to_sample: 1000
    })
  });
  const generatedFiles: FileData[] = await aiResponse.json();
  console.log(generatedFiles);

  // Read base template files
  const basePath = path.join(process.cwd(), 'public/basic-react-template');
  const baseFiles = await readDirectoryFiles(basePath);

  // Combine base files with AI-generated files (overwriting base with generated if applicable)
  const finalFiles = combineFiles(baseFiles, generatedFiles);

  res.status(200).json(finalFiles);
}

// Helper functions (readDirectoryFiles and combineFiles) remain the same

async function readDirectoryFiles(dirPath: string): Promise<FileData[]> {
  const files: FileData[] = [];
  const filesInDir = fs.readdirSync(dirPath);

  for (const file of filesInDir) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      files.push(...await readDirectoryFiles(filePath));  // Recursively get files from subdirectories
    } else {
      const content = fs.readFileSync(filePath, 'utf8');
      files.push({
        dir: filePath.replace(process.cwd() + '/public/basic-react-template/', ''),
        content
      });
    }
  }

  return files;
}

// Helper to combine base files with AI-generated files
function combineFiles(baseFiles: FileData[], generatedFiles: FileData[]): FileData[] {
  const finalFiles = [...baseFiles];
  
  for (const generatedFile of generatedFiles) {
    const existingFileIndex = finalFiles.findIndex(file => file.dir === generatedFile.dir);
    
    if (existingFileIndex !== -1) {
      // Replace the base file with the AI-generated file if it already exists
      finalFiles[existingFileIndex] = generatedFile;
    } else {
      // Otherwise, just add the new AI-generated file
      finalFiles.push(generatedFile);
    }
  }
  
  return finalFiles;
}