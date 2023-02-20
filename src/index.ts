/**
 * Import styles library
 */
import styles from './styles.module.css';

/**
 * Import types
 */
import { NftToolData, NftToolConfig, NftToolServerResponse, NftToolServerResponseData, NftToolServerRequest } from './types';
import { API, BlockTool, PasteConfig, PatternPasteEvent } from '@editorjs/editorjs';
import { IconNft } from './icons';
import { IconChevronDown } from '@codexteam/icons';
import Dom from './utils/dom';

/**
 * Nft Block Tool for Editor.js
 */
export default class NftTool implements BlockTool {
  /**
   * Code API — public methods to work with Editor
   */
  private readonly api: API;

  /**
   * Read-only mode flag
   */
  private readonly readOnly: boolean;

  /**
   * Tool data for input and output
   */
  private data: NftToolData;

  /**
   * Configuration object that passed through the initial Editor configuration.
   */
  private config: NftToolConfig;

  /**
   * Tool's HTML nodes
   */
  private nodes: {[key: string]: HTMLElement|null};

  /**
   * Class constructor
   */
  constructor({ data, config, api, readOnly }: { data: NftToolData, config: NftToolConfig, api: API, readOnly: boolean }) {
    this.data = data;
    this.config = config;
    this.api = api;
    this.readOnly = readOnly;

    /**
     * Declare Tool's nodes
     */
    this.nodes = {};
  }

  /**
   * Add icon and title to the Toolbox
   */
  static get toolbox() {
    return {
      icon: IconNft,
      title: 'NFT Token Card'
    };
  }

  /**
   * Process pasted content before appending to the Editor
   */
  static get pasteConfig(): PasteConfig {
    return {
      patterns: {
        opensea: NftTool.regexp,
      }
    };
  }

  /**
   * Notify core that read-only mode is supported
   */
  static get isReadOnlySupported(): boolean {
    return true;
  }

  /**
   * Creates UI of a Block
   */
  public render(): HTMLElement {
    this.nodes.wrapper = Dom.make('div', styles['wrapper']);

    /** Compose form */
    this.nodes.form = Dom.make('div', styles['form']);
    this.nodes.formNetworkWrapper = Dom.make('div', styles['form-param']);

    this.nodes.formNetworkLabel = Dom.make('label', styles['form-label']);
    this.nodes.formNetworkLabel.innerHTML = 'Network';
    this.nodes.formNetworkWrapper.appendChild(this.nodes.formNetworkLabel);

    this.nodes.formNetworkSelect = Dom.make('select', styles['form-select']) as HTMLSelectElement;
    this.nodes.formNetworkSelect.style.backgroundImage = `url(data:image/svg+xml;utf8,${encodeURI(
      IconChevronDown
    )})`;

    [
      {
        value: 'ethereum',
        label: 'Ethereum'
      },
      {
        value: 'matic',
        label: 'Polygon'
      },
    ].forEach((network) => {
      const option = Dom.make('option') as HTMLOptionElement;

      option.value = network.value;
      option.innerHTML = network.label;

      if (this.data.network === network.value) {
        option.selected = true;
      }

      this.nodes.formNetworkSelect.appendChild(option);
    });
    this.nodes.formNetworkWrapper.appendChild(this.nodes.formNetworkSelect);

    this.nodes.formContractAddressWrapper = Dom.make('div', styles['form-param']);
    this.nodes.formContractAddressLabel = Dom.make('label', styles['form-label']);
    this.nodes.formContractAddressLabel.innerHTML = 'Contract Address';
    this.nodes.formContractAddressWrapper.appendChild(this.nodes.formContractAddressLabel);

    this.nodes.formContractAddressInput = Dom.make('input', styles['form-input']);
    this.nodes.formContractAddressInput.placeholder = '0x...';
    this.nodes.formContractAddressWrapper.appendChild(this.nodes.formContractAddressInput);

    this.nodes.formTokenIdWrapper = Dom.make('div', styles['form-param']);
    this.nodes.formTokenIdLabel = Dom.make('label', styles['form-label']);
    this.nodes.formTokenIdLabel.innerHTML = 'Token ID';
    this.nodes.formTokenIdWrapper.appendChild(this.nodes.formTokenIdLabel);

    this.nodes.formTokenIdInput = Dom.make('input', styles['form-input']);
    this.nodes.formTokenIdInput.placeholder = '12345';
    this.nodes.formTokenIdWrapper.appendChild(this.nodes.formTokenIdInput);

    this.nodes.formRefetchButton = Dom.make('button', styles['form-button']);
    this.nodes.formRefetchButton.innerHTML = 'Fetch NFT';
    this.nodes.formRefetchButton.addEventListener('click', () => {
      this.fetchNft();
    });

    this.nodes.form.appendChild(this.nodes.formNetworkWrapper);
    this.nodes.form.appendChild(this.nodes.formContractAddressWrapper);
    this.nodes.form.appendChild(this.nodes.formTokenIdWrapper);
    this.nodes.form.appendChild(this.nodes.formRefetchButton);

    /** Compose card */
    this.nodes.card = Dom.make('div', styles['card']);
    this.nodes.media = Dom.make('div');
    this.nodes.title = Dom.make('div', styles['title']);
    this.nodes.collection = Dom.make('div', styles['collection']);

    this.nodes.card.appendChild(this.nodes.media);
    this.nodes.card.appendChild(this.nodes.title);
    this.nodes.card.appendChild(this.nodes.collection);

    this.nodes.wrapper.appendChild(this.nodes.form);
    this.nodes.wrapper.appendChild(this.nodes.card);

    /**
     * If data is passed, render NFT card
     */
    if (this.data.contractAddress && this.data.tokenId) {
      this.loadNftData(this.data);
    }

    return this.nodes.wrapper;
  }

