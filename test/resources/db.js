/*jslint node:true, nomen:true */
var _ = require('lodash'), sjs = require('searchjs'), DATA = {
	post: [
	  {id:"1",title:"foo",content:"Lots of it"},
	  {id:"2",title:"foobar",content:"Even more"},
	  {id:"3",title:"bar",content:"phd"},
	  {id:"4",title:"bar",content:"phd",other:"other field"}
	],
	property: [
	  {id:"1",title:"foo",content:"Lots of it"},
	  {id:"2",title:"foobar",content:"Even more"}
	],
	filter: [
	  {id:"1",title:"filter",content:"I am filtered",post:"1"}
	],
	defaultfilter: [
	  {id:"1",title:"filter one",content:"I am filter yes",filter:"yes"},
	  {id:"2",title:"filter two",content:"I am filter no",filter:"no"},
	  {id:"3",title:"filter three",content:"I am filter blank"}
	],
	withdefault: [
	],
	processor: [
		{id:"1",title:"processor",content:"I am processed"}
	],
	comment: [
		{id:"1",post:"1",comment:"First comment on 1st post"},
		{id:"2",post:"1",comment:"Second comment on 1st post"},
		{id:"3",post:"3",comment:"First comment on 3rd post"}
	],
	nestRequire: [
		{id:"1",post:"1",comment:"First comment on 1st post"},
		{id:"2",post:"1",comment:"Second comment on 1st post"},
		{id:"3",post:"3",comment:"First comment on 3rd post"}
	],
	nestOptional: [
		{id:"1",post:"1",comment:"First comment on 1st post"},
		{id:"2",post:"1",comment:"Second comment on 1st post"},
		{id:"3",post:"3",comment:"First comment on 3rd post"}
	],
	different: [
		{key:"1",post:"1",comment:"First comment on 1st post"},
		{key:"2",post:"1",comment:"Second comment on 1st post"},
		{key:"3",post:"3",comment:"First comment on 3rd post"}
	],
	special: [
	  {id:"1",title:"foo",content:"Lots of it"},
	  {id:"2",title:"foobar",content:"Even more"},
	  {id:"3",title:"bar",content:"phd"},
	],
	user: [
	  {id:"1",name:"john",email:"john@email.com",password:"abc"},
	  {id:"2",name:"jill",email:"jill@email.com",password:"def"},
	  {id:"3",name:"jim",email:"jim@email.com",password:"ghi"}
	],
	privateuser: [
	  {id:"1",name:"john",email:"john@email.com"},
	  {id:"2",name:"jill",email:"jill@email.com"},
	  {id:"3",name:"jim",email:"jim@email.com"}
	],
	publicuser: [
	  {id:"1",name:"john"},
	  {id:"2",name:"jill"},
	  {id:"3",name:"jim"}
	],
	validated: [
		{id:"1",email:"a@email.com",alpha:"abcd",abc:"abc",def:"def",list:"a"},
		{id:"2",email:"bad@mail",alpha:"abcd !",abc:"aa",def:"fff",list:"q"}
	],
	avalidated: [
		{id:"1",email:"a@email.com",alpha:"abcd",abc:"abc",def:"def"},
		{id:"2",email:"bad@mail",alpha:"abcd !",abc:"aa",def:"fff"}
	],
	singleunique: [
		{id:"1",firstname:"sam",lastname:"smith"},
		{id:"2",firstname:"jill",lastname:"jones"}
	],
	doubleunique: [
		{id:"1",firstname:"sam",lastname:"smith"},
		{id:"2",firstname:"jill",lastname:"jones"}
	],
	combounique: [
		{id:"1",firstname:"sam",lastname:"smith"},
		{id:"2",firstname:"jill",lastname:"jones"}
	],
	multiparent: [
		{id:"1",name:"multiparent 1",post:"1"}
	],
	multichild: [
		{id:"1",name:"multichild 1",multiparent:"1"}
	],
	integers: [
		{id:"1",name:"one",index:10},
		{id:"2",name:"two",index:12},
		{id:"3",name:"three",index:18},
		{id:"4",name:"four",index:20},
	],
	cascadeone: [
		{id:"1",singlevalue:"singleone",arrayvalue:"arrayone",anyvalue:"anyone",multiplechildren:"lots of children",nochildren:"none",errorchildren:"oops"}
	],
	cascadetwo: [
		{id:"1",singlevalue:"singletwo",arrayvalue:"arraytwo",anyvalue:"anytwo",multiplechildren:"multipletwo",cascadeone:"1"},
		{id:"2",singlevalue:"singletwotwo",arrayvalue:"arraytwotwo",anyvalue:"anytwotwo",multiplechildren:"multipletwotwo",cascadeone:"200"}
	],
	cascadethree: [
		{id:"1",singlevalue:"singlethree",arrayvalue:"arraythree",anyvalue:"anythree",multiplechildren:"multiplethree",cascadetwo:"1"},
		{id:"2",singlevalue:"singlethreetwo",arrayvalue:"arraythreetwo",anyvalue:"anythreetwo",multiplechildren:"multiplethreetwo",cascadetwo:"200"}
	],
	cascadefour: [
		{id:"1",singlevalue:"singlefour",arrayvalue:"arrayfour",anyvalue:"anyfour",multiplechildren:"multiplefour",cascadeone:"1"},
		{id:"2",singlevalue:"singlefourtwo",arrayvalue:"arrayfourtwo",anyvalue:"anyfourtwo",multiplechildren:"multiplefourtwo",cascadeone:"200"}
	]
}, IDFIELDS = {
	different: "key"
},data, findById = function (name,id) {
	var idField = IDFIELDS[name] || "id";
	return _.findIndex(data[name]||[],function (val) {
		return(val && val[idField] === id);
	});
}, reset = function () {
	data = _.cloneDeep(DATA);
};

