import React from 'react';
import l from './Demo.less'
import { Button } from 'antd'
import QueueAnim from 'rc-queue-anim';


import { getTest, createTest, getTestDetail, putTest, deleteTest } from '@/services/api'

import BannerAnim, { Element } from 'rc-banner-anim';
import TweenOne from 'rc-tween-one';
import 'rc-banner-anim/assets/index.css';
const BgElement = Element.BgElement;





export default class Demo extends React.Component {
	state = {
		navs: ['导航1', '导航2', '导航3', '导航4', '导航5'],
		colors: [
			'#64CBCC', 
			'#12ffCC', 
			'#ffccff', 
			'#ccedb1', 
			'#ffe234'
		],
		show: false,
		active: '',
		text: '',
	}

	componentDidMount() {
		getTest({page: 2, page_size: 10}).then( data => {
			console.log(data)

		}).catch(err => {
			console.log(err)
		})
	}



	moveIn = (index, item, e) => {
		e.stopPropagation()
		// console.log('moveIn')
		// this.setState({
		// 	show: !this.state.show
		// })
		console.log(index, item)
		this.setState({
			active: index, 
			text: item
		})
		this.banner.slickGoTo(index)
	}

	moveOut = (e) => {
		e.stopPropagation()
		console.log('moveOut')
		this.setState({
			show: !this.state.show
		})
	}



	handle = () => {
		if (true) {
			const para = {
				title: 'name',
				code: '123'
			}
			// putTest,  createTest
			putTest(2, para).then( data => {
				console.log(data)

			}).catch(err => {
				console.log(err)
			})
		}else{
			getTestDetail(2).then( data => {
				console.log(data)

			}).catch(err => {
				console.log(err)
			})	
		}

		
	}
	handleDelete = () => {
		deleteTest(1).then( data => {
			console.log(data)
		}).catch(err => {
			console.log(err)
		})
	}
	render() {
		const { navs, colors, active, text } = this.state;
		// onMouseEnter={this.moveIn} onMouseLeave={this.moveOut}
		return (
			<div className={l.box}>
					<div className={l.nav} >
						<div className={l.header} >
							{
								navs.map( (item,index) => {
									return <div onMouseEnter={this.moveIn.bind(null, index, item)} key={index} className={l.head}>{item}</div>
								})
							}
						</div>
						<div className={l.btm}>
							<BannerAnim 
								thumb={false}
								arrow={false}
								initShow={1}
								ref={(c) => { this.banner = c; }}
								prefixCls={l['banner-user']}
								type="verticalOverlay"
							>
				        {
				        	navs.map( (m,n) => {
				        		return(
				        			<Element prefixCls={l['banner-user-elem']} key={n} sync={true}>
							        	{/*<BgElement key="bg2" className={l.bg} style={{ background: colors[n]}}/>
							          <TweenOne 
							          	className={l['banner-user-title']} 
							          	animation={{ y: 30, opacity: 0, type: 'from', duration: 220 }}
							          >
							            <div className={l.hd}>
							            	<div className={l.left}>
							            		<img src="/resource/car2.png" alt="icon"/>
							            	</div>
							            	<div className={l.right}>
							            		Ant Motion Banner{text}
							            	</div>
							            </div>
							          </TweenOne>*/}
							          <div className={l.hd}>
						            	<div className={l.left}>
						            		<img src="/resource/car2.png" alt="icon"/>
						            	</div>
						            	<div className={l.right}>
						            		Ant Motion Banner{text}
						            	</div>
						            </div>
							        </Element>
				        		)
				        	})
				        }
				      </BannerAnim>
						</div>
					</div>
				<div className={l.content}>
					相关内容
					<Button onClick={this.handle}>发送接口</Button>
					<Button onClick={this.handleDelete}>删除</Button>
				</div>
			</div>
		);
	}
}
