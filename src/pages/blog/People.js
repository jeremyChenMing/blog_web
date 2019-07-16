import React from 'react';
import l from './People.less'
import { getUserDetail, getUserArticals } from '@/services/api';
import { AVATAR, DEFAULT } from '@/constants/Constants'
import Link from 'umi/link';
import { Button } from 'antd'

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
		console.log(params)
		if (params.id) {
			
			getUserDetail(params.id).then(data => {
				if (data && !data.code) {
					this.setState({
						data: data,
						imageUrl: data.avatar
					});
				}
			});

			getUserArticals(params.id).then(data => {
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
		return (
			<div className={l.peopleBox}>
				<div className={l.avatar}>
					<img src={imageUrl ? `${AVATAR}${imageUrl}/` : DEFAULT} alt="avatar" />
				</div>
				<Button className={l.care} type="primary" size="small">关注</Button>
				<h2 className={l.title}>基本信息</h2>
				<ul className={l.basic}>
					<li><span>姓名：</span>{data.nickname}</li>
					<li><span>网址：</span>{data.web_site}</li>
				</ul>
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
		);
	}
}

export default People
