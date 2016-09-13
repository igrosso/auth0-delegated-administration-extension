import React, { Component } from 'react';
import { LoadingPanel, Error } from '../../components/Dashboard';
import Codemirror from 'react-codemirror';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/javascript-lint';
import 'codemirror/addon/lint/json-lint';

import 'codemirror/theme/mbo.css';
import 'codemirror/addon/lint/lint.css';

import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';
import { scriptActions } from '../../actions';

import './Configuration.css';

class Configuration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCode: '',
      currentName: ''
    };
  }

  componentWillMount = () => {
    this.props.fetchScript('access', function () {
      this.refresh(1, 'access');
    }.bind(this));
  };

  updateCode = (newCode) => {
    this.setState({ currentCode: newCode });
    return newCode;
  };

  onChange = (index) => {
    let attr = '';
    switch (index) {
      case 1:
        attr = 'access';
        break;
      case 2:
        attr = 'filter';
        break;
      case 3:
        attr = 'memberships';
        break;
      case 4:
        attr = 'write';
        break;
      case 5:
        attr = 'styles';
        break;
    }
    this.props.fetchScript(attr, function () {
      this.refresh(index, attr);
    }.bind(this));
  };

  refresh = (i, attr) => {
    this.setState({ currentName: attr });
    this.setState({ currentCode: this.props.script });
    const currentCode = String(this.props.script);
    setTimeout(function () {
      $('.CodeMirror').each(function (key, index) {
        if(++key==i) {
          let self = $(this);
          self.context.CodeMirror.setValue(currentCode);
          self.context.CodeMirror.refresh();
        }
      });
    }, 100);
  };

  saveOneScript = () => {
    this.props.updateScript(
      this.state.currentName, { 'script': this.state.currentCode }
      );
  };

  render() {
    const { script, loading, error } = this.props;
    const jsHintOptions = {
      options: {
        'sub': true,
        'noarg': true,
        'undef': true,
        'eqeqeq': true,
        'laxcomma': true,
        '-W025': true,
        'predef': ['module']
      }
    };
    const options = {
      mode: 'javascript',
      lineNumbers: true,
      lineWrapping: true,
      continueComments: 'Enter',
      matchBrackets: true,
      styleActiveLine: true,
      closeBrackets: true,
      indentUnit: 2,
      smartIndent: true,
      autofocus: true,
      tabSize: 2,
      gutters: ['CodeMirror-lint-markers'],
      theme: 'mbo',
      height:300,
      lint: jsHintOptions
    };

    return (
      <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
        <Error message={error}/>
        <div className="users">
          <div className="row content-header">
            <div className="col-xs-12 userTableContent">
              <h2>Configurations</h2>
            </div>
          </div>
          <div className="row user-tabs">
            <div className="col-xs-12">
                <Tabs defaultActiveKey={1} animation={false} onSelect={this.onChange.bind(this)}>
                  <Tab eventKey={1} title="Access Query">
                    <Codemirror value=''
                                onChange={this.updateCode}
                                options={options}
                                className="access"
                    />
                    <div className="saveConfigurationButton">
                      <button onClick={this.saveOneScript.bind(this)} className="btn btn-success">Save Access Query
                      </button>
                    </div>
                  </Tab>
                  <Tab eventKey={2} title="Filter Query">
                    <Codemirror value=''
                                onChange={this.updateCode}
                                options={options}
                                className="filter"
                    />
                    <div className="saveConfigurationButton">
                      <button onClick={this.saveOneScript.bind(this)} className="btn btn-success">Save Filter Query
                      </button>
                    </div>
                  </Tab>
                  <Tab eventKey={3} title="Memberships Query">
                    <Codemirror value=''
                                onChange={this.updateCode}
                                options={options}
                                className="memberships"
                    />
                    <div className="saveConfigurationButton">
                      <button onClick={this.saveOneScript.bind(this)} className="btn btn-success">Save Memberships
                        Query
                      </button>
                    </div>
                  </Tab>
                  <Tab eventKey={4} title="Write Query">
                    <Codemirror value=''
                                onChange={this.updateCode}
                                options={options}
                                className="write"
                    />
                    <div className="saveConfigurationButton">
                      <button onClick={this.saveOneScript.bind(this)} className="btn btn-success">Save Write Query
                      </button>
                    </div>
                  </Tab>
                  <Tab eventKey={5} title="Styles">
                    <Codemirror value=''
                                onChange={this.updateCode}
                                options={options}
                                className="styles"
                    />
                    <Codemirror className="hidden" value=""/>
                    <div className="saveConfigurationButton">
                      <button onClick={this.saveOneScript.bind(this)} className="btn btn-success">Save Styles
                      </button>
                    </div>
                  </Tab>
                </Tabs>
            </div>
          </div>
        </div>
      </LoadingPanel>
    );
  }
}

function mapStateToProps(state) {
  return {
    error: state.script.get('error'),
    script: state.script.get('record'),
    loading: state.script.get('loading')
  };
}

export default connect(mapStateToProps, { ...scriptActions })(Configuration);
