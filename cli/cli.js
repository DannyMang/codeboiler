#!/usr/bin/env node
import { post } from 'axios';
import { program } from 'commander';
import { prompt as _prompt } from 'inquirer';
import open from 'open';

// Define API Base URL
const API_BASE_URL = 'https://your-api-host.com/api';

// GitHub OAuth login URL (replace with your GitHub OAuth URL)
const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize?client_id=YOUR_CLIENT_ID';

// CLI Commands
program
  .version('1.0.0')
  .description('CLI tool to generate and export projects using CodeBoiler API');

// Login Command
program
  .command('login')
  .description('Log in with GitHub')
  .action(async () => {
    // Open GitHub OAuth login in browser
    await open(GITHUB_OAUTH_URL);
    console.log('Please log in with GitHub. Paste the access token here:');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { token } = await _prompt([
      {
        type: 'input',
        name: 'token',
        message: 'GitHub Access Token:',
      },
    ]);

    // Save the token locally (for demo purposes)
    console.log('GitHub token saved!');
    // You can save the token to a file or env for later use
  });

// Generate Project Command
program
  .command('generate')
  .description('Generate a new project')
  .action(async () => {
    const { prompt } = await _prompt([
      {
        type: 'input',
        name: 'prompt',
        message: 'Describe your project:',
      },
    ]);

    console.log('Generating project...');

    try {
      const response = await post(`${API_BASE_URL}/generateProject`, {
        prompt,
      });
      const { projectData } = response.data;
      console.log('Project generated successfully:', projectData);
    } catch (error) {
      console.error('Error generating project:', error.message);
    }
  });

// Export to GitHub Command
program
  .command('export')
  .description('Export project to GitHub')
  .action(async () => {
    const { projectData } = await _prompt([
      {
        type: 'input',
        name: 'projectData',
        message: 'Enter generated project data:',
      },
    ]);

    const { token } = await _prompt([
      {
        type: 'input',
        name: 'token',
        message: 'GitHub Access Token:',
      },
    ]);

    console.log('Exporting project to GitHub...');

    try {
      const response = await post(`${API_BASE_URL}/exportToGithub`, {
        projectData,
        accessToken: token,
      });
      const { repoUrl } = response.data;
      console.log('Project exported successfully:', repoUrl);
    } catch (error) {
      console.error('Error exporting to GitHub:', error.message);
    }
  });

// Parse CLI Arguments
program.parse(process.argv);
