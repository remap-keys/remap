import React from 'react';
import { Link, Typography } from '@mui/material';

export default function ElectricalBusinessRule() {
  return (
    <React.Fragment>
      <Typography variant="h3">特定商取引法に基づく表記</Typography>
      <section>
        <Typography variant="body1" gutterBottom={true}>
          ｢特定商取引に関する法律」第 11
          条に基づき、以下のとおり表示いたします。
        </Typography>

        <Typography variant="h5">販売事業者</Typography>
        <Typography variant="body1" gutterBottom={true}>
          代表者名: 田中 洋一郎
          <br />
          所在地: 請求があった際に延滞なく開示します
        </Typography>

        <Typography variant="h5">連絡先</Typography>
        <Typography variant="body1" gutterBottom={true}>
          電話番号: 請求があった際に延滞なく開示します
          <br />
          メールアドレス:{' '}
          <Link href="mailto:yoichiro6642@gmail.com">
            yoichiro6642@gmail.com
          </Link>
          <br />
          問い合わせ対応時間: 可能な限り 3 営業日以内に対応します
        </Typography>

        <Typography variant="h5">販売価格</Typography>
        <Typography variant="body1" gutterBottom={true}>
          購入手続きの際に画面に表示されます。
        </Typography>

        <Typography variant="h5">販売価格以外でお客様に発生する金銭</Typography>
        <Typography variant="body1" gutterBottom={true}>
          当サイトのページの閲覧、コンテンツ購入、ソフトウェアのダウンロード等に必要となるインターネット接続料金、通信料金等はお客様の負担となります。それぞれの料金は、お客様がご利用のインターネットプロバイダーまたは携帯電話会社にお問い合わせください。消費税は、内税として表示しております。
        </Typography>

        <Typography variant="h5">
          デジタルアイテム等の利用が可能になる時期
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          購入に関するページに特別な定めが書かれている場合を除き、購入取引後、直ちにご利用いただけます。
        </Typography>

        <Typography variant="h5">お支払い方法</Typography>
        <Typography variant="body1" gutterBottom={true}>
          クレジットカード決済、その他購入に掛かる決済を代行する会社が提供するお支払い方法
        </Typography>

        <Typography variant="h5">支払時期</Typography>
        <Typography variant="body1" gutterBottom={true}>
          購入時にお支払いいただきます。
        </Typography>

        <Typography variant="h5">返品について</Typography>
        <Typography variant="body1" gutterBottom={true}>
          デジタルアイテム等購入後のお客様のご都合によるキャンセルは、お受けできません。
        </Typography>

        <Typography variant="h5">適用範囲</Typography>
        <Typography variant="body1" gutterBottom={true}>
          本表示は、日本の特定商取引に関する法律に基づいて表示するものであり、日本国内からご利用のお客様に対してのみ適用されます。日本国外からご利用のお客様については、お客様の居住国の法令が適用される場合があります。
          <br />
          This notation is based on the Specified Commercial Transactions Act of
          Japan and applies only to Remap users located in Japan. For users
          outside of Japan, the laws and regulations of your country of
          residence may apply.
        </Typography>
      </section>
    </React.Fragment>
  );
}
