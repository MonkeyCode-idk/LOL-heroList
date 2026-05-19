
const data = new Date()
const nowDate = `${data.getFullYear()}/${data.getMonth() + 1}/${data.getDate()}`;
console.log(nowDate);

document.querySelector('button').addEventListener('click', () => {
    const inputDate = document.querySelector('.form-control').value
    if (inputDate !== nowDate) {
        myAlert(false, '当天日期输入错误')
        console.log(inputDate);

    } else if (inputDate === nowDate) {
        myAlert(true, '登陆成功')
        // 登陆成功后存一个token给本地
        const id = '急急急我是急急国王'
        localStorage.setItem('tokens', id)
        setTimeout(() => {
            // 延迟跳转，让alert警告框停留一会
            location.href = './index.html'
        }, 1500)
    }
})



