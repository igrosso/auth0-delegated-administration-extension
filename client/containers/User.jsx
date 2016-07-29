import React, { Component, PropTypes } from 'react'
import connectContainer from 'redux-static';
import { Tabs, Tab } from 'react-bootstrap';

import { logActions, userActions } from '../actions';

import './User.css';
import LogDialog from '../components/Logs/LogDialog';
import { UserActions, UserDevices, UserHeader, UserProfile, UserLogs } from '../components/Users';
import { BlockDialog, UnblockDialog, RemoveMultiFactorDialog } from '../components/Users';


export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    user: state.user,
    log: state.log,
    logs: state.user.get('logs'),
    devices: state.user.get('devices'),
    dialogs: {
      mfa: state.mfa,
      block: state.block,
      unblock: state.unblock
    }
  });

  static actionsToProps = {
    ...logActions,
    ...userActions
  }

  static propTypes = {
    config: PropTypes.object.isRequired,
    fetchConfiguration: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchUser(this.props.params.id);
  }

  render() {
    const { user, log, logs, devices } = this.props;
    const { mfa, block, unblock } = this.props.dialogs;

    return (
      <div className="user">
        <div className="row content-header">
          <div className="col-xs-12">
            <h2 className="pull-left">User Details</h2>
            <div className="pull-right">
              <UserActions user={user}
                removeMfa={this.props.requestRemoveMultiFactor}
                blockUser={this.props.requestBlockUser}
                unblockUser={this.props.requestUnblockUser}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <UserHeader loading={user.get('loading')} user={user.get('record')} error={user.get('error')} />
          </div>
        </div>
        <div className="row user-tabs">
          <div className="col-xs-12">
            <Tabs defaultActiveKey={1} animation={false}>
              <Tab eventKey={1} title="Profile">
                <UserProfile loading={user.get('loading')} user={user.get('record')} error={user.get('error')} />
              </Tab>
              <Tab eventKey={3} title="Devices">
                <UserDevices loading={devices.get('loading')} devices={devices.get('records')} error={devices.get('error')} />
              </Tab>
              <Tab eventKey={4} title="Logs">
                <LogDialog onClose={this.props.clearLog} error={log.get('error')} loading={log.get('loading')} log={log.get('record')} logId={log.get('logId')} />
                <UserLogs onOpen={this.props.fetchLog} loading={logs.get('loading')} logs={logs.get('records')} user={user.get('record')} error={logs.get('error')} />
              </Tab>
            </Tabs>
          </div>
        </div>
        <BlockDialog error={block.get('error')} loading={block.get('loading')} userName={block.get('userName')} requesting={block.get('requesting')}
          onCancel={this.props.cancelBlockUser} onConfirm={this.props.blockUser} />
        <UnblockDialog error={unblock.get('error')} loading={unblock.get('loading')} userName={unblock.get('userName')} requesting={unblock.get('requesting')}
          onCancel={this.props.cancelUnblockUser} onConfirm={this.props.unblockUser} />
        <RemoveMultiFactorDialog error={mfa.get('error')} loading={mfa.get('loading')} userName={mfa.get('userName')} requesting={mfa.get('requesting')}
          onCancel={this.props.cancelRemoveMultiFactor} onConfirm={this.props.removeMultiFactor} />
      </div>
    );
  }
});