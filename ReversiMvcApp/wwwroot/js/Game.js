const Game = (function (url) {
  //Configuratie en state waarden
  let stateMap = {
    gameState: "",
  }
  let configMap = {
    apiUrl: "",
    playerToken: "",
    Token: "",
  }

  // Private function init
  const privateInit = function (url, playerToken, Token) {
    configMap.apiUrl = url;
    configMap.playerToken = playerToken;
    configMap.Token = Token;
    console.log(configMap)
    setInterval(_getCurrentGameState, 2000)
    //afterInit()
  }
  // Waarde/object geretourneerd aan de outer scope

  const _getCurrentGameState = function () {
    stateMap.gameState = Game.Model.getGameState(configMap.Token);
  }

  return {
    init: privateInit,
    configMap: configMap,
    stateMap: stateMap
  }
})('/api/url')

Game.Reversi = (function () {
  let configMap = {}

  const privateInit = function () {
    console.log('Hallo vanuit privateinit')
  }
  return {
    init: privateInit
  }
})()

Game.Data = (function () {
  let stateMap = { enviroment: 'production' }
  let configMap = {
    mock: [
      {
        url: '/api/Game/Turn',
        data: 0
      }
    ]
  }

  const getMockData = function (url) {
    const mockData = configMap.mock.find(mock => mock.url === url)
    return new Promise((resolve, reject) => {
      resolve(mockData)
    })
  }

  const get = function (url) {
    if (stateMap.enviroment == 'development') {
      return getMockData(url)
    } else if (stateMap.enviroment == 'production') {
        return $.get(Game.configMap.apiUrl + url)
        .then(r => {
          return r
        })
        .catch(e => {
          console.log(e.message)
        })
    }
  }
  const privateInit = function (environment) {
    if (environment != 'production' && environment != 'development') {
      throw new Error('Environment parameter is invalid')
    }
    stateMap.enviroment = environment
  }

  return {
    get: get,
    init: privateInit
  }
})()

Game.Model = (function () {
  let configMap = {}

  const privateInit = function () {}

  const _getWeather = function (url) {
    return Game.Data.get(url)
      .then(data => {
        if (data['main']['temp']) {
          return data
        } else {
          throw new Error('No temperature available in data')
        }
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  const _getGameState = function (token) {
    const url = `/Game/${token}/turn`
      return Game.Data.get(url)
        .then(data => {
          if (data !== "Black" && data !== "White") {
            throw new Error(`Value gameState is invalid: ${data}`);
          } else {
            return data;
          }
        })
        .catch(error => {
          console.log(error.message);
        });
  }

  return {
    init: privateInit,
    getWeather: _getWeather,
    getGameState: _getGameState
  }
})()
