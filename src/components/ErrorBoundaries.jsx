import React, { useState } from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    console.log('error detected! we are setting state');
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      console.log('rendering error');
      // You can render any custom fallback UI
      return <h2>Oops! Something went wrong here.</h2>;
    }

    // in this example this.props.children is Counter component used
    // below in the App component
    return this.props.children;
  }
}
