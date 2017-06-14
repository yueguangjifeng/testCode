(function (factory) {
    if (typeof window.define === 'function') {
        if (window.define.amd) {
            // AMDģʽ
            window.define('wangEditor', ["jquery"], factory);
        } else if (window.define.cmd) {
            // CMDģʽ
            window.define(function (require, exports, module) {
                return factory;
            });
        } else {
            // ȫ��ģʽ
            factory(window.jQuery);
        }
    } else if (typeof module === "object" && typeof module.exports === "object") {
        // commonjs

        // ���� css ���� webapck
        window.wangEditorCssPath ? require(window.wangEditorCssPath) : require('../css/wangEditor.css');
        module.exports = factory(
            // ���� jquery ��֧��ʹ�� npm ��ʽ�����Լ�����jquery��·��
            window.wangEditorJQueryPath ? require(window.wangEditorJQueryPath) : require('jquery')
        );
    } else {
        // ȫ��ģʽ
        factory(window.jQuery);
    }
})(function($){

    // ��֤�Ƿ�����jquery
    if (!$ || !$.fn || !$.fn.jquery) {
        alert('������wangEditor.js֮ǰ��������jQuery�������޷�ʹ�� wangEditor');
        return;
    }

    // ������չ����
    var _e = function (fn) {
        var E = window.wangEditor;
        if (E) {
            // ִ�д���ĺ���
            fn(E, $);
        }
    };
// ���幹�캯��
    (function (window, $) {
        if (window.wangEditor) {
            // �ظ�����
            alert('һ��ҳ�治���ظ����� wangEditor.js �� wangEditor.min.js ������');
            return;
        }

        // �༭�������壩���캯��
        var E = function (elem) {
            // ֧�� id �� element ������ʽ
            if (typeof elem === 'string') {
                elem = '#' + elem;
            }

            // ---------------��ȡ�����ڵ�------------------
            var $elem = $(elem);
            if ($elem.length !== 1) {
                return;
            }
            var nodeName = $elem[0].nodeName;
            if (nodeName !== 'TEXTAREA' && nodeName !== 'DIV') {
                // ֻ���� textarea �� div ���������͵�Ԫ�ز���
                return;
            }
            this.valueNodeName = nodeName.toLowerCase();
            this.$valueContainer = $elem;

            // ��¼ elem �� prev �� parent�������Ⱦ editor Ҫ�õ���
            this.$prev = $elem.prev();
            this.$parent = $elem.parent();

            // ------------------��ʼ��------------------
            this.init();
        };

        E.fn = E.prototype;

        E.$body = $('body');
        E.$document = $(document);
        E.$window = $(window);
        E.userAgent = navigator.userAgent;
        E.getComputedStyle = window.getComputedStyle;
        E.w3cRange = typeof document.createRange === 'function';
        E.hostname = location.hostname.toLowerCase();
        E.websiteHost = 'wangeditor.github.io|www.wangeditor.com|wangeditor.coding.me';
        E.isOnWebsite = E.websiteHost.indexOf(E.hostname) >= 0;
        E.docsite = 'http://www.kancloud.cn/wangfupeng/wangeditor2/113961';

        // ��¶��ȫ�ֶ���
        window.wangEditor = E;

        // ע�� plugin �¼��������û��Զ�����
        // �û������� wangEditor.js ֮�󣬻�����ͨ�� E.plugin() ע���Զ��庯����
        // �ú��������� editor.create() ���������һ��ִ��
        E.plugin = function (fn) {
            if (!E._plugins) {
                E._plugins = [];
            }

            if (typeof fn === 'function') {
                E._plugins.push(fn);
            }
        };

    })(window, $);
// editor ���¼�
    _e(function (E, $) {

        E.fn.init = function () {

            // ��ʼ�� editor Ĭ������
            this.initDefaultConfig();

            // ����container
            this.addEditorContainer();

            // ���ӱ༭����
            this.addTxt();

            // ����menuContainer
            this.addMenuContainer();

            // ��ʼ���˵�����
            this.menus = {};

            // ��ʼ��commandHooks
            this.commandHooks();

        };

    });
// editor api
    _e(function (E, $) {

        // Ԥ���� ready �¼�
        E.fn.ready = function (fn) {

            if (!this.readyFns) {
                this.readyFns = [];
            }

            this.readyFns.push(fn);
        };

        // ����ready�¼�
        E.fn.readyHeadler = function () {
            var fns = this.readyFns;

            while (fns.length) {
                fns.shift().call(this);
            }
        };

        // �������ݵ� $valueContainer
        E.fn.updateValue = function () {
            var editor = this;
            var $valueContainer = editor.$valueContainer;
            var $txt = editor.txt.$txt;

            if ($valueContainer === $txt) {
                // �������ɱ༭����div�����Ǳ༭����
                return;
            }

            var value = $txt.html();
            $valueContainer.val(value);
        };

        // ��ȡ��ʼ��������
        E.fn.getInitValue = function () {
            var editor = this;
            var $valueContainer = editor.$valueContainer;
            var currentValue = '';
            var nodeName = editor.valueNodeName;
            if (nodeName === 'div') {
                currentValue = $valueContainer.html();
            } else if (nodeName === 'textarea') {
                currentValue = $valueContainer.val();
            }

            return currentValue;
        };

        // �����˵�updatestyle
        E.fn.updateMenuStyle = function () {
            var menus = this.menus;

            $.each(menus, function (k, menu) {
                menu.updateSelected();
            });
        };

        // ���˴���� menuIds������ȫ������
        E.fn.enableMenusExcept = function (menuIds) {
            if (this._disabled) {
                // �༭�����ڽ���״̬����ִ�иĲ���
                return;
            }
            // menuIds������֧��������ַ���
            menuIds = menuIds || [];
            if (typeof menuIds === 'string') {
                menuIds = [menuIds];
            }

            $.each(this.menus, function (k, menu) {
                if (menuIds.indexOf(k) >= 0) {
                    return;
                }
                menu.disabled(false);
            });
        };

        // ���˴���� menuIds������ȫ������
        E.fn.disableMenusExcept = function (menuIds) {
            if (this._disabled) {
                // �༭�����ڽ���״̬����ִ�иĲ���
                return;
            }
            // menuIds������֧��������ַ���
            menuIds = menuIds || [];
            if (typeof menuIds === 'string') {
                menuIds = [menuIds];
            }

            $.each(this.menus, function (k, menu) {
                if (menuIds.indexOf(k) >= 0) {
                    return;
                }
                menu.disabled(true);
            });
        };

        // �������� dropPanel droplist modal
        E.fn.hideDropPanelAndModal = function () {
            var menus = this.menus;

            $.each(menus, function (k, menu) {
                var m = menu.dropPanel || menu.dropList || menu.modal;
                if (m && m.hide) {
                    m.hide();
                }
            });
        };

    });
// selection range API
    _e(function (E, $) {

        // �õ� w3c range �ĺ����������⵽�������֧�� w3c range����ֵΪ�պ���
        var ieRange = !E.w3cRange;
        function emptyFn() {}

        // ���û��ȡ��ǰ��range
        E.fn.currentRange = function (cr){
            if (cr) {
                this._rangeData = cr;
            } else {
                return this._rangeData;
            }
        };

        // ����ǰѡ���۵�
        E.fn.collapseRange = function (range, opt) {
            // opt ����˵����'start'-�۵�����ʼ; 'end'-�۵�������
            opt = opt || 'end';
            opt = opt === 'start' ? true : false;

            range = range || this.currentRange();

            if (range) {
                // �ϲ�������
                range.collapse(opt);
                this.currentRange(range);
            }
        };

        // ��ȡѡ��������
        E.fn.getRangeText = ieRange ? emptyFn : function (range) {
            range = range || this.currentRange();
            if (!range) {
                return;
            }
            return range.toString();
        };

        // ��ȡѡ����Ӧ��DOM����
        E.fn.getRangeElem = ieRange ? emptyFn : function (range) {
            range = range || this.currentRange();
            var dom = range.commonAncestorContainer;

            if (dom.nodeType === 1) {
                return dom;
            } else {
                return dom.parentNode;
            }
        };

        // ѡ�������Ƿ�Ϊ�գ�
        E.fn.isRangeEmpty = ieRange ? emptyFn : function (range) {
            range = range || this.currentRange();

            if (range && range.startContainer) {
                if (range.startContainer === range.endContainer) {
                    if (range.startOffset === range.endOffset) {
                        return true;
                    }
                }
            }

            return false;
        };

        // ����ѡ������
        E.fn.saveSelection = ieRange ? emptyFn : function (range) {
            var self = this,
                _parentElem,
                selection,
                txt = self.txt.$txt.get(0);

            if (range) {
                _parentElem = range.commonAncestorContainer;
            } else {
                selection = document.getSelection();
                if (selection.getRangeAt && selection.rangeCount) {
                    range = document.getSelection().getRangeAt(0);
                    _parentElem = range.commonAncestorContainer;
                }
            }
            // ȷ����Ԫ��һ��Ҫ�����ڱ༭��������
            if (_parentElem && ($.contains(txt, _parentElem) || txt === _parentElem) ) {
                // ����ѡ������
                self.currentRange(range);
            }
        };

        // �ָ�ѡ������
        E.fn.restoreSelection = ieRange ? emptyFn : function (range) {
            var selection;

            range = range || this.currentRange();

            if (!range) {
                return;
            }

            // ʹ�� try catch ����ֹ IE ĳЩ�������
            try {
                selection = document.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            } catch (ex) {
                E.error('ִ�� editor.restoreSelection ʱ��IE���ܻ����쳣����Ӱ��ʹ��');
            }
        };

        // ����elem�ָ�ѡ��
        E.fn.restoreSelectionByElem = ieRange ? emptyFn : function (elem, opt) {
            // opt����˵����'start'-�۵�����ʼ��'end'-�۵���������'all'-ȫ��ѡ��
            if (!elem) {
                return;
            }
            opt = opt || 'end'; // Ĭ��Ϊ�۵�������

            // ����elem��ȡѡ��
            this.setRangeByElem(elem);

            // ���� opt �۵�ѡ��
            if (opt === 'start') {
                this.collapseRange(this.currentRange(), 'start');
            }
            if (opt === 'end') {
                this.collapseRange(this.currentRange(), 'end');
            }

            // �ָ�ѡ��
            this.restoreSelection();
        };

        // ��ʼ��ѡ��
        E.fn.initSelection = ieRange ? emptyFn : function () {
            var editor = this;
            if( editor.currentRange() ){
                //���currentRange��ֵ�������ٳ�ʼ��
                return;
            }

            var range;
            var $txt = editor.txt.$txt;
            var $firstChild = $txt.children().first();

            if ($firstChild.length) {
                editor.restoreSelectionByElem($firstChild.get(0));
            }
        };

        // ����Ԫ�ش���ѡ��
        E.fn.setRangeByElem = ieRange ? emptyFn : function (elem) {
            var editor = this;
            var txtElem = editor.txt.$txt.get(0);
            if (!elem || !$.contains(txtElem, elem)) {
                return;
            }

            // �ҵ�elem�ĵ�һ�� textNode �� ���һ�� textNode
            var firstTextNode = elem.firstChild;
            while (firstTextNode) {
                if (firstTextNode.nodeType === 3) {
                    break;
                }
                // ��������
                firstTextNode = firstTextNode.firstChild;
            }
            var lastTextNode = elem.lastChild;
            while (lastTextNode) {
                if (lastTextNode.nodeType === 3) {
                    break;
                }
                // ��������
                lastTextNode = lastTextNode.lastChild;
            }

            var range = document.createRange();
            if (firstTextNode && lastTextNode) {
                // ˵�� elem �����ݣ���ȡ����Ԫ��
                range.setStart(firstTextNode, 0);
                range.setEnd(lastTextNode, lastTextNode.textContent.length);
            } else {
                // ˵�� elem ������
                range.setStart(elem, 0);
                range.setEnd(elem, 0);
            }

            // ����ѡ��
            editor.saveSelection(range);
        };

    });
// selection range API - IE8������
    _e(function (E, $) {

        if (E.w3cRange) {
            // ˵��֧�� W3C ��range����
            return;
        }

        // -----------------IE8ʱ����Ҫ��д���·���-------------------

        // ��ȡѡ��������
        E.fn.getRangeText = function (range) {
            range = range || this.currentRange();
            if (!range) {
                return;
            }
            return range.text;
        };

        // ��ȡѡ����Ӧ��DOM����
        E.fn.getRangeElem = function (range) {
            range = range || this.currentRange();
            if (!range) {
                return;
            }
            var dom = range.parentElement();

            if (dom.nodeType === 1) {
                return dom;
            } else {
                return dom.parentNode;
            }
        };

        // ѡ�������Ƿ�Ϊ�գ�
        E.fn.isRangeEmpty = function (range) {
            range = range || this.currentRange();

            if (range && range.text) {
                return false;
            }

            return true;
        };

        // ����ѡ������
        E.fn.saveSelection = function (range) {
            var self = this,
                _parentElem,
                selection,
                txt = self.txt.$txt.get(0);

            if (range) {
                _parentElem = range.parentElement();
            } else {
                range = document.selection.createRange();
                if(typeof range.parentElement === 'undefined'){
                    //IE6��7�У�insertImage���ִ�д˴�
                    //�����Ҳ���range.parentElement�����Ըɴཫ_parentElem��ֵΪnull
                    _parentElem = null;
                }else{
                    _parentElem = range.parentElement();
                }
            }

            // ȷ����Ԫ��һ��Ҫ�����ڱ༭��������
            if (_parentElem && ($.contains(txt, _parentElem) || txt === _parentElem) ) {
                // ����ѡ������
                self.currentRange(range);
            }
        };

        // �ָ�ѡ������
        E.fn.restoreSelection = function (currentRange){
            var editor = this,
                selection,
                range;

            currentRange = currentRange || editor.currentRange();
            if(!currentRange){
                return;
            }

            range = document.selection.createRange();
            try {
                // �˴���plupload�ϴ��ϴ�ͼƬʱ��IE8-�ᱨһ����������Ч���Ĵ���
                range.setEndPoint('EndToEnd', currentRange);
            } catch (ex) {

            }

            if(currentRange.text.length === 0){
                try {
                    // IE8 �������ᱨ��
                    range.collapse(false);
                } catch (ex) {

                }

            }else{
                range.setEndPoint('StartToStart', currentRange);
            }
            range.select();
        };

    });
// editor command hooks
    _e(function (E, $) {

        E.fn.commandHooks = function () {
            var editor = this;
            var commandHooks = {};

            // insertHtml
            commandHooks.insertHtml = function (html) {
                var $elem = $(html);
                var rangeElem = editor.getRangeElem();
                var targetElem;

                targetElem = editor.getLegalTags(rangeElem);
                if (!targetElem) {
                    return;
                }

                $(targetElem).after($elem);
            };

            // ���浽����
            editor.commandHooks = commandHooks;
        };

    });
// editor command API
    _e(function (E, $) {

        // ��������
        E.fn.command = function (e, commandName, commandValue, callback) {
            var editor = this;
            var hooks;

            function commandFn() {
                if (!commandName) {
                    return;
                }
                if (editor.queryCommandSupported(commandName)) {
                    // Ĭ������
                    document.execCommand(commandName, false, commandValue);
                } else {
                    // hooks ����
                    hooks = editor.commandHooks;
                    if (commandName in hooks) {
                        hooks[commandName](commandValue);
                    }
                }
            }

            this.customCommand(e, commandFn, callback);
        };

        // ���һ��elem����ִ�л�������
        E.fn.commandForElem = function (elemOpt, e, commandName, commandValue, callback) {
            // ȡ�ò�ѯelem�Ĳ�ѯ��������֤����
            var selector;
            var check;
            if (typeof elemOpt === 'string') {
                selector = elemOpt;
            } else {
                selector = elemOpt.selector;
                check = elemOpt.check;
            }

            // ��ѯelem
            var rangeElem = this.getRangeElem();
            rangeElem = this.getSelfOrParentByName(rangeElem, selector, check);

            // ����elem����range
            if (rangeElem) {
                this.setRangeByElem(rangeElem);
            }

            // Ȼ��ִ�л�������
            this.command(e, commandName, commandValue, callback);
        };

        // �Զ�������
        E.fn.customCommand = function (e, commandFn, callback) {
            var editor = this;
            var range = editor.currentRange();

            if (!range) {
                // Ŀǰû��ѡ�������޷�ִ������
                e && e.preventDefault();
                return;
            }
            // ��¼���ݣ��Ա㳷����ִ������֮ǰ��Ҫ��¼��
            editor.undoRecord();

            // �ָ�ѡ������ range ������
            this.restoreSelection(range);

            // ִ�������¼�
            commandFn.call(editor);

            // ����ѡ�����޲�����Ҫ�������ֱ�ӻ�ȡrange��Ϣ��
            this.saveSelection();
            // ���»ָ�ѡ�����޲�����Ҫȡ�øոմ�������õ���range��Ϣ��
            this.restoreSelection();

            // ִ�� callback
            if (callback && typeof callback === 'function') {
                callback.call(editor);
            }

            // ���������
            editor.txt.insertEmptyP();

            // ������¶��img��text
            editor.txt.wrapImgAndText();

            // ��������
            editor.updateValue();

            // ���²˵���ʽ
            editor.updateMenuStyle();

            // ���� dropPanel dropList modal  ���� 200ms ���
            function hidePanelAndModal() {
                editor.hideDropPanelAndModal();
            }
            setTimeout(hidePanelAndModal, 200);

            if (e) {
                e.preventDefault();
            }
        };

        // ��װ document.queryCommandValue ����
        // IE8 ֱ��ִ��ż���ᱨ�����ֱ���� try catch ��װһ��
        E.fn.queryCommandValue = function (commandName) {
            var result = '';
            try {
                result = document.queryCommandValue(commandName);
            } catch (ex) {

            }
            return result;
        };

        // ��װ document.queryCommandState ����
        // IE8 ֱ��ִ��ż���ᱨ�����ֱ���� try catch ��װһ��
        E.fn.queryCommandState = function (commandName) {
            var result = false;
            try {
                result = document.queryCommandState(commandName);
            } catch (ex) {

            }
            return result;
        };

        // ��װ document.queryCommandSupported ����
        E.fn.queryCommandSupported = function (commandName) {
            var result = false;
            try {
                result = document.queryCommandSupported(commandName);
            } catch (ex) {

            }
            return result;
        };

    });
// dom selector
    _e(function (E, $) {

        var matchesSelector;

        // matchesSelector hook
        function _matchesSelectorForIE(selector) {
            var elem = this;
            var $elems = $(selector);
            var result = false;

            // ��jquery���� selector ���ж������������һ���ʹ��� elem ��ͬ����֤�� elem ���� selector
            $elems.each(function () {
                if (this === elem) {
                    result = true;
                    return false;
                }
            });

            return result;
        }

        // �ӵ�ǰ��elem������ȥ���ҺϷ���ǩ �� p head table blockquote ul ol ��
        E.fn.getLegalTags = function (elem) {
            var legalTags = this.config.legalTags;
            if (!legalTags) {
                E.error('��������ȱ�� legalTags ������');
                return;
            }
            return this.getSelfOrParentByName(elem, legalTags);
        };

        // ������������ѯ������߸�Ԫ�أ����ϼ�����
        E.fn.getSelfOrParentByName = function (elem, selector, check) {

            if (!elem || !selector) {
                return;
            }

            if (!matchesSelector) {
                // ���� matchesSelector ����
                matchesSelector = elem.webkitMatchesSelector ||
                    elem.mozMatchesSelector ||
                    elem.oMatchesSelector ||
                    elem.matchesSelector;
            }
            if (!matchesSelector) {
                // ������������֧�� matchesSelector ��ʹ���Զ����hook
                matchesSelector = _matchesSelectorForIE;
            }

            var txt = this.txt.$txt.get(0);

            while (elem && txt !== elem && $.contains(txt, elem)) {
                if (matchesSelector.call(elem, selector)) {
                    // ���� selector ��ѯ����

                    if (!check) {
                        // û�� check ��֤������ֱ�ӷ��ؼ���
                        return elem;
                    }

                    if (check(elem)) {
                        // ����� check ��֤���������� check ������ȷ��
                        return elem;
                    }
                }

                // �����һ��û������֤������ת����Ԫ��
                elem = elem.parentNode;
            }

            return;
        };

    });
// undo redo
    _e(function (E, $) {

        var length = 20;  // �������󳤶�
        function _getRedoList(editor) {
            if (editor._redoList == null) {
                editor._redoList = [];
            }
            return editor._redoList;
        }
        function _getUndoList(editor) {
            if (editor._undoList == null) {
                editor._undoList = [];
            }
            return editor._undoList;
        }

        // ���ݴ���
        function _handle(editor, data, type) {
            // var range = data.range;
            // var range2 = range.cloneRange && range.cloneRange();
            var val = data.val;
            var html = editor.txt.$txt.html();

            if(val == null) {
                return;
            }

            if (val === html) {
                if (type === 'redo') {
                    editor.redo();
                    return;
                } else if (type === 'undo') {
                    editor.undo();
                    return;
                } else {
                    return;
                }
            }

            // ��������
            editor.txt.$txt.html(val);
            // �������ݵ�textarea���б�Ҫ�Ļ���
            editor.updateValue();

            // onchange �¼�
            if (editor.onchange && typeof editor.onchange === 'function') {
                editor.onchange.call(editor);
            }

            // ?????
            // ע�ͣ�$txt �����¸�ֵ֮��range�ᱻ���ã�cloneRange() Ҳ����ʹ
            // // ����ѡ��
            // if (range2) {
            //     editor.restoreSelection(range2);
            // }
        }

        // ��¼
        E.fn.undoRecord = function () {
            var editor = this;
            var $txt = editor.txt.$txt;
            var val = $txt.html();
            var undoList = _getUndoList(editor);
            var redoList = _getRedoList(editor);
            var currentVal = undoList.length ? undoList[0] : '';

            if (val === currentVal.val) {
                return;
            }

            // ��� redolist
            if (redoList.length) {
                redoList = [];
            }

            // ������ݵ� undoList
            undoList.unshift({
                range: editor.currentRange(),  // ����ǰ��rangeҲ��¼��
                val: val
            });

            // ���� undoList ����
            if (undoList.length > length) {
                undoList.pop();
            }
        };

        // undo ����
        E.fn.undo = function () {
            var editor = this;
            var undoList = _getUndoList(editor);
            var redoList = _getRedoList(editor);

            if (!undoList.length) {
                return;
            }

            // ȡ�� undolist ��һ��ֵ������ redolist
            var data = undoList.shift();
            redoList.unshift(data);

            // ���޸ı༭��������
            _handle(this, data, 'undo');
        };

        // redo ����
        E.fn.redo = function () {
            var editor = this;
            var undoList = _getUndoList(editor);
            var redoList = _getRedoList(editor);
            if (!redoList.length) {
                return;
            }

            // ȡ�� redolist ��һ��ֵ������ undolist
            var data = redoList.shift();
            undoList.unshift(data);

            // ���޸ı༭��������
            _handle(this, data, 'redo');
        };
    });
// ��¶���û��� API
    _e(function (E, $) {

        // �����༭��
        E.fn.create = function () {
            var editor = this;

            // ��� E.$body �Ƿ���ֵ
            // ����� body ֮ǰ������ js �ļ���body ��δ���أ�����û��ֵ
            if (!E.$body || E.$body.length === 0) {
                E.$body = $('body');
                E.$document = $(document);
                E.$window = $(window);
            }

            // ִ�� addMenus ֮ǰ��
            // 1. �����û��޸� editor.UI �Զ�������UI
            // 2. �����û�ͨ���޸� editor.menus ���Զ������ò˵�
            // ���Ҫ�� create ʱִ�У������� init           
            editor.addMenus();

            // ��Ⱦ
            editor.renderMenus();
            editor.renderMenuContainer();
            editor.renderTxt();
            editor.renderEditorContainer();

            // ���¼�
            editor.eventMenus();
            editor.eventMenuContainer();
            editor.eventTxt();

            // ����ready�¼�
            editor.readyHeadler();

            // ��ʼ��ѡ��
            editor.initSelection();

            // $txt ��ݷ�ʽ
            editor.$txt = editor.txt.$txt;

            // ִ���û��Զ����¼���ͨ�� E.ready() ���
            var _plugins = E._plugins;
            if (_plugins && _plugins.length) {
                $.each(_plugins, function (k, val) {
                    val.call(editor);
                });
            }
        };

        // ���ñ༭��
        E.fn.disable = function () {
            this.txt.$txt.removeAttr('contenteditable');
            this.disableMenusExcept();

            // �Ƚ��ã��ټ�¼״̬
            this._disabled = true;
        };
        // ���ñ༭��
        E.fn.enable = function () {
            // �Ƚ��״̬��¼��������
            this._disabled = false;
            this.txt.$txt.attr('contenteditable', 'true');
            this.enableMenusExcept();
        };

        // ���ٱ༭��
        E.fn.destroy = function () {
            var self = this;
            var $valueContainer = self.$valueContainer;
            var $editorContainer = self.$editorContainer;
            var valueNodeName = self.valueNodeName;

            if (valueNodeName === 'div') {
                // div ���ɵı༭��
                $valueContainer.removeAttr('contenteditable');
                $editorContainer.after($valueContainer);
                $editorContainer.hide();
            } else {
                // textarea ���ɵı༭��
                $valueContainer.show();
                $editorContainer.hide();
            }
        };

        // ���� ���ٱ༭��
        E.fn.undestroy = function () {
            var self = this;
            var $valueContainer = self.$valueContainer;
            var $editorContainer = self.$editorContainer;
            var $menuContainer = self.menuContainer.$menuContainer;
            var valueNodeName = self.valueNodeName;

            if (valueNodeName === 'div') {
                // div ���ɵı༭��
                $valueContainer.attr('contenteditable', 'true');
                $menuContainer.after($valueContainer);
                $editorContainer.show();
            } else {
                // textarea ���ɵı༭��
                $valueContainer.hide();
                $editorContainer.show();
            }
        };

        // ������ݵĿ�ݷ�ʽ
        E.fn.clear = function () {
            var editor = this;
            var $txt = editor.txt.$txt;
            $txt.html('<p><br></p>');
            editor.restoreSelectionByElem($txt.find('p').get(0));
        };

    });
// menuContainer ���캯��
    _e(function (E, $) {

        // ���幹�캯��
        var MenuContainer = function (editor) {
            this.editor = editor;
            this.init();
        };

        MenuContainer.fn = MenuContainer.prototype;

        // ��¶�� E �� window.wangEditor
        E.MenuContainer = MenuContainer;

    });
// MenuContainer.fn bind fn
    _e(function (E, $) {

        var MenuContainer = E.MenuContainer;

        // ��ʼ��
        MenuContainer.fn.init = function () {
            var self = this;
            var $menuContainer = $('<div class="wangEditor-menu-container clearfix"></div>');

            self.$menuContainer = $menuContainer;

            // change shadow
            self.changeShadow();
        };

        // �༭�������ʱ������shadow
        MenuContainer.fn.changeShadow = function () {
            var $menuContainer = this.$menuContainer;
            var editor = this.editor;
            var $txt = editor.txt.$txt;

            $txt.on('scroll', function () {
                if ($txt.scrollTop() > 10) {
                    $menuContainer.addClass('wangEditor-menu-shadow');
                } else {
                    $menuContainer.removeClass('wangEditor-menu-shadow');
                }
            });
        };

    });
// MenuContainer.fn API
    _e(function (E, $) {

        var MenuContainer = E.MenuContainer;

        MenuContainer.fn.render = function () {
            var $menuContainer = this.$menuContainer;
            var $editorContainer = this.editor.$editorContainer;

            $editorContainer.append($menuContainer);
        };

        // ��ȡ�˵����ĸ߶�
        MenuContainer.fn.height = function () {
            var $menuContainer = this.$menuContainer;
            return $menuContainer.height();
        };

        // ��Ӳ˵�
        MenuContainer.fn.appendMenu = function (groupIdx, menu) {
            // �ж��Ƿ���Ҫ����һ���˵���
            this._addGroup(groupIdx);
            // ���Ӳ˵������� $menuItem��
            return this._addOneMenu(menu);
        };
        MenuContainer.fn._addGroup = function (groupIdx) {
            var $menuContainer = this.$menuContainer;
            var $menuGroup;
            if (!this.$currentGroup || this.currentGroupIdx !== groupIdx) {
                $menuGroup = $('<div class="menu-group clearfix"></div>');
                $menuContainer.append($menuGroup);

                this.$currentGroup = $menuGroup;
                this.currentGroupIdx = groupIdx;
            }
        };
        MenuContainer.fn._addOneMenu = function (menu) {
            var $menuNormal = menu.$domNormal;
            var $menuSelected = menu.$domSelected;

            var $menuGroup = this.$currentGroup;
            var $item = $('<div class="menu-item clearfix"></div>');
            $menuSelected.hide();
            $item.append($menuNormal).append($menuSelected);
            $menuGroup.append($item);

            return $item;
        };

    });
// menu ���캯��
    _e(function (E, $) {

        // ���幹�캯��
        var Menu = function (opt) {
            this.editor = opt.editor;
            this.id = opt.id;
            this.title = opt.title;
            this.$domNormal = opt.$domNormal;
            this.$domSelected = opt.$domSelected || opt.$domNormal;

            // document.execCommand �Ĳ���
            this.commandName = opt.commandName;
            this.commandValue = opt.commandValue;
            this.commandNameSelected = opt.commandNameSelected || opt.commandName;
            this.commandValueSelected = opt.commandValueSelected || opt.commandValue;
        };

        Menu.fn = Menu.prototype;

        // ��¶�� E �� window.wangEditor
        E.Menu = Menu;
    });
// Menu.fn ��ʼ���󶨵��¼�
    _e(function (E, $) {

        var Menu = E.Menu;

        // ��ʼ��UI
        Menu.fn.initUI = function () {
            var editor = this.editor;
            var uiConfig = editor.UI.menus;
            var menuId = this.id;
            var menuUI = uiConfig[menuId];

            if (this.$domNormal && this.$domSelected) {
                // �Զ���Ĳ˵��У��Ѿ������� $dom ����������ļ��в�������
                return;
            }

            if (menuUI == null) {
                E.warn('editor.UI�����У�û�в˵� "' + menuId + '" ��UI���ã�ֻ��ȡĬ��ֵ');

                // ����д�� uiConfig['default'];
                // д�� uiConfig.default IE8�ᱨ��
                menuUI = uiConfig['default'];
            }

            // ����״̬
            this.$domNormal = $(menuUI.normal);

            // ѡ��״̬
            if (/^\./.test(menuUI.selected)) {
                // ����һ����ʽ
                this.$domSelected = this.$domNormal.clone().addClass(menuUI.selected.slice(1));
            } else {
                // һ���µ�dom����
                this.$domSelected = $(menuUI.selected);
            }
        };

    });
// Menu.fn API
    _e(function (E, $) {

        var Menu = E.Menu;

        // ��Ⱦ�˵�
        Menu.fn.render = function (groupIdx) {
            // ��ȾUI
            this.initUI();

            var editor = this.editor;
            var menuContainer = editor.menuContainer;
            var $menuItem = menuContainer.appendMenu(groupIdx, this);
            var onRender = this.onRender;

            // ��Ⱦtip
            this._renderTip($menuItem);

            // ִ�� onRender ����
            if (onRender && typeof onRender === 'function') {
                onRender.call(this);
            }
        };
        Menu.fn._renderTip = function ($menuItem) {
            var self = this;
            var editor = self.editor;
            var title = self.title;
            var $tip = $('<div class="menu-tip"></div>');
            // var $triangle = $('<i class="tip-triangle"></i>'); // С����

            // ���� tip ���
            var $tempDiv;
            if (!self.tipWidth) {
                // ����һ����͸���� p��absolute;top:-10000px;������ʾ����������
                // ���ݸ�ֵΪ title ��Ϊ�˼���tip���
                $tempDiv = $('<p style="opacity:0; filter:Alpha(opacity=0); position:absolute;top:-10000px;">' + title + '</p>');
                // ����ӵ�body���������� remove
                E.$body.append($tempDiv);
                editor.ready(function () {
                    var editor = this;
                    var titleWidth = $tempDiv.outerWidth() + 5; // ��� 5px ������
                    var currentWidth = $tip.outerWidth();
                    var currentMarginLeft = parseFloat($tip.css('margin-left'), 10);
                    // �����꣬�õ����ݣ�������
                    $tempDiv.remove();
                    $tempDiv = null;

                    // ����������ʽ
                    $tip.css({
                        width: titleWidth,
                        'margin-left': currentMarginLeft + (currentWidth - titleWidth)/2
                    });

                    // �洢
                    self.tipWidth = titleWidth;
                });
            }

            // $tip.append($triangle);
            $tip.append(title);
            $menuItem.append($tip);

            function show() {
                $tip.show();
            }
            function hide() {
                $tip.hide();
            }

            var timeoutId;
            $menuItem.find('a').on('mouseenter', function (e) {
                if (!self.active() && !self.disabled()) {
                    timeoutId = setTimeout(show, 200);
                }
            }).on('mouseleave', function (e) {
                timeoutId && clearTimeout(timeoutId);
                hide();
            }).on('click', hide);
        };

        // ���¼�
        Menu.fn.bindEvent = function () {
            var self = this;

            var $domNormal = self.$domNormal;
            var $domSelected = self.$domSelected;

            // ��ͼ��ȡ�ò˵�������¼���δselected����û�����Լ�����
            var clickEvent = self.clickEvent;
            if (!clickEvent) {
                clickEvent = function (e) {
                    // -----------dropPanel dropList modal-----------
                    var dropObj = self.dropPanel || self.dropList || self.modal;
                    if (dropObj && dropObj.show) {
                        if (dropObj.isShowing) {
                            dropObj.hide();
                        } else {
                            dropObj.show();
                        }
                        return;
                    }

                    // -----------command-----------
                    var editor = self.editor;
                    var commandName;
                    var commandValue;

                    var selected = self.selected;
                    if (selected) {
                        commandName = self.commandNameSelected;
                        commandValue = self.commandValueSelected;
                    } else {
                        commandName = self.commandName;
                        commandValue = self.commandValue;
                    }

                    if (commandName) {
                        // ִ������
                        editor.command(e, commandName, commandValue);
                    } else {
                        // ��ʾ
                        E.warn('�˵� "' + self.id + '" δ����click�¼�');
                        e.preventDefault();
                    }
                };
            }
            // ��ȡ�˵������selected����µĵ���¼�
            var clickEventSelected = self.clickEventSelected || clickEvent;

            // ���¼��󶨵��˵�dom��
            $domNormal.click(function (e) {
                if (!self.disabled()) {
                    clickEvent.call(self, e);
                    self.updateSelected();
                }
                e.preventDefault();
            });
            $domSelected.click(function (e) {
                if (!self.disabled()) {
                    clickEventSelected.call(self, e);
                    self.updateSelected();
                }
                e.preventDefault();
            });
        };

        // ����ѡ��״̬
        Menu.fn.updateSelected = function () {
            var self = this;
            var editor = self.editor;

            // ��ͼ��ȡ�û��Զ�����ж��¼�
            var updateSelectedEvent = self.updateSelectedEvent;
            if (!updateSelectedEvent) {
                // �û�δ�Զ��壬������Ĭ��ֵ
                updateSelectedEvent = function () {
                    var self = this;
                    var editor = self.editor;
                    var commandName = self.commandName;
                    var commandValue = self.commandValue;

                    if (commandValue) {
                        if (editor.queryCommandValue(commandName).toLowerCase() === commandValue.toLowerCase()) {
                            return true;
                        }
                    } else if (editor.queryCommandState(commandName)) {
                        return true;
                    }

                    return false;
                };
            }

            // ��ȡ���
            var result = updateSelectedEvent.call(self);
            result = !!result;

            // �洢�������ʾЧ��
            self.changeSelectedState(result);
        };

        // �л�ѡ��״̬����ʾЧ��
        Menu.fn.changeSelectedState = function (state) {
            var self = this;
            var selected = self.selected;

            if (state != null && typeof state === 'boolean') {
                if (selected === state) {
                    // �������͵�ǰ��״̬һ��
                    return;
                }
                // �洢���
                self.selected = state;

                // �л��˵�����ʾ
                if (state) {
                    // ѡ��
                    self.$domNormal.hide();
                    self.$domSelected.show();
                } else {
                    // δѡ��
                    self.$domNormal.show();
                    self.$domSelected.hide();
                }
            } // if
        };

        // ����˵�����ʾ�� dropPanel modal ʱ���˵���״̬ 
        Menu.fn.active = function (active) {
            if (active == null) {
                return this._activeState;
            }
            this._activeState = active;
        };
        Menu.fn.activeStyle = function (active) {
            var selected = this.selected;
            var $dom = this.$domNormal;
            var $domSelected = this.$domSelected;

            if (active) {
                $dom.addClass('active');
                $domSelected.addClass('active');
            } else {
                $dom.removeClass('active');
                $domSelected.removeClass('active');
            }

            // ��¼״̬ �� menu hover ʱ��ȡ״̬�� ��
            this.active(active);
        };

        // �˵������úͽ���
        Menu.fn.disabled = function (opt) {
            // ����Ϊ�գ�ȡֵ
            if (opt == null) {
                return !!this._disabled;
            }

            if (this._disabled === opt) {
                // Ҫ���õĲ���ֵ�͵�ǰ����ֻһ���������ٴ�����
                return;
            }

            var $dom = this.$domNormal;
            var $domSelected = this.$domSelected;

            // ������ʽ
            if (opt) {
                $dom.addClass('disable');
                $domSelected.addClass('disable');
            } else {
                $dom.removeClass('disable');
                $domSelected.removeClass('disable');
            }

            // �洢
            this._disabled = opt;
        };

    });
// dropList ���캯��
    _e(function (E, $) {

        // ���幹�캯��
        var DropList = function (editor, menu, opt) {
            this.editor = editor;
            this.menu = menu;

            // list ������Դ����ʽ {'commandValue': 'title', ...}
            this.data = opt.data;
            // ҪΪÿ��item�Զ����ģ��
            this.tpl = opt.tpl;
            // Ϊ��ִ�� editor.commandForElem �������elem��ѯ��ʽ
            this.selectorForELemCommand = opt.selectorForELemCommand;

            // ִ���¼�ǰ��Ĺ���
            this.beforeEvent = opt.beforeEvent;
            this.afterEvent = opt.afterEvent;

            // ��ʼ��
            this.init();
        };

        DropList.fn = DropList.prototype;

        // ��¶�� E �� window.wangEditor
        E.DropList = DropList;
    });
// dropList fn bind
    _e(function (E, $) {

        var DropList = E.DropList;

        // init
        DropList.fn.init = function () {
            var self = this;

            // ����dom����
            self.initDOM();

            // ��command�¼�
            self.bindEvent();

            // �������ص��¼�
            self.initHideEvent();
        };

        // ��ʼ��dom�ṹ
        DropList.fn.initDOM = function () {
            var self = this;
            var data = self.data;
            var tpl = self.tpl || '<span>{#title}</span>';
            var $list = $('<div class="wangEditor-drop-list clearfix"></div>');

            var itemContent;
            var $item;
            $.each(data, function (commandValue, title) {
                itemContent = tpl.replace(/{#commandValue}/ig, commandValue).replace(/{#title}/ig, title);
                $item = $('<a href="#" commandValue="' + commandValue + '"></a>');
                $item.append(itemContent);
                $list.append($item);
            });

            self.$list = $list;
        };

        // ���¼�
        DropList.fn.bindEvent = function () {
            var self = this;
            var editor = self.editor;
            var menu = self.menu;
            var commandName = menu.commandName;
            var selectorForELemCommand = self.selectorForELemCommand;
            var $list = self.$list;

            // ִ���¼�ǰ��Ĺ��Ӻ���
            var beforeEvent = self.beforeEvent;
            var afterEvent = self.afterEvent;

            $list.on('click', 'a[commandValue]', function (e) {
                // ��ʽ����ִ��֮ǰ
                if (beforeEvent && typeof beforeEvent === 'function') {
                    beforeEvent.call(e);
                }

                // ִ������
                var commandValue = $(e.currentTarget).attr('commandValue');
                if (menu.selected && editor.isRangeEmpty() && selectorForELemCommand) {
                    // ��ǰ����ѡ��״̬������ѡ������Ϊ��
                    editor.commandForElem(selectorForELemCommand, e, commandName, commandValue);
                } else {
                    // ��ǰδ����ѡ��״̬��������ѡ�����ݡ���ִ��Ĭ������
                    editor.command(e, commandName, commandValue);
                }

                // ��ʽ����֮��Ĺ���
                if (afterEvent && typeof afterEvent === 'function') {
                    afterEvent.call(e);
                }
            });
        };

        // ��������ط����������� droplist
        DropList.fn.initHideEvent = function () {
            var self = this;

            // ��ȡ list elem
            var thisList = self.$list.get(0);

            E.$body.on('click', function (e) {
                if (!self.isShowing) {
                    return;
                }
                var trigger = e.target;

                // ��ȡ�˵�elem
                var menu = self.menu;
                var menuDom;
                if (menu.selected) {
                    menuDom = menu.$domSelected.get(0);
                } else {
                    menuDom = menu.$domNormal.get(0);
                }

                if (menuDom === trigger || $.contains(menuDom, trigger)) {
                    // ˵���ɱ��˵����������
                    return;
                }

                if (thisList === trigger || $.contains(thisList, trigger)) {
                    // ˵���ɱ�list���������
                    return;
                }

                // ������������� list
                self.hide();
            });

            E.$window.scroll(function () {
                self.hide();
            });

            E.$window.on('resize', function () {
                self.hide();
            });
        };

    });
// dropListfn api
    _e(function (E, $) {

        var DropList = E.DropList;

        // ��Ⱦ
        DropList.fn._render = function () {
            var self = this;
            var editor = self.editor;
            var $list = self.$list;

            // ��Ⱦ��ҳ��
            editor.$editorContainer.append($list);

            // ��¼״̬
            self.rendered = true;
        };

        // ��λ
        DropList.fn._position = function () {
            var self = this;
            var $list = self.$list;
            var editor = self.editor;
            var menu = self.menu;
            var $menuContainer = editor.menuContainer.$menuContainer;
            var $menuDom = menu.selected ? menu.$domSelected : menu.$domNormal;
            // ע������� offsetParent() Ҫ���� .menu-item �� position
            // ��Ϊ .menu-item �� position:relative
            var menuPosition = $menuDom.offsetParent().position();

            // ȡ�� menu ��λ�á��ߴ�����
            var menuTop = menuPosition.top;
            var menuLeft = menuPosition.left;
            var menuHeight = $menuDom.offsetParent().height();
            var menuWidth = $menuDom.offsetParent().width();

            // ȡ�� list �ĳߴ�����
            var listWidth = $list.outerWidth();
            // var listHeight = $list.outerHeight();

            // ȡ�� $txt �ĳߴ�
            var txtWidth = editor.txt.$txt.outerWidth();

            // ------------��ʼ����-------------

            // �������� list λ������
            var top = menuTop + menuHeight;
            var left = menuLeft + menuWidth/2;
            var marginLeft = 0 - menuWidth/2;

            // ����������б߽磬��Ҫ���ƣ��Һ��Ҳ��м�϶��
            var valWithTxt = (left + listWidth) - txtWidth;
            if (valWithTxt > -10) {
                marginLeft = marginLeft - valWithTxt - 10;
            }
            // ������ʽ
            $list.css({
                top: top,
                left: left,
                'margin-left': marginLeft
            });

            // �����Ϊ���¹��������²˵�fixed�����ټ�һ������
            if (editor._isMenufixed) {
                top = top + (($menuContainer.offset().top + $menuContainer.outerHeight()) - $list.offset().top);

                // ��������top
                $list.css({
                    top: top
                });
            }
        };

        // ��ʾ
        DropList.fn.show = function () {
            var self = this;
            var menu = self.menu;
            if (!self.rendered) {
                // ��һ��show֮ǰ������Ⱦ
                self._render();
            }

            if (self.isShowing) {
                return;
            }

            var $list = self.$list;
            $list.show();

            // ��λ
            self._position();

            // ��¼״̬
            self.isShowing = true;

            // �˵�״̬
            menu.activeStyle(true);
        };

        // ����
        DropList.fn.hide = function () {
            var self = this;
            var menu = self.menu;
            if (!self.isShowing) {
                return;
            }

            var $list = self.$list;
            $list.hide();

            // ��¼״̬
            self.isShowing = false;

            // �˵�״̬
            menu.activeStyle(false);
        };
    });
// dropPanel ���캯��
    _e(function (E, $) {

        // ���幹�캯��
        var DropPanel = function (editor, menu, opt) {
            this.editor = editor;
            this.menu = menu;
            this.$content = opt.$content;
            this.width = opt.width || 200;
            this.height = opt.height;
            this.onRender = opt.onRender;

            // init
            this.init();
        };

        DropPanel.fn = DropPanel.prototype;

        // ��¶�� E �� window.wangEditor
        E.DropPanel = DropPanel;
    });
// dropPanel fn bind
    _e(function (E, $) {

        var DropPanel = E.DropPanel;

        // init
        DropPanel.fn.init = function () {
            var self = this;

            // ����dom����
            self.initDOM();

            // �������ص��¼�
            self.initHideEvent();
        };

        // init DOM
        DropPanel.fn.initDOM = function () {
            var self = this;
            var $content = self.$content;
            var width = self.width;
            var height = self.height;
            var $panel = $('<div class="wangEditor-drop-panel clearfix"></div>');
            var $triangle = $('<div class="tip-triangle"></div>');

            $panel.css({
                width: width,
                height: height ? height : 'auto'
            });
            $panel.append($triangle);
            $panel.append($content);

            // ��Ӷ�������
            self.$panel = $panel;
            self.$triangle = $triangle;
        };

        // ��������ط����������� dropPanel
        DropPanel.fn.initHideEvent = function () {
            var self = this;

            // ��ȡ panel elem
            var thisPanle = self.$panel.get(0);

            E.$body.on('click', function (e) {
                if (!self.isShowing) {
                    return;
                }
                var trigger = e.target;

                // ��ȡ�˵�elem
                var menu = self.menu;
                var menuDom;
                if (menu.selected) {
                    menuDom = menu.$domSelected.get(0);
                } else {
                    menuDom = menu.$domNormal.get(0);
                }

                if (menuDom === trigger || $.contains(menuDom, trigger)) {
                    // ˵���ɱ��˵����������
                    return;
                }

                if (thisPanle === trigger || $.contains(thisPanle, trigger)) {
                    // ˵���ɱ�panel���������
                    return;
                }

                // ������������� panel
                self.hide();
            });

            E.$window.scroll(function (e) {
                self.hide();
            });

            E.$window.on('resize', function () {
                self.hide();
            });
        };

    });
// dropPanel fn api
    _e(function (E, $) {

        var DropPanel = E.DropPanel;

        // ��Ⱦ
        DropPanel.fn._render = function () {
            var self = this;
            var onRender = self.onRender;
            var editor = self.editor;
            var $panel = self.$panel;

            // ��Ⱦ��ҳ��
            editor.$editorContainer.append($panel);

            // ��Ⱦ��Ļص��¼�
            onRender && onRender.call(self);

            // ��¼״̬
            self.rendered = true;
        };

        // ��λ
        DropPanel.fn._position = function () {
            var self = this;
            var $panel = self.$panel;
            var $triangle = self.$triangle;
            var editor = self.editor;
            var $menuContainer = editor.menuContainer.$menuContainer;
            var menu = self.menu;
            var $menuDom = menu.selected ? menu.$domSelected : menu.$domNormal;
            // ע������� offsetParent() Ҫ���� .menu-item �� position
            // ��Ϊ .menu-item �� position:relative
            var menuPosition = $menuDom.offsetParent().position();

            // ȡ�� menu ��λ�á��ߴ�����
            var menuTop = menuPosition.top;
            var menuLeft = menuPosition.left;
            var menuHeight = $menuDom.offsetParent().height();
            var menuWidth = $menuDom.offsetParent().width();

            // ȡ�� panel �ĳߴ�����
            var panelWidth = $panel.outerWidth();
            // var panelHeight = $panel.outerHeight();

            // ȡ�� $txt �ĳߴ�
            var txtWidth = editor.txt.$txt.outerWidth();

            // ------------��ʼ����-------------

            // �������� panel λ������
            var top = menuTop + menuHeight;
            var left = menuLeft + menuWidth/2;
            var marginLeft = 0 - panelWidth/2;
            var marginLeft2 = marginLeft;  // �������ں� marginLeft �Ƚϣ�������������tip��λ��

            // �����������߽磬���ƶ�������Ҫ�������10px��϶��
            if ((0 - marginLeft) > (left - 10)) {
                marginLeft = 0 - (left - 10);
            }

            // ����������б߽磬��Ҫ���ƣ��Һ��Ҳ���10px��϶��
            var valWithTxt = (left + panelWidth + marginLeft) - txtWidth;
            if (valWithTxt > -10) {
                marginLeft = marginLeft - valWithTxt - 10;
            }

            // ������ʽ
            $panel.css({
                top: top,
                left: left,
                'margin-left': marginLeft
            });

            // �����Ϊ���¹��������²˵�fixed�����ټ�һ������
            if (editor._isMenufixed) {
                top = top + (($menuContainer.offset().top + $menuContainer.outerHeight()) - $panel.offset().top);

                // ��������top
                $panel.css({
                    top: top
                });
            }

            // ���������� tip ��λ��
            $triangle.css({
                'margin-left': marginLeft2 - marginLeft - 5
            });
        };

        // focus ��һ�� input
        DropPanel.fn.focusFirstInput = function () {
            var self = this;
            var $panel = self.$panel;
            $panel.find('input[type=text],textarea').each(function () {
                var $input = $(this);
                if ($input.attr('disabled') == null) {
                    $input.focus();
                    return false;
                }
            });
        };

        // ��ʾ
        DropPanel.fn.show = function () {
            var self = this;
            var menu = self.menu;
            if (!self.rendered) {
                // ��һ��show֮ǰ������Ⱦ
                self._render();
            }

            if (self.isShowing) {
                return;
            }

            var $panel = self.$panel;
            $panel.show();

            // ��λ
            self._position();

            // ��¼״̬
            self.isShowing = true;

            // �˵�״̬
            menu.activeStyle(true);

            if (E.w3cRange) {
                // �߼������
                self.focusFirstInput();
            } else {
                // ���� IE8 input placeholder
                E.placeholderForIE8($panel);
            }
        };

        // ����
        DropPanel.fn.hide = function () {
            var self = this;
            var menu = self.menu;
            if (!self.isShowing) {
                return;
            }

            var $panel = self.$panel;
            $panel.hide();

            // ��¼״̬
            self.isShowing = false;

            // �˵�״̬
            menu.activeStyle(false);
        };

    });
// modal ���캯��
    _e(function (E, $) {

        // ���幹�캯��
        var Modal = function (editor, menu, opt) {
            this.editor = editor;
            this.menu = menu;
            this.$content = opt.$content;

            this.init();
        };

        Modal.fn = Modal.prototype;

        // ��¶�� E �� window.wangEditor
        E.Modal = Modal;
    });
// modal fn bind
    _e(function (E, $) {

        var Modal = E.Modal;

        Modal.fn.init = function () {
            var self = this;

            // ��ʼ��dom
            self.initDom();

            // ��ʼ�������¼�
            self.initHideEvent();
        };

        // ��ʼ��dom
        Modal.fn.initDom = function () {
            var self = this;
            var $content = self.$content;
            var $modal = $('<div class="wangEditor-modal"></div>');
            var $close = $('<div class="wangEditor-modal-close"><i class="wangeditor-menu-img-cancel-circle"></i></div>');

            $modal.append($close);
            $modal.append($content);

            // ��¼����
            self.$modal = $modal;
            self.$close = $close;
        };

        // ��ʼ�������¼�
        Modal.fn.initHideEvent = function () {
            var self = this;
            var $close = self.$close;
            var modal = self.$modal.get(0);

            // ��� $close ��ť������
            $close.click(function () {
                self.hide();
            });

            // ����������֣�����
            E.$body.on('click', function (e) {
                if (!self.isShowing) {
                    return;
                }
                var trigger = e.target;

                // ��ȡ�˵�elem
                var menu = self.menu;
                var menuDom;
                if (menu) {
                    if (menu.selected) {
                        menuDom = menu.$domSelected.get(0);
                    } else {
                        menuDom = menu.$domNormal.get(0);
                    }

                    if (menuDom === trigger || $.contains(menuDom, trigger)) {
                        // ˵���ɱ��˵����������
                        return;
                    }
                }

                if (modal === trigger || $.contains(modal, trigger)) {
                    // ˵���ɱ�panel���������
                    return;
                }

                // ������������� panel
                self.hide();
            });
        };
    });
// modal fn api
    _e(function (E, $) {

        var Modal = E.Modal;

        // ��Ⱦ
        Modal.fn._render = function () {
            var self = this;
            var editor = self.editor;
            var $modal = self.$modal;

            // $modal��z-index�������õ�z-index�������� +10
            $modal.css('z-index', editor.config.zindex + 10 + '');

            // ��Ⱦ��body�����
            E.$body.append($modal);

            // ��¼״̬
            self.rendered = true;
        };

        // ��λ
        Modal.fn._position = function () {
            var self = this;
            var $modal = self.$modal;
            var top = $modal.offset().top;
            var width = $modal.outerWidth();
            var height = $modal.outerHeight();
            var marginLeft = 0 - (width / 2);
            var marginTop = 0 - (height / 2);
            var sTop = E.$window.scrollTop();

            // ��֤modal�����������������ϱ߿�
            if ((height / 2) > top) {
                marginTop = 0 - top;
            }

            $modal.css({
                'margin-left': marginLeft + 'px',
                'margin-top': (marginTop + sTop) + 'px'
            });
        };

        // ��ʾ
        Modal.fn.show = function () {
            var self = this;
            var menu = self.menu;
            if (!self.rendered) {
                // ��һ��show֮ǰ������Ⱦ
                self._render();
            }

            if (self.isShowing) {
                return;
            }
            // ��¼״̬
            self.isShowing = true;

            var $modal = self.$modal;
            $modal.show();

            // ��λ
            self._position();

            // ����˵�״̬
            menu && menu.activeStyle(true);
        };

        // ����
        Modal.fn.hide = function () {
            var self = this;
            var menu = self.menu;
            if (!self.isShowing) {
                return;
            }
            // ��¼״̬
            self.isShowing = false;

            // ����
            var $modal = self.$modal;
            $modal.hide();

            // �˵�״̬
            menu && menu.activeStyle(false);
        };
    });
// txt ���캯��
    _e(function (E, $) {

        // ���幹�캯��
        var Txt = function (editor) {
            this.editor = editor;

            // ��ʼ��
            this.init();
        };

        Txt.fn = Txt.prototype;

        // ��¶�� E �� window.wangEditor
        E.Txt = Txt;
    });
// Txt.fn bind fn
    _e(function (E, $) {

        var Txt = E.Txt;

        // ��ʼ��
        Txt.fn.init = function () {
            var self = this;
            var editor = self.editor;
            var $valueContainer = editor.$valueContainer;
            var currentValue = editor.getInitValue();
            var $txt;

            if ($valueContainer.get(0).nodeName === 'DIV') {
                // ����������ɱ༭����Ԫ�ؾ���div����ֱ��ʹ��
                $txt = $valueContainer;
                $txt.addClass("wangEditor-txt");
                $txt.attr('contentEditable', 'true');
            } else {
                // �������div����textarea�����򴴽�һ��div
                $txt = $(
                    '<div class="wangEditor-txt" contentEditable="true">' +
                    currentValue +
                    '</div>'
                );
            }

            // ��ͼ������һ�����У�ready֮�����
            editor.ready(function () {
                self.insertEmptyP();
            });

            self.$txt = $txt;

            // ɾ��ʱ�����û�������ˣ������һ�� <p><br></p>
            self.contentEmptyHandle();

            // enterʱ������ʹ�� div ����
            self.bindEnterForDiv();

            // enterʱ���� p ���� text
            self.bindEnterForText();

            // tab ����4���ո�
            self.bindTabEvent();

            // ����ճ������
            self.bindPasteFilter();

            // $txt.formatText() ����
            self.bindFormatText();

            // ���� $txt.html() ����
            self.bindHtml();
        };

        // ɾ��ʱ�����û�������ˣ������һ�� <p><br></p>
        Txt.fn.contentEmptyHandle = function () {
            var self = this;
            var editor = self.editor;
            var $txt = self.$txt;
            var $p;

            $txt.on('keydown', function (e) {
                if (e.keyCode !== 8) {
                    return;
                }
                var txtHtml = $.trim($txt.html().toLowerCase());
                if (txtHtml === '<p><br></p>') {
                    // ������ʣ��һ�����У��Ͳ��ټ���ɾ����
                    e.preventDefault();
                    return;
                }
            });

            $txt.on('keyup', function (e) {
                if (e.keyCode !== 8) {
                    return;
                }
                var txtHtml = $.trim($txt.html().toLowerCase());
                // ffʱ�� txtHtml === '<br>' �жϣ������� !txtHtml �ж�
                if (!txtHtml || txtHtml === '<br>') {
                    // ���ݿ���
                    $p = $('<p><br/></p>');
                    $txt.html(''); // һ��Ҫ����գ������� ff ��������
                    $txt.append($p);
                    editor.restoreSelectionByElem($p.get(0));
                }
            });
        };

        // enterʱ������ʹ�� div ����
        Txt.fn.bindEnterForDiv = function () {
            var tags = E.config.legalTags; // �����б༭��Ҫ��ĺϷ���ǩ���� p head table blockquote ul ol ��
            var self = this;
            var editor = self.editor;
            var $txt = self.$txt;

            var $keydownDivElem;
            function divHandler() {
                if (!$keydownDivElem) {
                    return;
                }

                var $pElem = $('<p>' + $keydownDivElem.html() + '</p>');
                $keydownDivElem.after($pElem);
                $keydownDivElem.remove();
            }

            $txt.on('keydown keyup', function (e) {
                if (e.keyCode !== 13) {
                    return;
                }
                // ���ҺϷ���ǩ
                var rangeElem = editor.getRangeElem();
                var targetElem = editor.getLegalTags(rangeElem);
                var $targetElem;
                var $pElem;

                if (!targetElem) {
                    // û�ҵ��Ϸ���ǩ����ȥ���� div
                    targetElem = editor.getSelfOrParentByName(rangeElem, 'div');
                    if (!targetElem) {
                        return;
                    }
                    $targetElem = $(targetElem);

                    if (e.type === 'keydown') {
                        // �첽ִ�У�ͬ��ִ�л�������⣩
                        $keydownDivElem = $targetElem;
                        setTimeout(divHandler, 0);
                    }

                    if (e.type === 'keyup') {
                        // �� div �������ƶ��� p ���棬���Ƴ� div
                        $pElem = $('<p>' + $targetElem.html() + '</p>');
                        $targetElem.after($pElem);
                        $targetElem.remove();

                        // ����ǻس���������ѡ����λ������
                        editor.restoreSelectionByElem($pElem.get(0), 'start');
                    }
                }
            });
        };

        // enterʱ���� p ���� text
        Txt.fn.bindEnterForText = function () {
            var self = this;
            var $txt = self.$txt;
            var handle;
            $txt.on('keyup', function (e) {
                if (e.keyCode !== 13) {
                    return;
                }
                if (!handle) {
                    handle = function() {
                        self.wrapImgAndText();
                    };
                }
                setTimeout(handle);
            });
        };

        // tab ʱ������4���ո�
        Txt.fn.bindTabEvent = function () {
            var self = this;
            var editor = self.editor;
            var $txt = self.$txt;

            $txt.on('keydown', function (e) {
                if (e.keyCode !== 9) {
                    // ֻ���� tab ��ť
                    return;
                }
                // ��������֧�� insertHtml �����4���ո������֧�֣��Ͳ�����
                if (editor.queryCommandSupported('insertHtml')) {
                    editor.command(e, 'insertHtml', '&nbsp;&nbsp;&nbsp;&nbsp;');
                }
            });
        };

        // ����ճ������
        Txt.fn.bindPasteFilter = function () {
            var self = this;
            var editor = self.editor;
            var resultHtml = '';  //�洢���յĽ��
            var $txt = self.$txt;
            var legalTags = editor.config.legalTags;
            var legalTagArr = legalTags.split(',');

            $txt.on('paste', function (e) {
                if (!editor.config.pasteFilter) {
                    // ������ȡ����ճ������
                    return;
                }

                var currentNodeName = editor.getRangeElem().nodeName;
                if (currentNodeName === 'TD' || currentNodeName === 'TH') {
                    // �ڱ��ĵ�Ԫ����ճ���������������ݡ����������쳣���
                    return;
                }

                resultHtml = ''; // ����� resultHtml

                var pasteHtml, $paste;
                var data = e.clipboardData || e.originalEvent.clipboardData;
                var ieData = window.clipboardData;

                if (editor.config.pasteText) {
                    // ֻճ�����ı�

                    if (data && data.getData) {
                        // w3c
                        pasteHtml = data.getData('text/plain');
                    } else if (ieData && ieData.getData) {
                        // IE
                        pasteHtml = ieData.getData('text');
                    } else {
                        // �������
                        return;
                    }

                    // ƴ��Ϊ <p> ��ǩ
                    if (pasteHtml) {
                        resultHtml = '<p>' + pasteHtml + '</p>';
                    }

                } else {
                    // ճ����������ʽ�ġ�ֻ�б�ǩ�� html

                    if (data && data.getData) {
                        // w3c

                        // ��ȡճ��������html
                        pasteHtml = data.getData('text/html');
                        if (pasteHtml) {
                            // ����dom
                            $paste = $('<div>' + pasteHtml + '</div>');
                            // ������������洢�� resultHtml ��ȫ�֡�����
                            handle($paste.get(0));
                        } else {
                            // �ò���html����ͼ��ȡtext
                            pasteHtml = data.getData('text/plain');
                            if (pasteHtml) {
                                // �滻�����ַ�
                                pasteHtml = pasteHtml.replace(/[ ]/g, '&nbsp;')
                                    .replace(/</g, '&lt;')
                                    .replace(/>/g, '&gt;')
                                    .replace(/\n/g, '</p><p>');
                                pasteHtml = pasteHtml.Replace(html, "<[^>]*>", "<p>");
                                // ƴ��
                                resultHtml = '<p>' + pasteHtml + '</p>';

                                // ��ѯ����
                                resultHtml = resultHtml.replace(/<p>(https?:\/\/.*?)<\/p>/ig, function (match, link) {
                                    return '<p><a href="' + link + '" target="_blank">' + link + '</p>';
                                });
                            }
                        }

                    } else if (ieData && ieData.getData) {
                        // IE ֱ�ӴӼ��а���ȡ�����ı���ʽ
                        resultHtml = ieData.getData('text');
                        if (!resultHtml) {
                            return;
                        }
                        // ƴ��Ϊ <p> ��ǩ
                        resultHtml = '<p>' + resultHtml + '</p>';
                        resultHtml = resultHtml.replace(new RegExp('\n', 'g'), '</p><p>');
                    } else {
                        // �������
                        return;
                    }
                }

                // ִ������
                if (resultHtml) {
                    editor.command(e, 'insertHtml', resultHtml);

                    // ɾ������Ϊ�յ� p ��Ƕ�׵� p
                    self.clearEmptyOrNestP();
                }
            });











            // ����ճ��������
            function handle(elem) {
                if (!elem || !elem.nodeType || !elem.nodeName) {
                    return;
                }
                var $elem;
                var nodeName = elem.nodeName.toLowerCase();
                var nodeType = elem.nodeType;
                var childNodesClone;

                // ֻ�����ı�����ͨnode��ǩ
                if (nodeType !== 3 && nodeType !== 1) {
                    return;
                }

                $elem = $(elem);

                // ������������������ȱ���
                if (nodeName === 'div') {
                    childNodesClone = [];
                    $.each(elem.childNodes, function (index, item) {
                        // elem.childNodes �ɻ�ȡTEXT�ڵ㣬�� $elem.children() �ͻ�ȡ����
                        // �Ƚ� elem.childNodes ����һ�ݣ�һ����ѭ���ݹ������ elem �����仯
                        childNodesClone.push(item);
                    });
                    // ������Ԫ�أ�ִ�в���
                    $.each(childNodesClone, function () {
                        handle(this);
                    });
                    return;
                }

                if (legalTagArr.indexOf(nodeName) >= 0) {
                    // ����ǺϷ���ǩ֮�ڵģ������Ԫ�����ͣ���ȡֵ
                    resultHtml += getResult(elem);
                } else if (nodeType === 3) {
                    // ������ı�����ֱ�Ӳ��� p ��ǩ
                    resultHtml += '<p>' + elem.textContent + '</p>';
                } else if (nodeName === 'br') {
                    // <br>����
                    resultHtml += '<br/>';
                }
                else {
                    // ���Եı�ǩ
                    if (['meta', 'style', 'script', 'object', 'form', 'iframe', 'hr'].indexOf(nodeName) >= 0) {
                        return;
                    }
                    // ������ǩ���Ƴ����ԣ����� p ��ǩ
                    $elem = $(removeAttrs(elem));
                    // ע�⣬����� clone() �Ǳ���ģ���������
                    resultHtml += $('<div>').append($elem.clone()).html();
                }
            }

            // ��ȡԪ�صĽ��
            function getResult(elem) {
                var nodeName = elem.nodeName.toLowerCase();
                var $elem;
                var htmlForP = '';
                var htmlForLi = '';

                if (['blockquote'].indexOf(nodeName) >= 0) {

                    // ֱ��ȡ��Ԫ��text����
                    $elem = $(elem);
                    return '<' + nodeName + '>' + $elem.text() + '</' + nodeName + '>';

                } else if (['p', 'h1', 'h2', 'h3', 'h4', 'h5'].indexOf(nodeName) >= 0) {

                    //p head ȡ�� text ������
                    elem = removeAttrs(elem);
                    $elem = $(elem);
                    htmlForP = $elem.html();

                    // �޳� a img ֮���Ԫ��
                    htmlForP = htmlForP.replace(/<.*?>/ig, function (tag) {
                        if (tag === '</a>' || tag.indexOf('<a ') === 0 || tag.indexOf('<img ') === 0) {
                            return tag;
                        } else {
                            return '';
                        }
                    });

                    return '<' + nodeName + '>' + htmlForP + '</' + nodeName + '>';

                } else if (['ul', 'ol'].indexOf(nodeName) >= 0) {

                    // ul olԪ�أ���ȡ��Ԫ�أ�liԪ�أ���text link img����ƴ��
                    $elem = $(elem);
                    $elem.children().each(function () {
                        var $li = $(removeAttrs(this));
                        var html = $li.html();

                        html = html.replace(/<.*?>/ig, function (tag) {
                            if (tag === '</a>' || tag.indexOf('<a ') === 0 || tag.indexOf('<img ') === 0) {
                                return tag;
                            } else {
                                return '';
                            }
                        });

                        htmlForLi += '<li>' + html + '</li>';
                    });
                    return '<' + nodeName + '>' + htmlForLi + '</' + nodeName + '>';

                } else {

                    // ����Ԫ�أ��Ƴ�Ԫ������
                    $elem = $(removeAttrs(elem));
                    return $('<div>').append($elem).html();
                }
            }

            // �Ƴ�һ��Ԫ�أ���Ԫ�أ���attr
            function removeAttrs(elem) {
                var attrs = elem.attributes || [];
                var attrNames = [];
                var exception = ['href', 'target', 'src', 'alt', 'rowspan', 'colspan']; //�������

                // �ȴ洢��elem������ attr ������
                $.each(attrs, function (key, attr) {
                    if (attr && attr.nodeType === 2) {
                        attrNames.push(attr.nodeName);
                    }
                });
                // �ٸ�������ɾ������attr
                $.each(attrNames, function (key, attr) {
                    if (exception.indexOf(attr) < 0) {
                        // ���� exception �涨�����������ɾ����������
                        elem.removeAttribute(attr);
                    }
                });


                // �ݹ��ӽڵ�
                var children = elem.childNodes;
                if (children.length) {
                    $.each(children, function (key, value) {
                        removeAttrs(value);
                    });
                }

                return elem;
            }
        };

        // �� $txt.formatText() ����
        Txt.fn.bindFormatText = function () {
            var self = this;
            var editor = self.editor;
            var $txt = self.$txt;
            var legalTags = E.config.legalTags;
            var legalTagArr = legalTags.split(',');
            var length = legalTagArr.length;
            var regArr = [];

            // �� E.config.legalTags ���õ���Ч�ַ�������������ʽ
            $.each(legalTagArr, function (k, tag) {
                var reg = '\>\\s*\<(' + tag + ')\>';
                regArr.push(new RegExp(reg, 'ig'));
            });

            // ���� li 
            regArr.push(new RegExp('\>\\s*\<(li)\>', 'ig'));

            // ���� tr
            regArr.push(new RegExp('\>\\s*\<(tr)\>', 'ig'));

            // ���� code
            regArr.push(new RegExp('\>\\s*\<(code)\>', 'ig'));

            // ���� formatText ����
            $txt.formatText = function () {
                var $temp = $('<div>');
                var html = $txt.html();

                // ȥ���ո�
                html = html.replace(/\s*</ig, '<');

                // ���䡢���֮�任��
                $.each(regArr, function (k, reg) {
                    if (!reg.test(html)) {
                        return;
                    }
                    html = html.replace(reg, function (matchStr, tag) {
                        return '>\n<' + tag + '>';
                    });
                });

                $temp.html(html);
                return $temp.text();
            };
        };

        // ���� $txt.html ����
        Txt.fn.bindHtml = function () {
            var self = this;
            var editor = self.editor;
            var $txt = self.$txt;
            var $valueContainer = editor.$valueContainer;
            var valueNodeName = editor.valueNodeName;

            $txt.html = function (html) {
                var result;

                if (valueNodeName === 'div') {
                    // div ���ɵı༭����ȡֵ����ֵ����ֱ�Ӵ���jquery��html����
                    result = $.fn.html.call($txt, html);
                }

                // textarea ���ɵı༭��������Ҫ���Ǹ�ֵʱ��Ҳ��textarea��ֵ

                if (html === undefined) {
                    // ȡֵ��ֱ�Ӵ���jqueryԭ��html����
                    result = $.fn.html.call($txt);

                    // �滻 html �У�src��href�����е� & �ַ���
                    // ��Ϊ .html() ���� .innerHTML ������е� & �ַ����ĳ� &amp; ���� src �� href �е�Ҫ���� &
                    result = result.replace(/(href|src)\=\"(.*)\"/igm, function (a, b, c) {
                        return b + '="' + c.replace('&amp;', '&') + '"';
                    });
                } else {
                    // ��ֵ����Ҫͬʱ�� textarea ��ֵ
                    result = $.fn.html.call($txt, html);
                    $valueContainer.val(html);
                }

                if (html === undefined) {
                    return result;
                } else {
                    // �ֶ����� change �¼�����Ϊ $txt ����� change �¼����ж��Ƿ���Ҫִ�� editor.onchange 
                    $txt.change();
                }
            };
        };
    });
// Txt.fn api
    _e(function (E, $) {

        var Txt = E.Txt;

        var txtChangeEventNames = 'propertychange change click keyup input paste';

        // ��Ⱦ
        Txt.fn.render = function () {
            var $txt = this.$txt;
            var $editorContainer = this.editor.$editorContainer;
            $editorContainer.append($txt);
        };

        // ����߶�
        Txt.fn.initHeight = function () {
            var editor = this.editor;
            var $txt = this.$txt;
            var valueContainerHeight = editor.$valueContainer.height();
            var menuHeight = editor.menuContainer.height();
            var txtHeight = valueContainerHeight - menuHeight;

            // ������СΪ 50px
            txtHeight = txtHeight < 50 ? 50 : txtHeight;

            $txt.height(txtHeight);

            // ��¼ԭʼ�߶�
            editor.valueContainerHeight = valueContainerHeight;

            // ���� max-height
            this.initMaxHeight(txtHeight, menuHeight);
        };

        // �������߶�
        Txt.fn.initMaxHeight = function (txtHeight, menuHeight) {
            var editor = this.editor;
            var $menuContainer = editor.menuContainer.$menuContainer;
            var $txt = this.$txt;
            var $wrap = $('<div>');

            // ��Ҫ�����֧�� max-height�����򲻹�
            if (window.getComputedStyle && 'max-height'in window.getComputedStyle($txt.get(0))) {
                // ��ȡ max-height ���ж��Ƿ���ֵ
                var maxHeight = parseInt(editor.$valueContainer.css('max-height'));
                if (isNaN(maxHeight)) {
                    return;
                }

                // max-height �͡�ȫ������ʱ�г�ͻ
                if (editor.menus.fullscreen) {
                    E.warn('max-height�͡�ȫ�����˵�һ��ʹ��ʱ������һЩ������δ���������ʱ��Ҫ����ͬʱʹ��');
                    return;
                }

                // ���
                editor.useMaxHeight = true;

                // ����maxheight
                $wrap.css({
                    'max-height': (maxHeight - menuHeight) + 'px',
                    'overflow-y': 'auto'
                });
                $txt.css({
                    'height': 'auto',
                    'overflow-y': 'visible',
                    'min-height': txtHeight + 'px'
                });

                // ����ʽ���˵���Ӱ
                $wrap.on('scroll', function () {
                    if ($txt.parent().scrollTop() > 10) {
                        $menuContainer.addClass('wangEditor-menu-shadow');
                    } else {
                        $menuContainer.removeClass('wangEditor-menu-shadow');
                    }
                });

                // ���ڱ༭�����������ٰ���һ��
                $txt.wrap($wrap);
            }
        };

        // ����ѡ��
        Txt.fn.saveSelectionEvent = function () {
            var $txt = this.$txt;
            var editor = this.editor;
            var timeoutId;
            var dt = Date.now();

            function save() {
                editor.saveSelection();
            }

            // ͬ������ѡ��
            function saveSync() {
                // 100ms֮�ڣ����ظ�����
                if (Date.now() - dt < 100) {
                    return;
                }

                dt = Date.now();
                save();
            }

            // �첽����ѡ��
            function saveAync() {
                // ��������ֹ��Ƶ���ظ�����
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                timeoutId = setTimeout(save, 300);
            }

            // txt change ��focus��blur ʱ��ʱ����ѡ��
            $txt.on(txtChangeEventNames + ' focus blur', function (e) {
                // ��ͬ������ѡ����Ϊ���ý�����������Ҫִ�� editor.getRangeElem() �ĳ���
                // �ܹ���ȡ����ȷ�� rangeElem
                saveSync();

                // ���첽����ѡ����Ϊ��ȷ������׼ȷ��ѡ����Ϊ�����Ĳ�����׼��
                saveAync();
            });

            // �����קѡ��ʱ�����ܻ���ק���༭���������������֣���ʱ $txt �ͼ������� click�¼���
            $txt.on('mousedown', function () {
                $txt.on('mouseleave.saveSelection', function (e) {
                    // ��ͬ�����첽��������ע��
                    saveSync();
                    saveAync();

                    // ˳���ɲ˵�״̬Ҳ������
                    editor.updateMenuStyle();
                });
            }).on('mouseup', function () {
                $txt.off('mouseleave.saveSelection');
            });

        };

        // ��ʱ���� value
        Txt.fn.updateValueEvent = function () {
            var $txt = this.$txt;
            var editor = this.editor;
            var timeoutId, oldValue;

            // ���� onchange �¼�
            function doOnchange() {
                var val = $txt.html();
                if (oldValue === val) {
                    // �ޱ仯
                    return;
                }

                // ���� onchange �¼�
                if (editor.onchange && typeof editor.onchange === 'function') {
                    editor.onchange.call(editor);
                }

                // ��������
                editor.updateValue();

                // ��¼��������
                oldValue = val;
            }

            // txt change ʱ��ʱ��������
            $txt.on(txtChangeEventNames, function (e) {
                // ��ʼ��
                if (oldValue == null) {
                    oldValue = $txt.html();
                }

                // ������ݱ仯��ֹͣ���� 100ms ֮������ִ�У�
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                timeoutId = setTimeout(doOnchange, 100);
            });
        };

        // ��ʱ���� menustyle
        Txt.fn.updateMenuStyleEvent = function () {
            var $txt = this.$txt;
            var editor = this.editor;

            // txt change ʱ��ʱ��������
            $txt.on(txtChangeEventNames, function (e) {
                editor.updateMenuStyle();
            });
        };

        // ��������ͼ���� <p><br><p>
        Txt.fn.insertEmptyP = function () {
            var $txt = this.$txt;
            var $children = $txt.children();

            if ($children.length === 0) {
                $txt.append($('<p><br></p>'));
                return;
            }

            if ($.trim($children.last().html()).toLowerCase() !== '<br>') {
                $txt.append($('<p><br></p>'));
            }
        };

        // ���༭����¶���������ֺ�ͼƬ������ p ������
        Txt.fn.wrapImgAndText = function () {
            var $txt = this.$txt;
            var $imgs = $txt.children('img');
            var txt = $txt[0];
            var childNodes = txt.childNodes;
            var childrenLength = childNodes.length;
            var i, childNode, p;

            // ����ͼƬ
            $imgs.length && $imgs.each(function () {
                $(this).wrap('<p>');
            });

            // ��������
            for (i = 0; i < childrenLength; i++) {
                childNode = childNodes[i];
                if (childNode.nodeType === 3 && childNode.textContent && $.trim(childNode.textContent)) {
                    $(childNode).wrap('<p>');
                }
            }
        };

        // �������Ϊ�յ�<p>���Լ��ظ�������<p>����windows�µ�chromeճ������֮�󣬻�������������
        Txt.fn.clearEmptyOrNestP = function () {
            var $txt = this.$txt;
            var $pList = $txt.find('p');

            $pList.each(function () {
                var $p = $(this);
                var $children = $p.children();
                var childrenLength = $children.length;
                var $firstChild;
                var content = $.trim($p.html());

                // ����Ϊ�յ�p
                if (!content) {
                    $p.remove();
                    return;
                }

                // Ƕ�׵�p
                if (childrenLength === 1) {
                    $firstChild = $children.first();
                    if ($firstChild.get(0) && $firstChild.get(0).nodeName === 'P') {
                        $p.html( $firstChild.html() );
                    }
                }
            });
        };

        // ��ȡ scrollTop
        Txt.fn.scrollTop = function (val) {
            var self = this;
            var editor = self.editor;
            var $txt = self.$txt;

            if (editor.useMaxHeight) {
                return $txt.parent().scrollTop(val);
            } else {
                return $txt.scrollTop(val);
            }
        };

        // ���hoverʱ����ʾp��head�ĸ߶�
        Txt.fn.showHeightOnHover = function () {
            var editor = this.editor;
            var $editorContainer = editor.$editorContainer;
            var menuContainer = editor.menuContainer;
            var $txt = this.$txt;
            var $tip = $('<i class="height-tip"><i>');
            var isTipInTxt = false;

            function addAndShowTip($target) {
                if (!isTipInTxt) {
                    $editorContainer.append($tip);
                    isTipInTxt = true;
                }

                var txtTop = $txt.position().top;
                var txtHeight = $txt.outerHeight();

                var height = $target.height();
                var top = $target.position().top;
                var marginTop = parseInt($target.css('margin-top'), 10);
                var paddingTop = parseInt($target.css('padding-top'), 10);
                var marginBottom = parseInt($target.css('margin-bottom'), 10);
                var paddingBottom = parseInt($target.css('padding-bottom'), 10);

                // ��������Ľ��
                var resultHeight = height + paddingTop + marginTop + paddingBottom + marginBottom;
                var resultTop = top + menuContainer.height();

                // var spaceValue;

                // // �ж��Ƿ񳬳��±߽�
                // spaceValue = (resultTop + resultHeight) - (txtTop + txtHeight);
                // if (spaceValue > 0) {
                //     resultHeight = resultHeight - spaceValue;
                // }

                // // �ж��Ƿ񳬳����±߽�
                // spaceValue = txtTop > resultTop;
                // if (spaceValue) {
                //     resultHeight = resultHeight - spaceValue;
                //     top = top + spaceValue;
                // }

                // �������ս����Ⱦ
                $tip.css({
                    height: height + paddingTop + marginTop + paddingBottom + marginBottom,
                    top: top + menuContainer.height()
                });
            }
            function removeTip() {
                if (!isTipInTxt) {
                    return;
                }
                $tip.remove();
                isTipInTxt = false;
            }

            $txt.on('mouseenter', 'ul,ol,blockquote,p,h1,h2,h3,h4,h5,table,pre', function (e) {
                addAndShowTip($(e.currentTarget));
            }).on('mouseleave', function () {
                removeTip();
            });
        };

    });
// ���ߺ���
    _e(function (E, $) {

        // IE8 [].indexOf()
        if(!Array.prototype.indexOf){
            //IE�Ͱ汾��֧�� arr.indexOf 
            Array.prototype.indexOf = function(elem){
                var i = 0,
                    length = this.length;
                for(; i<length; i++){
                    if(this[i] === elem){
                        return i;
                    }
                }
                return -1;
            };
            //IE�Ͱ汾��֧�� arr.lastIndexOf
            Array.prototype.lastIndexOf = function(elem){
                var length = this.length;
                for(length = length - 1; length >= 0; length--){
                    if(this[length] === elem){
                        return length;
                    }
                }
                return -1;
            };
        }

        // IE8 Date.now()
        if (!Date.now) {
            Date.now = function () {
                return new Date().valueOf();
            };
        }

        // console.log && console.warn && console.error
        var console = window.console;
        var emptyFn = function () {};
        $.each(['info', 'log', 'warn', 'error'], function (key, value) {
            if (console == null) {
                E[value] = emptyFn;
            } else {
                E[value] = function (info) {
                    // ͨ�����������ƴ�ӡ���
                    if (E.config && E.config.printLog) {
                        console[value]('wangEditor��ʾ: ' + info);
                    }
                };
            }
        });

        // ��ȡ�����
        E.random = function () {
            return Math.random().toString().slice(2);
        };

        // ������Ƿ�֧�� placeholder
        E.placeholder = 'placeholder' in document.createElement('input');

        // ����IE8�� input placeholder
        E.placeholderForIE8 = function ($container) {
            if (E.placeholder) {
                return;
            }
            $container.find('input[placeholder]').each(function () {
                var $input = $(this);
                var placeholder = $input.attr('placeholder');

                if ($input.val() === '') {
                    $input.css('color', '#666');
                    $input.val(placeholder);

                    $input.on('focus.placeholder click.placeholder', function () {
                        $input.val('');
                        $input.css('color', '#333');
                        $input.off('focus.placeholder click.placeholder');
                    });
                }
            });
        };
    });
// ���԰�
    _e(function (E, $) {
        E.langs = {};

        // ����
        E.langs['zh-cn'] = {
            bold: '����',
            underline: '�»���',
            italic: 'б��',
            forecolor: '������ɫ',
            bgcolor: '����ɫ',
            strikethrough: 'ɾ����',
            eraser: '��ո�ʽ',
            source: 'Դ��',
            quote: '����',
            fontfamily: '����',
            fontsize: '�ֺ�',
            head: '����',
            orderlist: '�����б�',
            unorderlist: '�����б�',
            alignleft: '�����',
            aligncenter: '����',
            alignright: '�Ҷ���',
            link: '����',
            text: '�ı�',
            submit: '�ύ',
            cancel: 'ȡ��',
            unlink: 'ȡ������',
            table: '���',
            emotion: '����',
            img: 'ͼƬ',
            video: '��Ƶ',
            'width': '��',
            'height': '��',
            location: 'λ��',
            loading: '������',
            searchlocation: '����λ��',
            dynamicMap: '��̬��ͼ',
            clearLocation: '���λ��',
            langDynamicOneLocation: '��̬��ͼֻ����ʾһ��λ��',
            insertcode: '�������',
            undo: '����',
            redo: '�ظ�',
            fullscreen: 'ȫ��',
            openLink: '������'
        };

        // Ӣ��
        E.langs.en = {
            bold: 'Bold',
            underline: 'Underline',
            italic: 'Italic',
            forecolor: 'Color',
            bgcolor: 'Backcolor',
            strikethrough: 'Strikethrough',
            eraser: 'Eraser',
            source: 'Codeview',
            quote: 'Quote',
            fontfamily: 'Font family',
            fontsize: 'Font size',
            head: 'Head',
            orderlist: 'Ordered list',
            unorderlist: 'Unordered list',
            alignleft: 'Align left',
            aligncenter: 'Align center',
            alignright: 'Align right',
            link: 'Insert link',
            text: 'Text',
            submit: 'Submit',
            cancel: 'Cancel',
            unlink: 'Unlink',
            table: 'Table',
            emotion: 'Emotions',
            img: 'Image',
            video: 'Video',
            'width': 'width',
            'height': 'height',
            location: 'Location',
            loading: 'Loading',
            searchlocation: 'search',
            dynamicMap: 'Dynamic',
            clearLocation: 'Clear',
            langDynamicOneLocation: 'Only one location in dynamic map',
            insertcode: 'Insert Code',
            undo: 'Undo',
            redo: 'Redo',
            fullscreen: 'Full screnn',
            openLink: 'open link'
        };
    });
// ȫ������
    _e(function (E, $) {

        E.config = {};

        // ȫ��ʱ�� z-index
        E.config.zindex = 10000;

        // �Ƿ��ӡlog
        E.config.printLog = true;

        // �˵�������false - ��������number - ������ֵΪtopֵ
        E.config.menuFixed = 0;

        // �༭Դ��ʱ������ javascript
        E.config.jsFilter = true;

        // �༭������ı�ǩ
        E.config.legalTags = 'p,h1,h2,h3,h4,h5,h6,blockquote,table,ul,ol,pre';

        // ���԰�
        E.config.lang = E.langs['zh-cn'];

        // �˵�����
        E.config.menus = [
            'source',
            '|',
            'bold',
            'underline',
            'italic',
            'strikethrough',
            'eraser',
            'forecolor',
            'bgcolor',
            '|',
            'quote',
            'fontfamily',
            'fontsize',
            'head',
            'unorderlist',
            'orderlist',
            'alignleft',
            'aligncenter',
            'alignright',
            '|',
            'link',
            'unlink',
            'table',
            'emotion',
            '|',
            'img',
            'video',
            'location',
            'insertcode',
            '|',
            'undo',
            'redo',
            'fullscreen'
        ];

        // ��ɫ����
        E.config.colors = {
            // 'value': 'title'
            '#880000': '����ɫ',
            '#800080': '��ɫ',
            '#ff0000': '��ɫ',
            '#ff00ff': '�ʷ�ɫ',
            '#000080': '����ɫ',
            '#0000ff': '��ɫ',
            '#00ffff': '����ɫ',
            '#008080': '����ɫ',
            '#008000': '��ɫ',
            '#808000': '���ɫ',
            '#00ff00': 'ǳ��ɫ',
            '#ffcc00': '�Ȼ�ɫ',
            '#808080': '��ɫ',
            '#c0c0c0': '��ɫ',
            '#000000': '��ɫ',
            '#ffffff': '��ɫ'
        };

        // ����
        E.config.familys = [
            '����', '����', '����', '΢���ź�',
            'Arial', 'Verdana', 'Georgia',
            'Times New Roman', 'Microsoft JhengHei',
            'Trebuchet MS', 'Courier New', 'Impact', 'Comic Sans MS', 'Consolas'
        ];

        // �ֺ�
        E.config.fontsizes = {
            // ��ʽ��'value': 'title'
            1: '12px',
            2: '13px',
            3: '16px',
            4: '18px',
            5: '24px',
            6: '32px',
            7: '48px'
        };

        // �����
        E.config.emotionsShow = 'icon'; // ��ʾ�Ĭ��Ϊ'icon'��Ҳ�������ó�'value'
        E.config.emotions = {
            // 'default': {
            //     title: 'Ĭ��',
            //     data: './emotions.data'
            // },
            'weibo': {
                title: '΢������',
                data: [
                    {
                        icon: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/7a/shenshou_thumb.gif',
                        value: '[������]'
                    },
                    {
                        icon: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/60/horse2_thumb.gif',
                        value: '[����]'
                    },
                    {
                        icon: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/bc/fuyun_thumb.gif',
                        value: '[����]'
                    },
                    {
                        icon: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c9/geili_thumb.gif',
                        value: '[����]'
                    },
                    {
                        icon: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/f2/wg_thumb.gif',
                        value: '[Χ��]'
                    },
                    {
                        icon: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/70/vw_thumb.gif',
                        value: '[����]'
                    },
                    {
                        icon: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/6e/panda_thumb.gif',
                        value: '[��è]'
                    },
                    {
                        icon: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/81/rabbit_thumb.gif',
                        value: '[����]'
                    },
                    {
                        icon: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/bc/otm_thumb.gif',
                        value: '[������]'
                    },
                    {
                        icon: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/15/j_thumb.gif',
                        value: '[��]'
                    },
                    {
                        icon: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/89/hufen_thumb.gif',
                        value: '[����]'
                    },
                    {
                        icon: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/c4/liwu_thumb.gif',
                        value: '[����]'
                    },
                    {
                        icon: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/ac/smilea_thumb.gif',
                        value: '[�Ǻ�]'
                    },
                    {
                        icon: 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/0b/tootha_thumb.gif',
                        value: '[����]'
                    }
                ]
            }
        };

        // �ٶȵ�ͼ��key
        E.config.mapAk = 'TVhjYjq1ICT2qqL5LdS8mwas';

        // �ϴ�ͼƬ������
        // server��ַ
        E.config.uploadImgUrl = '';
        // ��ʱʱ��
        E.config.uploadTimeout = 20 * 1000;
        // ���ڴ洢�ϴ��ص��¼�
        E.config.uploadImgFns = {};
        // �Զ����ϴ�ͼƬ��filename
        // E.config.uploadImgFileName = 'customFileName';

        // �Զ����ϴ�������Ϊ true ֮����ʾ�ϴ�ͼ��
        E.config.customUpload = false;
        // �Զ����ϴ���init�¼�
        // E.config.customUploadInit = function () {....};

        // �Զ����ϴ�ʱ���ݵĲ������� token��
        E.config.uploadParams = {
            /* token: 'abcdef12345' */
        };

        // �Զ����ϴ��ǵ�header����
        E.config.uploadHeaders = {
            /* 'Accept' : 'text/x-json' */
        };

        // ��������ͼƬ��Ĭ��Ϊ false
        E.config.hideLinkImg = false;

        // �Ƿ����ճ������
        E.config.pasteFilter = true;

        // �Ƿ�ճ�����ı����� editor.config.pasteFilter === false ʱ�򣬴����ý�ʧЧ
        E.config.pasteText = false;

        // �������ʱ��Ĭ�ϵ�����
        E.config.codeDefaultLang = 'javascript';

    });
// ȫ��UI
    _e(function (E, $) {

        E.UI = {};

        // Ϊ�˵��Զ������õ�UI
        E.UI.menus = {
            // ��� default �������ţ��� IE8 �ᱨ��
            'default': {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-command"></i></a>',
                selected: '.selected'
            },
            bold: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-bold"></i></a>',
                selected: '.selected'
            },
            underline: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-underline"></i></a>',
                selected: '.selected'
            },
            italic: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-italic"></i></a>',
                selected: '.selected'
            },
            forecolor: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-pencil"></i></a>',
                selected: '.selected'
            },
            bgcolor: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-brush"></i></a>',
                selected: '.selected'
            },
            strikethrough: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-strikethrough"></i></a>',
                selected: '.selected'
            },
            eraser: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-eraser"></i></a>',
                selected: '.selected'
            },
            quote: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-quotes-left"></i></a>',
                selected: '.selected'
            },
            source: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-code"></i></a>',
                selected: '.selected'
            },
            fontfamily: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-font2"></i></a>',
                selected: '.selected'
            },
            fontsize: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-text-height"></i></a>',
                selected: '.selected'
            },
            head: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-header"></i></a>',
                selected: '.selected'
            },
            orderlist: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-list-numbered"></i></a>',
                selected: '.selected'
            },
            unorderlist: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-list-bullet"></i></a>',
                selected: '.selected'
            },
            alignleft: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-align-left"></i></a>',
                selected: '.selected'
            },
            aligncenter: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-align-center"></i></a>',
                selected: '.selected'
            },
            alignright: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-align-right"></i></a>',
                selected: '.selected'
            },
            link: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-link"></i></a>',
                selected: '.selected'
            },
            unlink: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-unlink"></i></a>',
                selected: '.selected'
            },
            table: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-table"></i></a>',
                selected: '.selected'
            },
            emotion: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-happy"></i></a>',
                selected: '.selected'
            },
            img: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-picture"></i></a>',
                selected: '.selected'
            },
            video: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-play"></i></a>',
                selected: '.selected'
            },
            location: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-location"></i></a>',
                selected: '.selected'
            },
            insertcode: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-terminal"></i></a>',
                selected: '.selected'
            },
            undo: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-ccw"></i></a>',
                selected: '.selected'
            },
            redo: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-cw"></i></a>',
                selected: '.selected'
            },
            fullscreen: {
                normal: '<a href="#" tabindex="-1"><i class="wangeditor-menu-img-enlarge2"></i></a>',
                selected: '<a href="#" tabindex="-1" class="selected"><i class="wangeditor-menu-img-shrink2"></i></a>'
            }
        };

    });
