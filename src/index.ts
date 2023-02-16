/**
 * Import styles library
 */
import styles from './styles.module.pcss';

/**
 * Import types
 */
import { NftToolData, NftToolConfig } from './types';
import { API, BlockTool, PasteConfig, PatternPasteEvent } from '@editorjs/editorjs';
import { IconNft } from './icons';
import { IconChevronDown } from '@codexteam/icons';

/**
 * opensea Tool for Editor.js
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
    this.nodes = {
      wrapper: null,

      image: null,
      collection: null,
      title: null,

      refetchButton: null,
    };
  }

  /**
   * Add icon and title to the Toolbox
   */
  static get toolbox() {
    return {
      icon: IconNft,
      title: 'Token Card'
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
  render(): HTMLElement {
    this.nodes.wrapper = document.createElement('div');
    this.nodes.wrapper.classList.add(styles['nft-tool']);

    /** Compose form */
    this.nodes.form = document.createElement('div');
    this.nodes.form.classList.add(styles['nft-tool__form']);

    this.nodes.formNetworkWrapper = document.createElement('div');
    this.nodes.formNetworkWrapper.classList.add(styles['nft-tool__form-param']);

    this.nodes.formNetworkLabel = document.createElement('label');
    this.nodes.formNetworkLabel.classList.add(styles['nft-tool__form-label']);
    this.nodes.formNetworkLabel.innerHTML = 'Network';
    this.nodes.formNetworkWrapper.appendChild(this.nodes.formNetworkLabel);
    this.nodes.formNetworkSelect = document.createElement('select');
    this.nodes.formNetworkSelect.classList.add(styles['nft-tool__form-select']);
    this.nodes.formNetworkSelect.style.backgroundImage = `url(data:image/svg+xml;utf8,${encodeURI(
      IconChevronDown
    )})`;

    [
      { value: 'ethereum', label: 'Ethereum' },
      { value: 'matic', label: 'Polygon' },
    ].forEach((network) => {
      const option = document.createElement('option');

      option.value = network.value;
      option.innerHTML = network.label;

      if (this.data.network === network.value) {
        option.selected = true;
      }

      this.nodes.formNetworkSelect.appendChild(option);
    });
    this.nodes.formNetworkWrapper.appendChild(this.nodes.formNetworkSelect);

    this.nodes.formContractAddress = document.createElement('div');
    this.nodes.formContractAddress.classList.add(styles['nft-tool__form-param']);
    this.nodes.formContractAddressLabel = document.createElement('label');
    this.nodes.formContractAddressLabel.classList.add(styles['nft-tool__form-label']);
    this.nodes.formContractAddressLabel.innerHTML = 'Contract Address';
    this.nodes.formContractAddressInput = document.createElement('input');
    this.nodes.formContractAddressInput.classList.add(styles['nft-tool__form-input']);
    this.nodes.formContractAddressInput.type = 'text';
    this.nodes.formContractAddressInput.placeholder = '0x...';

    this.nodes.formContractAddress.appendChild(this.nodes.formContractAddressLabel);
    this.nodes.formContractAddress.appendChild(this.nodes.formContractAddressInput);

    this.nodes.formTokenId = document.createElement('div');
    this.nodes.formTokenId.classList.add(styles['nft-tool__form-param']);
    this.nodes.formTokenIdLabel = document.createElement('label');
    this.nodes.formTokenIdLabel.classList.add(styles['nft-tool__form-label']);
    this.nodes.formTokenIdLabel.innerHTML = 'Token ID';
    this.nodes.formTokenIdInput = document.createElement('input');
    this.nodes.formTokenIdInput.classList.add(styles['nft-tool__form-input']);
    this.nodes.formTokenIdInput.type = 'text';
    this.nodes.formTokenIdInput.placeholder = '12345';

    this.nodes.formTokenId.appendChild(this.nodes.formTokenIdLabel);
    this.nodes.formTokenId.appendChild(this.nodes.formTokenIdInput);

    this.nodes.formRefetchButton = document.createElement('button');
    this.nodes.formRefetchButton.classList.add(styles['nft-tool__form-button']);
    this.nodes.formRefetchButton.innerHTML = 'Fetch NFT';
    this.nodes.formRefetchButton.addEventListener('click', () => {
      this.fetchNft();
    });

    this.nodes.form.appendChild(this.nodes.formNetworkWrapper);
    this.nodes.form.appendChild(this.nodes.formContractAddress);
    this.nodes.form.appendChild(this.nodes.formTokenId);
    this.nodes.form.appendChild(this.nodes.formRefetchButton);




    /** Compose card */
    this.nodes.card = document.createElement('div');
    this.nodes.card.classList.add(styles['nft-tool__card']);

    this.nodes.image = document.createElement('div');
    this.nodes.image.classList.add(styles['nft-tool__card-image']);

    this.nodes.title = document.createElement('div');
    this.nodes.title.classList.add(styles['nft-tool__card-title']);

    this.nodes.collection = document.createElement('div');
    this.nodes.collection.classList.add(styles['nft-tool__card-collection']);

    this.nodes.card.appendChild(this.nodes.image);
    this.nodes.card.appendChild(this.nodes.title);
    this.nodes.card.appendChild(this.nodes.collection);
    /** */

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
  save(): NftToolData {
    return this.data;
  }

  /**
   * Handle pasted content
   */
  onPaste(event: PatternPasteEvent) {
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
      const tokenData ={
        network: groups[1],
        contractAddress: groups[2],
        tokenId: groups[3],
      };

      /**
       * Load NFT data
       */
      this.loadNftData(tokenData);

    } catch (error: any) {
      this.api.notifier.show({
        message: error.message,
        style: 'error',
      });
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

  private loadNftData(tokenData: {network: string, contractAddress: string, tokenId: string}): void {
    const { network, contractAddress, tokenId } = tokenData;

    if (!this.config.endpoint) {
      this.api.notifier.show({
        message: 'Alchemy endpoint is not set',
        style: 'error',
      });
      return;
    }

    fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        network,
        contractAddress,
        tokenId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) {
          throw new Error(data.message);
        }

        this.data = data.message;
        this.renderNftCard();
      })
      .catch((error) => {
        this.api.notifier.show({
          message: error.message,
          style: 'error',
        });
      });
  }

  /**
   * Regexp for a opensea link
   */
  private static get regexp(): RegExp {
    return /^https:\/\/opensea\.io\/assets\/([a-zA-Z]+)\/([A-Za-z0-9]+)\/(([A-Za-z0-9]+))$/i;
  }

  /**
   * Render NFT card into the wrapper
   */
  private renderNftCard(): void {
    if (this.data.image.endsWith('mp4')) {
      this.nodes.imageElement = document.createElement('video');
      this.nodes.imageElement.setAttribute('playsinline', 'true');
      this.nodes.imageElement.setAttribute('muted', 'true');
      this.nodes.imageElement.setAttribute('autoplay', 'true');
      this.nodes.imageElement.setAttribute('loop', 'true');
    } else {
      this.nodes.imageElement = document.createElement('img');
    }

    this.nodes.imageElement.setAttribute('src', this.data.image);
    this.nodes.imageElement.classList.add(styles['nft-tool__card-image']);

    if (this.nodes.image) {
      this.nodes.image.innerHTML = '';
      this.nodes.image.appendChild(this.nodes.imageElement);
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
};