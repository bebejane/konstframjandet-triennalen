import { withWebPreviewsEdge } from 'dato-nextjs-utils/hoc';

export const config = {
  runtime: 'edge'
}

export default withWebPreviewsEdge(async ({ item, itemType }) => {

  let path = null;

  const { api_key } = itemType.attributes
  const slug = typeof item.attributes.slug === 'object' ? item.attributes.slug.sv : item.attributes.slug

  switch (api_key) {
    case 'start':
      path = `/`
      break;
    case 'about':
      path = `/om/${slug}`
      break;
    case 'program':
      path = `/program/${slug}`
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