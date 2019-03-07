/* eslint-disable react/no-find-dom-node */
/* eslint-disable guard-for-in */
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import loadScript from 'load-script';

const defaultScriptUrl = 'https://cdn.ckeditor.com/4.6.2/standard/ckeditor.js';
const youtubePluginScriptUrl = 'https://cdn.jsdelivr.net/npm/ckeditor-youtube-plugin@2.1.13/youtube/plugin.js';

/**
 * @author codeslayer1
 * @github https://github.com/codeslayer1/react-ckeditor
 * @description CKEditor component to render a CKEditor textarea with defined configs and all CKEditor events handler
 */
class CKEditor extends React.Component {
  constructor(props) {
    super(props);

    // Bindings
    this.onLoad = this.onLoad.bind(this);

    // State initialization
    this.state = {
      isScriptLoaded: props.isScriptLoaded,
    };
  }

  // load ckeditor script as soon as component mounts if not already loaded
  componentDidMount() {
    if (!this.state.isScriptLoaded) {
      loadScript(this.props.scriptUrl, this.onLoad);
    } else {
      this.onLoad();
    }
  }

  componentWillReceiveProps(props) {
    const editor = this.editorInstance;
    if (editor && editor.getData() !== props.content) {
      editor.setData(props.content);
    }
  }

  componentWillUnmount() {
    this.unmounting = true;
  }

  onLoad() {
    if (this.unmounting) return;

    this.setState({
      isScriptLoaded: true,
    });

    if (!window.CKEDITOR) {
      console.error('CKEditor not found');
      return;
    }

    // Add youtube plugin
    window.CKEDITOR.plugins.addExternal('youtube', youtubePluginScriptUrl);

    this.editorInstance = window.CKEDITOR.appendTo(
      ReactDOM.findDOMNode(this),
      this.props.config,
      this.props.content
    );

    // Register listener for custom events if any
    for (const event in this.props.events) {
      const eventHandler = this.props.events[event];

      this.editorInstance.on(event, eventHandler);
    }
  }

  render() {
    return <div className={this.props.activeClass} />;
  }
}

CKEditor.defaultProps = {
  content: '',
  config: {},
  isScriptLoaded: false,
  scriptUrl: defaultScriptUrl,
  activeClass: '',
  events: {},
};

CKEditor.propTypes = {
  content: PropTypes.any,
  config: PropTypes.object,
  isScriptLoaded: PropTypes.bool,
  scriptUrl: PropTypes.string,
  activeClass: PropTypes.string,
  events: PropTypes.object,
};

export default CKEditor;
