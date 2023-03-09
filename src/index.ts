/**
 * Import styles library
 */
import styles from './styles.module.css';

/**
 * Import types
 */
import { NftToolData, NftToolConfig, NftToolServerResponse, NftToolServerResponseData, NftToolServerRequest } from './types';
import { API, BlockTool, PasteConfig, PatternPasteEvent, ToolboxConfig } from '@editorjs/editorjs';
import { IconChevronDown, IconStar } from '@codexteam/icons';
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
   *
   * @param object.data - previously saved data
   * @param object.config - config for Tool
   * @param object.api - Editor.js API
   * @param object.readOnly - read only mode flag
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
  public static get toolbox(): ToolboxConfig {
    return {
      icon: IconStar,
      title: 'NFT Card',
    };
  }

  /**
   * Process pasted content before appending to the Editor
   */
  public static get pasteConfig(): PasteConfig {
    return {
      patterns: {
        opensea: NftTool.regexp,
      },
    };
  }

  /**
   * Notify core that read-only mode is supported
   */
  public static get isReadOnlySupported(): boolean {
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
    this.nodes.formNetworkLabel.innerHTML = this.api.i18n.t('Network');
    this.nodes.formNetworkWrapper.appendChild(this.nodes.formNetworkLabel);

    this.nodes.formNetworkSelect = Dom.make('select', styles['form-select']) as HTMLSelectElement;
    this.nodes.formNetworkSelect.style.backgroundImage = `url(data:image/svg+xml;utf8,${encodeURI(
      IconChevronDown
    )})`;

    [
      {
        value: 'ethereum',
        label: 'Ethereum',
      },
      {
        value: 'matic',
        label: 'Polygon',
      },
    ].forEach((network) => {
      const option = Dom.make('option') as HTMLOptionElement;

      option.value = network.value;
      option.innerHTML = network.label;

      if (this.data.network === network.value) {
        option.selected = true;
      }

      if (this.nodes.formNetworkSelect instanceof HTMLSelectElement) {
        this.nodes.formNetworkSelect.appendChild(option);
      }
    });
    this.nodes.formNetworkWrapper.appendChild(this.nodes.formNetworkSelect);
    this.nodes.formNetworkSelect.addEventListener('change', () => {
      this.fetchNft();
    });

    this.nodes.formContractAddressWrapper = Dom.make('div', styles['form-param']);
    this.nodes.formContractAddressLabel = Dom.make('label', styles['form-label']);
    this.nodes.formContractAddressLabel.innerHTML = this.api.i18n.t('Contract Address');
    this.nodes.formContractAddressWrapper.appendChild(this.nodes.formContractAddressLabel);

    this.nodes.formContractAddressInput = Dom.make('input', styles['form-input']);
    this.nodes.formContractAddressInput.placeholder = '0x...';
    this.nodes.formContractAddressWrapper.appendChild(this.nodes.formContractAddressInput);
    this.nodes.formContractAddressInput.addEventListener('input', () => {
      this.fetchNft();
    });

    this.nodes.formTokenIdWrapper = Dom.make('div', styles['form-param']);
    this.nodes.formTokenIdLabel = Dom.make('label', styles['form-label']);
    this.nodes.formTokenIdLabel.innerHTML = this.api.i18n.t('Token ID');
    this.nodes.formTokenIdWrapper.appendChild(this.nodes.formTokenIdLabel);

    this.nodes.formTokenIdInput = Dom.make('input', styles['form-input']);
    this.nodes.formTokenIdInput.placeholder = '12345';
    this.nodes.formTokenIdWrapper.appendChild(this.nodes.formTokenIdInput);
    this.nodes.formTokenIdInput.addEventListener('input', () => {
      this.fetchNft();
    });


    this.nodes.media = Dom.make('div', styles['media-wrapper']);

    this.nodes.cardInfo = Dom.make('div', styles['card']);
    this.nodes.title = Dom.make('div', styles['title']);
    this.nodes.collection = Dom.make('div', styles['collection']);
    this.nodes.cardInfo.appendChild(this.nodes.title);
    this.nodes.cardInfo.appendChild(this.nodes.collection);

    this.nodes.column = Dom.make('div', styles['column']);
    this.nodes.column.appendChild(this.nodes.cardInfo);
    this.nodes.column.appendChild(this.nodes.formNetworkWrapper);
    this.nodes.column.appendChild(this.nodes.formContractAddressWrapper);
    this.nodes.column.appendChild(this.nodes.formTokenIdWrapper);


    this.nodes.wrapper.appendChild(this.nodes.media);
    this.nodes.wrapper.appendChild(this.nodes.column);

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
   *
   * @param event - paste event
   */
  public onPaste(event: PatternPasteEvent): void {
    try {
      const { data } = event.detail;
      const groups = data.match(NftTool.regexp);

      /**
       * If data is not a valid link, show message and do nothing
       */
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
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

  /**
   * Load NFT data from API
   */
  private fetchNft(): void {
    const tokenData = {
      network: this.nodes.formNetworkSelect instanceof HTMLSelectElement && this.nodes.formNetworkSelect.value || '',
      contractAddress: this.nodes.formContractAddressInput instanceof HTMLInputElement && this.nodes.formContractAddressInput.value || '',
      tokenId: this.nodes.formTokenIdInput instanceof HTMLInputElement && this.nodes.formTokenIdInput.value || '',
    };

    try {
      if (!tokenData.contractAddress && !tokenData.tokenId) {
        throw new Error('Contract address and Token ID are not set');
      }

      if (!tokenData.contractAddress || !tokenData.tokenId) {
        return;
      }
    } catch (error: unknown) {
      console.error('[NFT Tool] fetchNft:', error);

      if (error instanceof Error) {
        this.api.notifier.show({
          message: error.message,
          style: 'error',
        });
      }

      return;
    }

    this.loadNftData(tokenData);
  }

  /**
   * Loads NFT data from the server
   *
   * @param tokenData - token data
   */
  private async loadNftData(tokenData: {network: string, contractAddress: string, tokenId: string}): Promise<void> {
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
      };

      const headers = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      };

      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: Object.assign(headers, this.config.additionalRequestHeaders),
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

      this.clearNftCard();

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

    if (this.nodes.collection && this.data.collection) {
      this.nodes.collection.innerText = this.data.collection;
    }
    if (this.nodes.title && this.data.title) {
      this.nodes.title.innerText = this.data.title;
    }

    if (this.nodes.formNetworkSelect instanceof HTMLSelectElement) {
      this.nodes.formNetworkSelect.value = this.data.network;
    }

    if (this.nodes.formContractAddressInput instanceof HTMLInputElement) {
      this.nodes.formContractAddressInput.value = this.data.contractAddress;
    }

    if (this.nodes.formTokenIdInput instanceof HTMLInputElement) {
      this.nodes.formTokenIdInput.value = this.data.tokenId;
    }
  }

  /**
   * Clear NFT card
   */
  private clearNftCard(): void {
    if (this.nodes.media) {
      this.nodes.media.innerHTML = '';
    }

    if (this.nodes.collection) {
      this.nodes.collection.innerText = '';
    }

    if (this.nodes.title) {
      this.nodes.title.innerText = '';
    }
  }


  /**
   * Regexp for a opensea link
   */
  private static get regexp(): RegExp {
    return /^https:\/\/opensea\.io\/assets\/([a-zA-Z]+)\/([A-Za-z0-9]+)\/(([A-Za-z0-9]+))$/i;
  }
}