import path from 'node:path'
import fs from 'node:fs'
import type { Context, Next } from 'koa'
import ky from 'ky'
import { checkFileExist } from '../utils'

export function faviconInterceptor() {
  return async (ctx: Context, next: Next) => {
    if (ctx.req.url.startsWith('/favicon/')) {
      const id = ctx.req.url.split('/').pop()
      if (!id.endsWith('.png'))
        throw new Error('bad request')

      const isExist = await checkFileExist(path.resolve(import.meta.dirname, `../../public/favicon/${id}`))
      if (!isExist) {
        const domain = id.replace('.png', '')
        try {
          const arrayBuffer = await ky.get(
            `https://0x3.com/icon?`,
          ).arrayBuffer()
          fs.writeFileSync(
            path.join(import.meta.dirname, `../../public/favicon/${id}`),
            Buffer.from(arrayBuffer),
          )
        }
        catch (error) {
          throw error
        }
      }
    }

    await next()
  }
}