  /**
   * Extracts Block data from the UI
   */
  public save(): NftToolData {
    return this.data;
  }

  /**
   * Handle pasted content
   */
  public onPaste(event: PatternPasteEvent) {
    try {
      const { data } = event.detail;
      const groups = data.match(NftTool.regexp);

      /**
       * If data is not a valid link, show message and do nothing
       */
      if (!groups || groups.length < 4) {
        throw new Error('Invalid NFT link. Use OpenSea link for Ethereum or Polygon network token.');
      }

      /**
       * Prepare token data from regexp groups
       */
      const tokenData = {
        network: groups[1],
        contractAddress: groups[2],
        tokenId: groups[3],
      };

      /**
       * Load NFT data
       */
      this.loadNftData(tokenData);

    } catch (error: unknown) {
      console.error('[NFT Tool] onPaste:', error);

      if (error instanceof Error) {
        this.api.notifier.show({
          message: error.message,
          style: 'error',
        });
      } else {
        this.api.notifier.show({
          message: 'Something went wrong',
          style: 'error',
        });
      }
    }
  }

  private fetchNft() {
    const network = this.nodes.formNetworkSelect.value;
    const contractAddress = this.nodes.formContractAddressInput.value;
    const tokenId = this.nodes.formTokenIdInput.value;

    const tokenData = {
      network,
      contractAddress,
      tokenId,
    };

    this.loadNftData(tokenData);
  }

  private async loadNftData(tokenData: {network: string, contractAddress: string, tokenId: string}): void {
    const { network, contractAddress, tokenId } = tokenData;

    if (!this.config.endpoint) {
      this.api.notifier.show({
        message: 'Endpoint API does not set in tools config',
        style: 'error',
      });
      return;
    }

    try {
      const requestData: NftToolServerRequest = {
        network,
        contractAddress,
        tokenId,
      }

      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json() as NftToolServerResponse;

      if (!data.success) {
        throw new Error(data.error);
      }

      this.data = data.message as NftToolServerResponseData;
      this.fillNftCard();

    } catch (error: unknown) {
      console.error('[NFT Tool] loadNftData:', error);

      if (error instanceof Error) {
        this.api.notifier.show({
          message: error.message,
          style: 'error',
        });
      } else {
        this.api.notifier.show({
          message: 'Something went wrong',
          style: 'error',
        });
      }
    }
  }

  /**
   * Fill NFT card with data
   */
  private fillNftCard(): void {
    /**
     * If media is a video, use video tag
     */
    if (this.data.media.endsWith('mp4')) {
      this.nodes.imageElement = Dom.make('video', styles['media'], {
        src: this.data.media,
        playsinline: true,
        muted: true,
        autoplay: true,
        loop: true,
      });
    } else {
      this.nodes.imageElement = Dom.make('img', styles['media'], {
        src: this.data.media,
      });
    }

    if (this.nodes.media) {
      this.nodes.media.innerHTML = '';
      this.nodes.media.appendChild(this.nodes.imageElement);
    }

    if (this.nodes.collection) this.nodes.collection.innerText = this.data.collection;
    if (this.nodes.title) this.nodes.title.innerText = this.data.title;

    if (this.nodes.formNetworkSelect) {
      this.nodes.formNetworkSelect.value = this.data.network;
    }

    if (this.nodes.formContractAddressInput) {
      this.nodes.formContractAddressInput.value = this.data.contractAddress;
    }

    if (this.nodes.formTokenIdInput) {
      this.nodes.formTokenIdInput.value = this.data.tokenId;
    }
  }

  /**
   * Regexp for a opensea link
   */
  private static get regexp(): RegExp {
    return /^https:\/\/opensea\.io\/assets\/([a-zA-Z]+)\/([A-Za-z0-9]+)\/(([A-Za-z0-9]+))$/i;
  }
};