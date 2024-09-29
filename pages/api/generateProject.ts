import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt } = req.body;

  // Call AI API to generate files
  const aiResponse = await fetch('https://api.anthropic.com/v1/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.CLAUDE_API_KEY || ''
    },
    body: JSON.stringify({
      prompt,
      model: 'claude-v1',
      max_tokens_to_sample: 1000
    })
  });
  
  const generatedFiles = await aiResponse.json();

  // Read base template files
  const basePath = path.join(process.cwd(), 'public/basic-react-template');
  const baseFiles = await readDirectoryFiles(basePath);

  // Combine base files with AI-generated files
  const finalFiles = [...baseFiles, ...generatedFiles];

  res.status(200).json(finalFiles);
}

async function readDirectoryFiles(dirPath: string): Promise<{ dir: string, content: string }[]> {
  const files = [];
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
