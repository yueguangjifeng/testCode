(function () {

    // ��ȡ wangEditor ���캯���� jquery
    var E = window.wangEditor;
    var $ = window.jQuery;

    // �� createMenu ���������˵�
    E.createMenu(function (check) {

        // ����˵�id����Ҫ�������˵�id�ظ����༭���Դ������в˵�id����ͨ������������-�Զ���˵���һ�ڲ鿴
        var menuId = 'symbol';

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
            $domNormal: $('<a href="#" tabindex="-1"><i class="wangeditor-menu-img-omega"></i></a>'),
            $domSelected: $('<a href="#" tabindex="-1" class="selected"><i class="wangeditor-menu-img-omega"></i></a>')
        });

        // Ҫ����ķ��ţ���������ӣ�
        var symbols = ['��'/*, '��', '��', '��', '��', '��', '��'*/]

        // panel ����
        var $container = $('<div></div>');
        $.each(symbols, function (k, value) {
            $container.append('<a href="#" style="display:inline-block;margin:5px;">' + value + '</a>');
        });

        // ������ŵ��¼�
        $container.on('click', 'a', function (e) {
            var $a = $(e.currentTarget);
            var s = $a.text();

            // ִ�в��������
            editor.command(e, 'append', s);
        });

        // ���panel
        menu.dropPanel = new E.DropPanel(editor, menu, {
            $content: $container,
            width: 350
        });

        // ���ӵ�editor������
        editor.menus[menuId] = menu;
    });

})();