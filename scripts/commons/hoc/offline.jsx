import store from '../ui/offline/offlineStore';

const Offline = function(Component) {
  return React.createClass({

    getInitialState () {
      return {
        wasOffline: this.state && this.state.isOffline === true ? true : false,
        isOffline: store.isOffline()
      };
    },

    componentWillMount: function() {
      this.listeners = [];
    },

    componentDidMount () {
      this.unsubscribeOfflineStore = store.listen(this.onOfflineChange);
    },

    componentWillUnmount () {
      this.listeners = [];
      if (this.unsubscribeOfflineStore) this.unsubscribeOfflineStore();
    },

    onOfflineChange () {
      const emit = (activated) => {
        this.listeners.forEach(listener => {
          listener(activated);
        });
      }
      var newState = this.getInitialState();
      this.setState(newState);
      emit(newState.isOffline);
    },

    render() {

      const listenToOfflineChange = (listener) => this.listeners.push(listener);

      return React.createElement(
        Component,
        { ...this.props, ...this.state, ...{ listenToOfflineChange } }
      );
    }
  });
};

export default _.curry(Offline);
