var version = 20201112;

window.localStorage;

var DFN_BRAND_CD = localStorage.getItem("brand_cd");
var DFN_STORE_CD = localStorage.getItem("store_cd");
var DFN_COMPANY_CD = localStorage.getItem("company_cd");
var DFN_TABLE_CD = localStorage.getItem("table_cd");
var DFN_CART_NO = localStorage.getItem("cart_no");
var DFN_PAY_TYPE = "";
var DFN_PACK_YN = "";
var DFN_MID_TYPE = "";

var DFN_IS_RESERVATION = localStorage.getItem("isReservation");
var DFN_BRDG_ID = localStorage.getItem("bridge_id");

var display_total_cnt = 0;
var display_total_amt = 0;

var choice_menu_cd;
var choice_menu_nm;
var choice_menu_um;
var choice_menu_tp;
var choice_ord_max_cnt;
var choice_menu_sub_names;
var choice_tot_items_cnt;
var choice_menu_qty;
var choice_item_tot_amt;
var choice_menu_item_tot_amt = 0;

function setTOTinfo(qty, amt) {
  localStorage.setItem("TOT_QTY", qty);
  localStorage.setItem("TOT_AMT", amt);
  $("#disp_tot_items_qty").text(qty);
  $("#disp_tot_items_amt").text(comma(amt));
}
function setTOTqty(qty) {
  return localStorage.setItem("TOT_QTY", qty);
}
function setTOTamt(amt) {
  return localStorage.setItem("TOT_AMT", amt);
}
function getTOTqty() {
  return parseInt(localStorage.getItem("TOT_QTY"));
}
function getTOTamt() {
  return parseInt(localStorage.getItem("TOT_AMT"));
}

function maxLengthCheck(object) {
  if (object.value.length > object.maxLength) {
    object.value = object.value.slice(0, object.maxLength);
  }
}

function toggle_layer(showId, hideId, hideBtn) {
  $("#" + showId).show();
  $("#" + hideId).hide();
  $("html").scrollTop(10);
  if (hideBtn) {
    $(".terms_btn").hide();
  } else {
    $(".terms_btn").show();
  }
}

function layer_show(objID) {
  $("#" + objID).show();
}

function layer_hide(objID) {
  $("#" + objID).hide();
}

function slide_layer(objID, t) {
  if (t == "down") $("#" + objID).slideDown("slow");
  else $("#" + objID).slideUp("slow");
}

function checked_terms(id, flg) {
  if (flg != null && flg != undefined) {
    $("#" + id).prop("checked", flg);
    toggle_layer("div_order", "div_" + id);
  } else {
    if ($("#" + id).prop("checked")) {
      $("#" + id).prop("checked", false);
      $("#termsAll").prop("checked", false);
    } else {
      $("#" + id).prop("checked", true);
    }
  }

  if (
    $("#terms1").prop("checked") &&
    $("#terms2").prop("checked") &&
    $("#terms3").prop("checked")
  )
    $("#termsAll").prop("checked", true);
  else $("#termsAll").prop("checked", false);
}

function All_Check() {
  if ($("#termsAll").prop("checked")) {
    $("#terms1").prop("checked", false);
    $("#terms2").prop("checked", false);
    $("#terms3").prop("checked", false);
    $("#termsAll").prop("checked", false);
  } else {
    $("#terms1").prop("checked", true);
    $("#terms2").prop("checked", true);
    $("#terms3").prop("checked", true);
    $("#termsAll").prop("checked", true);
  }
}
function changeClassByID(objID, className) {
  document.getElementById(objID).setAttribute("class", className);
}

