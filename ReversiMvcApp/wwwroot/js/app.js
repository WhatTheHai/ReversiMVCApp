"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Game = function () {
  //Configuratie en state waarden
  var stateMap = {
    gameState: 0
  };
  var configMap = {
    apiUrl: '',
    playerToken: '',
    Token: '',
    Color: ''
  };
  var pollRate;

  // Private function init
  var _init = function _init(url, playerToken, Token) {
    configMap.apiUrl = url;
    configMap.playerToken = playerToken;
    configMap.Token = Token;
    configMap.Color = getColor();
    Game.Data.init(configMap.apiUrl, 'production');
    Game.Model.init();
    Game.Template.init();
    Game.API.init();
    pollRate = setInterval(_getCurrentGameState, 2500);
  };
  var initializeOnce = false;
  var getColor = function getColor() {
    if (configMap.playerToken == stateMap.gameState.player1Token) {
      return 'white';
    } else {
      return 'black';
    }
  };
  var _getCurrentGameState = function _getCurrentGameState() {
    Game.API.getGameState(configMap.Token).then(function (data) {
      if (!initializeOnce) {
        stateMap.gameState = data;
        Game.Reversi.init(stateMap.gameState.board);
        Game.Stats.init();
        initializeOnce = true;
      } else {
        if (stateMap.gameState.board != data.board) {
          // Board has been updated
          // As a hindsight, I could've checked for this and then update the board, but due to time constraint, I cannot change this.
          Game.Stats.addOccupiedChartData(data.board);
          //data.board = newer board, gamestate is older board
          Game.Stats.addCapturedChartData(stateMap.gameState.board, data.board);
        }
        stateMap.gameState = data;
        Game.Reversi.updateBoard(JSON.parse(stateMap.gameState.board));
        Game.Reversi.turnStatus(stateMap.gameState.isTurn);
      }
      if (data.finished == 'True') {
        clearInterval(pollRate);
        var currentUrl = window.location;
        var redirectUrl = "".concat(currentUrl.protocol, "//").concat(currentUrl.host, "/Game/Result/").concat(configMap.Token);
        var randomDelay = Math.floor(Math.random() * 2000) + 3000;
        setTimeout(function () {
          window.location.href = redirectUrl;
        }, randomDelay);
      }
    })["catch"](function (error) {
      console.log(error.message);
    });
  };
  return {
    init: _init,
    configMap: configMap,
    stateMap: stateMap,
    getCurrentGameState: _getCurrentGameState
  };
}();
var FeedbackWidget = /*#__PURE__*/function () {
  function FeedbackWidget(elementId) {
    _classCallCheck(this, FeedbackWidget);
    this._elementId = elementId;
  }
  _createClass(FeedbackWidget, [{
    key: "elementId",
    get: function get() {
      //getter, set keyword voor setter methode
      return this._elementId;
    }
  }, {
    key: "show",
    value: function show(message, type) {
      var _this = this;
      var elem = document.getElementById(this._elementId);
      var typeEmoji = '✔️';
      var fact = 'Placeholder';
      elem.style.display = 'block';
      if (type != 'success') {
        type = 'danger';
        typeEmoji = '❌';
      }
      Game.API.getDogFact().then(function (data) {
        var fact = data.data[0].attributes.body;
        elem.outerHTML = Game.Template.parseTemplate('feedbackWidget.body', {
          status: type,
          emoji: typeEmoji,
          text: message,
          quote: fact
        });
        _this.log({
          message: message,
          type: type
        });
      });
    }
  }, {
    key: "hide",
    value: function hide() {
      var elem = document.getElementById(this._elementId);
      elem.classList.add('fade-out');
      setTimeout(function () {
        elem.style.display = 'none';
        elem.classList.remove('fade-out');
        elem.classList.remove('fade-in');
      }, 749);
    }
  }, {
    key: "log",
    value: function log(message) {
      var allMessages = JSON.parse(localStorage.getItem('feedback_widget'));
      if (allMessages == null) {
        allMessages = [];
      } else if (allMessages.length >= 10) {
        allMessages.splice(0, 1);
      }
      allMessages.push(message);
      localStorage.setItem('feedback_widget', JSON.stringify(allMessages));
    }
  }, {
    key: "removeLog",
    value: function removeLog() {
      localStorage.removeItem('feedback_widget');
    }
  }, {
    key: "history",
    value: function history() {
      var allMessages = JSON.parse(localStorage.getItem('feedback_widget'));
      var result = '';
      allMessages.forEach(function (message) {
        result += "type ".concat(message['type'], " - ").concat(message['message'], " \n");
      });
      console.log(result);
    }
  }]);
  return FeedbackWidget;
}();
Game.API = function () {
  var _init = function _init() {};
  var apiLink = function apiLink() {
    return Game.configMap.apiUrl;
  };
  var getGameState = function getGameState(token) {
    var url = apiLink() + "/Game/".concat(token);
    return Game.Data.get(url).then(function (data) {
      return data;
    })["catch"](function (error) {
      console.log(error.message);
    });
  };
  var makeMove = function makeMove(move) {
    return Game.Data.put(apiLink() + '/Game/move', move);
  };
  var getDogFact = function getDogFact() {
    var url = 'https://dogapi.dog/api/v2/facts';
    return Game.Data.get(url).then(function (data) {
      return data;
    })["catch"](function (error) {
      console.log(error.message);
    });
  };
  return {
    init: _init,
    getGameState: getGameState,
    makeMove: makeMove,
    getDogFact: getDogFact
  };
}();
Game.Data = function () {
  var stateMap = {
    enviroment: 'production'
  };
  var configMap = {
    url: '',
    mock: [{
      url: '/api/Game/Turn',
      data: 0
    }]
  };
  var getMockData = function getMockData(url) {
    var mockData = configMap.mock.find(function (mock) {
      return mock.url === url;
    });
    return new Promise(function (resolve, reject) {
      resolve(mockData);
    });
  };
  var get = function get(url) {
    if (stateMap.enviroment == 'development') {
      return getMockData(url);
    } else if (stateMap.enviroment == 'production') {
      return $.get(url).then(function (r) {
        return r;
      })["catch"](function (e) {
        console.log(e.message);
      });
    }
  };
  var put = function put(url, data) {
    if (stateMap.enviroment === 'development') {
      return getMockData(url);
    } else if (stateMap.enviroment === 'production') {
      return fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(function (response) {
        if (!response.ok) {
          if (response.status === 400 || response.status === 401) {
            return response.text().then(function (message) {
              feedbackWidget.show("".concat(message), 'danger');
            });
          } else {
            throw new Error('Request failed with status: ' + response.status);
          }
        }
        return response.json();
      })["catch"](function (error) {
        console.log(error.message); // Display the error message
      });
    }
  };

  var _init = function _init(url, environment) {
    configMap.url = url;
    if (environment != 'production' && environment != 'development') {
      throw new Error('Environment parameter is invalid');
    }
    stateMap.enviroment = environment;
  };
  return {
    get: get,
    put: put,
    init: _init
  };
}();
Game.Model = function () {
  var configMap = {};
  var _Init = function _Init() {};
  var _getWeather = function _getWeather(url) {
    return Game.Data.get(url).then(function (data) {
      if (data['main']['temp']) {
        return data;
      } else {
        throw new Error('No temperature available in data');
      }
    })["catch"](function (error) {
      console.log(error.message);
    });
  };
  return {
    init: _Init,
    getWeather: _getWeather
  };
}();
Game.Reversi = function () {
  var configMap = {};
  var _init = function _init(gameboard) {
    var boardData = JSON.parse(gameboard);
    _initBoard(boardData);
  };
  var cellClickListener = function cellClickListener() {
    var gridItem = event.target.closest('.empty-piece');
    if (!gridItem) return; // Click occurred outside a grid item

    var x = parseInt(gridItem.parentElement.dataset.col);
    var y = parseInt(gridItem.parentElement.dataset.row);
    var color = Game.configMap.Color;
    _showFiche(x, y, color === 'black' ? 'black' : 'white');
    if (color == 'black' || color == 'white') {
      Game.Reversi.doMove(x, y).then(function () {
        //Succes -> check game state
        return Game.getCurrentGameState();
      })["catch"](function (error) {
        console.log(error.message);
      });
    }
  };
  var _doMove = function _doMove(x, y) {
    var move = {
      X: x,
      Y: y,
      GameToken: Game.configMap.Token,
      PlayerToken: Game.configMap.playerToken
    };
    return Game.API.makeMove(move);
  };
  function _showFiche(x, y, color) {
    var cellSelector = ".grid-item[data-row=\"".concat(y, "\"][data-col=\"").concat(x, "\"]");
    var cellElement = document.querySelector(cellSelector);
    var fiche = document.createElement('div');
    fiche.classList.add('fiche');
    fiche.classList.add("".concat(color, "-piece"));
    cellElement.innerHTML = '';
    cellElement.append(fiche);
  }
  function _initBoard(boardData) {
    var boardContainer = document.getElementById('board-container');
    boardContainer.innerHTML = Game.Template.parseTemplate('gameboard.body', {
      board: boardData
    });
  }
  function turnStatus(colour) {
    var turnContainer = document.getElementById('turn-container');
    var message = 'It is currently ' + String(colour).toLowerCase() + "'s turn.";
    turnContainer.innerHTML = Game.Template.parseTemplate('turn.turn-text', {
      text: message
    });
  }
  function _updateBoard(boardData) {
    var boardContainer = document.getElementById('board-container');
    var gridItems = boardContainer.querySelectorAll('.grid-item');
    var _iterator = _createForOfIteratorHelper(gridItems),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var gridItem = _step.value;
        var x = parseInt(gridItem.dataset.col);
        var y = parseInt(gridItem.dataset.row);
        var color = boardData[y][x];

        // Get the current fiche element from the gridItem
        var currentFiche = gridItem.querySelector('.fiche');
        var currentColorValue = void 0;
        if (currentFiche) {
          // If there's a fiche, determine its current color value
          if (currentFiche.classList.contains('white-piece')) {
            currentColorValue = 1;
          } else if (currentFiche.classList.contains('black-piece')) {
            currentColorValue = 2;
          } else {
            currentColorValue = 0;
          }
        } else {
          currentColorValue = 0;
        }
        if (currentColorValue !== color) {
          // Colors don't match, replace the fiche
          gridItem.innerHTML = ''; // Clear any existing fiche
          var fiche = document.createElement('div');
          if (color === 1) {
            fiche.classList.add('fiche', 'white-piece');
          } else if (color === 2) {
            fiche.classList.add('fiche', 'black-piece');
          } else {
            fiche.classList.add('fiche', 'empty-piece');
            fiche.addEventListener('click', cellClickListener);
          }
          gridItem.append(fiche);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  return {
    init: _init,
    showFiche: _showFiche,
    initBoard: _initBoard,
    updateBoard: _updateBoard,
    doMove: _doMove,
    turnStatus: turnStatus,
    cellClickListener: cellClickListener
  };
}();
Game.Stats = function () {
  var configMap = {};
  var occupiedChart, capturedChart;
  function _init() {
    _initCharts();
  }
  function _initCharts() {
    occupiedChart = new Chart(document.getElementById('occupiedChart').getContext('2d'), {
      type: 'line',
      data: {
        labels: [],
        // Dynamically set, so no need to set this.
        datasets: [{
          label: 'White',
          data: [],
          borderColor: 'gray',
          backgroundColor: 'white'
        }, {
          label: 'Black',
          data: [],
          borderColor: 'black',
          backgroundColor: 'black'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
    capturedChart = new Chart(document.getElementById('capturedChart').getContext('2d'), {
      type: 'bar',
      // Bar chart
      data: {
        labels: ['White', 'Black'],
        // Labels for the players
        datasets: [{
          label: 'Captured Opponent Pieces',
          data: [0, 0],
          backgroundColor: ['gray', 'black']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        // Set to false to control the aspect ratio
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  function addOccupiedChartData(board) {
    if (!occupiedChart) {
      console.error("Something's wrong with occupiedChart!");
      return;
    }
    var whites = 0;
    var blacks = 0;
    var _iterator2 = _createForOfIteratorHelper(board),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var row = _step2.value;
        var _iterator3 = _createForOfIteratorHelper(row),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var value = _step3.value;
            if (value == 1) {
              whites++;
            } else if (value == 2) {
              blacks++;
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    var whitePercentage = whites / 64 * 100;
    var blackPercentage = blacks / 64 * 100;

    // Adds date
    var currentDate = new Date();
    var label = currentDate.toLocaleTimeString(); // You can use a timestamp as the label
    occupiedChart.data.labels.push(label);

    // Push data points
    occupiedChart.data.datasets[0].data.push(whitePercentage);
    occupiedChart.data.datasets[1].data.push(blackPercentage);

    // Update the chart
    occupiedChart.update();
  }
  function addCapturedChartData(oldBoard, newBoard) {
    if (!capturedChart) {
      console.error("Something's wrong with capturedChart!");
      return;
    }
    var oldBoardParsed = JSON.parse(oldBoard);
    var newBoardParsed = JSON.parse(newBoard);
    var whiteCaptured = 0;
    var blackCaptured = 0;
    for (var i = 0; i < oldBoardParsed.length; i++) {
      for (var j = 0; j < oldBoardParsed[i].length; j++) {
        if (oldBoardParsed[i][j] !== 0 && oldBoardParsed[i][j] !== newBoardParsed[i][j]) {
          if (oldBoardParsed[i][j] === 1) {
            // White piece captured
            blackCaptured++;
          } else if (oldBoardParsed[i][j] === 2) {
            // Black piece captured
            whiteCaptured++;
          }
        }
      }
    }

    // Add data, not replace
    capturedChart.data.datasets[0].data[0] += whiteCaptured;
    capturedChart.data.datasets[0].data[1] += blackCaptured;

    // Update the chart
    capturedChart.update();
  }
  return {
    init: _init,
    addOccupiedChartData: addOccupiedChartData,
    addCapturedChartData: addCapturedChartData
  };
}();
Game.Template = function () {
  var _getTemplate = function _getTemplate(templateName) {
    var templates = spa_templates.templates;
    var _iterator4 = _createForOfIteratorHelper(templateName.split('.')),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var tl = _step4.value;
        templates = templates[tl];
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    return templates;
  };
  var _parseTemplate = function _parseTemplate(templateName, data) {
    var template = _getTemplate(templateName);
    return template(data);
  };
  var _init = function _init() {
    Handlebars.registerHelper('isWhitePiece', function (player) {
      return player === 1;
    });
    Handlebars.registerHelper('isBlackPiece', function (player) {
      return player === 2;
    });
  };
  return {
    parseTemplate: _parseTemplate,
    init: _init,
    getTemplate: _getTemplate
  };
}();