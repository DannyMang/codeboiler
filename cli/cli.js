#!/usr/bin/env node --env-file=.env --no-warnings

import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';
import inquirer from 'inquirer';

const GITHUB_API_BASE = 'https://api.github.com';

async function readDirectoryFiles(dirPath) {
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

// Helper to combine base files with AI-generated files
function combineFiles(baseFiles, generatedFiles) {
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

async function generateProjectFiles(prompt) {
  // Call AI API to generate files
  const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.CLAUDE_API_KEY || '',
      'anthropic-version': "2023-06-01"
    },
    body: JSON.stringify({
      messages: [
        {"role": "user", "content": `Generate code for a React project based on: ${prompt}. 
        You can modify "package.json" to include any necessary dependencies and "index.ts" for the main entry point. 
        Return a valid JSON object like this, without any text before or after the object: [ { "dir": "src/components/ComponentName.js", "content": "import React...component code" }, 
        { "dir": "package.json", "content": "updated package.json" } ]`}
      ],
      model: 'claude-3-opus-20240229',
      max_tokens: 4096
    })
  });

  const generatedFiles = await aiResponse.json();
  
  // Extract the text content
  const responseText = generatedFiles.content[0].text;

  // Find the start and end indices of the JSON array
  const startIdx = responseText.indexOf('[');
  const endIdx = responseText.lastIndexOf(']') + 1;

  // Extract the JSON string
  let jsonString = responseText.slice(startIdx, endIdx);

  const jsonObject = JSON.parse(jsonString);

  // Read base template files
  const basePath = path.join(process.cwd(), 'public/basic-react-template');
  const baseFiles = await readDirectoryFiles(basePath);

  // Combine base files with AI-generated files (overwriting base with generated if applicable)
  const finalFiles = combineFiles(baseFiles, jsonObject);

  return finalFiles;
}

async function createGithubRepo(accessToken, repoName, projectFiles) {
  // Step 1: Create a new GitHub repository
  const repoResponse = await fetch(`${GITHUB_API_BASE}/user/repos`, {
    method: 'POST',
    headers: {
      Authorization: `token ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: repoName,
      private: false, // Change to true for private repos
      auto_init: false, // We'll upload our own files
    }),
  });

  const repoJson = await repoResponse.json();
  if (!repoResponse.ok) {
    throw new Error(`GitHub API error: ${repoJson.message}`);
  }

  const repoUrl = repoJson.html_url;
  const repoFullName = repoJson.full_name;

  // Step 2: Upload files to the newly created repository
  for (const file of projectFiles) {
    await uploadFileToGithubRepo(accessToken, repoFullName, file.dir, file.content);
  }

  // Step 3: Return the repository URL
  return repoUrl;
}

async function uploadFileToGithubRepo(accessToken, repoName, filePath, fileContent) {
  const contentBase64 = Buffer.from(fileContent).toString('base64');
  const response = await fetch(`${GITHUB_API_BASE}/repos/${repoName}/contents/${filePath}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Add ${filePath}`,
      content: contentBase64,
    }),
  });

  if (!response.ok) {
    const errorJson = await response.json();
    throw new Error(`GitHub upload error for ${filePath}: ${errorJson.message}`);
  }
}

async function main() {
  // Prompt for GitHub access token
  const { accessToken } = await inquirer.prompt([
    {
      type: 'input',
      name: 'accessToken',
      message: 'Enter your GitHub personal access token:',
      validate: (input) => input.length > 0 || 'Access token cannot be empty',
    },
  ]);

  // Prompt for repository name
  const { repoName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'repoName',
      message: 'Enter the repository name:',
      validate: (input) => input.length > 0 || 'Repository name cannot be empty',
    },
  ]);

  // Prompt for project description
  const { prompt } = await inquirer.prompt([
    {
      type: 'input',
      name: 'prompt',
      message: 'Describe your project (e.g., "I want to create an e-commerce app"):',
      validate: (input) => input.length > 0 || 'Prompt cannot be empty',
    },
  ]);

  // Generate project files using the AI API
  let projectFiles;
  try {
    projectFiles = await generateProjectFiles(prompt);
    console.log('Generated project files. Uploading to Github...');
  } catch (error) {
    console.log(error);
    console.error(`Failed to generate project files: ${error.message}`);
    return;
  }

  // Create GitHub repository and upload files
  try {
    const repoUrl = await createGithubRepo(accessToken, repoName, projectFiles);
    console.log(`Repository created at: ${repoUrl}`);
  } catch (error) {
    console.error(`Failed to create repo: ${error.message}`);
  }
}

main();
