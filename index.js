const { Tooltip } = require('powercord/components');
const { Plugin } = require('powercord/entities');
const { open: openModal } = require('powercord/modal');
const { inject, uninject } = require('powercord/injector');
const { React, getModuleByDisplayName } = require('powercord/webpack');

const { resolve } = require('path');

const AnimeModal = require('./components/AnimeModal');

module.exports = class Anime extends Plugin {
  async startPlugin () {
    this.loadCSS(resolve(__dirname, 'style.scss'));
    this._injectModal();
  }

  pluginWillUnload () {
    uninject('anime-headerbar');
  }

  async _injectModal () {
    const HeaderBarContainer = await getModuleByDisplayName('HeaderBarContainer');
    inject('anime-headerbar', HeaderBarContainer.prototype, 'renderLoggedIn', (args, res) => {
      if (res.props.toolbar && res.props.toolbar.props.children && res.props.toolbar.props.children[0][0]) {
        res.props.children.push(
          React.createElement(Tooltip, {
            text: 'Anime lookup',
            position: 'bottom'
          }, React.createElement('div', {
            className: 'anime-header-icon-s',
            onClick: () => openModal(AnimeModal)
          }))
        );
      }
      return res;
    });
  }
};
