/* =========================================================
   出荷業務ツール集 ― 設定（ここだけ直せばOK）
   ---------------------------------------------------------
   ツールを直したら：
     1. そのツールの ver を今日の日付にする
     2. SITE_VER も今日の日付にする
     3. GitHub に push する
   → タブレットは次にWi-Fiにつながったとき
     「新しい版があります」と表示されます
   ========================================================= */

var SITE_VER = '2026-11-18l';

/* GitHub Pages の場所（各ツールのリポジトリはここの下にある） */
var BASE = 'https://overbridge038-lnk.github.io/';

/* 工場マップの画像（使わないときは空欄）
   ※ 寸法入りの図面はPublicリポジトリに載せないため、
     ふだんは下の MAP_WALLS（寸法なしの外形線）で描きます */
var MAP_IMAGE = '';

/* マップの表示範囲（左, 上, 幅, 高さ） */
var MAP_VIEW = '0 0 1000 600';

/* 建物の外形線（物と情報の流れ図では使わない） */
var MAP_WALLS = [];

/* ---------------------------------------------------------
   エリア（物と情報の流れ図のボタン）
   x, y, w, h : 位置と大きさ（横1000 × 縦600 の方眼で指定）
   tools      : このエリアで使うツールの id（下の TOOLS と合わせる）
   --------------------------------------------------------- */
var AREAS = [
  { id: 'office', icon: '🏢', name: '事務所',
    names: { id: 'Kantor', tl: 'Opisina', en: 'Office' },
    x: 40, y: 50, w: 280, h: 130, tools: ['uriage', 'mitsumori', 'naiji', 'shukka-houkoku', 'shikyu-naiji'] },

  { id: 'ukeire', icon: '📥', name: '受入・素材',
    names: { id: 'Penerimaan', tl: 'Receiving', en: 'Receiving' },
    x: 40, y: 400, w: 170, h: 130, tools: ['kakeoki'] },

  { id: 'kake', icon: '🪝', name: '掛け',
    names: { id: 'Gantung', tl: 'Hanging', en: 'Hanging' },
    x: 250, y: 400, w: 170, h: 130, tools: ['seisan', 'point'] },

  { id: 'dasshi', icon: '🧼', name: '脱脂工程',
    names: { id: 'Degreasing', tl: 'Degreasing', en: 'Degreasing' },
    x: 460, y: 220, w: 170, h: 130, tools: ['dasshi'] },

  { id: 'tosou', icon: '🎨', name: '塗装',
    names: { id: 'Pengecatan', tl: 'Painting', en: 'Painting' },
    x: 460, y: 400, w: 170, h: 130, tools: [] },

  { id: 'kensa', icon: '🔬', name: '検査',
    names: { id: 'Inspeksi', tl: 'Inspection', en: 'Inspection' },
    x: 670, y: 400, w: 150, h: 130, tools: ['seisan', 'point'] },

  { id: 'store', icon: '🗄️', name: 'ストア',
    names: { id: 'Gudang', tl: 'Store', en: 'Store' },
    x: 670, y: 210, w: 150, h: 130, tools: ['zaiko-count'] },

  { id: 'shukka', icon: '🚚', name: '出荷場',
    names: { id: 'Pengiriman', tl: 'Shipping', en: 'Shipping' },
    x: 850, y: 210, w: 120, h: 320,
    tools: ['gohin', 'gohin-fts', 'sekisai', 'zaiko-count', 'shukka-more-auto', 'shukka-more-view', 'hayami', 'sango', 'furidashi', 'tsumitsuke', 'shogo-matome', 'rinkan-yama', 'kanri-sheet'] }
];

/* ---------------------------------------------------------
   つながり（物と情報の流れ）
   type: 'mono'（物の流れ・実線） / 'info'（情報の流れ・点線）
   bend: 曲がり具合（0でまっすぐ。マイナスで反対側に曲がる）
   --------------------------------------------------------- */
