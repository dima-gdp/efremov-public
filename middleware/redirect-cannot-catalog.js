import { ABILITY_SUBJECTS } from '~/domain/user-ability'

export default function redirectCannotCatalog({ redirect, $ability }) {
  if ($ability.cannot('read', ABILITY_SUBJECTS.CATALOG_VIEW)) {
    redirect('/user/profile')
  }
}
