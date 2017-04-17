import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { colors, theme } from '../theme/colors';

// Actions
import { closePopover, openPopover } from '../actions/materialUi';

const border = `2px solid ${colors.Mint}`;

const styles = {
  searchOption: {
    minWidth: 180,
    padding: 5,
    margin: '5px 0px 5px 5px',
    fontSize: '18px',
    textAlign: 'center',
    cursor: 'pointer',
    color: colors.PrimaryDark,
    borderLeft: border,
    marginLeft: 10,
    transition: 'all 0.2s ease',
    '@media (max-width: 480px)': {
      fontSize: '17px'
    },
    ':hover': {
      backgroundColor: colors.transCoral
    }
  },
  selected: {
    color: colors.Mint
  },
  lastStyle: {
    borderRight: border,
    margin: '5px 10px 5px 5px',
    marginLeft: 0
  }
};

const component = (props) => {
  const {
    name, anchor, onSelect, options,
    close, label, value, open, last
  } = props;
  const { searchOption, selected, lastStyle } = styles;
  return (
    <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
      <div>
        <div
          style={!last ? searchOption : [searchOption, lastStyle]}
          onTouchTap={e => {
            e.preventDefault();
            open(name, e.currentTarget);
          }}
        >{label} <span style={selected}>{value}</span></div>
        <Popover
          open={props[name]}
          anchorEl={anchor}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          onRequestClose={() => close(name)}
          animation={PopoverAnimationVertical}
          useLayerForClickAway={true}
        >
          <Menu
            selectedMenuItemStyle={{ color: colors.PrimaryDark }}
            value={value}
          >
            {options.map(o =>
              <MenuItem
                value={o.text}
                primaryText={o.text}
                onTouchTap={() => {
                  onSelect(o);
                  close(name);
                }} />
            )}
          </Menu>
        </Popover>
      </div>
    </MuiThemeProvider>
  );
};


const mapStateToProps = ({ materialUi }) => ({ ...materialUi.popOver });

const mapDispatchToProps = dispatch => ({
  close: menuName => dispatch(closePopover(menuName)),
  open: (name, anchor) => dispatch(openPopover(name, anchor))
});

export default connect(
mapStateToProps,
mapDispatchToProps
)(Radium(component));

