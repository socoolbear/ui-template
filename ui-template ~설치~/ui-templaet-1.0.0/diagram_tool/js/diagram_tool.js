// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to)
{
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

/**
 * Namespace
 */
var SC = {};

/**
 * Observer
 */
SC.Observer = function()
{
  // ----------------------------------------------------------------
  // Constants:
  // ----------------------------------------------------------------
  var className = "SC.Observer ::: ";
  SC.log.debug(className + "start");

  this.update = function() // abstract method
  {
    SC.log.debug(className + "abstract update()");
  };
};

/**
 * Observable
 */
SC.Observable = function()
{
  // ----------------------------------------------------------------
  // Constants:
  // ----------------------------------------------------------------
  var className = "SC.Observable ::: ";
  SC.log.debug(className + "start");
  // ----------------------------------------------------------------
  // Variables:
  // ----------------------------------------------------------------
  this._observerCollection = [];

  // ----------------------------------------------------------------
  // Methods:
  // ----------------------------------------------------------------
  this.addObserver = function(obs)
  {
    this._observerCollection.push(obs);
  };

  this.removeObserver = function(obs)
  {
    for ( var index in this._observerCollection) {
      if (this._observerCollection[index] === obs) {
        this._observerCollection.splice(index, 1);
      }
    }
  };

  this.notifyObservers = function()
  {
    SC.log.debug(className + "notifyObservers()");
    for ( var index in this._observerCollection) {
      var obs = this._observerCollection[index];
      obs.update();
    }
  };

  this.countObservers = function()
  {
    return this._observerCollection.length;
  };

  this.getLastObserverId = function()
  {
    if (this._observerCollection.length > 0) {
      return this._observerCollection[this._observerCollection.length - 1]._id;
    }
    else {
      return 0;
    }
  };

  // ----------------------------------------------------------------
  // Constructors:
  // ----------------------------------------------------------------

  // ----------------------------------------------------------------
  // Classes or Interfaces:
  // ----------------------------------------------------------------
};

/**
 * Item
 */
SC.Item = function(canvas)
{
  // ----------------------------------------------------------------
  // Constants:
  // ----------------------------------------------------------------
  var className = "SC.Item ::: ";
  SC.log.debug(className + "start");

  // ----------------------------------------------------------------
  // Variables:
  // ----------------------------------------------------------------
  this._id = null;
  this._canvas = null;
  this._src = null;
  this._element = null;

  // ----------------------------------------------------------------
  // Constructors:
  // ----------------------------------------------------------------
  // SC.Observer.call(this);// function 추가 (상속과 비슷함)

  this._canvas = canvas;
  // ----------------------------------------------------------------
  // Methods:
  // ----------------------------------------------------------------
  this.getElement = function()
  {
    return this._element;
  };

  // ----------------------------------------------------------------
  // Classes or Interfaces:
  // ----------------------------------------------------------------
};

SC.CanvasItemType = {
  RECT : 0,
  LINE : 1,
  IMAGE : 2
};

SC.CanvasItem = function(pCanvas, pId)
{
  // ----------------------------------------------------------------
  // Constants:
  // ----------------------------------------------------------------
  var className = "SC.CanvasItem ::: ";
  SC.log.debug(className + "start");

  // ----------------------------------------------------------------
  // Variables:
  // ----------------------------------------------------------------
  this._vertexSet = null;
  this._type = null;
  this._isSelected = false;
  // ----------------------------------------------------------------
  // Constructors:
  // ----------------------------------------------------------------
  SC.Item.call(this, pCanvas);// function 추가 (상속과 비슷함)

  if (pId != null) {
    this._id = pId;
  }
  else {
    this._id = eval(pCanvas.getLastObserverId()) + 1;
  }

  // ----------------------------------------------------------------
  // Methods:
  // ----------------------------------------------------------------

  this.getX = function()
  {
    return this._element.attr("x");
  };

  this.getY = function()
  {
    return this._element.attr("y");
  };

  this.getWidth = function()
  {
    return this._element.attr("width");
  };

  this.getHeight = function()
  {
    return this._element.attr("height");
  };

  this.doSelect = function()
  {
    this._isSelected = true;
    this._vertexSet.doSelect();
  };

  this.doUnSelect = function()
  {
    this._isSelected = false;
    this._vertexSet.hide();
  };

  this.getVertexItem = function(position)
  {
    return this._vertexSet.getVertexItem(position);
  };

  this.remove = function()
  {
    this._canvas.removeCanvasItemById(this._id);
    this._element.remove();
    // this._vertexSet.doDeatchFromAttachmentItem();
    this._vertexSet.remove();
  };

  // ----------------------------------------------------------------
  // Abstarct Methods:
  // ----------------------------------------------------------------
  this.initOpath = function()
  {
  };

  this.doMove = function()
  {
  };

  this.toFront = function()
  {
  };

  this.toBack = function()
  {
  };

  // ----------------------------------------------------------------
  // Event Functions:
  // ----------------------------------------------------------------
  // Drag & Drop Event
  this.onMouseDown = function()
  {
    // this.toFront();
    if (!this.thisItem._isSelected) {
      this.canvas.doUnSelectItemAll();
      this.thisItem.doSelect();
    }
    this.canvas.doInitOpathSelectedItems();
  };
  this.onMouseMove = function(dx, dy)
  {
    this.canvas.doMoveSelectedItems(dx, dy);
  };
  this.onMouseUp = function()
  {
    this.canvas.doCheckAndDeatchSelectedItems();
  };

  // ----------------------------------------------------------------
  // Classes or Interfaces:
  // ----------------------------------------------------------------
};

SC.LineCanvasItem = function(pCanvas, pId, pMx, pMy, pLx, pLy, pVertexSetData)
{
  // ----------------------------------------------------------------
  // Constants:
  // ----------------------------------------------------------------
  var className = "SC.LineCanvasItem ::: ";
  SC.log.debug(className + "start");

  // ----------------------------------------------------------------
  // Variables:
  // ----------------------------------------------------------------
  this._Mx = 20;
  this._My = 20;
  this._Lx = 90;
  this._Ly = 90;

  // ----------------------------------------------------------------
  // Constructors:
  // ----------------------------------------------------------------
  SC.CanvasItem.call(this, pCanvas, pId);// function 추가 (상속과 비슷함)

  if (pMx != null) {
    this._Mx = pMx;
  }

  if (pMy != null) {
    this._My = pMy;
  }

  if (pLx != null) {
    this._Lx = pLx;
  }

  if (pLy != null) {
    this._Ly = pLy;
  }

  // "M20 20 L90 90"
  this.tempStrPath = "M" + this._Mx + " " + this._My + " L" + this._Lx + " "
      + this._Ly;

  this._element = this._canvas.getRaphael().path(this.tempStrPath);

  this._element.attr({
    stroke : "#000000",
    opacity : 1,
    "stroke-width" : 2,
    cursor : "hand"
  });

  this._vertexSet = SC.VertexSetFactory.createVertexSet("line", this);

  if (pVertexSetData != null) {
    this._vertexSet.setDatas(pVertexSetData);
  }

  this._element.vertexSet = this._vertexSet;
  this.doUnSelect();
  this._element.canvas = this._canvas;

  delete tempStrPath;

  this._element.thisItem = this;

  this._type = SC.CanvasItemType.LINE;

  // ----------------------------------------------------------------
  // Methods:
  // ----------------------------------------------------------------
  this.doResize = function(vertexRadius)
  {

    this._Mx = this._vertexSet._observerCollection[0]._element.attr("x")
        + vertexRadius;

    this._My = this._vertexSet._observerCollection[0]._element.attr("y")
        + vertexRadius;

    this._Lx = this._vertexSet._observerCollection[1]._element.attr("x")
        + vertexRadius;

    this._Ly = this._vertexSet._observerCollection[1]._element.attr("y")
        + vertexRadius;

    this._element.attr({
      path : [ "M", this._Mx, this._My, "L", this._Lx, this._Ly ]
    });
  };

  this.initOpath = function()
  {
    this.oMx = this._element.attr('path')[0][1];
    this.oMy = this._element.attr('path')[0][2];
    this.oLx = this._element.attr('path')[1][1];
    this.oLy = this._element.attr('path')[1][2];
  };

  this.doMove = function(dx, dy)
  {
    var nMx = this.oMx + dx;
    var nMy = this.oMy + dy;
    var nLx = this.oLx + dx;
    var nLy = this.oLy + dy;

    // this._element.attr({
    // path : [ "M", nMx < 0 ? 5 : nMx, nMy < 0 ? 5 : nMy, "L",
    // nLx < 0 ? 5 : nLx, nLy < 0 ? 5 : nLy ]
    // });
    this._element.attr({
      path : [ "M", nMx, nMy, "L", nLx, nLy ]
    });

    this._Mx = this._element.attr('path')[0][1];
    this._My = this._element.attr('path')[0][2];
    this._Lx = this._element.attr('path')[1][1];
    this._Ly = this._element.attr('path')[1][2];

    nMx = null;
    nMy = null;
    nLx = null;
    nLy = null;

    this._vertexSet.doMove(dx, dy);
  };

  this.toFront = function()
  {
    this._element.toFront();
    this._vertexSet.toFront();
  };

  this.toBack = function()
  {
    this._element.toBack();
    this._vertexSet.toFront();
  };

  this.hasAttachmentToReverse = function(item)
  {
    return this._vertexSet.hasAttachmentToReverse(item);
  };

  // ----------------------------------------------------------------
  // Events:
  // ----------------------------------------------------------------
  this._element.drag(this.onMouseMove, this.onMouseDown, this.onMouseUp);

  $(this._element.node).mousedown(this, function(event)
  {
    var thisItem = event.data;
    thisItem._canvas.hideContextmenu(event);
    // 이벤트 버블 방지용
    return false;
  });

  $(this._element.node).bind("contextmenu", this, function(event)
  {
    // 우클릭 시 이벤트 버블 방지용
    var thisItme = event.data;
    var items = thisItme._canvas.getSelectedCanvasItems();
    thisItme._canvas.showContextmenu(event, items);
    return false;
  });

  // ----------------------------------------------------------------
  // Classes or Interfaces:
  // ----------------------------------------------------------------
};

SC.RectCanvasItem = function(pCanvas, pId, px, py, pWidth, pHeight,
    pVertexSetData)
{
  // ----------------------------------------------------------------
  // Constants:
  // ----------------------------------------------------------------
  var className = "SC.RectCanvasItem ::: ";
  SC.log.debug(className + "start");

  // ----------------------------------------------------------------
  // Variables:
  // ----------------------------------------------------------------
  this._x = 10;
  this._y = 10;
  this._width = 50;
  this._height = 50;
  // ----------------------------------------------------------------
  // Constructors:
  // ----------------------------------------------------------------
  SC.CanvasItem.call(this, pCanvas, pId);// function 추가 (상속과 비슷함)

  if (px != null) {
    this._x = px;
  }

  if (px != null) {
    this._y = py;
  }

  if (pWidth != null) {
    this._width = pWidth;
  }

  if (pHeight != null) {
    this._height = pHeight;
  }

  this._element = this._canvas.getRaphael().rect(this._x, this._y, this._width,
      this._height);

  this._element.attr({
    fill : "#ffffff",
    opacity : 1,
    cursor : "hand"
  });

  this._vertexSet = SC.VertexSetFactory.createVertexSet("rect", this);
  if (pVertexSetData != null) {
    this._vertexSet.setDatas(pVertexSetData);
  }

  this._element.vertexSet = this._vertexSet;
  this.doUnSelect();
  this._element.canvas = this._canvas;

  this._element.thisItem = this;
  this._type = SC.CanvasItemType.RECT;

  // ----------------------------------------------------------------
  // Methods:
  // ----------------------------------------------------------------
  this.doResize = function(nx, ny, nw, nh)
  {
    this._element.attr({
      x : nx,
      y : ny,
      width : nw,
      height : nh
    });

    this._x = nx;
    this._y = ny;
    this._width = nw;
    this._height = nh;
  };

  this.getNhVertexItem = function(lx, ly)
  {
    return this._vertexSet.getNhVertexItem(lx, ly);
  };

  this.initOpath = function()
  {
    this.ox = this._element.attr("x");
    this.oy = this._element.attr("y");
    this._vertexSet.initOpathAttachmentItems();
  };

  this.doMove = function(dx, dy)
  {
    this.nx = this.ox + dx;
    this.ny = this.oy + dy;

    // this.attr({
    // x : this.nx < 0 ? 5 : this.nx,
    // y : this.ny < 0 ? 5 : this.ny
    // });
    this._element.attr({
      x : this.nx,
      y : this.ny
    });

    this._vertexSet.doMove(dx, dy);
    this._vertexSet.updateAttachmentVertexItemsPosition(dx, dy);

    this._x = this._element.attr("x");
    this._y = this._element.attr("y");
    this._width = this._element.attr("width");
    this._height = this._element.attr("height");
  };

  this.toFront = function()
  {
    this._element.toFront();
    this._vertexSet.toFront();
  };

  this.toBack = function()
  {
    this._element.toBack();
    this._vertexSet.toFront();
  };

  // ----------------------------------------------------------------
  // Events:
  // ----------------------------------------------------------------
  this._element.drag(this.onMouseMove, this.onMouseDown, this.onMouseUp);

  $(this._element.node).mousedown(this, function(event)
  {
    var thisItem = event.data;
    thisItem._canvas.hideContextmenu(event);
    // 이벤트 버블 방지용
    return false;
  });

  $(this._element.node).bind("contextmenu", this, function(event)
  {
    // 우클릭 시 이벤트 버블 방지용
    var thisItme = event.data;
    var items = thisItme._canvas.getSelectedCanvasItems();
    thisItme._canvas.showContextmenu(event, items);
    return false;
  });

  // ----------------------------------------------------------------
  // Classes or Interfaces:
  // ----------------------------------------------------------------
};

SC.ImageCanvasItem = function(pCanvas, src, pId, px, py, pWidth, pHeight,
    pVertexSetData)
{
  // ----------------------------------------------------------------
  // Constants:
  // ----------------------------------------------------------------
  var className = "SC.ImageCanvasItem ::: ";
  SC.log.debug(className + "start");

  // ----------------------------------------------------------------
  // Variables:
  // ----------------------------------------------------------------
  this._x = 10;
  this._y = 10;
  this._width = 50;
  this._height = 50;
  // ----------------------------------------------------------------
  // Constructors:
  // ----------------------------------------------------------------
  SC.CanvasItem.call(this, pCanvas, pId);// function 추가 (상속과 비슷함)

  if (src != null) {
    this._src = src;
  }

  if (px != null) {
    this._x = px;
  }

  if (px != null) {
    this._y = py;
  }

  if (pWidth != null) {
    this._width = pWidth;
  }

  if (pHeight != null) {
    this._height = pHeight;
  }

  this._element = this._canvas.getRaphael().image(this._src, this._x, this._y,
      this._width, this._height);

  this._element.attr({
    // fill : "#ffffff",
    // opacity : 1,
    cursor : "hand"
  });

  this._vertexSet = SC.VertexSetFactory.createVertexSet("rect", this);
  if (pVertexSetData != null) {
    this._vertexSet.setDatas(pVertexSetData);
  }

  this._element.vertexSet = this._vertexSet;
  this.doUnSelect();
  this._element.canvas = this._canvas;

  this._element.thisItem = this;
  this._type = SC.CanvasItemType.IMAGE;

  // ----------------------------------------------------------------
  // Methods:
  // ----------------------------------------------------------------
  this.doResize = function(nx, ny, nw, nh)
  {
    this._element.attr({
      x : nx,
      y : ny,
      width : nw,
      height : nh
    });

    this._x = nx;
    this._y = ny;
    this._width = nw;
    this._height = nh;
  };

  this.getNhVertexItem = function(lx, ly)
  {
    return this._vertexSet.getNhVertexItem(lx, ly);
  };

  this.initOpath = function()
  {
    this.ox = this._element.attr("x");
    this.oy = this._element.attr("y");
    this._vertexSet.initOpathAttachmentItems();
  };

  this.doMove = function(dx, dy)
  {
    this.nx = this.ox + dx;
    this.ny = this.oy + dy;

    // this.attr({
    // x : this.nx < 0 ? 5 : this.nx,
    // y : this.ny < 0 ? 5 : this.ny
    // });
    this._element.attr({
      x : this.nx,
      y : this.ny
    });

    this._vertexSet.doMove(dx, dy);
    this._vertexSet.updateAttachmentVertexItemsPosition(dx, dy);

    this._x = this._element.attr("x");
    this._y = this._element.attr("y");
    this._width = this._element.attr("width");
    this._height = this._element.attr("height");
  };

  this.toFront = function()
  {
    this._element.toFront();
    this._vertexSet.toFront();
  };

  this.toBack = function()
  {
    this._element.toBack();
    this._vertexSet.toFront();
  };

  // ----------------------------------------------------------------
  // Events:
  // ----------------------------------------------------------------
  this._element.drag(this.onMouseMove, this.onMouseDown, this.onMouseUp);

  $(this._element.node).mousedown(this, function(event)
  {
    var thisItem = event.data;
    thisItem._canvas.hideContextmenu(event);
    // 이벤트 버블 방지용
    return false;
  });

  $(this._element.node).bind("contextmenu", this, function(event)
  {
    // 우클릭 시 이벤트 버블 방지용
    var thisItme = event.data;
    var items = thisItme._canvas.getSelectedCanvasItems();
    thisItme._canvas.showContextmenu(event, items);
    return false;
  });

  // ----------------------------------------------------------------
  // Classes or Interfaces:
  // ----------------------------------------------------------------
};

/**
 * ToolbarItem
 */
SC.ToolbarItem = function(canvas)
{
  // ----------------------------------------------------------------
  // Constants:
  // ----------------------------------------------------------------
  var className = "SC.ToolbarItem ::: ";
  SC.log.debug(className + "start");

  // ----------------------------------------------------------------
  // Variables:
  // ----------------------------------------------------------------

  // ----------------------------------------------------------------
  // Constructors:
  // ----------------------------------------------------------------
  SC.Item.call(this, canvas);// function 추가 (상속과 비슷함)

  this._canvas = canvas;
  this._element = $("<img src='../image/icon-server.png'>");
  this._element.addClass("toolbar-item");
  this._element.width(50);
  this._element.height(50);

  // ----------------------------------------------------------------
  // Methods:
  // ----------------------------------------------------------------

  // ----------------------------------------------------------------
  // Classes or Interfaces:
  // ----------------------------------------------------------------
};

/**
 * LineToolbarItem
 */
SC.LineToolbarItem = function(canvas)
{
  // ----------------------------------------------------------------
  // Constants:
  // ----------------------------------------------------------------
  var className = "SC.LineToolbarItem ::: ";
  SC.log.debug(className + "start");

  // ----------------------------------------------------------------
  // Variables:
  // ----------------------------------------------------------------

  // ----------------------------------------------------------------
  // Constructors:
  // ----------------------------------------------------------------
  SC.ToolbarItem.call(this, canvas);// function 추가 (상속과 비슷함)
  this._element.attr("src", "../image/item-toolbar-line.png");

  // ----------------------------------------------------------------
  // Methods:
  // ----------------------------------------------------------------

  // Events:
  this._element.click(this._canvas, function(e)
  {
    var canvas = e.data;
    var lineItem = SC.ItemFactory.createCanvasItem("line", canvas);
    canvas.addItem(lineItem);
  });

  // ----------------------------------------------------------------
  // Classes or Interfaces:
  // ----------------------------------------------------------------
};

/**
 * RectToolbarItem
 */
SC.RectToolbarItem = function(canvas)
{
  // ----------------------------------------------------------------
  // Constants:
  // ----------------------------------------------------------------
  var className = "SC.RectToolbarItem ::: ";
  SC.log.debug(className + "start");

  // ----------------------------------------------------------------
  // Variables:
  // ----------------------------------------------------------------

  // ----------------------------------------------------------------
  // Constructors:
  // ----------------------------------------------------------------
  SC.ToolbarItem.call(this, canvas);// function 추가 (상속과 비슷함)
  this._element.attr("src", "../image/icon-toolbar-rect.png");

  // ----------------------------------------------------------------
  // Methods:
  // ----------------------------------------------------------------

  // Events:
  this._element.click(this._canvas, function(e)
  {
    var canvas = e.data;
    var rectItem = SC.ItemFactory.createCanvasItem("rect", canvas);
    canvas.addItem(rectItem);
  });

  // ----------------------------------------------------------------
  // Classes or Interfaces:
  // ----------------------------------------------------------------
};

SC.ImageToolbarItem = function(canvas, src, text)
{
  // ----------------------------------------------------------------
  // Constants:
  // ----------------------------------------------------------------
  var className = "SC.ServerToolbarItem ::: ";
  SC.log.debug(className + "start");

  // ----------------------------------------------------------------
  // Variables:
  // ----------------------------------------------------------------

  // ----------------------------------------------------------------
  // Constructors:
  // ----------------------------------------------------------------
  SC.ToolbarItem.call(this, canvas);// function 추가 (상속과 비슷함)
  this._src = src;
  this._element.attr("src", this._src);

  if (text != null) {
    this._text = text;
    this._element.attr("title", this._text);
  }

  // ----------------------------------------------------------------
  // Methods:
  // ----------------------------------------------------------------

  // Events:
  this._element.click(this, function(e)
  {
    var thisItem = e.data;
    var imageItem = SC.ItemFactory.createCanvasItem("image", thisItem._canvas,
        thisItem._src);
    canvas.addItem(imageItem);
  });

  // ----------------------------------------------------------------
  // Classes or Interfaces:
  // ----------------------------------------------------------------
};

/**
 * SaveToolbarItem
 */
SC.SaveToolbarItem = function(canvas)
{
  // ----------------------------------------------------------------
  // Constants:
  // ----------------------------------------------------------------
  var className = "SC.SaveToolbarItem ::: ";
  SC.log.debug(className + "start");

  // ----------------------------------------------------------------
  // Variables:
  // ----------------------------------------------------------------

  // ----------------------------------------------------------------
  // Constructors:
  // ----------------------------------------------------------------
  SC.ToolbarItem.call(this, canvas);// function 추가 (상속과 비슷함)
  this._element.attr("src", "../image/icon-save.png");

  // ----------------------------------------------------------------
  // Methods:
  // ----------------------------------------------------------------

  // ----------------------------------------------------------------
  // Events:
  // ----------------------------------------------------------------
  this._element.click(this._canvas, function(e)
  {
    var canvas = e.data;

    var jsonArray = canvas.parseItemsToJSON();

    // Ajax

    // insert
    var json = {
      "itemDatas" : jsonArray
    };

    // callback

    // alert(JSON.stringify(actionData));
    SC.log.debug(JSON.stringify(json));

    // canvas.doAttachItems();

    // 

    canvas = null;
  });

  // ----------------------------------------------------------------
  // Classes or Interfaces:
  // ----------------------------------------------------------------
};

/**
 * ItemFactory ::: Singleton Object
 */
SC.ItemFactory = {
  createToolbarItem : function(type, canvas, src, text)
  {
    if (type == "line") {
      return new SC.LineToolbarItem(canvas);
    }
    else if (type == "rect") {
      return new SC.RectToolbarItem(canvas);
    }
    else if (type == "image") {
      return new SC.ImageToolbarItem(canvas, src, text);
    }
    else if (type == "save") {
      return new SC.SaveToolbarItem(canvas);
    }
  },
  createCanvasItem : function(type, canvas, src)
  {
    if (type == "line") {
      return new SC.LineCanvasItem(canvas);
    }
    else if (type == "rect") {
      return new SC.RectCanvasItem(canvas);
    }
    else if (type == "image") {
      return new SC.ImageCanvasItem(canvas, src);
    }
  },
  createContextmenuItem : function(iconSrc, text)
  {
    var menuItem = null;
    menuItem = $("<div><img src='" + iconSrc + "'/> &nbsp;&nbsp;" + text
        + "</div>");
    return menuItem;
  }
};

/**
 * VertexPosition ::: Singleton Object
 */
SC.VertexPosition = {
  TOP_LEFT : 0,
  TOP_CENTER : 1,
  TOP_RIGHT : 2,
  MIDDLE_LEFT : 3,
  MIDDLE_RIGHT : 4,
  BOTTOM_LEFT : 5,
  BOTTOM_CENTER : 6,
  BOTTOM_RIGHT : 7
};

/**
 * VertexItemType ::: Singleton Object
 */
SC.VertexItemType = {
  RECT : 0,
  LINE : 1
};

/**
 * VertexItem
 */
SC.VertexItem = function(item)
{
  // ----------------------------------------------------------------
  // Constants:
  // ----------------------------------------------------------------
  var className = "SC.VertexItem ::: ";
  SC.log.debug(className + "start");

  // ----------------------------------------------------------------
  // Variables:
  // ----------------------------------------------------------------
  this._parentItem = null;
  this._x = 10;
  this._y = 10;
  this._radius = 3;
  this._position = 0;
  this._attachmentIds = new Array(); // json data temp
  this._attachmentVertexItems = new Array();
  // ----------------------------------------------------------------
  // Constructors:
  // ----------------------------------------------------------------
  SC.Item.call(this, item._canvas);// function 추가 (상속과 비슷함)

  this._parentItem = item;

  this._element = this._canvas.getRaphael().rect(this._x, this._y,
      this._radius * 2, this._radius * 2);

  this._element.attr({
    fill : "#ffffff"
  });

  this._element.parentItem = this._parentItem;

  this._element.radius = this._radius;

  this._element.canvas = this._canvas;

  this._element.attachmentVertexItems = this._attachmentVertexItems;

  // this._element.thisItem = this;

  this._id = eval(this._canvas.getLastVertexItemId()) + 1;

  this._canvas.addVertexItem(this);
  // ----------------------------------------------------------------
  // Methods:
  // ----------------------------------------------------------------
  this.show = function()
  {
    this._element.show();
  };

  this.hide = function()
  {
    this._element.hide();
  };

  this.toFront = function()
  {
    this._element.toFront();
  };

  this.doCheckAndDeatchItems = function()
  {
    var attachmentVertexItem = null;
    for ( var i = 0; i < this._attachmentVertexItems.length; i++) {
      attachmentVertexItem = this._attachmentVertexItems[i];
      if ((this._element.attr("x") != attachmentVertexItem._element.attr("x"))
          || (this._element.attr("y") != attachmentVertexItem._element
              .attr("y"))) {
        attachmentVertexItem.doDeatchTargetAttachmentVertexItems(this);
        this._attachmentVertexItems.remove(i, i);
        i--;
      }
    }
    attachmentVertexItem = null;
  };

  this.doAttachItem = function(item)
  {
    this._attachmentVertexItems.push(item);
  };

  this.doAttachItemToUseAttachmentIds = function()
  {
    var item = null;
    if (this._attachmentIds != null) {
      this._attachmentVertexItems = new Array();
      for ( var i = 0; i < this._attachmentIds.length; i++) {
        item = this._canvas.findVertexItemById(this._attachmentIds[i]);
        if (item != null) {
          this._attachmentVertexItems.push(item);
        }
      }
    }
    item = null;
  };

  this.doDeatchItems = function()
  {
    if (this._attachmentVertexItems.length > 0) {
      this._attachmentVertexItems.remove(0,
          this._attachmentVertexItems.length - 1);
    }
  };

  this.doDeatchFromAttachmentItem = function(item)
  {
    var attachmentVertexItem = null;
    if (this._attachmentVertexItems.length > 0) {
      for ( var i = 0; i < this._attachmentVertexItems.length; i++) {
        attachmentVertexItem = this._attachmentVertexItems[i];
        attachmentVertexItem.doDeatchTargetAttachmentVertexItems(item);
      }
    }
    attachmentVertexItem = null;
  };

  this.doDeatchTargetAttachmentVertexItems = function(item)
  {
    var attachmentVertexItem = null;
    if (this._attachmentVertexItems.length > 0) {
      for ( var i = 0; i < this._attachmentVertexItems.length; i++) {
        attachmentVertexItem = this._attachmentVertexItems[i];
        if (item === attachmentVertexItem) {
          this._attachmentVertexItems.remove(i, i);
        }
      }
    }
    attachmentVertexItem = null;
  };

  this.updateAttachmentVertexItemsPosition = function(dx, dy)
  {
    var attachmentVertexItem = null;
    var hasAttachment = false;
    for ( var i = 0; i < this._attachmentVertexItems.length; i++) {
      attachmentVertexItem = this._attachmentVertexItems[i];

      hasAttachment = attachmentVertexItem._parentItem
          .hasAttachmentToReverse(attachmentVertexItem);
      if (hasAttachment) {
        attachmentVertexItem.setLocation(this._element.attr("x"), this._element
            .attr("y"));
        attachmentVertexItem._parentItem.doResize(attachmentVertexItem._radius);
      }
      else {
        attachmentVertexItem._parentItem.doMove(dx, dy);
      }
    }
    attachmentVertexItem = null;
    hasAttachment = null;
  };

  this.doResizeAttachmentItems = function()
  {
    var attachmentVertexItem = null;
    for ( var i = 0; i < this._attachmentVertexItems.length; i++) {
      attachmentVertexItem = this._attachmentVertexItems[i];
      attachmentVertexItem.setLocation(this._element.attr("x"), this._element
          .attr("y"));
      attachmentVertexItem._parentItem.doResize(attachmentVertexItem._radius);
    }
    attachmentVertexItem = null;
  };

  this.initOpathAttachmentItems = function()
  {
    var attachmentVertexItem = null;
    for ( var i = 0; i < this._attachmentVertexItems.length; i++) {
      attachmentVertexItem = this._attachmentVertexItems[i];
      attachmentVertexItem._parentItem.initOpath();
    }
    attachmentVertexItem = null;
  };

  this.hasAttachment = function()
  {
    if (this._attachmentVertexItems.length > 0) {
      return true;
    }
    else {
      return false;
    }
  };

  this.setLocation = function(px, py)
  {
    this._element.attr({
      x : px,
      y : py
    });
  };

  this.getAttachmentIds = function()
  {
    var attachmentVertexItem = null;
    // var tempArray = new Array();
    this._attachmentIds = new Array();
    for ( var i = 0; i < this._attachmentVertexItems.length; i++) {
      attachmentVertexItem = this._attachmentVertexItems[i];
      // tempArray.push(attachmentVertexItem._id);
      this._attachmentIds.push(attachmentVertexItem._id);
    }
    attachmentVertexItem = null;
    // return tempArray;
    return this._attachmentIds;
  };

  this.remove = function()
  {
    this._canvas.removeVertexItemById(this._id);
    this._element.remove();
  };

  // event
  $(this._element.node).click(function()
  {
    // 이벤트 버블 방지용
    return false;
  });

  $(this._element.node).mousedown(this, function(event)
  {
    // 이벤트 버블 방지용
    return false;
  });

  // ----------------------------------------------------------------
  // Classes or Interfaces:
  // ----------------------------------------------------------------
};

SC.RectVertexItem = function(item)
{
  // ----------------------------------------------------------------
  // Constants:
  // ----------------------------------------------------------------
  var className = "SC.RectVertexItem ::: ";
  SC.log.debug(className + "start");
  // ----------------------------------------------------------------
  // Variables:
  // ----------------------------------------------------------------

  // ----------------------------------------------------------------
  // Constructors:
  // ----------------------------------------------------------------
  SC.VertexItem.call(this, item);// function 추가 (상속과 비슷함)

  // this._element.parentItem = this._parentItem;
  this._element.thisItem = this;
  // ----------------------------------------------------------------
  // Methods:
  // ----------------------------------------------------------------

  this.updatePosition = function(position)
  {
    this._position = position;
    var bBox = this._parentItem._element.getBBox();
    var cursorVal = "";
    if (position == SC.VertexPosition.TOP_LEFT) {
      this._x = bBox.x - this._radius;
      this._y = bBox.y - this._radius;
      cursorVal = "nw-resize";
    }
    else if (position == SC.VertexPosition.TOP_CENTER) {
      this._x = bBox.x + (bBox.width / 2) - this._radius;
      this._y = bBox.y - this._radius;
      cursorVal = "n-resize";
    }
    else if (position == SC.VertexPosition.TOP_RIGHT) {
      this._x = bBox.x + bBox.width - this._radius;
      this._y = bBox.y - this._radius;
      cursorVal = "sw-resize";
    }
    else if (position == SC.VertexPosition.MIDDLE_LEFT) {
      this._x = bBox.x - this._radius;
      this._y = bBox.y + (bBox.height / 2) - this._radius;
      cursorVal = "w-resize";
    }
    else if (position == SC.VertexPosition.MIDDLE_RIGHT) {
      this._x = bBox.x + bBox.width - this._radius;
      this._y = bBox.y + (bBox.height / 2) - this._radius;
      cursorVal = "w-resize";
    }
    else if (position == SC.VertexPosition.BOTTOM_LEFT) {
      this._x = bBox.x - this._radius;
      this._y = bBox.y + bBox.height - this._radius;
      cursorVal = "sw-resize";
    }
    else if (position == SC.VertexPosition.BOTTOM_CENTER) {
      this._x = bBox.x + (bBox.width / 2) - this._radius;
      this._y = bBox.y + bBox.height - this._radius;
      cursorVal = "n-resize";
    }
    else if (position == SC.VertexPosition.BOTTOM_RIGHT) {
      this._x = bBox.x + bBox.width - this._radius;
      this._y = bBox.y + bBox.height - this._radius;
      cursorVal = "nw-resize";
    }

    this._element.attr({
      x : this._x,
      y : this._y,
      cursor : cursorVal
    });

    this._element.position = this._position;

    bBox = null;// 메모리 누수 방지
  };

  // Events:
  var onMouseDown = function()
  {
    this.ox = this.attr("x");
    this.oy = this.attr("y");
    this.animate({
      opacity : .25
    }, 500, ">");
    this.parentOW = this.parentItem._element.attr("width");
    this.parentOH = this.parentItem._element.attr("height");
    this.parentOX = this.parentItem._element.attr("x");
    this.parentOY = this.parentItem._element.attr("y");
  }, onMouseMove = function(dx, dy)
  {
    this.parentNX = this.parentOX;
    this.parentNY = this.parentOY;

    if (this.position == SC.VertexPosition.TOP_LEFT) {
      this.parentNW = this.parentOW - dx;
      this.parentNH = this.parentOH - dy;
      this.parentNX = this.parentOX + dx;
      this.parentNY = this.parentOY + dy;
    }
    else if (this.position == SC.VertexPosition.TOP_CENTER) {
      this.nx = this.ox;
      this.ny = this.oy + dy;
      this.parentNW = this.parentOW;
      this.parentNH = this.parentOH - dy;
      this.parentNX = this.parentOX;
      this.parentNY = this.parentOY + dy;
    }
    else if (this.position == SC.VertexPosition.TOP_RIGHT) {
      this.nx = this.ox + dx;
      this.ny = this.oy + dy;
      this.parentNW = this.parentOW + dx;
      this.parentNH = this.parentOH - dy;
      this.parentNX = this.parentOX;
      this.parentNY = this.parentOY + dy;
    }
    else if (this.position == SC.VertexPosition.MIDDLE_LEFT) {
      this.parentNW = this.parentOW - dx;
      this.parentNH = this.parentOH;
      this.parentNX = this.parentOX + dx;
      this.parentNY = this.parentOY;
    }
    else if (this.position == SC.VertexPosition.MIDDLE_RIGHT) {
      this.parentNW = this.parentOW + dx;
      this.parentNH = this.parentOH;
      this.parentNX = this.parentOX;
      this.parentNY = this.parentOY;
    }
    else if (this.position == SC.VertexPosition.BOTTOM_LEFT) {
      this.parentNW = this.parentOW - dx;
      this.parentNH = this.parentOH + dy;
      this.parentNX = this.parentOX + dx;
      this.parentNY = this.parentOY;
    }
    else if (this.position == SC.VertexPosition.BOTTOM_CENTER) {
      this.parentNW = this.parentOW;
      this.parentNH = this.parentOH + dy;
    }
    else if (this.position == SC.VertexPosition.BOTTOM_RIGHT) {
      this.parentNW = this.parentOW + dx;
      this.parentNH = this.parentOH + dy;
    }

    // if (this.parentNX >= 5 && this.parentNY >= 5) {

    if (this.parentNX > this.parentOX + this.parentOW) {
      this.parentNX = this.parentOX + this.parentOW - 5;
    }

    if (this.parentNY > this.parentOY + this.parentOH) {
      this.parentNY = this.parentOY + this.parentOH - 5;
    }

    if (this.parentNW < 0) {
      this.parentNW = 5;
    }

    if (this.parentNH < 0) {
      this.parentNH = 5;
    }

    this.parentItem.doResize(this.parentNX, this.parentNY, this.parentNW,
        this.parentNH);
    this.parentItem._vertexSet.doResize();

    this.parentItem._vertexSet.doResizeAttachmentItems();

    // }

  }, onMouseUp = function()
  {
    this.animate({
      opacity : 1
    }, 500, ">");
  };
  this._element.drag(onMouseMove, onMouseDown, onMouseUp);

  // ----------------------------------------------------------------
  // Classes or Interfaces:
  // ----------------------------------------------------------------
};

SC.LineVertexItem = function(item)
{
  // ----------------------------------------------------------------
  // Constants:
  // ----------------------------------------------------------------
  var className = "SC.LineVertexItem ::: ";
  SC.log.debug(className + "start");
  // ----------------------------------------------------------------
  // Variables:
  // ----------------------------------------------------------------

  // ----------------------------------------------------------------
  // Constructors:
  // ----------------------------------------------------------------
  SC.VertexItem.call(this, item);// function 추가 (상속과 비슷함)

  // this._element.parentItem = this._parentItem;
  // this._element.radius = this._radius;
  // this._element.canvas = this._canvas;
  this._element.thisItem = this;

  // ----------------------------------------------------------------
  // Methods:
  // ----------------------------------------------------------------

  this.updatePosition = function(position)
  {
    this._position = position;
    this._element.position = position;

    var oPath = this._parentItem._element.attr("path");
    var nX = null, nY = null;
    if (position == SC.VertexPosition.TOP_LEFT) {
      nX = oPath[0][1] - this._radius;
      nY = oPath[0][2] - this._radius;
    }
    else if (position == SC.VertexPosition.TOP_CENTER) {
      nX = oPath[1][1] - this._radius;
      nY = oPath[1][2] - this._radius;
    }

    this._element.attr({
      x : nX,
      y : nY
    });

    oPath = null;// 메모리 누수 방지
    nX = null;
    nY = null;
  };

  // Events:

  // Drag & Drop Event
  var onMouseDown = function()
  {
    this.ox = this.attr("x");
    this.oy = this.attr("y");
    this.animate({
      opacity : .25
    }, 500, ">");
    this.hide();
  }, onMouseMove = function(dx, dy)
  {
    this.nx = this.ox + dx;
    this.ny = this.oy + dy;

    this.attachTargetItem = this.canvas.getNhIgnoreLineCanvasItem(this.nx,
        this.ny);

    if (this.attachTargetItem) {
      this.nhVertexItem = this.attachTargetItem.getNhVertexItem(this.nx,
          this.ny);
      if (this.nhVertexItem) {
        this.nx = this.nhVertexItem._element.attr("x");
        this.ny = this.nhVertexItem._element.attr("y");
      }
    }

    this.attr({
      x : this.nx,
      y : this.ny
    });

    this.parentItem.doResize(this.radius);
  }, onMouseUp = function()
  {
    var attachmentVertexItem = null;
    for ( var i = 0; i < this.thisItem._attachmentVertexItems.length; i++) {
      attachmentVertexItem = this.thisItem._attachmentVertexItems[i];
      attachmentVertexItem.doDeatchTargetAttachmentVertexItems(this.thisItem);
    }
    this.thisItem._attachmentVertexItems.remove(0,
        this.thisItem._attachmentVertexItems.length - 1);
    attachmentVertexItem = null;

    if (this.attachTargetItem != null) {
      this.attachTargetItem.doUnSelect();
      if (this.nhVertexItem) {
        // this.attachmentVertexItems.push(this.nhVertexItem); 오류.
        this.thisItem.doAttachItem(this.nhVertexItem);
        this.nhVertexItem.doAttachItem(this.thisItem);
      }
    }

    this.animate({
      opacity : 1
    }, 500, ">");

    this.show();
  };
  this._element.drag(onMouseMove, onMouseDown, onMouseUp);

  // ----------------------------------------------------------------
  // Classes or Interfaces:
  // ----------------------------------------------------------------
};

/**
 * VertexFactory ::: Singleton Object
 */

SC.VertexItemFactory = {
  createVertexItem : function(type, item)
  {
    if (type == "rect") {
      return new SC.RectVertexItem(item);
    }
    else if (type == "line") {
      return new SC.LineVertexItem(item);
    }
    return null;
  }
};

/**
 * VertexSet
 */

SC.VertexSet = function(item)
{

  // ----------------------------------------------------------------
  // Constants:
  // ----------------------------------------------------------------
  SC.Observable.call(this); // function 추가 (상속과 비슷함)
  var className = "SC.VertexSet ::: ";
  SC.log.debug(className + "start");

  // ----------------------------------------------------------------
  // Variables:
  // ----------------------------------------------------------------
  this._parentItem = item;

  // ----------------------------------------------------------------
  // Constructors:
  // ----------------------------------------------------------------

  // ----------------------------------------------------------------
  // Methods:
  // ----------------------------------------------------------------
  this.addItem = function(vertexItem)
  {
    this.addObserver(vertexItem);
  };

  this.setDatas = function(datas)
  {
    for ( var i = 0; i < datas.length; i++) {
      this._observerCollection[i]._id = datas[i].id;
      this._observerCollection[i]._attachmentIds = datas[i].attachmentIds;
    }
  };

  this.doSelect = function()
  {
    var vertexItem = null;
    for ( var i = 0; i < this._observerCollection.length; i++) {
      vertexItem = this._observerCollection[i];
      vertexItem.toFront();
      vertexItem.show();
    }
    vertexItem = null;
  };

  this.doMove = function(dx, dy)
  {
    var vertexItem = null;
    for ( var i = 0; i < this._observerCollection.length; i++) {
      vertexItem = this._observerCollection[i];
      vertexItem.updatePosition(i);
    }
    vertexItem = null;
  };

  this.doCheckAndDeatchItems = function()
  {
    var vertexItem = null;
    for ( var i = 0; i < this._observerCollection.length; i++) {
      vertexItem = this._observerCollection[i];
      vertexItem.doCheckAndDeatchItems();
    }
    vertexItem = null;
  };

  this.updateAttachmentVertexItemsPosition = function(dx, dy)
  {
    var vertexItem = null;
    for ( var i = 0; i < this._observerCollection.length; i++) {
      vertexItem = this._observerCollection[i];
      vertexItem.updateAttachmentVertexItemsPosition(dx, dy);
    }
    vertexItem = null;
  };

  this.doResize = function()
  {
    var vertexItem = null;
    for ( var i = 0; i < this._observerCollection.length; i++) {
      vertexItem = this._observerCollection[i];
      vertexItem.updatePosition(i);
    }
    vertexItem = null;
  };

  this.toFront = function()
  {
    var vertexItem = null;
    for ( var i = 0; i < this._observerCollection.length; i++) {
      vertexItem = this._observerCollection[i];
      vertexItem.toFront();
    }
    vertexItem = null;
  };

  this.doResizeAttachmentItems = function()
  {
    var vertexItem = null;
    for ( var i = 0; i < this._observerCollection.length; i++) {
      vertexItem = this._observerCollection[i];
      vertexItem.doResizeAttachmentItems();
    }
    vertexItem = null;
  };

  this.show = function()
  {
    var vertexItem = null;
    for ( var i = 0; i < this._observerCollection.length; i++) {
      vertexItem = this._observerCollection[i];
      vertexItem.show();
    }
    vertexItem = null;
  };

  this.hide = function()
  {
    var vertexItem = null;
    for ( var i = 0; i < this._observerCollection.length; i++) {
      vertexItem = this._observerCollection[i];
      vertexItem.hide();
    }
    vertexItem = null;
  };

  // 근처 vertexItem을 얻어온다.(neighborhood)
  this.getNhVertexItem = function(lx, ly)
  {
    var vertexItem = null;
    var ox = null;
    var oy = null;
    var gap = 6;

    for ( var i = 0; i < this._observerCollection.length; i++) {
      vertexItem = this._observerCollection[i];
      ox = vertexItem._element.attr("x");
      oy = vertexItem._element.attr("y");
      if ((ox - gap < lx && (ox + (gap * 2)) > lx)
          && (oy - gap < ly && (oy + (gap * 2)) > ly)) {
        return vertexItem;
      }
    }

    vertexItem = null;
    ox = null;
    oy = null;
    gap = null;
  };

  this.doDeatchItems = function()
  {
    var vertexItem = null;
    for ( var i = 0; i < this._observerCollection.length; i++) {
      vertexItem = this._observerCollection[i];
      vertexItem.doDeatchItems();
    }
    vertexItem = null;
  };

  this.doDeatchFromAttachmentItem = function()
  {
    var vertexItem = null;
    for ( var i = 0; i < this._observerCollection.length; i++) {
      vertexItem = this._observerCollection[i];
      vertexItem.doDeatchFromAttachmentItem(vertexItem);
    }
    vertexItem = null;
  };

  this.initOpathAttachmentItems = function()
  {
    var vertexItem = null;
    for ( var i = 0; i < this._observerCollection.length; i++) {
      vertexItem = this._observerCollection[i];
      vertexItem.initOpathAttachmentItems();
    }
    vertexItem = null;
  };

  // LineVertexItem에만 해당된다.
  this.hasAttachmentToReverse = function(item)
  {
    var vertexItem = null;
    for ( var i = 0; i < this._observerCollection.length; i++) {
      vertexItem = this._observerCollection[i];
      if (vertexItem.constructor != SC.LineVertexItem) {
        return false;
      }

      if (vertexItem !== item) {
        return vertexItem.hasAttachment();
      }
    }
    vertexItem = null;
  };

  this.getVertexItem = function(position)
  {
    return this._observerCollection[position];
  };

  this.remove = function()
  {
    var vertexItem = null;
    for ( var i = 0; i < this._observerCollection.length; i++) {
      vertexItem = this._observerCollection[i];
      vertexItem.doDeatchFromAttachmentItem(vertexItem);
      vertexItem.remove();
    }
  };
  // ----------------------------------------------------------------
  // Classes or Interfaces:
  // ----------------------------------------------------------------
};

/**
 * VertexSetFactory ::: Singleton Object
 */

SC.VertexSetFactory = {
  createVertexSet : function(type, item)
  {
    if (type == "rect") {
      var rectVertexSet = new SC.VertexSet(item);
      for ( var i = 0; i < 8; i++) {
        var vertexItem = SC.VertexItemFactory.createVertexItem("rect", item);
        vertexItem.updatePosition(i);
        rectVertexSet.addItem(vertexItem);
      }
      return rectVertexSet;
    }
    else if (type == "line") {
      var lineVertexSet = new SC.VertexSet(item);
      for ( var i = 0; i < 2; i++) {
        var vertexItem = SC.VertexItemFactory.createVertexItem("line", item);
        vertexItem.updatePosition(i);
        lineVertexSet.addItem(vertexItem);
      }
      return lineVertexSet;
    }
    return null;
  }
};

/**
 * Toolbar
 */

SC.Toolbar = function(target)
{
  // ----------------------------------------------------------------
  // Constants:
  // ----------------------------------------------------------------
  SC.Observable.call(this); // function 추가 (상속과 비슷함)
  var className = "SC.Toolbar ::: ";
  SC.log.debug(className + "start");

  // ----------------------------------------------------------------
  // Variables:
  // ----------------------------------------------------------------
  this._id = null;
  this._element = null;
  this._canvas = null;
  // ----------------------------------------------------------------
  // Constructors:
  // ----------------------------------------------------------------
  this._element = $("<div></div>").addClass("toolbar");
  this._id = target + "_toolbar";
  this._element.attr("id", this._id);
  $("#" + target).append(this._element);

  // ----------------------------------------------------------------
  // Methods:
  // ----------------------------------------------------------------
  this.getElement = function()
  {
    return this._element;
  };

  this.addToolbarItem = function(toolbarItem)
  {
    var toolbarElement = toolbarItem.getElement();
    this._element.append(toolbarElement);

    this.addObserver(toolbarItem);
  };

  this.setWidth = function(width)
  {
    this._element.css("width", width);
  };

  this.setHeight = function(height)
  {
    this._element.css("height", height);
  };

  this.setCanvas = function(canvas)
  {
    this._canvas = canvas;
  };

  this.show = function()
  {
    this._element.show();
  };

  this.hide = function()
  {
    this._element.hide();
  };

  // ----------------------------------------------------------------
  // Classes or Interfaces:
  // ----------------------------------------------------------------
};
// SC.Toolbar.prototype = new SC.Observable();// 상속

/**
 * Canvas
 */
SC.Canvas = function(target)
{
  // ----------------------------------------------------------------
  // Constants:
  // ----------------------------------------------------------------
  var className = "SC.Canvas ::: ";
  SC.log.debug(className + "start");

  // ----------------------------------------------------------------
  // Variables:
  // ----------------------------------------------------------------
  this._id = target + "_canvas";
  this._element = null;
  this._raphael = null;
  this._contextmenu = null;
  this._vertexItemCollection = new Array();
  this._resizableSelectionBox = null;
  // ----------------------------------------------------------------
  // Constructors:
  // ----------------------------------------------------------------
  SC.Observable.call(this); // function 추가 (상속과 비슷함)

  this._element = $("<div></div>");
  this._element.attr("id", this._id);
  this._element.addClass("canvas");
  $("#" + target).append(this._element);
  this._raphael = Raphael(this._element.attr("id"));

  this._resizableSelectionBox = this._raphael.rect(0, 0, 0, 0);
  this._resizableSelectionBox.attr({
    fill : "#7ebfff",
    "fill-opacity" : 0.1,
    stroke : "#7ebfff"
  });

  this._resizableSelectionBox.hide();

  this._contextmenu = new SC.Contextmenu(target, this);

  // ----------------------------------------------------------------
  // Methods:
  // ----------------------------------------------------------------
  this.getRaphael = function()
  {
    return this._raphael;
  };

  this.getElement = function()
  {
    return this._element;
  };

  this.setSize = function(width, height)
  {
    this._raphael.setSize(width, height);
  };

  this.addItem = function(item)
  {
    this.addObserver(item);
  };

  this.addVertexItem = function(vertexItem)
  {
    this._vertexItemCollection.push(vertexItem);
  };

  this.countVertexItems = function()
  {
    return this._vertexItemCollection.length;
  };

  this.getLastVertexItemId = function()
  {
    if (this._vertexItemCollection.length > 0) {
      return this._vertexItemCollection[this._vertexItemCollection.length - 1]._id;
    }
    else {
      return 0;
    }
  };

  this.itemVertexHideAll = function()
  {
    for ( var i = 0; i < this._observerCollection.length; i++) {
      this._observerCollection[i].doUnSelect();
    }
  };

  this.ignoreLineItemVertexHideAll = function()
  {
    var item = null;
    for ( var i = 0; i < this._observerCollection.length; i++) {
      item = this._observerCollection[i];
      if (item.constructor != SC.LineCanvasItem) {
        item.doUnSelect();
      }
    }
    item = null;
  };

  this.getNhIgnoreLineCanvasItem = function(x, y)
  {
    var item = null;
    var itemX = null;
    var itemY = null;
    var itemWidth = null;
    var itemHeight = null;

    this.ignoreLineItemVertexHideAll();

    for ( var i = this._observerCollection.length; i > 0; i--) {
      item = this._observerCollection[i - 1];
      if (item.constructor != SC.LineCanvasItem) {
        itemX = item.getX();
        itemY = item.getY();
        itemWidth = item.getWidth();
        itemHeight = item.getHeight();

        if ((itemX - 6 <= (x /* (SC.VertexItem._radius * 2) */) && x <= itemX
            + itemWidth)
            && (itemY <= y && y <= itemY + itemHeight)) {
          item.doSelect();
          // item._vertexSet.show();
          return item;
        }
      }
    }

    item = null;
    itemX = null;
    itemY = null;
    itemWidth = null;
    itemHeight = null;

    return null;
  };

  this.parseItemsToJSON = function()
  {
    var item = null;
    var vertexItem = null;
    var tempJsonCanvasItem = null;
    var tempJsonVertexItems = new Array();
    var jsonArray = new Array();
    for ( var i = 0; i < this._observerCollection.length; i++) {
      item = this._observerCollection[i];

      if (item.constructor == SC.RectCanvasItem) {
        for ( var j = 0; j < 8; j++) {
          vertexItem = item.getVertexItem(j);
          tempJsonVertexItems[j] = {
            id : vertexItem._id,
            x : vertexItem._x,
            y : vertexItem._y,
            radius : vertexItem._radius,
            position : vertexItem._position,
            attachmentIds : vertexItem.getAttachmentIds()
          };
        }

        tempJsonCanvasItem = {
          id : item._id,
          type : item._type,
          x : item._x,
          y : item._y,
          width : item._width,
          height : item._height,
          vertexSet : [ tempJsonVertexItems[SC.VertexPosition.TOP_LEFT],
              tempJsonVertexItems[SC.VertexPosition.TOP_CENTER],
              tempJsonVertexItems[SC.VertexPosition.TOP_RIGHT],
              tempJsonVertexItems[SC.VertexPosition.MIDDLE_LEFT],
              tempJsonVertexItems[SC.VertexPosition.MIDDLE_RIGHT],
              tempJsonVertexItems[SC.VertexPosition.BOTTOM_LEFT],
              tempJsonVertexItems[SC.VertexPosition.BOTTOM_CENTER],
              tempJsonVertexItems[SC.VertexPosition.BOTTOM_RIGHT] ]
        };
      }
      else if (item.constructor == SC.ImageCanvasItem) {
        for ( var j = 0; j < 8; j++) {
          vertexItem = item.getVertexItem(j);
          tempJsonVertexItems[j] = {
            id : vertexItem._id,
            x : vertexItem._x,
            y : vertexItem._y,
            radius : vertexItem._radius,
            position : vertexItem._position,
            attachmentIds : vertexItem.getAttachmentIds()
          };
        }

        tempJsonCanvasItem = {
          id : item._id,
          src : item._src,
          type : item._type,
          x : item._x,
          y : item._y,
          width : item._width,
          height : item._height,
          vertexSet : [ tempJsonVertexItems[SC.VertexPosition.TOP_LEFT],
              tempJsonVertexItems[SC.VertexPosition.TOP_CENTER],
              tempJsonVertexItems[SC.VertexPosition.TOP_RIGHT],
              tempJsonVertexItems[SC.VertexPosition.MIDDLE_LEFT],
              tempJsonVertexItems[SC.VertexPosition.MIDDLE_RIGHT],
              tempJsonVertexItems[SC.VertexPosition.BOTTOM_LEFT],
              tempJsonVertexItems[SC.VertexPosition.BOTTOM_CENTER],
              tempJsonVertexItems[SC.VertexPosition.BOTTOM_RIGHT] ]
        };
      }
      else if (item.constructor == SC.LineCanvasItem) {

        for ( var j = 0; j < 2; j++) {
          vertexItem = item.getVertexItem(j);
          tempJsonVertexItems[j] = {
            id : vertexItem._id,
            x : vertexItem._x,
            y : vertexItem._y,
            radius : vertexItem._radius,
            position : vertexItem._position,
            attachmentIds : vertexItem.getAttachmentIds()
          //
          };
        }

        tempJsonCanvasItem = {
          id : item._id,
          type : item._type,
          Mx : item._Mx,
          My : item._My,
          Lx : item._Lx,
          Ly : item._Ly,
          vertexSet : [ tempJsonVertexItems[SC.VertexPosition.TOP_LEFT],
              tempJsonVertexItems[SC.VertexPosition.TOP_CENTER] ]
        };
      }

      jsonArray.push(tempJsonCanvasItem);
    }
    item = null;
    vertexItem = null;
    tempJsonCanvasItem = null;
    tempJsonVertexItems = null;
    return jsonArray;
  };

  this.insertItemDatas = function(itemDatas)
  {
    var item = null;
    for ( var i = 0; i < itemDatas.length; i++) {
      if (itemDatas[i].type == SC.CanvasItemType.RECT) {
        item = new SC.RectCanvasItem(this, itemDatas[i].id, itemDatas[i].x,
            itemDatas[i].y, itemDatas[i].width, itemDatas[i].height,
            itemDatas[i].vertexSet);
      }
      else if (itemDatas[i].type == SC.CanvasItemType.IMAGE) {
        item = new SC.ImageCanvasItem(this, itemDatas[i].src, itemDatas[i].id,
            itemDatas[i].x, itemDatas[i].y, itemDatas[i].width,
            itemDatas[i].height, itemDatas[i].vertexSet);
      }
      else if (itemDatas[i].type == SC.CanvasItemType.LINE) {
        item = new SC.LineCanvasItem(this, itemDatas[i].id, itemDatas[i].Mx,
            itemDatas[i].My, itemDatas[i].Lx, itemDatas[i].Ly,
            itemDatas[i].vertexSet);
      }
      this.addItem(item);
    }
    item = null;

    // set vertexitem relation
    for ( var j = 0; j < this._vertexItemCollection.length; j++) {
      item = this._vertexItemCollection[j];
      item.doAttachItemToUseAttachmentIds();
    }
    item = null;
  };

  this.findVertexItemById = function(itemId)
  {
    for ( var i = 0; i < this._vertexItemCollection.length; i++) {
      if (this._vertexItemCollection[i]._id == itemId) {
        return this._vertexItemCollection[i];
      }
    }
  };

  this.findCanvasItemById = function(itemId)
  {
    for ( var i = 0; i < this._observerCollection.length; i++) {
      if (this._observerCollection[i]._id == itemId) {
        return this._observerCollection[i];
      }
    }
  };

  this.removeCanvasItemById = function(itemId)
  {
    for ( var i = 0; i < this._observerCollection.length; i++) {
      if (this._observerCollection[i]._id == itemId) {
        this._observerCollection.remove(i, i);
        break;
      }
    }
  };

  this.removeVertexItemById = function(itemId)
  {
    for ( var i = 0; i < this._vertexItemCollection.length; i++) {
      if (this._vertexItemCollection[i]._id == itemId) {
        this._vertexItemCollection.remove(i, i);
        break;
      }
    }
  };

  this.showContextmenu = function(event, items)
  {
    if (items != null) {
      this._contextmenu.enable();
    }
    else {
      this._contextmenu.disable();
    }
    this._contextmenu.setSelectedItemCollection(items);
    this._contextmenu.show(event.pageX, event.pageY);
  };

  this.hideContextmenu = function(event)
  {
    this._contextmenu.hide();
  };

  this.doUnSelectItemAll = function()
  {
    for ( var i = 0; i < this._observerCollection.length; i++) {
      this._observerCollection[i].doUnSelect();
    }
  };

  this.getSelectedCanvasItems = function()
  {
    var items = new Array();
    for ( var i = 0; i < this._observerCollection.length; i++) {
      if (this._observerCollection[i]._isSelected) {
        items.push(this._observerCollection[i]);
      }
    }
    return items;
  };

  this.doInitOpathSelectedItems = function()
  {
    for ( var i = 0; i < this._observerCollection.length; i++) {
      if (this._observerCollection[i]._isSelected) {
        this._observerCollection[i].initOpath();
      }
    }
  };

  this.doMoveSelectedItems = function(dx, dy)
  {
    for ( var i = 0; i < this._observerCollection.length; i++) {
      if (this._observerCollection[i]._isSelected) {
        this._observerCollection[i].doMove(dx, dy);
      }
    }
  };

  this.doCheckAndDeatchSelectedItems = function()
  {
    for ( var i = 0; i < this._observerCollection.length; i++) {
      if (this._observerCollection[i]._isSelected) {
        this._observerCollection[i]._vertexSet.doCheckAndDeatchItems();
      }
    }
  };

  this.doSelectItemInSelectionBox = function()
  {
    var boxAttr = this._resizableSelectionBox.getBBox();
    var itemAttr = null;
    for ( var i = 0; i < this._observerCollection.length; i++) {
      itemAttr = this._observerCollection[i]._element.getBBox();
      if (itemAttr.x > boxAttr.x && itemAttr.y > boxAttr.y
          && itemAttr.x + itemAttr.width < boxAttr.x + boxAttr.width
          && itemAttr.y + itemAttr.height < boxAttr.y + boxAttr.height) {
        this._observerCollection[i].doSelect();
      }
    }

    boxAttr = null;
    itemAttr = null;
  };

  // event
  this._element.bind("contextmenu", this, function(event)
  {
    var thisItem = event.data;
    thisItem.doUnSelectItemAll();
    thisItem.showContextmenu(event, null);
    return false;
  });

  // resizable multi selection box drag event

  this._element.mousedown(this, function(event)
  {
    var thisItem = event.data;
    thisItem.hideContextmenu(event);
    thisItem.doUnSelectItemAll();
    this.isSeletionMode = true;
    this.ox = event.pageX;
    this.oy = event.pageY;
    thisItem._resizableSelectionBox.toFront();
    thisItem._resizableSelectionBox.show();
    thisItem._resizableSelectionBox.attr({
      x : event.pageX - $(this).offset().left,
      y : event.pageY - $(this).offset().top
    });
  });

  this._element.mousemove(this, function(event)
  {
    if (this.isSeletionMode) {
      var thisItem = event.data;

      if ((this.ox - event.pageX) > 0) {
        thisItem._resizableSelectionBox.attr({
          x : event.pageX - $(this).offset().left
        });
      }

      if ((this.oy - event.pageY) > 0) {
        thisItem._resizableSelectionBox.attr({
          y : event.pageY - $(this).offset().top
        });
      }

      thisItem._resizableSelectionBox.attr({
        width : Math.abs(this.ox - event.pageX),
        height : Math.abs(this.oy - event.pageY)
      });
    }
  });

  this._element.mouseup(this, function(event)
  {
    if (this.isSeletionMode) {
      var thisItem = event.data;
      thisItem.doSelectItemInSelectionBox();
      thisItem._resizableSelectionBox.attr({
        width : 0,
        height : 0
      });
      thisItem._resizableSelectionBox.hide();
      this.isSeletionMode = false;
    }
  });

  // ----------------------------------------------------------------
  // Classes or Interfaces:
  // ----------------------------------------------------------------
};

/**
 * Contextmenu
 */
SC.Contextmenu = function(target, canvas)
{
  // ----------------------------------------------------------------
  // Constants:
  // ----------------------------------------------------------------
  var className = "SC.Contextmenu ::: ";
  SC.log.debug(className + "test");

  // ----------------------------------------------------------------
  // Variables:
  // ----------------------------------------------------------------
  this._id = null;
  this._element = null;
  this._canvas = null;
  this._selectedItemCollection = null;
  this._menuItemCollection = new Array();

  // ----------------------------------------------------------------
  // Constructors:
  // ----------------------------------------------------------------
  this._id = target + "_contextmenu";
  this._element = $("<div></div>");
  this._element.attr("id", this._id);
  this._element.addClass("contextmenu");
  $("#" + target).append(this._element);

  this._canvas = canvas;

  this._cutMenuItem = SC.ItemFactory.createContextmenuItem(
      "../image/icon-save.png", "잘라내기(고민중..)");
  this._copyMenuItem = SC.ItemFactory.createContextmenuItem(
      "../image/icon-save.png", "복사(고민중..)");
  this._pasteMenuItem = SC.ItemFactory.createContextmenuItem(
      "../image/icon-save.png", "붙여넣기(고민중..)");
  this._removeMenuItem = SC.ItemFactory.createContextmenuItem(
      "../image/icon-save.png", "삭제");
  this._toFrontMenuItem = SC.ItemFactory.createContextmenuItem(
      "../image/icon-save.png", "맨앞으로 보내기");
  this._toBackMenuItem = SC.ItemFactory.createContextmenuItem(
      "../image/icon-save.png", "맨뒤로 보내기");

  this._menuItemCollection.push(this._cutMenuItem);
  this._menuItemCollection.push(this._copyMenuItem);
  this._menuItemCollection.push(this._pasteMenuItem);
  this._menuItemCollection.push(this._removeMenuItem);
  this._menuItemCollection.push(this._toFrontMenuItem);
  this._menuItemCollection.push(this._toBackMenuItem);

  this._element.append(this._cutMenuItem);
  this._element.append(this._copyMenuItem);
  this._element.append(this._pasteMenuItem);
  this._element.append(this._removeMenuItem);
  this._element.append($("<hr>")); // separator 추가
  this._element.append(this._toFrontMenuItem);
  this._element.append(this._toBackMenuItem);

  this._element.hide();

  // ----------------------------------------------------------------
  // Methods:
  // ----------------------------------------------------------------
  this.show = function(x, y)
  {
    this._element.hide();
    this._element.css("left", x);
    this._element.css("top", y);
    // this._element.show(500);
    this._element.fadeIn(100);
  };

  this.disable = function()
  {
    for ( var i = 0; i < this._menuItemCollection.length; i++) {
      this._menuItemCollection[i].attr("disabled", true);
    }

    this._pasteMenuItem.attr("disabled", false);
  };

  this.enable = function()
  {
    for ( var i = 0; i < this._menuItemCollection.length; i++) {
      this._menuItemCollection[i].attr("disabled", false);
    }

    this._pasteMenuItem.attr("disabled", true);
  };

  this.hide = function()
  {
    this._element.hide();
  };

  this.setSelectedItemCollection = function(items)
  {
    this._selectedItemCollection = items;
  };

  this.removeSelectedItems = function()
  {
    for ( var i = 0; i < this._selectedItemCollection.length; i++) {
      this._selectedItemCollection[i].remove();
      delete this._selectedItemCollection[i];
    }
    this._selectedItemCollection = null;
  };

  this.toFrontSelectedItems = function()
  {
    for ( var i = 0; i < this._selectedItemCollection.length; i++) {
      this._selectedItemCollection[i].toFront();
    }
  };

  this.toBackSelectedItems = function()
  {
    for ( var i = 0; i < this._selectedItemCollection.length; i++) {
      this._selectedItemCollection[i].toBack();
    }
  };

  // contextmenu event
  this._element.bind("contextmenu", function()
  {
    return false;
  });

  this._element.click(this, function(event)
  {
    var thisItem = event.data;
    thisItem.hide(event);
    return false;
  });

  // menu item event
  this._cutMenuItem.click(this, function(event)
  {
    if ($(this).attr("disabled") == "false") {
    }
    else {
      return false;
    }
  });

  this._copyMenuItem.click(this, function(event)
  {
    if ($(this).attr("disabled") == "false") {
    }
    else {
      return false;
    }
  });

  this._pasteMenuItem.click(this, function(event)
  {
    if ($(this).attr("disabled") == "false") {
    }
    else {
      return false;
    }
  });

  this._removeMenuItem.click(this, function(event)
  {
    if ($(this).attr("disabled") == "false") {
      event.data.removeSelectedItems();
    }
    else {
      return false;
    }
  });

  this._toFrontMenuItem.click(this, function(event)
  {
    if ($(this).attr("disabled") == "false") {
      event.data.toFrontSelectedItems();
    }
    else {
      return false;
    }
  });

  this._toBackMenuItem.click(this, function(event)
  {
    if ($(this).attr("disabled") == "false") {
      event.data.toBackSelectedItems();
    }
    else {
      return false;
    }
  });

  // ----------------------------------------------------------------
  // Classes or Interfaces:
  // ----------------------------------------------------------------
};

/**
 * DiagramTool
 */
SC.DiagramTool = function(target, width, height, isEditable)
{
  // ----------------------------------------------------------------
  // Constants:
  // ----------------------------------------------------------------
  var className = "SC.DiagramTool ::: ";
  SC.log.debug(className + "test");

  // ----------------------------------------------------------------
  // Variables:
  // ----------------------------------------------------------------
  this._toolbar = null; // type : Toolbar
  this._canvas = null; // type : Canvas
  this.canvasOffset = null;
  this.cover = null;
  this._isEditable = false;
  // ----------------------------------------------------------------
  // Constructors:
  // ----------------------------------------------------------------
  if (width == null) {
    width = 200;
  }

  if (height == null) {
    height = 100;
  }

  if (isEditable != null) {
    this._isEditable = isEditable;
  }

  // toolbar 초기화
  this._toolbar = new SC.Toolbar(target);
  this._toolbar.setHeight(height);

  this._canvas = new SC.Canvas(target);
  this._canvas.setSize(width, height);

  /* this._toolbar.addToolbarItem(SC.ItemFactory.createToolbarItem("rect",this._canvas)); */

  this._toolbar.addToolbarItem(SC.ItemFactory.createToolbarItem("image",
      this._canvas, "../image/icon-server.png", "Apple"));

  this._toolbar.addToolbarItem(SC.ItemFactory.createToolbarItem("image",
      this._canvas, "../image/icon-server-disconnected.png", "Amazone"));

  this._toolbar.addToolbarItem(SC.ItemFactory.createToolbarItem("image",
      this._canvas, "../image/icon-server-drag.png", "Google"));

  this._toolbar.addToolbarItem(SC.ItemFactory.createToolbarItem("line",
      this._canvas));

  this._toolbar.addToolbarItem(SC.ItemFactory.createToolbarItem("save",
      this._canvas));

  this.cover = $("<div><div>");
  this.cover.addClass("cover");
  this.cover.width(width);
  this.cover.height(height);
  this.cover.appendTo("#" + target);

  this.cover.click(function(event)
  {
  });

  if (this._isEditable) {
    this._toolbar.show();
    this.cover.hide();
  }
  else {
    this._toolbar.hide();
    this.canvasOffset = this._canvas._element.offset();
    this.cover.css("top", this.canvasOffset.top);
    this.cover.css("left", this.canvasOffset.left);
    this.cover.show();
  }

  // ----------------------------------------------------------------
  // Methods:
  // ----------------------------------------------------------------

  this.setEditable = function(bool)
  {
    this._isEditable = bool;
    if (this._isEditable) {
      this._toolbar.show();
      this.cover.hide();
    }
    else {
      this._toolbar.hide();
      this.canvasOffset = this._canvas._element.offset();
      this.cover.css("top", this.canvasOffset.top);
      this.cover.css("left", this.canvasOffset.left);
      this.cover.show();
    }
  };

  this.insertItemDatas = function(itemDatas)
  {
    var items = this._canvas.insertItemDatas(itemDatas);
  };

  // ----------------------------------------------------------------
  // Classes or Interfaces:
  // ----------------------------------------------------------------
};

/**
 * Logger
 */
log4javascript.setEnabled(false);

// Popup Log 남기기↓
// SC.log = log4javascript.getDefaultLogger();

// Console Log 남기기↓
SC.log = log4javascript.getLogger("main");
SC.log.addAppender(new log4javascript.InPageAppender());

/**
 * Test : SC.DiagramTool의 toolbarItem 이미지 경로 알맞게 수정 후 아래 코드 적용 할 것.
 */
$(function()
{
  var diagramTool1 = new SC.DiagramTool("diagramTool1", 400, 400, true);
  diagramTool1.insertItemDatas(json.itemDatas);

  // var diagramTool2 = new SC.DiagramTool("diagramTool2");
  // diagramTool2.setEditable(false);

  $("#modeChangeBtn").click(diagramTool1, function(event)
  {
    var diagramTool = event.data;
    if (diagramTool._isEditable) {
      diagramTool.setEditable(false);
    }
    else {
      diagramTool.setEditable(true);
    }
  });
});

var json = {
  "itemDatas" : [ {
    "id" : 1,
    "type" : 0,
    "x" : 188,
    "y" : 57,
    "width" : 50,
    "height" : 50,
    "vertexSet" : [ {
      "id" : 1,
      "x" : 185,
      "y" : 54,
      "radius" : 3,
      "position" : 0,
      "attachmentIds" : []
    }, {
      "id" : 2,
      "x" : 210,
      "y" : 54,
      "radius" : 3,
      "position" : 1,
      "attachmentIds" : []
    }, {
      "id" : 3,
      "x" : 235,
      "y" : 54,
      "radius" : 3,
      "position" : 2,
      "attachmentIds" : []
    }, {
      "id" : 4,
      "x" : 185,
      "y" : 79,
      "radius" : 3,
      "position" : 3,
      "attachmentIds" : [ 10 ]
    }, {
      "id" : 5,
      "x" : 235,
      "y" : 79,
      "radius" : 3,
      "position" : 4,
      "attachmentIds" : []
    }, {
      "id" : 6,
      "x" : 185,
      "y" : 104,
      "radius" : 3,
      "position" : 5,
      "attachmentIds" : []
    }, {
      "id" : 7,
      "x" : 210,
      "y" : 104,
      "radius" : 3,
      "position" : 6,
      "attachmentIds" : []
    }, {
      "id" : 8,
      "x" : 235,
      "y" : 104,
      "radius" : 3,
      "position" : 7,
      "attachmentIds" : []
    } ]
  }, {
    "id" : 2,
    "type" : 1,
    "Mx" : 89,
    "My" : 157,
    "Lx" : 188,
    "Ly" : 82,
    "vertexSet" : [ {
      "id" : 9,
      "x" : 10,
      "y" : 10,
      "radius" : 3,
      "position" : 0,
      "attachmentIds" : [ 15 ]
    }, {
      "id" : 10,
      "x" : 10,
      "y" : 10,
      "radius" : 3,
      "position" : 1,
      "attachmentIds" : [ 4 ]
    } ]
  }, {
    "id" : 3,
    "type" : 0,
    "x" : 39,
    "y" : 132,
    "width" : 50,
    "height" : 50,
    "vertexSet" : [ {
      "id" : 11,
      "x" : 36,
      "y" : 129,
      "radius" : 3,
      "position" : 0,
      "attachmentIds" : []
    }, {
      "id" : 12,
      "x" : 61,
      "y" : 129,
      "radius" : 3,
      "position" : 1,
      "attachmentIds" : []
    }, {
      "id" : 13,
      "x" : 86,
      "y" : 129,
      "radius" : 3,
      "position" : 2,
      "attachmentIds" : []
    }, {
      "id" : 14,
      "x" : 36,
      "y" : 154,
      "radius" : 3,
      "position" : 3,
      "attachmentIds" : []
    }, {
      "id" : 15,
      "x" : 86,
      "y" : 154,
      "radius" : 3,
      "position" : 4,
      "attachmentIds" : [ 9, 27, 37 ]
    }, {
      "id" : 16,
      "x" : 36,
      "y" : 179,
      "radius" : 3,
      "position" : 5,
      "attachmentIds" : []
    }, {
      "id" : 17,
      "x" : 61,
      "y" : 179,
      "radius" : 3,
      "position" : 6,
      "attachmentIds" : []
    }, {
      "id" : 18,
      "x" : 86,
      "y" : 179,
      "radius" : 3,
      "position" : 7,
      "attachmentIds" : []
    } ]
  }, {
    "id" : 4,
    "type" : 0,
    "x" : 175,
    "y" : 232,
    "width" : 50,
    "height" : 50,
    "vertexSet" : [ {
      "id" : 19,
      "x" : 172,
      "y" : 229,
      "radius" : 3,
      "position" : 0,
      "attachmentIds" : []
    }, {
      "id" : 20,
      "x" : 197,
      "y" : 229,
      "radius" : 3,
      "position" : 1,
      "attachmentIds" : [ 28 ]
    }, {
      "id" : 21,
      "x" : 222,
      "y" : 229,
      "radius" : 3,
      "position" : 2,
      "attachmentIds" : []
    }, {
      "id" : 22,
      "x" : 172,
      "y" : 254,
      "radius" : 3,
      "position" : 3,
      "attachmentIds" : []
    }, {
      "id" : 23,
      "x" : 222,
      "y" : 254,
      "radius" : 3,
      "position" : 4,
      "attachmentIds" : []
    }, {
      "id" : 24,
      "x" : 172,
      "y" : 279,
      "radius" : 3,
      "position" : 5,
      "attachmentIds" : []
    }, {
      "id" : 25,
      "x" : 197,
      "y" : 279,
      "radius" : 3,
      "position" : 6,
      "attachmentIds" : []
    }, {
      "id" : 26,
      "x" : 222,
      "y" : 279,
      "radius" : 3,
      "position" : 7,
      "attachmentIds" : []
    } ]
  }, {
    "id" : 5,
    "type" : 1,
    "Mx" : 89,
    "My" : 157,
    "Lx" : 200,
    "Ly" : 232,
    "vertexSet" : [ {
      "id" : 27,
      "x" : 10,
      "y" : 10,
      "radius" : 3,
      "position" : 0,
      "attachmentIds" : [ 15 ]
    }, {
      "id" : 28,
      "x" : 10,
      "y" : 10,
      "radius" : 3,
      "position" : 1,
      "attachmentIds" : [ 20 ]
    } ]
  }, {
    "id" : 6,
    "src" : "../image/icon-server.png",
    "type" : 2,
    "x" : 204,
    "y" : 156,
    "width" : 50,
    "height" : 50,
    "vertexSet" : [ {
      "id" : 29,
      "x" : 201,
      "y" : 153,
      "radius" : 3,
      "position" : 0,
      "attachmentIds" : []
    }, {
      "id" : 30,
      "x" : 226,
      "y" : 153,
      "radius" : 3,
      "position" : 1,
      "attachmentIds" : []
    }, {
      "id" : 31,
      "x" : 251,
      "y" : 153,
      "radius" : 3,
      "position" : 2,
      "attachmentIds" : []
    }, {
      "id" : 32,
      "x" : 201,
      "y" : 178,
      "radius" : 3,
      "position" : 3,
      "attachmentIds" : [ 38 ]
    }, {
      "id" : 33,
      "x" : 251,
      "y" : 178,
      "radius" : 3,
      "position" : 4,
      "attachmentIds" : []
    }, {
      "id" : 34,
      "x" : 201,
      "y" : 203,
      "radius" : 3,
      "position" : 5,
      "attachmentIds" : []
    }, {
      "id" : 35,
      "x" : 226,
      "y" : 203,
      "radius" : 3,
      "position" : 6,
      "attachmentIds" : []
    }, {
      "id" : 36,
      "x" : 251,
      "y" : 203,
      "radius" : 3,
      "position" : 7,
      "attachmentIds" : []
    } ]
  }, {
    "id" : 7,
    "type" : 1,
    "Mx" : 89,
    "My" : 157,
    "Lx" : 204,
    "Ly" : 181,
    "vertexSet" : [ {
      "id" : 37,
      "x" : 10,
      "y" : 10,
      "radius" : 3,
      "position" : 0,
      "attachmentIds" : [ 15 ]
    }, {
      "id" : 38,
      "x" : 10,
      "y" : 10,
      "radius" : 3,
      "position" : 1,
      "attachmentIds" : [ 32 ]
    } ]
  } ]
};
