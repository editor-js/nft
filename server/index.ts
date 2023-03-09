import { Alchemy, Network } from 'alchemy-sdk';
import { NftToolServerRequest, NftToolServerResponse, NftToolServerResponseData } from '../src/types/index';

import * as dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors());
app.use(express.json());

/**
 * Create endpoint for Alchemy API
 */
app.post('/alchemy', async (req, res) => {
  try {
    const { network, contractAddress, tokenId }: NftToolServerRequest = req.body;

    /**
     * Validate request body
     */
    if (!network) {
      throw new Error('"network" is required');
    }

    if (!contractAddress) {
      throw new Error('"contractAddress" is required');
    }

    if (!tokenId) {
      throw new Error('"tokenId" is required');
    }

    /**
     * Set network name
     */
    let networkName;

    switch (network) {
      case 'ethereum':
        networkName = Network.ETH_MAINNET;
        break;

      case 'matic':
        networkName = Network.MATIC_MAINNET;
        break;

      default:
        throw new Error(`Network "${network}" is not supported yet`);
    }

    /**
     * Initialize Alchemy SDK
     */
    const alchemy = new Alchemy({
      apiKey: process.env.ALCHEMY_API_KEY,
      network: networkName,
    });

    /**
     * Fetch NFT metadata
     */
    const nft = {
      contractAddress: contractAddress as string,
      tokenId: tokenId as string,
    };
    const metadata = await alchemy.nft.getNftMetadata(nft.contractAddress, nft.tokenId);

    /**
     * Prepare response
     */
    const responseToolData: NftToolServerResponseData = {
      network: network,
      contractAddress: nft.contractAddress,
      tokenId: nft.tokenId,
      title: metadata.title,
      collection: metadata.contract.name as string,
      media: metadata.media[0].gateway as string,
    };

    const response: NftToolServerResponse = {
      success: true,
      message: responseToolData,
    };

    res.send(response);
  } catch (error: unknown) {
    console.log(error);

    let errorMessage = 'Unknown error';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    const response: NftToolServerResponse = {
      success: false,
      error: errorMessage,
    };

    res.status(400).send(response);
  }
});

/**
 * Start Express server
 */
app.listen(process.env.PORT || 3000, () => {
  console.log('server started on port 3000');
});

