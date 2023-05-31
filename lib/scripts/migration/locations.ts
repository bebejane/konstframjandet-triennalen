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


export const migratelocations = async (subdomain: string | undefined) => {

  console.time(`import-location-${subdomain}`)

  const errors = []

  try {

    const wpapi = buildWpApi(subdomain)
    const itemTypeId = (await itemTypeToId('location')).id
    const blockIds = await allBlockIds()
    const allPosts = await allPages(wpapi, 'location')
    fs.writeFileSync(`./lib/scripts/migration/data/${subdomain}-location.json`, JSON.stringify(allPosts, null, 2))
    // Main locations

    for (let i = 0; i < allPosts.length; i++) {
      allPosts[i].featured_media = allPosts[i].featured_media ? await wpapi.media().id(allPosts[i].featured_media) : null
    }

    console.log(`Parse ${allPosts.length} location items...`)

    let locations = await Promise.all(allPosts.map(async ({
      date: createdAt,
      title,
      slug,
      content,
      featured_media,
      acf: {
        excerpt,
        gallery,
        text,
        street: address,
        city,
        phone,
        url: webpage,
        more: misc

      } }) =>
    (cleanObject({
      createdAt,
      image
        : featured_media ? await uploadMedia({ url: featured_media.source_url, title: featured_media.title.rendered }) : null,
      title: decodeHTMLEntities(title.rendered),
      intro: htmlToMarkdown(excerpt),
      content: await htmlToStructuredContent(text, blockIds, [subdomain]),
      address,
      city,
      phone,
      webpage,
      misc,
      slug: parseSlug(slug),
      year: yearId,
    }))))

    console.log(`Insert ${locations.length} location items...`)

    for (let i = 0; i < locations.length; i++) {

      try {
        await insertRecord({ ...locations[i] }, itemTypeId, [subdomain])
        console.log('.')
      } catch (err) {
        console.log(parseDatoError(err))
        console.log(err)
        errors.push({ item: locations[i], error: err })
      }
    }
    writeErrors(errors, subdomain, 'location')


  } catch (err) {
    console.log(err)
    writeErrors([{ error: err }], subdomain, 'location')
  }
  console.timeEnd(`import-location-${subdomain}`)
}

migratelocations('triennalen')