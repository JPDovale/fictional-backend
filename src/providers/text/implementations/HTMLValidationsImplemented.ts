import { Node, load } from 'cheerio'
import { HTMLValidations } from '../contracts/HMTLValidations'
import * as sanitize from 'sanitize-html'

const NotAcceptedTags = [
  'script',
  'button',
  'iframe',
  'meta',
  'embed',
  'object',
  'link',
  'style',
  'form',
  'input',
  'textarea',
  'select',
  'options',
  'base',
  'audio',
  'video',
  'source',
  'track',
  'map',
  'area',
  'canvas',
  'noscript',
  'param',
  'embed',
  'basefont',
  'applet',
  'keygen',
  'wbr',
  'acronym',
  'cite',
  'q',
  'strike',
  'tt',
  'u',
]
const AcceptedAttrs = ['class', 'id', 'style', 'data-color']

interface CheerioType extends Node {
  name: string
  attribs: {
    [x: string]: string
  }
  children: CheerioType[]
}

export class HTMLValidationsImplemented implements HTMLValidations {
  sanitize(html?: string | null | undefined): string | null | undefined {
    if (!html) return html

    const htmlSanitized = sanitize(html, {
      allowedTags: [
        'p',
        'strong',
        'em',
        's',
        'mark',
        'blockquote',
        'span',
        'h1',
        'h2',
        'h3',
        'h4',
        'ol',
        'li',
        'hr',
        'ul',
        'a',
      ],
      allowedAttributes: {
        '*': ['href', 'target', 'rel', 'style', 'class', 'data-color', 'id'],
        span: ['data-type', 'data-id'],
        a: ['href', 'target', 'rel'],
      },
    })

    return htmlSanitized
  }

  htmlIsValid(html?: string | null) {
    if (!html) return true
    const htmlObject = load(html)

    let shouldBeContinueRunning = true
    let htmlIsValid = true
    function verifyIfIsValid(child: CheerioType) {
      if (shouldBeContinueRunning) {
        if (NotAcceptedTags.includes(child.name)) {
          shouldBeContinueRunning = false
          htmlIsValid = false
          return false
        }

        if (child.attribs) {
          Object.keys(child.attribs).forEach((key) => {
            if (!AcceptedAttrs.includes(key)) {
              shouldBeContinueRunning = false
              htmlIsValid = false
              return false
            }
          })
        }

        if (child.children && child.children.length > 0) {
          child.children.forEach((child) => verifyIfIsValid(child))
        }
      }
    }

    htmlObject
      .root()
      .children()
      .each((_, child) => verifyIfIsValid(child as unknown as CheerioType))

    return htmlIsValid
  }
}
