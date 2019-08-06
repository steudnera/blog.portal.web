/**
 * 注册
 * @author Philip
 */
import '../less/register.less'

const $phoneNumberEmail = $('#phonenumber_email')
const $repassword = $('#repassword')
const $password = $('#password')
const $btnRassword = $('#btn-register')

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
        $btnRassword.attr('disabled', 'disabled')
        $btnRassword.html('正在注册...')
    } else {
        $btnRassword.removeAttr('disabled')
        $btnRassword.html('正在注册')
    }
}

$btnRassword.click(() => {
    const phoneNumberEmail = $phoneNumberEmail.val()
    const repassword = $repassword.val()
    const password = $password.val()

    toggleProcessing(true)

    $.ajax({
        url: '/api/register',
        method: 'post',
        contentType: 'application/json',
        data: JSON.stringify({
            phoneNumberEmail,
            repassword,
            password
        })
    }).then(() => {
        window.location.href = '/charts'
    }, (res) => {
        const { status, responseJSON } = res

        if (responseJSON) {
            $.toast(Object.assign({
                text: responseJSON.message || `未知错误${status}`
            }, toastConfig))
        } else {
            $.toast('错误', toastConfig)
        }
    }).done(() => {
        toggleProcessing(false)
    })
})