function check_order_page() {
  var pay_type = DFN_PAY_TYPE;
  var mid_type = DFN_MID_TYPE;

  // OCB 체크
  if ($("#jIsOcbSave").is(":checked") == true) {
    if (
      $("#ocb_card_no1").val() == "" ||
      $("#ocb_card_no2").val() == "" ||
      $("#ocb_card_no3").val() == "" ||
      $("#ocb_card_no4").val() == ""
    ) {
      alert("OCB 카드번호를 입력해주세요.");
      return;
    }

    if (
      document.getElementById("ocbPointTerms2").checked == false ||
      document.getElementById("ocbPointTerms3").checked == false
    ) {
      alert(
        "OK캐시백 포인트 적립을 위해서는 약관을 확인 하신 후 동의하시기 바랍니다!"
      );
      return;
    }
  }

  if ($("#pack_yn").val() == "R") {
    if ($("#reserv_time").val() == "") {
      alert("예약시간을 선택하세요.");
      return;
    }
    if ($("#reserv_person").val() == "") {
      alert("인원수를 선책하세요.");
      return;
    }
    if ($("#reserv_name").val() == "") {
      alert("예약자 성함을 입력하세요..");
      return;
    }

    //예약상점 메모 추가
    $("#req_memo").val(
      "[" +
        $("#reserv_time").val() +
        "] " +
        $("#reserv_person").val() +
        " " +
        $("#reserv_name").val() +
        " 님"
    );
    $("#order_desc").val(
      $("#reserv_name").val() + "|" + $("#reserv_time").val()
    );
  } else if ($("#pack_yn").val() == "W") {
    //대기상점 정보 입력
    $("#phone").val(localStorage.getItem("phone"));
    $("#req_memo").val(localStorage.getItem("order_memo"));
    $("#order_desc").val(localStorage.getItem("order_desc"));
  }

  if (document.getElementById("termsAll").checked == false) {
    alert("약관을 확인 하신 후 동의하시기 바랍니다.!");
  } else {
    if (pay_type == "10") {
      if ($("#hp_no2").val() == "") {
        alert("휴대폰번호를 입력하세요.");
        $("#hp_no2").focus();
      } else {
        if (mid_type == "C") {
          payActionMobile(pay_type);
        } else {
          $("#frmFormpayRequest").submit();
        }
      }
    } else if ($("#pack_yn").val() == "W") {
      payActionMobile(pay_type);
    } else {
      if ($("#hp_no2").val() == "") {
        alert("휴대폰번호를 입력하세요.");
        $("#hp_no2").focus();
      } else {
        payActionMobile(pay_type);
      }
    }
  }
}

function payActionMobile(pay_type) {
  var tableCode = DFN_TABLE_CD;
  var phoneNo = "";

  if ($("#pack_yn").val() == "W") {
    phoneNo = $("#phone").val();
  } else {
    phoneNo = $("#hp_no1").val() + $("#hp_no2").val();
  }

  var payForm = {
    cart_no: DFN_CART_NO,
    company_cd: DFN_COMPANY_CD,
    brand_cd: DFN_BRAND_CD,
    store_cd: DFN_STORE_CD,
    pay_type: pay_type,
    phone: phoneNo,
    order_memo: $("#req_memo").val(),
    order_desc: $("#order_desc").val(),
    table_code: tableCode,
    take_out_yn: $("#pack_yn").val(),
    ocb_save: $("#ocb_save").val(),
    ocb_card_no:
      $("#ocb_card_no1").val() +
      $("#ocb_card_no2").val() +
      $("#ocb_card_no3").val() +
      $("#ocb_card_no4").val(),
    mobilians_trade_id: $("#mobilians_trade_id").val(),
  };

  url = "/web/order/mobile";

  $.ajax({
    url: url,
    type: "POST",
    data: payForm,
    async: false,
  })
    .done(function (data) {
      if (data.resultCode == "00") {
        //alert(data.requestUrl+"\n"+data.requestData.p_INI_PAYMENT);
        $("#frmMobileRequest").attr("action", data.requestUrl);
        $("#P_INI_PAYMENT").val(data.requestData.p_INI_PAYMENT);
        $("#P_MID").val(data.requestData.p_MID);
        $("#P_GOODS").val(data.requestData.p_GOODS);
        $("#P_OID").val(data.requestData.p_OID);
        $("#P_AMT").val(data.requestData.p_AMT);
        $("#P_UNAME").val(data.requestData.p_UNAME);
        $("#P_RESERVED").val(data.requestData.p_RESERVED);
        $("#P_NEXT_URL").val(data.requestData.p_NEXT_URL);
        $("#P_CHARSET").val(data.requestData.p_CHARSET);
        $("#P_NOTI").val(data.requestData.p_NOTI);
        $("#P_HPP_METHOD").val(data.requestData.p_HPP_METHOD);
        $("#P_AUTO_COUPON").val(data.requestData.p_AUTO_COUPON);
        $("#P_TIMESTAMP").val(data.requestData.p_TIMESTAMP);
        $("#P_CHKFAKE").val(data.requestData.p_CHKFAKE);

        $("#frmMobileRequest").submit();
      } else {
        alert(data.resultMsg);
      }
    })
    .fail(function () {
      $("#card_no1").val("");
      $("#card_no2").val("");
      $("#card_no3").val("");
      $("#card_no4").val("");

      $("#expire_mnth").val("");
      $("#expire_year").val("");
      $("#resident_no").val("");

      $("#ocb_save").val("");
      $("#ocb_card_no1").val("");
      $("#ocb_card_no2").val("");
      $("#ocb_card_no3").val("");
      $("#ocb_card_no4").val("");

      $("#background").hide();
    });
}