// ��������
    _e(function (E, $) {

        E.fn.initDefaultConfig = function () {
            var editor = this;
            editor.config = $.extend({}, E.config);
            editor.UI = $.extend({}, E.UI);
        };

    });
// ���� container
    _e(function (E, $) {

        E.fn.addEditorContainer = function () {
            this.$editorContainer = $('<div class="wangEditor-container"></div>');
        };

    });
// ���ӱ༭�������
    _e(function (E, $) {

        E.fn.addTxt = function () {
            var editor = this;
            var txt = new E.Txt(editor);

            editor.txt = txt;
        };

    });
// ����menuContainer����
    _e(function (E, $) {

        E.fn.addMenuContainer = function () {
            var editor = this;
            editor.menuContainer = new E.MenuContainer(editor);
        };

    });
// ����menus
    _e(function (E, $) {

        // �洢�����˵��ĺ���
        E.createMenuFns = [];
        E.createMenu = function (fn) {
            E.createMenuFns.push(fn);
        };

        // �������в˵�
        E.fn.addMenus = function () {
            var editor = this;
            var menuIds = editor.config.menus;

            // ���� menuId �Ƿ��������д���
            function check(menuId) {
                if (menuIds.indexOf(menuId) >= 0) {
                    return true;
                }
                return false;
            }

            // �������еĲ˵�������������ִ��
            $.each(E.createMenuFns, function (k, createMenuFn) {
                createMenuFn.call(editor, check);
            });
        };

    });
