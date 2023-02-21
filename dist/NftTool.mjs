(function(){"use strict";try{if(typeof document!="undefined"){var o=document.createElement("style");o.appendChild(document.createTextNode("._wrapper_m6h12_21{margin:1em auto;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;padding:20px 0;gap:30px}._form_m6h12_31{width:100%}._form-param_m6h12_1:not(:last-child){margin-bottom:16px}._form-label_m6h12_1{display:block;font-weight:700;font-size:14px;padding-bottom:6px}._form-input_m6h12_1{width:100%;padding:8px 12px;border-radius:4px;border:1px solid #EFF0F1;background-color:#f8f8f8;font-size:14px;line-height:1.4;outline:none}._form-input_m6h12_1:focus{border-color:#007aff}._form-select_m6h12_1{width:100%;padding:8px 12px;border-radius:4px;border:1px solid #EFF0F1;background-color:#f8f8f8;font-size:14px;line-height:1.4;outline:none;background-repeat:no-repeat;background-position:right 10px bottom 50%;cursor:pointer;appearance:none;-moz-appearance:none;-webkit-appearance:none}._form-select_m6h12_1:focus{border-color:#007aff}._form-button_m6h12_1{text-align:center;padding:8px 12px;border-radius:4px;border:1px solid #EFF0F1;background-color:#fff;font-size:14px;line-height:1.4;color:#333;outline:none}._form-button_m6h12_1:hover{cursor:pointer;background-color:#f0f0f0}._form-button_m6h12_1:active{background-color:#e0e0e0}._form-button_m6h12_1:focus{border-color:#007aff}._card_m6h12_114{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:column;-ms-flex-align:column;align-items:column;padding:40px;width:230px;border-radius:16px;border:1px solid #EFF0F1;-webkit-box-shadow:0px 2px 3px rgba(0,0,0,.03);box-shadow:0 2px 3px #00000008}._media_m6h12_127{border-radius:16px;overflow:hidden;width:100%;background-color:#f0f0f0}._title_m6h12_136{margin-top:20px;font-style:normal;font-weight:700;font-size:16px;line-height:23px;text-align:center}._collection_m6h12_147{margin-top:4px;font-weight:regular;font-size:14px;line-height:22px;text-align:center;color:#707684}")),document.head.appendChild(o)}}catch(e){console.error("vite-plugin-css-injected-by-js",e)}})();
var c = Object.defineProperty;
var p = (a, t, e) => t in a ? c(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[t] = e;
var d = (a, t, e) => (p(a, typeof t != "symbol" ? t + "" : t, e), e);
const f = "_wrapper_m6h12_21", k = "_form_m6h12_31", u = "_card_m6h12_114", w = "_media_m6h12_127", g = "_title_m6h12_136", C = "_collection_m6h12_147", s = {
  wrapper: f,
  form: k,
  "form-param": "_form-param_m6h12_1",
  "form-label": "_form-label_m6h12_1",
  "form-input": "_form-input_m6h12_1",
  "form-select": "_form-select_m6h12_1",
  "form-button": "_form-button_m6h12_1",
  card: u,
  media: w,
  title: g,
  collection: C
}, I = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7 10L11.8586 14.8586C11.9367 14.9367 12.0633 14.9367 12.1414 14.8586L17 10"/></svg>', T = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M11.8197 6.04369C11.8924 5.8925 12.1076 5.8925 12.1803 6.04369L13.9776 9.78496C14.0068 9.84564 14.0645 9.88759 14.1312 9.89657L18.2448 10.4498C18.411 10.4722 18.4776 10.6769 18.3562 10.7927L15.3535 13.6582C15.3048 13.7047 15.2827 13.7726 15.2948 13.8388L16.0398 17.922C16.0699 18.087 15.8957 18.2136 15.7481 18.1339L12 16.1124L8.25192 18.1339C8.10429 18.2136 7.93012 18.087 7.96022 17.922L8.7052 13.8388C8.71728 13.7726 8.69523 13.7047 8.64652 13.6582L5.64378 10.7927C5.52244 10.6769 5.58896 10.4722 5.7552 10.4498L9.86876 9.89657C9.93549 9.88759 9.99322 9.84564 10.0224 9.78496L11.8197 6.04369Z"/></svg>';
class o {
  static make(t, e = "", r = {}) {
    const n = document.createElement(t);
    Array.isArray(e) ? n.classList.add(...e) : e && n.classList.add(e);
    for (const i in r)
      Object.prototype.hasOwnProperty.call(r, i) && (n[i] = r[i]);
    return n;
  }
}
class l {
  constructor({ data: t, config: e, api: r, readOnly: n }) {
    d(this, "api");
    d(this, "readOnly");
    d(this, "data");
    d(this, "config");
    d(this, "nodes");
    this.data = t, this.config = e, this.api = r, this.readOnly = n, this.nodes = {};
  }
  static get toolbox() {
    return {
      icon: T,
      title: "NFT Card"
    };
  }
  static get pasteConfig() {
    return {
      patterns: {
        opensea: l.regexp
      }
    };
  }
  static get isReadOnlySupported() {
    return !0;
  }
  render() {
    return this.nodes.wrapper = o.make("div", s.wrapper), this.nodes.form = o.make("div", s.form), this.nodes.formNetworkWrapper = o.make("div", s["form-param"]), this.nodes.formNetworkLabel = o.make("label", s["form-label"]), this.nodes.formNetworkLabel.innerHTML = this.api.i18n.t("Network"), this.nodes.formNetworkWrapper.appendChild(this.nodes.formNetworkLabel), this.nodes.formNetworkSelect = o.make("select", s["form-select"]), this.nodes.formNetworkSelect.style.backgroundImage = `url(data:image/svg+xml;utf8,${encodeURI(
      I
    )})`, [
      {
        value: "ethereum",
        label: "Ethereum"
      },
      {
        value: "matic",
        label: "Polygon"
      }
    ].forEach((t) => {
      const e = o.make("option");
      e.value = t.value, e.innerHTML = t.label, this.data.network === t.value && (e.selected = !0), this.nodes.formNetworkSelect instanceof HTMLSelectElement && this.nodes.formNetworkSelect.appendChild(e);
    }), this.nodes.formNetworkWrapper.appendChild(this.nodes.formNetworkSelect), this.nodes.formContractAddressWrapper = o.make("div", s["form-param"]), this.nodes.formContractAddressLabel = o.make("label", s["form-label"]), this.nodes.formContractAddressLabel.innerHTML = this.api.i18n.t("Contract Address"), this.nodes.formContractAddressWrapper.appendChild(this.nodes.formContractAddressLabel), this.nodes.formContractAddressInput = o.make("input", s["form-input"]), this.nodes.formContractAddressInput.placeholder = "0x...", this.nodes.formContractAddressWrapper.appendChild(this.nodes.formContractAddressInput), this.nodes.formTokenIdWrapper = o.make("div", s["form-param"]), this.nodes.formTokenIdLabel = o.make("label", s["form-label"]), this.nodes.formTokenIdLabel.innerHTML = this.api.i18n.t("Token ID"), this.nodes.formTokenIdWrapper.appendChild(this.nodes.formTokenIdLabel), this.nodes.formTokenIdInput = o.make("input", s["form-input"]), this.nodes.formTokenIdInput.placeholder = "12345", this.nodes.formTokenIdWrapper.appendChild(this.nodes.formTokenIdInput), this.nodes.formRefetchButton = o.make("div", s["form-button"]), this.nodes.formRefetchButton.innerHTML = this.api.i18n.t("Fetch NFT"), this.nodes.formRefetchButton.addEventListener("click", () => {
      this.fetchNft();
    }), this.nodes.form.appendChild(this.nodes.formNetworkWrapper), this.nodes.form.appendChild(this.nodes.formContractAddressWrapper), this.nodes.form.appendChild(this.nodes.formTokenIdWrapper), this.nodes.form.appendChild(this.nodes.formRefetchButton), this.nodes.card = o.make("div", s.card), this.nodes.media = o.make("div"), this.nodes.title = o.make("div", s.title), this.nodes.collection = o.make("div", s.collection), this.nodes.card.appendChild(this.nodes.media), this.nodes.card.appendChild(this.nodes.title), this.nodes.card.appendChild(this.nodes.collection), this.nodes.wrapper.appendChild(this.nodes.form), this.nodes.wrapper.appendChild(this.nodes.card), this.data.contractAddress && this.data.tokenId && this.loadNftData(this.data), this.nodes.wrapper;
  }
  save() {
    return this.data;
  }
  onPaste(t) {
    try {
      const { data: e } = t.detail, r = e.match(l.regexp);
      if (!r || r.length < 4)
        throw new Error("Invalid NFT link. Use OpenSea link for Ethereum or Polygon network token.");
      const n = {
        network: r[1],
        contractAddress: r[2],
        tokenId: r[3]
      };
      this.loadNftData(n);
    } catch (e) {
      console.error("[NFT Tool] onPaste:", e), e instanceof Error ? this.api.notifier.show({
        message: e.message,
        style: "error"
      }) : this.api.notifier.show({
        message: "Something went wrong",
        style: "error"
      });
    }
  }
  fetchNft() {
    const t = {
      network: "",
      contractAddress: "",
      tokenId: ""
    };
    try {
      if (this.nodes.formNetworkSelect instanceof HTMLSelectElement && this.nodes.formNetworkSelect.value)
        t.network = this.nodes.formNetworkSelect.value;
      else
        throw new Error("Network is not selected");
      if (this.nodes.formContractAddressInput instanceof HTMLInputElement && this.nodes.formContractAddressInput.value)
        t.contractAddress = this.nodes.formContractAddressInput.value;
      else
        throw new Error("Contract address is not set");
      if (this.nodes.formTokenIdInput instanceof HTMLInputElement && this.nodes.formTokenIdInput.value)
        t.tokenId = this.nodes.formTokenIdInput.value;
      else
        throw new Error("Token ID is not set");
    } catch (e) {
      console.error("[NFT Tool] fetchNft:", e), e instanceof Error && this.api.notifier.show({
        message: e.message,
        style: "error"
      });
      return;
    }
    this.loadNftData(t);
  }
  async loadNftData(t) {
    const { network: e, contractAddress: r, tokenId: n } = t;
    if (!this.config.endpoint) {
      this.api.notifier.show({
        message: "Endpoint API does not set in tools config",
        style: "error"
      });
      return;
    }
    try {
      const i = {
        network: e,
        contractAddress: r,
        tokenId: n
      }, m = {
        "Content-Type": "application/json"
      }, h = await (await fetch(this.config.endpoint, {
        method: "POST",
        headers: Object.assign(m, this.config.additionalRequestHeaders),
        body: JSON.stringify(i)
      })).json();
      if (!h.success)
        throw new Error(h.error);
      this.data = h.message, this.fillNftCard();
    } catch (i) {
      console.error("[NFT Tool] loadNftData:", i), i instanceof Error ? this.api.notifier.show({
        message: i.message,
        style: "error"
      }) : this.api.notifier.show({
        message: "Something went wrong",
        style: "error"
      });
    }
  }
  fillNftCard() {
    this.data.media.endsWith("mp4") ? this.nodes.imageElement = o.make("video", s.media, {
      src: this.data.media,
      playsinline: !0,
      muted: !0,
      autoplay: !0,
      loop: !0
    }) : this.nodes.imageElement = o.make("img", s.media, {
      src: this.data.media
    }), this.nodes.media && (this.nodes.media.innerHTML = "", this.nodes.media.appendChild(this.nodes.imageElement)), this.nodes.collection && this.data.collection && (this.nodes.collection.innerText = this.data.collection), this.nodes.title && this.data.title && (this.nodes.title.innerText = this.data.title), this.nodes.formNetworkSelect instanceof HTMLSelectElement && (this.nodes.formNetworkSelect.value = this.data.network), this.nodes.formContractAddressInput instanceof HTMLInputElement && (this.nodes.formContractAddressInput.value = this.data.contractAddress), this.nodes.formTokenIdInput instanceof HTMLInputElement && (this.nodes.formTokenIdInput.value = this.data.tokenId);
  }
  static get regexp() {
    return /^https:\/\/opensea\.io\/assets\/([a-zA-Z]+)\/([A-Za-z0-9]+)\/(([A-Za-z0-9]+))$/i;
  }
}
export {
  l as default
};
