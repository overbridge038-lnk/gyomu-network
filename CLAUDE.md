# gyomu-network（出荷業務ツール集の表紙）

## このリポジトリについて
いろいろなツールの**入口をひとつ**にする表紙。物と情報の流れ図に工程ごとのボタンを置き、押すとその工程のツールが開く。
GitHub Pages（main / root）で公開：https://overbridge038-lnk.github.io/gyomu-network/
持ち主：overbridge038-lnk（Public）

## ファイル
| ファイル | 役割 |
|---|---|
| `tools.js` | 設定はここだけ。`SITE_VER`・`BASE`・工程（`AREAS`）・流れの線（`LINKS`）・ツール（`TOOLS`） |
| `index.html` | 表紙の画面（流れ図・一覧・4言語・長押しで移動／コピー・新しい版のお知らせ） |
| `sw.js` | 表紙のオフライン保存（`tools.js` の SITE_VER が変わると新しい版を取り込む） |
| `offline-kit/sw.js` | ほかのツールにオフライン保存を足すときのひな形（ネット優先） |
| `tools/` | このリポジトリの中に置くツール（PCの中のツールを入れる予定） |

## tools/ に入れたツール（2026-11-17）
| ファイル | ツール | 元 |
|---|---|---|
| shukka-more-auto.html | 出荷漏れ自動照合 | 前の表紙（出荷業務ツール集・版 2026-11-17）に埋め込まれていたもの |
| hayamihyo.html | 早見表／eかんばん・EDI受注数の統合 | PC |
| tsumitsuke.html | 積み付け表 作成ツール | PC |
| rinkan-yamazumi.html | 臨かん かんばん山積み | 前の表紙に埋め込まれていたもの |
| furidashi-check.html | 購入かんばん振出しチェック表 | PC |
| shogo-matome.html | 照合結果まとめ | PC。見本データ（作業者名入りの照合記録）は Public のため外した（SAMPLE=null）。charset の宣言を足した |
| kanri-sheet.html | 管理シート作成ツール（協豊・FTS広田・三五） | PC。単体の協豊・FTS広田版より新しい（PDF対応）ので、まとめ版だけを入れた |
| sango-zaiko.html | 三五 在庫管理ツール | PC |
| shukka-naiji.html | ユニクレア 出荷内示 月度表（事務所） | PC（2026-11-17 追加。前の「出荷内示原紙」の置き場所） |
| shikyu-naiji.html | ユニクレア 支給内示 月度表（受入・素材） | PC（2026-11-17 追加） |
| shukka-houkoku.html | 高木製作所 出荷数報告書 作成（事務所） | PC（2026-11-17 追加） |
| sekisai-planner.html | 積載効率プランナー（出荷場） | PC（2026-11-17 追加。Googleフォントを使う） |
| uriage-shiire.html | 売上・仕入照合（事務所） | PC（2026-11-17 追加。見出しに ver を足した。金額のデータは中に持たない） |
| zaiko-count.html | 在庫カウント（協豊・ストア／出荷場） | PC（2026-11-17 追加。Googleへの送信先URL（DATA.gas）は Public のため空にした。各タブレットで ⚙ から一度入れる。ver 2026-11-17） |
| mitsumori-tanka.html | 見積単価 反映ツール（事務所） | PC（2026-11-17 追加。見出しに ver を足した。単価のデータは中に持たない） |
- ver（日付）がなかったツールには、見出しに「ver 2026-11-17」を足した（中身は変えていない）
- まだ届いていない：出荷指示書QR照合・かんばんカウンター
- 表紙の sw.js は Google（script.google.com）への通信を保存しない。別サイトの通信は ? 以降も区別して保存する（共有データが古いまま出ないように）
- tools/ のツールは表紙の sw.js が保存する（保存した版を先に使う）。ツールを直したら tools.js の ver と SITE_VER を上げること。CDN（Excelライブラリ・フォント）を使うツールは、一度Wi-Fiで開くと保存されてオフラインでも動く

- 出荷漏れチェック（手動・shukka-more-check.html）は 2026-11-17 に外した。出荷漏れは自動照合のほうを出荷場に置く（ユーザー決定）

## 接続の設定（2026-11-17 追加・表紙の右上 ⚙）
- Apps Script のURL・合言葉は、表紙の ⚙ から**その端末のブラウザの中だけ**に保存する（公開ページ・リポジトリには入れない）
- 同じ github.io の中は保存場所が同じなので、各ツールがそのまま読む
  - 在庫カウント：localStorage `zaikoCountCfg` の `gas`（ツールの ⚙ と同じ場所）
  - 生産管理しくみ：localStorage `sk_settings` の `gasUrl`・`key`（URLを初めて入れたときは `mode` を `live`＝本番にする）
- URLの形（https://script.google.com/macros/s/…/exec）がちがう・生産管理しくみのURLと合言葉の片方だけ、は保存しない（ポカヨケ）
- タブレットごとに1回入れる

## 決まりごと
- ver（日付）を表紙・各ツールに表示する。表紙を直したら `tools.js` の `SITE_VER` を今日の日付にする
- 「仕組み」ではなく、ひらがなの「しくみ」と書く
- 1〜2文字だけ次の行に送られる改行にしない（`word-break:auto-phrase`）
- TPSの考え方を入れる（見える化・あんどん・標準化・ポカヨケ）
- 別リポジトリのツールは `BASE + 'リポジトリ名/'` でつなぐ。表紙は Wi-Fi のとき各ツールの画面の ver を読み取って表示する（`refreshVers`）
- 同じ github.io の中はオフライン保存の置き場所を共有している。保存の名前はツールごとに分け、消すのは自分の古い保存だけにする
- 長押しで変えた並びは、その端末だけ。全タブレットの標準にするときは「tools.js を書き出す」で出したファイルに差し替えて push
- Publicなので、図面・金額（単価・売上など）は載せない
