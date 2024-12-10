import {TickFormatter} from "./tick_formatter"
import type {Arrayable} from "core/types"
import {div} from "core/dom"

export class ImageTickFormatter extends TickFormatter {

  image_source: {[key: string]: string | HTMLImageElement}
  source_type: string

  doFormat(ticks: Arrayable<number | string>, _opts: {loc: number}): string[] {
    const formatted: string[] = []
    for (const t of ticks) {
      if (t in this.image_source) {
        if (this.source_type == "url") {
          const img = div({style: {height: "10px"}}, div({style: {backgroundImage: `url(${this.image_source[t]})`}}))
          formatted.push(img.outerHTML)

        } else if (this.source_type == "array") {
          const img = div({style: {height: "10px"}}, div({style: {backgroundImage: `url(data:image/png;base64,${this.image_source[t]})`}}))
          formatted.push(img.outerHTML)

        } else {
          throw new Error(`Unsupported source type: ${this.source_type}`)
        }
      } else {
        formatted.push(`${t}`) 
      }
    }
    return formatted
  }
}
