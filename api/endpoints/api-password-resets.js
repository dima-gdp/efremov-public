import BaseEndpoint from './base-endpoint';

export default class ApiPasswordResets extends BaseEndpoint {
  type = 'password-resets'
  url = '/password-resets'
}
