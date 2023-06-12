import s from './Related.module.scss'
import cn from 'classnames'
import React from 'react'
import { Image } from 'react-datocms'
import Link from '/components/nav/Link'
import { recordToSlug } from '/lib/utils'

export type Props = {
  header: string
  items: (ParticipantRecord | LocationRecord | ProgramRecord | ExhibitionRecord)[]
}

export default function Related({ header, items }: Props) {

  if (!items?.length) return null

  return (
    <section className={s.related}>
      <h2>{header}</h2>
      <ul>
        {items.map((item, idx) =>
          <li key={item.id}>
            <Link href={recordToSlug(items[idx])}>
              <figure>
                {item.image &&
                  <Image
                    data={item.image.responsiveImage}
                    className={cn(s.image, idx % 2 === 0 ? s.even : s.odd)}
                  />
                }
                <div className={s.border}></div>
              </figure>
              <figcaption>
                {item.__typename === 'ParticipantRecord' ? item.name : item.title}
              </figcaption>
            </Link>
          </li>
        )}
      </ul>
    </section>
  )
}