function payAction() {
  if (check_formpay_card()) {
    var tableCode = DFN_TABLE_CD;

    var payForm = {
      cart_no: DFN_CART_NO,
      company_cd: DFN_COMPANY_CD,
      brand_cd: DFN_BRAND_CD,
      store_cd: DFN_STORE_CD,
      pay_type: "10",
      phone: $("#hp_no1").val() + $("#hp_no2").val(),
      order_memo: $("#req_memo").val(),
      order_desc: $("#order_desc").val(),
      card_no:
        $("#card_no1").val() +
        $("#card_no2").val() +
        $("#card_no3").val() +
        $("#card_no4").val(),
      expire_month: $("#expire_mnth").val(),
      expire_year: $("#expire_year").val(),
      card_cvc: "",
      regist_no: $("#resident_no").val(),
      table_code: tableCode,
      take_out_yn: $("#pack_yn").val(),
      ocb_save: $("#ocb_save").val(),
      ocb_card_no:
        $("#ocb_card_no1").val() +
        $("#ocb_card_no2").val() +
        $("#ocb_card_no3").val() +
        $("#ocb_card_no4").val(),
    };
    url = "/web/order";

    $.ajax({
      url: url,
      type: "POST",
      data: payForm,
      async: false,
    })
      .done(function (data) {
        $("#frmPayResult").attr("action", data.redirectUrl);
        $("#resultCode").val(data.resultCode);
        $("#resultMsg").val(data.resultMsg);
        $("#waitingNo").val(data.waitingNo);
        $("#pointResultMessage").val(data.pointResultMessage);
        $("#tableCode").val(data.tableCode);
        $("#storeName").val(data.storeName);

        $("#card_no1").val("");
        $("#card_no2").val("");
        $("#card_no3").val("");
        $("#card_no4").val("");

        $("#expire_mnth").val("");
        $("#expire_year").val("");
        $("#resident_no").val("");

        $("#ocb_save").val("");
        $("#ocb_card_no1").val("");
        $("#ocb_card_no2").val("");
        $("#ocb_card_no3").val("");
        $("#ocb_card_no4").val("");

        $("#background").hide();
        $("#frmPayResult").submit();
      })
      .fail(function () {
        $("#card_no1").val("");
        $("#card_no2").val("");
        $("#card_no3").val("");
        $("#card_no4").val("");

        $("#expire_mnth").val("");
        $("#expire_year").val("");
        $("#resident_no").val("");

        $("#ocb_save").val("");
        $("#ocb_card_no1").val("");
        $("#ocb_card_no2").val("");
        $("#ocb_card_no3").val("");
        $("#ocb_card_no4").val("");

        $("#background").hide();
      });
  } else {
    alert("카드정보를 입력하세요.");
  }
}

var clickFlag = false;
function payActionMpps() {
  if ($("#hp_no2").val() == "") {
    alert("휴대폰번호를 입력하세요.");
    $("#hp_no2").focus();
    return;
  }

  var tableCode = DFN_TABLE_CD;
  var cardBalance = parseInt($("#cardBalance").val());
  var totalPrice = getTOTamt();

  if (cardBalance - totalPrice < 0) {
    alert(
      "결제 금액이 선불 잔액보다 큽니다. 충전 혹은 금액 변경 후 진행 부탁드립니다."
    );
    return;
  }

  if (clickFlag == true) {
    alert("결제가 진행 중입니다. 잠시만 기다려주세요.");
    return;
  }
  clickFlag = true;

  var payForm = {
    cart_no: DFN_CART_NO,
    company_cd: DFN_COMPANY_CD,
    brand_cd: DFN_BRAND_CD,
    store_cd: DFN_STORE_CD,
    pay_type: "10",
    phone: $("#hp_no1").val() + $("#hp_no2").val(),
    order_memo: $("#req_memo").val(),
    order_desc: $("#order_desc").val(),
    table_code: tableCode,
    take_out_yn: $("#pack_yn").val(),
  };
  url = "/web/order/mpps";

  $.ajax({
    url: url,
    type: "POST",
    data: payForm,
    async: false,
  })
    .done(function (data) {
      $("#frmPayResult").attr("action", data.redirectUrl);
      $("#resultCode").val(data.resultCode);
      $("#resultMsg").val(data.resultMsg);
      $("#waitingNo").val(data.waitingNo);
      $("#pointResultMessage").val(data.pointResultMessage);
      $("#tableCode").val(data.tableCode);
      $("#storeName").val(data.storeName);
      $("#appScheme").val(data.appScheme);

      $("#background").hide();
      $("#frmPayResult").submit();
    })
    .fail(function () {
      $("#background").hide();
    });
}

