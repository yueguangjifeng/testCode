if (sessionStorage.getItem('userData')){
    var user=JSON.parse(sessionStorage.getItem('userData'));
} else {
    location.href='http://backend.jgsoft.org/web_front/views_zong/index.html';
    /*            user={
     "loginId": "7288351469",
     "loginName": "aaa",
     "mobile": "13018457142",
     "img": "http://ok9xod9sy.bkt.clouddn.com/2ecadb3834dc49be8ba268af43e50159",
     "streetId": "1446985237",
     "token": "75183C40D2C2F43603BB090F2C7DECBF91B0B865",
     "email": "12401@qq.com",
     "adminType": 1,
     "menuList": [
     {
     "title": "����ͳ��",
     "path": "",
     "type": 0,
     "child": [
     {
     "title": "�û�ͳ��",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "����ͳ��",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     }
     ],
     "isEnable": 1
     },
     {
     "title": "�ֵ�����",
     "path": "",
     "type": 0,
     "child": [
     {
     "title": "���ܹ���",
     "path": "baidu",
     "type": 1,
     "child": [
     {
     "title": "�ֵ�",
     "path": "baidu",
     "type": 1,
     "child": [
     {
     "title": "�ֵ����",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "�칫ְ��",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "��ί��Ϣ",
     "path": "bai",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "�������",
     "path": "bai",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "�ֵ���ɫ",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "�ܱ߿��",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "����������",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     }
     ],
     "isEnable": 1
     },
     {
     "title": "���з���",
     "path": "baidu",
     "type": 1,
     "child": [
     {
     "title": "����ɷ�",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "�������",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "�̼Ҵ���",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "¥����Ϣ",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "��ҵ��Ϣ",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "¥��",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     }
     ],
     "isEnable": 1
     },
     {
     "title": "�������",
     "path": "baidu",
     "type": 1,
     "child": [
     {
     "title": "��Ա��֯����",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "�����",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "���Ϸ���",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "���з���",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     }
     ],
     "isEnable": 1
     },
     {
     "title": "��������",
     "path": "baidu",
     "type": 1,
     "child": [
     {
     "title": "˾��ƪ",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "��������ƪ",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "����ƪ",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "����ƪ",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "����ƪ",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "ס��ƪ",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "����ƪ",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "���ƾ���ƪ",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "����ƪ",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "����ƪ",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     }
     ],
     "isEnable": 1
     }
     ],
     "isEnable": 1
     },
     {
     "title": "��ҳ�ֲ�",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "��Ϣ����",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "��Ѷ����",
     "path": "baidu",
     "type": 1,
     "child": [
     {
     "title": "Ⱥ��ר��",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "��������",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "��ѧһ��",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     }
     ],
     "isEnable": 1
     }
     ],
     "isEnable": 1
     },
     {
     "title": "�û�����",
     "path": "",
     "type": 0,
     "child": [
     {
     "title": "�û��ύ����",
     "path": "baidu",
     "type": 1,
     "child": [
     {
     "title": "����ɷ�",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "¥����Ϣ",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "��ҵ��Ϣ",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "¥��",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "��Ա��֯����",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "�����",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "���Ϸ���",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "���з���",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "���ռල",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     }
     ],
     "isEnable": 1
     },
     {
     "title": "�û���Ϣ",
     "path": "2",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "��������",
     "path": "baidu",
     "type": 1,
     "child": [
     {
     "title": "˾��ƪ",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "��������ƪ",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "����ƪ",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "����ƪ",
     "path": "bai",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "����ƪ",
     "path": "bai",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "ס��ƪ",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "����ƪ",
     "path": "bai",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "���ƾ���ƪ",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "����ƪ",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "����ƪ",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     }
     ],
     "isEnable": 1
     }
     ],
     "isEnable": 1
     },
     {
     "title": "�˺Ź���",
     "path": "",
     "type": 0,
     "child": [
     {
     "title": "�޸��˻���Ϣ",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "�����ӹ���Ա",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "����",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     }
     ],
     "isEnable": 1
     }
     ]
     }*/
}