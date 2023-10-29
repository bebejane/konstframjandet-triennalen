import { withWebPreviewsEdge } from 'dato-nextjs-utils/hoc';

export const config = {
  runtime: 'edge'
}

export default withWebPreviewsEdge(async ({ item, itemType }) => {

  let path = null;

  const { api_key } = itemType.attributes
  const slug = typeof item.attributes.slug === 'object' ? item.attributes.slug.sv : item.attributes.slug

  switch (api_key) {
    case 'year':
      path = `/${item.attributes.title}`
      break;
    case 'start': case 'general':
      path = `/`
      break;
    case 'about':
      path = `/om/${slug}`
      break;
    case 'news':
      path = `/nyheter/${slug}`
      break;
    case 'program':
      path = `/program/${slug}`
      break;
    case 'program_category':
      path = `/program`
      break;
    case 'participant':
      path = `/konstnarer/${slug}`
      break;
    case 'location':
      path = `/platser/${slug}`
      break;
    case 'exhibition':
      path = `/utstallningar/${slug}`
      break;
    case 'contact':
      path = `/kontakt`
      break;
    default:
      break;
  }

  return path
})