/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Scene, Evidence, Suspect, TimelineEvent, CharacterRelation } from './types';

export const AUDIO_ASSETS = {
  rain: 'https://cdn.pixabay.com/audio/2021/08/09/audio_88444c8038.mp3',
  clock: 'https://cdn.pixabay.com/audio/2021/11/25/audio_e19623e590.mp3',
  footsteps: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c1c4e976db.mp3',
  typing: 'https://cdn.pixabay.com/audio/2022/03/15/audio_6f7f6f1f4d.mp3',
  pageTurn: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a1b6a67a.mp3',
};

export const INITIAL_SCENES: Record<string, Scene> = {
  'start': {
    id: 'start',
    title: '序幕 - 三月的清晨',
    text: '上午七点三十五分，石神像平常一样走出公寓。虽已进入三月，风还是颇冷，他把下巴埋在围巾里。走上马路前，他先瞥了一眼放自行车的地方——那里停着几辆车，不过没有他在意的绿色自行车。\n\n那是花冈靖子的自行车。每天这个时候，她都会骑车去便当店上班。石神是高中数学老师，住在她隔壁。他每天都会特意绕远路去弁天亭买便当，只为了看她一眼。',
    imageUrl: '/images/01_石神走过隅田川.png',
    hotspots: [
      { id: 'h1', x: 30, y: 70, radius: 40, label: '观察靖子的窗户', discoveryEvidenceId: 'ishigami_obsession' },
      { id: 'h2', x: 70, y: 60, radius: 40, label: '查看日历', targetSceneId: 'calendar_check' }
    ],
    choices: [
      { id: 'c1', text: '前往弁天亭买便当', targetSceneId: 'bentou_shop' },
      { id: 'c2', text: '直接去学校', targetSceneId: 'school_path' }
    ]
  },
  'calendar_check': {
    id: 'calendar_check',
    title: '日历上的日期',
    text: '今天是三月十日。石神注意到日历上没有任何特别标记，但他的直觉告诉他，这一天将会不同寻常。\n\n隔壁传来动静——靖子出门了。他听到那辆绿色自行车的链条声。',
    imageUrl: '/images/41_日历上的日期.png',
    choices: [
      { id: 'back', text: '出门跟随', targetSceneId: 'bentou_shop' }
    ]
  },
  'bentou_shop': {
    id: 'bentou_shop',
    title: '弁天亭',
    text: '"欢迎光临，您早。"柜台后面，传来石神听惯的声音。戴着白帽的花冈靖子笑靥如花。\n\n"嗯……招牌便当。"\n"好，招牌一份。谢谢您每次惠顾。"\n\n石神不敢正视她，只一直低头盯着皮夹。付钱时，他总算挤出一句"天气真冷"，但含糊的咕哝声被随后进来的客人拉门声盖下去了。',
    imageUrl: '/images/03_弁天亭便当店.png',
    hotspots: [
      { id: 'h3', x: 50, y: 50, radius: 45, label: '观察靖子的表情', discoveryEvidenceId: 'yasuko_daily_life' }
    ],
    choices: [
      { id: 'c3', text: '离开便当店', targetSceneId: 'school_path' }
    ]
  },
  'school_path': {
    id: 'school_path',
    title: '通往学校的路',
    text: '石神沿着隅田川漫走。他走过新大桥，看到堤防边一整排游民的蓝色塑料布棚屋。\n\n他给这些游民取了绰号："罐男"、"技师"……他们是他每天必经路上的固定风景。石神有时会想，自己和这些被社会遗忘的人，究竟有什么本质区别？\n\n他是个数学天才，却在一所普通高中教书，日复一日地重复着毫无挑战性的课程。',
    imageUrl: '/images/02_新大桥下的游民聚落.png',
    choices: [
      { id: 'c4', text: '继续走向学校', targetSceneId: 'school_arrival' },
      { id: 'c5', text: '在河边多待一会儿', targetSceneId: 'river_thinking' }
    ]
  },
  'river_thinking': {
    id: 'river_thinking',
    title: '河边的沉思',
    text: '石神望着浑浊的隅田川。数学公式在他脑中流转——这是他每天的精神功课。\n\n"纸笔有限，或许尝试本身才更有意义。"这是他大学时代的朋友汤川学说过的话。那时他们都相信，能够以理论建构世上的一切。\n\n如今，汤川成了帝都大学的物理副教授，而石神却在这里，守着一个秘密。',
    imageUrl: '/images/17_新大桥下的选择.png',
    hotspots: [
      { id: 'h4', x: 60, y: 65, radius: 50, label: '观察游民们', discoveryEvidenceId: 'homeless_info' }
    ],
    choices: [
      { id: 'c6', text: '该去学校了', targetSceneId: 'school_arrival' }
    ]
  },
  'school_arrival': {
    id: 'school_arrival',
    title: '高中教师的一天',
    text: '石神走进私立高中的教职员办公室。同事们礼貌地打招呼，但没人真正了解他。\n\n"石神老师，今天的数学课还是老样子吗？"隔壁桌的英语老师问。\n"嗯，照课本讲。"\n\n他打开教案，却心不在焉。脑海中始终浮现着靖子的脸——那个他愿意为之付出一切的女人。',
    imageUrl: '/images/42_高中教职员办公室.png',
    choices: [
      { id: 'c7', text: '开始上课', targetSceneId: 'class_scene' },
      { id: 'c8', text: '查看柔道队训练', targetSceneId: 'judo_club' }
    ]
  },
  'class_scene': {
    id: 'class_scene',
    title: '数学课',
    text: '石神站在讲台上，面对着昏昏欲睡的学生们。他在黑板上写下公式，机械地讲解着。\n\n"老师，这道题太难了吧？"有学生抱怨。\n"数学需要逻辑思考，不能靠死记硬背。"石神平静地回答。\n\n他的目光扫过教室，突然想到：如果有一天，他必须用逻辑来掩盖一个真相，他能做到吗？',
    imageUrl: '/images/43_数学课堂.png',
    choices: [
      { id: 'c9', text: '下课', targetSceneId: 'after_school' }
    ]
  },
  'judo_club': {
    id: 'judo_club',
    title: '柔道队',
    text: '石神来到道场。作为柔道队的教练，他看着学生们练习摔技。\n\n"老师，您的柔道是几段？"有学生问。\n"五段。"\n\n柔道和数学一样，需要精准的计算和时机。石神想起爷爷开的道馆，那是他童年的记忆。\n\n也许正是柔道训练，让他拥有了足够的力量——在必要的时候。',
    imageUrl: '/images/44_柔道道场.png',
    choices: [
      { id: 'c10', text: '结束训练', targetSceneId: 'after_school' }
    ]
  },
  'after_school': {
    id: 'after_school',
    title: '傍晚',
    text: '放学后，石神回到公寓。他习惯性地看向隔壁——靖子家的灯亮着。\n\n但今天，有什么不对劲。\n\n他听到了争吵声。男人的怒吼，女人的尖叫，还有重物倒地的闷响。\n\n石神的心猛地收紧。那是靖子的声音。',
    imageUrl: '/images/45_傍晚的公寓走廊.png',
    ambientEffect: 'rain',
    choices: [
      { id: 'c11', text: '去敲门查看', targetSceneId: 'knock_door' },
      { id: 'c12', text: '先观察情况', targetSceneId: 'observe_first' }
    ]
  },
  'knock_door': {
    id: 'knock_door',
    title: '敲门',
    text: '"花冈小姐？"石神敲门。\n\n过了一会儿，门开了一条缝。靖子的脸出现在门缝后，头发凌乱，脸色苍白。\n\n"请问……有事吗？"她挤出一个微笑。\n"我听到很大的响动。出了什么事？"\n"不，什么事也没有。对不起，给您添麻烦了。"\n\n石神的小眼睛朝屋里望去——他看到了暖桌下露出的衣角，还有空气中的烟味。',
    imageUrl: '/images/09_公寓门口纠缠.png',
    hotspots: [
      { id: 'h5', x: 55, y: 70, radius: 45, label: '仔细观察室内', discoveryEvidenceId: 'crime_scene_clue' }
    ],
    choices: [
      { id: 'c13', text: '"有蟑螂？"', targetSceneId: 'cockroach_excuse' },
      { id: 'c14', text: '直接追问', targetSceneId: 'direct_question' }
    ]
  },
  'observe_first': {
    id: 'observe_first',
    title: '观察',
    text: '石神站在自己门口，竖起耳朵。这栋公寓的隔音效果很好，但他还是听到了一些声音。\n\n争吵，打斗，然后是寂静。\n\n太长的寂静。\n\n他看到靖子家门口没有客人的鞋子，但空气中有烟味飘出。暖桌的位置似乎被移动过。\n\n石神的数学大脑开始运转——他在推导发生了什么。',
    imageUrl: '/images/46_隔墙倾听.png',
    choices: [
      { id: 'c15', text: '去敲门', targetSceneId: 'knock_door' }
    ]
  },
  'cockroach_excuse': {
    id: 'cockroach_excuse',
    title: '蟑螂的借口',
    text: '"蟑螂？"石神面无表情地问。\n"对。有蟑螂……我和我女儿想打蟑螂……才闹出些动静。"\n"杀死了吗？"\n"啊……当然。已经没事了。"\n\n石神点点头。"有什么我能帮忙的，尽管说。"\n\n他当然知道这不是蟑螂。这栋公寓从来没有蟑螂。',
    imageUrl: '/images/47_蟑螂的借口.png',
    choices: [
      { id: 'c16', text: '回到房间', targetSceneId: 'call_decision' }
    ]
  },
  'direct_question': {
    id: 'direct_question',
    title: '直接追问',
    text: '石神直视靖子的眼睛。"花冈小姐，你不需要瞒我。"\n\n靖子的脸色更加苍白。"我瞒什么……"\n"我知道不是你一个人处理的。"\n\n门缝后的眼睛睁大了。石神继续说："你们无法处理尸体。"\n\n靖子几乎瘫倒。他知道了。他全知道了。',
    imageUrl: '/images/48_直接追问.png',
    choices: [
      { id: 'c17', text: '提出帮忙', targetSceneId: 'offer_help' }
    ]
  },
  'call_decision': {
    id: 'call_decision',
    title: '抉择',
    text: '石神回到房间，坐在黑暗中。\n\n他听到了隔壁的动静——母女俩在低声争执，还有电话铃声。\n\n他知道发生了什么。靖子的前夫富㭴慎二——那个一直在纠缠她们的男人——今天来了。\n\n然后，他死了。\n\n石神拿起电话。他必须做出选择。',
    imageUrl: '/images/49_黑暗中的抉择.png',
    ambientEffect: 'rain',
    choices: [
      { id: 'c18', text: '打电话给靖子', targetSceneId: 'phone_call' },
      { id: 'c19', text: '报警', targetSceneId: 'call_police' }
    ]
  },
  'phone_call': {
    id: 'phone_call',
    title: '电话',
    text: '"喂？您好，我是花冈。"\n"我是隔壁的石神。"\n"啊……有什么事吗？"\n"不知道你们商量得怎样了。"\n\n靖子沉默了。石神继续说："如果报警，我毫无意见。要是没这个打算，我或许……帮得上忙。"\n\n"花冈小姐，你们无法处理尸体。"\n\n电话那头传来倒吸凉气的声音。',
    imageUrl: '/images/50_深夜电话.png',
    choices: [
      { id: 'c20', text: '提出过去帮忙', targetSceneId: 'offer_help' }
    ]
  },
  'call_police': {
    id: 'call_police',
    title: '报警',
    text: '石神的手指悬在拨号键上。\n\n如果报警，靖子和美里会被带走。一个母亲，一个女儿，她们刚刚摆脱了一个恶魔，却要因为杀死他而入狱。\n\n这公平吗？\n\n石神放下了电话。他不能让这种事发生。',
    imageUrl: '/images/51_悬停的手指.png',
    choices: [
      { id: 'c21', text: '打电话给靖子', targetSceneId: 'phone_call' }
    ]
  },
  'offer_help': {
    id: 'offer_help',
    title: '献身的开始',
    text: '石神走进靖子的公寓。他看到了暖桌下的尸体——富㭴慎二，脸呈紫黑色，脖子上有一圈暗红色的勒痕。\n\n"是我前夫……"靖子颤抖着说，"他来纠缠我……我实在受不了了……"\n\n石神单膝跪地，检查尸体。"你打算自首？"\n"只能这样了。"\n\n"花冈小姐，你用不着瞒我。我知道不是你一个人干的，美里帮忙了。"\n\n靖子脸色惨白。石神继续说："问题在于警方怎么想。你这个谎恐怕行不通。"\n\n他指着尸体的手腕。"这是抓住他的手不让他挣扎留下的痕迹。你从后面勒住他脖子，绝对不可能再去抓住他的手。这需要四只手。"',
    imageUrl: '/images/11_暖桌电线.png',
    hotspots: [
      { id: 'h6', x: 50, y: 60, radius: 50, label: '检查尸体', discoveryEvidenceId: 'body_evidence' }
    ],
    choices: [
      { id: 'c22', text: '提出解决方案', targetSceneId: 'solution_proposal' }
    ]
  },
  'solution_proposal': {
    id: 'solution_proposal',
    title: '逻辑的解答',
    text: '"我只是想帮你们。要自首，我不反对。如果另有打算，光靠你们恐怕有些困难。"\n\n美里抬起头："不用自首也能解决？"\n\n石神微微歪着脖子。"或者隐瞒这起命案，或者切断命案与你们的关系，两者择一。不过不管怎样，首先都得先把尸体处理掉。"\n\n"叔叔您觉得做得到吗？"\n"很困难，不过并非绝无可能。"\n\n石神的语气毫无抑扬顿挫，但靖子感到，他有某种理论上的根据。\n\n"相信我，把一切交给我的逻辑思考。"',
    imageUrl: '/images/52_逻辑的解答.png',
    choices: [
      { id: 'c23', text: '接受石神的帮助', targetSceneId: 'accept_help' },
      { id: 'c24', text: '还是自首', targetSceneId: 'surrender' }
    ]
  },
  'accept_help': {
    id: 'accept_help',
    title: '接受',
    text: '石神扛起尸体，带回了自己的房间。\n\n"美里，马上回去彻底打扫你们家，要用吸尘器吸，越仔细越好。花冈小姐请留下。"\n\n他把尸体放在自己凌乱的房间里，周围是堆积如山的数学书籍。\n\n"你们需要不在场证明，先想想这个。"\n\n"不在场证明？可是……我们根本没有。"\n\n"要制造。"石神披上从尸体上剥下的外套。"相信我，把一切交给我的逻辑思考。"\n\n这是石神哲哉第一次，也是最后一次，为爱情献身。',
    imageUrl: '/images/19_不在场证明.png',
    ambientEffect: 'fog',
    choices: [
      { id: 'c25', text: '石神独自行动', targetSceneId: 'ishigami_action' }
    ]
  },
  'surrender': {
    id: 'surrender',
    title: '自首',
    text: '靖子拿起电话，准备拨打110。\n\n但石神按住了她的手。"等等。"\n\n"为什么？"\n\n"你想想美里。如果她成为杀人犯的女儿，她的人生就毁了。"\n\n靖子的手颤抖着。她看向里屋——美里正蜷缩在角落里哭泣。\n\n"让我帮你们。"石神说，"这是我唯一能为你们做的。"',
    imageUrl: '/images/53_自首的犹豫.png',
    choices: [
      { id: 'c26', text: '接受帮助', targetSceneId: 'accept_help' }
    ]
  },
  'ishigami_action': {
    id: 'ishigami_action',
    title: '暗夜行动',
    text: '午夜。石神独自走出公寓。\n\n他走向堤防边，那里住着他每天经过的游民们。他的目标很明确——"技师"。\n\n一个无家可归的人，没有亲人，没有朋友，没有人会在意他的消失。\n\n石神走向那个蓝色塑料布棚屋，手里拿着从富㭴尸体上剥下的衣物。\n\n他的表情毫无波动，仿佛只是在解一道数学题。每一步都经过精确计算，每一个动作都严丝合缝。\n\n这是他计划的核心——用一个无名者的死亡，替换富㭴慎二的死亡。',
    imageUrl: '/images/18_石神带走流浪汉.png',
    ambientEffect: 'fog',
    choices: [
      { id: 'c25b', text: '第一幕终', targetSceneId: 'part1_end' }
    ]
  },
  'part1_end': {
    id: 'part1_end',
    title: '第一幕 终',
    text: '夜深了。石神独自坐在房间里，面对着富㭴慎二的尸体。\n\n他开始思考。\n\n这不是一道数学题，却比任何数学题都复杂。他需要制造一个完美的不在场证明，需要让警方永远无法将靖子母女与这起命案联系起来。\n\n他闭上眼睛，让大脑进入那个只有数学的世界。方程式在脑中流转、变形、重组……\n\n终于，一个答案浮现。\n\n但这个答案，需要付出他的一切。',
    imageUrl: '/images/20_夜色中的隅田川.png',
    autoProgress: true,
    choices: [
      { id: 'c27', text: '第二幕：调查', targetSceneId: 'investigation_start' }
    ]
  },
  // 第二幕：警方调查
  'investigation_start': {
    id: 'investigation_start',
    title: '第二幕 - 尸体发现',
    text: '三月十一日，清晨。\n\n旧江户川的堤防旁，一个慢跑的老人发现了尸体。\n\n尸体被蓝色塑料布覆盖，全裸，脸部被砸烂，手指被烧毁——凶手显然想隐瞒死者身份。\n\n警视厅搜查一科的草薙刑警接到通知，赶往现场。和他一起的，是新人刑警岸谷。\n\n"脸和指纹都被毁，表示凶手想隐瞒被害人的身份。"草薙说，"这正表明，一旦查明被害人的身份，就能轻易找出凶手。"',
    imageUrl: '/images/21_河边的毁容尸体.png',
    hotspots: [
      { id: 'h7', x: 50, y: 65, radius: 50, label: '检查现场', discoveryEvidenceId: 'crime_scene_2' }
    ],
    choices: [
      { id: 'c28', text: '确认死者身份', targetSceneId: 'identify_body' }
    ]
  },
  'identify_body': {
    id: 'identify_body',
    title: '确认身份',
    text: '尸体无法通过面部识别，但警方在附近找到了一个关键物品。\n\n一本烧焦的驾驶证。上面的照片虽然模糊，但名字依稀可辨——富㭴慎二。\n\n"查这个人的背景。"草薙命令道。\n\n几小时后，岸谷带回了报告：富㭴慎二，四十五岁，无业。曾因挪用公款被开除，离婚后居无定所。前妻——花冈靖子，住在江东区森下的公寓。\n\n"走，去见见这位前妻。"草薙站起身来。',
    imageUrl: '/images/22_富樫的驾驶证.png',
    choices: [
      { id: 'c28b', text: '审问靖子', targetSceneId: 'investigation_progress' }
    ]
  },
  'investigation_progress': {
    id: 'investigation_progress',
    title: '审问靖子',
    text: '"三月十日您在家吗？"草薙问靖子。\n\n靖子穿着素净的衣服，表情平静。但草薙注意到，她的手指在微微颤抖。\n\n"我一早就去工作，晚上下班回来后和我女儿一起出门去看电影。"\n\n"看完电影，你们立刻就回家了？"\n"我们在拉面店吃了晚饭，然后去唱歌。"\n\n"哪部电影？"\n"……《影武者》，七点那场。"\n\n草薙记下了这些。他注意到靖子说话时，像是在背诵——太流畅了，太完美了。\n\n不像是在回忆，更像是排练过。',
    imageUrl: '/images/23_草薙审问靖子.png',
    choices: [
      { id: 'c29', text: '查证不在场证明', targetSceneId: 'alibi_check' },
      { id: 'c30', text: '调查石神', targetSceneId: 'ishigami_interview' }
    ]
  },
  'kusanagi_thinking': {
    id: 'kusanagi_thinking',
    title: '草薙的沉思',
    text: '回到搜查本部，草薙盯着白板上的关系图发呆。\n\n花冈靖子的不在场证明——KTV完美，电影未查证。票根保存得太刻意。隔壁邻居石神，帝都大学毕业，却当了高中老师。\n\n"有什么地方不对。"草薙喃喃自语。\n\n他把红绳从富㭴的照片拉向靖子，又从靖子拉向石神。三条线形成了一个三角形。\n\n"嫌疑人之间的联系……"他拿起笔，在石神的名字旁边画了个问号。',
    imageUrl: '/images/24_草薙的沉思.png',
    choices: [
      { id: 'c31c', text: '去见汤川', targetSceneId: 'yukawa_intro' }
    ]
  },
  'alibi_check': {
    id: 'alibi_check',
    title: '不在场证明',
    text: 'KTV的不在场证明完美无缺——店员记得花冈母女，从九点四十分开始，唱了一个半小时。\n\n但电影院呢？\n\n"母女俩看了电影，就时间来考虑，是七点整那一场。"岸谷报告，"散场是九点十分，之后她们去了拉面店。"\n\n"查证过了？"\n"没有。电影院和拉面店，是最难查证的场所。"\n\n草薙皱眉。"组长不会接受这种回答。"\n\n更可疑的是，靖子从电影简介里拿出了票根——谁会特意保存那种东西？',
    imageUrl: '/images/54_电影票根.png',
    choices: [
      { id: 'c31', text: '草薙整理线索', targetSceneId: 'kusanagi_thinking' },
      { id: 'c31b', text: '去见汤川', targetSceneId: 'yukawa_intro' }
    ]
  },
  'ishigami_interview': {
    id: 'ishigami_interview',
    title: '石神哲哉',
    text: '草薙敲响了二○三号的门。\n\n开门的是个敦实的中年男子，圆脸，眼睛细如横线。他面无表情地看着两个刑警。\n\n"请问，您是石神先生吧？"\n"对，敝姓石神。"\n\n"三月十日那晚您几点回来的？"\n"七点左右。"\n\n"那时隔壁有什么动静吗？"\n"我记不清了，应该没什么特别的动静。"\n\n石神的反应太冷静了。一般人面对警察都会紧张，他却毫无表情。\n\n草薙注意到玄关旁的邮件上写着"帝都大学"——这个数学老师，是帝都毕业的。',
    imageUrl: '/images/55_石神的房间内部.png',
    hotspots: [
      { id: 'h8', x: 45, y: 55, radius: 45, label: '观察石神的房间', discoveryEvidenceId: 'ishigami_room' }
    ],
    choices: [
      { id: 'c32', text: '离开', targetSceneId: 'yukawa_intro' }
    ]
  },
  'yukawa_intro': {
    id: 'yukawa_intro',
    title: '伽利略',
    text: '帝都大学物理系第十三研究室。\n\n汤川学正在和草薙下国际象棋。这个被学生称为"伽利略"的物理学家，是草薙的老朋友，也是帝都大学最聪明的头脑之一。\n\n"嫌疑人的隔壁住着你学长。"草薙说。\n"学长？"\n"是个高中数学老师，姓石神。也是帝都毕业的。"\n\n汤川的眼睛倏然睁大。"是达摩石神？"\n\n他翻开档案夹，指向一张圆脸的照片——石神哲哉。\n\n"他是五十年甚至百年难得一见的人才。"汤川说，"他居然当了高中老师……"',
    imageUrl: '/images/25_汤川学的实验室.png',
    choices: [
      { id: 'c33', text: '汤川去见石神', targetSceneId: 'yukawa_ishigami_meet' }
    ]
  },
  'yukawa_ishigami_meet': {
    id: 'yukawa_ishigami_meet',
    title: '重逢',
    text: '石神打开门，看到门外站着的人，愣住了。\n\n"是石神吗？"\n\n那张脸上浮现出笑容，熟悉的笑容。\n\n"你是汤川？"\n\n二十多年前的记忆，缓缓复苏。他们曾是帝都大学最优秀的两个学生——一个选择了物理，一个选择了数学。\n\n"久别重逢，怎么好空手而来？"汤川拿出清酒。\n\n"我叫点儿寿司好了。"\n\n两个天才相对而坐，开始喝酒。但汤川注意到，石神的眼神中有什么东西在闪躲。',
    imageUrl: '/images/27_二十年的重逢.png',
    choices: [
      { id: 'c34', text: '继续交谈', targetSceneId: 'genius_conversation' }
    ]
  },
  'genius_conversation': {
    id: 'genius_conversation',
    title: '天才的对话',
    text: '"你还在研究数学？"\n"只是业余爱好。"石神说，"高中老师的工作很忙。"\n\n汤川环视着满墙的数学资料。"这可不是业余爱好。"\n\n两人聊起往事。四色问题、厄多斯、纸笔有限……\n\n"你看起来变了。"汤川说，"以前你对数学以外的东西毫无兴趣。"\n"人总是会变的。"\n\n汤川注意到石神提到隔壁的花冈靖子时，语气微妙地变化了。\n\n"你认识你隔壁的邻居？"\n"只是偶尔打招呼。"\n\n但汤川看得出来，那不只是"偶尔打招呼"的关系。',
    imageUrl: '/images/28_黑板上的公式.png',
    choices: [
      { id: 'c35', text: '汤川的怀疑', targetSceneId: 'yukawa_suspicion' }
    ]
  },
  'yukawa_suspicion': {
    id: 'yukawa_suspicion',
    title: '怀疑的种子',
    text: '离开石神的公寓后，汤川陷入沉思。\n\n石神是数学天才，却在高中教书。这不合理。\n\n更不合理的是，石神提到花冈靖子时的眼神——那种闪烁，那种不自然。\n\n汤川想起草薙说过的话：花冈靖子的不在场证明太完美了，完美得不自然。\n\n如果有人帮她制造不在场证明呢？如果那个人是石神呢？\n\n"我要见见那个女人。"汤川想。',
    imageUrl: '/images/56_汤川的沉思.png',
    choices: [
      { id: 'c36', text: '汤川走访游民聚落', targetSceneId: 'yukawa_homeless_visit' }
    ]
  },
  'yukawa_homeless_visit': {
    id: 'yukawa_homeless_visit',
    title: '走访游民',
    text: '汤川来到新大桥下的堤防边。\n\n蓝色塑料布棚屋一字排开。他询问游民们，最近有没有人失踪。\n\n"技师？"一个游民回答，"前两天还在，后来就不见了。"\n\n"他是什么样的人？"\n\n"无亲无故，没人知道他从哪来。"\n\n汤川的心沉了下去。石神每天经过这里，一定很熟悉这些游民。\n\n如果一个无亲无故的人消失了，没有人会在意。',
    imageUrl: '/images/29_汤川走访游民聚落.png',
    choices: [
      { id: 'c36b', text: '确认技师失踪', targetSceneId: 'homeless_missing' }
    ]
  },
  'homeless_missing': {
    id: 'homeless_missing',
    title: '消失的流浪汉',
    text: '汤川继续调查。他发现"技师"的棚屋被翻动过，一些衣物不见了。\n\n更关键的是，技师的消失时间——三月十一日凌晨。\n\n"三月十一日……"汤川喃喃自语。\n\n警方认为富㭴慎二是在三月十日被杀的。但如果真正的富㭴尸体已经被处理掉了呢？\n\n如果三月十一日发现的尸体，根本不是富㭴，而是这个"技师"呢？\n\n汤川感到一阵寒意。这个推理太疯狂了，但逻辑上完全成立。',
    imageUrl: '/images/30_消失的流浪汉.png',
    choices: [
      { id: 'c36c', text: '第三幕：真相', targetSceneId: 'part3_start' }
    ]
  },
  // 第三幕：真相
  'part3_start': {
    id: 'part3_start',
    title: '第三幕 - 真相',
    text: '汤川见到了靖子。\n\n她是个美丽的女人，但眼神中有一种疲惫——那种被生活折磨过的疲惫。\n\n"石神先生是个好人。"靖子说，"他每天都会来买便当。"\n\n"只是买便当？"\n"……"\n\n汤川注意到她的犹豫。他继续追问。\n\n"三月十日那天，石神先生有没有来找过你们？"\n\n靖子的脸色变了。\n\n"没有。"\n\n她在撒谎。汤川确定。',
    imageUrl: '/images/57_汤川与靖子.png',
    ambientEffect: 'fog',
    choices: [
      { id: 'c37', text: '汤川推理', targetSceneId: 'yukawa_deduction' }
    ]
  },
  'yukawa_deduction': {
    id: 'yukawa_deduction',
    title: '推理',
    text: '汤川开始整理所有线索。\n\n石神是数学天才，擅长逻辑思考。\n花冈靖子的不在场证明完美得不自然。\n石神住在靖子隔壁，每天去她工作的店买便当。\n尸体被毁容、指纹被烧毁——需要时间和专业知识。\n\n"如果石神帮助了她们……"\n\n汤川的推理让他自己都感到恐惧。\n\n如果石神制造了完美的不在场证明，那他一定也处理了尸体。但处理尸体需要时间——石神七点就回家了，这怎么做到？\n\n除非……\n\n汤川想到了一个可怕的可能。',
    imageUrl: '/images/31_汤川的推理.png',
    choices: [
      { id: 'c38', text: '隅田川的黄昏', targetSceneId: 'river_twilight' }
    ]
  },
  'river_twilight': {
    id: 'river_twilight',
    title: '隅田川的黄昏',
    text: '汤川独自站在隅田川边，望着浑浊的河水。\n\n夕阳将天空染成橙红色，新大桥的剪影倒映在水面上。\n\n他想起石神说过的话："纸笔有限，或许尝试本身才更有意义。"\n\n石神选择了他的"尝试"——用自己的逻辑，为爱的人制造一个完美的解答。\n\n但这个解答，需要付出什么样的代价？\n\n汤川闭上眼睛。他必须做出选择——是揭穿真相，还是保持沉默？',
    imageUrl: '/images/32_隅田川的黄昏.png',
    choices: [
      { id: 'c38b', text: '汤川摊牌', targetSceneId: 'yukawa_confront' }
    ]
  },
  'yukawa_confront': {
    id: 'yukawa_confront',
    title: '摊牌',
    text: '汤川找到了石神。\n\n"我猜到了。"汤川说，"你制造了完美的不在场证明。但不是为三月十日——是为第二天。"\n\n石神沉默。\n\n"三月十日，花冈母女杀死了富㭴慎二。你帮她们处理了尸体。但你做了更多——你在三月十一日杀死了另一个人，然后毁容，让警方以为那是富㭴。"\n\n石神的眼睛终于有了波动。\n\n"那个游民……\'技师\'……他消失了，对吧？"\n\n"你用他的尸体，代替了富㭴的尸体。花冈母女的不在场证明，是针对三月十一日的——那是你杀死\'技师\'的日子。"',
    imageUrl: '/images/33_汤川摊牌.png',
    choices: [
      { id: 'c38c', text: '石神的觉悟', targetSceneId: 'ishigami_realization' }
    ]
  },
  'ishigami_realization': {
    id: 'ishigami_realization',
    title: '石神的觉悟',
    text: '石神缓缓点头。"你果然猜到了。"\n\n"为什么？"汤川的声音有些颤抖，"为什么要做到这种地步？"\n\n石神望向窗外。隔壁的窗户亮着灯——那是靖子的房间。\n\n"你知道吗，在我遇到她们之前，我几乎要放弃生命了。"\n\n"那天我正准备自杀，却听到了隔壁的笑声——母女俩在聊天。那笑声救了我。从那以后，我就想，如果能守护她们的幸福，我愿意做任何事。"\n\n汤川说不出话来。',
    imageUrl: '/images/34_石神的觉悟.png',
    choices: [
      { id: 'c38d', text: '最后一封信', targetSceneId: 'final_letter' }
    ]
  },
  'final_letter': {
    id: 'final_letter',
    title: '最后一封信',
    text: '石神从抽屉里拿出一封信。\n\n"这是给靖子的。等我走后，请交给她。"\n\n汤川接过信，没有打开。\n\n"你打算怎么办？"\n\n"自首。"石神平静地说，"但我不会供出她们。一个人做的，一个人承担。"\n\n"这样她们就安全了？"\n\n"我的逻辑不会出错。"石神的脸上浮现出淡淡的笑容，"这是我最后能为她们做的。"',
    imageUrl: '/images/35_最后一封信.png',
    choices: [
      { id: 'c38e', text: '石神走进警局', targetSceneId: 'ishigami_surrender' }
    ]
  },
  'ishigami_surrender': {
    id: 'ishigami_surrender',
    title: '走进警局',
    text: '石神哲哉走进警局的那一刻，草薙正准备下班。\n\n"石神先生？"\n\n"我来自首。"石神平静地说，"富㭴慎二是我杀的。"\n\n草薙愣住了。所有的证据，所有的推理，在这一刻被推翻。\n\n石神开始供述——时间、地点、手法。每一个细节都严丝合缝，仿佛他早就准备好了这份供词。\n\n但草薙注意到，石神的供述里，从头到尾没有提到花冈靖子。',
    imageUrl: '/images/36_石神走进警局.png',
    choices: [
      { id: 'c38f', text: '审讯', targetSceneId: 'ishigami_interrogation' }
    ]
  },
  'ishigami_interrogation': {
    id: 'ishigami_interrogation',
    title: '审讯',
    text: '审讯室里，石神面对着草薙和岸谷。\n\n"你为什么要杀富㭴慎二？"\n\n"他一直在纠缠隔壁的邻居。"石神说，"我受不了了。"\n\n"你和她是什么关系？"\n\n"只是邻居。"\n\n草薙盯着石神的眼睛，试图找出破绽。但石神的表情毫无波动，每一个回答都冷静、合理。\n\n"尸体呢？你一个人处理的？"\n\n"对。我有柔道五段的身手，处理尸体不难。"\n\n草薙总觉得哪里不对，但他说不出来。',
    imageUrl: '/images/37_石神的审讯.png',
    choices: [
      { id: 'c38g', text: '真相的重量', targetSceneId: 'truth_weight' }
    ]
  },
  'truth_weight': {
    id: 'truth_weight',
    title: '真相的重量',
    text: '汤川站在审讯室外，隔着单向玻璃看着石神。\n\n他的朋友，那个曾经和他讨论四色问题的天才，此刻正平静地供述着"自己的罪行"。\n\n但汤川知道真相——石神没有杀人。他只是承担了所有的罪，为了让另一个人自由。\n\n"这就是你的逻辑解答吗……"汤川喃喃自语。\n\n他握着石神给他的信，感到一阵沉重。\n\n他该把这封信交给靖子吗？他该让真相就这样被埋葬吗？',
    imageUrl: '/images/38_真相的重量.png',
    choices: [
      { id: 'c38h', text: '靖子的决定', targetSceneId: 'yasuko_decision' }
    ]
  },
  'yasuko_decision': {
    id: 'yasuko_decision',
    title: '靖子的决定',
    text: '汤川找到了靖子。\n\n"这是石神留给你的。"\n\n靖子接过信，打开。信上只有几行字：\n\n"感谢您让我的人生有了意义。请不要为我悲伤，这是我自己的选择。请和美里一起，幸福地生活下去。"\n\n靖子的眼泪夺眶而出。\n\n"他……他为什么要……"\n\n"因为他想守护你们。"汤川说，"但我觉得，你应该知道真相。"',
    imageUrl: '/images/39_靖子的决定.png',
    choices: [
      { id: 'c38i', text: '献身', targetSceneId: 'devotion' }
    ]
  },
  'devotion': {
    id: 'devotion',
    title: '献身',
    text: '靖子做出了选择。\n\n她不能让石神一个人承担一切。\n\n她冲向警局，跪在草薙面前。\n\n"是我杀的——富㭴慎二是我和女儿一起杀的！石神先生是无辜的！"\n\n审讯室里，石神听到了隔壁的动静。他的脸上，第一次出现了惊慌。\n\n所有的逻辑，所有的计算，在这一刻崩塌了。\n\n靖子哭泣着。她无法接受一个男人用自己的命来换她的自由。\n\n石神发出了野兽般的嘶吼——那是绝望，是痛苦，是他所有努力付诸东流的哀号。',
    imageUrl: '/images/40_献身.png',
    choices: [
      { id: 'c40', text: '结局', targetSceneId: 'ending' }
    ]
  },
  'ending': {
    id: 'ending',
    title: '结局',
    text: '石神选择了自首。\n\n他向警方供述了一切——当然，只供述了他自己的罪行。靖子母女被完全撇清了关系。\n\n"我一个人干的。"石神平静地说，"她们什么都不知道。"\n\n靖子得知真相后，崩溃大哭。她终于明白，那个每天来买便当的沉默男人，用自己的人生换来了她们的自由。\n\n"对不起……"她对着被带走的石神鞠躬，"谢谢您……"\n\n石神没有回头。他的脸上，第一次浮现出释然的笑容。\n\n这就是嫌疑人X的献身。',
    imageUrl: '/images/60_拘留所的石神.png',
    autoProgress: true,
    choices: [
      { id: 'end', text: '重新开始', targetSceneId: 'start' }
    ]
  }
};

