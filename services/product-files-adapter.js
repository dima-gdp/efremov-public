import { getExistingApiInstance } from '~/api'

export default function productFilesAdapter() {
  async function getProductFiles(params) {
    const api = getExistingApiInstance()
    const { data } = await api.productFiles.getMany(params)

    return data
  }

  return {
    getProductFiles,
  }
}
