const StorageManager = {
  PREDICTIONS_KEY: 'ucl_predictions',
  STORAGE_VERSION: '1.0',

  initializeStorage() {
    if (!localStorage.getItem(this.PREDICTIONS_KEY)) {
      localStorage.setItem(this.PREDICTIONS_KEY, JSON.stringify({
        version: this.STORAGE_VERSION,
        predictions: {},
        lastUpdate: new Date().toISOString()
      }));
    }
  },

  getPredictions() {
    return JSON.parse(localStorage.getItem(this.PREDICTIONS_KEY));
  }
};

export default StorageManager;
