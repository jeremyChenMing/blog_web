import React from 'react';
import l from './People.less'
import { connect } from 'dva';
import { getUserDetail, getUserArticals } from '@/services/api';
import { AVATAR, DEFAULT } from '@/constants/Constants'
import Link from 'umi/link';
import QueueAnim from 'rc-queue-anim';
import { Button } from 'antd'




@connect(({ login }) => ({
	message: login.message,
}))
class People extends React.Component {
	state = {
		imageUrl: undefined,
		data: {},
		list: {
			count: 0,
			items: []
		}
	}
	componentDidMount() {
		const { match: {params} } = this.props;
		if (params.id) {
			getUserDetail(params.id).then(data => {
				if (data && !data.code) {
					this.setState({
						data: data,
						imageUrl: data.avatar
					});
				}
			});
			getUserArticals({group: 'artical', id: params.id}).then(data => {
				if (data && !data.code) {
					this.setState({
						list: data,
					});
				}
			});
		}
	}
	render() {
		const { imageUrl, data, list } = this.state;
		const { message } = this.props;
		const selfe = data && data.id !== message.id ? true : false;
		return (
			<div className={l.peopleBox}>
			<QueueAnim type="right" interval={200}>
				<div key="top" className={l.top}>
					<div className={l.avatar}>
						<img src={imageUrl ? `${AVATAR}${imageUrl}/` : DEFAULT} alt="avatar" />
					</div>
					{selfe ? <Button className={l.care} type="primary" size="small">关注</Button> : null }
				</div>
				<div key="basic" className={l.basicBox}>
					<h2 className={l.title}>基本信息</h2>
					<ul className={l.basic}>
						<li><span>姓名：</span>{data.nickname}</li>
						<li><span>网址：</span>{data.web_site}</li>
					</ul>	
				</div>
				<div key="artical">
					<h2 className={l.title}>文章 <span>共 ({list.count}) 篇</span></h2>
					<ul className={l.ars}>
						{
							list.items.map( item => {
								return <li key={item.id}>
									<Link to={`/detail?id=${item.id}`}>{item.title}</Link>
									<span>阅读数： {item.hots}</span>
								</li>
							})
						}
					</ul>	
				</div>
			</QueueAnim>
			</div>
		);
	}
}

export default People
