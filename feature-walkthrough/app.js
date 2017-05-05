/*
  Goal:
    Implement a feature walkthrough plugin to orient new users

  Strategy:
    Create a function which can be called to initialize the beginning of a walkthrough

    Each feature is required to follow the following rules in order to work correctly:

      1. Desired element must contain the target class `js__walkthrough{index}`
        where `index` is the order the feature should be shown. These must start
        at 1 and increment by 1. A warning will be thrown if this is incorrect

      2. Desired element must also contain a `data-walkthrough` attribute which
        contains the desired text to describe the feature
*/

// ItemCount should be the number of features in the walkthrough
function walkthrough(itemCount) {
  var currentStep = 1;
  var $focusedElement = $('.js__walkthrough' + currentStep);

  // Handles setting the position of the modal to the next feature, changing the
  // modal text, and removes added styles from the previously selected element
  function nextFeature(back) {
    var modalText = $focusedElement.data().walkthrough;
    var targetRect = $focusedElement[0].getBoundingClientRect();
    var fromTop = targetRect.height / 2 + targetRect.top;
    var fromLeft = targetRect.width + targetRect.left + 10;
    var modalHeight = $('.modal-container').height();
    var previous, buttonText, closeText;

    // handles changing the buttons on the bottom depending on the current step
    if(itemCount === currentStep) {
      buttonText = 'Got it!';
      closeText = '';
      $('.modal-back').css({'display': 'none'})
    }

    // sets previous depending on if we went backwards or forwards in the walkthrough
    if(back) {
      previous = $('.js__walkthrough' + (currentStep + 1));
    } else {
      previous = $('.js__walkthrough' + (currentStep - 1));
    }
    // reset previous element's styles
    previous.removeAttr('style');

    // highlight targeted element
    $focusedElement.css({
      'position': 'relative',
      'z-index': '1000',
    });

    // sets the text for the current data, pulled from the walkthrough
    // data attribute
    $('.modal-content').html(modalText);

    // sets the text of the button to indicate when on the last feature
    $('.modal-next').html(buttonText);

    $('.modal-close').html(closeText);

    // reposition the modal to the right of the targeted element
    $('.modal-container').css({
      'top': fromTop + 'px',
      'left': fromLeft + 'px',
    });

  }

  // Removes the dimmed background, stopping the walkthrough
  function removeWalkthrough() {
    $('.modal-background').remove();
  }

  // Handles the logic and error handling for the flow of the walkthrough
  function step() {
    currentStep++;
    $focusedElement = $('.js__walkthrough' + currentStep);
    // If we were on the last step, stop the walkthrough and give back control to user
    if(currentStep > itemCount) {
      removeWalkthrough();
      return;
    }
    // If the current selected element doesn't exist, it means there was a number
    // skipped in the js__walkthrough{index} classes, warn the user of this.
    if(!$focusedElement.length) {
      console.warn('Your features must start at 1 and increment by one for the js__walkthrough class. Problem occured at:', currentStep);
      removeWalkthrough();
      return;
    }
    nextFeature();
  }

  // initialize and append modal elements to the DOM and sets up event handling
  // for the button
  function _init() {
    if(!$focusedElement.length) {
      console.warn('Your features must start at 1 and increment by one for the js__walkthrough class')
      return;
    }
    var modalText = $focusedElement.data().walkthrough;
    var targetRect = $focusedElement[0].getBoundingClientRect();
    var fromTop = targetRect.height / 2 + targetRect.top;
    var fromLeft = targetRect.width + targetRect.left + 10;

    // highlight targeted element
    $focusedElement.css({
      'position': 'relative',
      'z-index': '1000',
    })

    // append modal background
    $('body').append(
      `
      <div class="modal-background">
        <span class="modal-container">
          <div class="modal-content">
          ` + modalText + `
          </div>
          <div class="modal-controls">
            <span class="modal-close">Close</span>
            <span>
            <button class="modal-back button">Back</button>
            <button class="modal-next button">Next</button>
            </span>
          </div>
        </span>
      </div>
      `
    );

    // Attaches click handler for going forwards in the walkthrough
    $('.modal-next').on('click', function() {
      step();
    })

    // Attaches click handler for going backwards
    $('.modal-back').on('click', function() {
      if(currentStep === 1) { return; }
      currentStep--;
      $focusedElement = $('.js__walkthrough' + currentStep);
      nextFeature(true);
    })

    // Attaches click handler for closing
    $('.modal-close').on('click', function() {
      removeWalkthrough();
    })

    // sets the position of the modal to the left of the element
    // TODO: Determine if we should set to the left or right of element based
    // on the position
    $('.modal-container').css({
      'top': fromTop + 'px',
      'left': fromLeft + 'px',
    })

  }

  // Starts the walkthrough process
  _init();
};

$(document).ready(function() {
  // Make a call to start the walkthrough
  walkthrough(4);
});
