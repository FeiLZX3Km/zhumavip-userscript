// ==UserScript==
// @name         竹马法考-解析自动展开+界面紧凑磨砂
// @namespace    abu.zhumavip
// @version      3.18.1
// @license      MIT
// @description  ① 解析自动展开；② 左卡收起极窄条；③ 四按钮+统计卡入左卡；④ 分屏：题目(左)|可拖拽分割线|解析(右)——克隆镜像模式(原件留原地给React,面板显示副本,签名变化自动重克隆)；⑤ 打分卡头行并一行+打分提示入口最右；⑥ 视频/音频解析页：真播放器随分屏入驻面板(克隆死件回填原位当占位)，分屏与播放兼得；⑦ 分屏开/关状态记忆：菜单切换后写入 localStorage，刷新或重开解析页沿用上次选择(首次安装默认分屏)；⑧ 面包屑修复：报告页「知识网刷题/章节练习」返回该部门法的练习目录页而非 /w/questionBank(按 URL 参数识别部门法，全科目通用)；⑨ 分屏左栏长题干全文：解除题干/选项区的定高与行数截断，题干自然撑高、下方选项随之下移；并让展开按钮在原件隐藏态仍可点(克隆副本不再空点)；⑩ 深浅色主题：跟随浏览器 prefers-color-scheme 自动切换，菜单可固定浅/深色并记住选择，图片与视频不染色。
// @author       WorkBuddy & FeiLZX3Km
// @match        *://www.zhumavip.com/*
// @match        *://www.zhongheschool.com/*
// @run-at       document-idle
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
  'use strict';

  /* ==================================================================
   * 说明：本构建(2026_10_15)的 CSS Modules hash 选择器放在 HASH 里。
   * 网站改版后若样式失效，重新提取映射更新此表即可；文案发现兜底仍在。
   * ================================================================== */
  const HASH = {
    topicSubject: 'YZX9DMO9vuAo8W-a5cRwbg==',   // 题目区主列(860px 写死)
    whiteCard: '7OLQFhjss9s0gNtEZfSrEw==',       // 主列内白卡(padding-top24/bottom50)
    optionItem: 'xyLQldIE1YRl5-lSxz9Eng==',      // 选项项(圆角卡)
    optionList: 'aTsJRBty8eK7juxYbwXqgg==',      // 选项列表
    positionTips: 'NS60F4WAsw15OcCqPisnpA==',    // 打分提示弹卡
    tipRow: 'gvW+6n938tBNZ9B-p95q7A==',          // 打分提示内部行(padding-top20)
    headerWrap: '+W57ll4fVVFz0EgwDYfsow==',      // 主导航顶层包裹(白底层,84px写死)
    headerSticky: 'H1JXYCXfCVDFBtLSitNPZA==',    // 冻结态类(position:sticky;top:0;z-index:33)
    headerContent: 'DllRE6Ce-pOX87QnOqorRQ==',   // 主导航 content 行
    headerRow: '_5P3+leT-m6mi+bb4Q0vhHA==',      // 主导航内层行(logo+链接)
    qNavSticky: 'oUH3x1+pjjHjD2JqJa+HMA==',      // 题号导航条(sticky;top:84;z-index:8)
    mainRow: 'w0jBM0IYNK5nu4-9vEvhAw==',         // 主行容器(flex,左Tips列+右题目列)
    bottomRail: '-Ynua6+p5mW7+KshUAuWIQ==',      // 底部固定操作条(fixed;bottom:0;80px)
    railInner: 'H+-TeTQN7bCTxEKaJqqNGw==',       // 操作条内层(1200px居中)
    railCenter: '_1OUE+gWQPez-VtqPQSQd2g==',     // 操作条居中组(absolute)
    railRight: 'DJjwHAgyJ8of59ODqR14Ug==',       // 操作条右侧组(absolute;right:0)——重叠元凶之一
    railItem: 'soeMqfOL2TRgJaxMEbgFcA==',        // 操作条条目(上一题/下一题等)
    railBtn: '_223yLP6VbNCxJm3eYArFHA==',        // 右侧组条目
    railBtn2: 'sGQG52yWTJ4ld9TlqQky+w==',        // 右侧组条目2
    railCta: 'mhYmNTm36swFXNeQN4pM3w==',         // 继续练习按钮(蓝底药丸,条内)
    pageContainer: 'Bn1vPs2h9tvll9d5zQJD5Q==',   // 页面 1200px 容器(通栏化对象)
    leftCard: 'NjV+PepCBINgTR2N5GnJeQ==',        // 左侧悬浮卡(sticky;320px;收起开关所在)
    mainCol: 'Z19QS73lYJ0YZ8PQfSu19Q==',         // 右侧主列(860px,收起时加类→1100px)
    mainColWide: 'mkzKD1Rq8IaNH9mdtCaEsA==',     // 主列"已收起"状态类(width:1100px!important)
    analysisBg: 'k3mnrtWjlS6+6f912S-bHQ==',      // 解析区容器(内含860px绝对定位蓝底)
    analysisToggle: 'UykHmybbgqGXq7LfEk510Q==',  // "查看全部/收起"开关条(38px灰条)
    collapseBtn: 'GpsgBVvGD40r1wt9oYR7hQ==',     // 左卡收起/展开箭头按钮(absolute;right:-8px)
    cardHead: 'Hed-5BGTV4eU+ynTIQITiQ==',        // 左卡统计头行(57px)
    headInner: 'srQqJlEt0vFApDaT7QUHeQ==',       // 统计头内层(flex space-between)
    legendRow: 'oiUXOpZQ0-BsPhlQ4sYrBg==',       // 答对/答错/未答图例容器
    legendItem: 'A3eCl6z2oRvDEnc-Qri4Aw==',      // 图例单项(色块+文字)
    legendText: 'pZIldUPS6tNYgg51uPXlZw==',      // 图例文字
    numArea: 'l1rpxNvu7m17V0SAQH90vg==',         // 左卡题号滚动区(flex:1)
    numGrid: 'UM4kVjAAePhvDi2zfZoWMQ==',         // 题号网格(height:0收起/.xFEJhUaP展开)
    numItem: 'z5zNakVS9bwgxXSSAh8CxA==',         // 题号圆点(左卡与主区选项共用!)
    optListQ: 'qShDnXKH6xaGsUOuYE00FQ==',        // 主区选项列表(Z19QS73内)
    optWrong: 'd-wNWIkwkdPXUJHj7SGEmA==',        // 选项/题号橙底状态(错选)
    prevArrow: 'TZDAXCGHa+6ByiXecJIOSA==',       // 上一题条目(内含右箭头span)
    nextArrow: 'qpQZzLFsDg9QUN-ZHXB3og==',       // 下一题条目(内含左箭头span)
    tabBar: 'g+jfA4lLXomleSzoVDMm8Q==',          // 左卡页签栏(全部解析/只看错题)
    tabList: 'kAW75tUbddjJlP0RodqhNA==',         // 页签列表(display:flex;居中)
    tabItem: 'mhYmNTm36swFXNeQN4pM3w==',         // 页签项(与railCta同hash,须限定作用域)
    statsCard: 'd-KBAiPw9QqsKjF2okkbMQ==',       // 解析区下方统计卡(迁入左卡底部)
    statsRow: '_0UJ7pnbEuOwsmpm4lGXRww==',       // 统计卡内统计行(padding 24px 50px)
    // statisticsB 第二块：同组件存在两套 hash(AnswerAnalysis 版 / 8716 版)，选择器双兼容
    statsB_A: 't+DY7fykGwozvEfUTVYkKQ==',        // AnswerAnalysis 版块容器(原生作用域 .YZX9 下,迁出即失配)
    statsB_A_item: 'xyLQldIE1YRl5-lSxz9Eng==',   // AnswerAnalysis 版条目(与主区选项共用 hash,须限定作用域)
    statsB_A_num: 'nCd7kiyCmOfvQnvoMZWmyA==',    // AnswerAnalysis 版数值(18px bold)
    statsB_A_label: 'YyFhfFklQlj4jVjMRaoM4g==',  // AnswerAnalysis 版标签(13px #9da3b2)
    statsB_B: 'uc+39ht2aaWRJV5XOBvBBQ==',        // 8716 版块容器
    statsB_B_item: 'g+uNrcQg8aNmHi0j2nHvSw==',   // 8716 版条目
    statsB_B_num: 'W6m7qPAQMbB8nBCYjXyLCQ==',    // 8716 版数值
    statsB_B_label: 'kbaMrPbuxW1j4BI47s2iWA==',  // 8716 版标签
    qCard: 'k7WRZgL7TFXW+C1Mq9OQ3w==',           // 题目主卡(白底圆角,padding 0 30px)
    qHead: 'tGiVPdOMbiShlICk1W83zw==',           // 题卡头行(flex space-between baseline)
    qHeadLeft: 'g+Tgzwj8PrZFPpGI6c3UEg==',       // 头行左组(题源标题+题型标签,原生折两行)
    qTitle: 'J0Ja-QpzP9i6hi2Rq5AA4A==',          // 题源标题(20px inline-block,margin-bottom:12px)
    scoreRow: 'oirSGUwc6sN0UtrDgAdvpQ==',        // 打分卡第二块(说明行,原生 margin-top:16px 块级堆叠)
    scoreTags: '-wnXGMsQ2ODbnNHUW22Vvw==',       // 打分卡"打分提示"蓝框标签(原生在左组内)
    scoreEntry: 'luNdQBMHwx8p03fWhzuAgg==',      // "打分提示"点击入口(注意大写H,曾误写小写致永不命中)
    scoreStat: 'KYwHTS2BVZg6eXrY0YLLEg==',       // 打分说明行统计项(原生 padding 0 44px,空白过大)
    scoreNum: 'ogCQ4Fs1oP8Y7T9sNlVtdQ==',        // 打分说明行数值(原生 20px Medium,头行内偏大)
    qBlockP: 'DP3MM28kbJvPJIIQWERK5Q==',         // 题目大白卡(flex:1 白底圆角 padding 0 30px,含题目+解析)
    qWrapP: 'VQyPeQurBgdf8qwH-F8bRA==',          // 题目内容壳(relative z1,分屏左栏搬运对象,整体搬保样式)
    anaWrapP: 'CzaEDr8IFfsXceQDenj2Sg==',        // 解析区壳(首子块_3LQ84Zw=解析标题,整体搬保 .Z19QS73 后代样式)
  };

  const CFG = {
    slimBlackBar: true,    // 顶部黑色导航条压缩（保留登录入口）
    slimMainNav: true,     // 主导航解除冻结 + 高度收缩贴文字
    autoHideTop: false,    // 已改为自然随页滚动，无需再自动隐藏（保留开关备用）
    hideBreadcrumb: true,  // 隐藏面包屑行
    compactTips: true,     // 左侧答题卡（Tips）紧凑化收窄
    compactGrade: true,    // "打分提示"紧凑化
    slimBottomBar: true,   // 底部"继续练习/上一题/下一题"栏移入主行改竖排窄条
    stretchMain: true,     // 主内容列自适应拉伸
    debug: false,
  };

  const EXPAND_TEXTS = new Set(['查看全部', '展开', '展开全部']);
  const DEBOUNCE_MS = 400;
  const MAX_CLICKS_PER_RUN = 40;
  const MAX_RETRIES = 3;

  const clicked = new WeakMap();
  let debugOn = CFG.debug;
  let frostedOn = true;

  // ================= 样式 =================
  function h(name) { return '[class~="' + HASH[name] + '"]'; }

  function buildCSS() {
    let css = '';

    // 深色模式要放过的元素：媒体、内联设色、站点自带状态色与强调色
    const KEEP = ':not(img):not(svg):not(video):not(canvas):not(iframe)' +
      ':not([data-abu-theme-toast])' +
      ':not(' + h('numItem') + '):not(' + h('optWrong') + ')' +
      ':not(' + h('legendItem') + '):not(' + h('railCta') + '):not(a):not(button)';

    /* ---------- 零、主题变量：浅色沿用站点原值，深色在 html[data-abu-theme="dark"] 下整体换一套 ---------- */
    css += `
      :root {
        --abu-bg: #f5f7fa;
        --abu-surface: #ffffff;
        --abu-surface-2: #f7f9fc;
        --abu-text: #303443;
        --abu-text-sub: #666f83;
        --abu-border: #ebebeb;
        --abu-line: #eef1f6;
        --abu-accent: #268cff;
        --abu-tip: rgba(233, 245, 255, 0.88);
        --abu-bar: #e2e7f0;
        --abu-wrong: #ffffff;
      }
      html[data-abu-theme="dark"] {
        --abu-bg: #12151a;
        --abu-surface: #1a1e25;
        --abu-surface-2: #232833;
        --abu-text: #dfe4ec;
        --abu-text-sub: #98a3b5;
        --abu-border: #2b313c;
        --abu-line: #2b313c;
        --abu-accent: #6aa9ff;
        --abu-tip: rgba(36, 52, 78, 0.88);
        --abu-bar: #3a4250;
        --abu-wrong: #1a1e25;
      }
    `;

    /* ---------- 一、题目内列：撑满父容器（原 860px 写死；YZX9 是 Z19QS73 的内层列） ---------- */
    css += `
      ${h('topicSubject')} {
        width: 100% !important;
        max-width: none !important;
        min-width: 0 !important;
        margin-left: 0 !important;
        margin-bottom: 0 !important;
      }
      /* 解析区内的绝对定位蓝底随父容器拉伸 */
      ${h('analysisBg')} [class~="U71+jXpOscoJ6PF8WCCuIg=="],
      ${h('analysisBg')} [class~="ahNEf8ynd2DFVN3JTOs6eg=="] {
        width: 100% !important;
      }
    `;

    /* ---------- 一B、通栏布局：容器利用右侧空白，主列随卡片收起自动伸展 ---------- */
    css += `
      /* 1200px 容器 → 通栏（左右留 12px 呼吸边） */
      ${h('pageContainer')} {
        width: auto !important;
        max-width: none !important;
        margin: 0 auto !important;
        padding: 0 12px !important;
        box-sizing: border-box !important;
      }
      /* 左卡保持原生 320px(收起态 80px)，悬浮高度适配压缩后的导航。
         关键：锁死 flex 收缩——否则题目内容一宽，主列就把卡挤扁
         （题号变两列、页签一字一行，即"时好时坏"的错位病根） */
      ${h('leftCard')} {
        position: sticky !important;
        top: 12px !important;
        flex-grow: 0 !important;
        flex-shrink: 0 !important;
        flex-basis: auto !important;
      }
      /* 右主列：吃掉行内剩余全部宽度（原 860px 写死）。
         flex-basis 归零 + min-width:0，让溢出压力全部由主列自己吸收 */
      ${h('mainCol')} {
        flex: 1 1 0% !important;
        width: auto !important;
        max-width: none !important;
        min-width: 0 !important;
        margin-left: 12px !important;
        margin-bottom: 12px !important;
      }
      /* 卡片收起状态类的 1100px !important 同口径中和，让 flex 自适应接管 */
      ${h('mainCol')}${h('mainColWide')} {
        width: auto !important;
      }
    `;

    /* ---------- 二、白卡留白压缩 ---------- */
    css += `
      ${h('topicSubject')} ${h('whiteCard')} {
        margin-top: 8px !important;
        padding-top: 12px !important;
        padding-bottom: 16px !important;
      }
    `;

    /* ---------- 三、选项扁平化（去圆角卡） ---------- */
    css += `
      ${h('optionList')} ${h('optionItem')} {
        margin-top: 6px !important;
        border-radius: 4px !important;
        background: transparent !important;
        border: none !important;
        padding-top: 2px !important;
        padding-bottom: 2px !important;
      }
    `;

    /* ---------- 四、打分提示弹卡：紧凑+磨砂 ---------- */
    css += `
      ${h('positionTips')} {
        padding: 10px 12px !important;
        background: var(--abu-tip) !important;
        -webkit-backdrop-filter: blur(12px) saturate(160%) !important;
        backdrop-filter: blur(12px) saturate(160%) !important;
      }
      ${h('positionTips')} ${h('tipRow')} { padding-top: 8px !important; }
    `;

    /* ---------- 顶部导航 ---------- */
    css += `
      [data-abu~="breadcrumb"] { display: none !important; }

      /* 黑色营销条：恢复原样（压缩样式已撤），自然随页滚动 */
      /* 主导航顶层包裹：解除冻结，随页面自然滚动；高度自适应贴文字 */
      ${h('headerWrap')} {
        position: static !important;
        top: auto !important;
        height: auto !important;
        min-height: 0 !important;
        padding-top: 3px !important;
        padding-bottom: 3px !important;
        margin: 0 !important;
      }
      /* 冻结态类本体：无论挂在哪个元素上都解除（chunk4383: position:sticky;top:0） */
      ${h('headerSticky')} {
        position: static !important;
        top: auto !important;
      }
      /* 题号导航条：解除冻结（chunk9556: position:sticky;top:84;z-index:8） */
      ${h('qNavSticky')} {
        position: static !important;
        top: auto !important;
      }

      /* content 行与内层行：同样解除冻结、清掉内边距，高度贴文字 */
      ${h('headerWrap')} ${h('headerContent')} {
        position: static !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      ${h('headerWrap')} ${h('headerRow')} {
        position: static !important;
        height: auto !important;
        min-height: 0 !important;
        padding-top: 2px !important;
        padding-bottom: 2px !important;
        overflow: visible !important;
      }
      ${h('headerWrap')} ${h('headerRow')} img { max-height: 30px !important; }
      ${h('headerWrap')} a, ${h('headerWrap')} div { margin-top: 0 !important; margin-bottom: 0 !important; }
    `;

    /* ---------- 左侧答题卡：不再强制改尺寸（保证原生收起功能可用） ---------- */
    css += `
      [data-abu-debug] { outline: 2px solid red !important; outline-offset: -2px; }
    `;

    /* ---------- 做题按钮组：置入左悬浮卡内，纵向通栏排列 ---------- */
    css += `
      ${h('bottomRail')} {
        position: static !important;
        width: 100% !important;
        flex: none !important;
        height: auto !important;
        background: transparent !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        margin: 10px 0 0 0 !important;
        padding: 10px 0 0 0 !important;
        border-top: 1px solid var(--abu-line) !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 10px !important;
        box-sizing: border-box !important;
      }
      /* 根治重叠：条子树内一律禁止绝对定位与位移 */
      ${h('bottomRail')} * {
        position: static !important;
        transform: none !important;
        box-sizing: border-box !important;
      }
      /* 内层 1200px 壳与两个按钮组 → 纵向堆叠 */
      ${h('bottomRail')} ${h('railInner')} {
        width: 100% !important;
        height: auto !important;
        display: block !important;
        margin: 0 !important;
      }
      ${h('bottomRail')} ${h('railCenter')},
      ${h('bottomRail')} ${h('railRight')} {
        display: flex !important;
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 10px !important;
        width: 100% !important;
        height: auto !important;
      }
      /* 条目：去 80px 行高 / 100px、54px 右距，统一通栏居中 */
      ${h('bottomRail')} ${h('railItem')},
      ${h('bottomRail')} ${h('railBtn')},
      ${h('bottomRail')} ${h('railBtn2')} {
        height: auto !important;
        line-height: 1.5 !important;
        margin: 0 !important;
        margin-right: 0 !important;
        padding: 4px 0 !important;
        width: 100% !important;
        justify-content: center !important;
      }
      /* 继续练习：去蓝底药丸，与其他按钮统一为文字风格 */
      ${h('bottomRail')} ${h('railCta')} {
        background: transparent !important;
        color: var(--abu-accent) !important;
        border-radius: 0 !important;
        width: 100% !important;
        height: auto !important;
        line-height: 1.5 !important;
        margin: 0 !important;
        padding: 4px 0 !important;
      }
      /* 纯文字化：删"上一题/下一题"的箭头图标（站点 CSS 中条目内 span 全是 16x16 箭头贴图） */
      ${h('bottomRail')} ${h('prevArrow')} span,
      ${h('bottomRail')} ${h('nextArrow')} span {
        display: none !important;
      }
      /* 删"收藏"的星标 svg */
      ${h('bottomRail')} ${h('railRight')} svg {
        display: none !important;
      }
      /* 四个文字按钮：统一字号、水平居中 */
      ${h('bottomRail')} ${h('railItem')},
      ${h('bottomRail')} ${h('railBtn')},
      ${h('bottomRail')} ${h('railBtn2')},
      ${h('bottomRail')} ${h('railCta')} {
        font-size: 14px !important;
        justify-content: center !important;
        align-items: center !important;
        text-align: center !important;
      }
    `;

    /* ---------- 六、左卡收起态：参考练习页 middlebar——只留一根极窄长条+收起手柄 ---------- */
    css += `
      ${h('leftCard')}${h('mainColWide')} {
        min-height: 220px !important;
        padding: 0 !important;
        border-radius: 9px !important;
      }
      /* 收起时隐藏除收起按钮外的全部直接子元素（按钮与内容平行、绝对定位卡缘，参考练习页实现） */
      ${h('leftCard')}${h('mainColWide')} > :not(${h('collapseBtn')}) {
        display: none !important;
      }
      /* 收起手柄(16x61 竖形贴图)贴回窄条内、垂直居中 */
      ${h('leftCard')}${h('mainColWide')} ${h('collapseBtn')} {
        right: 0 !important;
        top: 50% !important;
        transform: translate(0, -50%) !important;
      }
    `;

    /* ---------- 六B、解析统计卡：迁入左卡后原生 `.Z19QS73 .d-KBAiPw` 后代样式失配，按窄卡重写。
       实测结构：statsRow(横排 space-around) > statItem(图标34px+标签+数值) ×5，
       窄卡横排必挤碎 → 每项改单行：图标+标签靠左、数值右对齐 */
    css += `
      ${h('leftCard')} ${h('statsCard')} {
        width: 100% !important;
        margin: 10px 0 0 0 !important;
        padding: 6px 4px !important;
        background: var(--abu-surface) !important;
        border: 1px solid var(--abu-border) !important;
        border-radius: 6px !important;
        box-shadow: none !important;
        display: flex !important;
        flex-direction: column !important;
        box-sizing: border-box !important;
      }
      ${h('leftCard')} ${h('statsCard')} ${h('statsRow')} {
        display: flex !important;
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 4px !important;
        padding: 2px !important;
      }
      ${h('leftCard')} ${h('statsCard')} ${h('statsRow')} ${h('numItem')} {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        width: 100% !important;
      }
      ${h('leftCard')} ${h('statsCard')} ${h('statsRow')} ${h('numItem')} img {
        width: 20px !important;
        height: 20px !important;
        flex: none !important;
      }
      ${h('leftCard')} ${h('statsCard')} ${h('statsRow')} ${h('numItem')} [class~="IQd43t4GPQb+D6wIpXLqHw=="] {
        font-size: 13px !important;
        color: var(--abu-text-sub) !important;
        padding: 0 4px 0 8px !important;
        white-space: nowrap !important;
        flex: none !important;
      }
      ${h('leftCard')} ${h('statsCard')} ${h('statsRow')} ${h('numItem')} [class~="m4Kwf3-xGDfxtmBWNbATWw=="] {
        font-size: 13px !important;
        margin-left: auto !important;
        white-space: nowrap !important;
      }
      /* statisticsB 块(本题总答题次数/答对次数/答错次数/正确率)：
         两套 hash 双兼容(A=AnswerAnalysis 实装版；B=8716 版备用)。
         原生为宽卡式 25% 宽+row-reverse+右边框，且 A 版作用域挂在 .YZX9 上——
         迁入左卡后样式整体脱落。此处统一套用前三项同款排版 */
      ${h('leftCard')} ${h('statsB_A')},
      ${h('leftCard')} ${h('statsB_B')} {
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 4px !important;
        margin-top: 6px !important;
        padding-bottom: 2px !important;
      }
      ${h('leftCard')} ${h('statsB_A')} ${h('statsB_A_item')},
      ${h('leftCard')} ${h('statsB_B')} ${h('statsB_B_item')} {
        flex-direction: row !important;
        width: 100% !important;
        height: auto !important;
        border-right: 0 !important;
        justify-content: flex-start !important;
      }
      ${h('leftCard')} ${h('statsB_A')} ${h('statsB_A_label')},
      ${h('leftCard')} ${h('statsB_B')} ${h('statsB_B_label')} {
        font-size: 13px !important;
        color: var(--abu-text-sub) !important;
        margin-right: 0 !important;
        white-space: nowrap !important;
      }
      ${h('leftCard')} ${h('statsB_A')} ${h('statsB_A_num')},
      ${h('leftCard')} ${h('statsB_B')} ${h('statsB_B_num')} {
        font-size: 13px !important;
        font-weight: normal !important;
        margin-left: auto !important;
        white-space: nowrap !important;
      }
      /* 结构选择器兜底：不依赖 hash。后四项块 = 统计卡内最后一个直接子块；
         条目内"数值/标签"用 order 强制标签左、数值右（不受 DOM 顺序与 row-reverse 影响） */
      ${h('leftCard')} ${h('statsCard')} > :last-child {
        display: flex !important;
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 4px !important;
        width: 100% !important;
        margin-top: 6px !important;
      }
      ${h('leftCard')} ${h('statsCard')} > :last-child > * {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        width: 100% !important;
        height: auto !important;
        min-height: 0 !important;
        border: 0 !important;
        padding: 2px 0 !important;
        margin: 0 !important;
      }
      ${h('leftCard')} ${h('statsCard')} > :last-child > * > * {
        font-size: 13px !important;
        font-weight: normal !important;
        line-height: 1.5 !important;
        white-space: nowrap !important;
      }
      ${h('leftCard')} ${h('statsCard')} > :last-child > * > :first-child {
        order: 2 !important;
        margin-left: auto !important;
        color: var(--abu-text) !important;
      }
      ${h('leftCard')} ${h('statsCard')} > :last-child > * > :last-child {
        order: 1 !important;
        margin-left: 0 !important;
        margin-right: 8px !important;
        color: var(--abu-text-sub) !important;
      }
    `;
    /* ---------- 六C、题卡头行文字并为一行：左组(题源标题+题型标签)原生折两行，改 nowrap 横排 ---------- */
    css += `
      ${h('mainCol')} ${h('qCard')} ${h('qHead')} {
        flex-wrap: nowrap !important;
        align-items: center !important;
        gap: 8px !important;
      }
      ${h('mainCol')} ${h('qCard')} ${h('qHead')} ${h('qHeadLeft')} {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        align-items: center !important;
        gap: 8px !important;
        min-width: 0 !important;
      }
      ${h('mainCol')} ${h('qCard')} ${h('qHead')} ${h('qHeadLeft')} > * {
        white-space: nowrap !important;
        flex: none !important;
      }
      ${h('mainCol')} ${h('qCard')} ${h('qHead')} ${h('qTitle')} {
        margin-bottom: 0 !important;
        font-size: 15px !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
      }
    `;

    /* ---------- 七、题号网格：真 Grid 四列表格化 + 页签防挤压 ---------- */
    css += `
      /* 页签"全部解析/只看错题"：禁止折行挤压成竖排 */
      ${h('leftCard')} ${h('tabBar')} ${h('tabList')} {
        flex-wrap: nowrap !important;
      }
      ${h('leftCard')} ${h('tabBar')} ${h('tabItem')} {
        white-space: nowrap !important;
        flex: none !important;
      }
      /* 左卡：宽度贴内容收缩（fit-content），砍掉题号两侧大片空白。
         图例/页签已有 nowrap 规则 → 卡宽自动取最宽子元素，
         谁也不会被挤成竖排；收起态恢复原生 80px 窄条 */
      ${h('leftCard')} {
        width: fit-content !important;
        min-width: 0 !important;
        padding: 2px 4px !important;
      }
      /* 关键：原生卡高 calc(100vh-212px) 固定、numArea flex:1 吃剩余空间，
         迁入按钮组+统计卡后把题号区挤没（遮挡病根）。
         改卡高自适应+限视口、内部滚动；题号区脱离弹性自然撑开 */
      ${h('leftCard')} {
        height: auto !important;
        max-height: calc(100vh - 24px) !important;
        overflow-y: auto !important;
      }
      ${h('leftCard')} ${h('numArea')} {
        flex: none !important;
        overflow: visible !important;
        padding-bottom: 4px !important;
      }
      ${h('leftCard')}${h('mainColWide')} {
        width: 16px !important;
        min-width: 16px !important;
      }
      /* 题号网格：固定 36px 轨道（题号原生尺寸、字号不变），gap 0 相切，
         整块在收缩后的卡内居中 */
      ${h('leftCard')} ${h('numGrid')} {
        display: grid !important;
        grid-template-columns: repeat(4, 36px) !important;
        grid-auto-rows: 36px !important;
        gap: 0 !important;
        justify-content: center !important;
        height: auto !important;
        padding: 0 !important;
        box-sizing: border-box !important;
      }
      /* 题号：原生 36x36 正圆/方块，严禁改写宽高行高圆角与字号 */
      ${h('leftCard')} ${h('numGrid')} ${h('numItem')} {
        margin: 0 !important;
        justify-self: center !important;
        align-self: start !important;
      }
      /* 区块标题行(单选题/多选题+收起)：原生 padding 6px 20px 全砍（绿色区域） */
      ${h('leftCard')} [class~="IQd43t4GPQb+D6wIpXLqHw=="] {
        padding: 0 2px !important;
      }
      /* 题号滚动区底部留白同步回收 */
      ${h('leftCard')} ${h('numArea')} {
        padding-bottom: 4px !important;
      }
    `;

    /* ---------- 八、答对/答错/未答图例：强制横排 ---------- */
    css += `
      ${h('leftCard')} ${h('headInner')} {
        flex-wrap: wrap !important;
        height: auto !important;
        padding: 2px 6px !important;
      }
      /* 页签栏内边距同步回收（绿色区域） */
      ${h('leftCard')} ${h('tabBar')} {
        padding: 0 2px !important;
      }
      ${h('leftCard')} ${h('legendRow')} {
        flex-wrap: nowrap !important;
      }
      ${h('leftCard')} ${h('legendItem')} {
        flex: none !important;
        white-space: nowrap !important;
      }
      ${h('leftCard')} ${h('legendItem')} ${h('legendText')} {
        white-space: nowrap !important;
        width: auto !important;
      }
    `;

    /* ---------- 九、主区选项：橙底(错选)还原普通样式，蓝底保留，行距紧凑 ---------- */
    css += `
      ${h('mainCol')} ${h('optListQ')} ${h('numItem')} {
        margin-top: 8px !important;
        border-radius: 4px !important;
      }
      ${h('mainCol')} ${h('optListQ')} ${h('optWrong')} {
        background: var(--abu-wrong) !important;
        border: 1px solid var(--abu-border) !important;
      }
    `;

    /* ---------- 九C、解析收起态截断直杀：text-hidden 类=3行line-clamp截断，
         React 在"我的回答/参考答案/解析文字"等多个区块挂它收起内容；
         靠点按钮展开覆盖不全(部分区块无按钮)——CSS 直接解除该类全部截断。
         hash 按 chunk 各不相同：dv0sU6b6=旧chunk变体、EFoORMs9=#ptxt 所在 chunk(2026_10_20 实测)；
         #ptxt id 兜底(站点原生展开态即换成 nOCiZqWO=overflow:visible;display:block) */
    css += `
      [class~="dv0sU6b6KEV6aAjWEasyqA=="],
      [class~="EFoORMs9gsrVpecFw8+Y+g=="],
      #ptxt {
        overflow: visible !important;
        display: block !important;
        -webkit-line-clamp: unset !important;
        -webkit-box-orient: horizontal !important;
        text-overflow: clip !important;
        max-height: none !important;
      }
    `;

    /* ---------- 九B、打分说明行统计项：原生 padding 0 44px 空白过大致头行显示不全，压缩间距与字号 ---------- */
    css += `
      ${h('qCard')} ${h('scoreRow')} ${h('scoreStat')} {
        padding: 0 8px !important;
        height: auto !important;
      }
      ${h('qCard')} ${h('scoreRow')} ${h('scoreStat')}:first-child {
        padding-left: 0 !important;
      }
      ${h('qCard')} ${h('scoreRow')} ${h('scoreStat')}:last-child {
        padding-right: 0 !important;
      }
      ${h('qCard')} ${h('scoreRow')} ${h('scoreStat')} ${h('scoreNum')} {
        font-size: 14px !important;
        line-height: 18px !important;
        letter-spacing: 0 !important;
      }
    `;

    /* ---------- 十、分屏视图：题目(左) | 可拖拽分割线 | 解析(右) ---------- */
    css += `
      /* 主列进入分屏态：横向 flex、定高让两栏各自内部滚动 */
      ${h('mainCol')}[data-abu-split="1"] {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        align-items: stretch !important;
        height: calc(100vh - 104px) !important;
        min-height: 480px !important;
        overflow: hidden !important;
      }
      /* 克隆镜像模式(v3.12)：原始树打 data-abu-src 标记后隐藏——React 仍在原件上
         正常渲染(v3.11 搬走原件致 React 重渲染时把内容卸载→白屏)；面板显示克隆副本 */
      ${h('mainCol')} [data-abu-src] {
        display: none !important;
      }
      /* 左右面板：补上原 DP3MM28 白卡的底色/圆角/内边距，
         overflow-y 让栏内容独立滚动（分屏本质） */
      [data-abu-pane="left"],
      [data-abu-pane="right"] {
        background: var(--abu-surface) !important;
        border-radius: 5px !important;
        padding: 16px 24px 40px !important;
        box-sizing: border-box !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        min-width: 0 !important;
      }
      [data-abu-pane="left"] {
        flex: 0 0 auto !important;
        /* width 不在此声明：拖拽以 JS 内联 setProperty(important) 控制，
           样式表 !important 会压死内联样式致拖拽无效(v3.12.5 病根) */
      }
      [data-abu-pane="right"] {
        flex: 1 1 0% !important;
      }
      /* 分割条：14px 拖拽热区(易按中)，中央 4px 视觉条，悬停/拖动中变蓝 */
      [data-abu-pane="bar"] {
        flex: none !important;
        width: 14px !important;
        align-self: stretch !important;
        margin: 0 2px !important;
        background: transparent !important;
        cursor: col-resize !important;
        box-sizing: border-box !important;
        position: relative !important;
        z-index: 5 !important;
      }
      [data-abu-pane="bar"]::before {
        content: '' !important;
        position: absolute !important;
        left: 5px !important;
        top: 0 !important;
        bottom: 0 !important;
        width: 4px !important;
        border-radius: 2px !important;
        background: var(--abu-bar) !important;
      }
      [data-abu-pane="bar"]:hover::before,
      body[data-abu-dragging] [data-abu-pane="bar"]::before {
        background: var(--abu-accent) !important;
      }
      /* 题干内列(YZX9)原生 860px 定宽+overflow-y:scroll 内部滚动列：
         入面板后改自然高度，滚动统一交给面板，避免套娃滚动/裁剪 */
      [data-abu-pane] [class~="YZX9DMO9vuAo8W-a5cRwbg=="] {
        height: auto !important;
        max-height: none !important;
        overflow: visible !important;
      }
      /* 题干包裹容器(dataReportBox 两个候选 hash)：去 100% 定高，纵向自然堆叠 */
      [data-abu-pane] [class~="yirS2LkwKzdin2O8z1RMJw=="],
      [data-abu-pane] [class~="NICRWCcBAr-sPWBypVRzEg=="] {
        display: block !important;
        height: auto !important;
        overflow: visible !important;
      }
      /* v3.17.3 ⑨：左栏长题干全文。
         站点把题干/选项区挂成定高或 N 行 line-clamp 收起态：左栏越窄，
         同样字数占的行数越多，尾部被裁成省略号；手动拉宽只是让 N 行
         碰巧装下，并非修好。这里不猜新 hash，让题干自然撑高、下方选项
         跟着下移，同时解除所有后代的行数与溢出截断。 */
      [data-abu-pane="left"] > * {
        height: auto !important;
        max-height: none !important;
        overflow: visible !important;
      }
      [data-abu-pane="left"] * {
        -webkit-line-clamp: unset !important;
        -webkit-box-orient: horizontal !important;
        max-height: none !important;
      }
      [data-abu-pane="left"] [class~="YZX9DMO9vuAo8W-a5cRwbg=="] *,
      [data-abu-pane="left"] [class~="yirS2LkwKzdin2O8z1RMJw=="] *,
      [data-abu-pane="left"] [class~="NICRWCcBAr-sPWBypVRzEg=="] * {
        text-overflow: clip !important;
        overflow: visible !important;
      }
    `;

    /* ---------- 十一、v3.18.0 深浅色主题：自动跟随浏览器，可在菜单固定浅/深色 ----------
       只换底色与中性文字，站点自带的对错色、强调色与媒体内容一律放过。
       主题由 JS 写 html[data-abu-theme]，此处不重复做媒体查询。 */
    css += `
      html[data-abu-theme="dark"] { color-scheme: dark !important; }
      html[data-abu-theme="dark"] body {
        background: var(--abu-bg) !important;
        color: var(--abu-text) !important;
      }
      /* 页面骨架：已知容器与常见根节点统一深底 */
      html[data-abu-theme="dark"] #root,
      html[data-abu-theme="dark"] #app,
      html[data-abu-theme="dark"] #__next,
      html[data-abu-theme="dark"] ${h('pageContainer')},
      html[data-abu-theme="dark"] ${h('mainRow')},
      html[data-abu-theme="dark"] ${h('topicSubject')},
      html[data-abu-theme="dark"] ${h('mainCol')},
      html[data-abu-theme="dark"] ${h('headerWrap')},
      html[data-abu-theme="dark"] ${h('qNavSticky')} {
        background-color: var(--abu-bg) !important;
        color: var(--abu-text) !important;
      }
      /* 白卡类：脚本接管过的卡、统计卡、弹卡与分屏面板 */
      html[data-abu-theme="dark"] ${h('whiteCard')},
      html[data-abu-theme="dark"] ${h('leftCard')},
      html[data-abu-theme="dark"] ${h('qCard')},
      html[data-abu-theme="dark"] ${h('qBlockP')},
      html[data-abu-theme="dark"] ${h('statsCard')},
      html[data-abu-theme="dark"] ${h('positionTips')},
      html[data-abu-theme="dark"] ${h('analysisBg')},
      html[data-abu-theme="dark"] ${h('tabBar')},
      html[data-abu-theme="dark"] [data-abu-pane] {
        background: var(--abu-surface) !important;
        color: var(--abu-text) !important;
        border-color: var(--abu-border) !important;
        box-shadow: none !important;
      }
      /* 解析区那两块绝对定位浅蓝底 */
      html[data-abu-theme="dark"] ${h('analysisBg')} [class~="U71+jXpOscoJ6PF8WCCuIg=="],
      html[data-abu-theme="dark"] ${h('analysisBg')} [class~="ahNEf8ynd2DFVN3JTOs6eg=="] {
        background: var(--abu-surface-2) !important;
      }
      /* 全站兜底：目录页、练习页等未纳入 HASH 的组件没有白卡规则，
         只把文字染浅会变成浅字落白底；这里连背景一起兜住。
         已知卡片与选项块的选择器权重更高，仍用各自的层次色。 */
      html[data-abu-theme="dark"] body *${KEEP} {
        color: var(--abu-text) !important;
        background-color: var(--abu-bg) !important;
      }
      /* 次要标签、图例、页签与统计说明 */
      html[data-abu-theme="dark"] [class~="IQd43t4GPQb+D6wIpXLqHw=="],
      html[data-abu-theme="dark"] ${h('legendText')},
      html[data-abu-theme="dark"] ${h('tabItem')},
      html[data-abu-theme="dark"] ${h('statsB_A_label')},
      html[data-abu-theme="dark"] ${h('statsB_B_label')} {
        color: var(--abu-text-sub) !important;
      }
      /* 题卡头行：题型小标签换成深底，题源链接保留强调蓝 */
      html[data-abu-theme="dark"] ${h('qHead')} ${h('qHeadLeft')} > * {
        background: var(--abu-surface-2) !important;
        color: var(--abu-text) !important;
        border-color: var(--abu-border) !important;
      }
      html[data-abu-theme="dark"] ${h('qHead')} a,
      html[data-abu-theme="dark"] ${h('qHead')} a * {
        color: var(--abu-accent) !important;
      }
      /* 主区选项块：站点给的白底在深色下刺眼，换成次级深底；
         左卡题号圆点与主区共用 numItem hash，故限定 mainCol 作用域 */
      html[data-abu-theme="dark"] ${h('mainCol')} ${h('optionItem')},
      html[data-abu-theme="dark"] ${h('mainCol')} ${h('numItem')} {
        background: var(--abu-surface-2) !important;
        border-color: var(--abu-border) !important;
      }
      /* 选项、题号、按钮条：只收边框，背景与状态色保持站点原样 */
      html[data-abu-theme="dark"] ${h('optionItem')},
      html[data-abu-theme="dark"] ${h('numItem')},
      html[data-abu-theme="dark"] ${h('bottomRail')} {
        border-color: var(--abu-border) !important;
      }
      html[data-abu-theme="dark"] input,
      html[data-abu-theme="dark"] textarea,
      html[data-abu-theme="dark"] select {
        background: var(--abu-surface-2) !important;
        color: var(--abu-text) !important;
        border-color: var(--abu-border) !important;
      }
      /* 滚动条随主题 */
      html[data-abu-theme="dark"] ::-webkit-scrollbar { width: 10px !important; height: 10px !important; }
      html[data-abu-theme="dark"] ::-webkit-scrollbar-track { background: transparent !important; }
      html[data-abu-theme="dark"] ::-webkit-scrollbar-thumb {
        background: var(--abu-bar) !important;
        border-radius: 6px !important;
      }
      /* 题干图片、公式图、视频播放器不做任何染色 */
      html[data-abu-theme="dark"] img,
      html[data-abu-theme="dark"] video,
      html[data-abu-theme="dark"] canvas,
      html[data-abu-theme="dark"] iframe { filter: none !important; }
      /* 切换主题时的即时提示 */
      [data-abu-theme-toast] {
        position: fixed !important;
        right: 18px !important;
        bottom: 18px !important;
        z-index: 2147483647 !important;
        padding: 8px 14px !important;
        border-radius: 6px !important;
        background: var(--abu-surface-2) !important;
        color: var(--abu-text) !important;
        border: 1px solid var(--abu-border) !important;
        box-shadow: 0 4px 18px rgba(0, 0, 0, .28) !important;
        font: 13px/1.5 system-ui, -apple-system, sans-serif !important;
      }
    `;

    return css;
  }

  let styleEl = null;
  function injectStyle() {
    if (!styleEl || !styleEl.isConnected) {
      styleEl = document.createElement('style');
      styleEl.id = 'abu-zhuma-style';
      document.documentElement.appendChild(styleEl);
    }
    styleEl.textContent = buildCSS();
  }

  // ================= 主题：跟随浏览器，可在菜单固定并记忆 =================
  const THEME_KEY = 'abuThemeMode';
  const THEME_MODES = ['auto', 'light', 'dark'];
  const THEME_LABEL = { auto: '跟随浏览器', light: '固定浅色', dark: '固定深色' };
  const darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  let themeMode = readThemeMode();

  function readThemeMode() {
    try {
      const v = localStorage.getItem(THEME_KEY);
      return THEME_MODES.indexOf(v) >= 0 ? v : 'auto';
    } catch (e) { return 'auto'; }  // 隐私模式禁用存储时静默降级为跟随系统
  }
  function writeThemeMode(m) {
    try { localStorage.setItem(THEME_KEY, m); } catch (e) { /* 静默降级 */ }
  }
  function isDark() {
    return themeMode === 'dark' || (themeMode === 'auto' && !!darkQuery && darkQuery.matches);
  }
  function applyTheme() {
    document.documentElement.setAttribute('data-abu-theme', isDark() ? 'dark' : 'light');
  }
  function showThemeToast() {
    const old = document.querySelector('[data-abu-theme-toast]');
    if (old) old.remove();
    const el = document.createElement('div');
    el.setAttribute('data-abu-theme-toast', '1');
    el.textContent = '主题：' + THEME_LABEL[themeMode] +
      (isDark() ? '（当前深色）' : '（当前浅色）');
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1800);
  }
  if (darkQuery) {
    if (darkQuery.addEventListener) darkQuery.addEventListener('change', applyTheme);
    else if (darkQuery.addListener) darkQuery.addListener(applyTheme);
  }
  window.addEventListener('storage', (e) => {
    if (e.key !== THEME_KEY) return;
    themeMode = readThemeMode();
    applyTheme();
  });
  applyTheme();

  // ================= 文案定位工具（兜底） =================
  function findAllByText(re, maxTextLen = 30, maxChildren = 4) {
    const out = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const el = walker.currentNode;
      if (el.children.length > maxChildren) continue;
      const t = (el.textContent || '').trim();
      if (t.length > 0 && t.length <= maxTextLen && re.test(t)) out.push(el);
    }
    out.sort((a, b) => (a.textContent || '').length - (b.textContent || '').length);
    return out;
  }

  function climb(el, pred) {
    let cur = el;
    while (cur && cur !== document.body) {
      if (pred(cur)) return cur;
      cur = cur.parentElement;
    }
    return null;
  }

  function isTopLevel(n) {
    const p = n.parentElement;
    if (!p) return false;
    if (p === document.body) return true;
    if (p.id === 'wrap') return true;
    const gp = p.parentElement;
    return !!(gp && (gp === document.body || gp.id === 'wrap'));
  }

  function mark(el, name) {
    if (!el) return null;
    const prev = document.querySelector('[data-abu~="' + name + '"]');
    if (prev && prev !== el) prev.removeAttribute('data-abu');
    if (debugOn) el.setAttribute('data-abu-debug', '');
    else el.removeAttribute('data-abu-debug');
    const cur = el.getAttribute('data-abu') || '';
    if (!cur.includes(name)) el.setAttribute('data-abu', (cur + ' ' + name).trim());
    return el;
  }

  // ================= 区域识别（兜底层） =================
  // 底部操作条 → 移入左侧悬浮卡（NjV）内。DOM 移动有重试上限，防 React 回插抖动。
  let railMoves = 0;
  function moveBottomRail() {
    if (!CFG.slimBottomBar || railMoves >= 5) return;
    try {
      const bar = document.querySelector('[class~="' + HASH.bottomRail + '"]');
      const dest = document.querySelector('[class~="' + HASH.leftCard + '"]');
      if (bar && dest && bar.parentElement !== dest) {
        dest.appendChild(bar);
        railMoves++;
      }
    } catch (e) { /* React 节点冲突时静默跳过 */ }
  }

  // 解析区下方统计卡(d-KBAiPw) → 迁入左卡底部（appendChild 顺序保证在按钮组之下）
  let statsMoves = 0;
  function moveStatsCard() {
    if (statsMoves >= 5) return;
    try {
      const card = document.querySelector('[class~="' + HASH.leftCard + '"]');
      const stats = document.querySelector('[class~="' + HASH.statsCard + '"]');
      if (card && stats && stats.parentElement !== card) {
        card.appendChild(stats);
        statsMoves++;
      }
    } catch (e) { /* React 节点冲突时静默跳过 */ }
  }

  // 题卡头行文字并为一行：题源(catalog)与题型标签在左组内块级堆叠。
  // 定位改文字+结构双保险：优先 hash，失败则找"单选题/多选题"蓝框小标签反推层级
  // (标签.parentElement=标签组, 标签组.parentElement=左组, 标签组.previousElementSibling=题源)。
  // 另：把版本号写入页面标题，供外部验证脚本是否安装并运行
  function mergeTitleRow() {
    try {
      const box = document.querySelector('[class~="' + HASH.qCard + '"]');
      if (!box) return;
      const head = box.querySelector(':scope > [class~="' + HASH.qHead + '"]');
      const second = box.querySelector(':scope > [class~="' + HASH.scoreRow + '"]');
      if (!head || !second) return;
      // 终修：把第二块(说明行)移入头行——头行原生 flex space-between，移入即同行。
      // 结构经用户 DevTools 路径确认：两块是 k7WRZgL 的两个直接子元素，非猜测定
      if (second.parentElement !== head) {
        head.appendChild(second);
      }
      // "打分提示"入口(luNdQBM,图标+文字)挪到头行最右：移到头行末尾
      const entry = head.querySelector(':scope > [class~="' + HASH.scoreEntry + '"]')
                 || box.querySelector('[class~="' + HASH.scoreEntry + '"]');
      if (entry && (entry.parentElement !== head || head.lastElementChild !== entry)) {
        head.appendChild(entry);
        entry.style.cssText += 'margin-left:0 !important;flex:none !important;align-self:center !important;';
      }
      if (second.style.marginTop !== '0px') {
        second.style.cssText += 'margin-top:0 !important;display:flex !important;align-items:center !important;flex:1 1 auto !important;min-width:0 !important;overflow:hidden !important;white-space:nowrap !important;text-overflow:ellipsis !important;';
        second.querySelectorAll('div, span, p').forEach(el => {
          el.style.cssText += 'white-space:nowrap !important;overflow:hidden !important;text-overflow:ellipsis !important;';
        });
        head.style.cssText += 'align-items:center !important;gap:12px !important;';
      }
    } catch (e) { /* 静默 */ }
  }

  // 版本号写入标题（外部验证通道：tabs_list 直接可读）
  try {
    if (!/^v\d/.test(document.title)) {
      document.title = 'v' + (GM_info ? GM_info.script.version : '?') + ' | ' + document.title;
    }
  } catch (e) { /* 静默 */ }

  // 已展开的"查看全部/收起"开关条 → 删除（文字含"收起"即已展开）
  let toggleHidden = new WeakSet();  function hideAnalysisToggle() {
    try {
      document.querySelectorAll('[class~="' + HASH.analysisToggle + '"]').forEach(t => {
        const txt = t.textContent || '';
        if (txt.indexOf('收起') !== -1 && !toggleHidden.has(t)) {
          t.style.display = 'none';
          toggleHidden.add(t);
        } else if (txt.indexOf('收起') === -1 && toggleHidden.has(t)) {
          // React 重渲染后回退为"查看全部"（如换题），重新参与展开流程
          t.style.display = '';
          toggleHidden.delete(t);
        }
      });
    } catch (e) { /* 静默 */ }
  }

  // 题号网格中的橙黄空白填充块 → 隐藏（安全判定：不含任何题号圆点才藏；
  // 含题号的包裹层只去底色不动内容。遍历全部子元素，覆盖 React 换题重排）
  function hideNumGridFiller() {
    try {
      document.querySelectorAll(
        '[class~="' + HASH.leftCard + '"] [class~="' + HASH.numGrid + '"]'
      ).forEach(grid => {
        Array.from(grid.children).forEach(child => {
          const isNum = child.className.indexOf(HASH.numItem) !== -1
            || child.querySelector('[class~="' + HASH.numItem + '"]');
          if (!isNum) {
            if (child.style.display !== 'none') child.style.display = 'none';
          } else if (child.style.background) {
            child.style.background = 'none'; // 含题号但带底色的包裹层：只去底色
          }
        });
      });
    } catch (e) { /* 静默 */ }
  }

  // ================= 分屏：题目(左) | 分割线 | 解析(右) =================
  // v3.12 克隆镜像模式：v3.11 把原件搬进面板，React 重渲染时找不到自己管理的节点
  // → 卸载内容 → 面板被清空(用户实测"先显示后白屏")。本版原件留原地(打标隐藏)，
  // React 照常更新；面板显示 cloneNode 副本，内容签名变化时自动重新克隆同步。
  // 样式保命：pane 挂在 mainCol(Z19QS73) 内，.Z19QS73 .CzaEDr8I 系后代选择器在克隆体上照常命中。
  // v3.17：分屏开关状态落 localStorage，刷新/重开解析页沿用上次选择。
  // 与拖拽宽度 abuSplitPct 走同一存储通道；无记录(首次安装)时默认分屏=开。
  const SPLIT_OFF_KEY = 'abuSplitOff';
  function readSplitOff() {
    try { return localStorage.getItem(SPLIT_OFF_KEY) === '1'; } catch (e) { return false; }
  }
  function writeSplitOff(off) {
    try { localStorage.setItem(SPLIT_OFF_KEY, off ? '1' : '0'); } catch (e) { /* 隐私模式等禁用存储时静默降级为不记忆 */ }
  }

  let splitDrag = null;
  let lastSplitSig = '';
  let splitOff = readSplitOff();  // 分屏总开关(油猴菜单切换，视频页播放器搬移异常时的兜底)

  function collectSplitSources(main) {
    const scoreCard = main.querySelector('[class~="' + HASH.qCard + '"]');
    const anaWrap = main.querySelector('[class~="' + HASH.anaWrapP + '"]');
    if (!scoreCard || !anaWrap) return null;
    // 右栏源：CzaEDr8I 整体 + 其后各层级(至 mainCol 为止)的全部后续兄弟 → "网页以下所有元素"
    const rightSrc = [anaWrap];
    let node = anaWrap;
    while (node.parentElement && node.parentElement !== main) {
      let s = node.nextElementSibling;
      while (s) { rightSrc.push(s); s = s.nextElementSibling; }
      node = node.parentElement;
    }
    // 左栏源：解析壳之前的全部前序内容(题干 dataReportBox>YZX9、"您的答案" VQyPeQur、打分卡等)，
    // 整段收编不猜 hash，无论题干挂在哪个兄弟容器都命中；去重保文档序
    const pre = [];
    let node2 = anaWrap;
    while (node2.parentElement && node2.parentElement !== main) {
      let p = node2.previousElementSibling;
      while (p) { pre.unshift(p); p = p.previousElementSibling; }
      node2 = node2.parentElement;
    }
    const leftSrc = pre.slice();
    if (leftSrc.indexOf(scoreCard) === -1) leftSrc.unshift(scoreCard);
    // 中间壳：anaWrap 至 mainCol 之间的祖先链(DP3MM28 大白卡/k3mnrtWjl 等)。
    // 其内容已全部进左右源，克隆后只剩空壳白卡占位(v3.12.1 用户指认"一大片空白")——一并打标隐藏
    const shells = [];
    let node3 = anaWrap.parentElement;
    while (node3 && node3 !== main) { shells.push(node3); node3 = node3.parentElement; }
    return { leftSrc, rightSrc, shells };
  }

  function mirrorClone(el) {
    const c = el.cloneNode(true);
    c.removeAttribute('data-abu-src');
    c.querySelectorAll('[data-abu-src]').forEach(n => n.removeAttribute('data-abu-src'));
    return c;
  }

  // 退出分屏(v3.14)：拆面板、剥原件隐藏标记，恢复站点原生渲染。
  // 场景：视频/音频解析页——播放器原件被打 data-abu-src 隐藏后，面板里的
  // 克隆副本没有 video.js 实例(事件/播控全绑在原件上)，播放必死 → 只能不分区
  function teardownSplitView(main) {
    try {
      // 配套修复(v3.17)：带 video.js 实例的真播放器此刻还驻在面板里，
      // 直接删面板会把正主一起带走，原位只剩克隆死件 → 关分屏后播不了。
      // 先把真件换回死件占位处，再拆面板；找不到死件时兜底挂回主列，
      // 宁可位置不精确，也不能把真件删掉。
      main.querySelectorAll('[data-abu-live-player="1"]').forEach(live => {
        const dead = [...main.querySelectorAll('[data-abu-dead-player="1"]')]
          .find(d => !d.closest('[data-abu-pane]'));
        if (dead && dead.isConnected) {
          dead.replaceWith(live);
        } else {
          const firstPane = main.querySelector(':scope > [data-abu-pane]');
          if (firstPane) main.insertBefore(live, firstPane);
        }
        live.removeAttribute('data-abu-live-player');
      });
      main.removeAttribute('data-abu-split');
      main.querySelectorAll('[data-abu-src]').forEach(n => n.removeAttribute('data-abu-src'));
      main.querySelectorAll(':scope > [data-abu-pane]').forEach(n => n.remove());
    } catch (e) { /* 静默 */ }
    lastSplitSig = '';
  }

  // 播放器选择器：video.js 容器(id 或通用类)，音频播放器同源同样处理
  const PLAYER_SEL = '#player-container-id, [id^="player-container"], .video-js';

  // 播放器入驻面板(v3.16)：分屏克隆出来的播放件没有 video.js 实例(播控事件/播放器
  // 对象全绑在原件上)→ 克隆死件播不了。真件(带实例)搬进面板替换克隆件即可继续播；
  // 克隆死件回填原件位当占位(打 data-abu-dead-player 标防误认)，React 结构引用尽量完整。
  // 先例：bottomRail/moveStatsCard 同为 React 节点搬移，多轮切题无恙
  function adoptPlayer(main, pane, rescued) {
    try {
      const copy = pane.querySelector(PLAYER_SEL);
      if (!copy) return;
      // 真件优先级：① 原件树里 React 新建的(切题后的新实例) > ② 上一轮已入驻的旧件(rescued，重克隆时被 replaceChildren 摘下)
      let live = [...main.querySelectorAll(PLAYER_SEL)].find(el =>
        !el.closest('[data-abu-pane]') && el.getAttribute('data-abu-dead-player') !== '1');
      if (!live) live = rescued || null;
      if (!live || live === copy) return;
      // 原件若还在原件树(非面板)里，记下原位，搬走后把克隆死件填回去
      const op = live.closest('[data-abu-pane]') ? null : live.parentElement;
      const on = op ? live.nextSibling : null;
      copy.replaceWith(live);
      live.setAttribute('data-abu-live-player', '1');
      if (op && op.isConnected) {
        copy.setAttribute('data-abu-dead-player', '1');
        op.insertBefore(copy, on);
      }
    } catch (e) { /* 静默 */ }
  }

  function applySplitView() {
    try {
      const main = document.querySelector('[class~="' + HASH.mainCol + '"]');
      if (!main) return;
      // 总开关关闭态：拆干净残留，本轮及后续循环都不再分屏。
      // 判定放在收集源节点之前(关态无需找源)；同时检查面板残留，
      // 防 React 洗掉 data-abu-split 属性却留下孤儿面板的情况
      if (splitOff) {
        if (main.getAttribute('data-abu-split') || main.querySelector(':scope > [data-abu-pane]')) {
          teardownSplitView(main);
        }
        return;
      }
      const src = collectSplitSources(main);
      if (!src) return;

      // 面板三件套不在位则建(React 洗掉后由本轮循环重建)；重建保留已存宽度
      let leftPane = main.querySelector(':scope > [data-abu-pane="left"]');
      let bar = main.querySelector(':scope > [data-abu-pane="bar"]');
      let rightPane = main.querySelector(':scope > [data-abu-pane="right"]');
      if (!leftPane || !bar || !rightPane) {
        leftPane = document.createElement('div'); leftPane.dataset.abuPane = 'left';
        rightPane = document.createElement('div'); rightPane.dataset.abuPane = 'right';
        bar = document.createElement('div'); bar.dataset.abuPane = 'bar';
        let savedPct = 50;
        try { savedPct = parseFloat(localStorage.getItem('abuSplitPct')); } catch (e) {}
        if (!isFinite(savedPct)) savedPct = 50;
        leftPane.style.setProperty('width', Math.min(95, Math.max(5, savedPct)) + '%', 'important');
        main.appendChild(leftPane);
        main.appendChild(bar);
        main.appendChild(rightPane);
        bindSplitBar(bar, leftPane, main);
      }
      main.setAttribute('data-abu-split', '1');

      // 原件打标隐藏(克隆前打，克隆体上除标)；中间空壳同批隐藏
      [...src.leftSrc, ...src.rightSrc, ...src.shells].forEach(el => {
        if (el.getAttribute('data-abu-src') !== '1') el.setAttribute('data-abu-src', '1');
      });

      // 内容签名：源集合结构 + 文本摘要。静态时零成本跳过；
      // 切题/展开/数字变化 → 签名变 → 全量重克隆同步(含 expandAll 点开展开的效果)
      const sig = src.leftSrc.concat(src.rightSrc, src.shells).map(el =>
        el.className + '#' + (el.textContent || '').replace(/\s+/g, ' ').slice(0, 400)
      ).join('|');
      if (sig === lastSplitSig) return;
      lastSplitSig = sig;

      // 克隆前先抢救旧面板里已入驻的真播放器(replaceChildren 会连它一起摘下，但节点仍活，可回插)
      const rescuedL = leftPane.querySelector('[data-abu-live-player="1"]');
      const rescuedR = rightPane.querySelector('[data-abu-live-player="1"]');
      leftPane.replaceChildren(...src.leftSrc.map(mirrorClone));
      rightPane.replaceChildren(...src.rightSrc.map(mirrorClone));
      // 真播放器入驻对应面板(题干视频→左栏、视频解析→右栏)，克隆死件回填原件位
      adoptPlayer(main, leftPane, rescuedL);
      adoptPlayer(main, rightPane, rescuedR);
    } catch (e) { /* React 节点冲突时静默跳过 */ }
  }

  function bindSplitBar(bar, leftPane, main) {
    bar.addEventListener('dblclick', () => {  // 双击分割条恢复对半
      leftPane.style.setProperty('width', '50%', 'important');
      try { localStorage.setItem('abuSplitPct', '50'); } catch (e) {}
    });
  }
  // 拖拽 v3.12.5：mousedown 改挂 document 捕获阶段(capture)——
  // bar 元素被 React 洗掉重建/事件被站点拦截都不影响；按住时 title 写 [DRAG] 供远程验证
  if (!window.__abuSplitDocBound) {
    window.__abuSplitDocBound = true;
    document.addEventListener('mousedown', e => {
      const t = e.target;
      const bar = t && t.closest ? t.closest('[data-abu-pane="bar"]') : null;
      if (!bar) return;
      const main = bar.parentElement;
      const leftPane = main && main.querySelector(':scope > [data-abu-pane="left"]');
      if (!leftPane) return;
      splitDrag = { leftPane, main, startX: e.clientX, startW: leftPane.getBoundingClientRect().width };
      document.body.dataset.abuDragging = '1';
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
      if (!/^\[DRAG\]/.test(document.title)) document.title = '[DRAG]' + document.title;
      e.preventDefault();
    }, true);
    document.addEventListener('mousemove', e => {
      if (!splitDrag) return;
      // 动态重查面板：React 洗掉重建后 splitDrag 里的旧引用已 detach，写它无效
      const main = splitDrag.main && splitDrag.main.isConnected
        ? splitDrag.main
        : document.querySelector('[class~="' + HASH.mainCol + '"]');
      if (!main) return;
      const lp = main.querySelector(':scope > [data-abu-pane="left"]');
      if (!lp) return;
      const total = main.getBoundingClientRect().width - 18; // 扣除分割条宽(14px)+边距(4px)
      if (total <= 0) return;
      let w = splitDrag.startW + (e.clientX - splitDrag.startX);
      w = Math.max(0, Math.min(total, w));
      lp.style.setProperty('width', (w / total * 100).toFixed(2) + '%', 'important');
    });
    document.addEventListener('mouseup', () => {
      if (!splitDrag) return;
      const main = splitDrag.main && splitDrag.main.isConnected
        ? splitDrag.main
        : document.querySelector('[class~="' + HASH.mainCol + '"]');
      const lp = main && main.querySelector(':scope > [data-abu-pane="left"]');
      const total = main ? main.getBoundingClientRect().width - 18 : 0;
      if (lp && total > 0) {
        try { localStorage.setItem('abuSplitPct', String(lp.getBoundingClientRect().width / total * 100)); } catch (e) {}
      }
      splitDrag = null;
      document.body.removeAttribute('data-abu-dragging');
      document.title = document.title.replace(/^\[DRAG\]/, '');
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    });
  }

  function discover() {
    try {
      moveBottomRail();
      moveStatsCard();
      mergeTitleRow();
      applySplitView();
      hideAnalysisToggle();
      hideNumGridFiller();

      // 顶部导航的顶层包裹（白底所在层）
      const navHit = findAllByText(/^学习效果测试$/)[0];
      if (navHit) {
        const row = climb(navHit, n => {
          const r = n.getBoundingClientRect();
          return r.width > innerWidth * 0.9 && r.height < 100 && r.height > 30 && r.top < 120;
        });
        if (row) {
          mark(row, 'mainnav');
          const root = climb(row, isTopLevel);
          if (root && root !== row) mark(root, 'headerroot');
        }
      }

      // 黑色营销条（含登录入口，只压缩）
      const blackHit = findAllByText(/^(打卡|400-\d{3}-\d{3}-\d{3})$/)[0]
        || findAllByText(/^App下载$/)[0];
      if (blackHit) {
        mark(climb(blackHit, n => {
          const r = n.getBoundingClientRect();
          return r.width > innerWidth * 0.9 && r.height < 70 && r.top < 10;
        }), 'blackbar');
      }

      // 面包屑
      const crumbHit = findAllByText(/^题库[>\s]*章节练习/)[0];
      if (crumbHit) {
        mark(climb(crumbHit, n => {
          const r = n.getBoundingClientRect();
          return r.width > innerWidth * 0.9 && r.height < 45;
        }), 'breadcrumb');
      }

      // 左侧答题卡
      const tipsHit = findAllByText(/^只看错题$/)[0];
      if (tipsHit) {
        const card = climb(tipsHit, n => {
          const r = n.getBoundingClientRect();
          return r.width > 150 && r.width < 520 && r.height > 150;
        });
        if (card) mark(card, 'tips');
      }

      // 底部操作栏
      const barHit = findAllByText(/^继续练习$/)[0];
      if (barHit) {
        mark(climb(barHit, n => {
          const cs = getComputedStyle(n);
          const r = n.getBoundingClientRect();
          return cs.position === 'fixed' && r.height < 130 && r.height > 30;
        }) || climbCard(barHit), 'bottombar');
      }
    } catch (e) { /* 静默 */ }
  }

  function climbCard(el, maxW = 0.7, maxH = 0.85) {
    let card = null;
    let cur = el;
    while (cur && cur !== document.body) {
      const r = cur.getBoundingClientRect();
      if (r.width > innerWidth * maxW || r.height > innerHeight * maxH) break;
      const cs = getComputedStyle(cur);
      const styled = cs.backgroundColor !== 'rgba(0, 0, 0, 0)'
        || cs.borderWidth !== '0px' || cs.boxShadow !== 'none';
      if (styled && r.width > 0) card = cur;
      cur = cur.parentElement;
    }
    return card || el;
  }

  // ================= 顶部导航自动隐藏（display:none，释放占位） =================
  let lastY = 0;
  function onScroll() {
    if (!CFG.autoHideTop) return;
    const root = document.querySelector('[data-abu~="headerroot"]');
    const fallback = document.querySelectorAll('[data-abu~="blackbar"], [data-abu~="mainnav"]');
    const y = window.scrollY || document.documentElement.scrollTop;
    const delta = y - lastY;
    const hide = delta > 4 && y > 60;
    const show = delta < -4;
    if (hide || show) {
      if (root) root.classList.toggle('abu-top-hidden', hide);
      else fallback.forEach(n => n.classList.toggle('abu-top-hidden', hide));
    }
    lastY = y;
  }

  // ================= 解析自动展开 =================
  function isExpandButton(el) {
    const text = (el.textContent || '').trim();
    if (!EXPAND_TEXTS.has(text)) return false;
    // 面板里是 cloneNode 副本，没有 React 事件，点它只会白耗次数
    if (el.closest('[data-abu-pane]')) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    // 分屏时原件被 [data-abu-src] 整棵隐藏，其 rect 恒为 0；但 .click()
    // 仍能冒泡触发 React 委托事件。放行隐藏子树里的展开按钮，React 换成全文后
    // 签名变化 → 面板自动重克隆同步(v3.17.3)。非分屏态仍走原来的可见性判定。
    if (!el.closest('[data-abu-src]')) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return false;
    }
    return true;
  }

  function isInsideClicked(el) {
    let p = el;
    while (p) {
      if (clicked.has(p)) return true;
      p = p.parentElement;
    }
    return false;
  }

  function expandAll() {
    let clicks = 0;
    const all = document.querySelectorAll('div, span, button, a, p');
    for (const el of all) {
      if (clicks >= MAX_CLICKS_PER_RUN) break;
      if (!isExpandButton(el)) continue;
      if (el.parentElement && isExpandButton(el.parentElement)) continue;
      if (isInsideClicked(el)) continue;
      const tries = clicked.get(el) || 0;
      if (tries >= MAX_RETRIES) continue;
      try {
        el.click();
        clicked.set(el, tries + 1);
        clicks++;
      } catch (e) { /* 忽略 */ }
    }
    return clicks;
  }

  // ================= 调度 =================
  let timer = null;
  function schedule() {
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      try { expandAll(); discover(); } catch (e) { /* noop */ }
    }, DEBOUNCE_MS);
  }

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  document.addEventListener('scroll', onScroll, true);

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('切换调试高亮', () => {
      debugOn = !debugOn;
      if (!debugOn) document.querySelectorAll('[data-abu-debug]').forEach(n => n.removeAttribute('data-abu-debug'));
      else discover();
    });
    GM_registerMenuCommand('切换磨砂效果', () => {
      frostedOn = !frostedOn;
      injectStyle();
    });
    // 兜底开关(v3.16)：播放器搬移若出意外，一键退回原生布局并保持(再点一次恢复分屏)
    // v3.17：切换即时落盘，下次打开解析页沿用本次选择，不再重置回分屏
    GM_registerMenuCommand('切换分屏开/关(视频页兜底·记住状态)', () => {
      splitOff = !splitOff;
      writeSplitOff(splitOff);
      const main = document.querySelector('[class~="' + HASH.mainCol + '"]');
      if (splitOff) {
        if (main) teardownSplitView(main);
      } else {
        discover();
      }
    });
    // v3.18：三态循环，切换即时生效并落盘；auto 时由 matchMedia 实时跟随系统
    GM_registerMenuCommand('切换主题(跟随浏览器/固定浅色/固定深色)', () => {
      themeMode = THEME_MODES[(THEME_MODES.indexOf(themeMode) + 1) % THEME_MODES.length];
      writeThemeMode(themeMode);
      applyTheme();
      showThemeToast();
    });
  }

  injectStyle();
  setTimeout(() => { try { expandAll(); discover(); } catch (e) { /* noop */ } }, 1200);
})();

