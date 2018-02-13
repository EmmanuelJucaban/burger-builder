import React, { Component } from 'react';

import Modal from './../../components/UI/Modal/Modal';
import Aux from './../Auxiliary/Auxiliary';

const withErrorHandler = ( WrappedComponent, axios ) => {
  return class extends Component  {
    state = {
      error: null,
      success: null
    }

    componentWillMount () {
      this.reqInterceptor = axios.interceptors.request.use( req => {
        this.setState({ error: null, success: null });
        return req;
      });
      
      this.resInterceptor = axios.interceptors.response.use( res => {
        if ( res.config.method !== 'get') {
          this.setState({ success: 'Your request is already sent! '});
        }
        return res;
      }, error => {
        this.setState({ error });
      });
    }

    componentWillUnmount() {
      axios.interceptors.request.eject(this.reqInterceptor);
      axios.interceptors.response.eject(this.resInterceptor);

    }
    errorConfirmedHandler = () => {
      this.setState({ error: null });
    }

    successConfirmedHandler = () => {
      this.setState({ success: null });
    }

    render() {
      return (
        <Aux>
          <Modal
            show={ this.state.error }
            modalClosed={ this.errorConfirmedHandler }>
            { this.state.error ? this.state.error.message : null }
          </Modal>

          <Modal
            show={ this.state.success }
            modalClosed={ this.successConfirmedHandler }>
            { this.state.success ? this.state.success : null }
          </Modal>
          <WrappedComponent {...this.props}/>
        </Aux>
      );
    }
  }
};

export default withErrorHandler;

