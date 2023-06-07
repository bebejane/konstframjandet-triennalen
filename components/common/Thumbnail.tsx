import s from './Thumbnail.module.scss'
import cn from 'classnames'
import React, { useState } from 'react'
import { Image } from 'react-datocms/image'
import Link from '/components/nav/Link'
import { truncateWords } from '/lib/utils'
import { remark } from 'remark'
import strip from 'strip-markdown'

export type Props = {
  image?: FileField
  slug: string
  title: string
  index: number
  titleLength?: number
  titleRows?: number
  intro?: string
  meta?: string
  transformHref?: boolean
}

export default function Thumbnail({ image, index, slug, intro, title, titleLength, titleRows = 3, meta, transformHref = true }: Props) {

  const strippedIntro = truncateWords(remark().use(strip).processSync(intro).value as string, 500)
  const [loaded, setLoaded] = useState(false);

  return (
    <Link href={slug} transformHref={transformHref} className={cn(s.thumbnail, index % 2 === 0 ? s.odd : s.even)}>
      {image &&
        <div className={s.imageWrap}>
          <>
            <Image
              data={image.responsiveImage}
              className={s.image}
              pictureClassName={s.picture}
              placeholderClassName={s.placeholder}
              onLoad={() => setLoaded(true)}
            /><div className={s.border}></div>
          </>
        </div>
      }
      <h3 className={cn(s[`rows-${titleRows}`])}>
        <span>
          {titleLength ? truncateWords(title, titleLength) : title}
        </span>
      </h3>
      {(strippedIntro || meta) &&
        <div className="thumb-intro">
          <p>
            {meta && <strong>{meta.trim()}</strong>}
            {strippedIntro}
          </p>
        </div>
      }
    </Link>
  )
}