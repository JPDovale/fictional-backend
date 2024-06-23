import { Attribute } from '@modules/persons/entities/Attribute'
import {
  Attribute as AttributeFile,
  AttributeMutation as AttributeMutationFile,
  Prisma,
  AttributeType as AttributeTypeFile,
} from '@prisma/client'
import { AttributeType } from '@modules/persons/entities/types'
import { AttributePreview } from '@modules/persons/valuesObjects/AttributePreview'
import { RepositoryMapper } from '@shared/core/contracts/Repository'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'
import { load } from 'cheerio'
import { AttributeMutationList } from '@modules/persons/entities/AttributeMutationList'
import { Injectable } from '@nestjs/common'
import { AttributeMutationsPrismaMapper } from './AttributeMutationsPrisma.mapper'

// essa função está duplicando o conteúdo interno da tag
// ex para: <p><span>test</span></p>
// temos o seguinte resutado quando requisitado 2 tags
// <p><span>test</span></p><span>test</span>
function extractFirstTags(htmlContent: string, numTags: number) {
  const $ = load(htmlContent)
  let extracted = ''
  let count = 0

  $('*').each((_, elem) => {
    const tag = $(elem).prop('tagName')?.toLowerCase()
    const tagsToSkip = ['html', 'head', 'body']

    if (count >= numTags) return false

    if (tag && !tagsToSkip.includes(tag)) {
      extracted += $.html(elem)
      count++
    }
  })

  return extracted
}

interface AttributePreviewSelect {
  personId: string
  attributeType: AttributeType
  attributeId: string
  fileId: string
  fileTitle: string
  fileContent: string
  fileCreatedAt: Date
  fileUpdatedAt: Date | null
}

interface PersonWithAttributesAndFile {
  id: string
  attributes: {
    type: AttributeTypeFile
    file: {
      createdAt: Date
      updatedAt: Date | null
      id: string
      title: string
      content: string
    }
    id: string
  }[]
}

@Injectable()
export class AttributesPrismaMapper extends RepositoryMapper<
  Attribute,
  AttributeFile,
  Prisma.AttributeUncheckedCreateInput
> {
  constructor(
    private readonly attributeMutationPrismaMapper: AttributeMutationsPrismaMapper,
  ) {
    super()
  }

  toDomain(
    raw: AttributeFile & {
      mutations?: AttributeMutationFile[]
    },
  ): Attribute {
    return Attribute.create(
      {
        fileId: UniqueId.create(raw.fileId),
        type: raw.type as AttributeType,
        mutations: new AttributeMutationList(
          (raw.mutations ?? []).map(
            this.attributeMutationPrismaMapper.toDomain,
          ),
        ),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        trashedAt: raw.deletedAt,
      },
      UniqueId.create(raw.id),
    )
  }

  toPersistence(entity: Attribute): Prisma.AttributeUncheckedCreateInput {
    return {
      deletedAt: entity.trashedAt,
      id: entity.id.toString(),
      fileId: entity.fileId.toString(),
      type: entity.type,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }

  toDomainPreview(raw: AttributePreviewSelect): AttributePreview {
    return AttributePreview.create({
      fileId: UniqueId.create(raw.fileId),
      attributeType: raw.attributeType,
      fileCreatedAt: raw.fileCreatedAt,
      fileUpdatedAt: raw.fileUpdatedAt,
      fileContentPreview: extractFirstTags(raw.fileContent, 1),
      fileTitle: raw.fileTitle,
      personId: UniqueId.create(raw.personId),
      attributeId: UniqueId.create(raw.attributeId),
    })
  }

  toDomainPreviewList(raw: PersonWithAttributesAndFile[]): AttributePreview[] {
    const attributes: AttributePreviewSelect[] = []

    raw.forEach((person) => {
      person.attributes.forEach((attribute) => {
        attributes.push({
          fileCreatedAt: attribute.file.createdAt,
          fileId: attribute.file.id,
          personId: person.id,
          fileTitle: attribute.file.title,
          fileContent: attribute.file.content,
          attributeType: attribute.type as AttributeType,
          attributeId: attribute.id,
          fileUpdatedAt: attribute.file.updatedAt,
        })
      })
    })

    return attributes.map(this.toDomainPreview)
  }
}
