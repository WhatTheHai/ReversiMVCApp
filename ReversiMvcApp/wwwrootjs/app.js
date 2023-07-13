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
    gameState: ""
  };
  var configMap = {
    apiUrl: "",
    playerToken: "",
    Token: ""
  };

  // Private function init
  var privateInit = function privateInit(url, playerToken, Token) {
    configMap.apiUrl = url;
    configMap.playerToken = playerToken;
    configMap.Token = Token;
    console.log(configMap);
    setInterval(_getCurrentGameState, 2000);
    //afterInit()
    Game.Reversi.init();
  };
  // Waarde/object geretourneerd aan de outer scope

  var _getCurrentGameState = function _getCurrentGameState() {
    stateMap.gameState = Game.Model.getGameState(configMap.Token);
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
    loadBoardCells();
  };
  var cellClickListener = function cellClickListener() {
    var x = parseInt(this.dataset.row);
    var y = parseInt(this.dataset.col);
    var random = Math.floor(Math.random() * 2);
    var color = 'black';
    if (random == 0) {
      showFiche(x, y, 'black');
    } else {
      showFiche(x, y, 'white');
    }
  };
  function showFiche(x, y, color) {
    var cellSelector = ".grid-item[data-row=\"".concat(x, "\"][data-col=\"").concat(y, "\"]");
    var cell = document.querySelector(cellSelector);
    if (cell) {
      var fiche = document.createElement('div');
      fiche.className = "".concat(color, "-piece fiche");
      cell.appendChild(fiche);
      cell.removeEventListener('click', cellClickListener);
    } else {
      console.error("Grid item at row ".concat(x, ", column ").concat(y, " not found."));
    }
  }
  function loadBoardCells() {
    var boardContainer = document.getElementById('board-container');
    var boardSize = 8;
    for (var row = 1; row <= boardSize; row++) {
      for (var col = 1; col <= boardSize; col++) {
        var cell = document.createElement('div');
        cell.className = 'grid-item';
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.addEventListener('click', cellClickListener);
        boardContainer.appendChild(cell);
      }
    }
  }
  return {
    init: privateInit,
    showFiche: showFiche,
    showBoard: loadBoardCells
  };
}();
Game.Data = function () {
  var stateMap = {
    enviroment: 'development'
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
    var url = "/Game/".concat(token, "/turn");
    return Game.Data.get(url).then(function (data) {
      if (data !== "Black" && data !== "White") {
        throw new Error("Value gameState is invalid: ".concat(data));
      } else {
        return data;
      }
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