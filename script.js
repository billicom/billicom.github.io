const invButton = $(document.getElementById("inv-button"));

const rstButton = $(document.getElementById("rst-button"));

const invSf = document.getElementById("inv-sf");

const base_url =
  "https://sntu0if8sf.execute-api.eu-west-2.amazonaws.com/test/vjLambdaDemoInvoices";
const invDom = document.getElementById("inv-dom");

const anPh = document.getElementById("an-ph");
const inPh = document.getElementById("in-ph");
const isPh = document.getElementById("is-ph");

var invImgHtml;

function includeHTML() {
  query = [];
  inv_url = base_url;
  //inv_url=consumer_town_url;

  if (f.an && f.an.value != "") {
    query.push("account_number=" + f.an.value);
    clearRootElem(isPh);
  }
  if (f.in && f.in.value != "") {
    query.push("invoice_number=" + f.in.value);
    clearRootElem(isPh);
  } else if (f.is && f.is.value != "") {
	let parms = f.is.value.split("|");
    query.push("account_number=" + parms[0]);
    query.push("invoice_number=" + parms[1]);
	
    //query.push("invoice_number=" + f.is.value);
  }

  if (query.length > 0) {
    inv_url = inv_url + "?" + query.join("&");
  }

  console.log(inv_url);

  return fetch(inv_url, { method: "GET" })
    .then((response) => {
      ctype = response.headers.get("content-type");
      rstat = response.status;
      rstattxt = response.statusText;
      rtype = response.type;
      rurl = response.url;
      console.log(
        ctype + " " + rstat + " " + rstattxt + " " + rtype + " " + rurl
      );
      if (response.status !== 200) {
        console.log(
          "Looks like there was a problem. Status Code: " + response.status
        );
        return;
      }
      if (ctype.indexOf("application/json") >= 0) {
        response.json().then(function (data) {
          console.log(displayJson(invDom, data));
        });
      }

      if (ctype.indexOf("text/html") >= 0) {
        response.text().then(function (data) {
          invImgHtml = data;
          console.log(displayHtml(invDom, invImgHtml));
        });
      }
    })
    .catch((error) => {
      console.log(error["message"]);
    });
}

function displayHtml(rel, txt) {
  if (!txt) {
    return "undefined html";
  }
  clearRootElem(rel);
  let el = document.createElement("div");
  el.id = "invHtmlId";
  let subtxt = txt.substring(txt.indexOf("<table"), txt.indexOf("</body>"));

  el.insertAdjacentHTML("afterbegin", txt);
  el.classList.add("container");
  rel.appendChild(el);

  let invScaleX = rel.offsetWidth / 830;

  let stlTran = "transform: scale(" + invScaleX + ",1);";
  console.log(invScaleX, stlTran);
  el.setAttribute("style", stlTran);

  return "html succ";
}

window.addEventListener("resize", (event) => {
  displayHtml(invDom, invImgHtml);
});

function clearRootElem(rel) {
  //console.log(dict);
  while (rel.hasChildNodes()) {
    rel.removeChild(rel.lastChild);
  }
}

function displayJson(rel, dict) {
  //console.log(dict);
  clearRootElem(rel);
  clearRootElem(isPh);
  invImgHtml = undefined;
  f.an.value = "";

  arr = dict.invoices;
  addIs(arr);

  return "json succ";
}

function addIn() {
  let inp = document.createElement("input");
  inp.id = "in";
  inp.type = "search";
  inp.name = "invoice_number";
  inp.placeholder = "Invoice Number";
  inPh.appendChild(inp);
}

function addIs(dictArr) {
  let sel = document.createElement("select");
  sel.id = "is";
  sel.name = "invoice_select";
  sel.addEventListener("change", (event) => {
    fetchInvoice();
  });
  let option = document.createElement("option");
  option.value = "";
  option.text = "Select Invoice";
  sel.appendChild(option);

  let dictInv = {};
  dictArr.forEach((inv) => {
    if (inv.account_number in dictInv) {
      dictInv[inv.account_number].push(inv);
    } else {
      dictInv[inv.account_number] = [];
      dictInv[inv.account_number].push(inv);
    }

    //console.log(inv.account_number + "=>" + dictInv[inv.account_number])
  });

  for (let acct in dictInv) {
    let go = document.createElement("optgroup");
    go.label = acct;
    sel.appendChild(go);
    ///*
    dictInv[acct].sort(function (a, b) {
      return a.effective_date > b.effective_date ? -1 : 1;
    });
    //*/

    dictInv[acct].forEach((inv) => {
      let opt = document.createElement("option");
      opt.value = inv.account_number + "|" + inv.invoice_number;
      opt.text =
        inv.invoice_number + " | " + inv.effective_date + " | " + inv.amount;
      sel.appendChild(opt);
    });
  }

  clearRootElem(isPh);
  isPh.appendChild(sel);
}

rstButton.addEventListener("click", (e) => {
  // Prevent default execution
  e.preventDefault();
  clearRootElem(isPh);
});

invButton.addEventListener("click", (e) => {
  // Prevent default execution
  e.preventDefault();
  fetchInvoice();
  // Returning false to prevent form from submitting
  return false;
});

invSf.addEventListener("keypress", (e) => {
  // Prevent default execution
  if (e.keyCode == 13) {
    e.preventDefault();
    fetchInvoice();
  }
  // Returning false to prevent form from submitting
  return false;
});

function fetchInvoice() {
  clearRootElem(invDom);

  //invButton.classList.add("fa")// fa-spinner fa-spin");
  invButton.addClass("fa fa-refresh fa-spin");
  //console.log(invButton.classList);

  //hideError()
  //Form.EngNote.value = demoNote1
  //Form.EngNote.focus()
  includeHTML().then(() => {
    invButton.classList.remove("fa");
    invButton.classList.remove("fa-refresh");
    invButton.classList.remove("fa-spin");
  });
}

function addClass(Element, className) {
  const current = Element.className.split(" ");
  if (current.indexOf(className) < -1) {
    return Element;
  }

  current.push(className);
  Element.className = current.join(" ");
  return Element;
}

function removeClass(Element, className) {
  const current = Element.className.split(" ");
  if (current.indexOf(className) === -1) {
    return Element;
  }

  current.splice(current.indexOf(className), 1);
  Element.className = current.join(" ");
}

function $(Element) {
  Element.addClass = addClass.bind(null, Element);
  Element.removeClass = removeClass.bind(null, Element);
  return Element;
}