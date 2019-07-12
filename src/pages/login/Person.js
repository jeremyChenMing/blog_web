import React from 'react';
import l from './Login.less';
import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';
import { AVATAR, DEFAULT } from '@/constants/Constants'
import { getUserDetail, updateUser, getUserArticals, commentUser } from '@/services/api';
import { Row, Col, Form, Input, AutoComplete, Button, notification, Upload, Icon, Popconfirm, Tabs } from 'antd';
const AutoCompleteOption = AutoComplete.Option;
const { TabPane } = Tabs;

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
		autoCompleteResult: [],
		list: {
			count: 0,
			items: [],
		},
		comments: {
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
					user_name: data.user_name,
					nickname: data.nickname,
					phone: data.phone,
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
		const { autoCompleteResult } = this.state;
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
		} else {
			return (
				<Form.Item label={item.label}>
					{getFieldDecorator(item.key, {
						rules: [
							{
								required: true,
								message: '请输入邮箱',
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
	render() {
		const { fields, list, imageUrl, comments } = this.state;
		const { loading } = this.props;
		console.log(comments)
		return (
			<div className={l.personBox}>
				<div className={l.avatarBox}>
					<Upload
						name="avatar"
						listType="picture-card"
						showUploadList={false}
						// action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
						action={`/blog/upload/${this.props.message.id}`}
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

				{/*data.avatar && <img src={`http://127.0.0.1:7000/media/${data.avatar}/`} alt="avatar" />*/}
				<Form className={l.content} onSubmit={this.handleSubmit}>
					<Row gutter={24 * 4}>
						{fields.map(item => {
							return (
								<Col key={item.key} span={12}>
									{this.renderForm(item)}
								</Col>
							);
						})}
						<Col span={24} style={{ textAlign: 'center', padding: '40px 0' }}>
							<Button type="primary" htmlType="submit" loading={loading} style={{ width: 160 }}>
								保存
							</Button>
						</Col>
					</Row>
				</Form>

				<Tabs defaultActiveKey="1" style={{textAlign: 'left'}}>
					<TabPane key="1" tab={<span><Icon type="apple" />文章</span>}>
						<div className={l.articals}>
							<h3>
								共有 <span>{list.count}</span> 篇文章
							</h3>
							<ul className={l.list}>
								{list.items.map(item => {
									return (
										<li key={item.id}>
											<div>
												<Link to={`/detail?id=${item.id}`}>{item.title}</Link>
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
													<Icon className={l.actionIcon} type="delete" />
												</Popconfirm>
											</div>
										</li>
									);
								})}
							</ul>
						</div>
					</TabPane>
					<TabPane key="2" tab={<span><Icon type="apple" />评论</span>}>
						<div className={l.articals}>
							<h3>
								共有 <span>{comments.count}</span> 条评论
							</h3>
							<ul className={l.list}>
								{[].map(item => {
									return (
										<li key={item.id}>
											<div>
												<Link to={`/detail?id=${item.id}`}>{item.title}</Link>
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
													<Icon className={l.actionIcon} type="delete" />
												</Popconfirm>
											</div>
										</li>
									);
								})}
							</ul>
						</div>
					</TabPane>
				</Tabs>
				
			</div>
		);
	}
}
export default Person;
