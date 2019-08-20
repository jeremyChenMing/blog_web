import React from 'react';
import { connect } from 'dva';
import l from './Index.less';
import Link from 'umi/link';
import moment from 'moment';
import { CLASSIFIY } from '@/constants/Constants';
import { deepClone, myBrowser } from '@/utils/common';
import Empty from '@/components/widget/Empty';
import { Button, Icon, Dropdown, Menu, Radio } from 'antd';

let is_running = true;

@connect(({ blog, loading }) => ({
	blog,
	loading: loading.effects['blog/list'],
}))
class List extends React.Component {
	state = {
		classify: CLASSIFIY,
		classIndex: CLASSIFIY[0].value,
		liu: myBrowser(),
		more: false,
	};
	componentDidMount() {
		const { dispatch, blog: {list} } = this.props;
		if (list.count <= 0) {
			dispatch({
				type: 'blog/list',
			});
		}
		

		window.addEventListener('scroll', this.handleScroll);
	}
	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}

	handleScroll = event => {
		const top =
			this.state.liu === 'Safari'
				? window.pageYOffset
				: document.documentElement.scrollTop; /*谷歌、火狐  safari*/
		const clientHeight = event.srcElement.body.clientHeight;
		const scrollHeight = event.srcElement.body.scrollHeight;
		if (is_running && scrollHeight - top - clientHeight < 50) {
			is_running = false;
			console.log('到了加载的时刻了');
			this.setState({
				more: true,
			});
		}
	};

	handleMore = (page, page_size) => {
		const { dispatch } = this.props;
		let copy = deepClone(this.props.blog.list.query);
		copy.page = copy.page + 1;
		dispatch({
			type: 'blog/list',
			payload: copy,
		});
		this.setState({
			more: true
		})
	};

	handle = (type, value) => {
		const { dispatch } = this.props;
		let copy = deepClone(this.props.blog.list.query);
		copy[type] = value === 'down' ? 'up' : 'down';
		copy['group'] = type;
		dispatch({
			type: 'blog/list',
			payload: {
				...copy,
				page: 1,
			},
			base: true,
		});
		this.setState({
			more: false
		})
	};
	handleType = ({ key }) => {
		const {
			dispatch,
			blog: {
				list: { query },
			},
		} = this.props;

		this.setState(
			{
				classIndex: key,
				more: false
			},
			() => {
				dispatch({
					type: 'blog/list',
					payload: {
						...query,
						page: 1,
						classify: this.state.classIndex,
					},
					base: true,
				});
			}
		);
	};

	render() {
		const {
			blog: {
				list,
				list: { query },
			},
			loading,
		} = this.props;
		const { classify, classIndex, more } = this.state;
		const menu = (
			<Menu onClick={this.handleType}>
				{classify.map(item => {
					if (classIndex !== item.value) {
						return <Menu.Item key={item.value}>{item.label}</Menu.Item>;
					} else {
						return null;
					}
				})}
			</Menu>
		);
		const findText = (index = CLASSIFIY[0].value, arr = CLASSIFIY) => {
			let temp = '';
			arr.forEach(k => {
				if (k.value === index) {
					temp = k.label;
				}
			});
			return temp;
		};
		// console.log(more)
		return (
			<div className={l.blogBox} onScroll={this.handleScroll} ref={dom => (this.dom = dom)}>
				<div className={l.title}>文章列表</div>
				<div className={l.filter}>
					<div className={l.left}>
						<Radio.Group value={query.group}>
							<Radio.Button value="time" onClick={this.handle.bind(null, 'time', query.time)}>
								时间
								{query.time === 'down' ? <Icon type="arrow-down" /> : <Icon type="arrow-up" />}
							</Radio.Button>
							<Radio.Button value="hot" onClick={this.handle.bind(null, 'hot', query.hot)}>
								热度
								{query.hot === 'down' ? <Icon type="arrow-down" /> : <Icon type="arrow-up" />}
							</Radio.Button>
							<Radio.Button value="nice" onClick={this.handle.bind(null, 'nice', query.nice)}>
								点赞
								{query.nice === 'down' ? <Icon type="arrow-down" /> : <Icon type="arrow-up" />}
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
				{list.count > 0 ? (
					<div>
						<div className={l.list}>
							{list.items.map((item, index) => {
								return (
									<Link to={`/detail?id=${item.id}`} key={item.id}>
										<div className={l.cell}>
											<h3>{item.title}</h3>
											<div className={l.footer}>
												<div className={l.left}>
													时间：
													{item.created_at
														? moment(item.created_at).format('YYYY-MM-DD HH:mm')
														: ''}
												</div>
												<div className={l.right}>
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
						{list.count > list.items.length ? (
							<div className={l.page}>
								<span onClick={this.handleMore}>
									{loading ? <Icon type="loading" /> : null} 点击加载更多...
								</span>
							</div>
						) : more ? (
							<div className={l.page}>
								<i>-- 我也是有底线的 --</i>
							</div>
						) : null}
					</div>
				) : (
					<Empty />
				)}
			</div>
		);
	}
}

export default List;