export const INITIAL_EVIDENCE: Evidence[] = [
  {
    id: 'ishigami_obsession',
    name: '石神的日常',
    description: '石神每天都会绕远路去弁天亭买便当，只为了看花冈靖子一眼。这种坚持已经持续了很久。',
    dateFound: '2026-04-22',
    type: 'testimony',
    imageUrl: '/images/05_石神买便当.png'
  },
  {
    id: 'yasuko_daily_life',
    name: '靖子的生活',
    description: '花冈靖子在弁天亭工作，和女儿美里相依为命。她的前夫富㭴慎二一直在纠缠她。',
    dateFound: '2026-04-22',
    type: 'testimony',
    imageUrl: '/images/04_花冈靖子_便当店女主人.png'
  },
  {
    id: 'homeless_info',
    name: '游民情报',
    description: '堤防边住着一群游民，石神给他们取了绰号："罐男"、"技师"等。他们是被社会遗忘的人。',
    dateFound: '2026-04-22',
    type: 'testimony',
    imageUrl: '/images/02_新大桥下的游民聚落.png'
  },
  {
    id: 'crime_scene_clue',
    name: '案发现场线索',
    description: '石神注意到：靖子家有烟味但没有客人的鞋，暖桌位置被移动，空气中有不自然的紧张感。',
    dateFound: '2026-04-22',
    type: 'testimony',
    imageUrl: '/images/58_推理细节_烟灰与电线.png'
  },
  {
    id: 'body_evidence',
    name: '尸体痕迹',
    description: '富㭴慎二的尸体显示：被勒死，手腕有被抓住的痕迹——这需要四只手才能做到。',
    dateFound: '2026-04-22',
    type: 'object',
    imageUrl: '/images/10_铜制花瓶.png'
  },
  {
    id: 'crime_scene_2',
    name: '弃尸现场',
    description: '尸体被蓝色塑料布覆盖，全裸，脸部被砸烂，手指被烧毁。旁边有一辆失窃的自行车。',
    dateFound: '2026-04-22',
    type: 'photo',
    imageUrl: '/images/12_案发现场_模糊.png'
  },
  {
    id: 'ishigami_room',
    name: '石神的房间',
    description: '满墙的数学资料，堆积如山的书籍。这是一个数学天才的房间，却住着一个高中老师。',
    dateFound: '2026-04-22',
    type: 'photo',
    imageUrl: '/images/55_石神的房间内部.png'
  }
];