// bold�˵�
    _e(function (E, $) {

        E.createMenu(function (check) {
            var menuId = 'bold';
            if (!check(menuId)) {
                return;
            }

            var editor = this;
            var lang = editor.config.lang;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.bold,
                commandName: 'Bold'
            });

            // ����ѡ��״̬�µ�click�¼�
            menu.clickEventSelected = function (e) {
                var isRangeEmpty = editor.isRangeEmpty();
                if (!isRangeEmpty) {
                    // ���ѡ�������ݣ���ִ�л�������
                    editor.command(e, 'Bold');
                } else {
                    // ���ѡ��û������
                    editor.commandForElem('b,strong,h1,h2,h3,h4,h5', e, 'Bold');
                }
            };

            // ���ӵ�editor������
            editor.menus[menuId] = menu;
        });

    });
// underline�˵�
    _e(function (E, $) {

        E.createMenu(function (check) {
            var menuId = 'underline';
            if (!check(menuId)) {
                return;
            }

            var editor = this;
            var lang = editor.config.lang;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.underline,
                commandName: 'Underline'
            });

            // ����ѡ��״̬�µ�click�¼�
            menu.clickEventSelected = function (e) {
                var isRangeEmpty = editor.isRangeEmpty();
                if (!isRangeEmpty) {
                    // ���ѡ�������ݣ���ִ�л�������
                    editor.command(e, 'Underline');
                } else {
                    // ���ѡ��û������
                    editor.commandForElem('u,a', e, 'Underline');
                }
            };

            // ���ӵ�editor������
            editor.menus[menuId] = menu;
        });

    });
