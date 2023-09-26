Handlebars.registerPartial("fiche", Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "  <div class=\"black-piece fiche\"></div>\r\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(alias1,(lookupProperty(helpers,"isWhitePiece")||(depth0 && lookupProperty(depth0,"isWhitePiece"))||container.hooks.helperMissing).call(alias1,(depth0 != null ? lookupProperty(depth0,"player") : depth0),{"name":"isWhitePiece","hash":{},"data":data,"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":29}}}),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data,"loc":{"start":{"line":4,"column":2},"end":{"line":8,"column":9}}})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    return "    <div class=\"white-piece fiche\"></div>\r\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "    <div class=\"empty-piece fiche\" onclick=\"Game.Reversi.cellClickListener.call(this)\"></div>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(alias1,(lookupProperty(helpers,"isBlackPiece")||(depth0 && lookupProperty(depth0,"isBlackPiece"))||container.hooks.helperMissing).call(alias1,(depth0 != null ? lookupProperty(depth0,"player") : depth0),{"name":"isBlackPiece","hash":{},"data":data,"loc":{"start":{"line":1,"column":6},"end":{"line":1,"column":27}}}),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":9,"column":7}}})) != null ? stack1 : "");
},"useData":true}));
this["spa_templates"] = this["spa_templates"] || {};
this["spa_templates"]["templates"] = this["spa_templates"]["templates"] || {};
this["spa_templates"]["templates"]["feedbackWidget"] = this["spa_templates"]["templates"]["feedbackWidget"] || {};
this["spa_templates"]["templates"]["feedbackWidget"]["body"] = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div id=\"feedback-container\" class=\"fade-in feedback-container--"
    + alias4(((helper = (helper = lookupProperty(helpers,"status") || (depth0 != null ? lookupProperty(depth0,"status") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data,"loc":{"start":{"line":1,"column":64},"end":{"line":1,"column":74}}}) : helper)))
    + "\"> \r\n    <header class=\" feedback-top-bar\">\r\n    <button class=\"button button--state-close\" onclick=\"feedbackWidget.hide()\">\r\n        X\r\n    </button>\r\n    </header>\r\n    <article class=\"feedback-text\">\r\n        <i class=\"feedback-text--emoji\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"emoji") || (depth0 != null ? lookupProperty(depth0,"emoji") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"emoji","hash":{},"data":data,"loc":{"start":{"line":8,"column":40},"end":{"line":8,"column":49}}}) : helper)))
    + "</i>\r\n        <div class=\"feedback-text--content\">\r\n            <p class=\"feedback-text--text\">\r\n                "
    + alias4(((helper = (helper = lookupProperty(helpers,"text") || (depth0 != null ? lookupProperty(depth0,"text") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"text","hash":{},"data":data,"loc":{"start":{"line":11,"column":16},"end":{"line":11,"column":24}}}) : helper)))
    + "\r\n            </p>\r\n            <p class=\"feedback-text--quote\">\r\n                "
    + alias4(((helper = (helper = lookupProperty(helpers,"quote") || (depth0 != null ? lookupProperty(depth0,"quote") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"quote","hash":{},"data":data,"loc":{"start":{"line":14,"column":16},"end":{"line":14,"column":25}}}) : helper)))
    + "\r\n            </p>\r\n        </div>\r\n    </article>\r\n    <footer>\r\n        <button class=\"button button--state-success\" onclick=\"feedbackWidget.hide()\">Accept</button>\r\n        <button class=\"button button--state-danger\" onclick=\"feedbackWidget.hide()\">Decline</button>\r\n    </footer>\r\n</div>";
},"useData":true});
this["spa_templates"]["templates"]["gameboard"] = this["spa_templates"]["templates"]["gameboard"] || {};
this["spa_templates"]["templates"]["gameboard"]["body"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <div class=\"row-container row-"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"index") || (data && lookupProperty(data,"index"))) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"index","hash":{},"data":data,"loc":{"start":{"line":2,"column":34},"end":{"line":2,"column":44}}}) : helper)))
    + "\">\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,depth0,{"name":"each","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":8},"end":{"line":7,"column":17}}})) != null ? stack1 : "")
    + "    </div>\r\n";
},"2":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            <div class=\"grid-item\" data-row=\""
    + alias1(container.lambda((container.data(data, 1) && lookupProperty(container.data(data, 1),"index")), depth0))
    + "\" data-col=\""
    + alias1(((helper = (helper = lookupProperty(helpers,"index") || (data && lookupProperty(data,"index"))) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"index","hash":{},"data":data,"loc":{"start":{"line":4,"column":70},"end":{"line":4,"column":80}}}) : helper)))
    + "\">\r\n"
    + ((stack1 = container.invokePartial(lookupProperty(partials,"fiche"),depth0,{"name":"fiche","hash":{"player":depth0},"data":data,"indent":"                ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "            </div>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"board") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":9,"column":9}}})) != null ? stack1 : "");
},"usePartial":true,"useData":true,"useDepths":true});
this["spa_templates"]["templates"]["turn"] = this["spa_templates"]["templates"]["turn"] || {};
this["spa_templates"]["templates"]["turn"]["turn-text"] = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div>\r\n<h5>"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"text") || (depth0 != null ? lookupProperty(depth0,"text") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"text","hash":{},"data":data,"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":12}}}) : helper)))
    + "</h5>\r\n</div>";
},"useData":true});