# 06/08 草プロ

## 内容

- minesweeper の下地を作ろう！
  - 今日の目標を共有する
- 9 x 9 の board を作る
  - column を board の下に作る
  - square を column の下に作る
    - 行列のインデックスを中に表示する (i, j)
    - column に display: flex; を当てる
- ランダムに bomb が入った配列を作る
  - [ "empty", "bomb", "empty", "empty", ... ]
  - lodash を入れる
- bomb を square に設定する
  - pop の動きを確認
- 周りの bomb の数を設定する
- click handler を追加する
  - bomb をクリックした場合は alert を出す
