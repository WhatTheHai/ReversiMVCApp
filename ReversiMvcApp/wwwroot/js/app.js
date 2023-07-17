"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
      var elem = document.getElementById(this._elementId);
      elem.style.display = "block";
      var textElement = elem.querySelector('.feedback-text--text');
      textElement.textContent = message;
      if (type == "success") {
        $(elem).attr("class", "feedback-container--success");
        $(".feedback-text--emoji").text("✔️");
      } else {
        $(elem).attr("class", "feedback-container--danger");
        $(".feedback-text--emoji").text("❌");
      }
      $(elem).addClass("fade-in");
      this.log({
        message: message,
        type: type
      });
    }
  }, {
    key: "hide",
    value: function hide() {
      var elem = document.getElementById(this._elementId);
      elem.classList.add("fade-out");
      setTimeout(function () {
        elem.style.display = "none";
        elem.classList.remove("fade-out");
        elem.classList.remove("fade-in");
      }, 3000);
    }
  }, {
    key: "log",
    value: function log(message) {
      var allMessages = JSON.parse(localStorage.getItem("feedback_widget"));
      if (allMessages == null) {
        allMessages = [];
      } else if (allMessages.length >= 10) {
        allMessages.splice(0, 1);
      }
      allMessages.push(message);
      localStorage.setItem("feedback_widget", JSON.stringify(allMessages));
    }
  }, {
    key: "removeLog",
    value: function removeLog() {
      localStorage.removeItem("feedback_widget");
    }
  }, {
    key: "history",
    value: function history() {
      var allMessages = JSON.parse(localStorage.getItem("feedback_widget"));
      var result = "";
      allMessages.forEach(function (message) {
        result += "type ".concat(message["type"], " - ").concat(message["message"], " \n");
      });
      console.log(result);
    }
  }]);
  return FeedbackWidget;
}();
var Game = function (url) {
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

  // Private function init
  var privateInit = function privateInit(url, playerToken, Token) {
    configMap.apiUrl = url;
    configMap.playerToken = playerToken;
    configMap.Token = Token;
    console.log(configMap);
    _getCurrentGameState();
    setInterval(_getCurrentGameState, 2000);
    //afterInit()
    //Game.Reversi.init()
  };
  // Waarde/object geretourneerd aan de outer scope

  var initializeOnce = false;
  var getColor = function getColor() {
    if (configMap.playerToken == stateMap.gameState.player1Token) {
      return 'white';
    } else {
      return 'black';
    }
  };
  var _getCurrentGameState = function _getCurrentGameState() {
    Game.Model.getGameState(configMap.Token).then(function (data) {
      stateMap.gameState = data;
      Game.Reversi.init();
      if (!initializeOnce) {
        configMap.Color = getColor();
        initializeOnce = true;
      }
    })["catch"](function (error) {
      console.log(error.message);
    });
  };
  return {
    init: privateInit,
    configMap: configMap,
    stateMap: stateMap
  };
}('/api/url');
Game.Reversi = function () {
  var configMap = {};
  var privateInit = function privateInit() {
    var boardData = JSON.parse(Game.stateMap.gameState.board);
    loadBoard(boardData);
  };
  var cellClickListener = function cellClickListener() {
    var x = parseInt(this.dataset.row);
    var y = parseInt(this.dataset.col);
    var random = Math.floor(Math.random() * 2);
    var color = Game.configMap.Color;
    if (color == 'black') {
      showFiche(x, y, 'black');
    } else {
      showFiche(x, y, 'white');
    }
  };
  function showFiche(x, y, color) {
    var cell = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var cellSelector = ".grid-item[data-row=\"".concat(x, "\"][data-col=\"").concat(y, "\"]");
    cell = cell || document.querySelector(cellSelector);

    // Incase the board or cell is incorrect, helpful for debugging
    if (!cell) {
      console.error("Grid item at row ".concat(x, ", column ").concat(y, " not found."));
      return;
    }

    // Get the current fiche
    var existingFiche = cell.querySelector('.fiche');

    // Remove if it's a different colour, main purpose is for when
    // the data changes.
    if (existingFiche) {
      if (existingFiche.classList.contains("".concat(color, "-piece"))) {
        return;
      } else {
        existingFiche.remove();
      }
    }

    // If it's a nothing piece, it's clickable, if it's either a black or white piece
    // add the piece and make it unclickable for the user.
    if (color) {
      var fiche = document.createElement('div');
      fiche.className = "".concat(color, "-piece fiche");
      cell.appendChild(fiche);
      cell.removeEventListener('click', cellClickListener);
    } else {
      // If the color is blank, remove the fiche from the cell.
      cell.innerHTML = '';
      cell.addEventListener('click', cellClickListener);
    }
  }
  function loadBoard(boardData) {
    var boardContainer = document.getElementById('board-container');
    var boardSize = boardData.length;
    for (var row = 0; row < boardSize; row++) {
      for (var col = 0; col < boardSize; col++) {
        var cellSelector = ".grid-item[data-row=\"".concat(row, "\"][data-col=\"").concat(col, "\"]");
        var existingCell = document.querySelector(cellSelector);
        var cell = existingCell || document.createElement('div');
        cell.className = 'grid-item';
        cell.dataset.row = row;
        cell.dataset.col = col;
        if (!existingCell) {
          boardContainer.appendChild(cell);
        }
        var cellValue = boardData[row][col];
        var color = '';
        if (cellValue === 1) {
          color = 'white';
        } else if (cellValue === 2) {
          color = 'black';
        }
        showFiche(row, col, color, cell);
        if (!existingCell && !color) {
          cell.addEventListener('click', cellClickListener);
        }
      }
    }
  }
  return {
    init: privateInit,
    showFiche: showFiche,
    showBoard: loadBoard
  };
}();
Game.Data = function () {
  var stateMap = {
    enviroment: 'production'
  };
  var configMap = {
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
      return $.get(Game.configMap.apiUrl + url).then(function (r) {
        return r;
      })["catch"](function (e) {
        console.log(e.message);
      });
    }
  };
  var privateInit = function privateInit(environment) {
    if (environment != 'production' && environment != 'development') {
      throw new Error('Environment parameter is invalid');
    }
    stateMap.enviroment = environment;
  };
  return {
    get: get,
    init: privateInit
  };
}();
Game.Model = function () {
  var configMap = {};
  var privateInit = function privateInit() {};
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
  var _getGameState = function _getGameState(token) {
    var url = "/Game/".concat(token);
    return Game.Data.get(url).then(function (data) {
      return data;
    })["catch"](function (error) {
      console.log(error.message);
    });
  };
  return {
    init: privateInit,
    getWeather: _getWeather,
    getGameState: _getGameState
  };
}();