// italic �˵�
    _e(function (E, $) {

        E.createMenu(function (check) {
            var menuId = 'italic';
            if (!check(menuId)) {
                return;
            }
            var editor = this;
            var lang = editor.config.lang;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.italic,
                commandName: 'Italic'
            });

            // ����ѡ��״̬�µ�click�¼�
            menu.clickEventSelected = function (e) {
                var isRangeEmpty = editor.isRangeEmpty();
                if (!isRangeEmpty) {
                    // ���ѡ�������ݣ���ִ�л�������
                    editor.command(e, 'Italic');
                } else {
                    // ���ѡ��û������
                    editor.commandForElem('i', e, 'Italic');
                }
            };

            // ���ӵ�editor������
            editor.menus[menuId] = menu;
        });

    });
// forecolor �˵�
    _e(function (E, $) {

        E.createMenu(function (check) {
            var menuId = 'forecolor';
            if (!check(menuId)) {
                return;
            }
            var editor = this;
            var lang = editor.config.lang;
            var configColors = editor.config.colors;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.forecolor
            });

            // ���� dropPanel
            var $content = $('<div></div>');
            $.each(configColors, function (k, v) {
                $content.append(
                    [
                        '<a href="#" class="color-item"',
                        '    title="' + v + '" commandValue="' + k + '" ',
                        '    style="color: ' + k + '" ',
                        '><i class="wangeditor-menu-img-pencil"></i></a>'
                    ].join('')
                );
            });
            $content.on('click', 'a[commandValue]', function (e) {
                // ִ������
                var $elem = $(this);
                var commandValue = $elem.attr('commandValue');

                if (menu.selected && editor.isRangeEmpty()) {
                    // ��ǰ����ѡ��״̬������ѡ������Ϊ��
                    editor.commandForElem('font[color]', e, 'forecolor', commandValue);
                } else {
                    // ��ǰδ����ѡ��״̬��������ѡ�����ݡ���ִ��Ĭ������
                    editor.command(e, 'forecolor', commandValue);
                }
            });
            menu.dropPanel = new E.DropPanel(editor, menu, {
                $content: $content,
                width: 125
            });

            // ���� update selected �¼�
            menu.updateSelectedEvent = function () {
                var rangeElem = editor.getRangeElem();
                rangeElem = editor.getSelfOrParentByName(rangeElem, 'font[color]');
                if (rangeElem) {
                    return true;
                }
                return false;
            };

            // ���ӵ�editor������
            editor.menus[menuId] = menu;
        });

    });
// bgcolor �˵�
    _e(function (E, $) {

        E.createMenu(function (check) {
            var menuId = 'bgcolor';
            if (!check(menuId)) {
                return;
            }
            var editor = this;
            var lang = editor.config.lang;
            var configColors = editor.config.colors;

            // ���Ԫ���Ƿ��� background-color: ������ʽ
            function checkElemFn(elem) {
                var cssText;
                if (elem && elem.style && elem.style.cssText != null) {
                    cssText = elem.style.cssText;
                    if (cssText && cssText.indexOf('background-color:') >= 0) {
                        return true;
                    }
                }
                return false;
            }

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.bgcolor
            });

            // ���� dropPanel
            var $content = $('<div></div>');
            $.each(configColors, function (k, v) {
                $content.append(
                    [
                        '<a href="#" class="color-item"',
                        '    title="' + v + '" commandValue="' + k + '" ',
                        '    style="color: ' + k + '" ',
                        '><i class="wangeditor-menu-img-brush"></i></a>'
                    ].join('')
                );
            });
            $content.on('click', 'a[commandValue]', function (e) {
                // ִ������

                var $elem = $(this);
                var commandValue = $elem.attr('commandValue');

                if (menu.selected && editor.isRangeEmpty()) {
                    // ��ǰ����ѡ��״̬������ѡ������Ϊ�ա�ʹ�� commandForElem ִ������
                    editor.commandForElem({
                        selector: 'span,font',
                        check: checkElemFn
                    }, e, 'BackColor', commandValue);
                } else {
                    // ��ǰδ����ѡ��״̬��������ѡ�����ݡ���ִ��Ĭ������
                    editor.command(e, 'BackColor', commandValue);
                }
            });
            menu.dropPanel = new E.DropPanel(editor, menu, {
                $content: $content,
                width: 125
            });

            // ���� update selected �¼�
            menu.updateSelectedEvent = function () {
                var rangeElem = editor.getRangeElem();
                rangeElem = editor.getSelfOrParentByName(rangeElem, 'span,font', checkElemFn);

                if (rangeElem) {
                    return true;
                }
                return false;
            };

            // ���ӵ�editor������
            editor.menus[menuId] = menu;
        });

    });
// strikethrough �˵�
    _e(function (E, $) {

        E.createMenu(function (check) {
            var menuId = 'strikethrough';
            if (!check(menuId)) {
                return;
            }
            var editor = this;
            var lang = editor.config.lang;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.strikethrough,
                commandName: 'StrikeThrough'
            });

            // ����ѡ��״̬�µ�click�¼�
            menu.clickEventSelected = function (e) {
                var isRangeEmpty = editor.isRangeEmpty();
                if (!isRangeEmpty) {
                    // ���ѡ�������ݣ���ִ�л�������
                    editor.command(e, 'StrikeThrough');
                } else {
                    // ���ѡ��û������
                    editor.commandForElem('strike', e, 'StrikeThrough');
                }
            };

            // ���ӵ�editor������
            editor.menus[menuId] = menu;
        });

    });
// eraser �˵�
    _e(function (E, $) {

        E.createMenu(function (check) {
            var menuId = 'eraser';
            if (!check(menuId)) {
                return;
            }
            var editor = this;
            var lang = editor.config.lang;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.eraser,
                commandName: 'RemoveFormat'
            });

            // �������¼�
            menu.clickEvent = function (e) {
                var isRangeEmpty = editor.isRangeEmpty();

                if (!isRangeEmpty) {
                    // ѡ�����ǿյģ���ִ��Ĭ������
                    editor.command(e, 'RemoveFormat');
                    return;
                }

                var $clearElem;

                // �Զ���������
                function commandFn() {
                    var editor = this;
                    var rangeElem;
                    var pElem, $pElem;
                    var quoteElem, $quoteElem;
                    var listElem, $listElem;

                    // ��ȡѡ�� elem
                    rangeElem = editor.getRangeElem();
                    // ��һ������ȡ quote ��Ԫ��
                    quoteElem = editor.getSelfOrParentByName(rangeElem, 'blockquote');
                    if (quoteElem) {
                        $quoteElem = $(quoteElem);
                        $clearElem = $('<p>' + $quoteElem.text() + '</p>');
                        $quoteElem.after($clearElem).remove();
                    }
                    // �ڶ�������ȡ p h ��Ԫ��
                    pElem = editor.getSelfOrParentByName(rangeElem, 'p,h1,h2,h3,h4,h5');
                    if (pElem) {
                        $pElem = $(pElem);
                        $clearElem = $('<p>' + $pElem.text() + '</p>');
                        $pElem.after($clearElem).remove();
                    }
                    // ����������ȡlist
                    listElem = editor.getSelfOrParentByName(rangeElem, 'ul,ol');
                    if (listElem) {
                        $listElem = $(listElem);
                        $clearElem = $('<p>' + $listElem.text() + '</p>');
                        $listElem.after($clearElem).remove();
                    }
                }

                // �Զ��� callback �¼�
                function callback() {
                    // callback�У�����rangeΪclearElem
                    var editor = this;
                    if ($clearElem) {
                        editor.restoreSelectionByElem($clearElem.get(0));
                    }
                }

                // ִ���Զ�������
                editor.customCommand(e, commandFn, callback);
            };

            // ���ӵ�editor������
            editor.menus[menuId] = menu;
        });

    });
// source �˵�
    _e(function (E, $) {

        E.createMenu(function (check) {
            var menuId = 'source';
            if (!check(menuId)) {
                return;
            }
            var editor = this;
            var lang = editor.config.lang;
            var txtHtml;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.source
            });

            menu.isShowCode = false;

            // ��������
            function updateValue() {
                var $code = menu.$codeTextarea;
                var $txt = editor.txt.$txt;
                var value = $.trim($code.val()); // ȡֵ

                if (!value) {
                    value = '<p><br></p>';
                }

                // ����js����
                if (editor.config.jsFilter) {

                    value = value.replace(/<script[\s\S]*?<\/script>/ig, '');
                }
                // ��ֵ
                try {
                    $txt.html(value);
                } catch (ex) {
                    // ���� html Դ�����һ�㶼��ȡ���� js ����֮��js�����µ�
                }
            }

            // ����click�¼�
            menu.clickEvent = function (e) {
                var self = this;
                var editor = self.editor;
                var $txt = editor.txt.$txt;
                var txtOuterHeight = $txt.outerHeight();
                var txtHeight = $txt.height();

                if (!self.$codeTextarea) {
                    self.$codeTextarea = $('<textarea class="code-textarea"></textarea>');
                }
                var $code = self.$codeTextarea;
                $code.css({
                    height: txtHeight,
                    'margin-top': txtOuterHeight - txtHeight
                });

                // ��ֵ
                $code.val($txt.html());

                // ��ر仯
                $code.on('change', function (e) {
                    updateValue();
                });

                // ��Ⱦ
                $txt.after($code).hide();
                $code.show();

                // ����״̬
                menu.isShowCode = true;

                // ִ�� updateSelected �¼�
                this.updateSelected();

                // ���������˵�
                editor.disableMenusExcept('source');

                // ��¼��ǰhtmlֵ
                txtHtml = $txt.html();
            };

            // ����ѡ��״̬�µ�click�¼�
            menu.clickEventSelected = function (e) {
                var self = this;
                var editor = self.editor;
                var $txt = editor.txt.$txt;
                var $code = self.$codeTextarea;
                var value;

                if (!$code) {
                    return;
                }

                // ��������
                updateValue();

                // ��Ⱦ
                $code.after($txt).hide();
                $txt.show();

                // ����״̬
                menu.isShowCode = false;

                // ִ�� updateSelected �¼�
                this.updateSelected();

                // ���������˵�
                editor.enableMenusExcept('source');

                // �ж��Ƿ�ִ�� onchange �¼�
                if ($txt.html() !== txtHtml) {
                    if (editor.onchange && typeof editor.onchange === 'function') {
                        editor.onchange.call(editor);
                    }
                }
            };

            // �����л�ѡ��״̬�¼�
            menu.updateSelectedEvent = function () {
                return this.isShowCode;
            };

            // ���ӵ�editor������
            editor.menus[menuId] = menu;
        });

    });
// quote �˵�
    _e(function (E, $) {

        E.createMenu(function (check) {
            var menuId = 'quote';
            if (!check(menuId)) {
                return;
            }
            var editor = this;
            var lang = editor.config.lang;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.quote,
                commandName: 'formatBlock',
                commandValue: 'blockquote'
            });

            // ����click�¼�
            menu.clickEvent = function (e) {
                var rangeElem = editor.getRangeElem();
                var $rangeElem;
                if (!rangeElem) {
                    e.preventDefault();
                    return;
                }
                var currentQuote = editor.getSelfOrParentByName(rangeElem, 'blockquote');
                var $quote;

                if (currentQuote) {
                    // ˵����ǰ��quote֮�ڣ������κδ���
                    e.preventDefault();
                    return;
                }

                rangeElem = editor.getLegalTags(rangeElem);
                $rangeElem = $(rangeElem);

                // �����֣�������ִ������
                if (!$rangeElem.text()) {
                    return;
                }


                if (!rangeElem) {
                    // ִ��Ĭ������
                    // IE8 ��ִ�д˴��������������Դ�����Ч��Ҳ������
                    editor.command(e, 'formatBlock', 'blockquote');
                    return;
                }

                // �Զ���command�¼�
                function commandFn() {
                    $quote = $('<p>' + $rangeElem.text() + '</p>');
                    $rangeElem.after($quote).remove();
                    $quote.wrap('<blockquote>');
                }

                // �Զ��� callback �¼�
                function callback() {
                    // callback�У�����rangeΪquote
                    var editor = this;
                    if ($quote) {
                        editor.restoreSelectionByElem($quote.get(0));
                    }
                }

                // ִ���Զ�������
                editor.customCommand(e, commandFn, callback);
            };

            // ����ѡ��״̬�µ�click�¼�
            menu.clickEventSelected = function (e) {
                var rangeElem;
                var quoteElem;
                var $lastChild;

                // ��ȡ��ǰѡ����elem������ͼ������ quote Ԫ��
                rangeElem = editor.getRangeElem();
                quoteElem = editor.getSelfOrParentByName(rangeElem, 'blockquote');
                if (!quoteElem) {
                    // û�ҵ����򷵻�
                    e.preventDefault();
                    return;
                }

                // �Զ����command�¼�
                function commandFn() {
                    var $quoteElem;
                    var $children;

                    $quoteElem = $(quoteElem);
                    $children = $quoteElem.children();
                    if ($children.length) {
                        $children.each(function (k) {
                            var $item = $(this);
                            if ($item.get(0).nodeName === 'P') {
                                $quoteElem.after($item);
                            } else {
                                $quoteElem.after('<p>' + $item.text() + '</p>');
                            }
                            $lastChild = $item;  // ��¼���һ����Ԫ�أ�����callback�е�range��λ
                        });
                        $quoteElem.remove();
                        return;
                    }
                }

                // �Զ����callback����
                function callback() {
                    // callback�У�����rangeΪlastChild
                    var editor = this;
                    if ($lastChild) {
                        editor.restoreSelectionByElem($lastChild.get(0));
                    }
                }

                // ִ���Զ�������
                editor.customCommand(e, commandFn, callback);
            };

            // �������ѡ��״̬���¼�
            menu.updateSelectedEvent = function () {
                var self = this; //�˵�����
                var editor = self.editor;
                var rangeElem;

                rangeElem = editor.getRangeElem();
                rangeElem = editor.getSelfOrParentByName(rangeElem, 'blockquote');

                if (rangeElem) {
                    return true;
                }

                return false;
            };

            // ���ӵ�editor������
            editor.menus[menuId] = menu;

            // --------------- ���ε�� enter �������� ---------------
            editor.ready(function () {
                var editor = this;
                var $txt = editor.txt.$txt;
                var isPrevEnter = false;  // �ǲ��Ǹո���quote�а��� enter ��
                $txt.on('keydown', function (e) {
                    if (e.keyCode !== 13) {
                        // ���� enter ��
                        isPrevEnter = false;
                        return;
                    }

                    var rangeElem = editor.getRangeElem();
                    rangeElem = editor.getSelfOrParentByName(rangeElem, 'blockquote');
                    if (!rangeElem) {
                        // ѡ������ quote
                        isPrevEnter = false;
                        return;
                    }

                    if (!isPrevEnter) {
                        // ���û����qote�а�enter��
                        isPrevEnter = true;
                        return;
                    }

                    var currentRangeElem = editor.getRangeElem();
                    var $currentRangeElem = $(currentRangeElem);
                    if ($currentRangeElem.length) {
                        $currentRangeElem.parent().after($currentRangeElem);
                    }

                    // ����ѡ��
                    editor.restoreSelectionByElem(currentRangeElem, 'start');

                    isPrevEnter = false;
                    // ��ֹĬ������
                    e.preventDefault();

                });
            }); // editor.ready(

            // --------------- ����quote��������ʱ����ɾ�������� ---------------
            editor.ready(function () {
                var editor = this;
                var $txt = editor.txt.$txt;
                var $rangeElem;

                function commandFn() {
                    $rangeElem && $rangeElem.remove();
                }
                function callback() {
                    if (!$rangeElem) {
                        return;
                    }
                    var $prev = $rangeElem.prev();
                    if ($prev.length) {
                        // �� prev ��λ�� prev ���
                        editor.restoreSelectionByElem($prev.get(0));
                    } else {
                        // �� prev ���ʼ��ѡ��
                        editor.initSelection();
                    }
                }

                $txt.on('keydown', function (e) {
                    if (e.keyCode !== 8) {
                        // ���� backspace ��
                        return;
                    }

                    var rangeElem = editor.getRangeElem();
                    rangeElem = editor.getSelfOrParentByName(rangeElem, 'blockquote');
                    if (!rangeElem) {
                        // ѡ������ quote
                        return;
                    }
                    $rangeElem = $(rangeElem);

                    var text = $rangeElem.text();
                    if (text) {
                        // quote �л�������
                        return;
                    }
                    editor.customCommand(e, commandFn, callback);

                }); // $txt.on
            }); // editor.ready(
        });

    });
// ���� �˵�
    _e(function (E, $) {

        E.createMenu(function (check) {
            var menuId = 'fontfamily';
            if (!check(menuId)) {
                return;
            }
            var editor = this;
            var lang = editor.config.lang;
            var configFamilys = editor.config.familys;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.fontfamily,
                commandName: 'fontName'
            });

            // ��ʼ������
            var data  = {};
            /*
             data ��Ҫ�Ľṹ
             {
             'commandValue': 'title'
             ...
             }
             */
            $.each(configFamilys, function (k, v) {
                // configFamilys �����飬data �Ƕ���
                data[v] = v;
            });

            // ����droplist
            var tpl = '<span style="font-family:{#commandValue};">{#title}</span>';
            menu.dropList = new E.DropList(editor, menu, {
                data: data,
                tpl: tpl,
                selectorForELemCommand: 'font[face]'  // Ϊ��ִ�� editor.commandForElem �������elem��ѯ��ʽ
            });

            // ���� update selected �¼�
            menu.updateSelectedEvent = function () {
                var rangeElem = editor.getRangeElem();
                rangeElem = editor.getSelfOrParentByName(rangeElem, 'font[face]');
                if (rangeElem) {
                    return true;
                }
                return false;
            };

            // ���ӵ�editor������
            editor.menus[menuId] = menu;
        });
    });
