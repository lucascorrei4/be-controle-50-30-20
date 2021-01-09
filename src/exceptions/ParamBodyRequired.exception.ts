import EbarnException from './Ebarn.exception';

export default class ParamBodyRequiredException extends EbarnException {
  constructor(field: string) {
    super(`"${field}" is required`, 400);
  }
}
