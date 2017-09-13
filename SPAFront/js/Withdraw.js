$().ready(function () {

$("#withdraw_btn").on('click', function () {
		var $bank_cardnumber = $('#bank_cardnumber').val();
		var $bank_cvc = $('#bank_cvc').val();
		var $userId = userInfo.userId;
		var $bank_country = $('#bank_country').val();
		var $bank_money = $('#bank_money').val();
		var $bank_firstname = $('#bank_firstname').val();
		var $bank_lastname = $('#bank_lastname').val();
		var $bank_areacode = $('#bank_areacode').val();
		var $bank_phone = $('#bank_phone').val();
		var $bank_email = $('#bank_email').val();
		var $bank_companyname = $('#bank_companyname').val();
		var $bank_streetaddress = $('#bank_streetaddress').val();
		var $bank_apt_suite_bldg = $('#bank_apt_suite_bldg').val();
		var $bank_zipcode = $('#bank_zipcode').val();
		var $bank_exptredata=$('#bank_exptredata').val();
	    var date = new Date($bank_exptredata);
        var $bank_exptremonth = date.getMonth();
        var $bank_exptreyear = date.getFullYear();
		socket.emit('bankInfo', {
				userId : $userId,
				cardnumber:$bank_cardnumber,
				cvc : $bank_cvc,
				exptremonth   :$bank_exptremonth,
				exptreyear  :$bank_exptreyear,
				country  : $bank_country,
				money:$bank_money,
				firstname  : $bank_firstname,
				lastname  : $bank_lastname,
				areacode  :$bank_areacode,
				phone  : $bank_phone,
				email  :$bank_email,
				companyname  : $bank_companyname,
				streetaddress  : $bank_streetaddress,
				apt_suite_bldg  : $bank_apt_suite_bldg,
				zipcode  : $bank_zipcode,	
			});
		alert('您的提现申请已提交，将在24小时内完成！');
		bullup.loadTemplateIntoTarget('swig_index.html', {}, 'main-view');
		$.getScript('/js/zymly.js');
        $.getScript('/js/Withdraw.js');	
	});

});