// �ֺ� �˵�
    _e(function (E, $) {
        E.createMenu(function (check) {
            var menuId = 'fontsize';
            if (!check(menuId)) {
                return;
            }
            var editor = this;
            var lang = editor.config.lang;
            var configSize = editor.config.fontsizes;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.fontsize,
                commandName: 'fontSize'
            });

            // ��ʼ������
            var data  = configSize;
            /*
             data ��Ҫ�Ľṹ
             {
             'commandValue': 'title'
             ...
             }
             */

            // ����droplist
            var tpl = '<span style="font-size:{#title};">{#title}</span>';
            menu.dropList = new E.DropList(editor, menu, {
                data: data,
                tpl: tpl,
                selectorForELemCommand: 'font[size]'  // Ϊ��ִ�� editor.commandForElem �������elem��ѯ��ʽ
            });

            // ���� update selected �¼�
            menu.updateSelectedEvent = function () {
                var rangeElem = editor.getRangeElem();
                rangeElem = editor.getSelfOrParentByName(rangeElem, 'font[size]');
                if (rangeElem) {
                    return true;
                }
                return false;
            };

            // ���ӵ�editor������
            editor.menus[menuId] = menu;
        });
    });
// head �˵�
    _e(function (E, $) {
        E.createMenu(function (check) {
            var menuId = 'head';
            if (!check(menuId)) {
                return;
            }
            var editor = this;
            var lang = editor.config.lang;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.head,
                commandName: 'formatBlock'
            });

            // ��ʼ������
            var data  = {
                '<h1>': '����1',
                '<h2>': '����2',
                '<h3>': '����3',
                '<h4>': '����4',
                '<h5>': '����5'
            };
            /*
             data ��Ҫ�Ľṹ
             {
             'commandValue': 'title'
             ...
             }
             */

            var isOrderedList;
            function beforeEvent(e) {
                if (editor.queryCommandState('InsertOrderedList')) {
                    isOrderedList = true;

                    // ��ȡ�������б�
                    editor.command(e, 'InsertOrderedList');
                } else {
                    isOrderedList = false;
                }
            }

            function afterEvent(e) {
                if (isOrderedList) {
                    // �����������б�
                    editor.command(e, 'InsertOrderedList');
                }
            }

            // ����droplist
            var tpl = '{#commandValue}{#title}';
            menu.dropList = new E.DropList(editor, menu, {
                data: data,
                tpl: tpl,
                // �� ol ֱ������ head�������ÿ�� li �� index ����� 1 �����⣬���Ҫ��ȡ�� ol��Ȼ������ head������������� ol
                beforeEvent: beforeEvent,
                afterEvent: afterEvent
            });

            // ���� update selected �¼�
            menu.updateSelectedEvent = function () {
                var rangeElem = editor.getRangeElem();
                rangeElem = editor.getSelfOrParentByName(rangeElem, 'h1,h2,h3,h4,h5');
                if (rangeElem) {
                    return true;
                }
                return false;
            };

            // ���ӵ�editor������
            editor.menus[menuId] = menu;
        });
    });
// unorderlist �˵�
    _e(function (E, $) {

        E.createMenu(function (check) {
            var menuId = 'unorderlist';
            if (!check(menuId)) {
                return;
            }
            var editor = this;
            var lang = editor.config.lang;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.unorderlist,
                commandName: 'InsertUnorderedList'
            });

            // ���ӵ�editor������
            editor.menus[menuId] = menu;
        });

    });
// orderlist �˵�
    _e(function (E, $) {

        E.createMenu(function (check) {
            var menuId = 'orderlist';
            if (!check(menuId)) {
                return;
            }
            var editor = this;
            var lang = editor.config.lang;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.orderlist,
                commandName: 'InsertOrderedList'
            });

            // ���ӵ�editor������
            editor.menus[menuId] = menu;
        });

    });
// alignleft �˵�
    _e(function (E, $) {

        E.createMenu(function (check) {
            var menuId = 'alignleft';
            if (!check(menuId)) {
                return;
            }
            var editor = this;
            var lang = editor.config.lang;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.alignleft,
                commandName: 'JustifyLeft'
            });

            // ���� update selected �¼�
            menu.updateSelectedEvent = function () {
                var rangeElem = editor.getRangeElem();
                rangeElem = editor.getSelfOrParentByName(rangeElem, 'p,h1,h2,h3,h4,h5,li', function (elem) {
                    var cssText;
                    if (elem && elem.style && elem.style.cssText != null) {
                        cssText = elem.style.cssText;
                        if (cssText && /text-align:\s*left;/.test(cssText)) {
                            return true;
                        }
                    }
                    if ($(elem).attr('align') === 'left') {
                        // ff �У�����align-left֮�󣬻��� <p align="left">xxx</p>
                        return true;
                    }
                    return false;
                });
                if (rangeElem) {
                    return true;
                }
                return false;
            };

            // ���ӵ�editor������
            editor.menus[menuId] = menu;
        });

    });
// aligncenter �˵�
    _e(function (E, $) {

        E.createMenu(function (check) {
            var menuId = 'aligncenter';
            if (!check(menuId)) {
                return;
            }
            var editor = this;
            var lang = editor.config.lang;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.aligncenter,
                commandName: 'JustifyCenter'
            });

            // ���� update selected �¼�
            menu.updateSelectedEvent = function () {
                var rangeElem = editor.getRangeElem();
                rangeElem = editor.getSelfOrParentByName(rangeElem, 'p,h1,h2,h3,h4,h5,li', function (elem) {
                    var cssText;
                    if (elem && elem.style && elem.style.cssText != null) {
                        cssText = elem.style.cssText;
                        if (cssText && /text-align:\s*center;/.test(cssText)) {
                            return true;
                        }
                    }
                    if ($(elem).attr('align') === 'center') {
                        // ff �У�����align-center֮�󣬻��� <p align="center">xxx</p>
                        return true;
                    }
                    return false;
                });
                if (rangeElem) {
                    return true;
                }
                return false;
            };

            // ���ӵ�editor������
            editor.menus[menuId] = menu;
        });

    });
// alignright �˵�
    _e(function (E, $) {

        E.createMenu(function (check) {
            var menuId = 'alignright';
            if (!check(menuId)) {
                return;
            }
            var editor = this;
            var lang = editor.config.lang;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.alignright,
                commandName: 'JustifyRight'
            });

            // ���� update selected �¼�
            menu.updateSelectedEvent = function () {
                var rangeElem = editor.getRangeElem();
                rangeElem = editor.getSelfOrParentByName(rangeElem, 'p,h1,h2,h3,h4,h5,li', function (elem) {
                    var cssText;
                    if (elem && elem.style && elem.style.cssText != null) {
                        cssText = elem.style.cssText;
                        if (cssText && /text-align:\s*right;/.test(cssText)) {
                            return true;
                        }
                    }
                    if ($(elem).attr('align') === 'right') {
                        // ff �У�����align-right֮�󣬻��� <p align="right">xxx</p>
                        return true;
                    }
                    return false;
                });
                if (rangeElem) {
                    return true;
                }
                return false;
            };

            // ���ӵ�editor������
            editor.menus[menuId] = menu;
        });

    });
// link �˵�
    _e(function (E, $) {

        E.createMenu(function (check) {
            var menuId = 'link';
            if (!check(menuId)) {
                return;
            }
            var editor = this;
            var lang = editor.config.lang;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.link
            });

            // ���� dropPanel
            var $content = $('<div></div>');
            var $div1 = $('<div style="margin:20px 10px;" class="clearfix"></div>');
            var $div2 = $div1.clone();
            var $div3 = $div1.clone().css('margin', '0 10px');
            var $textInput = $('<input type="text" class="block" placeholder="' + lang.text + '"/>');
            var $urlInput = $('<input type="text" class="block" placeholder="' + lang.link + '"/>');
            var $btnSubmit = $('<button class="right">' + lang.submit + '</button>');
            var $btnCancel = $('<button class="right gray">' + lang.cancel + '</button>');

            $div1.append($textInput);
            $div2.append($urlInput);
            $div3.append($btnSubmit).append($btnCancel);
            $content.append($div1).append($div2).append($div3);

            menu.dropPanel = new E.DropPanel(editor, menu, {
                $content: $content,
                width: 300
            });

            // ����click�¼�
            menu.clickEvent = function (e) {
                var menu = this;
                var dropPanel = menu.dropPanel;

                // -------------����----------------
                if (dropPanel.isShowing) {
                    dropPanel.hide();
                    return;
                }

                // -------------��ʾ----------------

                // ���� input
                $textInput.val('');
                $urlInput.val('http://');

                // ��ȡurl
                var url = '';
                var rangeElem = editor.getRangeElem();
                rangeElem = editor.getSelfOrParentByName(rangeElem, 'a');
                if (rangeElem) {
                    url = rangeElem.href || '';
                }

                // ��ȡ text
                var text = '';
                var isRangeEmpty = editor.isRangeEmpty();
                if (!isRangeEmpty) {
                    // ѡ�����ǿ�
                    text = editor.getRangeText() || '';
                } else if (rangeElem) {
                    // ���ѡ���գ������� a ��ǩ֮��
                    text = rangeElem.textContent || rangeElem.innerHTML;
                }

                // ���� url �� text
                url && $urlInput.val(url);
                text && $textInput.val(text);

                // �����ѡ�����ݣ�textinput �����޸�
                if (!isRangeEmpty) {
                    $textInput.attr('disabled', true);
                } else {
                    $textInput.removeAttr('disabled');
                }

                // ��ʾ��Ҫ���ú�������input��ֵ������֮������ʾ��
                dropPanel.show();
            };

            // ���� update selected �¼�
            menu.updateSelectedEvent = function () {
                var rangeElem = editor.getRangeElem();
                rangeElem = editor.getSelfOrParentByName(rangeElem, 'a');
                if (rangeElem) {
                    return true;
                }
                return false;
            };

            // ��ȡ���� ��ť
            $btnCancel.click(function (e) {
                e.preventDefault();
                menu.dropPanel.hide();
            });

            // ��ȷ������ť
            $btnSubmit.click(function (e) {
                e.preventDefault();
                var rangeElem = editor.getRangeElem();
                var targetElem = editor.getSelfOrParentByName(rangeElem, 'a');
                var isRangeEmpty = editor.isRangeEmpty();

                var $linkElem, linkHtml;
                var commandFn, callback;
                var $txt = editor.txt.$txt;
                var $oldLinks, $newLinks;
                var uniqId = 'link' + E.random();

                // ��ȡ����
                var url = $.trim($urlInput.val());
                var text = $.trim($textInput.val());

                if (!url) {
                    menu.dropPanel.focusFirstInput();
                    return;
                }
                if (!text) {
                    text = url;
                }

                if (!isRangeEmpty) {
                    // ѡ�����������ݣ���ִ��Ĭ������

                    // ��ȡĿǰ txt ���������ӣ���Ϊ��ǰ������һ�����
                    $oldLinks = $txt.find('a');
                    $oldLinks.attr(uniqId, '1');

                    // ִ������ 
                    editor.command(e, 'createLink', url);

                    // ȥ��û�б�ǵ����ӣ����ող��������
                    $newLinks = $txt.find('a').not('[' + uniqId + ']');
                    $newLinks.attr('target', '_blank'); // ���� _blank

                    // ȥ��֮ǰ���ı��
                    $oldLinks.removeAttr(uniqId);

                } else if (targetElem) {
                    // ��ѡ�������� a ��ǩ֮�ڣ��޸ĸ� a ��ǩ�����ݺ�����
                    $linkElem = $(targetElem);
                    commandFn = function () {
                        $linkElem.attr('href', url);
                        $linkElem.text(text);
                    };
                    callback = function () {
                        var editor = this;
                        editor.restoreSelectionByElem(targetElem);
                    };
                    // ִ������
                    editor.customCommand(e, commandFn, callback);
                } else {
                    // ��ѡ�����򣬲��� a ��ǩ֮�ڣ������µ�����

                    linkHtml = '<a href="' + url + '" target="_blank">' + text + '</a>';
                    if (E.userAgent.indexOf('Firefox') > 0) {
                        linkHtml += '<span>&nbsp;</span>';
                    }
                    editor.command(e, 'insertHtml', linkHtml);
                }

            });

            // ���ӵ�editor������
            editor.menus[menuId] = menu;
        });

    });
// unlink �˵�
    _e(function (E, $) {

        E.createMenu(function (check) {
            var menuId = 'unlink';
            if (!check(menuId)) {
                return;
            }
            var editor = this;
            var lang = editor.config.lang;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.unlink,
                commandName: 'unLink'
            });

            // click �¼�
            menu.clickEvent = function  (e) {
                var isRangeEmpty = editor.isRangeEmpty();
                if (!isRangeEmpty) {
                    // ��ѡ�����򣬻���IE8��ִ��Ĭ������
                    editor.command(e, 'unLink');
                    return;
                }

                // ��ѡ������...

                var rangeElem = editor.getRangeElem();
                var aElem = editor.getSelfOrParentByName(rangeElem, 'a');
                if (!aElem) {
                    // ���� a ֮�ڣ�����
                    e.preventDefault();
                    return;
                }

                // �� a ֮��
                var $a = $(aElem);
                var $span = $('<span>' + $a.text() + '</span>');
                function commandFn() {
                    $a.after($span).remove();
                }
                function callback() {
                    editor.restoreSelectionByElem($span.get(0));
                }
                editor.customCommand(e, commandFn, callback);
            };

            // ���ӵ�editor������
            editor.menus[menuId] = menu;
        });

    });
// table �˵�
    _e(function (E, $) {

        E.createMenu(function (check) {
            var menuId = 'table';
            if (!check(menuId)) {
                return;
            }
            var editor = this;
            var lang = editor.config.lang;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.table
            });

            // dropPanel ����
            var $content = $('<div style="font-size: 14px; color: #666; text-align:right;"></div>');
            var $table = $('<table class="choose-table" style="margin-bottom:10px;margin-top:5px;">');
            var $row = $('<span>0</span>');
            var $rowspan = $('<span> �� </span>');
            var $col = $('<span>0</span>');
            var $colspan = $('<span> ��</span>');
            var $tr;
            var i, j;

            // ����һ��n��n�еı��
            for (i = 0; i < 15; i++) {
                $tr = $('<tr index="' + (i + 1) + '">');
                for (j = 0; j < 20; j++) {
                    $tr.append($('<td index="' + (j + 1) + '">'));
                }
                $table.append($tr);
            }
            $content.append($table);
            $content.append($row).append($rowspan).append($col).append($colspan);

            // ����table�¼�
            $table.on('mouseenter', 'td', function (e) {
                var $currentTd = $(e.currentTarget);
                var currentTdIndex = $currentTd.attr('index');
                var $currentTr = $currentTd.parent();
                var currentTrIndex = $currentTr.attr('index');

                // ��ʾ
                $row.text(currentTrIndex);
                $col.text(currentTdIndex);

                // �������ñ�����ɫ
                $table.find('tr').each(function () {
                    var $tr = $(this);
                    var trIndex = $tr.attr('index');
                    if (parseInt(trIndex, 10) <= parseInt(currentTrIndex, 10)) {
                        // ������Ҫ������Ҫ���ñ���ɫ
                        $tr.find('td').each(function () {
                            var $td = $(this);
                            var tdIndex = $td.attr('index');
                            if (parseInt(tdIndex, 10) <= parseInt(currentTdIndex, 10)) {
                                // ��Ҫ���ñ���ɫ
                                $td.addClass('active');
                            } else {
                                // ��Ҫ�Ƴ�����ɫ
                                $td.removeClass('active');
                            }
                        });
                    } else {
                        // ���в���Ҫ���ñ���ɫ
                        $tr.find('td').removeClass('active');
                    }
                });
            }).on('mouseleave', function (e) {
                // mouseleave ɾ������ɫ
                $table.find('td').removeClass('active');

                $row.text(0);
                $col.text(0);
            });

            // ������
            $table.on('click', 'td', function (e) {
                var $currentTd = $(e.currentTarget);
                var currentTdIndex = $currentTd.attr('index');
                var $currentTr = $currentTd.parent();
                var currentTrIndex = $currentTr.attr('index');

                var rownum = parseInt(currentTrIndex, 10);
                var colnum = parseInt(currentTdIndex, 10);

                // -------- ƴ��tabel html --------

                var i, j;
                var tableHtml = '<table>';
                for (i = 0; i < rownum; i++) {
                    tableHtml += '<tr>';

                    for (j = 0; j < colnum; j++) {
                        tableHtml += '<td><span>&nbsp;</span></td>';
                    }
                    tableHtml += '</tr>';
                }
                tableHtml += '</table>';

                // -------- ִ������ --------
                editor.command(e, 'insertHtml', tableHtml);
            });

            // ���� panel
            menu.dropPanel = new E.DropPanel(editor, menu, {
                $content: $content,
                width: 262
            });

            // ���ӵ�editor������
            editor.menus[menuId] = menu;
        });

    });
// emotion �˵�
    _e(function (E, $) {

        E.createMenu(function (check) {
            var menuId = 'emotion';
            if (!check(menuId)) {
                return;
            }
            var editor = this;
            var config = editor.config;
            var lang = config.lang;
            var configEmotions = config.emotions;
            var emotionsShow = config.emotionsShow;

            // ��¼ÿһ������ͼƬ�ĵ�ַ
            editor.emotionUrls = [];

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.emotion
            });

            // ��ӱ���ͼƬ�ĺ���
            function insertEmotionImgs(data, $tabContent) {
                // ��ӱ���ͼƬ
                $.each(data, function (k, emotion) {
                    var src = emotion.icon || emotion.url;
                    var value = emotion.value || emotion.title;
                    // ͨ������ editor.config.emotionsShow ��ֵ���޸Ĳ��뵽�༭�������ݣ�ͼƬ/value��
                    var commandValue = emotionsShow === 'icon' ? src : value;
                    var $command = $('<a href="#" commandValue="' + commandValue + '"></a>');
                    var $img = $('<img>');
                    $img.attr('_src', src);  // �Ƚ� src ���Ƶ� '_src' ���ԣ��Ȳ�����

                    $command.append($img);
                    $tabContent.append($command);

                    // ��¼��ÿһ������ͼƬ�ĵ�ַ
                    editor.emotionUrls.push(src);
                });
            }

            // ƴ�� dropPanel ����
            var $panelContent = $('<div class="panel-tab"></div>');
            var $tabContainer = $('<div class="tab-container"></div>');
            var $contentContainer = $('<div class="content-container emotion-content-container"></div>');
            $.each(configEmotions, function (k, emotion) {
                var title = emotion.title;
                var data = emotion.data;

                E.log('���ڴ��� ' + title + ' ���������...');

                // ���Ӹ�������tab��content
                var $tab = $('<a href="#">' + title +' </a>');
                $tabContainer.append($tab);
                var $tabContent = $('<div class="content"></div>');
                $contentContainer.append($tabContent);

                // tab �л��¼�
                $tab.click(function (e) {
                    $tabContainer.children().removeClass('selected');
                    $contentContainer.children().removeClass('selected');
                    $tabContent.addClass('selected');
                    $tab.addClass('selected');
                    e.preventDefault();
                });

                // ����data
                if (typeof data === 'string') {
                    // url ��ʽ����Ҫͨ��ajax�Ӹ�url��ȡ����
                    E.log('��ͨ�� ' + data + ' ��ַajax���ر����');
                    $.get(data, function (result) {
                        result = $.parseJSON(result);
                        E.log('������ϣ��õ� ' + result.length + ' ������');
                        insertEmotionImgs(result, $tabContent);
                    });

                } else if ( Object.prototype.toString.call(data).toLowerCase().indexOf('array') > 0 ) {
                    // ���飬�� data ֱ�Ӿ��Ǳ��������
                    insertEmotionImgs(data, $tabContent);
                } else {
                    // ���������data��ʽ����
                    E.error('data ���ݸ�ʽ�������޸�Ϊ��ȷ��ʽ���ο��ĵ���' + E.docsite);
                    return;
                }
            });
            $panelContent.append($tabContainer).append($contentContainer);

            // Ĭ����ʾ��һ��tab
            $tabContainer.children().first().addClass('selected');
            $contentContainer.children().first().addClass('selected');

            // �������command�¼�
            $contentContainer.on('click', 'a[commandValue]', function (e) {
                var $a = $(e.currentTarget);
                var commandValue = $a.attr('commandValue');
                var img;

                // commandValue �п�����ͼƬurl��Ҳ�п����Ǳ���� value����Ҫ����Դ�

                if (emotionsShow === 'icon') {
                    // ����ͼƬ
                    editor.command(e, 'InsertImage', commandValue);
                } else {
                    // ����value
                    editor.command(e, 'insertHtml', '<span>' + commandValue + '</span>');
                }

                e.preventDefault();
            });

            // ���panel
            menu.dropPanel = new E.DropPanel(editor, menu, {
                $content: $panelContent,
                width: 350
            });

            // ����click�¼����첽���ر���ͼƬ��
            menu.clickEvent = function (e) {
                var menu = this;
                var dropPanel = menu.dropPanel;

                // -------------����-------------
                if (dropPanel.isShowing) {
                    dropPanel.hide();
                    return;
                }

                // -------------��ʾ-------------
                dropPanel.show();

                // �첽����ͼƬ
                if (menu.imgLoaded) {
                    return;
                }
                $contentContainer.find('img').each(function () {
                    var $img = $(this);
                    var _src = $img.attr('_src');
                    $img.on('error', function () {
                        E.error('���ز�������ͼƬ ' + _src);
                    });
                    $img.attr('src', _src);
                    $img.removeAttr('_src');
                });
                menu.imgLoaded = true;
            };

            // ���ӵ�editor������
            editor.menus[menuId] = menu;
        });

    });
// img �˵�
    _e(function (E, $) {

        E.createMenu(function (check) {
            var menuId = 'img';
            if (!check(menuId)) {
                return;
            }
            var editor = this;
            var lang = editor.config.lang;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.img
            });

            // ���� panel content
            var $panelContent = $('<div class="panel-tab"></div>');
            var $tabContainer = $('<div class="tab-container"></div>');
            var $contentContainer = $('<div class="content-container"></div>');
            $panelContent.append($tabContainer).append($contentContainer);

            // tab
            var $uploadTab = $('<a href="#">�ϴ�ͼƬ</a>');
            var $linkTab = $('<a href="#">����ͼƬ</a>');
            $tabContainer.append($uploadTab).append($linkTab);

            // �ϴ�ͼƬ content
            var $uploadContent = $('<div class="content"></div>');
            $contentContainer.append($uploadContent);

            // ����ͼƬ content
            var $linkContent = $('<div class="content"></div>');
            $contentContainer.append($linkContent);
            linkContentHandler(editor, menu, $linkContent);

            // ���panel
            menu.dropPanel = new E.DropPanel(editor, menu, {
                $content: $panelContent,
                width: 400,
                onRender: function () {
                    // ��Ⱦ��Ļص��¼�������ִ���Զ����ϴ���init
                    // ��Ϊ��Ⱦ֮���ϴ�����dom�Żᱻ��Ⱦ��ҳ�棬�����õ������ռ��ȡ��
                    var init = editor.config.customUploadInit;
                    init && init.call(editor);
                }
            });

            // ���ӵ�editor������
            editor.menus[menuId] = menu;

            // tab �л��¼�
            function tabToggle() {
                $uploadTab.click(function (e) {
                    $tabContainer.children().removeClass('selected');
                    $contentContainer.children().removeClass('selected');
                    $uploadContent.addClass('selected');
                    $uploadTab.addClass('selected');
                    e.preventDefault();
                });
                $linkTab.click(function (e) {
                    $tabContainer.children().removeClass('selected');
                    $contentContainer.children().removeClass('selected');
                    $linkContent.addClass('selected');
                    $linkTab.addClass('selected');
                    e.preventDefault();

                    // focus input
                    if (E.placeholder) {
                        $linkContent.find('input[type=text]').focus();
                    }
                });

                // Ĭ�����
                // $uploadTab.addClass('selected');
                // $uploadContent.addClass('selected');
                $uploadTab.click();
            }

            // �����ϴ�ͼƬ
            function hideUploadImg() {
                $tabContainer.remove();
                $uploadContent.remove();
                $linkContent.addClass('selected');
            }

            // ��������ͼƬ
            function hideLinkImg() {
                $tabContainer.remove();
                $linkContent.remove();
                $uploadContent.addClass('selected');
            }

            // �ж��û��Ƿ��������ϴ�ͼƬ
            editor.ready(function () {
                var editor = this;
                var config = editor.config;
                var uploadImgUrl = config.uploadImgUrl;
                var customUpload = config.customUpload;
                var linkImg = config.hideLinkImg;
                var $uploadImgPanel;

                if (uploadImgUrl || customUpload) {
                    // ��һ����¶�� $uploadContent �Ա��û��Զ��� ��������Ҫ
                    editor.$uploadContent = $uploadContent;

                    // �ڶ�����tab�л��¼�
                    tabToggle();

                    if (linkImg) {
                        // ��������ͼƬ
                        hideLinkImg();
                    }
                } else {
                    // δ�����ϴ�ͼƬ����
                    hideUploadImg();
                }

                // ��� $uploadContent �������� dropPanel
                // Ϊ�˼���IE8��9���ϴ�����ΪIE8��9ʹ�� modal �ϴ�
                // ����ʹ���첽��Ϊ�˲������߼������ͨ����� $uploadContent ѡ���ļ�
                function hidePanel() {
                    menu.dropPanel.hide();
                }
                $uploadContent.click(function () {
                    setTimeout(hidePanel);
                });
            });
        });

        // --------------- ��������ͼƬcontent ---------------
        function linkContentHandler (editor, menu, $linkContent) {
            var lang = editor.config.lang;
            var $urlContainer = $('<div style="margin:20px 10px 10px 10px;"></div>');
            var $urlInput = $('<input type="text" class="block" placeholder="http://"/>');
            $urlContainer.append($urlInput);
            var $btnSubmit = $('<button class="right">' + lang.submit + '</button>');
            var $btnCancel = $('<button class="right gray">' + lang.cancel + '</button>');

            $linkContent.append($urlContainer).append($btnSubmit).append($btnCancel);

            // ȡ��
            $btnCancel.click(function (e) {
                e.preventDefault();
                menu.dropPanel.hide();
            });

            // callback 
            function callback() {
                $urlInput.val('');
            }

            // ȷ��
            $btnSubmit.click(function (e) {
                e.preventDefault();
                var url = $.trim($urlInput.val());
                if (!url) {
                    // ������
                    $urlInput.focus();
                    return;
                }

                var imgHtml = '<img style="width:100%;" src="' + url + '"/>';
                editor.command(e, 'insertHtml', imgHtml, callback);
            });
        }

    });
// video �˵�
    _e(function (E, $) {

        E.createMenu(function (check) {
            var menuId = 'video';
            if (!check(menuId)) {
                return;
            }
            var editor = this;
            var lang = editor.config.lang;
            var reg = /^<(iframe)|(embed)/i;  // <iframe... ���� <embed... ��ʽ

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.video
            });

            // ���� panel ����
            var $content = $('<div></div>');
            var $linkInputContainer = $('<div style="margin:20px 10px;"></div>');
            var $linkInput = $('<input type="text" class="block" placeholder=\'��ʽ�磺<iframe src="..." frameborder=0 allowfullscreen></iframe>\'/>');
            $linkInputContainer.append($linkInput);
            var $sizeContainer = $('<div style="margin:20px 10px;"></div>');
            var $widthInput = $('<input type="text" value="640" style="width:50px;text-align:center;"/>');
            var $heightInput = $('<input type="text" value="498" style="width:50px;text-align:center;"/>');
            $sizeContainer.append('<span> ' + lang.width + ' </span>')
                .append($widthInput)
                .append('<span> px &nbsp;&nbsp;&nbsp;</span>')
                .append('<span> ' + lang.height + ' </span>')
                .append($heightInput)
                .append('<span> px </span>');
            var $btnContainer = $('<div></div>');
            var $howToCopy = $('<a href="http://www.kancloud.cn/wangfupeng/wangeditor2/134973" target="_blank" style="display:inline-block;margin-top:10px;margin-left:10px;color:#999;">��θ�����Ƶ���ӣ�</a>');
            var $btnSubmit = $('<button class="right">' + lang.submit + '</button>');
            var $btnCancel = $('<button class="right gray">' + lang.cancel + '</button>');
            $btnContainer.append($howToCopy).append($btnSubmit).append($btnCancel);
            $content.append($linkInputContainer).append($sizeContainer).append($btnContainer);

            // ȡ����ť
            $btnCancel.click(function (e) {
                e.preventDefault();
                $linkInput.val('');
                menu.dropPanel.hide();
            });

            // ȷ����ť
            $btnSubmit.click(function (e) {
                e.preventDefault();
                var link = $.trim($linkInput.val());
                var $link;
                var width = parseInt($widthInput.val());
                var height = parseInt($heightInput.val());
                var $div = $('<div>');
                var html = '<p>{content}</p>';

                // ��֤����
                if (!link) {
                    menu.dropPanel.focusFirstInput();
                    return;
                }

                if (!reg.test(link)) {
                    alert('��Ƶ���Ӹ�ʽ����');
                    menu.dropPanel.focusFirstInput();
                    return;
                }

                if (isNaN(width) || isNaN(height)) {
                    alert('��Ȼ�߶Ȳ������֣�');
                    return;
                }

                $link = $(link);

                // ���ø߶ȺͿ��
                $link.attr('width', width)
                    .attr('height', height);

                // ƴ���ַ���
                html = html.replace('{content}', $div.append($link).html());

                // ִ������
                editor.command(e, 'insertHtml', html);
                $linkInput.val('');
            });

            // ����panel
            menu.dropPanel = new E.DropPanel(editor, menu, {
                $content: $content,
                width: 400
            });

            // ���ӵ�editor������
            editor.menus[menuId] = menu;
        });

    });
