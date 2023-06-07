import s from './StartExhibition.module.scss'
import React from 'react'
import { CardContainer, Card, Thumbnail } from '/components'
import { useTranslations } from 'next-intl'
import { formatDate } from '/lib/utils'
import Link from '/components/nav/Link'

export type Props = {
  data: StartExhibitionRecord & {
    exhibitions: ExhibitionRecord[]
  }
}

export default function StartExhibition({ data: { exhibitions } }: Props) {
  const t = useTranslations()

  return (
    <div className={s.container}>
      <header>
        <span></span>
        <h2>{t('Menu.exhibitions')}</h2>
        <Link href={'/utstallningar'} className="small">
          {t('General.showAll')}
        </Link>
      </header>
      <CardContainer hideLastOnDesktop={exhibitions.length % 3 !== 0}>
        {exhibitions.map(({ id, image, intro, title, slug, year, startDate, endDate, location }, i) =>
          <Card key={id}>
            <Thumbnail
              index={i}
              image={image}
              title={title}
              intro={intro}
              meta={`${startDate ? `${formatDate(startDate, endDate)} ` : ''}`}
              slug={`/${year.title}/utstallningar/${slug}`}
              transformHref={false}
              titleLength={50}
              titleRows={1}
            />
          </Card>
        )}
      </CardContainer>
    </div>
  )
}