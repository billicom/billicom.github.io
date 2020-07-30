(({document, fetch}) => {
  /**
   * Adds a css class to a DOM Element
   * @param {DOM Element} Element
   * @param {string} className
   * @return {DOM Element}
   */
   
   const demoNote1 = "1-1161189244433^30/04/2019 18:18:00 - xxx,yyy ===Ring ahead information===Primary EU contact name : xxxPrimary Contact no : xxxWhat was the outcome of the call ? : Successful callCall date  time : 30/04/2019 11:26===Ring ahead information ends======Point Of Intervention notes===Between this point...- Location: Storrington Road - Work Point: DP91 And this point...- Location: West Clayton farm - Location: NTP Plant details...- Plant affected: BT86 - Plant type: CAD Multiple Intervention?: N ===Point Of Intervention notes ends===(No manually entered closure notes)Duration of work beyond NTE0000Duration of work up to NTE00:30Time work started30/04/2019 11:32Name of the person to whom you tested and demonstrated at the premises.mrs fordhaDid you get assistance from another engineer ?Yes - due to Openreach operating reasonsWho / what was responsible for the damage (if known) ?End customerWhere was fault found ?Dropwire has been warn through by tree in customer garden.What did you do to repair Openreach wiring / equipment ?Provide a description of the damage and cause (if known)Cut / damage to wire / cable / block terminal / NTP===QBC Summary Start===Customer Report: End customer advised of no dial tone / voice on the line./        Actions to resolve: Engineer has resolved the fault located at the D-side including aerial cables / lead-in / block terminal.The fault was located within the end customer's curtilage and shown by cut / damage to wire / cable /  block terminal / NTP.The source of the damage was identified as end customer / agent.The fault  was fixed by renewing cable length./        Additional information: No additional work was carried out on the end customer''s wiring / equipment beyond the NTE at their request and within TRC banding.Engineer has not visited end customer premises./        Final alternate test results: Final FastTest performed from the customer premise.The test passed on 30/04/2019 18:02:01.===QBC Summary End===;"
   const demoNote2 = "1-1161344793052^01/05/2019 10:46:00 - aaa,bbb===Ring ahead information===Primary EU contact name : xxxPrimary Contact no : xxx What was the outcome of the call ? : Successful callCall date  time : 01/05/2019 08:18===Ring ahead information ends===(No manually entered closure notes)Duration of work beyond NTE01:00Duration of work up to NTE01:00Time work started01/05/2019 08:20Name of the person to whom you tested and demonstrated at the premises.raymondDid you get assistance from another engineer ?NoReason end customer gave for not wanting their wiring repaired ?No longer requiredName of person who declined repairOwnerWhat work have you completed beyond the NTE ?Disconnected wiring / equipment beyond NTE===QBC Summary Start===Customer Report: End customer advised the line was noisy./        What was found: The line was noisy due to end customer wiring / equipment beyond the NTE.I have not identified any issue in exchange or DSLAM.No number porting issue is identified./        Initial test results: DeltaR test performed at NTE back plate.The test passed with resistance within permissible range for voice on 2019-05-01T08:28:15.PQT performed at NTE backplate.The test passed with amber parameters on 2019-05-01T08:28:15./        Actions to resolve: Engineer has resolved the fault located  beyond the NTE (extn wiring / sockets).There was a fault within the end customer's curtilage caused by general wear and tear.The fault was resolved by disconnecting beyond the NTE./        Additional Information: NTE not faulty but changed NTE to latest version of NTE to enable isolation of internal wiring./        Final test results: Final PQT performed at the NTE back plate.The test passed with amber parameters on 2019-05-01T09:48:05.Final FastTest completed.The test passed on 01/05/2019 10:29:32.===QBC Summary End===;"
  
  function addClass(Element, className) {
    const current = Element.className.split(' ')
    if (current.indexOf(className) < -1) {
      return Element
    }

    current.push(className)
    Element.className = current.join(' ')
    return Element
  }

  /**
   * Removes a css class from a DOM Element
   * @param  {DOM Element} Element
   * @param  {string} className
   * @return {DOM Element}
   */
  function removeClass(Element, className) {
    const current = Element.className.split(' ')
    if (current.indexOf(className) === -1) {
      return Element
    }

    current.splice(current.indexOf(className), 1)
    Element.className = current.join(' ')
  }

  /**
   * Binds an element with utility functions
   * @param  {DOM Element} Element
   * @return {DOM Element}
   */
  function $(Element) {
    Element.addClass = addClass.bind(null, Element)
    Element.removeClass = removeClass.bind(null, Element)
    return Element
  }

  /**
   * Updates DOM list
   * @param  {Collection} items
   * @return {Collection}
   */
  function renderResult(lambdaRes) {
	  
    while(Result.hasChildNodes()) {
      Result.removeChild(Result.lastChild)
    }
	while(Note.hasChildNodes()) {
      Note.removeChild(Note.lastChild)
    }
	
	item = lambdaRes
    //lambdaRes.map( item => {
      const re = document.createElement('div')
	  re.innerHTML = item.res
      Result.appendChild(re)
	  
      const ne = document.createElement('div')	  
	  ne.innerHTML = item.note
      Note.appendChild(ne)	  
    //})
  }

  /**
   * Renders error message to DOM
   * @param  {string} err
   */
  function renderError(err) {
    TheError.style.display = 'block'
    TheError.innerHTML = err
  }

  /**
   * Hides error message
   */
  function hideError() {
    TheError.style.display = 'none'
    TheError.innerHTML = ''
  }

  /**
   * Gets URL for async requests
   * @param  {DOM Form} form
   * @return {string}
   */
  function getUrl(form) {
	 return form.action + '?' + form.ParamName.value + '=' +  encodeURI(form.EngNote.value)
  }

  /**
   * Makes request for Items
   * @return {Promise}
   */
  function processNote() {
    const url = getUrl(Form)

    return fetch(url, {method: 'GET'})
	  .then( hideError())
      .then( response => response.json() )
      .then( response => response.Notes)
      .then( renderResult )
      .catch( renderError )
  }

  // Bind to DOM elements
  const Form = $(document.getElementById('form'))
  const Button = $(document.getElementById('button'))
  const DemoButton1 = $(document.getElementById('demoButton1'))
  const DemoButton2 = $(document.getElementById('demoButton2'))
  const TheError = $(document.getElementById('error'))
  const Result = $(document.getElementById('result'))
  const Note = $(document.getElementById('note'))

  // Bind to form `onsubmit`
  //Form.addEventListener('submit', (e) => {
  Button.addEventListener('click', (e) => {	  
    // Prevent default execution
    e.preventDefault()

    Button.addClass('is-loading')
    processNote()
    .then( () => { 
		Button.removeClass('is-loading')
	})
    // Ready UI for next submission
    .then( () => {
		Form.EngNote.value = ''
		Form.EngNote.focus()
    })

    // Returning false to prevent form from submitting
    return false
  })
  
  DemoButton1.addEventListener('click', (e) => {	  
    // Prevent default execution
    e.preventDefault()

    DemoButton1.addClass('is-loading')
	hideError()
	Form.EngNote.value = demoNote1
	Form.EngNote.focus()
	DemoButton1.removeClass('is-loading')

    // Returning false to prevent form from submitting
    return false
  })
  
  DemoButton2.addEventListener('click', (e) => {	  
    // Prevent default execution
    e.preventDefault()

    DemoButton2.addClass('is-loading')
	hideError()
	Form.EngNote.value = demoNote2
	Form.EngNote.focus()
	DemoButton2.removeClass('is-loading')

    // Returning false to prevent form from submitting
    return false
  })
})({document, fetch})