import React from 'react';
import { connect } from 'dva';
import l from './Index.less';
import Link from 'umi/link';
import moment from 'moment';
import { CLASSIFIY } from '@/constants/Constants'
import Empty from '@/components/widget/Empty'
import { Pagination, Button, Icon, Dropdown, Menu, Spin } from 'antd';
const ButtonGroup = Button.Group;

@connect(({ blog, loading }) => ({
	blog,
	loading: loading.effects['blog/list'],
}))
class List extends React.Component {
	state = {
		classifiy: CLASSIFIY,
		classIndex: CLASSIFIY[0].value,
		time: 'down',
		hot: 'down'
	};
	componentDidMount() {
		const {
			dispatch,
			blog: { list },
		} = this.props;
		dispatch({
			type: 'blog/list',
		});
	}

	changePage = (page, page_size) => {
		const {
			dispatch,
			blog: { list },
		} = this.props;
		dispatch({
			type: 'blog/list',
			payload: {
				page: page,
			},
		});
	};



	handle = (type, value) => {
		const {
			dispatch,
			blog: { list: {query} },
		} = this.props;

		this.setState({
			[type]: value === 'down' ? 'up' : 'down'
		}, () => {
			dispatch({
				type: 'blog/list',
				payload: {
					...query,
					page: 1,
					[type]: this.state[type]
				},
			});
		})
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
		const { classifiy, classIndex, hot, time } = this.state;
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
		return (
			<div className={l.blogBox}>
				<div className={l.title}>文章列表</div>
				<div className={l.filter}>
					<div className={l.left}>
						<ButtonGroup>
							<Button onClick={this.handle.bind(null, 'time', time)}>
								时间
								{time === 'down' ? <Icon type="arrow-down" />: <Icon type="arrow-up" />}
							</Button>
							<Button onClick={this.handle.bind(null, 'hot', hot)}>
								热度
								{hot === 'down' ? <Icon type="arrow-down" />: <Icon type="arrow-up" />}
							</Button>
							<Dropdown overlay={menu}>
								<Button>
									{findText(classIndex)}
									<Icon type="down" />
								</Button>
							</Dropdown>
						</ButtonGroup>
					</div>
					<div className={l.right} />
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
												{item.updated_at ? moment(item.updated_at).format('YYYY-MM-DD HH:mm') : ''}
											</div>
											<div className={l.right} />
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
