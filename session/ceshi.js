var user={loginName:'eee',loginId:'4492658731'};
sessionStorage.setItem('userData',JSON.stringify(user));

window.onload= function () {
    var  loginInfo=JSON.parse(sessionStorage.getItem('userData'));
    var loginId=loginInfo.loginId;
    var loginName=loginInfo.loginName;
    $('#loginAdmin_ym').html(loginName);
    console.log(loginInfo)
    console.log(loginId)
    console.log(loginName)
}