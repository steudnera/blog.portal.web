/**
 * 忘记密码
 * @author Philip
 */
import '../less/forget-password.less'

const $SendVerifyEmail = $('#send-verify-email')
const $Account = $('#account')

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
        $Account.attr('disabled', 'disabled')
        $Account.html('正在登录...')
    } else {
        $Account.removeAttr('disabled')
        $Account.html('登录')
    }
}

$SendVerifyEmail.click(() => {
    const account = $Account.val()

    toggleProcessing(true)

    $.ajax({
        url: '/api/sendResetPasswordLink',
        method: 'post',
        contentType: 'application/json',
        data: JSON.stringify({
            account
        })
    }).then(() => {
        window.location.href = '/charts'
    }, (res) => {
        const { status, responseJSON } = res

        if (responseJSON) {
            $.toast(Object.assign({ text: responseJSON.message || `未知错误${status}` }, toastConfig))
        } else {
            $.toast('错误', toastConfig)
        }
    }).done(() => {
        toggleProcessing(false)
    })
})
