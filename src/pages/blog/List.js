import React from 'react';
import { connect } from 'dva';
import l from './Index.less';
import Link from 'umi/link';
import moment from 'moment';
import { CLASSIFIY } from '@/constants/Constants'
import { deepClone } from '@/utils/common'
import Empty from '@/components/widget/Empty'
import { Pagination, Button, Icon, Dropdown, Menu, Spin, Radio } from 'antd';
// const ButtonGroup = Button.Group;

@connect(({ blog, loading }) => ({
	blog,
	loading: loading.effects['blog/list'],
}))
class List extends React.Component {
	state = {
		classifiy: CLASSIFIY,
		classIndex: CLASSIFIY[0].value,
		// time: 'down',
		// hot: 'down',
		// nice: 'down',
		// group: 'time'
	};
	componentDidMount() {
		const {
			dispatch,
			// blog: { list },
		} = this.props;
		dispatch({
			type: 'blog/list',
		});
	}

	changePage = (page, page_size) => {
		const {
			dispatch,
			// blog: { list },
		} = this.props;
		dispatch({
			type: 'blog/list',
			payload: {
				page: page,
			},
		});
	};



	handle = (type, value) => {
		const { dispatch } = this.props;
		let copy = deepClone(this.props.blog.list.query)
		copy[type] = value === 'down' ? 'up' : 'down';
		copy['group'] = type
		dispatch({
			type: 'blog/list',
			payload: {
				...copy,
				page: 1
			}
		})
		// this.setState({
		// 	[type]: value === 'down' ? 'up' : 'down'
		// }, () => {
		// 	dispatch({
		// 		type: 'blog/list',
		// 		payload: {
		// 			...query,
		// 			page: 1,
		// 			group: this.state.group,
		// 			[type]: this.state[type]
		// 		},
		// 	});
		// })
	}
	handleType = ({ key }) => {
		const {
			dispatch,
			blog: { list: {query} },
		} = this.props;

		this.setState({
			classIndex: key
		}, () => {
			dispatch({
				type: 'blog/list',
				payload: {
					...query,
					page: 1,
					classifiy: this.state.classIndex
				},
			});
		})
	};

	render() {
		const {
			blog: { list, list:{query} },
			loading
		} = this.props;
		const { classifiy, classIndex } = this.state;
		const menu = (
			<Menu onClick={this.handleType}>
				{
					classifiy.map( item => {
						if (classIndex !== item.value) {
							return <Menu.Item key={item.value}>{item.label}</Menu.Item>
						}else{
							return null
						}
					})
				}
			</Menu>
		);
		const findText = (index=CLASSIFIY[0].value, arr=CLASSIFIY) => {
			let temp = '';
			arr.forEach( k => {
				if (k.value === index) {
					temp = k.label
				}
			})
			return temp;
		}
		// console.log(query.time)
		return (
			<div className={l.blogBox}>
				<div className={l.title}>文章列表</div>
				<div className={l.filter}>
					<div className={l.left}>
						<Radio.Group value={query.group}>
							<Radio.Button value="time" onClick={this.handle.bind(null, 'time', query.time)}>
								时间
								{query.time === 'down' ? <Icon type="arrow-down" />: <Icon type="arrow-up" />}
							</Radio.Button>
							<Radio.Button value="hot" onClick={this.handle.bind(null, 'hot', query.hot)}>
								热度
								{query.hot === 'down' ? <Icon type="arrow-down" />: <Icon type="arrow-up" />}
							</Radio.Button>
							<Radio.Button value="nice" onClick={this.handle.bind(null, 'nice', query.nice)}>
								点赞
								{query.nice === 'down' ? <Icon type="arrow-down" />: <Icon type="arrow-up" />}
							</Radio.Button>
						</Radio.Group>
					</div>
					<div className={l.right}>
						<Dropdown overlay={menu}>
							<Button value="right">
								{findText(classIndex)}
								<Icon type="down" />
							</Button>
						</Dropdown>
					</div>
				</div>
				{
					list.total > 0 ?
				
				<Spin tip="正在加载..." spinning={loading}>
					<div className={l.list}>
						{list.items.map((item, index) => {
							return (
								<Link to={`/detail?id=${item.id}`} key={item.id}>
									<div className={l.cell}>
										<h3>{item.title}</h3>
										<div className={l.footer}>
											<div className={l.left}>
												时间：
												{item.created_at ? moment(item.created_at).format('YYYY-MM-DD HH:mm') : ''}
											</div>
											<div className={l.right} >
												<Icon className={l.ii} type="eye" />
												{item.hots}
												&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
												<Icon className={l.ii} type="like" />
												{item.user_like ? item.user_like.length : 0}
											</div>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
					<div className={l.page}>
						<Pagination current={query.page} total={list.total} onChange={this.changePage} />
					</div>
				</Spin>
				: 
				<Empty />
				}
			</div>
		);
	}
}

export default List;
