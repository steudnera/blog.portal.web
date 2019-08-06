/**
 * 重设密码
 * @author Philip
 */
import '../less/reset-password.less'

const $repassword = $('#repassword')
const $password = $('#password')
const $btnReset = $('#btn-reset')

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
        $btnReset.attr('disabled', 'disabled')
        $btnReset.html('正在注册...')
    } else {
        $btnReset.removeAttr('disabled')
        $btnReset.html('正在注册')
    }
}

$btnReset.click(() => {
    const password = $password.val()
    const repassword = $repassword.val()

    toggleProcessing(true)

    $.ajax({
        url: '/api/reset-password',
        method: 'post',
        contentType: 'application/json',
        data: JSON.stringify({
            password,
            repassword
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
