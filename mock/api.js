
let arr = [];
for (var i = 10; i >= 0; i--) {
	arr.push({
		title: `标题-${i}`,
		id: i,
	})
}


export default {
	'GET /api/example': (req, res) => {
		console.log(req)
		// res.end({
		// 	total: 10,
		// 	items: arr
		// })
		res.end('ok')
	}
}