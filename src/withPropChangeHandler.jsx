import React, { Component } from "react";

const withPropChangeHandler = (keys, propChangeHandler) => WrappedComponent => {
  class WithPropChangeHandler extends Component {
    componentWillMount() {
      propChangeHandler(this.props, {});
    }

    componentWillReceiveProps(nextProps) {
      const { props } = this;

      const keysToCompare =
        keys || Object.keys(nextProps).concat(Object.keys(props));

      const propChanged = keysToCompare
        .map(key => nextProps[key] !== props[key])
        .reduce((a, b) => a || b, false);

      if (propChanged) {
        propChangeHandler(nextProps, props);
      }
    }

    componentWillUnmount() {
      propChangeHandler({}, this.props);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  WithPropChangeHandler.displayName = `withPropChangeHandler(${WrappedComponent.displayName ||
    WrappedComponent.name ||
    "Component"})`;

  return WithPropChangeHandler;
};

export default withPropChangeHandler;