/* ==========================================================================
 * v3.17.1：面包屑「知识网刷题 / 章节练习」返回对应部门法的练习目录页
 * --------------------------------------------------------------------------
 * 站点在 answerAnalysis / obt/analysis 里把这一级 url 写死成 /w/questionBank，
 * 而同一段代码中其它来源分支用的是 document.referrer。此处不动站点代码：
 *   目录页 → 按部门法键记录完整 URL（含 catalogId / id / catTitle 等参数）
 *   报告页 → 捕获阶段接管这一级点击，replace 到记录或来源的目录页
 * 部门法由 bussId + questionTypeId 推导，不硬编码 702/703，全科目通用；
 * 「题库」这一级保持站点原行为。原有紧凑布局与面包屑隐藏规则一律不动。
 * 合并自独立脚本 zhumavip-breadcrumb-back.user.js，二者不要同时启用。
 * ========================================================================== */
(function () {
  'use strict';

  var STORE_KEY = 'abuBreadcrumbBack_v1';
  var CRUMB_RE = /^(知识网刷题|章节练习)\s*>/;
  var REPORT_RE = /^\/(?:w\/answerAnalysis|obt\/analysis|w\/dataReport|w\/myWrongQuestion)(?:\/|$)/;

  if (!/(^|\.)zhumavip\.com$/i.test(location.hostname)) return;

  function toUrl(u) {
    try { return new URL(u, location.origin); } catch (e) { return null; }
  }

  function sameOrigin(u) {
    var url = toUrl(u);
    return !!url && url.origin === location.origin;
  }

  // 目录页：/w/shuati/catalog，或带目录标题参数的 /w/shuati 页面
  function isDirectoryUrl(u) {
    if (!u || !sameOrigin(u)) return false;
    var url = toUrl(u);
    if (!/\/w\/shuati(?:\/|$)/i.test(url.pathname)) return false;
    return /\/catalog(?:\/|$)/i.test(url.pathname) ||
           /[?&](?:catTitle|queType|parentTitle)=/.test(url.search);
  }

  // 部门法 id 是 702/703 这类短数字；/obt/analysis 的 questionTypeId 可能是练习记录长 ID
  function isDeptId(v) {
    return !!v && /^\d{1,6}$/.test(v);
  }

  function deptKey(q) {
    var biz = q.get('bussId') || q.get('businessTypeId') || '';
    var qt = q.get('questionTypeId') || q.get('reallyQuestionTypeId') || '';
    return biz + '|' + (isDeptId(qt) ? qt : '');
  }

  function readStore(area) {
    try { return JSON.parse(area.getItem(STORE_KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }

  function writeStore(area, data) {
    try { area.setItem(STORE_KEY, JSON.stringify(data)); } catch (e) { /* 隐私模式静默降级 */ }
  }

  // 一、目录页：按部门法键记录完整 URL
  if (isDirectoryUrl(location.href)) {
    var qOnCatalog = new URLSearchParams(location.search);
    var keyOnCatalog = deptKey(qOnCatalog);
    if (keyOnCatalog !== '|') {
      var snapshot = {
        url: location.href,
        biz: qOnCatalog.get('bussId') || qOnCatalog.get('businessTypeId') || '',
        qt: qOnCatalog.get('questionTypeId') || '',
        code: qOnCatalog.get('code') || '',
        t: Date.now()
      };
      [sessionStorage, localStorage].forEach(function (area) {
        var data = readStore(area);
        data[keyOnCatalog] = { url: snapshot.url, t: snapshot.t };
        data.__last = snapshot;
        writeStore(area, data);
      });
    }
  }

  if (!REPORT_RE.test(location.pathname)) return;

  // 二、报告页：推导应当返回的目录页 URL
  var cur = new URLSearchParams(location.search);
  var curBiz = cur.get('businessTypeId') || cur.get('bussId') || '';
  var curQtRaw = cur.get('reallyQuestionTypeId') || cur.get('questionTypeId') || '';
  var curQt = isDeptId(curQtRaw) ? curQtRaw : '';

  function referrerMatchesDept(u) {
    var q = new URLSearchParams(toUrl(u).search);
    var biz = q.get('bussId') || q.get('businessTypeId') || '';
    var qtRaw = q.get('questionTypeId') || q.get('reallyQuestionTypeId') || '';
    var qt = isDeptId(qtRaw) ? qtRaw : '';
    return (!curBiz || !biz || biz === curBiz) && (!curQt || !qt || qt === curQt);
  }

  function resolveTarget() {
    // 优先用站点自己也在用的 document.referrer，且必须同部门法
    var ref = document.referrer;
    if (isDirectoryUrl(ref) && referrerMatchesDept(ref)) return ref;

    // 其次用本会话 / 本浏览器记录过的目录页，键保证不串到别的部门法
    var key = deptKey(cur);
    var areas = [sessionStorage, localStorage];
    for (var i = 0; i < areas.length; i++) {
      var data = readStore(areas[i]);
      var rec = data[key];
      if (rec && rec.url && sameOrigin(rec.url)) return rec.url;

      // 报告页只带长 ID、算不出部门法时，退回最近一次目录页，仍校验业务类型与科目
      var last = data.__last;
      if (rec === undefined && last && last.url && sameOrigin(last.url) &&
          (!curBiz || !last.biz || last.biz === curBiz) &&
          (!curQt || !last.qt || last.qt === curQt)) {
        return last.url;
      }
    }
    return null;
  }

  // 三、捕获阶段接管点击，阻止站点 onClick 执行 location.replace(/w/questionBank)
  document.addEventListener('click', function (ev) {
    var el = ev.target instanceof Element ? ev.target : (ev.target && ev.target.parentElement);
    for (var i = 0; el && i < 4; i++, el = el.parentElement) {
      var txt = (el.textContent || '').trim();
      if (CRUMB_RE.test(txt)) {
        var target = resolveTarget();
        if (!target) {
          console.warn('[阿布·面包屑] 尚未记录到该部门法的目录页，请先从章节练习/知识网刷题目录页进入一次；本次保持站点原行为。');
          return;
        }
        ev.preventDefault();
        ev.stopPropagation();
        window.location.replace(target);
        return;
      }
      if (txt.length > 40) break;
    }
  }, true);

  // 四、悬停提示，便于确认接管已生效（React 异步渲染，故延迟补标）
  function markCrumbHints() {
    var nodes = document.querySelectorAll('div, span, a');
    for (var i = 0; i < nodes.length; i++) {
      if (CRUMB_RE.test((nodes[i].textContent || '').trim())) {
        nodes[i].title = '已接管：返回该部门法的章节练习/知识网刷题目录页';
      }
    }
  }
  markCrumbHints();
  setTimeout(markCrumbHints, 2000);
  setTimeout(markCrumbHints, 6000);
})();