// location �˵�
    _e(function (E, $) {

        // �ж�������� input �Ƿ�֧�� keyup
        var inputKeyup = (function (input) {
            return 'onkeyup' in input;
        })(document.createElement('input'));

        // �ٶȵ�ͼ��key
        E.baiduMapAk = 'TVhjYjq1ICT2qqL5LdS8mwas';

        // һ��ҳ���У�����ж���༭������ͼ��������⡣���������¼һ�£�������� 1 ����ʾ
        E.numberOfLocation = 0;

        E.createMenu(function (check) {
            var menuId = 'location';
            if (!check(menuId)) {
                return;
            }

            if (++E.numberOfLocation > 1) {
                E.error('Ŀǰ��֧����һ��ҳ�����༭����ͬʱʹ�õ�ͼ����ͨ���Զ���˵�����ȥ����ͼ�˵�');
                return;
            }

            var editor = this;
            var config = editor.config;
            var lang = config.lang;
            var ak = config.mapAk;

            // ��ͼ�ı����洢������ط�
            editor.mapData = {};
            var mapData = editor.mapData;

            // ---------- ��ͼ�¼� ----------
            mapData.markers = [];
            mapData.mapContainerId = 'map' + E.random();

            mapData.clearLocations = function () {
                var map = mapData.map;
                if (!map) {
                    return;
                }
                map.clearOverlays();

                //ͬʱ�����marker����
                mapData.markers = [];
            };

            mapData.searchMap = function () {
                var map = mapData.map;
                if (!map) {
                    return;
                }

                var BMap = window.BMap;
                var cityName = $cityInput.val();
                var locationName = $searchInput.val();
                var myGeo, marker;

                if(cityName !== ''){
                    if(!locationName || locationName === ''){
                        map.centerAndZoom(cityName, 11);
                    }

                    //��ַ����
                    if(locationName && locationName !== ''){
                        myGeo = new BMap.Geocoder();
                        // ����ַ���������ʾ�ڵ�ͼ��,��������ͼ��Ұ
                        myGeo.getPoint(locationName, function(point){
                            if (point) {
                                map.centerAndZoom(point, 13);
                                marker = new BMap.Marker(point);
                                map.addOverlay(marker);
                                marker.enableDragging();  //������ק
                                mapData.markers.push(marker);  //��marker���뵽������
                            }else{
                                // alert('δ�ҵ�');
                                map.centerAndZoom(cityName, 11);  //�Ҳ��������¶�λ������
                            }
                        }, cityName);
                    }
                } // if(cityName !== '')
            };

            // load script ֮��� callback
            var hasCallback = false;
            window.baiduMapCallBack = function(){
                // �����ظ�����
                if (hasCallback) {
                    return;
                } else {
                    hasCallback = true;
                }

                var BMap = window.BMap;
                if (!mapData.map) {
                    // ����Mapʵ��
                    mapData.map = new BMap.Map(mapData.mapContainerId);
                }
                var map = mapData.map;

                map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // ��ʼ����ͼ,�������ĵ�����͵�ͼ����
                map.addControl(new BMap.MapTypeControl());   //��ӵ�ͼ���Ϳؼ�
                map.setCurrentCity("����");          // ���õ�ͼ��ʾ�ĳ��� �����Ǳ������õ�
                map.enableScrollWheelZoom(true);     //��������������

                //����IP��λ
                function locationFun(result){
                    var cityName = result.name;
                    map.setCenter(cityName);

                    // ���ó�������
                    $cityInput.val(cityName);
                    if (E.placeholder) {
                        $searchInput.focus();
                    }
                    var timeoutId, searchFn;
                    if (inputKeyup) {
                        // ���������¼� - input ֧�� keyup
                        searchFn = function (e) {
                            if (e.type === 'keyup' && e.keyCode === 13) {
                                e.preventDefault();
                            }
                            if (timeoutId) {
                                clearTimeout(timeoutId);
                            }
                            timeoutId = setTimeout(mapData.searchMap, 500);
                        };
                        $cityInput.on('keyup change paste', searchFn);
                        $searchInput.on('keyup change paste', searchFn);
                    } else {
                        // ���������¼� - input ��֧�� keyup
                        searchFn = function () {
                            if (!$content.is(':visible')) {
                                // panel ����ʾ�ˣ��Ͳ����ټ����
                                clearTimeout(timeoutId);
                                return;
                            }

                            var currentCity = '';
                            var currentSearch = '';
                            var city = $cityInput.val();
                            var search = $searchInput.val();

                            if (city !== currentCity || search !== currentSearch) {
                                // �ջ�ȡ�����ݺ�֮ǰ�����ݲ�һ�£�ִ�в�ѯ
                                mapData.searchMap();
                                // ��������
                                currentCity = city;
                                currentSearch = search;
                            }

                            // �������
                            if (timeoutId) {
                                clearTimeout(timeoutId);
                            }
                            timeoutId = setTimeout(searchFn, 1000);
                        };
                        // ��ʼ���
                        timeoutId = setTimeout(searchFn, 1000);
                    }
                }
                var myCity = new BMap.LocalCity();
                myCity.get(locationFun);

                //�����������λ��
                map.addEventListener("click", function(e){
                    var marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat));
                    map.addOverlay(marker);
                    marker.enableDragging();
                    mapData.markers.push(marker);  //���뵽������
                }, false);
            };

            mapData.loadMapScript = function () {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "https://api.map.baidu.com/api?v=2.0&ak=" + ak + "&s=1&callback=baiduMapCallBack";  // baiduMapCallBack��һ�����غ���
                try {
                    // IE10- ����
                    document.body.appendChild(script);
                } catch (ex) {
                    E.error('���ص�ͼ�����з�������');
                }
            };

            // ��ʼ����ͼ
            mapData.initMap = function () {
                if (window.BMap) {
                    // ���ǵ�һ�Σ�ֱ�Ӵ����ͼ����
                    window.baiduMapCallBack();
                } else {
                    // ��һ�Σ��ȼ��ص�ͼ script���ٴ����ͼ��script�������Զ�ִ�д���
                    mapData.loadMapScript();
                }
            };

            // ---------- ���� menu ���� ----------

            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.location
            });

            editor.menus[menuId] = menu;

            // ---------- ����UI ----------

            // panel content 
            var $content = $('<div></div>');

            // ������
            var $inputContainer = $('<div style="margin:10px 0;"></div>');
            var $cityInput = $('<input type="text"/>');
            $cityInput.css({
                width: '80px',
                'text-align': 'center'
            });
            var $searchInput = $('<input type="text"/>');
            $searchInput.css({
                width: '300px',
                'margin-left': '10px'
            }).attr('placeholder', lang.searchlocation);
            var $clearBtn = $('<button class="right link">' + lang.clearLocation + '</button>');
            $inputContainer.append($clearBtn)
                .append($cityInput)
                .append($searchInput);
            $content.append($inputContainer);

            // ���λ�ð�ť
            $clearBtn.click(function (e) {
                $searchInput.val('');
                $searchInput.focus();
                mapData.clearLocations();
                e.preventDefault();
            });

            // ��ͼ
            var $map = $('<div id="' + mapData.mapContainerId + '"></div>');
            $map.css({
                height: '260px',
                width: '100%',
                position: 'relative',
                'margin-top': '10px',
                border: '1px solid #f1f1f1'
            });
            var $mapLoading = $('<span>' + lang.loading + '</span>');
            $mapLoading.css({
                position: 'absolute',
                width: '100px',
                'text-align': 'center',
                top: '45%',
                left: '50%',
                'margin-left': '-50px'
            });
            $map.append($mapLoading);
            $content.append($map);

            // ��ť
            var $btnContainer = $('<div style="margin:10px 0;"></div>');
            var $btnSubmit = $('<button class="right">' + lang.submit + '</button>');
            var $btnCancel = $('<button class="right gray">' + lang.cancel + '</button>');
            var $checkLabel = $('<label style="display:inline-block;margin-top:10px;color:#666;"></label>');
            var $check = $('<input type="checkbox">');
            $checkLabel.append($check).append('<span style="display:inline-block;margin-left:5px;">  ' + lang.dynamicMap + '</span>');
            $btnContainer.append($checkLabel)
                .append($btnSubmit)
                .append($btnCancel);
            $content.append($btnContainer);

            function callback() {
                $searchInput.val('');
            }

            // ��ȡ������ť�¼�
            $btnCancel.click(function (e) {
                e.preventDefault();
                callback();
                menu.dropPanel.hide();
            });

            // ��ȷ������ť�¼�
            $btnSubmit.click(function (e) {
                e.preventDefault();
                var map = mapData.map,
                    isDynamic = $check.is(':checked'),
                    markers =  mapData.markers,

                    center = map.getCenter(),
                    centerLng = center.lng,
                    centerLat = center.lat,

                    zoom = map.getZoom(),

                    size = map.getSize(),
                    sizeWidth = size.width,
                    sizeHeight = size.height,

                    position,
                    src,
                    iframe;

                if(isDynamic){
                    //��̬��ַ
                    src = 'http://ueditor.baidu.com/ueditor/dialogs/map/show.html#';
                }else{
                    //��̬��ַ
                    src = 'http://api.map.baidu.com/staticimage?';
                }

                //src����
                src = src +'center=' + centerLng + ',' + centerLat +
                    '&zoom=' + zoom +
                    '&width=' + sizeWidth +
                    '&height=' + sizeHeight;
                if(markers.length > 0){
                    src = src + '&markers=';

                    //������е�marker
                    $.each(markers, function(key, value){
                        position = value.getPosition();
                        if(key > 0){
                            src = src + '|';
                        }
                        src = src + position.lng + ',' + position.lat;
                    });
                }

                if(isDynamic){
                    if(markers.length > 1){
                        alert( lang.langDynamicOneLocation );
                        return;
                    }

                    src += '&markerStyles=l,A';

                    //����iframe
                    iframe = '<iframe class="ueditor_baidumap" src="{src}" frameborder="0" width="' + sizeWidth + '" height="' + sizeHeight + '"></iframe>';
                    iframe = iframe.replace('{src}', src);
                    editor.command(e, 'insertHtml', iframe, callback);
                }else{
                    //����ͼƬ
                    editor.command(e, 'insertHtml', '<img style="width:100%;" src="' + src + '"/>', callback);
                }
            });

            // ���� UI �����˵� panel
            menu.dropPanel = new E.DropPanel(editor, menu, {
                $content: $content,
                width: 500
            });

            // ---------- �¼� ----------

            // render ʱִ���¼�
            menu.onRender = function () {
                if (ak === E.baiduMapAk) {
                    E.warn('�������������Զ���ٶȵ�ͼ��mapAk���������Ӱ���ͼ���ܣ��ĵ���' + E.docsite);
                }
            };

            // click �¼�
            menu.clickEvent = function (e) {
                var menu = this;
                var dropPanel = menu.dropPanel;
                var firstTime = false;

                // -------------����-------------
                if (dropPanel.isShowing) {
                    dropPanel.hide();
                    return;
                }

                // -------------��ʾ-------------
                if (!mapData.map) {
                    // ��һ�Σ��ȼ��ص�ͼ
                    firstTime = true;
                }

                dropPanel.show();
                mapData.initMap();

                if (!firstTime) {
                    $searchInput.focus();
                }
            };

        });

    });
// insertcode �˵�
    _e(function (E, $) {

        // ���� highlightjs ����
        function loadHljs() {
            if (E.userAgent.indexOf('MSIE 8') > 0) {
                // ��֧�� IE8
                return;
            }
            if (window.hljs) {
                // ��Ҫ�ظ�����
                return;
            }
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "//cdn.bootcss.com/highlight.js/9.2.0/highlight.min.js";
            document.body.appendChild(script);
        }


        E.createMenu(function (check) {
            var menuId = 'insertcode';
            if (!check(menuId)) {
                return;
            }

            // ���� highlightjs ����
            setTimeout(loadHljs, 0);

            var editor = this;
            var config = editor.config;
            var lang = config.lang;
            var $txt = editor.txt.$txt;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.insertcode
            });

            // click �¼�
            menu.clickEvent = function (e) {
                var menu = this;
                var dropPanel = menu.dropPanel;

                // ����
                if (dropPanel.isShowing) {
                    dropPanel.hide();
                    return;
                }

                // ��ʾ
                $textarea.val('');
                dropPanel.show();

                // highlightjs �����б�
                var hljs = window.hljs;
                if (hljs && hljs.listLanguages) {
                    if ($langSelect.children().length !== 0) {
                        return;
                    }
                    $langSelect.css({
                        'margin-top': '9px',
                        'margin-left': '5px'
                    });
                    $.each(hljs.listLanguages(), function (key, lang) {
                        if (lang === 'xml') {
                            lang = 'html';
                        }
                        if (lang === config.codeDefaultLang) {
                            $langSelect.append('<option value="' + lang + '" selected="selected">' + lang + '</option>');
                        } else {
                            $langSelect.append('<option value="' + lang + '">' + lang + '</option>');
                        }
                    });
                } else {
                    $langSelect.hide();
                }
            };

            // ѡ��״̬�µ� click �¼�
            menu.clickEventSelected = function (e) {
                var menu = this;
                var dropPanel = menu.dropPanel;

                // ����
                if (dropPanel.isShowing) {
                    dropPanel.hide();
                    return;
                }

                // ��ʾ
                dropPanel.show();

                var rangeElem = editor.getRangeElem();
                var targetElem = editor.getSelfOrParentByName(rangeElem, 'pre');
                var $targetElem;
                var className;
                if (targetElem) {
                    // ȷ���ҵ� pre ֮������ code
                    targetElem = editor.getSelfOrParentByName(rangeElem, 'code');
                }
                if (!targetElem) {
                    return;
                }
                $targetElem = $(targetElem);

                // ��ֵ����
                $textarea.val($targetElem.text());
                if ($langSelect) {
                    // ��ֵ����
                    className = $targetElem.attr('class');
                    if (className) {
                        $langSelect.val(className.split(' ')[0]);
                    }
                }
            };

            // �������ѡ��״̬���¼�
            menu.updateSelectedEvent = function () {
                var self = this; //�˵�����
                var editor = self.editor;
                var rangeElem;

                rangeElem = editor.getRangeElem();
                rangeElem = editor.getSelfOrParentByName(rangeElem, 'pre');

                if (rangeElem) {
                    return true;
                }

                return false;
            };

            // ���� panel
            var $content = $('<div></div>');
            var $textarea = $('<textarea></textarea>');
            var $langSelect = $('<select></select>');
            contentHandle($content);
            menu.dropPanel = new E.DropPanel(editor, menu, {
                $content: $content,
                width: 500
            });

            // ���ӵ�editor������
            editor.menus[menuId] = menu;

            // ------ ���� content ���� ------
            function contentHandle($content) {
                // textarea ����
                var $textareaContainer = $('<div></div>');
                $textareaContainer.css({
                    margin: '15px 5px 5px 5px',
                    height: '160px',
                    'text-align': 'center'
                });
                $textarea.css({
                    width: '100%',
                    height: '100%',
                    padding: '10px'
                });
                $textarea.on('keydown', function (e) {
                    // ȡ�� tab ��Ĭ����Ϊ
                    if (e.keyCode === 9) {
                        e.preventDefault();
                    }
                });
                $textareaContainer.append($textarea);
                $content.append($textareaContainer);

                // ��ť����
                var $btnContainer = $('<div></div>');
                var $btnSubmit = $('<button class="right">' + lang.submit + '</button>');
                var $btnCancel = $('<button class="right gray">' + lang.cancel + '</button>');

                $btnContainer.append($btnSubmit).append($btnCancel).append($langSelect);
                $content.append($btnContainer);

                // ȡ����ť
                $btnCancel.click(function (e) {
                    e.preventDefault();
                    menu.dropPanel.hide();
                });

                // ȷ����ť
                var codeTpl = '<pre style="max-width:100%;overflow-x:auto;"><code{#langClass}>{#content}</code></pre>';
                $btnSubmit.click(function (e) {
                    e.preventDefault();
                    var val = $textarea.val();
                    if (!val) {
                        // ������
                        $textarea.focus();
                        return;
                    }

                    var rangeElem = editor.getRangeElem();
                    if ($.trim($(rangeElem).text()) && codeTpl.indexOf('<p><br></p>') !== 0) {
                        codeTpl = '<p><br></p>' + codeTpl;
                    }

                    var lang = $langSelect ? $langSelect.val() : ''; // ��ȡ��������
                    var langClass = '';
                    var doHightlight = function () {
                        $txt.find('pre code').each(function (i, block) {
                            var $block = $(block);
                            if ($block.attr('codemark')) {
                                // �� codemark ��ǵĴ���飬�Ͳ������¸�ʽ����
                                return;
                            } else if (window.hljs) {
                                // �´���飬��ʽ��֮��������� codemark
                                window.hljs.highlightBlock(block);
                                $block.attr('codemark', '1');
                            }
                        });
                    };

                    // ���Ը�����ʽ
                    if (lang) {
                        langClass = ' class="' + lang + ' hljs"';
                    }

                    // �滻��ǩ
                    val = val.replace(/&/gm, '&amp;')
                        .replace(/</gm, '&lt;')
                        .replace(/>/gm, '&gt;');

                    // ---- menu δѡ��״̬ ----
                    if (!menu.selected) {
                        // ƴ��html
                        var html = codeTpl.replace('{#langClass}', langClass).replace('{#content}', val);
                        editor.command(e, 'insertHtml', html, doHightlight);
                        return;
                    }

                    // ---- menu ѡ��״̬ ----
                    var targetElem = editor.getSelfOrParentByName(rangeElem, 'pre');
                    var $targetElem;
                    if (targetElem) {
                        // ȷ���ҵ� pre ֮������ code
                        targetElem = editor.getSelfOrParentByName(rangeElem, 'code');
                    }
                    if (!targetElem) {
                        return;
                    }
                    $targetElem = $(targetElem);

                    function commandFn() {
                        var className;
                        if (lang) {
                            className = $targetElem.attr('class');
                            if (className !== lang + ' hljs') {
                                $targetElem.attr('class', lang + ' hljs');
                            }
                        }
                        $targetElem.html(val);
                    }
                    function callback() {
                        editor.restoreSelectionByElem(targetElem);
                        doHightlight();
                    }
                    editor.customCommand(e, commandFn, callback);
                });
            }

            // ------ enter ʱ���������ǩ��ֻ���� ------
            $txt.on('keydown', function (e) {
                if (e.keyCode !== 13) {
                    return;
                }
                var rangeElem = editor.getRangeElem();
                var targetElem = editor.getSelfOrParentByName(rangeElem, 'code');
                if (!targetElem) {
                    return;
                }

                editor.command(e, 'insertHtml', '\n');
            });

            // ------ ���ʱ������������ǩ ------
            function updateMenu() {
                var rangeElem = editor.getRangeElem();
                var targetElem = editor.getSelfOrParentByName(rangeElem, 'code');
                if (targetElem) {
                    // �� code ֮�ڣ����������˵�
                    editor.disableMenusExcept('insertcode');
                } else {
                    // ������ code ֮�ڣ����������˵�
                    editor.enableMenusExcept('insertcode');
                }
            }
            $txt.on('keydown click', function (e) {
                // �˴�����ʹ�� setTimeout �첽�������򲻶�
                setTimeout(updateMenu);
            });
        });

    });
// undo �˵�
    _e(function (E, $) {

        E.createMenu(function (check) {
            var menuId = 'undo';
            if (!check(menuId)) {
                return;
            }
            var editor = this;
            var lang = editor.config.lang;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.undo
            });

            // click �¼�
            menu.clickEvent = function (e) {
                editor.undo();
            };

            // ���ӵ�editor������
            editor.menus[menuId] = menu;


            // ------------ ��ʼ��ʱ��enter ʱ�������ж�ʱ������¼ ------------
            // ------------ ctrl + z �ǵ��ü�¼������������ʹ�������Ĭ�ϵĳ��� ------------
            editor.ready(function () {
                var editor = this;
                var $txt = editor.txt.$txt;
                var timeoutId;

                // ִ��undo��¼
                function undo() {
                    editor.undoRecord();
                }

                $txt.on('keydown', function (e) {
                    var keyCode = e.keyCode;

                    // ���� ctrl + z
                    if (e.ctrlKey && keyCode === 90) {
                        editor.undo();
                        return;
                    }

                    if (keyCode === 13) {
                        // enter ����¼
                        undo();
                    } else {
                        // keyup ֮�� 1s ֮�ڲ�����������һ�μ�¼
                        if (timeoutId) {
                            clearTimeout(timeoutId);
                        }
                        timeoutId = setTimeout(undo, 1000);
                    }
                });

                // ��ʼ������¼
                editor.undoRecord();
            });
        });

    });
// redo �˵�
    _e(function (E, $) {

        E.createMenu(function (check) {
            var menuId = 'redo';
            if (!check(menuId)) {
                return;
            }
            var editor = this;
            var lang = editor.config.lang;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.redo
            });

            // click �¼�
            menu.clickEvent = function (e) {
                editor.redo();
            };

            // ���ӵ�editor������
            editor.menus[menuId] = menu;
        });

    });
// ȫ�� �˵�
    _e(function (E, $) {

        // ��¼ȫ��ʱ��scrollTop
        var scrollTopWhenFullScreen;

        E.createMenu(function (check) {
            var menuId = 'fullscreen';
            if (!check(menuId)) {
                return;
            }
            var editor = this;
            var $txt = editor.txt.$txt;
            var config = editor.config;
            var zIndexConfig = config.zindex || 10000;
            var lang = config.lang;

            var isSelected = false;
            var zIndex;

            var maxHeight;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,
                id: menuId,
                title: lang.fullscreen
            });

            // ����click�¼�
            menu.clickEvent = function (e) {
                // ������ʽ
                var $editorContainer = editor.$editorContainer;
                $editorContainer.addClass('wangEditor-fullscreen');

                // ���ȱ��浱ǰ�ģ�������z-index
                zIndex = $editorContainer.css('z-index');
                $editorContainer.css('z-index', zIndexConfig);

                var $wrapper;
                var txtHeight = $txt.height();
                var txtOuterHeight = $txt.outerHeight();

                if (editor.useMaxHeight) {
                    // ��¼ max-height������ʱȥ��maxheight
                    maxHeight = $txt.css('max-height');
                    $txt.css('max-height', 'none');

                    // ���ʹ����maxHeight�� ��$txt�����ĸ�Ԫ�����Ƴ���
                    $wrapper = $txt.parent();
                    $wrapper.after($txt);
                    $wrapper.remove();
                    $txt.css('overflow-y', 'auto');
                }

                // ���ø߶ȵ�ȫ��
                var menuContainer = editor.menuContainer;
                $txt.height(
                    E.$window.height() -
                    menuContainer.height() -
                    (txtOuterHeight - txtHeight)  // ȥ���ڱ߾����߾�
                );

                // ȡ��menuContainer��������ʽ��menu����ʱ����Ϊ menuContainer ����һЩ������ʽ��
                editor.menuContainer.$menuContainer.attr('style', '');

                // ����״̬
                isSelected = true;

                // ��¼�༭���Ƿ�ȫ��
                editor.isFullScreen = true;

                // ��¼����ȫ��ʱ�ĸ߶�
                scrollTopWhenFullScreen = E.$window.scrollTop();
            };

            // ����ѡ��״̬�� click �¼�
            menu.clickEventSelected = function (e) {
                // ȡ����ʽ
                var $editorContainer = editor.$editorContainer;
                $editorContainer.removeClass('wangEditor-fullscreen');
                $editorContainer.css('z-index', zIndex);

                // ��ԭheight
                if (editor.useMaxHeight) {
                    $txt.css('max-height', maxHeight);
                } else {
                    // editor.valueContainerHeight �� editor.txt.initHeight() �����ȱ�����
                    editor.$valueContainer.css('height', editor.valueContainerHeight);
                }

                // ���¼���߶�
                editor.txt.initHeight();

                // ����״̬
                isSelected = false;

                // ��¼�༭���Ƿ�ȫ��
                editor.isFullScreen = false;

                // ��ԭscrollTop
                if (scrollTopWhenFullScreen != null) {
                    E.$window.scrollTop(scrollTopWhenFullScreen);
                }
            };

            // ����ѡ���¼�
            menu.updateSelectedEvent = function (e) {
                return isSelected;
            };

            // ���ӵ�editor������
            editor.menus[menuId] = menu;
        });

    });
// ��Ⱦmenus
    _e(function (E, $) {

        E.fn.renderMenus = function () {

            var editor = this;
            var menus = editor.menus;
            var menuIds = editor.config.menus;
            var menuContainer = editor.menuContainer;

            var menu;
            var groupIdx = 0;
            $.each(menuIds, function (k, v) {
                if (v === '|') {
                    groupIdx++;
                    return;
                }

                menu = menus[v];
                if (menu) {
                    menu.render(groupIdx);
                }
            });
        };

    });
// ��Ⱦmenus
    _e(function (E, $) {

        E.fn.renderMenuContainer = function () {

            var editor = this;
            var menuContainer = editor.menuContainer;
            var $editorContainer = editor.$editorContainer;

            menuContainer.render();

        };

    });
// ��Ⱦ txt
    _e(function (E, $) {

        E.fn.renderTxt = function () {

            var editor = this;
            var txt = editor.txt;

            txt.render();

            // ready ʱ�򣬼���txt�ĸ߶�
            editor.ready(function () {
                txt.initHeight();
            });
        };

    });
// ��Ⱦ container
    _e(function (E, $) {

        E.fn.renderEditorContainer = function () {

            var editor = this;
            var $valueContainer = editor.$valueContainer;
            var $editorContainer = editor.$editorContainer;
            var $txt = editor.txt.$txt;
            var $prev, $parent;

            // ���༭����Ⱦ��ҳ����
            if ($valueContainer === $txt) {
                $prev = editor.$prev;
                $parent = editor.$parent;

                if ($prev && $prev.length) {
                    // ��ǰ�ýڵ㣬�Ͳ��뵽ǰ�ýڵ�ĺ���
                    $prev.after($editorContainer);
                } else {
                    // û��ǰ�ýڵ㣬��ֱ�Ӳ��뵽��Ԫ��
                    $parent.prepend($editorContainer);
                }

            } else {
                $valueContainer.after($editorContainer);
                $valueContainer.hide();
            }

            // ���ÿ�ȣ��������ÿ�������⣩
            // $editorContainer.css('width', $valueContainer.css('width'));
        };

    });
// �˵��¼�
    _e(function (E, $) {

        // ��ÿ���˵���click�¼�
        E.fn.eventMenus = function () {

            var menus = this.menus;

            // �󶨲˵��ĵ���¼�
            $.each(menus, function (k, v) {
                v.bindEvent();
            });

        };

    });
// �˵�container�¼�
    _e(function (E, $) {

        E.fn.eventMenuContainer = function () {

        };

    });
// �༭�����¼�
    _e(function (E, $) {

        E.fn.eventTxt = function () {

            var txt = this.txt;

            // txt���ݱ仯ʱ������ѡ��
            txt.saveSelectionEvent();

            // txt���ݱ仯ʱ����ʱ���� value
            txt.updateValueEvent();

            // txt���ݱ仯ʱ����ʱ���� menu style
            txt.updateMenuStyleEvent();

            // // ���hoverʱ����ʾ p head �߶ȣ���ʱ�ر�������ܣ�
            // if (!/ie/i.test(E.userAgent)) {
            //     // ��ʱ��֧��IE
            //     txt.showHeightOnHover();
            // }
        };

    });