var LINKS = [
  { from: 'ukeire', to: 'kake',   type: 'mono' },
  { from: 'kake',   to: 'tosou',  type: 'mono' },
  { from: 'tosou',  to: 'kensa',  type: 'mono' },
  { from: 'kensa',  to: 'store',  type: 'mono' },
  { from: 'store',  to: 'shukka', type: 'mono' },
  { from: 'dasshi', to: 'shukka', type: 'mono', bend: 0.25 },
  { from: 'office', to: 'shukka', type: 'info', label: '受注・指示', bend: -0.45 },
  { from: 'office', to: 'ukeire', type: 'info', label: '発注・振出し', bend: 0.5 },
  { from: 'office', to: 'tosou',  type: 'info', label: '塗装数', bend: 0.2 },
  { from: 'shukka', to: 'office', type: 'info', label: '出荷実績', bend: 0.55 }
];

/* ---------------------------------------------------------
   ツール
   file  : 開く場所。GitHubの別リポジトリは BASE + 'リポジトリ名/'、
           このリポジトリの中は 'tools/〇〇.html'
   verUrl: ver を読み取るページ（file と違うときだけ）
   ver   : ツールの版（日付）。別リポジトリのツールは、Wi-Fiにつながると
           ツール本体の画面から ver を自動で読み取って表示する（ここは予備）
   names : 他言語名（なければ日本語を表示）
   --------------------------------------------------------- */
