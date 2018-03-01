// @flow

import * as React from 'react';
import Tooltip from 'material-ui/Tooltip';

import type { PlayerType } from '../../types/models';
import { toClassName } from '../../utils';
import type { State } from "../../types/state";
import type { Action, Dispatch } from "../../types/actions";
import { connect } from "react-redux";
import { changePlayerAvatar } from "../../actions/player";

type PlayerAvatarStateProps = {|
  canChange: PlayerType => boolean,
|};

type PlayerAvatarDispatchProps = {|
  changeAvatar: any => Action,
|};

type PlayerAvatarMergeProps = {|
  className?: string,
  player: PlayerType,
  tooltip: string,
|};

type PlayerAvatarProps =
  & PlayerAvatarStateProps
  & PlayerAvatarDispatchProps
  & PlayerAvatarMergeProps;

const mapStateToProps: (state: State) => PlayerAvatarStateProps = ({
  player,
}) => ({
  canChange: p => p.nick === player.nick,
});

const mapDispatchToProps: (dispatch: Dispatch) => PlayerAvatarDispatchProps = dispatch => ({
  changeAvatar: file => dispatch(changePlayerAvatar(file)),
});

const PlayerAvatar = ({
  className,
  player,
  tooltip,
  canChange,
  changeAvatar,
}: PlayerAvatarProps) => {
  let fileInput = null;

  const onClicked = () => {
    if (!fileInput || !canChange(player))
      return;

    fileInput.click();
  };

  const onFileChanged = (e) => {
    const file = e.target.files[0];

    if (file && canChange(player))
      changeAvatar(file);
  };

  return (
    <Tooltip title={tooltip} placement="top">

      <div
        className={toClassName([
          'player-avatar',
          'player-' + player.nick,
          canChange(player) && 'can-change',
          className,
        ])}
        onClick={onClicked}
      >

        <input
          style={{display: 'none'}}
          type="file"
          name="avatar"
          ref={input => fileInput = input}
          onChange={onFileChanged}
        />

        <img
          className="avatar-image"
          alt={'avatar-' + player.nick}
          src={player.avatar || '/img/default_avatar.png'}
        />

      </div>

    </Tooltip>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerAvatar);
