// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import Tooltip from 'material-ui/Tooltip';

import type { PlayerType } from 'Types/models';
import type { State } from 'Types/state';
import type { Action, Dispatch } from 'Types/actions';
import { setError } from 'Actions/error';
import { toClassName } from '../../utils';
import { changePlayerAvatar } from 'Actions/player';
import ImageUploadField from 'Components/common/ImageUploadField';

type PlayerAvatarStateProps = {|
  canChange: PlayerType => boolean,
|};

type PlayerAvatarDispatchProps = {|
  changeAvatar: any => Action,
  onError: string => Action,
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
  onError: err => dispatch(setError({ detail: err })),
});

const PlayerAvatar = ({
  className,
  player,
  tooltip,
  canChange,
  changeAvatar,
  onError,
}: PlayerAvatarProps) => {
  const onImageSelected = (file) => {
    if (file && canChange(player))
      changeAvatar(file);
  };

  const avatarSrc = player.avatar || '/img/default_avatar.png';

  return (
    <Tooltip title={tooltip} placement="top">

      <div
        className={toClassName([
          'player-avatar',
          'player-' + player.nick,
          canChange(player) && 'can-change',
          className,
        ])}
      >

        { canChange(player) ?
          <ImageUploadField
            className={"upload-avatar"}
            formats={['jpg', 'jpeg', 'png']}
            image={avatarSrc}
            onImageSelected={onImageSelected}
            onError={err => onError(err)}
          />
          :
          <img src={avatarSrc} alt={player.nick + '-avatar'} />
        }

      </div>

    </Tooltip>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerAvatar);
