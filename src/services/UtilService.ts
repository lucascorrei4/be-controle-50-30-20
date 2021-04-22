'use strict';

class UtilService {
  
  public encrypt(data) {
    let buff = new Buffer(data);
    let base64data = buff.toString('base64');
    return base64data;
  }

  public decrypt(data) {
    let buff = new Buffer(data, 'base64');
    let text = buff.toString('ascii');
    return text;
  }
}

export default new UtilService();