function payActionNone() {
  var tableCode = DFN_TABLE_CD;
  var totalPrice = getTOTamt();

  if (clickFlag == true) {
    alert("결제가 진행 중입니다. 잠시만 기다려주세요.");
    return;
  }
  clickFlag = true;

  var payForm = {
    cart_no: DFN_CART_NO,
    company_cd: DFN_COMPANY_CD,
    brand_cd: DFN_BRAND_CD,
    store_cd: DFN_STORE_CD,
    brg_id: DFN_BRDG_ID,
    pay_type: "10",
    phone: $("#hp_no1").val() + $("#hp_no2").val(),
    order_memo: $("#req_memo").val(),
    order_desc: $("#order_desc").val(),
    table_code: tableCode,
    take_out_yn: $("#pack_yn").val(),
  };
  url = "/web/order/none";

  $.ajax({
    url: url,
    type: "POST",
    data: payForm,
    async: false,
  })
    .done(function (data) {
      $("#frmPayResult").attr("action", data.redirectUrl);
      $("#resultCode").val(data.resultCode);
      $("#resultMsg").val(data.resultMsg);
      $("#waitingNo").val(data.waitingNo);
      $("#pointResultMessage").val(data.pointResultMessage);
      $("#tableCode").val(data.tableCode);
      $("#storeName").val(data.storeName);
      $("#appScheme").val(data.appScheme);
      $("#userId").val(data.userId);
      $("#brgId").val(data.brgId);
      $("#uid").val(data.uid);
      $("#background").hide();
      $("#frmPayResult").submit();
    })
    .fail(function () {
      $("#background").hide();
    });
}

function check_formpay_card() {
  var card_no =
    $("#card_no1").val() +
    $("#card_no2").val() +
    $("#card_no3").val() +
    $("#card_no4").val();
  if (card_no.length < 12) {
    return false;
  } else if (
    $("#expire_mnth").val().length < 2 ||
    $("#expire_year").val().length < 2
  ) {
    return false;
  } else if ($("#resident_no").val().length < 6) {
    return false;
  } else {
    return true;
  }
}

function comma(str) {
  str = String(str);
  var minus = str.substring(0, 1);

  str = str.replace(/[^\d]+/g, "");
  str = str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");

  if (minus == "-") str = "-" + str;

  return str;
}

function hide_item_detail() {
  reset_choice_menu();
  $("#item_detail").hide();
}

function frmSubmit(url) {
  $("#frmPay").attr("action", url);
  $("#frmPay").submit();
}

function goLocation(uri, category_cd) {
  if (uri == "cart_list" && getTOTqty() == "0") {
    alert("주문할 제품을 선택해주세요.");
  } else {
    if (localStorage.getItem("isReservation") != null) {
      var url =
        uri +
        "?isReservation=" +
        localStorage.getItem("isReservation") +
        "&UID=" +
        localStorage.getItem("cart_no");
    } else {
      var url = uri + "?UID=" + localStorage.getItem("cart_no");
    }

    if (category_cd != null && category_cd != undefined)
      url = url + "&category_cd=" + category_cd;

    if (DFN_BRDG_ID != null && DFN_BRDG_ID != undefined)
      url = url + "&brg_id=" + DFN_BRDG_ID;

    location.href = url;
  }
}

function set_qty(operator) {
  if (operator == "+") {
    if (choice_menu_qty < choice_ord_max_cnt) choice_menu_qty++;
  } else if (operator == "-") {
    if (choice_menu_qty > 1) choice_menu_qty--;
  }
  calc_menu_option_info();
}

function show_item_detail(item_cd, view_flg) {
  if (view_flg == "V") return;
  $("#item_qty").html("1");
  $("#select_item_opt_main").html("");
  $("#item_nm").text("");
  $("#disp_item_um").text("");

  $.getJSON(
    "/web/menu/ajax/menu_detail?company_cd=" +
      DFN_COMPANY_CD +
      "&brand_cd=" +
      DFN_BRAND_CD +
      "&store_cd=" +
      DFN_STORE_CD +
      "&menu_cd=" +
      item_cd,
    function (json) {
      var data = json.data;
      choice_menu_cd = data.menu_cd;
      choice_menu_nm = data.menu_nm;
      choice_menu_um = data.menu_um;
      choice_menu_tp = data.menu_tp;
      choice_ord_max_cnt = data.ord_max_cnt;
      choice_menu_sub_names = data.menu_sub_names;
      choice_tot_items_cnt = data.item_cnt;
      choice_menu_qty = 1;

      $("#item_img_src").attr("src", data.menu_image);
      $("#item_nm").text(choice_menu_nm);
      $("#item_sub_names").text(choice_menu_sub_names);
      $("#disp_item_um").text(comma(choice_menu_um));

      if (data.item_cnt > 0) {
        $.each(data.item_list, function (subIdx, subData) {
          var items = [];
          items.push(
            '<select class="select_opt" id="select_opt_' +
              subIdx +
              '" data-default_cd="' +
              subData.default_item_cd +
              '">'
          );
          $.each(subData.item_list, function (itemIdx, itemData) {
            var itemData_add_um = "";

            if (itemData.add_um > 0)
              itemData_add_um = " [ " + itemData.add_um + "원 추가 ]";

            items.push(
              '<option value="' +
                itemData.item_cd +
                '" data-group_cd="' +
                itemData.item_group_cd +
                '" data-add_um="' +
                itemData.add_um +
                '" data-item_qty="' +
                itemData.item_qty +
                '" data-item_nm="' +
                itemData.item_nm +
                '">' +
                itemData.item_nm +
                itemData_add_um +
                "</option>"
            );
          });
          items.push("</select>");
          $("<div/>", {
            class: "select item_opt",
            html: items.join(""),
          }).appendTo("#select_item_opt_main");
          $("#select_opt_" + subIdx).val(subData.default_item_cd);
        });
      }

      $(".select_opt").unbind("change");
      $(".select_opt").bind("change", function () {
        calc_menu_option_info();
      });

      calc_menu_option_info();
      $("#item_detail").show();
    }
  );
}

