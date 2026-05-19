// selectAudio 选择英雄时的语音 https://game.gtimg.cn/images/lol/act/img/vo/choose/1.ogg
// banAudio 被禁用时的语音 https://game.gtimg.cn/images/lol/act/img/vo/ban/1.ogg
// 接口
// https://game.gtimg.cn/images/lol/act/img/js/heroList/hero_list.js

// 英雄语音
axios({
  url: 'https://game.gtimg.cn/images/lol/act/img/js/heroList/hero_list.js'
}).then(res => {
  console.log(res);
  const allOgg = res.data.hero
})
// 判断有没有本地tokens，没有直接回去
if (localStorage.getItem('tokens')) {
  // console.log(11);
} else {
  document.querySelector('body').innerHTML = ''
  setTimeout(() => {
    location.href = './login.html'
  }, 0)
  alert('您的本地当前没有tokens密钥,无法查看当前网页内容,请重新登陆获取')


}


// 版本
let version
// 所有英雄数据
let AllHero
// 英雄原画ID
let heroUrl = []
// 请求英雄数据
// 1.版本号
axios({
  url: 'https://ddragon.leagueoflegends.com/api/versions.json',
}).then(res => {
  version = res.data[0]
  console.log(`最新版本号是:${version}`);
  // 获取英雄数据
  axios({
    url: `https://ddragon.leagueoflegends.com/cdn/${version}/data/zh_CN/champion.json`
  }).then(result => {
    // console.log(result);
    // 全部英雄数据
    AllHero = result.data.data
    console.log(AllHero);
    // 获取成功后默认渲染全部
    render(AllHero)
    // 添加委托点击事件
    document.querySelector('.nav').addEventListener('click', function (e) {
      // 绑定active属性
      document.querySelector('.nav .active').classList.remove('active')
      //console.log(e.target);//<li id="Fighter">战士</li>
      e.target.classList.add('active')
      // 点击目标导航栏的ID属性
      const clickId = e.target.id
      // console.log(clickId);
      render(AllHero, clickId)
    })
  })
})

// 获取显示弹窗
const card = document.querySelector('.card')
// 渲染英雄
function render(heroData, postion = '') {
  const box = document.querySelector('.heroList')
  // 渲染前先清空原有的标签
  box.innerHTML = ''
  if (postion !== '' && postion != 'All') {
    // 获取英雄定位
    // 遍历英雄数据
    for (let id in heroData) {

      const hero = heroData[id]
      // 站位
      const positon = hero.tags
      // 遍历当前符合条件的站位英雄
      for (let i = 0; i < positon.length; i++) {
        if (postion === positon[i]) {
          const name = hero.name
          const title = hero.title
          // 站位
          const positon = hero.tags
          const heroId = hero.key
          // console.log(hero);
          const heroUrl = hero.image.full

          // 大头照
          const imgUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${heroUrl}`
          const div = document.createElement('DIV')
          div.className = 'hero'
          div.dataset.id = heroId
          div.innerHTML = `
        <img src="${imgUrl}" alt="">
        <h4>${name}</h4>
        <p style="font-size:12px">${title}</p>
        <p style="font-size:10px; color:#666">${positon}</p>
        `
          div.addEventListener('click', function () {
            document.getElementById('modalOverlay').style.display = 'block'
            card.style.display = 'block'
            card.style.opacity = 1
            renderCard(hero)
            document.querySelector('.card .exit').addEventListener('click', () => {
              document.getElementById('modalOverlay').style.display = 'none'
              card.style.display = 'none'
              card.style.opacity = 0
              banHero(hero)
            })
            document.querySelector('.card .more').addEventListener('click', function () {
              // 从你的英雄数据中获取数字ID
              const heroId = hero.key   // 或者 hero.id，看你的数据结构
              window.location.href = `detail.html?id=${heroId}`
            })
          })
          box.appendChild(div)
        }
      }
    }
  } else if (postion === 'All') {
    fn(heroData)
  }
  else if (postion === '') {
    fn(heroData)
  }
  function fn(Data) {
    // 遍历英雄数据
    for (let id in Data) {
      const hero = Data[id]

      const name = hero.name
      const title = hero.title
      // 站位
      const positon = hero.tags
      // console.log(hero);
      const heroId = hero.key
      const heroUrl = hero.image.full
      // 大头照
      const imgUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${heroUrl}`
      const div = document.createElement('DIV')
      div.className = 'hero'
      div.dataset.id = heroId
      div.innerHTML = `
        <img src="${imgUrl}" alt="">
        <h4>${name}</h4>
        <p style="font-size:12px">${title}</p>
        <p style="font-size:10px; color:#666">${positon}</p>
        `
      div.addEventListener('click', function () {
        document.getElementById('modalOverlay').style.display = 'block'
        card.style.display = 'block'
        card.style.opacity = 1
        renderCard(hero)
        document.querySelector('.card .exit').addEventListener('click', () => {
          banHero(hero)
          document.getElementById('modalOverlay').style.display = 'none'
          card.style.display = 'none'
          card.style.opacity = 0
        })
        document.querySelector('.card .more').addEventListener('click', function () {
          // 从你的英雄数据中获取数字ID
          const heroId = hero.key   // 或者 hero.id，看你的数据结构
          window.location.href = `detail.html?id=${heroId}`
        })
      })
      box.appendChild(div)
    }
  }
}

// // 卡片渲染
function renderCard(hero) {
  // 英雄key
  const key = hero.key
  document.querySelector('.music').innerHTML = `
            <audio src="https://game.gtimg.cn/images/lol/act/img/vo/choose/${key}.ogg" autoplay ></audio>
            `
  const name = hero.name
  // 原画url
  const correctImgUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${hero.id}_0.jpg`;
  document.querySelector('.card').innerHTML = `
         <!-- 英雄原画 -->
           <img src="${correctImgUrl}" class="card-img-top" alt="...">
           <h5 class="card-title">${name}</h5>
           <!-- 英雄介绍 -->
           <div class="card-body">
             <p class="card-text">
              ${hero.blurb}
           </div>
           <ul class="list-group list-group-flush">
             <li class="list-group-item more">详情</li>
             <li class="list-group-item exit">关闭</li>
             <!-- <li class="list-group-item">A third item</li> -->
           </ul>
        `
}

// 点击取消弹框播放ban语言
function banHero(hero) {
  // 英雄key
  const key = hero.key
  document.querySelector('.music').innerHTML = `
            <audio src="https://game.gtimg.cn/images/lol/act/img/vo/ban/${key}.ogg" autoplay ></audio>
            `
}
