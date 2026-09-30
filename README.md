# WinCC OA IEC Address MCP Server

An MCP (Model Context Protocol) server for retrieving IEC address configuration and related information from WinCC OA projects.

This server allows an MCP-compatible AI client, such as Claude, to query WinCC OA project information through MCP tools.

## Features

* Retrieve IEC address configuration
* Search for DP, DPT and DPE information
* Retrieve detailed DPE configuration
* Access IEC address information associated with DPEs
* Query WinCC OA configuration using natural-language prompts
* MCP tool-based interaction with WinCC OA project data
* Supports MCP-compatible clients

## Example

A user can ask:

```text
Give me the IEC address configuration details for <DPE_NAME>
```

The MCP server can return information such as:

```text
DP
DPT
DPE
IEC Address
Data Type
Address Type
Direction
Unit
Description
Configuration details
```

The exact information returned depends on the available WinCC OA project configuration and the tools enabled in the server.

## Project Structure

```text
winccoa-iec-address-mcpserver/
│
├── config/
├── docs/
├── fields/
├── helpers/
├── src/
├── tests/
├── tools/
├── types/
├── utils/
│
├── .env.example
├── .gitignore
├── .npmignore
├── QUICKSTART.md
├── build.mjs
├── demo-project-instructions.md
├── gen-oss.mjs
├── package.json
├── package-lock.json
├── postinstall.cjs
├── systemprompt.md
├── tsconfig.json
├── vitest.config.ts
└── zip.mjs
```

## Requirements

Before using the server, make sure the following are installed:

* Node.js
* npm
* A supported MCP-compatible client
* WinCC OA project/environment required by the server

Check Node.js:

```bash
node --version
```

Check npm:

```bash
npm --version
```

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

Enter the project directory:

```bash
cd YOUR_REPOSITORY
```

Install dependencies:

```bash
npm install
```

## Configuration

Create your environment configuration from the example file.

Copy:

```text
.env.example
```

to:

```text
.env
```

Then configure the required values for your environment.

Do not commit `.env` to GitHub if it contains passwords, tokens, credentials, or other private information.

## Running the MCP Server

Use the commands defined in `package.json`.

For example:

```bash
npm run build
```

and then start the appropriate MCP server entry point configured by the project.

Refer to:

```text
QUICKSTART.md
```

for project-specific setup and usage instructions.

## MCP Usage

After configuring the MCP server in your MCP-compatible client, you can use natural-language requests such as:

```text
Give me the IEC address configuration details for Pump_01.State
```

or:

```text
Find the DPE information for Pump_01.State
```

The MCP server processes the request and uses the available tools to retrieve the relevant WinCC OA information.

## Documentation

Additional documentation is available in:

```text
docs/
```

Quick-start instructions:

```text
QUICKSTART.md
```

Tool-related documentation:

```text
tools/
```

## Development

Install the project dependencies:

```bash
npm install
```

Run the project's build process:

```bash
npm run build
```

Run tests using the configured test command in `package.json`.

## Security

Never commit sensitive information such as:

* Passwords
* API keys
* Access tokens
* Private credentials
* Production secrets
* Private WinCC OA configuration containing sensitive information

Use `.env` for local secrets and keep it excluded from Git.

## License

This project is distributed under the license included in the `LICENSE` file.

## Disclaimer

This project is intended for development, testing, and integration with WinCC OA environments. Make sure that its use complies with the configuration, licensing, security, and operational requirements of your WinCC OA installation.
