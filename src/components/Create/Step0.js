import React, { Component } from 'react';
import './Step0.scss';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

class Step0 extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
    this.t = props.t;
    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps.state,
    }
  }

  render() {
    const { onSetState, onValid, onNext, history } = this.props;
    return (
      <div className="create-group">
        <h1 className="create-title">{this.t('Create0Title')}</h1>
        <div className="p-grid p-justify-center group-title">
          <InputText className="p-col-11 form-title" value={this.state.title} onChange={(e) => onSetState({ title: e.target.value })} placeholder={this.t('Create0TitleInput')} autoFocus />
          <span className="form-valid" style={onValid(this.state.title)}>{this.t('Create0TitleAlert')}</span>
        </div>
        <div className="create-control">
          <Button label={this.t('CreateCancel')} className="p-button-secondary p-button-raised create-control-button" onClick={() => history.push('/')} />
          <Button label={this.t('CreateNext')} icon="pi pi-arrow-right" iconPos="right" className="p-button-raised create-control-button" onClick={() => onNext()} />
        </div>
      </div>
    );
  }
}

Step0.propTypes = {}

const mapStateToProps = state => {
  return {}
}

export default withNamespaces()(connect(mapStateToProps)(Step0));