function remove_cart_menu(menu_code, menu_seq) {
  var jsonForm = {
    cart_no: DFN_CART_NO,
    cmd: "D",
    cart_menu: {
      menu_code: menu_code,
      menu_seq: menu_seq,
    },
  };

  sendData(jsonForm);
}

function modify_qty(menu_code, menu_seq, operator) {
  var chk = false;
  var menu_qty = $("#item_qty_" + menu_seq).text();

  if (operator == "-") {
    if (menu_qty > 1) {
      menu_qty--;
      chk = true;
    }
  } else if (operator == "+") {
    if (menu_qty < 20) {
      menu_qty++;
      chk = true;
    }
  }
  if (chk) {
    var jsonForm = {
      cart_no: DFN_CART_NO,
      cmd: "U",
      cart_menu: {
        menu_code: menu_code,
        menu_seq: menu_seq,
        menu_qty: menu_qty,
      },
      operator: operator,
    };

    sendData(jsonForm);
  }
}

function calc_menu_option_info() {
  var choice_tot_amt = 0;
  choice_tot_amt = choice_menu_um * choice_menu_qty;
  $("#item_qty").text(choice_menu_qty);

  get_option_info(choice_menu_qty);
  choice_menu_item_tot_amt = choice_tot_amt + choice_item_tot_amt;

  $("#disp_item_um").text(comma(choice_menu_item_tot_amt));
}

function add_cart_upsailling(item_cd, item_nm, item_amt) {
  var jsonForm = {
    cart_no: DFN_CART_NO,
    cmd: "C",
    cart_menu: {
      menu_code: item_cd,
      menu_price: item_amt,
      menu_name: item_nm,
      menu_qty: 1,
    },
  };

  var items = [];
  $.ajax({
    url: "apis/v1/cart",
    type: "POST",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(jsonForm),
    dataType: "json",
  })
    .done(function (data) {
      if (data.result_code == "00") {
        items.push('<div class="item_info">');
        items.push('<div class="item_img">');
        items.push('<img src="' + data.view_data.menu_image + '">');
        items.push("</div>");
        items.push('<div class="item_tit">');
        items.push("<h3>" + data.view_data.menu_name + "</h3>");
        items.push("<span>" + data.view_data.option_name + "</span>");
        items.push("</div>");
        items.push("</div>");
        items.push('<div class="order_info">');
        items.push('<div class="item_quantity">');
        items.push(
          '<button class="decrease" onclick="modify_qty(\'' +
            data.view_data.menu_code +
            "', '" +
            data.view_data.menu_seq +
            "', '-');\">구매수량 감소</button>"
        );
        items.push(
          '<button class="increase" onclick="modify_qty(\'' +
            data.view_data.menu_code +
            "', '" +
            data.view_data.menu_seq +
            "', '+');\">구매수량 증가</button>"
        );
        items.push(
          '<span id="item_qty_' +
            data.view_data.menu_seq +
            '" class="count red">' +
            data.view_data.menu_qty +
            "</span>"
        );
        items.push("</div>");
        items.push('<div class="item_price">');
        items.push(
          '<input type="hidden" id="calc_amt_' +
            data.view_data.menu_seq +
            '" value="' +
            data.view_data.menu_single_price +
            '">'
        );
        items.push(
          '<span class="price" id="disp_amt_' +
            data.view_data.menu_seq +
            '">' +
            comma(data.view_data.menu_total_price) +
            "</span>"
        );
        items.push("<span>원</span>");
        items.push("</div>");
        items.push('<div class="item_del">');
        items.push(
          '<img src="/res/img/btn_del.png" alt="주문 메뉴 지우기" onclick="remove_cart_menu(\'' +
            data.view_data.menu_code +
            "', '" +
            data.view_data.menu_seq +
            "');\">"
        );
        items.push("</div>");
        items.push("</div>");

        $(".cart_list:last").after(
          $("<div/>", {
            class: "cart_list",
            id: "cart_list_" + data.view_data.menu_seq,
            html: items.join(""),
          })
        );
        setTOTinfo(data.total_qty, data.total_price);
      }
    })
    .fail(function (data) {
      alert("메뉴추가하기 실패. 다시 시도해주세요.");
    });
}

