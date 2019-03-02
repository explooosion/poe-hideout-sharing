import React, { Component } from 'react';
import './Editor.scss';

// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import CKEditor from "react-ckeditor-component";

class Editor extends Component {
  onChange = evt => {
    const newContent = evt.editor.getData();
    this.props.onChange(newContent);
    // Save to cookie
  }

  onBlur = evt => {
    // console.log("onBlur event called with event info: ", evt);
  }

  afterPaste = evt => {
    // console.log("afterPaste event called with event info: ", evt);
  }

  render() {
    return (
      <CKEditor
        activeClass="editor"
        content={this.props.value}
        events={{
          "blur": this.onBlur,
          "afterPaste": this.afterPaste,
          "change": this.onChange,
        }}
      />
    )
  }
}

Editor.propTypes = {}

const mapStateToProps = state => {
  return {
    // auth: state.auth,
    // users: state.users,
  }
}

export default withNamespaces()(connect(mapStateToProps)(Editor));
