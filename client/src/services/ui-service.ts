import $ from 'jquery';

import './ui-service.less';

export class UIService {
  showMask(): void {
    if ($('#global-mask').length) {
      return;
    }

    $('#game-playground').append('<div id="global-mask" />');
  }

  hideMask(): void {
    $('#global-mask').remove();
  }

  alert(): void {}
}