function get_option_info(choice_menu_qty) {
  choice_item_tot_amt = 0;
  $.each($(".select_opt"), function (idx, optItem) {
    choice_item_tot_amt =
      parseInt(choice_item_tot_amt) +
      parseInt($(this).find(":selected").data("add_um")) * choice_menu_qty;
  });
}
function reset_choice_menu() {
  choice_menu_cd = "";
  choice_menu_nm = "";
  choice_menu_um = "";
  choice_menu_tp = "";
  choice_ord_max_cnt = "";
  choice_menu_sub_names = "";
  choice_tot_items_cnt = "";

  $("#item_qty").text("");
  $("#item_nm").text("");
  $("#disp_item_um").text("");
  $("#select_item_opt_main").text("");
}

function add_cart() {
  var itemForm = getOptionInfo(choice_menu_cd);

  if (itemForm == "error") {
    return;
  }

  var jsonForm = {
    cart_no: DFN_CART_NO,
    cmd: "C",
    cart_menu: {
      menu_code: choice_menu_cd,
      menu_price: choice_menu_um,
      menu_name: choice_menu_nm,
      menu_qty: choice_menu_qty,
    },
    cart_menu_option_list: itemForm,
  };

  sendData(jsonForm);
}

function sendData(jsonForm) {
  $.ajax({
    url: "apis/v1/cart",
    type: "POST",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(jsonForm),
    dataType: "json",
  })
    .done(function (data) {
      if (data.result_code == "00") {
        if (jsonForm.cmd == "C") {
          var TOT_qty = getTOTqty() + choice_menu_qty;
          var TOT_amt = getTOTamt() + choice_menu_item_tot_amt;
          hide_item_detail();
        } else if (jsonForm.cmd == "U") {
          $("#item_qty_" + jsonForm.cart_menu.menu_seq).text(
            jsonForm.cart_menu.menu_qty
          );
          $("#disp_amt_" + jsonForm.cart_menu.menu_seq).text(
            comma(
              $("#calc_amt_" + jsonForm.cart_menu.menu_seq).val() *
                jsonForm.cart_menu.menu_qty
            )
          );
        } else if (jsonForm.cmd == "D") {
          $("#cart_list_" + jsonForm.cart_menu.menu_seq).remove();
          if ($(".cart_list").length < 1) {
            alert("주문할 제품이 없습니다.");
            goLocation("item_list");
          }
        }
        setTOTinfo(data.total_qty, data.total_price);
      } else {
        alert("장바구니 실패. 다시 시도해주세요.");
      }
    })
    .fail(function (data) {
      alert("장바구니 실패. 다시 시도해주세요.");
    });
}

function getOptionInfo(choice_menu_cd) {
  var itemForm = [];
  var errFlg = false;

  if ($(".select_opt").length > 0) {
    $.each($(".select_opt"), function (idx, optItem) {
      if ($(this).find(":selected").data("group_cd") == undefined) {
        alert("선택되지 않은 옵션메뉴가 존재합니다.");
        errFlg = true;
      }

      itemForm.push({
        menu_code: choice_menu_cd,
        option_seq: idx + 1,
        option_code: $(this).find(":selected").val(),
        option_name: $(this).find(":selected").data("item_nm"),
        option_price: $(this).find(":selected").data("add_um"),
        option_qty: $(this).find(":selected").data("item_qty"),
        option_group_cd: $(this).find(":selected").data("group_cd"),
      });
    });
  }

  if (errFlg) {
    return "error";
  } else {
    return itemForm;
  }
}

function getQueryString(obj) {
  const result = [];
  let match;
  const re = new RegExp("(?:\\?|&)" + obj + "=(.*?)(?=&|$)", "gi");
  while ((match = re.exec(document.location.search)) !== null) {
    result.push(match[1]);
  }
  return result;
}

function refreshFooteerInfo() {}

