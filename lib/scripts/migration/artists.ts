import hex2rgb from 'hex2rgb'
import fs from 'fs'
import {
  itemTypeToId,
  allPages,
  htmlToMarkdown,
  cleanObject,
  htmlToStructuredContent,
  parseSlug,
  buildWpApi,
  insertRecord,
  decodeHTMLEntities,
  ApiError,
  allBlockIds,
  parseDatoError,
  noImage,
  writeErrors,
  printProgress,
  uploadMedia,
  yearId
} from './'


export const migrateArtists = async (subdomain: string | undefined) => {

  console.time(`import-artist-${subdomain}`)

  const errors = []

  try {

    const wpapi = buildWpApi(subdomain)
    const itemTypeId = (await itemTypeToId('participant')).id
    const blockIds = await allBlockIds()
    const allPosts = await allPages(wpapi, 'artist')
    fs.writeFileSync(`./lib/scripts/migration/data/${subdomain}-artist.json`, JSON.stringify(allPosts, null, 2))
    // Main artists

    for (let i = 0; i < allPosts.length; i++) {
      allPosts[i].featured_media = allPosts[i].featured_media ? await wpapi.media().id(allPosts[i].featured_media) : null
    }

    console.log(`Parse ${allPosts.length} artist items...`)

    let artists = await Promise.all(allPosts.map(async ({
      date: createdAt,
      title,
      slug,
      content,
      featured_media,
      acf: {
        excerpt,
        gallery,
        text,
      } }) =>
    (cleanObject({
      createdAt,
      image: featured_media ? await uploadMedia({ url: featured_media.source_url, title: featured_media.title.rendered }) : null,
      name: decodeHTMLEntities(title.rendered),
      intro: htmlToMarkdown(excerpt),
      content: await htmlToStructuredContent(text, blockIds, [subdomain]),
      slug: parseSlug(slug),
      year: yearId,
    }))))

    console.log(`Insert ${artists.length} artist items...`)

    for (let i = 0; i < artists.length; i++) {


      try {
        await insertRecord({ ...artists[i] }, itemTypeId, [subdomain])
        console.log('.')
      } catch (err) {
        console.log(parseDatoError(err))
        errors.push({ item: artists[i], error: err })
      }
    }
    writeErrors(errors, subdomain, 'artist')


  } catch (err) {
    console.log(err)
    writeErrors([{ error: err }], subdomain, 'artist')
  }
  console.timeEnd(`import-artist-${subdomain}`)
}

migrateartists('triennalen')