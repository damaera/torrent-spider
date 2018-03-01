import React, { Component } from 'react';
import Loading from './Loading'

const URL = 'https://torrent-search.glitch.me/search?q='

class App extends Component {
  state = {
    loading: false,
    data: [],
    providers: [],
    search: '',
    inputSearch: '',
  }

  componentDidMount () {
    this.fetchProviders()
  }

  fetchTorrents = (keyword = '') => {
    this.setState({ loading: true })
    fetch(`${URL}${keyword}`)
      .then(res => {
        return res.json()
      })
      .then(data => {
        this.setState({
          loading: false,
          data
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  fetchProviders = () => {
    fetch('https://torrent-search.glitch.me/providers')
      .then(res => {
        return res.json()
      })
      .then(providers => {
        this.setState({
          providers
        })
      })
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.setState({ search: this.state.inputSearch })
    this.fetchTorrents(this.state.inputSearch)
  }

  handleChangeInput = (e) => {
    this.setState({ inputSearch: e.target.value })
  }
  
  render() {
    return (
      <div className="app">
        <header className="header">
          <div className="wrapper">
            <h1 className="title">TorrentSpider</h1>
            <div className="uppercase">
              donate
            </div>
          </div>
        </header>
        <div className="search">
          <form
            className="wrapper"
            onSubmit={this.handleSearch}
          >
            <input
              placeholder="Search torrents across different provider"
              className="input shadow"
              value={this.state.inputSearch}
              onChange={this.handleChangeInput}
            />
            <input
              type="submit"
              className="btn shadow uppercase"
              disabled={this.state.inputSearch.length < 3}
            />
          </form>
        </div>
        <div className="results">
          <div className="wrapper">
            { !this.state.search && (
              <div className="info">
                <h3>Search and magnet torrents from multiples providers</h3>
                <div>
                  { this.state.providers.map(provider => (
                    <div key={provider.name}>{provider.name}</div>
                  )) }
                </div>
              </div>
            ) }

            { (!this.state.loading && this.state.search) && (
              <div className="results-info">
                <div><b>{ this.state.search }</b> { this.state.data.length } results</div>
              </div>
            )}
            { this.state.loading
              ?
              (
                <div className="loading">
                  <div className="loader-wrapper">
                    <Loading />
                  </div>
                  <h4 className="uppercase">Please wait...</h4>
                  <div>Searching in different provider is a bit tiring...</div>
                </div>
              )
              :
              (this.state.data.map((item, i) => {
                if (item && item.title) {
                  return (
                    <div className="card shadow" key={i}>
                      
                      <div className="time-provider">
                      { item.desc ? (
                        <a href={item.desc} target="_blank">
                            <div className="provider">{ item.provider }</div>
                        </a>
                      ) : (
                        <div className="provider">{ item.provider }</div>
                      )}
                        <div className="time">{ item.time }</div>
                      </div>
                      {item.desc ? (
                        <a href={item.desc} target="_blank">
                          <div className="title">{item.title}</div>
                        </a>
                      ) : (
                          <div className="title">{item.title}</div>
                      )}

                      <div>

                        { item.magnet && (
                          <a href={item.magnet} target="_blank">
                            <button className="btn magnet uppercase">magnet</button>
                          </a>
                        ) }

                        { item.link && (
                          <a href={item.link} target="_blank">
                            <button className="btn torrent uppercase">.torrent</button>
                          </a>
                        )}

                        <button className="btn size uppercase">{item.size}</button>

                        { item.seeds ? <button className="btn uppercase">{item.seeds} seeds</button> : null }
                        { item.peers ? <button className="btn uppercase">{item.peers} peers</button> : null }
                      </div>
                    </div>
                  )
                } else {
                  return null
                }}
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