// �ϴ�ͼƬ�¼�
    _e(function (E, $) {

        E.plugin(function () {
            var editor = this;
            var fns = editor.config.uploadImgFns; // editor.config.uploadImgFns = {} ��config�ļ��ж�����

            // -------- ����load���� --------
            fns.onload || (fns.onload = function (resultText, xhr) {
                E.log('�ϴ����������ؽ��Ϊ ' + resultText);

                var editor = this;
                var originalName = editor.uploadImgOriginalName || '';  // �ϴ�ͼƬʱ���Ѿ���ͼƬ�����ִ��� editor.uploadImgOriginalName
                var img;
                if (resultText.indexOf('error|') === 0) {
                    // ��ʾ����
                    E.warn('�ϴ�ʧ�ܣ�' + resultText.split('|')[1]);
                    alert(resultText.split('|')[1]);
                } else {
                    E.log('�ϴ��ɹ�����������༭���򣬽��Ϊ��' + resultText);

                    // ���������༭��
                    img = document.createElement('img');
                    img.onload = function () {
                        var html = '<img src="' + resultText + '" alt="' + originalName + '" style="width:100%;"/>';
                        editor.command(null, 'insertHtml', html);

                        E.log('�Ѳ���ͼƬ����ַ ' + resultText);
                        img = null;
                    };
                    img.onerror = function () {
                        E.error('ʹ�÷��صĽ����ȡͼƬ������������ȷ�����½���Ƿ���ȷ��' + resultText);
                        img = null;
                    };
                    img.src = resultText;
                }

            });

            // -------- ����tiemout���� --------
            fns.ontimeout || (fns.ontimeout = function (xhr) {
                E.error('�ϴ�ͼƬ��ʱ');
                alert('�ϴ�ͼƬ��ʱ');
            });

            // -------- ����error���� --------
            fns.onerror || (fns.onerror = function (xhr) {
                E.error('�ϴ���ͼƬ��������');
                alert('�ϴ���ͼƬ��������');
            });

        });
    });
// xhr �ϴ�ͼƬ
    _e(function (E, $) {

        if (!window.FileReader || !window.FormData) {
            // �����֧��html5���ĵ�������ֱ�ӷ���
            return;
        }

        E.plugin(function () {

            var editor = this;
            var config = editor.config;
            var uploadImgUrl = config.uploadImgUrl;
            var uploadTimeout = config.uploadTimeout;

            // ��ȡ�����е��ϴ��¼�
            var uploadImgFns = config.uploadImgFns;
            var onload = uploadImgFns.onload;
            var ontimeout = uploadImgFns.ontimeout;
            var onerror = uploadImgFns.onerror;

            if (!uploadImgUrl) {
                return;
            }

            // -------- ����base64��ͼƬurl����ת��ΪBlob --------
            function convertBase64UrlToBlob(urlData, filetype){
                //ȥ��url��ͷ����ת��Ϊbyte
                var bytes = window.atob(urlData.split(',')[1]);

                //�����쳣,��ascii��С��0��ת��Ϊ����0
                var ab = new ArrayBuffer(bytes.length);
                var ia = new Uint8Array(ab);
                var i;
                for (i = 0; i < bytes.length; i++) {
                    ia[i] = bytes.charCodeAt(i);
                }

                return new Blob([ab], {type : filetype});
            }

            // -------- ����ͼƬ�ķ��� --------
            function insertImg(src, event) {
                var img = document.createElement('img');
                img.onload = function () {
                    var html = '<img src="' + src + '" style="width:100%;"/>';
                    editor.command(event, 'insertHtml', html);

                    E.log('�Ѳ���ͼƬ����ַ ' + src);
                    img = null;
                };
                img.onerror = function () {
                    E.error('ʹ�÷��صĽ����ȡͼƬ������������ȷ�����½���Ƿ���ȷ��' + src);
                    img = null;
                };
                img.src = src;
            }

            // -------- onprogress �¼� --------
            function updateProgress(e) {
                if (e.lengthComputable) {
                    var percentComplete = e.loaded / e.total;
                    editor.showUploadProgress(percentComplete * 100);
                }
            }

            // -------- xhr �ϴ�ͼƬ --------
            editor.xhrUploadImg = function (opt) {
                // opt ����
                var event = opt.event;
                var fileName = opt.filename || '';
                var base64 = opt.base64;
                var fileType = opt.fileType || 'image/png'; // ����չ����Ĭ��ʹ�� png
                var name = opt.name || 'wangEditor_upload_file';
                var loadfn = opt.loadfn || onload;
                var errorfn = opt.errorfn || onerror;
                var timeoutfn = opt.timeoutfn || ontimeout;

                // �ϴ��������� token��
                var params = editor.config.uploadParams || {};

                // headers
                var headers = editor.config.uploadHeaders || {};

                // ��ȡ�ļ���չ��
                var fileExt = 'png';  // Ĭ��Ϊ png
                if (fileName.indexOf('.') > 0) {
                    // ԭ�����ļ�������չ��
                    fileExt = fileName.slice(fileName.lastIndexOf('.') - fileName.length + 1);
                } else if (fileType.indexOf('/') > 0 && fileType.split('/')[1]) {
                    // �ļ���û����չ����ͨ�����ͻ�ȡ����� 'image/png' ȡ 'png'
                    fileExt = fileType.split('/')[1];
                }

                // ------------ begin Ԥ��ģ���ϴ� ------------
                if (E.isOnWebsite) {
                    E.log('Ԥ��ģ���ϴ�');
                    insertImg(base64, event);
                    return;
                }
                // ------------ end Ԥ��ģ���ϴ� ------------

                // ��������
                var xhr = new XMLHttpRequest();
                var timeoutId;
                var src;
                var formData = new FormData();

                // ��ʱ����
                function timeoutCallback() {
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                    if (xhr && xhr.abort) {
                        xhr.abort();
                    }

                    // ��ʱ�˾���ֹĬ����Ϊ
                    event.preventDefault();

                    // ִ�лص���������ʾʲô���ݣ���Ӧ���ڻص������ж���
                    timeoutfn && timeoutfn.call(editor, xhr);

                    // ���ؽ�����
                    editor.hideUploadProgress();
                }

                xhr.onload = function () {
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }

                    // ��¼�ļ����� editor.uploadImgOriginalName ������ͼƬʱ������ alt ������
                    editor.uploadImgOriginalName = fileName;
                    if (fileName.indexOf('.') > 0) {
                        editor.uploadImgOriginalName = fileName.split('.')[0];
                    }

                    // ִ��load�������κβ�������Ӧ����load�����ж���
                    loadfn && loadfn.call(editor, xhr.responseText, xhr);

                    // ���ؽ�����
                    editor.hideUploadProgress();
                };
                xhr.onerror = function () {
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }

                    // ��ʱ�˾���ֹĬ����Ϊ
                    event.preventDefault();

                    // ִ��error������������ʾ��Ӧ����error�����ж���
                    errorfn && errorfn.call(editor, xhr);

                    // ���ؽ�����
                    editor.hideUploadProgress();
                };
                // xhr.onprogress = updateProgress;
                xhr.upload.onprogress = updateProgress;

                // �������
                formData.append(name, convertBase64UrlToBlob(base64, fileType), E.random() + '.' + fileExt);

                // ��Ӳ���
                $.each(params, function (key, value) {
                    formData.append(key, value);
                });

                // ��ʼ�ϴ�
                xhr.open('POST', uploadImgUrl, true);
                // xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");  // �����������ɴ�ͳform�ķ�ʽ�ϴ�

                // �޸��Զ������õ�headers
                $.each(headers, function (key, value) {
                    xhr.setRequestHeader(key, value);
                });

                // �����ϴ�ʱ����cookie
                xhr.withCredentials = true;

                // ��������
                xhr.send(formData);
                timeoutId = setTimeout(timeoutCallback, uploadTimeout);

                E.log('��ʼ�ϴ�...����ʼ��ʱ����');
            };
        });
    });
// ������
    _e(function (E, $) {

        E.plugin(function () {

            var editor = this;
            var menuContainer = editor.menuContainer;
            var menuHeight = menuContainer.height();
            var $editorContainer = editor.$editorContainer;
            var width = $editorContainer.width();
            var $progress = $('<div class="wangEditor-upload-progress"></div>');

            // ��Ⱦ�¼�
            var isRender = false;
            function render() {
                if (isRender) {
                    return;
                }
                isRender = true;

                $progress.css({
                    top: menuHeight + 'px'
                });
                $editorContainer.append($progress);
            }

            // ------ ��ʾ���� ------
            editor.showUploadProgress = function (progress) {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                // ��ʾ֮ǰ�����ж��Ƿ���Ⱦ
                render();

                $progress.show();
                $progress.width(progress * width / 100);
            };

            // ------ ���ؽ����� ------
            var timeoutId;
            function hideProgress() {
                $progress.hide();
                timeoutId = null;
            }
            editor.hideUploadProgress = function (time) {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                time = time || 750;
                timeoutId = setTimeout(hideProgress, time);
            };
        });
    });
// upload img ���
    _e(function (E, $) {

        E.plugin(function () {
            var editor = this;
            var config = editor.config;
            var uploadImgUrl = config.uploadImgUrl;
            var uploadTimeout = config.uploadTimeout;
            var event;

            if (!uploadImgUrl) {
                return;
            }

            // ��ȡeditor���ϴ�dom
            var $uploadContent = editor.$uploadContent;
            if (!$uploadContent) {
                return;
            }

            // �Զ���UI������ӵ��ϴ�dom�ڵ���
            var $uploadIcon = $('<div class="upload-icon-container"><i class="wangeditor-menu-img-upload"></i></div>');
            $uploadContent.append($uploadIcon);

            // ---------- �����ϴ����� ----------
            var upfile = new E.UploadFile({
                editor: editor,
                uploadUrl: uploadImgUrl,
                timeout: uploadTimeout,
                fileAccept: 'image/jpg,image/jpeg,image/png,image/gif,image/bmp'    // ֻ����ѡ��ͼƬ 
            });

            // ѡ�񱾵��ļ����ϴ�
            $uploadIcon.click(function (e) {
                event = e;
                upfile.selectFiles();
            });
        });
    });
// h5 ��ʽ�ϴ�ͼƬ
    _e(function (E, $) {

        if (!window.FileReader || !window.FormData) {
            // �����֧��html5���ĵ�������ֱ�ӷ���
            return;
        }

        // ���캯��
        var UploadFile = function (opt) {
            this.editor = opt.editor;
            this.uploadUrl = opt.uploadUrl;
            this.timeout = opt.timeout;
            this.fileAccept = opt.fileAccept;
            this.multiple = true;
        };

        UploadFile.fn = UploadFile.prototype;

        // clear
        UploadFile.fn.clear = function () {
            this.$input.val('');
            E.log('input value �����');
        };

        // ��Ⱦ
        UploadFile.fn.render = function () {
            var self = this;
            if (self._hasRender) {
                // ��Ҫ�ظ���Ⱦ
                return;
            }

            E.log('��Ⱦdom');

            var fileAccept = self.fileAccept;
            var acceptTpl = fileAccept ? 'accept="' + fileAccept + '"' : '';
            var multiple = self.multiple;
            var multipleTpl = multiple ? 'multiple="multiple"' : '';
            var $input = $('<input type="file" ' + acceptTpl + ' ' + multipleTpl + '/>');
            var $container = $('<div style="visibility:hidden;"></div>');

            $container.append($input);
            E.$body.append($container);

            // onchange �¼�
            $input.on('change', function (e) {
                self.selected(e, $input.get(0));
            });

            // ��¼��������
            self.$input = $input;

            // ��¼
            self._hasRender = true;
        };

        // ѡ��
        UploadFile.fn.selectFiles = function () {
            var self = this;

            E.log('ʹ�� html5 ��ʽ�ϴ�');

            // ����Ⱦ
            self.render();

            // ѡ��
            E.log('ѡ���ļ�');
            self.$input.click();
        };

        // ѡ���ļ�֮��
        UploadFile.fn.selected = function (e, input) {
            var self = this;
            var files = input.files || [];
            if (files.length === 0) {
                return;
            }

            E.log('ѡ�� ' + files.length + ' ���ļ�');

            // ����ѡ�е��ļ���Ԥ�����ϴ�
            $.each(files, function (key, value) {
                self.upload(value);
            });
        };

        // �ϴ������ļ�
        UploadFile.fn.upload = function (file) {
            var self = this;
            var editor = self.editor;
            var filename = file.name || '';
            var fileType = file.type || '';
            var uploadImgFns = editor.config.uploadImgFns;
            var uploadFileName = editor.config.uploadImgFileName || 'wangEditorH5File';
            var onload = uploadImgFns.onload;
            var ontimeout = uploadImgFns.ontimeout;
            var onerror = uploadImgFns.onerror;
            var reader = new FileReader();

            if (!onload || !ontimeout || !onerror) {
                E.error('��Ϊ�༭�������ϴ�ͼƬ�� onload ontimeout onerror �ص��¼�');
                return;
            }


            E.log('��ʼִ�� ' + filename + ' �ļ����ϴ�');

            // ��� input ����
            function clearInput() {
                self.clear();
            }

            // onload�¼�
            reader.onload = function (e) {
                E.log('�Ѷ�ȡ' + filename + '�ļ�');

                var base64 = e.target.result || this.result;
                editor.xhrUploadImg({
                    event: e,
                    filename: filename,
                    base64: base64,
                    fileType: fileType,
                    name: uploadFileName,
                    loadfn: function (resultText, xhr) {
                        clearInput();
                        // ִ�������еķ���
                        var editor = this;
                        onload.call(editor, resultText, xhr);
                    },
                    errorfn: function (xhr) {
                        clearInput();
                        if (E.isOnWebsite) {
                            alert('wangEditor������ʱû�з���ˣ���˱���ʵ����Ŀ�в��ᷢ��');
                        }
                        // ִ�������еķ���
                        var editor = this;
                        onerror.call(editor, xhr);
                    },
                    timeoutfn: function (xhr) {
                        clearInput();
                        if (E.isOnWebsite) {
                            alert('wangEditor������ʱû�з���ˣ���˳�ʱ��ʵ����Ŀ�в��ᷢ��');
                        }
                        // ִ�������еķ���
                        var editor = this;
                        ontimeout(editor, xhr);
                    }
                });
            };

            // ��ʼȡ�ļ�
            reader.readAsDataURL(file);
        };

        // ��¶�� E
        E.UploadFile = UploadFile;

    });
// form��ʽ�ϴ�ͼƬ
    _e(function (E, $) {

        if (window.FileReader && window.FormData) {
            // ���֧�� html5 �ϴ����򷵻�
            return;
        }

        // ���캯��
        var UploadFile = function (opt) {
            this.editor = opt.editor;
            this.uploadUrl = opt.uploadUrl;
            this.timeout = opt.timeout;
            this.fileAccept = opt.fileAccept;
            this.multiple = false;
        };

        UploadFile.fn = UploadFile.prototype;

        // clear
        UploadFile.fn.clear = function () {
            this.$input.val('');
            E.log('input value �����');
        };

        // ����modal
        UploadFile.fn.hideModal = function () {
            this.modal.hide();
        };

        // ��Ⱦ
        UploadFile.fn.render = function () {
            var self = this;
            var editor = self.editor;
            var uploadFileName = editor.config.uploadImgFileName || 'wangEditorFormFile';
            if (self._hasRender) {
                // ��Ҫ�ظ���Ⱦ
                return;
            }

            // ��������·��
            var uploadUrl = self.uploadUrl;

            E.log('��Ⱦdom');

            // ���� form �� iframe
            var iframeId = 'iframe' + E.random();
            var $iframe = $('<iframe name="' + iframeId + '" id="' + iframeId + '" frameborder="0" width="0" height="0"></iframe>');
            var multiple = self.multiple;
            var multipleTpl = multiple ? 'multiple="multiple"' : '';
            var $p = $('<p>ѡ��ͼƬ���ϴ�</p>');
            var $input = $('<input type="file" ' + multipleTpl + ' name="' + uploadFileName + '"/>');
            var $btn = $('<input type="submit" value="�ϴ�"/>');
            var $form = $('<form enctype="multipart/form-data" method="post" action="' + uploadUrl + '" target="' + iframeId + '"></form>');
            var $container = $('<div style="margin:10px 20px;"></div>');

            $form.append($p).append($input).append($btn);

            // �����û����õĲ������� token
            $.each(editor.config.uploadParams, function (key, value) {
                $form.append( $('<input type="hidden" name="' + key + '" value="' + value + '"/>') );
            });

            $container.append($form);
            $container.append($iframe);

            self.$input = $input;
            self.$iframe = $iframe;

            // ���� modal
            var modal = new E.Modal(editor, undefined, {
                $content: $container
            });
            self.modal = modal;

            // ��¼
            self._hasRender = true;
        };

        // �� iframe load �¼�
        UploadFile.fn.bindLoadEvent = function () {
            var self = this;
            if (self._hasBindLoad) {
                // ��Ҫ�ظ���
                return;
            }

            var editor = self.editor;
            var $iframe = self.$iframe;
            var iframe = $iframe.get(0);
            var iframeWindow = iframe.contentWindow;
            var onload = editor.config.uploadImgFns.onload;

            // ����load�¼�
            function onloadFn() {
                var resultText = $.trim(iframeWindow.document.body.innerHTML);
                if (!resultText) {
                    return;
                }

                // ��ȡ�ļ���
                var fileFullName = self.$input.val();  // ����� C:\folder\abc.png ��ʽ
                var fileOriginalName = fileFullName;
                if (fileFullName.lastIndexOf('\\') >= 0) {
                    // ��ȡ abc.png ��ʽ
                    fileOriginalName = fileFullName.slice(fileFullName.lastIndexOf('\\') + 1);
                    if (fileOriginalName.indexOf('.') > 0) {
                        // ��ȡ abc ����������չ�����ļ�����
                        fileOriginalName = fileOriginalName.split('.')[0];
                    }
                }

                // ���ļ����ݴ浽 editor.uploadImgOriginalName ������ͼƬʱ������Ϊ alt ��������
                editor.uploadImgOriginalName = fileOriginalName;

                // ִ��load����������ͼƬ�Ĳ�����Ӧ����load������ִ��
                onload.call(editor, resultText);

                // ��� input ����
                self.clear();

                // ����modal
                self.hideModal();
            }

            // �� load �¼�
            if (iframe.attachEvent) {
                iframe.attachEvent('onload', onloadFn);
            } else {
                iframe.onload = onloadFn;
            }

            // ��¼
            self._hasBindLoad = true;
        };

        UploadFile.fn.show = function () {
            var self = this;
            var modal = self.modal;

            function show() {
                modal.show();
                self.bindLoadEvent();
            }
            setTimeout(show);
        };

        // ѡ��
        UploadFile.fn.selectFiles = function () {
            var self = this;

            E.log('ʹ�� form ��ʽ�ϴ�');

            // ����Ⱦ
            self.render();

            // �����
            self.clear();

            // ��ʾ
            self.show();
        };

        // ��¶�� E
        E.UploadFile = UploadFile;

    });
// upload img ��� ճ��ͼƬ
    _e(function (E, $) {

        E.plugin(function () {
            var editor = this;
            var txt = editor.txt;
            var $txt = txt.$txt;
            var config = editor.config;
            var uploadImgUrl = config.uploadImgUrl;
            var uploadFileName = config.uploadImgFileName || 'wangEditorPasteFile';
            var pasteEvent;
            var $imgsBeforePaste;

            // δ�����ϴ�ͼƬurl�������
            if (!uploadImgUrl) {
                return;
            }

            // -------- �� chrome �£�ͨ������ճ����ͼƬ�ķ�ʽ�ϴ� --------
            function findPasteImgAndUpload() {
                var reg = /^data:(image\/\w+);base64/;
                var $imgs = $txt.find('img');

                E.log('ճ���󣬼�鵽�༭����' + $imgs.length + '��ͼƬ����ʼ����ͼƬ����ͼ�ҵ��ո�ճ��������ͼƬ');

                $.each($imgs, function () {
                    var img = this;
                    var $img = $(img);
                    var flag;
                    var base64 = $img.attr('src');
                    var type;

                    // �жϵ�ǰͼƬ�Ƿ���ճ��֮ǰ��
                    $imgsBeforePaste.each(function () {
                        if (img === this) {
                            // ��ǰͼƬ��ճ��֮ǰ��
                            flag = true;
                            return false;
                        }
                    });

                    // ��ǰͼƬ��ճ��֮ǰ�ģ������
                    if (flag) {
                        return;
                    }

                    E.log('�ҵ�һ��ճ��������ͼƬ');

                    if (reg.test(base64)) {
                        // �õ���ճ����ͼƬ�� base64 ��ʽ������Ҫ��
                        E.log('src �� base64 ��ʽ�������ϴ�');
                        type = base64.match(reg)[1];
                        editor.xhrUploadImg({
                            event: pasteEvent,
                            base64: base64,
                            fileType: type,
                            name: uploadFileName
                        });
                    } else {
                        E.log('src Ϊ ' + base64 + ' ������ base64 ��ʽ����ʱ��֧���ϴ�');
                    }

                    // �����Ƴ�ԭͼƬ
                    $img.remove();
                });

                E.log('��������');
            }

            // ��ʼ���ճ���¼�
            $txt.on('paste', function (e) {
                pasteEvent = e;
                var data = pasteEvent.clipboardData || pasteEvent.originalEvent.clipboardData;
                var text;
                var items;

                // -------- ��ͼ��ȡ���а��е����֣������ֵ�����£��Ͳ�����ͼƬճ�� --------
                if (data == null) {
                    text = window.clipboardData && window.clipboardData.getData('text');
                } else {
                    text = data.getData('text/plain') || data.getData('text/html');
                }
                if (text) {
                    return;
                }

                items = data && data.items;
                if (items) {
                    // -------- chrome ������ data.items ȡ��ͼƬ -----
                    E.log('ͨ�� data.items �õ�������');

                    $.each(items, function (key, value) {
                        var fileType = value.type || '';
                        if(fileType.indexOf('image') < 0) {
                            // ����ͼƬ
                            return;
                        }

                        var file = value.getAsFile();
                        var reader = new FileReader();

                        E.log('�õ�һ��ճ��ͼƬ');

                        reader.onload = function (e) {
                            E.log('��ȡ��ճ����ͼƬ');

                            // ִ���ϴ�
                            var base64 = e.target.result || this.result;
                            editor.xhrUploadImg({
                                event: pasteEvent,
                                base64: base64,
                                fileType: fileType,
                                name: uploadFileName
                            });
                        };

                        //��ȡճ�����ļ�
                        reader.readAsDataURL(file);
                    });
                } else {
                    // -------- �� chrome ������ data.items ȡͼƬ -----

                    E.log('δ�� data.items �õ����ݣ�ʹ�ü��ճ��ͼƬ�ķ�ʽ');

                    // ��ȡ
                    $imgsBeforePaste = $txt.find('img');
                    E.log('ճ��ǰ����鵽�༭����' + $imgsBeforePaste.length + '��ͼƬ');

                    // �첽�ϴ��ҵ���ͼƬ
                    setTimeout(findPasteImgAndUpload, 0);
                }
            });

        });
    });
// ��ק�ϴ�ͼƬ ��� 
    _e(function (E, $) {

        E.plugin(function () {

            var editor = this;
            var txt = editor.txt;
            var $txt = txt.$txt;
            var config = editor.config;
            var uploadImgUrl = config.uploadImgUrl;
            var uploadFileName = config.uploadImgFileName || 'wangEditorDragFile';

            // δ�����ϴ�ͼƬurl�������
            if (!uploadImgUrl) {
                return;
            }

            // ��ֹ�����Ĭ����Ϊ
            E.$document.on('dragleave drop dragenter dragover', function (e) {
                e.preventDefault();
            });

            // ��� $txt drop �¼�
            $txt.on('drop', function (dragEvent) {
                dragEvent.preventDefault();

                var originalEvent = dragEvent.originalEvent;
                var files = originalEvent.dataTransfer && originalEvent.dataTransfer.files;

                if (!files || !files.length) {
                    return;
                }

                $.each(files, function (k, file) {
                    var type = file.type;
                    var name = file.name;

                    if (type.indexOf('image/') < 0) {
                        // ֻ����ͼƬ
                        return;
                    }

                    E.log('�õ�ͼƬ ' + name);

                    var reader = new FileReader();
                    reader.onload = function (e) {
                        E.log('��ȡ��ͼƬ ' + name);

                        // ִ���ϴ�
                        var base64 = e.target.result || this.result;
                        editor.xhrUploadImg({
                            event: dragEvent,
                            base64: base64,
                            fileType: type,
                            name: uploadFileName
                        });
                    };

                    //��ȡճ�����ļ�
                    reader.readAsDataURL(file);

                });
            });
        });

    });
// �༭������ table toolbar
    _e(function (E, $) {

        E.plugin(function () {
            var editor = this;
            var txt = editor.txt;
            var $txt = txt.$txt;
            var html = '';
            // ˵���������� max-height ֮��$txt.parent() �����������
            var $currentTxt = editor.useMaxHeight ? $txt.parent() : $txt;
            var $currentTable;

            // �õ���dom�ڵ�
            var isRendered = false;
            var $toolbar = $('<div class="txt-toolbar"></div>');
            var $triangle = $('<div class="tip-triangle"></div>');
            var $delete = $('<a href="#"><i class="wangeditor-menu-img-trash-o"></i></a>');
            var $zoomSmall = $('<a href="#"><i class="wangeditor-menu-img-search-minus"></i></a>');
            var $zoomBig = $('<a href="#"><i class="wangeditor-menu-img-search-plus"></i></a>');

            // ��Ⱦ��ҳ��
            function render() {
                if (isRendered) {
                    return;
                }

                // ���¼�
                bindEvent();

                // ƴ�� ��Ⱦ��ҳ����
                $toolbar.append($triangle)
                    .append($delete)
                    .append($zoomSmall)
                    .append($zoomBig);
                editor.$editorContainer.append($toolbar);
                isRendered = true;
            }

            // ���¼�
            function bindEvent() {
                // ͳһִ������ķ���
                var commandFn;
                function command(e, callback) {
                    // ִ������֮ǰ���ȴ洢html����
                    html = $txt.html();
                    // ������ݱ仯
                    var cb = function  () {
                        if (callback) {
                            callback();
                        }
                        if (html !== $txt.html()) {
                            $txt.change();
                        }
                    };
                    // ִ������
                    if (commandFn) {
                        editor.customCommand(e, commandFn, cb);
                    }
                }

                // ɾ��
                $delete.click(function (e) {
                    commandFn = function () {
                        $currentTable.remove();
                    };
                    command(e, function () {
                        setTimeout(hide, 100);
                    });
                });

                // �Ŵ�
                $zoomBig.click(function (e) {
                    commandFn = function () {
                        $currentTable.css({
                            width: '100%'
                        });
                    };
                    command(e, function () {
                        setTimeout(show);
                    });
                });

                // ��С
                $zoomSmall.click(function (e) {
                    commandFn = function () {
                        $currentTable.css({
                            width: 'auto'
                        });
                    };
                    command(e, function () {
                        setTimeout(show);
                    });
                });
            }

            // ��ʾ toolbar
            function show() {
                if (editor._disabled) {
                    // �༭���Ѿ������ã�������ʾ
                    return;
                }
                if ($currentTable == null) {
                    return;
                }
                $currentTable.addClass('clicked');
                var tablePosition = $currentTable.position();
                var tableTop = tablePosition.top;
                var tableLeft = tablePosition.left;
                var tableHeight = $currentTable.outerHeight();
                var tableWidth = $currentTable.outerWidth();

                // --- ��λ toolbar ---

                // ����������
                var top = tableTop + tableHeight;
                var left = tableLeft;
                var marginLeft = 0;

                var txtTop = $currentTxt.position().top;
                var txtHeight = $currentTxt.outerHeight();
                if (top > (txtTop + txtHeight)) {
                    // top ���ó����༭��Χ
                    top = txtTop + txtHeight;
                }

                // ��ʾ��������� margin��
                $toolbar.show();

                // ���� margin
                var width = $toolbar.outerWidth();
                marginLeft = tableWidth / 2 - width / 2;

                // ��λ
                $toolbar.css({
                    top: top + 5,
                    left: left,
                    'margin-left': marginLeft
                });
                // �����λ̫������
                if (marginLeft < 0) {
                    // �õ������ε�margin-left
                    $toolbar.css('margin-left', '0');
                    $triangle.hide();
                } else {
                    $triangle.show();
                }
            }

            // ���� toolbar
            function hide() {
                if ($currentTable == null) {
                    return;
                }
                $currentTable.removeClass('clicked');
                $currentTable = null;
                $toolbar.hide();
            }

            // click table �¼�
            $currentTxt.on('click', 'table', function (e) {
                var $table = $(e.currentTarget);

                // ��Ⱦ
                render();

                if ($currentTable && ($currentTable.get(0) === $table.get(0))) {
                    setTimeout(hide, 100);
                    return;
                }

                // ��ʾ toolbar
                $currentTable = $table;
                show();

                // ��ֹð��
                e.preventDefault();
                e.stopPropagation();

            }).on('click keydown scroll', function (e) {
                setTimeout(hide, 100);
            });
            E.$body.on('click keydown scroll', function (e) {
                setTimeout(hide, 100);
            });
        });

    });
