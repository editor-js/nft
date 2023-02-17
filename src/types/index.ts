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

export interface NftToolServerRequest {
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

export interface NftToolServerResponse {
  /**
   * Response status
   */
  success: boolean;

  /**
   * Response message
   */
  message: NftToolServerResponseData | any;
}

export interface NftToolServerResponseData {
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

  /**
   * The title of the asset
   */
  title: string;

  /**
   * The description of the asset
   */
  collection: string;

  /**
   * The media file of the asset
   */
  media: string;
}