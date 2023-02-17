# NFT Block Tool for Editor.js

This Tool allows you to embed NFTs into your Editor.js editor.

![NFT block tool example](./assets/demo.png)

> 🚀 The development of this tool is sponsored by [Share](https://theshr.xyz) team — a decentralized social network for creators.

## Installation

### API server

You need to run a server that will provide the NFT data. In [example](./server/index.ts) we use [Alchecmy API](https://docs.alchemy.com/reference/api-overview) to get token data.

You can run it with `yarn server`. It will run on port 3000. Create a `.env` file as a copy of `.env.sample` in the root of the project and fill the values.

#### Request and response types

Server request and response types are defined in [src/types/index.ts](./src/types/index.ts) file as `NftToolServerRequest` and `NftToolServerResponse`.

### Tool itself

Use your package manager to install the package `@editorjs/nft`.

```shell
npm install @editorjs/nft

yarn add @editorjs/nft
```

Then import tool to the page with Editor.js.

```js
import NftTool from '@editorjs/nft';

const editor = new EditorJS({
  tools: {
    nft: {
      class: NftTool,
      config: {
        endpoint: 'http://localhost:3000/alchemy',
      }
    },
  },

  // ...
});
```

Check out the [example page](./index.html).

## Configuration

Check the NftToolConfig interface in [src/types/index.ts](./src/types/index.ts) file with types.

You have to define the endpoint of the API server in the config. API server should return the data in the format described in the [Request and response types](#request-and-response-types) section.

## Output Data

Check the NftToolData interface in [src/types/index.ts](./src/types/index.ts) file with types.

## Development

This tool uses [Vite](https://vitejs.dev/) as builder.

`yarn dev` — run development environment with hot reload

`yarn build` — build the tool for production to the `dist` folder

## Links

[Editor.js](https://editorjs.io) • [Create Tool](https://github.com/editor-js/create-tool)