declare global {
  interface String {
    formatUrl(): string;
  }
}

if (!String.prototype.formatUrl) {
  Object.defineProperty(String.prototype, 'formatUrl', {
    value: function() {
      return this.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '');
    },
    enumerable: false
  });
}

export {};
