import React from 'react';
import l from './Login.less';
import Link from 'umi/link';
import moment from 'moment'
import cx from 'classnames'
import { connect } from 'dva';
import router from 'umi/router';
import QueueAnim from 'rc-queue-anim';
import MainBg from '@/components/widget/MainBg'
import { AVATAR, DEFAULT } from '@/constants/Constants'
import { getUserDetail, updateUser, getUserArticals, commentUser, getUserOfNice, getUserOfFollow, getUserOfFan } from '@/services/api';
import { Row, Col, Form, Input, AutoComplete, Button, notification, Upload, Icon, Popconfirm } from 'antd';
const AutoCompleteOption = AutoComplete.Option;

function beforeUpload(file) {
	// const isJPG = file.type === 'image/jpeg';
	// if (!isJPG) {
	// 	console.log('You can only upload JPG file!');
	// }
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isLt2M) {
		console.log('Image must smaller than 2MB!');
	}
	return isLt2M
	// return isJPG && isLt2M;
}

@connect(({ login, loading }) => ({
	message: login.message,
	loading: loading.effects['login/create'],
}))
@Form.create()
class Person extends React.Component {
	state = {
		fields: [
			{ label: '用户名', key: 'user_name', placeholder: '请输入用户名', disabled: true },
			{ label: '手机号', key: 'phone', placeholder: '请输入手机号', disabled: true },
			{ label: '昵称', key: 'nickname', placeholder: '请输入昵称' },
			{ label: '个人站', key: 'web_site', placeholder: '请输入个人站' },
		],
		navs: ['我的文章', '我的点赞', '我的评论', '我的粉丝', '我的关注'],
		active: 0,
		navActive: 0,
		oldActive: 0,
		autoCompleteResult: [],
		list: {
			count: 0,
			items: [],
		},
		comments: {
			count: 0,
			items: []
		},
		nices: {
			count: 0,
			items: []
		},
		followers: {
			count: 0,
			items: []
		},
		fans: {
			count: 0,
			items: []
		},
		loading: false,
		data: {},
	};
	componentDidMount() {
		const {
			form: { setFieldsValue },
			message,
		} = this.props;
		getUserDetail(message.id).then(data => {
			if (data && !data.code) {
				setFieldsValue({
					// user_name: data.user_name,
					nickname: data.nickname,
					// phone: data.phone,
					web_site: data.web_site,
				});
				this.setState({
					data: data,
					imageUrl: data.avatar
				});
			}
		});

		getUserArticals(message.id).then(data => {
			if (data && !data.code) {
				this.setState({
					list: data,
				});
			}
		});
		
		commentUser({user_id: message.id}).then(data => {
			if (data && !data.code) {
				this.setState({
					comments: data,
				});
			}
		});

		getUserOfNice(message.id).then(data => {
			if (data && !data.code) {
				this.setState({
					nices: data
				})
			}
		});

		getUserOfFollow(message.id).then(data => {
			if (data && !data.code) {
				this.setState({
					followers: data
				})
			}
		});

		getUserOfFan(message.id).then(data => {
			if (data && !data.code) {
				this.setState({
					fans: data
				})
			}
		});
	}
	handleSubmit = e => {
		const { message, dispatch } = this.props;
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				// console.log('Received values of form: ', values);
				values.avatar = this.state.imageUrl;
				updateUser(values, message.id).then(data => {
					if (data && !data.code) {
						notification.success({
							message: '保存信息成功！',
						});
						dispatch({
							type: 'login/changeLoginStatus',
							payload: {
								...message,
								avatar: this.state.imageUrl
							}
						})
						dispatch({
							type: 'login/saveCurrentUser',
							payload: {
								...message,
								avatar: this.state.imageUrl
							}
						})
					} else {
						notification.error({
							message: '保存信息失败！',
						});
					}
				});
			}
		});
	};
	renderForm = item => {
		const { getFieldDecorator } = this.props.form;
		const { autoCompleteResult, data } = this.state;

		const websiteOptions = autoCompleteResult.map(website => (
			<AutoCompleteOption key={website}>个人网站</AutoCompleteOption>
		));
		if (item.key === 'web_site') {
			return (
				<Form.Item label={item.label}>
					{getFieldDecorator(item.key, {
						rules: [{ required: false, message: '' }],
					})(
						<AutoComplete
							dataSource={websiteOptions}
							onChange={this.handleWebsiteChange}
							placeholder={item.placeholder}
						>
							<Input />
						</AutoComplete>
					)}
				</Form.Item>
			);
		} else if (item.key === 'user_name' || item.key === 'phone') {
			return (
				<Form.Item label={item.label} style={{marginBottom: '10px'}}>
					{data[item.key]}
				</Form.Item>
			);
		}
		else {
			return (
				<Form.Item label={item.label}>
					{getFieldDecorator(item.key, {
						rules: [
							{
								required: true,
								message: '必填项',
							},
						],
					})(<Input disabled={item.disabled} placeholder={item.placeholder} />)}
				</Form.Item>
			);
		}
	};

	handleChange = info => {
		if (info.file.status === 'uploading') {
			this.setState({ loading: true });
			return;
		}
		if (info.file.status === 'done') {
			// Get this url from response in real world.
			// console.log(info)
			// getBase64(info.file.originFileObj, imageUrl =>
			// 	this.setState({
			// 		imageUrl,
			// 		loading: false,
			// 	})
			// );

			if (info.file.response && !info.file.response.code) {
				this.setState({
					imageUrl: info.file.response.path,
					loading: false,
				})
			}
		}
	};

	confirm = () => {
		const {
			dispatch,
			location: { query },
		} = this.props;
		dispatch({
			type: 'blog/del',
			payload: query.id,
			callback: data => {
				if (data && !data.code) {
					notification.success({
						message: '删除文章成功！',
					});
					setTimeout(function() {
						router.push('/');
					}, 1500);
				} else {
					notification.error({
						message: data.msg,
					});
				}
			},
		});
	};

	handleNav = (index) => {
		console.log(index, 'navActive')
		this.setState({
			navActive: index,
			active: -1,
		})
	}

	End = (index, nav, {key, type}) => {
		// console.log('标题的key', index, '------', parseInt(key), type)
		let data = [];
		switch(index) {
			case 0 :
				data = this.state.list.items
			break;
			case 1 :
				data = this.state.nices.items
			break;
			case 2 :
				data = this.state.comments.items
			break;
			case 3 :
				data = this.state.fans.items
			break;
			case 4 :
				data = this.state.followers.items
			break;
			default:
				data = []
		}
		// console.log(data, 'data---data')
		if (type === 'leave' && parseInt(key) === data.length - 1) {
			// console.log('彻底结束了')
			this.setState({
				active: nav,
				oldActive: nav
			})
		}
	}

	showList = (key) => {
		let arr = [];
		let data = [];
		switch(key) {
			case 0:
				data = this.state.list.items;
				data.forEach( (item, index) => {
					arr.push(<div className={l.li} key={index}>
						<div>
							<Link to={`/detail?id=${item.id}`}>{`${index + 1}、`}{item.title}</Link>
						</div>
						<div>
							<span className={l.read}>阅读数：{item.hots}</span>
							<Link to={`/add?id=${item.id}`}><Icon className={l.actionIcon} type="form" /></Link>
							<Popconfirm
								title="确认删除吗？一旦删除将不可恢复！"
								okText="确认"
								cancelText="取消"
								onConfirm={this.confirm.bind(null, item.id)}
							>
								<Icon className={l.delIcon} type="delete" />
							</Popconfirm>
						</div>
					</div>)
				})
			break;
			case 1:
				data = this.state.nices.items;
				data.forEach( (item, index) => {
					arr.push(<div className={l.li} key={index}>
						<div>
							<Link to={`/detail?id=${item.id}`}>{`${index + 1}、`}{item.title}</Link>
						</div>
						<div>
							<span className={l.read}>阅读数：{item.hots}</span>
						</div>
					</div>)
				})
			break;
			case 2:
				data = this.state.comments.items;
				data.forEach( (item, index) => {
					arr.push(<div className={l.comli} key={index}>
						<span>{`${index + 1}、`}{item.word}</span>
							{
								item.to_comment ?
								<Link to={`/people/${item.to_comment_dict.id}`}><span className={l.people}>@{item.to_comment_dict ? item.to_comment_dict.nickname : ''}</span></Link>
								: null
							}
							<span className={l.time}>{item.created_at ? moment(item.created_at).format('YYYY-MM-DD HH:mm') : ''}</span>
							<p className={l.arts}><Link to={`/detail?id=${item.belong_artical.id}`}>文章：{item.belong_artical ? item.belong_artical.title : ''}</Link></p>
					</div>)
				})
			break;
			case 3:
				data = this.state.fans.items;
				data.forEach( (item, index) => {
					arr.push(<div className={l.foli} key={index}>
						{`${index + 1}、`}
						<img src={item.follower.avatar ? `${AVATAR}${item.follower.avatar}` : DEFAULT} alt=""/>
						<Link to={`/people/${item.follower.id}`}><span>{item.follower.nickname}</span></Link>	
					</div>)
				})
			break;
			case 4:
				data = this.state.followers.items;
				data.forEach( (item, index) => {
					arr.push(<div className={l.foli} key={index}>
						{`${index + 1}、`}
						<img src={item.follower.avatar ? `${AVATAR}${item.follower.avatar}` : DEFAULT} alt=""/>
						<Link to={`/people/${item.followed.id}`}><span>{item.followed.nickname}</span></Link>		
					</div>)
				})
			break;
			default:
				console.log('默认值')
		}
		return arr;
	}
	render() {
		const { fields, imageUrl, navs, active, navActive, oldActive } = this.state;
		const { loading } = this.props;
		return (
			<div className={l.personBox}>

				<div className={l.avatarBox}>
					<MainBg>
						<div className={l.ins}>
							<Upload
								name="avatar"
								listType="picture-card"
								showUploadList={false}
								// action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
								action={`/blog/upload`}
								beforeUpload={beforeUpload}
								onChange={this.handleChange}
							>
								{imageUrl ? (
									<img src={`${AVATAR}${imageUrl}/`} alt="avatar" />
								) : (
									<img
										src={DEFAULT}
										alt=""
									/>
								)}
							</Upload>
						</div>
					</MainBg>
				</div>

				<div className={cx(l.inner, l.box)}>
					<div className={l.left}>
						<div className={l.til}>基本信息：</div>
						<Form className={l.content} onSubmit={this.handleSubmit} hideRequiredMark>
							<Row gutter={12}>
								{fields.map(item => {
									return (
										<Col key={item.key} span={12}>
											{this.renderForm(item)}
										</Col>
									);
								})}
								<Col span={24} style={{ textAlign: 'center', padding: '0px 0' }}>
									<Button type="primary" htmlType="submit" loading={loading} style={{ width: 160 }}>
										保存
									</Button>
								</Col>
							</Row>
						</Form>	
						<ul className={l.list}>
							{
								navs.map( (item,index) => {
									return <li onClick={this.handleNav.bind(null, index)} key={index} className={l[index === navActive ? 'active' : null]}>
										<span>{item}</span>
										<span>数量</span>
									</li>
								})
							}
						</ul>
					</div>
					<div className={l.right}>
						{
							navs.map( (item,index) => {
								return(
									<QueueAnim onEnd={this.End.bind(null, oldActive, navActive)} key={index} className={l['anim-content']}>
										{
											active === index ?
											this.showList(navActive)
											:null
										}
									</QueueAnim>
								)
							})
						}
					</div>
				</div>
			</div>
		);
	}
}
export default Person;
