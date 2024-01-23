import { Serializer } from 'jsonapi-serializer'

const UNAVAILABLE_FIELDS_FOR_JSON_API_ATTR = ['id', 'type', 'links', 'createdAt', 'updatedAt']

function getSOptions(attributes, extendedOptions) {
  const baseOptions = {
    attributes,
    keyForAttribute: 'camelCase',
  }

  if (extendedOptions) {
    return {
      ...baseOptions,
      ...extendedOptions,
    }
  }

  return baseOptions
}

export const getSerializedData = ({
  type, data = {}, extendedOptions,
}) => {
  const attributes = Object.keys(data).filter(attr => !UNAVAILABLE_FIELDS_FOR_JSON_API_ATTR.includes(attr))
  const serializerOptions = getSOptions(attributes, extendedOptions)
  const s = new Serializer(type, serializerOptions)
  const serializedData = s.serialize(data)
  return serializedData
}
