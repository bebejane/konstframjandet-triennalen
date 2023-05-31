import fs from 'fs'
import {
  itemTypeToId,
  allPages,
  htmlToMarkdown,
  cleanObject,
  htmlToStructuredContent,
  parseSlug,
  allBlockIds,
  chunkArray,
  buildWpApi,
  insertRecord,
  decodeHTMLEntities,
  writeErrors,
  printProgress
} from './'

export const migrateAbout = async (subdomain: string | undefined) => {

  console.time(`import-about-${subdomain}`)

  const errors = []

  try {

    const wpapi = buildWpApi(subdomain)
    const itemTypeId = (await itemTypeToId('about')).id
    const allPosts = await allPages(wpapi, 'about')
    const blockIds = await allBlockIds()

    fs.writeFileSync(`./lib/scripts/migration/data/${subdomain}-about.json`, JSON.stringify(allPosts, null, 2))

    console.log(`Parse ${allPosts.length} about items...`)
    let items;

    items = await Promise.all(allPosts.map(async ({
      date: createdAt,
      title,
      slug,
      content,
      acf: {
        intro,
      } }) =>
    (cleanObject({
      createdAt,
      title: decodeHTMLEntities(title.rendered),
      intro: intro ? htmlToMarkdown(intro) : undefined,
      content: await htmlToStructuredContent(content.rendered, blockIds, [subdomain]),
      slug: parseSlug(slug),

    }))))

    console.log(`Import ${items.length} about items...`)
    const chunked = chunkArray(items, 30)

    for (let i = 0, total = 0; i < chunked.length; i++) {
      const res = await Promise.allSettled(chunked[i].map((el) => insertRecord(el, itemTypeId, [subdomain])))
      res.forEach((el, index) => el.status === 'rejected' && errors.push({ item: chunked[i][index], error: el.reason }));
      printProgress(`${(total += chunked[i].length)}/${items.length}`)
    }
    writeErrors(errors, subdomain, 'about')
  } catch (err) {
    console.log(err)
    writeErrors([{ error: err }], subdomain, 'about')
  }
  console.timeEnd(`import-about-${subdomain}`)
}

migrateAbout('triennalen')