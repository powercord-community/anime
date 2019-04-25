const { React } = require('powercord/webpack');
const { SwitchItem } = require('powercord/components/settings');

module.exports = ({ getSetting, toggleSetting }) => (
  <div>
    <SwitchItem
      note='Filters out NSFW Anime in the search.'
      value={getSetting('nsfwFilter', true)}
      onChange={() => toggleSetting('nsfwFilter')}
    >
      Filter NSFW
    </SwitchItem>
  </div>
);
