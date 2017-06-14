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
     "title": "数据统计",
     "path": "",
     "type": 0,
     "child": [
     {
     "title": "用户统计",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "交易统计",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     }
     ],
     "isEnable": 1
     },
     {
     "title": "街道管理",
     "path": "",
     "type": 0,
     "child": [
     {
     "title": "功能管理",
     "path": "baidu",
     "type": 1,
     "child": [
     {
     "title": "街道",
     "path": "baidu",
     "type": 1,
     "child": [
     {
     "title": "街道简介",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "办公职能",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "居委信息",
     "path": "bai",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "网格管理",
     "path": "bai",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "街道特色",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "周边快查",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "关心青少年",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     }
     ],
     "isEnable": 1
     },
     {
     "title": "城市服务",
     "path": "baidu",
     "type": 1,
     "child": [
     {
     "title": "生活缴费",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "生活服务",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "商家促销",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "楼宇信息",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "企业信息",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "楼宇活动",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     }
     ],
     "isEnable": 1
     },
     {
     "title": "便民服务",
     "path": "baidu",
     "type": 1,
     "child": [
     {
     "title": "党员组织管理",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "社区活动",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "助老服务",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "助残服务",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     }
     ],
     "isEnable": 1
     },
     {
     "title": "受理中心",
     "path": "baidu",
     "type": 1,
     "child": [
     {
     "title": "司法篇",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "卫生计生篇",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "教育篇",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "人社篇",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "残联篇",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "住建篇",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "党建篇",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "慈善救助篇",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "工会篇",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "民政篇",
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
     "title": "首页轮播",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "消息推送",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "资讯管理",
     "path": "baidu",
     "type": 1,
     "child": [
     {
     "title": "群团专题",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "法律政策",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "两学一做",
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
     "title": "用户管理",
     "path": "",
     "type": 0,
     "child": [
     {
     "title": "用户提交数据",
     "path": "baidu",
     "type": 1,
     "child": [
     {
     "title": "生活缴费",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "楼宇信息",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "企业信息",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "楼宇活动",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "党员组织管理",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "社区活动",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "助老服务",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "助残服务",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "百姓监督",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     }
     ],
     "isEnable": 1
     },
     {
     "title": "用户信息",
     "path": "2",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "受理中心",
     "path": "baidu",
     "type": 1,
     "child": [
     {
     "title": "司法篇",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "卫生计生篇",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "教育篇",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "人社篇",
     "path": "bai",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "残联篇",
     "path": "bai",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "住建篇",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "党建篇",
     "path": "bai",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "慈善救助篇",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "工会篇",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "民政篇",
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
     "title": "账号管理",
     "path": "",
     "type": 0,
     "child": [
     {
     "title": "修改账户信息",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "设置子管理员",
     "path": "baidu",
     "type": 1,
     "child": [ ],
     "isEnable": 1
     },
     {
     "title": "信箱",
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