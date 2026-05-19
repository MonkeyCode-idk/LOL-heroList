// 返回首页
function goBack() {
  window.location.href = 'index.html'
}

// 英雄小图
let iconImg
// 英雄名字
let heroName
// 英雄标题
let heroTitle
// 英雄站位
let heroPosition
// 获取英雄ID
const urlParams = new URLSearchParams(window.location.search)
// 英雄ID
const heroId = urlParams.get('id')
console.log(`当前英雄ID${heroId}`);
const heroList = document.querySelector('.heroList')

// 添加活动active类
document.querySelector('.nav ul').addEventListener('click', (e) => {
  document.querySelector('.nav ul .active').classList.remove('active')

  e.target.classList.add('active')
  console.log(e.target.innerHTML);
  if (e.target.innerHTML === '英雄皮肤') {
    document.querySelector('.right-info .skill-box').classList.add('active-hiden')
    document.querySelector('.right-info .heroList').classList.add('active-show')
  } else if (e.target.innerHTML === '英雄技能') {
    document.querySelector('.right-info .skill-box').classList.remove('active-hiden')
    document.querySelector('.right-info .heroList').classList.remove('active-show')
  }

})

axios({
  url: `https://game.gtimg.cn/images/lol/act/img/js/hero/${heroId}.js`
}).then(result => {
  console.log(`当前英雄所有数据`);
  console.log(result);
  iconImg = result.data.skins[0].iconImg
  heroName = result.data.hero.name
  heroTitle = result.data.hero.title
  heroPosition = result.data.hero.roles.map(Element => {
    const chinese = []
    if (Element === 'mage') {
      const name = '法师'
      chinese.push(name)
    } else if (Element === 'fighter') {
      const name = '战士'
      chinese.push(name)
    } else if (Element === 'tank') {
      const name = '坦克'
      chinese.push(name)
    } else if (Element === 'assassin') {
      const name = '刺客'
      chinese.push(name)
    } else if (Element === 'support') {
      const name = '辅助'
      chinese.push(name)
    } else if (Element === 'marksman') {
      const name = '射手'
      chinese.push(name)
    }
    return chinese
  })
  // 获取技能对象
  const spells = result.data.spells
  // 遍历技能属性
  skillRender(spells)
  const skinData = result.data.skins
  console.log(skinData);
  // 皮肤
  for (let i = 0; i < skinData.length; i++) {
    if (i === 0) {
      // 原画
      const url = skinData[i].mainImg
      document.body.style.backgroundImage = `url(${url})`
      document.body.style.backgroundSize = 'cover'      // 覆盖整个页面
      document.body.style.backgroundPosition = 'center' // 居中
      document.body.style.backgroundRepeat = 'no-repeat' // 不重复
      document.body.style.backgroundAttachment = 'fixed' // 固定不滚动
    } else {
      // 皮肤链接
      const url = skinData[i].mainImg
      // 皮肤名字
      const skinName = skinData[i].name
      if (url !== '') {
        const div = document.createElement('DIV')
        div.className = 'heroskin'
        div.innerHTML = `
     <img src="${url}" alt="">
     <h2>${skinName}</h2>
    `
        heroList.appendChild(div)
      }
    }
  }
  // 皮肤渲染好后绑定点击事件
  document.querySelector('.heroList').addEventListener('click', function (e) {

    // 关键：找到被点击的 .heroskin 元素（无论点击到img、h2还是div本身）
    const heroSkin = e.target.closest('.heroskin');

    // 确保找到了且在当前的heroList内
    if (heroSkin && heroSkin.parentElement === this) {
      // 获取皮肤信息
      const title = heroSkin.querySelector('h2').textContent;
      const imgSrc = heroSkin.querySelector('img').src;
      console.log('你点击了：', title);
      console.log('图片地址：', imgSrc);
      document.querySelector('.card').innerHTML = `
         <img src="${imgSrc}" alt="">
        <button class="hidden">X</button>
      `
      document.querySelector('.card').classList.add('cardShow')
      document.querySelector('.hidden').addEventListener('click', () => {
        document.querySelector('.card').classList.remove('cardShow')
      })
    };
  })
})
function skillRender(spells) {
  // 创建空对象存储分类后的技能
  const skillMap = {}
  spells.forEach(spell => {
    const key = spell.spellKey
    skillMap[key] = spell
  })
  // console.log('当前打印映射后的技能对象');
  // console.log(skillMap);
  const order = ['passive', 'q', 'w', 'e', 'r']
  const chineseName = {
    passive: '被动技能',
    q: 'Q技能',
    w: 'W技能',
    e: 'E技能',
    r: 'R技能'
  }
  order.forEach(key => {
    const spell = skillMap[key]
    // console.log(spell);
    // 技能详细介 = spell
    const skillInfo = spell.description
    // 技能图片
    const skillImg = spell.abilityIconPath
    // 技能名字
    const skillName = spell.name
    // 技能消耗
    const skillCost = spell.cost
    // 渲染技能DOM
    const skillBox = document.querySelector('.skill-box')
    // 渲染英雄图标DOM
    const div = document.createElement('DIV')
    document.querySelector('.min-hero').innerHTML = `
     <img src="${iconImg}" alt="">
        <h3 class="title">${heroName}</h3>
        <p class="name">${heroTitle}</p>
        <p class="position">${heroPosition}</p>
    `
    if (spell && skillCost != '') {
      div.innerHTML = `
    <img src="${skillImg}" alt="">
          <h2 class="skill-name">${skillName}</h2>
          <p class="skillInfo">${skillInfo}</p>
          <p class="skill-cost">技能消耗<br>${skillCost}</p>
          `
    } else {
      div.innerHTML = `
    <img src="${skillImg}" alt="">
          <h2 class="skill-name">${skillName}</h2>
          <p class="skillInfo">${skillInfo}</p>
          <p class="skill-cost" >被动技能无消耗</p>
          `
    }
    skillBox.appendChild(div)
  })
}
