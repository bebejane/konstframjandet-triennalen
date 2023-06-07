import s from './SectionHeader.module.scss'
import cn from 'classnames'
import React from 'react'
import Link from '/components/nav/Link'
import { useRouter } from 'next/router'
import { MenuItem } from '/lib/menu'
import { useTranslations } from 'next-intl'
import { usePage } from '/lib/context/page'
import { useScrollInfo } from 'dato-nextjs-utils/hooks'
import useStore from '/lib/store'
import useDevice from '/lib/hooks/useDevice'

export type SectionHeaderProps = {
  menu: MenuItem[]
  overview?: boolean
}

export default function SectionHeader() {

  const t = useTranslations('Menu')
  const router = useRouter()
  const { locale, asPath } = router

  const [showMenu] = useStore((state) => [state.showMenu])
  const { section, parent, isHome, slugs } = usePage()
  const { scrolledPosition, viewportHeight } = useScrollInfo()
  const { isDesktop } = useDevice()

  const ratio = !isDesktop ? 0 : Math.min(scrolledPosition / (viewportHeight / 2), 1)
  const parentPath = slugs.find((slug) => slug.locale === locale)?.parent
  const isSearch = section === 'search'
  const label = !isSearch ? `${!isHome ? `${t(section)}` : ''}` : t('search')

  const header = (
    <h3 className="mid">
      <span key={label}>
        {label.split('').map((c, idx) =>
          <span
            key={`${idx}`}
            style={{
              animationDelay: `${((idx / label.length) * 0.6)}s`,
            }}
          >{c}</span>
        )}
      </span>
    </h3>
  )

  return (
    <>
      <Link href="/" className={s.logo}>
        <h5 className="logo">
          {'Triennalen'.split('').filter((c, i) => 10 - i > (ratio * 9)).map((c, idx) =>
            <span className={cn(ratio === 1 && 'logo-solo')}>{c}</span>
          )}
        </h5>
      </Link>
      <header className={cn(s.header, !showMenu && s.full, isHome && s.home)}>
        {parentPath && asPath !== parentPath && parent ?
          <Link href={parentPath} transformHref={false}>
            {header}
          </Link>
          : <>{header}</>
        }
      </header>
      {!isHome &&
        <>
          <div className={s.spacer}></div>
          <div className={s.line}></div>
        </>
      }
    </>
  )
}