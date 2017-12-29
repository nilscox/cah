import React, {Component} from 'react';
import ChoiceCard from '../../../common/ChoiceCard';

class ChoicesView extends Component {
  state = {
    selected: [],
  };

  onSelect(choice) {
    if (!this.props.canSelect)
      return;

    const selected = this.state.selected.slice();

    const idx = selected.indexOf(choice);

    if (idx >= 0)
      selected.splice(idx, 1);
    else if (selected.length >= this.props.maxSelection)
      return;
    else
      selected.push(choice);

    this.setState({ selected });
    this.props.onChoiceSelected(selected);
  }

  render() {
    const { choices, maxSelection } = this.props;
    const { selected } = this.state;

    const isSelected = (choice) => selected.indexOf(choice) >= 0;
    const canSelect = this.props.canSelect && selected.length < maxSelection;

    return (
      <div className="choices-view">
        <div className={'choices-list' + (canSelect ? ' can-select' : '')}>
          {choices.map(choice => (
            <ChoiceCard
              key={choice.id}
              selected={isSelected(choice)}
              choice={choice}
              onSelect={() => this.onSelect(choice)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default ChoicesView;
