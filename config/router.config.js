export default [
	{
		path: '/login',
		component: './login/Login',
	},
	{
		path: '/register',
		component: './login/Register',
	},
	{
		path: '/game',
		component: './game/CarGame',
	},
	
	{
		path: '/', 
		component: '../layouts/Layout',
		routes: [
			{ path: '/', component: './blog/List' },
			{ path: '/detail', component: './blog/Detail' },
			{ path: '/add', component: './blog/Add' },
			{ path: '/password', component: './login/Password' },
			{ path: '/person', component: './login/Person' },
			{ path: '/people/:id', component: './blog/People' },
		]
	},

]