function checkWaiting(askType) {
  if ($("#reserv_person").val() == "") {
    alert("대기 인원수를 선책하세요.");
    $("#reserv_person").focus();
    return;
  }

  if (askType == "N" && $("#reserv_name").val() == "") {
    alert("대기자 성함을 입력하세요..");
    $("#reserv_name").focus();
    return;
  }

  if ($("#hp_no2").val() == "") {
    alert("휴대폰번호를 입력하세요.");
    $("#hp_no2").focus();
    return;
  }

  $("#phone").val($("#hp_no1").val() + $("#hp_no2").val());

  if (askType == "A" && document.getElementById("terms5").checked == false) {
    alert("약관을 확인 하신 후 동의하시기 바랍니다!");
    return;
  }

  //대기상점 구분
  if (askType == "N") {
    $("#order_memo").val(
      "[대기주문] " +
        $("#reserv_person").val() +
        " " +
        $("#reserv_name").val() +
        " 님"
    );
    $("#order_desc").val(
      $("#reserv_name").val() + "|" + $("#reserv_person").val()
    );

    $("#frmWaiting").attr("method", "get");
    $("#frmWaiting").attr("action", "/");
  } else if (askType == "A") {
    $("#order_memo").val(
      "대기인원 : " +
        $("#reserv_person").val() +
        "/아기의자 : " +
        $("#baby_chair").val() +
        "개/" +
        $("#order_ask_msg").val()
    );
    $("#order_desc").val(
      "reserv_person:" +
        $("#reserv_person").val() +
        "|" +
        "baby_chair:" +
        $("#baby_chair").val() +
        "|" +
        "order_ask_msg:" +
        $("#order_ask_msg").val()
    );

    $("#frmWaiting").attr("method", "post");
    $("#frmWaiting").attr("action", "/save_waiting_info");
  }
  $("#frmWaiting").submit();
}

function check_ask_order() {
  if ($("#reserv_time").val() == "") {
    alert("예약시간을 선택하세요.");
    return;
  }
  if ($("#reserv_person").val() == "") {
    alert("인원수를 선책하세요.");
    return;
  }
  if ($("#reserv_name").val() == "") {
    alert("예약자 성함을 입력하세요..");
    return;
  }
  if ($("#order_ask_msg").val() == "") {
    alert("조르기 메세지를 입력하세요..");
    return;
  }

  //예약상점 메모 추가
  $("#order_memo").val(
    "[" +
      $("#reserv_time").val() +
      "] " +
      $("#reserv_person").val() +
      " " +
      $("#reserv_name").val() +
      " 님"
  );
  $("#order_desc").val(
    $("#reserv_name").val() +
      "|" +
      $("#reserv_time").val() +
      "|" +
      $("#reserv_person").val()
  );
  $("#cart_no").val(DFN_CART_NO);
  $("#phone").val($("#hp_no1").val() + $("#hp_no2").val());

  $("#frmAskOrderRequest").submit();
}

function checkOS() {
  var varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기

  if (varUA.indexOf("android") > -1) {
    //안드로이드
    return "android";
  } else if (
    varUA.indexOf("iphone") > -1 ||
    varUA.indexOf("ipad") > -1 ||
    varUA.indexOf("ipod") > -1
  ) {
    //IOS
    return "ios";
  } else {
    //아이폰, 안드로이드 외
    return "other";
  }
}

function check_ask_order_pay() {
  var pay_type = DFN_PAY_TYPE;
  var mid_type = DFN_MID_TYPE;
  DFN_CART_NO = $("#cart_no").val();

  // OCB 체크
  if ($("#jIsOcbSave").is(":checked") == true) {
    if (
      $("#ocb_card_no1").val() == "" ||
      $("#ocb_card_no2").val() == "" ||
      $("#ocb_card_no3").val() == "" ||
      $("#ocb_card_no4").val() == ""
    ) {
      alert("OCB 카드번호를 입력해주세요.");
      return;
    }

    if (
      document.getElementById("ocbPointTerms2").checked == false ||
      document.getElementById("ocbPointTerms3").checked == false
    ) {
      alert(
        "OK캐시백 포인트 적립을 위해서는 약관을 확인 하신 후 동의하시기 바랍니다!"
      );
      return;
    }
  }

  if (document.getElementById("termsAll").checked == false) {
    alert("약관을 확인 하신 후 동의하시기 바랍니다.!");
  } else {
    if (pay_type == "10") {
      if (mid_type == "C") {
        payActionAsk(pay_type);
      } else {
        $("#frmFormpayRequest").submit();
      }
    } else {
      payActionAsk(pay_type);
    }
  }
}