// �༭������ img toolbar
    _e(function (E, $) {

        if (E.userAgent.indexOf('MSIE 8') > 0) {
            return;
        }

        E.plugin(function () {
            var editor = this;
            var lang = editor.config.lang;
            var txt = editor.txt;
            var $txt = txt.$txt;
            var html = '';
            // ˵���������� max-height ֮��$txt.parent() �����������
            var $currentTxt = editor.useMaxHeight ? $txt.parent() : $txt;
            var $editorContainer = editor.$editorContainer;
            var $currentImg;
            var currentLink = '';

            // �õ���dom�ڵ�
            var isRendered = false;
            var $dragPoint = $('<div class="img-drag-point"></div>');

            var $toolbar = $('<div class="txt-toolbar"></div>');
            var $triangle = $('<div class="tip-triangle"></div>');

            var $menuContainer = $('<div></div>');
            var $delete = $('<a href="#"><i class="wangeditor-menu-img-trash-o"></i></a>');
            var $zoomSmall = $('<a href="#"><i class="wangeditor-menu-img-search-minus"></i></a>');
            var $zoomBig = $('<a href="#"><i class="wangeditor-menu-img-search-plus"></i></a>');
            // var $floatLeft = $('<a href="#"><i class="wangeditor-menu-img-align-left"></i></a>');
            // var $noFloat = $('<a href="#"><i class="wangeditor-menu-img-align-justify"></i></a>');
            // var $floatRight = $('<a href="#"><i class="wangeditor-menu-img-align-right"></i></a>');
            var $alignLeft = $('<a href="#"><i class="wangeditor-menu-img-align-left"></i></a>');
            var $alignCenter = $('<a href="#"><i class="wangeditor-menu-img-align-center"></i></a>');
            var $alignRight = $('<a href="#"><i class="wangeditor-menu-img-align-right"></i></a>');
            var $link = $('<a href="#"><i class="wangeditor-menu-img-link"></i></a>');
            var $unLink = $('<a href="#"><i class="wangeditor-menu-img-unlink"></i></a>');

            var $linkInputContainer = $('<div style="display:none;"></div>');
            var $linkInput = $('<input type="text" style="height:26px; margin-left:10px; width:200px;"/>');
            var $linkBtnSubmit = $('<button class="right">' + lang.submit + '</button>');
            var $linkBtnCancel = $('<button class="right gray">' + lang.cancel + '</button>');

            // ��¼�Ƿ�������ק
            var isOnDrag = false;

            // ��ȡ / ���� ����
            function imgLink(e, url) {
                if (!$currentImg) {
                    return;
                }
                var commandFn;
                var callback = function () {
                    // ��ʱ����currentLink
                    if (url != null) {
                        currentLink = url;
                    }
                    if (html !== $txt.html()) {
                        $txt.change();
                    }
                };
                var $link;
                var inLink = false;
                var $parent = $currentImg.parent();
                if ($parent.get(0).nodeName.toLowerCase() === 'a') {
                    // ��Ԫ�ؾ���ͼƬ����
                    $link = $parent;
                    inLink = true;
                } else {
                    // ��Ԫ�ز���ͼƬ���ӣ������´���һ������
                    $link = $('<a target="_blank"></a>');
                }

                if (url == null) {
                    // url ��ֵ���ǻ�ȡ����
                    return $link.attr('href') || '';
                } else if (url === '') {
                    // url �ǿ��ַ�������ȡ������
                    if (inLink) {
                        commandFn = function () {
                            $currentImg.unwrap();
                        };
                    }
                } else {
                    // url ��ֵ������������
                    if (url === currentLink) {
                        return;
                    }
                    commandFn = function () {
                        $link.attr('href', url);

                        if (!inLink) {
                            // ��ǰͼƬδ�����������У����������
                            $currentImg.wrap($link);
                        }
                    };
                }

                // ִ������
                if (commandFn) {
                    // ��¼��ִ������֮ǰ��html����
                    html = $txt.html();
                    // ִ������
                    editor.customCommand(e, commandFn, callback);
                }
            }

            // ��Ⱦ��ҳ��
            function render() {
                if (isRendered) {
                    return;
                }

                // ���¼�
                bindToolbarEvent();
                bindDragEvent();

                // �˵����� container
                $menuContainer.append($delete)
                    .append($zoomSmall)
                    .append($zoomBig)
                    // .append($floatLeft)
                    // .append($noFloat)
                    // .append($floatRight);
                    .append($alignLeft)
                    .append($alignCenter)
                    .append($alignRight)
                    .append($link)
                    .append($unLink);

                // ����input����container
                $linkInputContainer.append($linkInput)
                    .append($linkBtnCancel)
                    .append($linkBtnSubmit);

                // ƴ�� ��Ⱦ��ҳ����
                $toolbar.append($triangle)
                    .append($menuContainer)
                    .append($linkInputContainer);

                editor.$editorContainer.append($toolbar).append($dragPoint);
                isRendered = true;
            }

            // ��toolbar�¼�
            function bindToolbarEvent() {
                // ͳһִ������ķ���
                var commandFn;
                function customCommand(e, callback) {
                    var cb;
                    // ��¼��ִ������֮ǰ��html����
                    html = $txt.html();
                    cb = function () {
                        if (callback) {
                            callback();
                        }
                        if (html !== $txt.html()) {
                            $txt.change();
                        }
                    };
                    // ִ������
                    if (commandFn) {
                        editor.customCommand(e, commandFn, cb);
                    }
                }

                // ɾ��
                $delete.click(function (e) {
                    // ɾ��֮ǰ��unlink
                    imgLink(e, '');

                    // ɾ��ͼƬ
                    commandFn = function () {
                        $currentImg.remove();
                    };
                    customCommand(e, function () {
                        setTimeout(hide, 100);
                    });
                });

                // �Ŵ�
                $zoomBig.click(function (e) {
                    commandFn = function () {
                        var img = $currentImg.get(0);
                        var width = img.width;
                        var height = img.height;
                        width = width * 1.1;
                        height = height * 1.1;

                        $currentImg.css({
                            width: width + 'px',
                            height: height + 'px'
                        });
                    };
                    customCommand(e, function () {
                        setTimeout(show);
                    });
                });

                // ��С
                $zoomSmall.click(function (e) {
                    commandFn = function () {
                        var img = $currentImg.get(0);
                        var width = img.width;
                        var height = img.height;
                        width = width * 0.9;
                        height = height * 0.9;

                        $currentImg.css({
                            width: width + 'px',
                            height: height + 'px'
                        });
                    };
                    customCommand(e, function () {
                        setTimeout(show);
                    });
                });

                // // �󸡶�
                // $floatLeft.click(function (e) {
                //     commandFn = function () {
                //         $currentImg.css({
                //             float: 'left'
                //         });
                //     };
                //     customCommand(e, function () {
                //         setTimeout(hide, 100);
                //     });
                // });

                // alignLeft
                $alignLeft.click(function (e) {
                    commandFn = function () {
                        // ��� img ���������ӣ���ô img.parent() ���� a ��ǩ������ align û�õģ���˱����ҵ� P ���ڵ������� align
                        $currentImg.parents('p').css({
                            'text-align': 'left'
                        }).attr('align', 'left');
                    };
                    customCommand(e, function () {
                        setTimeout(hide, 100);
                    });
                });

                // // �Ҹ���
                // $floatRight.click(function (e) {
                //     commandFn = function () {
                //         $currentImg.css({
                //             float: 'right'
                //         });
                //     };
                //     customCommand(e, function () {
                //         setTimeout(hide, 100);
                //     });
                // });

                // alignRight
                $alignRight.click(function (e) {
                    commandFn = function () {
                        // ��� img ���������ӣ���ô img.parent() ���� a ��ǩ������ align û�õģ���˱����ҵ� P ���ڵ������� align
                        $currentImg.parents('p').css({
                            'text-align': 'right'
                        }).attr('align', 'right');
                    };
                    customCommand(e, function () {
                        setTimeout(hide, 100);
                    });
                });

                // // �޸���
                // $noFloat.click(function (e) {
                //     commandFn = function () {
                //         $currentImg.css({
                //             float: 'none'
                //         });
                //     };
                //     customCommand(e, function () {
                //         setTimeout(hide, 100);
                //     });
                // });

                // alignCenter
                $alignCenter.click(function (e) {
                    commandFn = function () {
                        // ��� img ���������ӣ���ô img.parent() ���� a ��ǩ������ align û�õģ���˱����ҵ� P ���ڵ������� align
                        $currentImg.parents('p').css({
                            'text-align': 'center'
                        }).attr('align', 'center');
                    };
                    customCommand(e, function () {
                        setTimeout(hide, 100);
                    });
                });

                // link
                // ��ʾ����input
                $link.click(function (e) {
                    e.preventDefault();

                    // ��ȡ��ǰ���ӣ�����ʾ
                    currentLink = imgLink(e);
                    $linkInput.val(currentLink);

                    $menuContainer.hide();
                    $linkInputContainer.show();
                });
                // ��������
                $linkBtnSubmit.click(function (e) {
                    e.preventDefault();

                    var url = $.trim($linkInput.val());
                    if (url) {
                        // �������ӣ�ͬʱ���Զ����� currentLink ��ֵ
                        imgLink(e, url);
                    }

                    // ���� toolbar
                    setTimeout(hide);
                });
                // ȡ����������
                $linkBtnCancel.click(function (e) {
                    e.preventDefault();

                    // �������� input
                    $linkInput.val(currentLink);

                    $menuContainer.show();
                    $linkInputContainer.hide();
                });

                // unlink
                $unLink.click(function (e) {
                    e.preventDefault();

                    // ִ�� unlink
                    imgLink(e, '');

                    // ���� toolbar
                    setTimeout(hide);
                });
            }

            // ��drag�¼�
            function bindDragEvent() {
                var _x, _y;
                var dragMarginLeft, dragMarginTop;
                var imgWidth, imgHeight;

                function mousemove (e) {
                    var diffX, diffY;

                    // ������
                    diffX = e.pageX - _x;
                    diffY = e.pageY - _y;

                    // --------- ������ק���λ�� ---------
                    var currentDragMarginLeft = dragMarginLeft + diffX;
                    var currentDragMarginTop = dragMarginTop + diffY;
                    $dragPoint.css({
                        'margin-left': currentDragMarginLeft,
                        'margin-top': currentDragMarginTop
                    });

                    // --------- ����ͼƬ�Ĵ�С ---------
                    var currentImgWidth = imgWidth + diffX;
                    var currentImggHeight = imgHeight + diffY;
                    $currentImg && $currentImg.css({
                        width: currentImgWidth,
                        height: currentImggHeight
                    });
                }

                $dragPoint.on('mousedown', function(e){
                    if (!$currentImg) {
                        return;
                    }
                    // ��ǰ���λ��
                    _x = e.pageX;
                    _y = e.pageY;

                    // ��ǰ��ק���λ��
                    dragMarginLeft = parseFloat($dragPoint.css('margin-left'), 10);
                    dragMarginTop = parseFloat($dragPoint.css('margin-top'), 10);

                    // ��ǰͼƬ�Ĵ�С
                    imgWidth = $currentImg.width();
                    imgHeight = $currentImg.height();

                    // ���� $toolbar
                    $toolbar.hide();

                    // �󶨼����¼�
                    E.$document.on('mousemove._dragResizeImg', mousemove);
                    E.$document.on('mouseup._dragResizeImg', function (e) {
                        // ȡ����
                        E.$document.off('mousemove._dragResizeImg');
                        E.$document.off('mouseup._dragResizeImg');

                        // ���أ�����ԭ��ק���λ��
                        hide();
                        $dragPoint.css({
                            'margin-left': dragMarginLeft,
                            'margin-top': dragMarginTop
                        });

                        // ��¼
                        isOnDrag = false;
                    });

                    // ��¼
                    isOnDrag = true;
                });
            }

            // ��ʾ toolbar
            function show() {
                if (editor._disabled) {
                    // �༭���Ѿ������ã�������ʾ
                    return;
                }
                if ($currentImg == null) {
                    return;
                }
                $currentImg.addClass('clicked');
                var imgPosition = $currentImg.position();
                var imgTop = imgPosition.top;
                var imgLeft = imgPosition.left;
                var imgHeight = $currentImg.outerHeight();
                var imgWidth = $currentImg.outerWidth();


                // --- ��λ dragpoint ---
                $dragPoint.css({
                    top: imgTop + imgHeight,
                    left: imgLeft + imgWidth
                });

                // --- ��λ toolbar ---

                // ����������
                var top = imgTop + imgHeight;
                var left = imgLeft;
                var marginLeft = 0;

                var txtTop = $currentTxt.position().top;
                var txtHeight = $currentTxt.outerHeight();
                if (top > (txtTop + txtHeight)) {
                    // top ���ó����༭��Χ
                    top = txtTop + txtHeight;
                } else {
                    // top �����༭��Χ��dragPoint�Ͳ���ʾ��
                    $dragPoint.show();
                }

                // ��ʾ��������� margin��
                $toolbar.show();

                // ���� margin
                var width = $toolbar.outerWidth();
                marginLeft = imgWidth / 2 - width / 2;

                // ��λ
                $toolbar.css({
                    top: top + 5,
                    left: left,
                    'margin-left': marginLeft
                });
                // �����λ̫������
                if (marginLeft < 0) {
                    // �õ������ε�margin-left
                    $toolbar.css('margin-left', '0');
                    $triangle.hide();
                } else {
                    $triangle.show();
                }

                // disable �˵�
                editor.disableMenusExcept();
            }

            // ���� toolbar
            function hide() {
                if ($currentImg == null) {
                    return;
                }
                $currentImg.removeClass('clicked');
                $currentImg = null;

                $toolbar.hide();
                $dragPoint.hide();

                // enable �˵�
                editor.enableMenusExcept();
            }

            // �ж�img�Ƿ���һ������
            function isEmotion(imgSrc) {
                var result = false;
                if (!editor.emotionUrls) {
                    return result;
                }
                $.each(editor.emotionUrls, function (index, url) {
                    var flag = false;
                    if (imgSrc === url) {
                        result = true;
                        flag = true;
                    }
                    if (flag) {
                        return false;  // break ѭ��
                    }
                });
                return result;
            }

            // click img �¼�
            $currentTxt.on('mousedown', 'img', function (e) {
                e.preventDefault();
            }).on('click', 'img', function (e) {
                var $img = $(e.currentTarget);
                var src = $img.attr('src');

                if (!src || isEmotion(src)) {
                    // ��һ������ͼ��
                    return;
                }

                // ---------- ���Ǳ���ͼ�� ---------- 

                // ��Ⱦ
                render();

                if ($currentImg && ($currentImg.get(0) === $img.get(0))) {
                    setTimeout(hide, 100);
                    return;
                }

                // ��ʾ toolbar
                $currentImg = $img;
                show();

                // Ĭ����ʾmenuContainer������Ĭ������
                $menuContainer.show();
                $linkInputContainer.hide();

                // ��ֹð��
                e.preventDefault();
                e.stopPropagation();

            }).on('click keydown scroll', function (e) {
                if (!isOnDrag) {
                    setTimeout(hide, 100);
                }
            });

        });

    });
// �༭���� link toolbar
    _e(function (E, $) {
        E.plugin(function () {
            var editor = this;
            var lang = editor.config.lang;
            var $txt = editor.txt.$txt;

            // ��ǰ���е�����
            var $currentLink;

            var $toolbar = $('<div class="txt-toolbar"></div>');
            var $triangle = $('<div class="tip-triangle"></div>');
            var $triggerLink = $('<a href="#" target="_blank"><i class="wangeditor-menu-img-link"></i> ' + lang.openLink + '</a>');
            var isRendered;

            // ��¼��ǰ����ʾ/����״̬
            var isShow = false;

            var showTimeoutId, hideTimeoutId;
            var showTimeoutIdByToolbar, hideTimeoutIdByToolbar;

            // ��Ⱦ dom
            function render() {
                if (isRendered) {
                    return;
                }

                $toolbar.append($triangle)
                    .append($triggerLink);

                editor.$editorContainer.append($toolbar);

                isRendered = true;
            }

            // ��λ
            function setPosition() {
                if (!$currentLink) {
                    return;
                }

                var position = $currentLink.position();
                var left = position.left;
                var top = position.top;
                var height = $currentLink.height();

                // ��������topֵ
                var topResult = top + height + 5;

                // �ж� toolbar �Ƿ񳬹��˱༭��������±߽�
                var menuHeight = editor.menuContainer.height();
                var txtHeight = editor.txt.$txt.outerHeight();
                if (topResult > menuHeight + txtHeight) {
                    topResult = menuHeight + txtHeight + 5;
                }

                // ��������
                $toolbar.css({
                    top: topResult,
                    left: left
                });
            }

            // ��ʾ toolbar
            function show() {
                if (isShow) {
                    return;
                }

                if (!$currentLink) {
                    return;
                }

                render();

                $toolbar.show();

                // ��������
                var href = $currentLink.attr('href');
                $triggerLink.attr('href', href);

                // ��λ
                setPosition();

                isShow = true;
            }

            // ���� toolbar
            function hide() {
                if (!isShow) {
                    return;
                }

                if (!$currentLink) {
                    return;
                }

                $toolbar.hide();
                isShow = false;
            }

            // $txt ���¼�
            $txt.on('mouseenter', 'a', function (e) {
                // ��ʱ 500ms ��ʾtoolbar
                if (showTimeoutId) {
                    clearTimeout(showTimeoutId);
                }
                showTimeoutId = setTimeout(function () {
                    var a = e.currentTarget;
                    var $a = $(a);
                    $currentLink = $a;

                    var $img = $a.children('img');
                    if ($img.length) {
                        // �������°���һ��ͼƬ

                        // ͼƬ���ʱ������toolbar
                        $img.click(function (e) {
                            hide();
                        });

                        if ($img.hasClass('clicked')) {
                            // ͼƬ������clicked״̬������ʾtoolbar
                            return;
                        }
                    }

                    // ��ʾtoolbar
                    show();
                }, 500);
            }).on('mouseleave', 'a', function (e) {
                // ��ʱ 500ms ����toolbar
                if (hideTimeoutId) {
                    clearTimeout(hideTimeoutId);
                }
                hideTimeoutId = setTimeout(hide, 500);
            }).on('click keydown scroll', function (e) {
                setTimeout(hide, 100);
            });
            // $toolbar ���¼�
            $toolbar.on('mouseenter', function (e) {
                // ���жϵ� $txt.mouseleave ���µ�����
                if (hideTimeoutId) {
                    clearTimeout(hideTimeoutId);
                }
            }).on('mouseleave', function (e) {
                // ��ʱ 500ms ��ʾtoolbar
                if (showTimeoutIdByToolbar) {
                    clearTimeout(showTimeoutIdByToolbar);
                }
                showTimeoutIdByToolbar = setTimeout(hide, 500);
            });
        });
    });
// menu����
    _e(function (E, $) {

        E.plugin(function () {
            var editor = this;
            var menuFixed = editor.config.menuFixed;
            if (menuFixed === false || typeof menuFixed !== 'number') {
                // û�����ò˵�����
                return;
            }
            var bodyMarginTop = parseFloat(E.$body.css('margin-top'), 10);
            if (isNaN(bodyMarginTop)) {
                bodyMarginTop = 0;
            }

            var $editorContainer = editor.$editorContainer;
            var editorTop = $editorContainer.offset().top;
            var editorHeight = $editorContainer.outerHeight();

            var $menuContainer = editor.menuContainer.$menuContainer;
            var menuCssPosition = $menuContainer.css('position');
            var menuCssTop = $menuContainer.css('top');
            var menuTop = $menuContainer.offset().top;
            var menuHeight = $menuContainer.outerHeight();

            var $txt = editor.txt.$txt;

            E.$window.scroll(function () {
                //ȫ��ģʽ��֧��
                if (editor.isFullScreen) {
                    return;
                }

                var sTop = E.$window.scrollTop();

                // ��Ҫ���¼����ȣ���Ϊ��������ܴ�ʱ���ֹ�����
                var menuWidth = $menuContainer.width();

                // ��� menuTop === 0 ˵����ǰ�༭��һֱ���أ�������ʾ�����ˣ�Ҫ���¼����������
                if (menuTop === 0) {
                    menuTop = $menuContainer.offset().top;
                    editorTop = $editorContainer.offset().top;
                    editorHeight = $editorContainer.outerHeight();
                    menuHeight = $menuContainer.outerHeight();
                }

                if (sTop >= menuTop && sTop + menuFixed + menuHeight + 30 < editorTop + editorHeight) {
                    // ����
                    $menuContainer.css({
                        position: 'fixed',
                        top: menuFixed
                    });

                    // �̶����
                    $menuContainer.width(menuWidth);

                    // ����body margin-top
                    E.$body.css({
                        'margin-top': bodyMarginTop + menuHeight
                    });

                    // ��¼
                    if (!editor._isMenufixed) {
                        editor._isMenufixed = true;
                    }
                } else {
                    // ȡ������
                    $menuContainer.css({
                        position: menuCssPosition,
                        top: menuCssTop
                    });

                    // ȡ����ȹ̶�
                    $menuContainer.css('width', '100%');

                    // ��ԭ body margin-top
                    E.$body.css({
                        'margin-top': bodyMarginTop
                    });

                    // ������¼
                    if (editor._isMenufixed) {
                        editor._isMenufixed = false;
                    }
                }
            });
        });

    });
// ���� �˵����
    _e(function (E, $) {

        // �� createMenu ���������˵�
        E.createMenu(function (check) {

            // ����˵�id����Ҫ�������˵�id�ظ����༭���Դ������в˵�id����ͨ������������-�Զ���˵���һ�ڲ鿴
            var menuId = 'indent';

            // check�����˵����ã�����������-�Զ���˵���һ�����������Ƿ�ò˵�id�����û�У����������Ĵ��롣
            if (!check(menuId)) {
                return;
            }

            // this ָ�� editor ��������
            var editor = this;

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,  // �༭������
                id: menuId,  // �˵�id
                title: '����', // �˵�����

                // ����״̬��ѡ��װ�µ�dom������ʽ��Ҫ�Զ���
                $domNormal: $('<a href="#" tabindex="-1"><i class="wangeditor-menu-img-indent-left"></i></a>'),
                $domSelected: $('<a href="#" tabindex="-1" class="selected"><i class="wangeditor-menu-img-indent-left"></i></a>')
            });

            // �˵�����״̬�£�������������¼�
            menu.clickEvent = function (e) {
                var elem = editor.getRangeElem();
                var p = editor.getSelfOrParentByName(elem, 'p');
                var $p;

                if (!p) {
                    // δ�ҵ� p Ԫ�أ������
                    return e.preventDefault();
                }
                $p = $(p);

                // ʹ���Զ�������
                function commandFn() {
                    $p.css('text-indent', '2em');
                }
                editor.customCommand(e, commandFn);
            };

            // �˵�ѡ��״̬�£�������������¼�
            menu.clickEventSelected = function (e) {
                var elem = editor.getRangeElem();
                var p = editor.getSelfOrParentByName(elem, 'p');
                var $p;

                if (!p) {
                    // δ�ҵ� p Ԫ�أ������
                    return e.preventDefault();
                }
                $p = $(p);

                // ʹ���Զ�������
                function commandFn() {
                    $p.css('text-indent', '0');
                }
                editor.customCommand(e, commandFn);
            };

            // ���ݵ�ǰѡ�����Զ�����²˵���ѡ��״̬��������״̬
            menu.updateSelectedEvent = function () {
                // ��ȡ��ǰѡ�����ڵĸ�Ԫ��
                var elem = editor.getRangeElem();
                var p = editor.getSelfOrParentByName(elem, 'p');
                var $p;
                var indent;

                if (!p) {
                    // δ�ҵ� p Ԫ�أ�����Ϊδ����ѡ��״̬
                    return false;
                }
                $p = $(p);
                indent = $p.css('text-indent');

                if (!indent || indent === '0px') {
                    // �õ���p��text-indent ������ 0������Ϊδ����ѡ��״̬
                    return false;
                }

                // �ҵ� p Ԫ�أ����� text-indent ���� 0������Ϊѡ��״̬
                return true;
            };

            // ���ӵ�editor������
            editor.menus[menuId] = menu;
        });

    });
// �и� �˵����
    _e(function (E, $) {

        // �� createMenu ���������˵�
        E.createMenu(function (check) {

            // ����˵�id����Ҫ�������˵�id�ظ����༭���Դ������в˵�id����ͨ������������-�Զ���˵���һ�ڲ鿴
            var menuId = 'lineheight';

            // check�����˵����ã�����������-�Զ���˵���һ�����������Ƿ�ò˵�id�����û�У����������Ĵ��롣
            if (!check(menuId)) {
                return;
            }

            // this ָ�� editor ��������
            var editor = this;

            // �������������֧�� lineHeight ������Ҫ��һ��hook
            editor.commandHooks.lineHeight = function (value) {
                var rangeElem = editor.getRangeElem();
                var targetElem = editor.getSelfOrParentByName(rangeElem, 'p,h1,h2,h3,h4,h5,pre');
                if (!targetElem) {
                    return;
                }
                $(targetElem).css('line-height', value + '');
            };

            // ���� menu ����
            var menu = new E.Menu({
                editor: editor,  // �༭������
                id: menuId,  // �˵�id
                title: '�и�', // �˵�����
                commandName: 'lineHeight', // ��������

                // ����״̬��ѡ��װ�µ�dom������ʽ��Ҫ�Զ���
                $domNormal: $('<a href="#" tabindex="-1"><i class="wangeditor-menu-img-arrows-v"></i></a>'),
                $domSelected: $('<a href="#" tabindex="-1" class="selected"><i class="wangeditor-menu-img-arrows-v"></i></a>')
            });

            // ����Դ
            var data  = {
                // ��ʽ�� 'value' : 'title'
                '1.0': '1.0��',
                '1.5': '1.5��',
                '1.8': '1.8��',
                '2.0': '2.0��',
                '2.5': '2.5��',
                '3.0': '3.0��'
            };

            // Ϊmenu����droplist����
            var tpl = '<span style="line-height:{#commandValue}">{#title}</span>';
            menu.dropList = new E.DropList(editor, menu, {
                data: data,  // ��������Դ
                tpl: tpl  // ����ģ��
            });

            // ���ӵ�editor������
            editor.menus[menuId] = menu;

        });

    });
// �Զ����ϴ�
    _e(function (E, $) {

        E.plugin(function () {

            var editor = this;
            var customUpload = editor.config.customUpload;
            if (!customUpload) {
                return;
            } else if (editor.config.uploadImgUrl) {
                alert('�Զ����ϴ���Ч���꿴�������־console.log');
                E.error('�Ѿ������� uploadImgUrl ���Ͳ��������� customUpload �����߳�ͻ���������Զ����ϴ���Ч��');
                return;
            }

            var $uploadContent = editor.$uploadContent;
            if (!$uploadContent) {
                E.error('�Զ����ϴ����޷���ȡ editor.$uploadContent');
            }

            // UI
            var $uploadIcon = $('<div class="upload-icon-container"><i class="wangeditor-menu-img-upload"></i></div>');
            $uploadContent.append($uploadIcon);

            // ����id������¶
            var btnId = 'upload' + E.random();
            var containerId = 'upload' + E.random();
            $uploadIcon.attr('id', btnId);
            $uploadContent.attr('id', containerId);

            editor.customUploadBtnId = btnId;
            editor.customUploadContainerId = containerId;
        });

    });
// ��Ȩ��ʾ
    _e(function (E, $) {
        E.info('��ҳ�渻�ı��༭���� wangEditor �ṩ http://wangeditor.github.io/ ');
    });

    // ���շ���wangEditor���캯��
    return window.wangEditor;
});