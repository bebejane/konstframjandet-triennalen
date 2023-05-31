import { withRevalidate } from 'dato-nextjs-utils/hoc'
import { allYears, translatePath } from '/lib/utils';
import { defaultLocale } from '/lib/i18n'

export default withRevalidate(async (record, revalidate) => {

  const { api_key: apiKey, } = record.model;
  const { slug } = record
  const paths = []


  switch (apiKey) {
    case 'start':
      paths.push('/')
      break;
    case 'about':
      paths.push(`/om/${slug}`)
      break;
    case 'program':
      paths.push('/program')
      paths.push(`/program/${slug}`)
      break;
    case 'participant':
      paths.push('/konstnarer')
      paths.push(`/konstnarer/${slug}`)
      break;
    case 'location':
      paths.push('/platser')
      paths.push(`/platser/${slug}`)
      break;
    case 'exhibition':
      paths.push('/utstallningar')
      paths.push(`/utstallningar/${slug}`)
      break;
    case 'contact':
      paths.push(`/kontakt`)
      break;
    default:
      break;
  }

  console.log(paths)
  revalidate(paths)
})