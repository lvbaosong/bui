/**
 * @fileOverview Data 命名空间的入口文件
 * @ignore
 */
(function(){
var BASE = 'bui/data/';
define('bui/data',['bui/common',BASE + 'sortable',BASE + 'proxy',BASE + 'abstractstore',BASE + 'store',
  BASE + 'node',BASE + 'treestore'],function(r) {
  
  var BUI = r('bui/common'),
    Data = BUI.namespace('Data');
  BUI.mix(Data,{
    Sortable : r(BASE + 'sortable'),
    Proxy : r(BASE + 'proxy'),
    AbstractStore : r(BASE + 'abstractstore'),
    Store : r(BASE + 'store'),
    Node : r(BASE + 'node'),
    TreeStore : r(BASE + 'treestore')
  });

  return Data;
});
})();
/**
 * @fileOverview 可排序扩展类
 * @ignore
 */

define('bui/data/sortable',function() {

  var ASC = 'ASC',
    DESC = 'DESC';
  /**
   * 排序扩展方法，无法直接使用
   * 请在继承了 {@link BUI.Base}的类上使用
   * @class BUI.Data.Sortable
   * @extends BUI.Base
   */
  var sortable = function(){

  };

  sortable.ATTRS = 
  /**
   * @lends BUI.Data.Sortable#
   * @ignore
   */
  {
    /**
     * 比较函数
     * @cfg {Function} compareFunction
     * 函数原型 function(v1,v2)，比较2个字段是否相等
     * 如果是字符串则按照本地比较算法，否则使用 > ,== 验证
     */
    /**
     * 比较函数
     * @type {Function}
     * 函数原型 function(v1,v2)，比较2个字段是否相等
     * 如果是字符串则按照本地比较算法，否则使用 > ,== 验证
     */
    compareFunction:{
      value : function(v1,v2){
        if(v1 === undefined){
          v1 = '';
        }
        if(v2 === undefined){
          v2 = '';
        }
        if(BUI.isString(v1)){
          return v1.localeCompare(v2);
        }

        if(v1 > v2){
          return 1;
        }else if(v1 === v2){
          return 0;
        }else{
          return  -1;
        }
      }
    },
    /**
     * 排序字段
     * @cfg {String} sortField
     */
    /**
     * 排序字段
     * @type {String}
     */
    sortField : {

    },
    /**
     * 排序方向,'ASC'、'DESC'
     * @cfg {String} [sortDirection = 'ASC']
     */
    /**
     * 排序方向,'ASC'、'DESC'
     * @type {String}
     */
    sortDirection : {
      value : 'ASC'
    },
    /**
     * 排序信息
     * <ol>
     * <li>field: 排序字段</li>
     * <li>direction: 排序方向,ASC(默认),DESC</li>
     * </ol>
     * @cfg {Object} sortInfo
     */
    /**
     * 排序信息
     * <ol>
     * <li>field: 排序字段</li>
     * <li>direction: 排序方向,ASC(默认),DESC</li>
     * </ol>
     * @type {Object}
     */
    sortInfo: {
      getter : function(){
        var _self = this,
          field = _self.get('sortField');

        return {
          field : field,
          direction : _self.get('sortDirection')
        };
      },
      setter: function(v){
        var _self = this;

        _self.set('sortField',v.field);
        _self.set('sortDirection',v.direction);
      }
    }
  };

  BUI.augment(sortable,
  /**
   * @lends BUI.Data.Sortable.prototype
   * @ignore
   */
  {
    compare : function(obj1,obj2,field,direction){

      var _self = this,
        dir;
      field = field || _self.get('sortField');
      direction = direction || _self.get('sortDirection');
      //如果未指定排序字段，或方向，则按照默认顺序
      if(!field || !direction){
        return 1;
      }
      dir = direction === ASC ? 1 : -1;

      return _self.get('compareFunction')(obj1[field],obj2[field]) * dir;
    },
    /**
     * 获取排序的集合
     * @protected
     * @return {Array} 排序集合
     */
    getSortData : function(){

    },
    /**
     * 排序数据
     * @param  {String|Array} field   排序字段或者数组
     * @param  {String} direction 排序方向
     * @param {Array} records 排序
     * @return {Array}    
     */
    sortData : function(field,direction,records){
      var _self = this,
        records = records || _self.getSortData();

      if(BUI.isArray(field)){
        records = field;
        field = null;
      }

      field = field || _self.get('sortField');
      direction = direction || _self.get('sortDirection');

      _self.set('sortField',field);
      _self.set('sortDirection',direction);

      if(!field || !direction){
        return records;
      }

      records.sort(function(obj1,obj2){
        return _self.compare(obj1,obj2,field,direction);
      });
      return records;
    }
  });

  return sortable;
});
define('bui/data/proxy',['bui/data/sortable'],function(require) {

  var Sortable = require('bui/data/sortable');

  /**
   * 数据代理对象，加载数据,
   * 一般不直接使用，在store里面决定使用什么类型的数据代理对象
   * @class BUI.Data.Proxy
   * @extends BUI.Base
   * @abstract 
   */
  var proxy = function(config){
    proxy.superclass.constructor.call(this,config);
  };

  proxy.ATTRS = {
    
  };

  BUI.extend(proxy,BUI.Base);

  BUI.augment(proxy,
  /**
   * @lends BUI.Data.Proxy.prototype
   * @ignore
   */
  {
    /**
     * @protected
     * @private
     */
    _read : function(params,callback){

    },
    /**
     * 读数据
     * @param  {Object} params 键值对形式的参数
     * @param {Function} callback 回调函数，函数原型 function(data){}
     * @param {Object} scope 回调函数的上下文
     */
    read : function(params,callback,scope){
      var _self = this;
      scope = scope || _self;

      _self._read(params,function(data){
        callback.call(scope,data);
      });
    },
    /**
     * 更新数据
     * @protected
     */
    update : function(params,callback,scope){

    }
  });

  /**
   * 异步加载数据的代理
   * @class BUI.Data.Proxy.Ajax
   * @extends BUI.Data.Proxy
   */
  var ajaxProxy = function(config){
    ajaxProxy.superclass.constructor.call(this,config);
  };

  ajaxProxy.ATTRS = BUI.mix(true,proxy.ATTRS,
  /**
   * @lends BUI.Data.Proxy.Ajax#
   * @ignore
   */
  {
    /**
     * 限制条数
     * @cfg {String} [limitParam='limit'] 
     */
    /**
     * 限制条数
     * @type {String}
     * @default 'limit'
     */
    limitParam : {
      value : 'limit'
    },
    /**
     * 起始纪录代表的字段
     * @cfg {String} [startParam='start']
     */
    /**
     * 起始纪录代表的字段
     * @type {String}
     */
    startParam : {
      value : 'start'
    },
    /**
     * 页码的字段名
     * @cfg {String} [pageIndexParam='pageIndex']
     */
    /**
     * 页码的字段名
     * @type {String}
     * @default 'pageIndex'
     */
    pageIndexParam : {
      value : 'pageIndex'
    },
    /**
    * 加载数据时，返回的格式,目前只支持"json、jsonp"格式<br>
    * @cfg {String} [dataType='json']
    */
   /**
    * 加载数据时，返回的格式,目前只支持"json、jsonp"格式<br>
    * @type {String}
    * @default "json"
    */
    dataType: {
      value : 'json'
    },
    /**
     * 获取数据的方式,'GET'或者'POST',默认为'GET'
     * @cfg {String} [method='GET']
     */
    /**
     * 获取数据的方式,'GET'或者'POST',默认为'GET'
     * @type {String}
     * @default 'GET'
     */
    method : {
      value : 'GET'
    },
    /**
     * 是否不读取缓存数据
     * @cfg {Boolean} [noCache=true]
     */
    /**
     * 是否不读取缓存数据
     * @type {Boolean}
     */
    noCache : {
      value : true
    },
    /**
     * 是否使用Cache
     * @type {Boolean}
     */
    cache : {
      value : false
    },
    /**
     * 加载数据的链接
     * @cfg {String} url
     * @required
     */
    /**
     * 加载数据的链接
     * @type {String}
     * @required
     */
    url :{

    }

  });
  BUI.extend(ajaxProxy,proxy);

  BUI.augment(ajaxProxy,{
    _processParams : function(params){
      var _self = this,
        arr = ['start','limit','pageIndex'];

      $.each(arr,function(field){
        var fieldParam = _self.get(field+'Param');
        if(fieldParam !== field){
          params[fieldParam] = params[field];
          delete params[field];
        }
      });
    },
    /**
     * @protected
     * @private
     */
    _read : function(params,callback){
      var _self = this;

      params = BUI.cloneObject(params);
      _self._processParams(params);

      $.ajax({
        url: _self.get('url'),
        type : _self.get('method'),
        dataType: _self.get('dataType'),
        data : params,
        cache : _self.get('cache'),
        success: function(data) {
          callback(data);
        },
        error : function(jqXHR, textStatus, errorThrown){
          var result = {
            exception : {
              status : textStatus,
              errorThrown: errorThrown,
              jqXHR : jqXHR
            }
          };
          callback(result);
        }
      });
    }
  });

  /**
   * 读取缓存的代理
   * @class BUI.Data.Proxy.Memery
   * @extends BUI.Data.Proxy
   * @mixins BUI.Data.Sortable
   */
  var memeryProxy = function(config){
    memeryProxy.superclass.constructor.call(this,config);
  };

  BUI.extend(memeryProxy,proxy);

  BUI.mixin(memeryProxy,[Sortable]);

  BUI.augment(memeryProxy,{
    /**
     * @protected
     * @ignore
     */
    _read : function(params,callback){
      var _self = this,
        pageable = params.pageable,
        start = params.start,
        sortField = params.sortField,
        sortDirection = params.sortDirection,
        limit = params.limit,
        data = _self.get('data'),
        rows = []; 

      _self.sortData(sortField,sortDirection); 

      if(limit){//分页时
        rows = data.slice(start,start + limit);
        callback({rows:rows,results:data.length});
      }else{//不分页时
        rows = data.slice(start);
        callback(rows);
      }
      
    }

  });

  proxy.Ajax = ajaxProxy;
  proxy.Memery = memeryProxy;

  return proxy;


});
/**
 * @fileOverview 抽象数据缓冲类
 * @ignore
 */

