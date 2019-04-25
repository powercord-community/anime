const { Tooltip } = require('powercord/components');
const { Plugin } = require('powercord/entities');
const { open: openModal } = require('powercord/modal');
const { inject, uninject } = require('powercord/injector');
const { React, getModuleByDisplayName } = require('powercord/webpack');

const { resolve } = require('path');

const AnimeModal = require('./components/AnimeModal');
const Settings = require('./Settings');

module.exports = class Anime extends Plugin {
  async startPlugin () {
    this.loadCSS(resolve(__dirname, 'style.scss'));
    this._injectModal();
    this.registerSettings('anime', 'Anime Search', (props) =>
      React.createElement(Settings, {
        ...props
      })
    );
  }

  pluginWillUnload () {
    uninject('anime-headerbar');
  }

  async _injectModal () {
    const HeaderBarContainer = await getModuleByDisplayName('HeaderBarContainer');
    inject('anime-headerbar', HeaderBarContainer.prototype, 'renderToolbar', (args, res) => {
      res.props.children.push(
        React.createElement(Tooltip, {
          text: 'Anime lookup',
          position: 'bottom'
        }, React.createElement('div', {
          className: 'anime-header-icon-s',
          onClick: () => openModal(() => React.createElement(this.settings.connectStore(AnimeModal)))
        }))
      );
      return res;
    });
  }
};
