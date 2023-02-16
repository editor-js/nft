import { BlockToolData, ToolConfig } from '@editorjs/editorjs';

/**
 * NftTool's input and output data format
 */
export interface NftToolData extends BlockToolData {
  /**
   * Network name
   */
  network: string;

  /**
   * The token's contract address
   */
  contractAddress: string;

  /**
   * The token Id of the asset.
   */
  tokenId: string;
}

/**
 * NftTool's configuration object that passed through the initial Editor config
 */
export interface NftToolConfig extends ToolConfig {
  /**
   * API endpoint to fetch NFT data
   */
  endpoint: string;
}