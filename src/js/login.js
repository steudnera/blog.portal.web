/**
 * 登陆
 * @author Philip
 */
import '../less/login.less'

const $Username = $('#username')
const $Password = $('#password')
const $Login = $('#login')

const toastConfig = {
    showHideTransition: 'slide',
    bgColor: '#333',
    loader: false,
    textColor: '#fff',
    allowToastClose: false,
    hideAfter: 3000,
    stack: 5,
    textAlign: 'center',
    position: {
        top: 20,
        right: 85
    },
    icon: 'error'
}

const toggleProcessing = function (processing) {
    if (processing) {
        $Login.attr('disabled', 'disabled')
        $Login.html('正在登录...')
    } else {
        $Login.removeAttr('disabled')
        $Login.html('登录')
    }
}

$Login.click(() => {
    let unReg = /\w{6,}/
    let pwReg = /$\w(\w|\d){7,}^/

    let username = $Username.val()
    let password = $Password.val()

    if (!username && !unReg.test(username)) {
        $.toast(Object.assign({ text: '用户名填写错误' }, toastConfig))

        return
    }

    if (!password && !pwReg.test(password)) {
        $.toast(Object.assign({ text: '密码填写错误' }, toastConfig))

        return
    }

    toggleProcessing(true)

    $.ajax({
        url: '/api/login',
        method: 'post',
        contentType: 'application/json',
        data: JSON.stringify({
            username,
            password
        })
    }).then(() => {
        window.location.href = '/charts'
    }, (res) => {
        let { status, responseJSON } = res

        if (responseJSON) {
            $.toast(Object.assign({ text: responseJSON.message || `未知错误${status}` }, toastConfig))
        } else {
            $.toast('错误', toastConfig)
        }
    }).done(() => {
        toggleProcessing(false)
    })
})
