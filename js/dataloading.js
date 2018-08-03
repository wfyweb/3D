//var apiPath = '//taishi.roarpanda.com:9300/';
var _getCookie = function (cookie_name) {
  var strCookie = document.cookie;
  //将多cookie切割为多个名/值对
  var arrCookie = strCookie.split("; ");
  var userId;
  //遍历cookie数组，处理每个cookie对
  for (var i = 0; i < arrCookie.length; i++) {
    var arr = arrCookie[i].split("=");
    //找到名称为userId的cookie，并返回它的值
    if (cookie_name == arr[0]) {
      userId = arr[1];
      break;
    }
  }
  return unescape(userId);
}

function loadFacilityData(callback) {
	// We're going to ask a file for the JSON data.
	xhr = new XMLHttpRequest();

	// Where do we get the data?
	xhr.open('GET', facilityFile, true);

	// What do we do when we have it?
	xhr.onreadystatechange = function() {
		// If we've received the data
		if ( xhr.readyState === 4 && xhr.status === 200 ) {
			// Parse the JSON
			latlonData = JSON.parse( xhr.responseText );
			if( callback )
				callback();
		}
	};

	// Begin request
	xhr.send( null );
}

function loadTestData(callback) {
	//var path = apiPath + 'api/honeypotattack?token=' + _getCookie('token_honeypot');
	// var path = 'http://taishi.roarpanda.com:9300/api/honeypotattack?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Imd1ZXN0Iiwib3JpZ19pYXQiOjE1MzMyNjExMzMsInVzZXJfaWQiOjE2LCJleHAiOjE1MzMyNzkxMzN9.UV_JoRrD03Zm0kM4IFdafAQLAN6JYP5kCaZwYBA7LhA'
	var path = 'http://taishi.roarpanda.com:9300/api/honeypotattack?token=ey'
	xhr = new XMLHttpRequest();
	xhr.open( 'GET', path, true );
	xhr.onreadystatechange = function() {
		if ( xhr.readyState === 4 && xhr.status === 200 ) {
			var res = JSON.parse( xhr.responseText );

			if (res && res.status === 1) {

				// swiper
				swiperData = res;

				// 地球用数据
				timeBins = [{
					data: [],
					year: 2017
				}]

				let dH = ''
				res.res.forEach(function (i, j) {
					i.geoip.forEach(function (m, n) {
						let dataLi = {
							"date": m.ip,
							"time": m.country_name,
							"missile": missleName[i.hp_name],
							"facility": missleName[i.hp_name],
							"landing": "",
							"apogee": Math.random() * 2700 + 300,
							"distance": 6940,
							"lat": m.latitude,
							"lon": m.longitude,
							"bearing": 72,
							"outcome": "success",
							"description": "this is may not useful."
						}
						timeBins[0].data.push(dataLi)
					})
					// 遍历missle名字字典，出现一个显示一个
					if (missleName[i.hp_name] && i.geoip.length) {
						$('.' + missleName[i.hp_name]).show()
						dH = missleName[i.hp_name]
					}
				})
				// 如果便利没有默认的迪拜，则更改默认蜜罐
				if (dH !== defalutHoneypot) {
					defalutHoneypot = dH
				}
			} else {
				alert('服务出错，请稍后再试')
			}

			maxValue = 0;
			// console.log(timeBins);

			startTime = timeBins.year;
			endTime = timeBins.year;
			timeLength = endTime - startTime;

			if(callback && res.res.length)
				callback();
				loadLineOnly(defalutHoneypot);
				showMiniMap(defalutHoneypot);
			console.log("finished read data file");
		}
	};
	xhr.send( null );
}

function loadMissileData( callback ){
	cxhr = new XMLHttpRequest();
	cxhr.open( 'GET', missileFile, true );
	cxhr.onreadystatechange = function() {
		if ( cxhr.readyState === 4 && cxhr.status === 200 ) {
			missileLookup = JSON.parse( cxhr.responseText );
			callback();
		}
	};
	cxhr.send( null );
}

function loadDictData(callback) {
	cxhr = new XMLHttpRequest();
	cxhr.open('GET', dictFile, true);
	cxhr.onreadystatechange = function() {
		if (cxhr.readyState === 4 && cxhr.status === 200) {
			dict = JSON.parse(cxhr.responseText);
			callback();
		}
	};
	cxhr.send(null);
}

function loadAttackType (potName) {
	var search,section,sum = 0;
	var ulDom = $('.attack-type ul');
	for (var item in missleName) {
		if (missleName[item] === potName) {
			search = item;
			break;
		}
	}
	//底部数据
	//var path = apiPath + 'api/honeytogdetail/';
	var path = 'http://taishi.roarpanda.com:9300/'+'api/honeytogdetail/';
	$.get(path, {
		//token: _getCookie('token_honeypot'),
		//token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Imd1ZXN0Iiwib3JpZ19pYXQiOjE1MzMyNjExMzMsInVzZXJfaWQiOjE2LCJleHAiOjE1MzMyNzkxMzN9.UV_JoRrD03Zm0kM4IFdafAQLAN6JYP5kCaZwYBA7LhA',
		token:"token_key",
		search: search,
		section: 0
	}, function (res) {
		if (res && res.res && res.res.hp_type.length) {
			// 首先将统计都归0
			ulDom.find('.attack-type-count').text(0);
			attactContData = res.res.hp_type;
			attactContData.forEach(function (i, j) {
				sum += i.value
				$('.attack-type').find('.attack-type-' + i.name).find('.attack-type-count').text(i.value);
			})
			$('.attack-type-sum').text(sum);
			$('.attack-type').show();
		}
	})
}