define('bui/data/abstractstore',['bui/common','bui/data/proxy'],function (require) {
  var BUI = require('bui/common'),
    Proxy = require('bui/data/proxy');

  /**
   * @class BUI.Data.AbstractStore
   * 数据缓冲抽象类
   * @extends BUI.Base
   */
  function AbstractStore(config){
    AbstractStore.superclass.constructor.call(this,config);
    this._init();
  }

  AbstractStore.ATTRS = {
    /**
    * 创建对象时是否自动加载
    * @cfg {Boolean} [autoLoad=false]
    */
    /**
    * 创建对象时是否自动加载
    * @type {Boolean}
    * @default false
    */
    autoLoad: {
      value :false 
    },
    /**
     * 上次查询的参数
     * @type {Object}
     * @readOnly
     */
    lastParams : {
      value : {}
    },
    /**
     * 初始化时查询的参数，在初始化时有效
     * @cfg {Object} params
     */
    params : {

    },
    /**
     * 数据代理对象
     * @type {Object|BUI.Data.Proxy}
     * @protected
     */
    proxy : {
      value : {
        
      }
    },
    /**
     * 请求数据的地址，通过ajax加载数据，
     * 此参数设置则加载远程数据
     * 否则把 {BUI.Data.Store#cfg-data}作为本地缓存数据加载
     * @cfg {String} url
     */
    /**
     * @ignore
     */
    url : {

    },
    events : {
      value : [
        /**  
        * 数据接受改变，所有增加、删除、修改的数据记录清空
        * @name BUI.Data.Store#acceptchanges
        * @event  
        */
        'acceptchanges',
        /**  
        * 当数据加载完成后
        * @name BUI.Data.Store#load  
        * @event  
        * @param {jQuery.Event} e  事件对象，包含加载数据时的参数
        */
        'load',

        /**  
        * 当数据加载前
        * @name BUI.Data.Store#beforeload
        * @event  
        */
        'beforeload',

        /**  
        * 发生在，beforeload和load中间，数据已经获取完成，但是还未触发load事件，用于获取返回的原始数据
        * @name BUI.Data.Store#beforeProcessLoad
        * @event  
        * @param {jQuery.Event} e  事件对象
        * @param {Object} e.data 从服务器端返回的数据
        */
        'beforeProcessLoad',
        
        /**  
        * 当添加数据时触发该事件
        * @event  
        * @param {jQuery.Event} e  事件对象
        * @param {Object} e.record 添加的数据
        */
        'add',

        /**
        * 加载数据发生异常时触发
        * @event
        * @name BUI.Data.Store#exception
        * @param {jQuery.Event} e 事件对象
        * @param {String|Object} e.error 加载数据时返回的错误信息或者加载数据失败，浏览器返回的信息（httpResponse 对象 的textStatus）
        * @param {String} e.responseText 网络或者浏览器加载数据发生错误是返回的httpResponse 对象的responseText
        */
        'exception',

        /**  
        * 当删除数据是触发该事件
        * @event  
        * @param {jQuery.Event} e  事件对象
        * @param {Object} e.data 删除的数据
        */
        'remove',
        
        /**  
        * 当更新数据指定字段时触发该事件 
        * @event  
        * @param {jQuery.Event} e  事件对象
        * @param {Object} e.record 更新的数据
        * @param {Object} e.field 更新的字段
        * @param {Object} e.value 更新的值
        */
        'update',

        /**  
        * 前端发生排序时触发
        * @name BUI.Data.Store#localsort
        * @event  
        * @param {jQuery.Event} e  事件对象
        * @param {Object} e.field 排序的字段
        * @param {Object} e.direction 排序的方向 'ASC'，'DESC'
        */
        'localsort'
      ]
    },
    /**
     * 本地数据源,使用本地数据源时会使用{@link BUI.Data.Proxy.Memery}
     * @cfg {Array} data
     */
    /**
     * 本地数据源
     * @type {Array}
     */
    data : {
      setter : function(data){
        var _self = this,
          proxy = _self.get('proxy');
        if(proxy.set){
          proxy.set('data',data);
        }else{
          proxy.data = data;
        }
        //设置本地数据时，把autoLoad置为true
        _self.set('autoLoad',true);
      }
    }
  };

  BUI.extend(AbstractStore,BUI.Base);

  BUI.augment(AbstractStore,{
    /**
     * 是否是数据缓冲对象，用于判断对象
     * @type {Boolean}
     */
    isStore : true,
    /**
     * @private
     * 初始化
     */
    _init : function(){
      var _self = this;

      _self.beforeInit();
      //初始化结果集
      _self._initParams();
      _self._initProxy();
      _self._initData();
    },
    /**
     * @protected
     * 初始化之前
     */
    beforeInit : function(){

    },
    //初始化数据,如果默认加载数据，则加载数据
    _initData : function(){
      var _self = this,
        autoLoad = _self.get('autoLoad');

      if(autoLoad){
        _self.load();
      }
    },
    //初始化查询参数
    _initParams : function(){
      var _self = this,
        lastParams = _self.get('lastParams'),
        params = _self.get('params');

      //初始化 参数
      BUI.mix(lastParams,params);
    },
    /**
     * @protected
     * 初始化数据代理类
     */
    _initProxy : function(){
      var _self = this,
        url = _self.get('url'),
        proxy = _self.get('proxy');

      if(!(proxy instanceof Proxy)){

        if(url){
          proxy.url = url;
        }

        //异步请求的代理类
        if(proxy.type === 'ajax' || proxy.url){
          proxy = new Proxy.Ajax(proxy);
        }else{
          proxy = new Proxy.Memery(proxy);
        }

        _self.set('proxy',proxy);
      }
    },
    /**
     * 加载数据
     * @param  {Object} params 参数键值对
     * @param {Function} fn 回调函数，默认为空
     */
    load : function(params,callback){
      var _self = this,
        proxy = _self.get('proxy'),
        lastParams = _self.get('lastParams');

      BUI.mix(true,lastParams,_self.getAppendParams(),params);

      _self.fire('beforeload',{params:lastParams});

      //防止异步请求未结束，又发送新请求回调参数错误
      params = BUI.cloneObject(lastParams);
      proxy.read(lastParams,function(data){
        _self.onLoad(data,params);
        if(callback){
          callback(data,params);
        }
      },_self);
    },
    /**
     * 加载完数据
     * @template
     */
    onLoad : function(data,params){
      var _self = this;

      var processResult = _self.processLoad(data,params);
      //如果处理成功，返回错误时，不进行后面的处理
      if(processResult){
        _self.afterProcessLoad(data,params);
      }
    },
    /**
     * @private
     * 加载完数据处理数据
     */
    processLoad : function(data,params){
      var _self = this,
        hasErrorField = _self.get('hasErrorProperty');
      //获取的原始数据
      _self.fire('beforeProcessLoad',data);

      if(data[hasErrorField] || data.exception){
        _self.onException(data);
        return false;
      }
      return true;
    },
    /**
     * @protected
     * @template
     * 处理数据后
     */
    afterProcessLoad : function(data,params){

    },
    /**
     * @protected
     * 处理错误函数
     * @param  {*} data 出错对象
     */
    onException : function(data){
      var _self = this,
        errorProperty = _self.get('errorProperty'),
        obj = {};
      //网络异常、转码错误之类，发生在json获取或转变时
      if(data.exception){
        obj.type = 'exception';
        obj[errorProperty] = data.exception;
      }else{//用户定义的错误
        obj.type = 'error';
        obj[errorProperty] = data[errorProperty];
      }
      _self.fire('exception',obj);

    },
    /**
     * 是否包含数据
     * @return {Boolean} 
     */
    hasData : function(){

    },
    /**
     * 获取附加的参数
     * @template
     * @protected
     * @return {Object} 附加的参数
     */
    getAppendParams : function(){
      return {};
    }
  });

  return AbstractStore;
});/**
 * @fileOverview 树形数据结构的节点类，无法直接使用数据作为节点，所以进行一层封装
 * 可以直接作为TreeNode控件的配置项
 * @ignore
 */