reset();



module.exports = {
	get: function (name,key,callback) {
		var d = [], ret;
		// might have an array of keys
		_.each([].concat(key),function (k) {
			d.push(data[name][findById(name,k)]);
		});
		switch(d.length) {
			case 0:
				ret = null;
				break;
			case 1:
				ret = d[0];
				break;
			default:
				ret = d;
				break;
		}
		callback(null,ret);
		return(this);
		
	},
	find: function (name,search,callback) {
		callback(null,sjs.matchArray(data[name],search));
		return(this);
	},
	update: function (name,key,model,callback) {
		var idx = findById(name,key), tmp;
		if (idx >= 0) {
			tmp = data[name][idx];
			data[name][idx] = model;
			callback(null,key);
		} else {
			callback(null,null);
		}
		return(this);
	},
	patch: function (name,key,model,callback) {
		var idx = findById(name,key);
		if (idx >= 0) {
			_.extend(data[name][idx],model);
			callback(null,key);
		} else {
			callback(null,null);
		}
		return(this);
	},
	create: function (name,model,callback) {
		var idField = IDFIELDS[name] || "id", len = data[name].length, id = len > 0 ? (parseInt(data[name][len-1][idField],10)+1).toString() : "1";
		model[idField] = id;
		data[name].push(model);
		callback(null,id);
		return(this);
	},
	destroy: function (name,key,callback) {
		var idx = findById(name,key);
		if (idx >= 0) {
			data[name].splice(idx,1);
			callback(null,key);
		} else {
			callback();
		}
		return(this);
	},
	// simple function to reset data with DATA
	reset : reset,
	data: function (name,idx) {
		var ret;
		if (idx === null || idx === undefined) {
			ret = data[name];
		} else if (typeof(idx) === "number") {
			ret = data[name][idx];
		} else if (typeof(idx) === "string"){
			ret = data[name][findById(name,idx)];
		} else {
			ret = sjs.matchArray(data[name],idx);
		}
		return(ret);
	},
	puredata: function (name,idx) {
		var ret, data = DATA;
		if (idx === null || idx === undefined) {
			ret = data[name];
		} else if (typeof(idx) === "number") {
			ret = data[name][idx];
		} else if (typeof(idx) === "string"){
			ret = data[name][findById(name,idx)];
		} else {
			ret = sjs.matchArray(data[name],idx);
		}
		return(ret);
	}
};