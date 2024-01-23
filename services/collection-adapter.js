import { getExistingApiInstance } from '~/api'

export default function collectionAdapter() {
  async function getCollectionFiles(params) {
    const api = getExistingApiInstance()
    const { data } = await api.collectionFiles.getMany(params)

    return data
  }

  return {
    getCollectionFiles,
  }
}