define('bui/data/node',['bui/common'],function (require) {
  var BUI = require('bui/common');

  function mapNode(cfg,map){
    var rst = {};
    if(map){
      BUI.each(cfg,function(v,k){
        var name = map[k] || k;
        rst[name] = v;
      });
      rst.record = cfg;
    }else{
      rst = cfg;
    }
    return rst;
  }
  /**
   * @class BUI.Data.Node
   * 树形数据结构的节点类
   */
  function Node (cfg,map) {
    var _self = this;
    cfg = mapNode(cfg,map);
    BUI.mix(this,cfg);
  }

  BUI.augment(Node,{
    /**
     * 是否根节点
     * @type {Boolean}
     */
    root : false,
    /**
     * 是否叶子节点
     * @type {Boolean}
     */
    leaf : false,
    /**
     * 显示节点时显示的文本
     * @type {Object}
     */
    text : '',
    /**
     * 代表节点的编号
     * @type {String}
     */
    id : null,
    /**
     * 子节点是否已经加载过
     * @type {Boolean}
     */
    loaded : false,
    /**
     * 从根节点到此节点的路径，id的集合如： ['0','1','12'],
     * 便于快速定位节点
     * @type {Array}
     */
    path : null,
    /**
     * 父节点
     * @type {BUI.Data.Node}
     */
    parent : null,
    /**
     * 树节点的等级
     * @type {Number}
     */
    level : 0,
    /**
     * 节点是否由一条记录封装而成
     * @type {Object}
     */
    record : null,
    /**
     * 子节点集合
     * @type {BUI.Data.Node[]}
     */
    children : null,
    /**
     * 是否是Node对象
     * @type {Object}
     */
    isNode : true
  });
  return Node;
});/**
 * @fileOverview 树形对象缓冲类
 * @ignore
 */