export const INITIAL_SUSPECTS: Suspect[] = [
  {
    id: 'ishigami',
    name: '石神哲哉',
    role: '高中数学教师',
    bio: '帝都大学数学系毕业，被称为"达摩"的天才。现在却在普通高中教书。每天去弁天亭买便当，暗恋花冈靖子。性格沉默寡言，不通人情，但内心深处藏着炽热的感情。',
    imageUrl: '/images/05_石神买便当.png',
    status: 'suspicious',
    alibi: '三月十日当晚七点左右回到公寓。声称在家未出门，无目击证人。隔壁动静"记不清了"。',
    relatedCases: [
      { id: 'CASE-001', description: '富㭴慎二被杀案 - 隔壁邻居' }
    ]
  },
  {
    id: 'yasuko',
    name: '花冈靖子',
    role: '便当店店员',
    bio: '在弁天亭工作，和女儿美里相依为命。前夫富㭴慎二一直在纠缠她。美丽但疲惫，眼神中有被生活折磨过的痕迹。',
    imageUrl: '/images/04_花冈靖子_便当店女主人.png',
    status: 'suspicious',
    alibi: '三月十日晚七点看电影《影武者》，散场后去拉面店，九点四十分起在KTV唱歌一个半小时。KTV店员可作证。电影票根已保存。',
    relatedCases: [
      { id: 'CASE-001', description: '富㭴慎二被杀案 - 死者前妻' }
    ]
  },
  {
    id: 'misato',
    name: '花冈美里',
    role: '初中生',
    bio: '靖子的女儿，羽毛球队成员。讨厌继父富㭴慎二，和母亲相依为命。',
    imageUrl: '/images/15_KTV场景.png',
    status: 'unknown',
    alibi: '与母亲靖子同行。看电影、拉面店、KTV，行踪一致。',
    relatedCases: []
  },
  {
    id: 'togashi',
    name: '富㭴慎二',
    role: '死者',
    bio: '靖子的前夫，无业游民。曾因挪用公款被开除，离婚后一直纠缠靖子。三月十日被杀。',
    imageUrl: '/images/07_富樫慎二_前夫.png',
    status: 'guilty',
    alibi: '死者。三月十日前往靖子公寓纠缠，当晚死亡。',
    relatedCases: [
      { id: 'CASE-001', description: '富㭴慎二被杀案 - 死者' }
    ]
  },
  {
    id: 'yukawa',
    name: '汤川学',
    role: '帝都大学物理副教授',
    bio: '石神的大学同学，被称为"伽利略"的天才物理学家。曾多次协助警方破案。敏锐、理性，但这次面对的是朋友的案件。',
    imageUrl: '/images/26_汤川学_物理学家.png',
    status: 'innocent',
    alibi: '案发时在帝都大学实验室。以朋友身份协助调查，非案件相关人员。',
    relatedCases: []
  },
  {
    id: 'kusanagi',
    name: '草薙',
    role: '警视厅搜查一科刑警',
    bio: '帝都大学社会学毕业，和汤川是老朋友。负责调查富㭴慎二被杀案。',
    imageUrl: '/images/24_草薙的沉思.png',
    status: 'innocent',
    alibi: '搜查一科刑警，本案主办侦探。案发时不在现场附近。',
    relatedCases: []
  }
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: 't1', date: '三月十日 07:35', title: '石神的日常', description: '石神像往常一样出门，确认靖子的自行车不在——她已去上班。', type: 'story', sceneId: 'start' },
  { id: 't2', date: '三月十日 08:00', title: '弁天亭', description: '石神去弁天亭买便当，看到靖子的笑脸。', type: 'story', sceneId: 'bentou_shop' },
  { id: 't3', date: '三月十日 下午', title: '学校的一天', description: '石神在高中教数学、训练柔道队，心不在焉。', type: 'story', sceneId: 'school_arrival' },
  { id: 't4', date: '三月十日 傍晚', title: '命案发生', description: '靖子母女杀死前夫富㭴慎二。石神听到隔壁动静。', type: 'evidence', sceneId: 'after_school' },
  { id: 't5', date: '三月十日 夜', title: '献身的开始', description: '石神发现真相，提出帮靖子处理尸体和制造不在场证明。', type: 'story', sceneId: 'offer_help' },
  { id: 't5b', date: '三月十日 深夜', title: '暗夜行动', description: '石神执行计划的核心——带走游民"技师"，制造替身尸体。', type: 'evidence', sceneId: 'ishigami_action' },
  { id: 't6', date: '三月十一日 清晨', title: '尸体被发现', description: '旧江户川堤防旁发现被毁容的尸体。草薙刑警介入调查。', type: 'investigation', sceneId: 'investigation_start' },
  { id: 't6b', date: '三月十一日', title: '确认身份', description: '通过烧焦的驾驶证，警方确认死者为富㭴慎二。', type: 'investigation', sceneId: 'identify_body' },
  { id: 't7', date: '三月十一日', title: '审问靖子', description: '草薙审问靖子，她的不在场证明太过流畅，像排练过。', type: 'investigation', sceneId: 'investigation_progress' },
  { id: 't7b', date: '三月', title: '草薙的沉思', description: '草薙梳理关系图，在石神名字旁画上问号。', type: 'investigation', sceneId: 'kusanagi_thinking' },
  { id: 't8', date: '三月', title: '石神接受问询', description: '草薙走访石神，发现他是帝都大学毕业。', type: 'investigation', sceneId: 'ishigami_interview' },
  { id: 't9', date: '三月', title: '伽利略登场', description: '汤川学得知石神涉案，以朋友身份探访。', type: 'story', sceneId: 'yukawa_intro' },
  { id: 't10', date: '三月', title: '天才重逢', description: '汤川和石神二十年后重聚，两人各怀心事。', type: 'story', sceneId: 'yukawa_ishigami_meet' },
  { id: 't11', date: '三月', title: '汤川的怀疑', description: '汤川察觉石神对靖子的感情，开始独立推理。', type: 'investigation', sceneId: 'yukawa_suspicion' },
  { id: 't11b', date: '三月', title: '走访游民聚落', description: '汤川走访新大桥下的游民，发现"技师"已失踪。', type: 'investigation', sceneId: 'yukawa_homeless_visit' },
  { id: 't11c', date: '三月', title: '消失的流浪汉', description: '汤川确认"技师"失踪时间与尸体发现时间吻合。', type: 'evidence', sceneId: 'homeless_missing' },
  { id: 't12', date: '三月', title: '汤川的推理', description: '汤川独自整理线索，拼凑出骇人的真相。', type: 'investigation', sceneId: 'yukawa_deduction' },
  { id: 't12b', date: '三月', title: '隅田川的黄昏', description: '汤川在河边思考，面临揭穿真相还是沉默的抉择。', type: 'story', sceneId: 'river_twilight' },
  { id: 't13', date: '三月', title: '汤川摊牌', description: '汤川向石神摊牌——他猜到了"技师"替身的诡计。', type: 'evidence', sceneId: 'yukawa_confront' },
  { id: 't13b', date: '三月', title: '石神的觉悟', description: '石神道出动机：靖子的笑声曾把他从自杀边缘拉回来。', type: 'story', sceneId: 'ishigami_realization' },
  { id: 't13c', date: '三月', title: '最后一封信', description: '石神托付汤川转交最后一封信给靖子。', type: 'story', sceneId: 'final_letter' },
  { id: 't13d', date: '三月', title: '走进警局', description: '石神自首，供述"自己"的罪行，绝口不提靖子。', type: 'investigation', sceneId: 'ishigami_surrender' },
  { id: 't13e', date: '三月', title: '审讯', description: '石神冷静地面对审讯，每一个回答都无懈可击。', type: 'investigation', sceneId: 'ishigami_interrogation' },
  { id: 't13f', date: '三月', title: '真相的重量', description: '汤川隔着玻璃看着石神，承受着真相的沉重。', type: 'story', sceneId: 'truth_weight' },
  { id: 't13g', date: '三月', title: '靖子的决定', description: '靖子读到石神的信，做出了自己的选择。', type: 'story', sceneId: 'yasuko_decision' },
  { id: 't14', date: '尾声', title: '献身', description: '靖子冲到警局自首，石神的一切努力付诸东流。', type: 'story', sceneId: 'devotion' },
  { id: 't15', date: '尾声', title: '结局', description: '两个灵魂的碰撞，这就是嫌疑人X的献身。', type: 'story', sceneId: 'ending' },
];

export const CHARACTER_RELATIONS: CharacterRelation[] = [
  { from: 'ishigami', to: 'yasuko', label: '暗恋 · 愿为她献出一切', type: 'love' },
  { from: 'yasuko', to: 'togashi', label: '前妻 · 被纠缠', type: 'enemy' },
  { from: 'yasuko', to: 'misato', label: '母女', type: 'family' },
  { from: 'ishigami', to: 'yukawa', label: '大学同学 · 天才惺惺相惜', type: 'friend' },
  { from: 'yukawa', to: 'kusanagi', label: '好友 · 协助破案', type: 'colleague' },
  { from: 'kusanagi', to: 'yasuko', label: '调查对象', type: 'case' },
  { from: 'ishigami', to: 'togashi', label: '替她处理尸体', type: 'case' },
  { from: 'yukawa', to: 'ishigami', label: '识破真相', type: 'case' },
];