function payActionAsk(pay_type) {
  var tableCode = DFN_TABLE_CD;
  var phoneNo = "";

  if ($("#pack_yn").val() == "W") {
    phoneNo = $("#phone").val();
  } else {
    phoneNo = $("#hp_no1").val() + $("#hp_no2").val();
  }

  var order_no = $("#order_no").val();

  var payForm = {
    order_no: order_no,
    cart_no: DFN_CART_NO,
    company_cd: DFN_COMPANY_CD,
    brand_cd: DFN_BRAND_CD,
    store_cd: DFN_STORE_CD,
    pay_type: pay_type,
    phone: phoneNo,
    order_memo: $("#req_memo").val(),
    order_desc: $("#order_desc").val(),
    table_code: tableCode,
    take_out_yn: $("#pack_yn").val(),
    ocb_save: $("#ocb_save").val(),
    ocb_card_no:
      $("#ocb_card_no1").val() +
      $("#ocb_card_no2").val() +
      $("#ocb_card_no3").val() +
      $("#ocb_card_no4").val(),
  };

  url = "/web/order/ask";

  $.ajax({
    url: url,
    type: "POST",
    data: payForm,
    async: false,
  })
    .done(function (data) {
      if (data.resultCode == "00") {
        //alert(data.requestUrl+"\n"+data.requestData.p_INI_PAYMENT);
        $("#frmMobileRequest").attr("action", data.requestUrl);
        $("#P_INI_PAYMENT").val(data.requestData.p_INI_PAYMENT);
        $("#P_MID").val(data.requestData.p_MID);
        $("#P_GOODS").val(data.requestData.p_GOODS);
        $("#P_OID").val(data.requestData.p_OID);
        $("#P_AMT").val(data.requestData.p_AMT);
        $("#P_UNAME").val(data.requestData.p_UNAME);
        $("#P_RESERVED").val(data.requestData.p_RESERVED);
        $("#P_NEXT_URL").val(data.requestData.p_NEXT_URL);
        $("#P_CHARSET").val(data.requestData.p_CHARSET);
        $("#P_NOTI").val(data.requestData.p_NOTI);
        $("#P_HPP_METHOD").val(data.requestData.p_HPP_METHOD);
        $("#P_AUTO_COUPON").val(data.requestData.p_AUTO_COUPON);
        $("#P_TIMESTAMP").val(data.requestData.p_TIMESTAMP);
        $("#P_CHKFAKE").val(data.requestData.p_CHKFAKE);
        $("#frmMobileRequest").submit();
      } else {
        alert(data.resultMsg);
      }
    })
    .fail(function () {
      $("#card_no1").val("");
      $("#card_no2").val("");
      $("#card_no3").val("");
      $("#card_no4").val("");

      $("#expire_mnth").val("");
      $("#expire_year").val("");
      $("#resident_no").val("");

      $("#ocb_save").val("");
      $("#ocb_card_no1").val("");
      $("#ocb_card_no2").val("");
      $("#ocb_card_no3").val("");
      $("#ocb_card_no4").val("");

      $("#background").hide();
    });
}

// 페이지 로딩 완료 이벤트 등록 - Mozilla, Opera, Webkit
if (document.addEventListener) {
  document.addEventListener(
    "DOMContentLoaded",
    function () {
      document.removeEventListener("DOMContentLoaded", arguments.callee, false);
      domReady();
    },
    false
  );
}

// 번역페이지 Start
else if (document.attachEvent) {
  document.attachEvent("onreadystatechange", function () {
    if (document.readyState === "complete") {
      document.detachEvent("onreadystatechange", arguments.callee);
      domReady();
    }
  });
}

function domReady() {
  // 1. 초기화 – 필수
  var translate = new inicis.Translate();
  var iniObj = {
    mid: "INImobile1",
    sourceLangCode: "KO",
    isDebug: false,
    isTest: false,
  };
  translate.init(iniObj);
  // 1. 초기화 – 필수

  var targetLangCode = sessionStorage.getItem("chooseLangCode");
  if (targetLangCode != undefined && targetLangCode != "KO")
    translate.translate(targetLangCode);
}
// 번역페이지 End

function saveLocale(x, y) {
  var localeForm = {
    company_cd: $("#company_cd").val(),
    brand_cd: $("#brand_cd").val(),
    store_cd: $("#store_cd").val(),
    lat_x: x,
    lon_y: y,
  };

  url = "/saveLocale";

  $.ajax({
    url: url,
    type: "POST",
    data: localeForm,
    async: true,
  })
    .done(function (data) {})
    .fail(function () {});
}

function checkInpLen(obj) {
  var maxLen = obj.maxLength; //최대 입력 글자수
  var str = obj.value;
  var str_len = str.length;

  if (str_len >= maxLen) {
    alert(maxLen + "자 이상 입력하실 수 없습니다.");
  }
}