define('bui/data/treestore',['bui/common','bui/data/node','bui/data/abstractstore','bui/data/proxy'],function (require) {

  var BUI = require('bui/common'),
    Node = require('bui/data/node'),
    Proxy = require('bui/data/proxy'),
    AbstractStore = require('bui/data/abstractstore');

  /**
   * @class BUI.Data.TreeStore
   * 树形数据缓冲类
   * <p>
   * <img src="../assets/img/class-data.jpg"/>
   * </p>
   * <pre><code>
   *   //加载静态数据
   *   var store = new TreeStore({
   *     root : {
   *       text : '根节点',
   *       id : 'root'
   *     },
   *     data : [{id : '1',text : 1},{id : '2',text : 2}] //会加载成root的children
   *   });
   *   //异步加载数据，自动加载数据时，会调用store.load({id : 'root'}); //root为根节点的id
   *   var store = new TreeStore({
   *     root : {
   *       text : '根节点',
   *       id : 'root'
   *     },
   *     url : 'data/nodes.php',
   *     autoLoad : true  //设置自动加载，初始化后自动加载数据
   *   });
   *
   *   //加载指定节点
   *   var node = store.findNode('1');
   *   store.loadNode(node);
   *   //或者
   *   store.load({id : '1'});//可以配置自定义参数，返回值附加到指定id的节点上
   * </code></pre>
   * @extends BUI.Data.AbstractStore
   */
  function TreeStore(config){
    TreeStore.superclass.constructor.call(this,config);
  }

  TreeStore.ATTRS = {
    /**
     * 根节点
     * <pre><code>
     *  var store = new TreeStore({
     *    root : {text : '根节点',id : 'rootId',children : [{id : '1',text : '1'}]}
     *  });
     * </code></pre>
     * @cfg {Object} root
     */
    /**
     * 根节点,初始化后不要更改对象，可以更改属性值
     * <pre><code>
     *  var root = store.get('root');
     *  root.text = '修改的文本'；
     *  store.update(root);
     * </code></pre>
     * @type {Object}
     * @readOnly
     */
    root : {

    },
    /**
     * 数据映射，用于设置的数据跟@see {BUI.Data.Node} 不一致时，进行匹配。
     * 如果此属性为null,那么假设设置的对象是Node对象
     * <pre><code>
     *   //例如原始数据为 {name : '123',value : '文本123',isLeaf: false,nodes : []}
     *   var store = new TreeStore({
     *     map : {
     *       id : 'name',
     *       text : 'value',
     *       leaf : 'isLeaf',
     *       children : 'nodes'
     *     }
     *   });
     *   //映射后，记录会变成  {id : '123',text : '文本123',leaf: false,children : []};
     *   //此时原始记录会作为对象的 record属性
     *   var node = store.findNode('123'),
     *     record = node.record;
     * </code></pre> 
     * **Notes:**
     * 使用数据映射的记录仅做于展示数据，不作为可更改的数据，add,update不会更改数据的原始数据
     * @cfg {Object} map
     */
    map : {

    },
    /**
     * 返回数据标示数据的字段</br>
     * 异步加载数据时，返回数据可以使数组或者对象
     * - 如果返回的是对象,可以附加其他信息,那么取对象对应的字段 {nodes : [],hasError:false}
     * - 如何获取附加信息参看 @see {BUI.Data.AbstractStore-event-beforeProcessLoad}
     * <pre><code>
     *  //返回数据为数组 [{},{}]，会直接附加到加载的节点后面
     *  
     *  var node = store.loadNode('123');
     *  store.loadNode(node);
     *  
     * </code></pre>
     * @cfg {Object} [dataProperty = 'nodes']
     */
    dataProperty : {
      value : 'nodes'
    },
    events : {
      value : [
        /**  
        * 当添加数据时触发该事件
        * @event  
        * <pre><code>
        *  store.on('add',function(ev){
        *    list.addItem(e.node,index);
        *  });
        * </code></pre>
        * @param {jQuery.Event} e  事件对象
        * @param {Object} e.node 添加的节点
        * @param {Number} index 添加的位置
        */
        'add',
        /**  
        * 当更新数据指定字段时触发该事件 
        * @event  
        * @param {jQuery.Event} e  事件对象
        * @param {Object} e.node 更新的节点
        */
        'update',
        /**  
        * 当删除数据时触发该事件
        * @event  
        * @param {jQuery.Event} e  事件对象
        * @param {Object} e.node 删除的节点
        * @param {Number} index 删除节点的索引
        */
        'remove',
        /**  
        * 节点加载完毕触发该事件
        * <pre></code>
        *   //异步加载节点,此时节点已经附加到加载节点的后面
        *   store.on('load',function(ev){
        *     var params = ev.params,
        *       id = params.id,
        *       node = store.findNode(id),
        *       children = node.children;  //节点的id
        *     //TO DO
        *   });
        * </code></pre>
        * 
        * @event  
        * @param {jQuery.Event} e  事件对象
        * @param {Object} e.node 加载的节点
        * @param {Object} e.params 加载节点时的参数
        */
        'load'
      ]
    }
  }

  BUI.extend(TreeStore,AbstractStore);

  BUI.augment(TreeStore,{
    /**
     * @protected
     * @override
     * 初始化前
     */
    beforeInit:function(){
      this.initRoot();
    },
    //初始化数据,如果默认加载数据，则加载数据
    _initData : function(){
      var _self = this,
        autoLoad = _self.get('autoLoad'),
        root = _self.get('root');

      if(autoLoad && !root.children){
        params = root.id ? {id : root.id}: {};
        _self.load(params);
      }
    },
    /**
     * @protected
     * 初始化根节点
     */
    initRoot : function(){
      var _self = this,
        map = _self.get('map'),
        root = _self.get('root');
      if(!root){
        root = {};
      }
      if(!root.isNode){
        root = new Node(root,map);
        //root.children= [];
      }
      root.path = [root.id];
      root.level = 0;
      if(root.children){
        _self.setChildren(root,root.children);
      }
      _self.set('root',root);
    },
    /**
     * 添加节点，触发{@link BUI.Data.TreeStore#event-add} 事件
     * <pre><code>
     *  //添加到根节点下
     *  store.add({id : '1',text : '1'});
     *  //添加到指定节点
     *  var node = store.findNode('1'),
     *    subNode = store.add({id : '11',text : '11'},node);
     *  //插入到节点的指定位置
     *  var node = store.findNode('1'),
     *    subNode = store.add({id : '12',text : '12'},node,0);
     * </code></pre>
     * @param {BUI.Data.Node|Object} node 节点或者数据对象
     * @param {BUI.Data.Node} [parent] 父节点,如果未指定则为根节点
     * @param {Number} [index] 添加节点的位置
     * @return {BUI.Data.Node} 添加完成的节点
     */
    add : function(node,parent,index){
      var _self = this;

      node = _self._add(node,parent,index);
      _self.fire('add',{node : node,index : index});
      return node;
    },
    //
    _add : function(node,parent,index){
      parent = parent || this.get('root');  //如果未指定父元素，添加到跟节点
      var _self = this,
        map = _self.get('map'),
        nodes = parent.children,
        nodeChildren = node.children || [];
      if(nodeChildren.length == 0 && node.leaf == null){
        node.leaf = true;
      }
      if(parent){
        parent.leaf = false;
      }
      if(!node.isNode){
        node = new Node(node,map);
      }
      node.parent = parent;
      node.level = parent.level + 1;
      node.path = parent.path.concat(node.id);
      index = index == null ? parent.children.length : index;
      BUI.Array.addAt(nodes,node,index);

      _self.setChildren(node,nodeChildren);
      return node;
    },
    /**
     * 移除节点，触发{@link BUI.Data.TreeStore#event-remove} 事件
     * 
     * <pre><code>
     *  var node = store.findNode('1'); //根据节点id 获取节点
     *  store.remove(node);
     * </code></pre>
     * 
     * @param {BUI.Data.Node} node 节点或者数据对象
     * @return {BUI.Data.Node} 删除的节点
     */
    remove : function(node){
      var parent = node.parent || _self.get('root'),
        index = BUI.Array.indexOf(node,parent.children) ;

      BUI.Array.remove(parent.children,node);
      if(parent.children.length === 0){
        parent.leaf = true;
      }
      this.fire('remove',{node : node , index : index});
      node.parent = null;
      return node;
    },
    /**
     * 更新节点
     * <pre><code>
     *  var node = store.findNode('1'); //根据节点id 获取节点
     *  node.text = 'modify text'; //修改文本
     *  store.update(node);        //此时会触发update事件，绑定了store的控件会更新对应的DOM
     * </code></pre>
     * @return {BUI.Data.Node} 更新节点
     */
    update : function(node){
      this.fire('update',{node : node});
    },
    /**
     * 返回缓存的数据，根节点的直接子节点集合
     * <pre><code>
     *   //获取根节点的所有子节点
     *   var data = store.getResult();
     *   //获取根节点
     *   var root = store.get('root');
     * </code></pre>
     * @return {Array} 根节点下面的数据
     */
    getResult : function(){
      return this.get('root').children;
    },
    /**
     * 设置缓存的数据，设置为根节点的数据
    *   <pre><code>
    *     var data = [
    *       {id : '1',text : '文本1'},
    *       {id : '2',text : '文本2',children:[
    *         {id : '21',text : '文本21'}
    *       ]},
    *       {id : '3',text : '文本3'}
    *     ];
    *     store.setResult(data); //会对数据进行格式化，添加leaf等字段：
    *                            //[{id : '1',text : '文本1',leaf : true},{id : '2',text : '文本2',leaf : false,children:[...]}....]
    *   </code></pre>
     * @param {Array} data 缓存的数据
     */
    setResult : function(data){
      var _self = this,
        proxy = _self.get('proxy'),
        root = _self.get('root');
      if(proxy instanceof Proxy.Memery){
        _self.set('data',data);
        _self.load({id : root.id});
      }else{
        _self.setChildren(root,data);
      }
    },
    /**
     * 设置子节点
     * @protected
     * @param {BUI.Data.Node} node  节点
     * @param {Array} children 子节点
     */
    setChildren : function(node,children){
      var _self = this;
      node.children = [];
      if(!children.length){
        return;
      }
      BUI.each(children,function(item){
        _self._add(item,node);
      });
    },
    /**
     * 查找节点
     * <pre><code>
     *  var node = store.findNode('1');//从根节点开始查找节点
     *  
     *  var subNode = store.findNode('123',node); //从指定节点开始查找
     * </code></pre>
     * @param  {String} id 节点Id
     * @param  {BUI.Data.Node} [parent] 父节点
     * @param {Boolean} [deep = true] 是否递归查找
     * @return {BUI.Data.Node} 节点
     */
    findNode : function(id,parent,deep){
      var _self = this;
      deep = deep == null ? true : deep;
      if(!parent){
        var root = _self.get('root');
        if(root.id === id){
          return root;
        }
        return _self.findNode(id,root);
      }
      var children = parent.children,
        rst = null;
      BUI.each(children,function(item){
        if(item.id === id){
          rst = item;
        }else if(deep){
          rst = _self.findNode(id,item);
        }
        if(rst){
          return false;
        }
      });
      return rst;
    },
    /**
     * 查找节点,根据匹配函数查找
     * <pre><code>
     *  var nodes = store.findNodesBy(function(node){
     *   if(node.status == '0'){
     *     return true;
     *   }
     *   return false;
     *  });
     * </code></pre>
     * @param  {Function} func 匹配函数
     * @param  {BUI.Data.Node} [parent] 父元素，如果不存在，则从根节点查找
     * @return {Array} 节点数组
     */
    findNodesBy : function(func,parent){
      var _self = this,
        root,
        rst = [];

      if(!parent){
        parent = _self.get('root');
      }

      BUI.each(parent.children,function(item){
        if(func(item)){
          rst.push(item);
        }
        rst = rst.concat(_self.findNodesBy(func,item));
      });

      return rst;
    },
    /**
     * 根据path查找节点
     * @return {BUI.Data.Node} 节点
     * @ignore
     */
    findNodeByPath : function(path){
      if(!path){
        return null;
      }
      var _self = this,
        root = _self.get('root'),
        pathArr = path.split(','),
        node,
        i,
        tempId = pathArr[0];
      if(!tempId){
        return null;
      }
      if(root.id == tempId){
        node = root;
      }else{
        node = _self.findNode(tempId,root,false);
      }
      if(!node){
        return;
      }
      for(i = 1 ; i < pathArr.length ; i = i + 1){
        var tempId = pathArr[i];
        node = _self.findNode(tempId,node,false);
        if(!node){
          break;
        }
      }
      return node;
    },
    /**
     * 是否包含指定节点，如果未指定父节点，从根节点开始搜索
     * <pre><code>
     *  store.contains(node); //是否存在节点
     *
     *  store.contains(subNode,node); //节点是否存在指定子节点
     * </code></pre>
     * @param  {BUI.Data.Node} node 节点
     * @param  {BUI.Data.Node} parent 父节点
     * @return {Boolean} 是否包含指定节点
     */
    contains : function(node,parent){
      var _self = this,
        findNode = _self.findNode(node.id,parent);
      return !!findNode;
    },
    /**
     * 加载完数据
     * @protected
     * @override
     */
    afterProcessLoad : function(data,params){
      var _self = this,
        id = params.id,
        dataProperty = _self.get('dataProperty'),
        node = _self.findNode(id) || _self.get('root');//如果找不到父元素，则放置在跟节点

      if(BUI.isArray(data)){
        _self.setChildren(node,data);
      }else{
        _self.setChildren(node,data[dataProperty]);
      }
      _self.fire('load',{node : node,params : params});
    },
    /**
     * 是否包含数据
     * @return {Boolean} 
     */
    hasData : function(){
      return true;
      //return this.get('root').children && this.get('root').children.length !== 0;
    },
    /**
     * 是否已经加载过，叶子节点或者存在字节点的节点
     * @param   {BUI.Data.Node} node 节点
     * @return {Boolean}  是否加载过
     */
    isLoaded : function(node){
      if(!this.get('url')){ //如果不从远程加载数据,默认已经加载
        return true;
      }
      return node.leaf || (node.children && node.children.length);
    },
    /**
     * 加载节点的子节点
     * @param  {BUI.Data.Node} node 节点
     */
    loadNode : function(node){
      var _self = this;
      //如果已经加载过，或者节点是叶子节点
      if(_self.isLoaded(node)){
        return ;
      }
      if(!_self.get('url')){ //如果不从远程加载数据，不是根节点的话，取消加载
        return;
      }else{
        _self.load({id:node.id,path : ''});
      }
      
    },
    /**
     * 加载节点，根据path
     * @param  {String} path 加载路径
     * @ignore
     */
    loadPath : function(path){
      var _self = this,
        arr = path.split(','),
        id = arr[0];
      if(_self.findNodeByPath(path)){ //加载过
        return;
      }
      _self.load({id : id,path : path});
    }
  });

  return TreeStore;

});/**
 * @fileOverview 数据缓冲对象
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/data/store',['bui/data/proxy','bui/data/abstractstore','bui/data/sortable'],function(require) {
  
  var Proxy = require('bui/data/proxy'),
    AbstractStore = require('bui/data/abstractstore'),
    Sortable = require('bui/data/sortable');

  //移除数据
  function removeAt(index,array){
    if(index < 0){
      return;
    }
    var records = array,
      record = records[index];
    records.splice(index,1);
    return record;
  }

  function removeFrom(record,array){
    var index = BUI.Array.indexOf(record,array);   
    if(index >= 0){
      removeAt(index,array);
    }
  }

  function contains(record,array){
    return BUI.Array.indexOf(record,array) !== -1;
  }
  /**
   * 用于加载数据，缓冲数据的类
   * <p>
   * <img src="../assets/img/class-data.jpg"/>
   * </p>
   * @class BUI.Data.Store
   * @extends BUI.Data.AbstractStore
   * @mixins BUI.Data.Sortable
   */
  var store = function(config){
    store.superclass.constructor.call(this,config);
    //this._init();
  };

  store.ATTRS = 
  /**
   * @lends BUI.Data.Store#
   * @ignore
   */
  {
    /**
     * 当前页码
     * @cfg {Number} [currentPage=0]
     */
    /**
     * 当前页码
     * @type {Number}
     * @default 0
     */
    currentPage:{
      value : 0
    },
    
    /**
     * 删除掉的纪录
     * @readOnly
     * @type {Array}
     */
    deletedRecords : {
      value:[]
    },
    /**
     * 错误字段,包含在返回信息中表示错误信息的字段
     * @cfg {String} [errorProperty='error']
     */
    /**
     * 错误字段
     * @type {String}
     * @default 'error'
     */
    errorProperty : {
      value : 'error'
    },
    /**
     * 是否存在错误,加载数据时如果返回错误，此字段表示有错误发生
     * @cfg {String} [hasErrorProperty='hasError']
     */
    /**
     * 是否存在错误
     * @type {String}
     * @default 'hasError'
     */
    hasErrorProperty : {
      value : 'hasError'
    },

    /**
     * 对比2个对象是否相当，在去重、更新、删除，查找数据时使用此函数
     * @default  
     * function(obj1,obj2){
     *   return obj1 == obj2;
     * }
     * @type {Object}
     * @example
     * function(obj1 ,obj2){
     *   //如果id相等，就认为2个数据相等，可以在添加对象时去重
     *   //更新对象时，仅提供改变的字段
     *   return obj1.id == obj2.id;
     * }
     * 
     */
    matchFunction : {
      value : function(obj1,obj2){
        return obj1 == obj2;
      }
    },
    /**
     * 更改的纪录集合
     * @type {Array}
     * @readOnly
     */
    modifiedRecords : {
      value:[]
    },
    /**
     * 新添加的纪录集合，只读
     * @type {Array}
     * @readOnly
     */
    newRecords : {
      value : []
    },
    /**
     * 是否远程排序，由于当前Store存储的不一定是数据源的全集，所以此配置项需要重新读取数据
     * 在分页状态下，进行远程排序，会进行全集数据的排序，并返回首页的数据
     * remoteSort为 false的情况下，仅对当前页的数据进行排序
     * @cfg {Boolean} [remoteSort=false]
     */
    /**
     * 是否远程排序，由于当前Store存储的不一定是数据源的全集，所以此配置项需要重新读取数据
     * 在分页状态下，进行远程排序，会进行全集数据的排序，并返回首页的数据
     * remoteSort为 false的情况下，仅对当前页的数据进行排序
     * @type {Boolean}
     * @default false
     */
    remoteSort : {
      value : false
    },
    /**
     * 缓存的数据，包含以下几个字段
     * <ol>
     * <li>rows: 数据集合</li>
     * <li>results: 总的数据条数</li>
     * </ol>
     * @type {Object}
     * @protected
     * @readOnly
     */
    resultMap : {
      value : {}
    },
    /**
    * 加载数据时，返回数据的根目录
    * @cfg {String} [root='rows']
    *   '{"rows":[{"name":"abc"},{"name":"bcd"}],"results":100}'
    */
    /**
    * 加载数据时，返回数据的根目录
    * @field
    * @type {String}
    * @default  "rows"
    *   '{"rows":[{"name":"abc"},{"name":"bcd"}],"results":100}'
    */
    root: { value : 'rows'}, 

    /**
     * 当前Store缓存的数据条数
     * @type {Number}
     * @readOnly
     */
    rowCount :{
      value : 0
    },
    /**
    * 加载数据时，返回记录的总数的字段，用于分页
    * @cfg {String} [totalProperty='results']
    *
    *   '{"rows":[{"name":"abc"},{"name":"bcd"}],"results":100}'
    */
    /**
    * 加载数据时，返回记录的总数的字段，用于分页
    * @field
    * @type {String}
    * @default  "results"
    *
    *   '{"rows":[{"name":"abc"},{"name":"bcd"}],"results":100}'
    */
    totalProperty: {value :'results'}, 

    /**
     * 加载数据的起始位置
     * @type {Object}
     */
    start:{
      value : 0
    },
    /**
     * 每页多少条记录,默认为null,此时不分页，当指定了此值时分页
     * @cfg {Number} pageSize
     */
    /**
     * 每页多少条记录,默认为null,此时不分页，当指定了此值时分页
     * @type {Number}
     */
    pageSize : {

    }
  };
  BUI.extend(store,AbstractStore);

  BUI.mixin(store,[Sortable]);

  BUI.augment(store,
  /**
   * @lends BUI.Data.Store.prototype
   * @ignore
   */
  {
    /**
    * 添加记录,默认添加在后面
    * @param {Array|Object} data 添加的数据，可以是数组，可以是单条记录
    * @param {Boolean} [noRepeat = false] 是否去重,可以为空，默认： false 
    * @param {Function} [match] 匹配函数，可以为空，
    * @default 配置项中 matchFunction 属性传入的函数，默认是：<br>
    *  function(obj1,obj2){
    *    return obj1 == obj2;
    *  }
    * 
    */
    add :function(data,noRepeat,match){
      var _self = this,
        count = _self.getCount();
      _self.addAt(data,count,noRepeat,match)
    },
    /**
    * 添加记录,指定索引值
    * @param {Array|Object} data 添加的数据，可以是数组，可以是单条记录
    * @param {Number} index 开始添加数据的位置
    * @param {Boolean} [noRepeat = false] 是否去重,可以为空，默认： false 
    * @param {Function} [match] 匹配函数，可以为空，
     */
    addAt : function(data,index,noRepeat,match){
      var _self = this;

      match = match || _self._getDefaultMatch();
      if(!BUI.isArray(data)){
        data = [data];
      }

      $.each(data,function(pos,element){
        if(!noRepeat || !_self.contains(element,match)){
          _self._addRecord(element,pos + index);

          _self.get('newRecords').push(element);

          removeFrom(element,_self.get('deletedRecords'));
          removeFrom(element,_self.get('modifiedRecords'));
        }
      });
    },
    /**
    * 验证是否存在指定记录
    * @param {Object} record 指定的记录
    * @param {Function} [match = function(obj1,obj2){return obj1 == obj2}] 默认为比较2个对象是否相同
    * @return {Boolean}
    */
    contains :function(record,match){
      return this.findIndexBy(record,match)!==-1;
    },
    /**
    * 查找记录，仅返回第一条
    * @param {String} field 字段名
    * @param {String} value 字段值
    * @return {Object|null}
    */
    find : function(field,value){
      var _self = this,
        result = null,
        records = _self.getResult();
      $.each(records,function(index,record){
        if(record[field] === value){
          result = record;
          return false;
        }
      });
      return result;
    },
    /**
    * 查找记录，返回所有符合查询条件的记录
    * @param {String} field 字段名
    * @param {String} value 字段值
    * @return {Array}
    */
    findAll : function(field,value){
      var _self = this,
        result = [],
        records = _self.getResult();
      $.each(records,function(index,record){
        if(record[field] === value){
          result.push(record);
        }
      });
      return result;
    },
    /**
    * 根据索引查找记录
    * @param {Number} index 索引
    * @return {Object} 查找的记录
    */
    findByIndex : function(index){
      return this.getResult()[index];
    },
    /**
    * 查找数据所在的索引位置,若不存在返回-1
    * @param {Object} target 指定的记录
    * @param {Function} [match = matchFunction] @see {BUI.Data.Store#matchFunction}默认为比较2个对象是否相同
    * @return {Number}
    */
    findIndexBy :function(target,match){
      var _self = this,
        position = -1,
        records = _self.getResult();
      match = match || _self._getDefaultMatch();
      if(target === null || target === undefined){
        return -1;
      }
      $.each(records,function(index,record){
        if(match(target,record)){
          position = index;
          return false;
        }
      });
      return position;
    },
    /**
    * 获取下一条记录
    * @param {Object} record 当前记录
    * @return {Object} 下一条记录
    */
    findNextRecord : function(record){
      var _self = this,
        index = _self.findIndexBy(record);
      if(index >= 0){
        return _self.findByIndex(index + 1);
      }
      return;
    },
    /**
     * 获取缓存的记录数
     * @return {Number} 记录数
     */
    getCount : function(){
      return this.getResult().length;
    },
    /**
     * 获取数据源的数据总数，分页时，当前仅缓存当前页数据
     * @return {Number} 记录的总数
     */
    getTotalCount : function(){
      var _self = this,
        resultMap = _self.get('resultMap'),
        total = _self.get('totalProperty');
      return resultMap[total] || 0;
    },
    /**
     * 获取当前缓存的纪录
     * @return {Array} 纪录集合
     */
    getResult : function(){
      var _self = this,
        resultMap = _self.get('resultMap'),
        root = _self.get('root');
      return resultMap[root];
    },
    /**
     * 是否包含数据
     * @return {Boolean} 
     */
    hasData : function(){
      return this.getCount() !== 0;
    },
    /**
     * 设置数据源
     */
    setResult : function(data){
      var _self = this,
        proxy = _self.get('proxy');
      if(proxy instanceof Proxy.Memery){
        _self.set('data',data);
        _self.load({start:0});
      }else{
        _self._setResult(data);
      }
    },

    /**
    * 删除记录触发 remove 事件.
    * @param {Array|Object} data 添加的数据，可以是数组，可以是单条记录
    * @param {Function} [match = function(obj1,obj2){return obj1 == obj2}] 匹配函数，可以为空
    */
    remove :function(data,match){
      var _self =this,
        delData=[];
      match = match || _self._getDefaultMatch();
      if(!BUI.isArray(data)){
        data = [data];
      }
      $.each(data,function(index,element){
        var index = _self.findIndexBy(element,match),
            record = removeAt(index,_self.getResult());
        //添加到已删除队列中,如果是新添加的数据，不计入删除的数据集合中
        if(!contains(record,_self.get('newRecords')) && !contains(record,_self.get('deletedRecords'))){
          _self.get('deletedRecords').push(record);
        }
        removeFrom(record,_self.get('newRecords'));
        removeFrom(record,_self.get('modifiedRecords'));
        _self.fire('remove',{record:record});
      }); 
    },
    /**
     * 排序
     * @param  {String} field     排序字段
     * @param  {String} direction 排序方向
     */
    sort : function(field,direction){
      var _self = this,
        remoteSort = _self.get('remoteSort');

      if(!remoteSort){
        _self._localSort(field,direction);
      }else{
        _self.set('sortField',field);
        _self.set('sortDirection',direction);
        _self.load(_self.get('sortInfo'));
      }
    },
    /**
     * 计算指定字段的和
     * @param  {String} field 字段名
     * @param  {Array} [data] 计算的集合，默认为Store中的数据集合
     * @return {Number} 汇总和
     */
    sum : function(field,data){
      var  _self = this,
        records = data || _self.getResult(),
        sum = 0;
      BUI.each(records,function(record){
        var val = record[field];
        if(!isNaN(val)){
          sum += parseFloat(val);
        }
      });
      return sum;
    },
    /**
    * 设置记录的值 ，触发 update 事件
    * @param {Object} obj 修改的记录
    * @param {String} field 修改的字段名
    * @param {Object} value 修改的值
    */
    setValue : function(obj,field,value){
      var record = obj,
        _self = this;

      record[field]=value;
      if(!contains(record,_self.get('newRecords')) && !contains(record,_self.get('modifiedRecords'))){
          _self.get('modifiedRecords').push(record);
      }
      _self.fire('update',{record:record,field:field,value:value});
    },
    /**
    * 更新记录 ，触发 update事件
    * @param {Object} obj 修改的记录
    * @param {Boolean} [isMatch = false] 是否需要进行匹配，检测指定的记录是否在集合中
    */
    update : function(obj,isMatch){
      var record = obj,
        _self = this,
        match = null,
        index = null;
      if(isMatch){
        match = _self._getDefaultMatch();
        index = _self.findIndexBy(obj,match);
        if(index >=0){
          record = _self.getResult()[index];
        }
      }
      record = BUI.mix(record,obj);
      if(!contains(record,_self.get('newRecords')) && !contains(record,_self.get('modifiedRecords'))){
          _self.get('modifiedRecords').push(record);
      }
      _self.fire('update',{record:record});
    },
    //添加纪录
    _addRecord :function(record,index){
      var records = this.getResult();
      if(index == undefined){
        index = records.length;
      }
      records.splice(index,0,record);
      this.fire('add',{record:record,index:index});
    },
    //清除改变的数据记录
    _clearChanges : function(){
      var _self = this;
      _self.get('newRecords').splice(0);
      _self.get('modifiedRecords').splice(0);
      _self.get('deletedRecords').splice(0);
    },
    //获取默认的匹配函数
    _getDefaultMatch :function(){

      return this.get('matchFunction');
    },

    //获取分页相关的信息
    _getPageParams : function(){
      var _self = this,
        sortInfo = _self.get('sortInfo'),
        params = {
          start : _self.get('start'),
          limit : _self.get('pageSize'),
          pageIndex : _self.get('pageIndex') //一般而言，pageIndex = start/limit
        };

      if(_self.get('remoteSort')){
        BUI.mix(params,sortInfo);
      }

      return params;
    },
     /**
     * 获取附加的参数,分页信息，排序信息
     * @override
     * @protected
     * @return {Object} 附加的参数
     */
    getAppendParams : function(){
      return this._getPageParams();
    },
    /**
     * @protected
     * 初始化之前
     */
    beforeInit : function(){
      //初始化结果集
      this._setResult([]);
    },
    //本地排序
    _localSort : function(field,direction){
      var _self = this;

      _self._sortData(field,direction);

      _self.fire('localsort');
    },
    _sortData : function(field,direction,data){
      var _self = this;
      data = data || _self.getResult();

      _self.sortData(field,direction,data);
    },
    //处理数据
    afterProcessLoad : function(data,params){
      var _self = this,
        root = _self.get('root'),
        start = params.start,
        limit = params.limit,
        totalProperty = _self.get('totalProperty');

      if(BUI.isArray(data)){
        _self._setResult(data);
      }else{
        _self._setResult(data[root],data[totalProperty]);
      }

      _self.set('start',start);

      if(limit){
        _self.set('pageIndex',start/limit);
      }

      //如果本地排序,则排序
      if(!_self.get('remoteSort')){
        _self._sortData();
      }

      _self.fire('load',{ params : params });
    },
    //设置结果集
    _setResult : function(rows,totalCount){
      var _self = this,
        resultMap = _self.get('resultMap');

      totalCount = totalCount || rows.length;
      resultMap[_self.get('root')] = rows;
      resultMap[_self.get('totalProperty')] = totalCount;

      //清理之前发生的改变
      _self._clearChanges();
    }
  });

  return store;
});