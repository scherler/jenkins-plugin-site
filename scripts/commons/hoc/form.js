import _ from 'lodash';
import React from 'react';

/**
 * Add card properties to your component.
 */
const FormState = function (Component) {
  return React.createClass({

    getInitialState: function () {
      return {
        formState: ''
      };
    },

    bindFormState: function (onSuccess, onError, options) {
      if (typeof onSuccess === 'object') {
        options = onSuccess;
        onSuccess = function () {};
        onError = function () {};
      }
      if (typeof onError === 'object') {
        options = onError;
        onError = function () {};
      }

      this.setFormStateDirty();

      if (options && options.type === 'rest') {
        return (data) => {
          this.handleRestCall.call(this, null, data, onSuccess, onError);
        };
      }

      return (evt) => {
        this.handleDomainEvent.call(this, evt, onSuccess, onError);
      };
    },

    handleDomainEvent: function (event, onSuccess, onError) {
      if (event.name !== 'commandRejected') {
        let userCallback;
        if (onSuccess) { userCallback = onSuccess(event); }

        if (this.isMounted()) { this.setFormStateSuccess(userCallback); }
      } else {
        if (this.isMounted()) { this.setFormStateError(event.payload.reason.message); }

        if (onError) { onError(event); }
      }
    },

    handleRestCall: function (err, data, onSuccess, onError) {
      if (!err) {
        let userCallback;
        if (onSuccess) { userCallback = onSuccess(data); }

        if (this.isMounted()) { this.setFormStateSuccess(userCallback); }
      } else {
        if (this.isMounted()) { this.setFormStateError(err); }

        if (onError) { onError(err); }
      }
    },

    setFormStateDirty: function (cb) {
      this.setState({ formState: 'dirty' }, cb);
    },

    setFormStateError: function (msg) {
      if (typeof msg === 'function') {
        msg = null;
      }
      let state = {
        formState: 'error'
      };
      if (msg) {
        state.errorMsg = msg;
      }
      this.setState(state);
    },

    setFormStateSuccess: function (reset, cb) {
      let self = this;

      if (typeof reset === 'function') {
        cb = reset;
        reset = false;
      }

      // amimation delay
      let innerCB;
      if (cb) {
        innerCB = function () {
          setTimeout(function () {
            // auto reset?
            if (reset) {
              self.resetFormState(cb);
            } else {
              cb();
            }
          }, 1200);
        };
      }

      this.setState({ formState: 'success' }, innerCB);
    },

    resetFormState: function (cb) {
      this.setState({ formState: '', errorMsg: undefined }, cb);
    },

    getFormState: function () {
      return this.state.formState;
    },

    getFunctions: function () {
      let self = this;
      return {
        getFormState: function () {
          return self.getFormState();
        },
        resetFormState: function (cb) {
          return self.resetFormState(cb);
        },
        setFormStateSuccess: function (reset, cb) {
          return self.setFormStateSuccess(reset, cb);
        },
        setFormStateError: function (msg) {
          return self.setFormStateError(msg);
        },
        setFormStateDirty: function (cb) {
          return self.setFormStateDirty(cb);
        },
        bindFormState: function (onSuccess, onError, options) {
          return self.bindFormState(onSuccess, onError, options);
        }
      };
    },
/*eslint-disable no-dupe-keys*/ //bug in eslint
    render() {
      return React.createElement(
        Component,
        { ...this.props, ...this.state, ...this.getFunctions() }
      );
    }
  });
};

export default _.curry(FormState);