var TOOLS = [
  { id: 'point', icon: '🔍', name: 'ポイント照合システム',
    desc: 'かんばんQRとポイント表で誤品チェック',
    names: { id: 'Cek Titik', tl: 'Point Check', en: 'Point Check' },
    file: BASE + 'point-shogo/', ver: '2026-11-12' },

  { id: 'shiji-qr', icon: '📋', name: '出荷指示書QR照合',
    desc: '便ごとの指示書QRとかんばんを照合',
    names: { id: 'Cek QR Instruksi', tl: 'QR Check ng Instruction', en: 'Shipping Order QR Check' },
    file: 'tools/shiji-qr.html', ver: '2026-10-22' },

  { id: 'gohin', icon: '✅', name: '誤品照合',
    desc: 'かんばんと現品の取り違えを防ぐ',
    names: { id: 'Cek Salah Barang', tl: 'Check ng Maling Piyesa', en: 'Wrong Part Check' },
    file: BASE + 'gohin/', ver: '2026-11-16' },

  { id: 'kanban-count', icon: '🔢', name: 'かんばんカウンター',
    desc: '背番号ごとにかんばん枚数を数える',
    names: { id: 'Hitung Kanban', tl: 'Bilang ng Kanban', en: 'Kanban Counter' },
    file: 'tools/kanban-counter.html', ver: '2026-11-12' },

  { id: 'zaiko-count', icon: '📦', name: '在庫カウント',
    desc: 'パレット・ストアの在庫数を入力',
    names: { id: 'Hitung Stok', tl: 'Bilang ng Stock', en: 'Stock Count' },
    file: 'tools/zaiko-count.html', ver: '2026-11-17' },

  { id: 'gohin-fts', icon: '🛡️', name: '誤品照合システム（FTS）',
    desc: 'FTS向けの誤品照合',
    names: { id: 'Cek Salah Barang (FTS)', tl: 'Wrong Part Check (FTS)', en: 'Wrong Part Check (FTS)' },
    file: BASE + 'gihin2-FTS/', ver: '2026-11-12' },


  { id: 'hayami', icon: '📊', name: '早見表（eかんばん・EDI受注数の統合）',
    desc: 'eかんばん・EDIの受注数をひとつに',
    file: 'tools/hayamihyo.html', ver: '2026-10-29' },

  { id: 'sekisai', icon: '🚛', name: '積載効率プランナー',
    desc: '便別の積載を算出してExcel出力',
    file: 'tools/sekisai-planner.html', ver: '2026-11-06' },

  { id: 'sango', icon: '🏭', name: '三五在庫管理',
    desc: '在庫管理表・内示PDF・受注CSVから在庫と素材発注を算出（ドライブで2台のPCが同じデータ）',
    file: 'tools/sango-zaiko.html', ver: '2026-11-17' },

  { id: 'furidashi', icon: '🧾', name: '購入かんばん振出しチェック',
    desc: '振出し表と読取データを照合',
    file: 'tools/furidashi-check.html', ver: '2026-11-03' },

  { id: 'kakeoki', icon: '🗂️', name: '掛け置き管理ツール',
    desc: '内示取込・リミット表作成',
    file: BASE + 'naiji-kanri-tools/', ver: '2026-11-17' },

  { id: 'seisan', icon: '⏱️', name: '生産管理しくみ',
    desc: '段取り・掛け・検査の進み具合とタイムリミット表',
    file: BASE + 'seisankanri-kakeoki-/', ver: '2026-11-17c' },

  { id: 'dasshi', icon: '🧪', name: '脱脂内示データ抽出',
    desc: '内示CSVと脱脂ひな形を照合してExcel出力',
    file: BASE + 'dasshi-naiji-HONDA-/',
    verUrl: BASE + 'dasshi-naiji-HONDA-/%E8%84%B1%E8%84%82%E5%86%85%E7%A4%BA%E3%83%87%E3%83%BC%E3%82%BF%E6%8A%BD%E5%87%BA.html',
    ver: '2026-11-17' },

  { id: 'uriage', icon: '💴', name: '売上・仕入照合',
    desc: '売上伝票と仕入明細を照合してOK/NG判定',
    file: 'tools/uriage-shiire.html', ver: '2026-11-17' },

  { id: 'mitsumori', icon: '🧾', name: '見積単価 反映ツール',
    desc: '過去の見積書から品番ごとの単価を探して、見積もり提出書に入れる',
    file: 'tools/mitsumori-tanka.html', ver: '2026-11-17' },

  { id: 'naiji', icon: '📅', name: 'ユニクレア 出荷内示 月度表',
    desc: '出荷ファイルの注文数を月度表に入れ、前回から変わった日を赤字で知らせる',
    file: 'tools/shukka-naiji.html', ver: '2026-11-18' },

  { id: 'shikyu-naiji', icon: '🚚', name: 'ユニクレア 支給内示 月度表',
    desc: '支給ファイルの支給数を月度表に入れ、変わった日を赤字・台数も照合',
    file: 'tools/shikyu-naiji.html', ver: '2026-11-18' },

  { id: 'shukka-houkoku', icon: '📝', name: '高木製作所 出荷数報告書 作成',
    desc: '発注データ（CSV／PDF）から出荷数報告書を作って印刷。両方入れると突き合わせ',
    file: 'tools/shukka-houkoku.html', ver: '2026-11-17b' },

  { id: 'tsumitsuke', icon: '🧱', name: '積み付け表 作成ツール',
    desc: 'タイムライン早見表から便ごとの積み付け表を作って印刷',
    file: 'tools/tsumitsuke.html', ver: '2026-11-17' },

  { id: 'shogo-matome', icon: '🧮', name: '照合結果まとめ',
    desc: '誤品照合・ハンディの照合ファイルをまとめて未処置NGを見つける',
    file: 'tools/shogo-matome.html', ver: '2026-11-17' },

  { id: 'shukka-more-auto', icon: '⏰', name: '出荷漏れ自動照合',
    desc: '受注データと照合記録を決めた時刻に自動で照合して残す',
    file: 'tools/shukka-more-auto.html', ver: '2026-11-18k' },

  { id: 'shukka-more-view', icon: '👀', name: '出荷漏れ照合（閲覧用）',
    desc: '照合PCの最新の照合結果を表で見る（60秒ごとに読み直し。⚙ で接続を設定）',
    names: { id: 'Cek Kebocoran (Lihat)', tl: 'Shipping Miss Check (View)', en: 'Shipping Miss Check (View)' },
    file: 'tools/shukka-more-view.html', ver: '2026-11-18l' },

  { id: 'rinkan-yama', icon: '📚', name: '臨かん かんばん山積み',
    desc: '臨かんだけを品番・日付ごとにかんばん枚数で山積みしてExcel出力',
    file: 'tools/rinkan-yamazumi.html', ver: '2026-11-17' },

  { id: 'kanri-sheet', icon: '🗒️', name: '管理シート作成ツール（協豊・FTS広田・三五）',
    desc: '内示から週ごとの管理シートと塗装管理表を作る',
    file: 'tools/kanri-sheet.html', ver: '2026-11-17' }
];
