const { React } = require('powercord/webpack');
const { Button, Icon } = require('powercord/components');
const { Modal } = require('powercord/components/modal');
const { TextInput } = require('powercord/components/settings');
const KitsuAPI = require('../KitsuAPI');

class AnimeResult extends React.Component {
  constructor () {
    super();
    this.state = { small: true };
  }

  handleClick () {
    const { small } = this.state;
    this.setState({ small: !small });
  }

  render () {
    const { small } = this.state;
    const { item } = this.props;
    let height, cutoff, imgHeight, title, airingStatus;
    const vid = item.youtubeVideoId ? <iframe height="450" src={`https://www.youtube.com/embed/${item.youtubeVideoId}`}></iframe> : '';
    if (small) {
      height = '100px';
      cutoff = 350;
      imgHeight = '100px';
      title = item.titles.en;
      airingStatus = '';
    } else {
      height = vid === '' ? '250px' : '700px';
      cutoff = 1000;
      imgHeight = '250px';
      title = `${item.titles.en || ''} ${item.titles.ja_jp || ''}${item.titles.en_jp ? ' (' + item.titles.en_jp + ')' : ''}`;
      airingStatus = <span className="anime-modal-result-airing">{item.status === 'current' ? 'Currently Airing' : 'Finished Airing'}</span>;
    }
    const synopsis = item.synopsis.length > cutoff ? `${item.synopsis.slice(0, cutoff - 6)}[...]` : item.synopsis;
    const img = item.posterImage.medium ? <img height={imgHeight} className='anime-modal-result-image' src={item.posterImage.medium} /> : '';
    return (
      <div
        className='anime-modal-result'
        onClick={() => this.handleClick() }
        style={{ height }}
      >
        <div style={{ display: 'flex' }}>
          {img}
          <div className='anime-modal-result-details'>
            <span className='anime-modal-result-title'>{title}</span>
            <span className='anime-modal-result-synopsis'>{synopsis}</span>
            <div className='anime-modal-result-tags'>
              <span className='anime-modal-result-tag'>{item.showType}</span>
              <span className='anime-modal-result-tv-rating'><Icon className="anime-modal-result-rating-icon" name="Movie" />{item.ageRating || 'NR'}</span>
              <span className='anime-modal-result-rating'><Icon className="anime-modal-result-rating-icon" name="People" />{item.averageRating}%</span>
              {airingStatus}
            </div>
          </div>
        </div>
        {!small ? vid : ''}
      </div>
    );
  }
}

module.exports = class AnimeModal extends React.Component {
  constructor (props) {
    super(props);
    this.state = { entries: [],
      textValue: ''
    };
  }

  setText (t) {
    this.setState({ textValue: t });
  }

  handleSearch () {
    KitsuAPI.searchAnime(this.state.textValue).then((resp) => {
      this.setState({ entries: resp.data });
    });
  }

  render () {
    const { entries } = this.state;
    const animeResultList = [];
    entries.forEach(animeResult => {
      if (this.props.getSetting('nsfwFilter', true) && !animeResult.attributes.nsfw) {
        animeResultList.push(<AnimeResult className="anime-result" item={animeResult.attributes}/>);
      }
    });
    return (
      <Modal size={Modal.Sizes.LARGE}>
        <Modal.Header>
          <span className='anime-modal-header'>
            Anime Search
          </span>
        </Modal.Header>
        <Modal.Content>
          <div className='anime-modal-search'>
            <TextInput
              onChange={t => this.setText(t)}
            >
              Title
            </TextInput>
            <Button
              onClick={() => this.handleSearch()}
            >
              Search
            </Button>
          </div>

          <div className='anime-modal-results'>
            {animeResultList}
          </div>
        </Modal.Content>
      </Modal>
    );
  }
};
