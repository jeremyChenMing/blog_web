import React from 'react';
import l from './Login.less';
import Link from 'umi/link'
import router from 'umi/router';
import { connect } from 'dva';
import {
	Form,
	Input,
	Tooltip,
	Icon,
	Select,
	Checkbox,
	Button,
	AutoComplete,
	// notification
} from 'antd';

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

@connect(({ login, loading }) => ({
	login,
	loading: loading.effects['login/create'],
}))
@Form.create()
class Register extends React.Component {
	state = {
		confirmDirty: false,
		autoCompleteResult: [],
	};
	componentDidMount() {
		const { form: {setFieldsValue} } = this.props;
		setFieldsValue({
			user_name: '361196961@qq.com',
			nickname: '完美',
			password: 123456,
			confirm: 123456,
			phone: '17310360959',
			web_site: 'jeremychen.com',
			agree: true,
		})
	}
	handleSubmit = e => {
		const { dispatch } = this.props;
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
				delete values.confirm;
				dispatch({
					type: 'login/create',
					payload: values,
				})
			}
		});
	};

	handleConfirmBlur = e => {
		const { value } = e.target;
		this.setState({ confirmDirty: this.state.confirmDirty || !!value });
	};

	compareToFirstPassword = (rule, value, callback) => {
		const { form } = this.props;
		if (value && value !== form.getFieldValue('password')) {
			callback('两次密码输入不一致，请重新输入');
		} else {
			callback();
		}
	};

	validateToNextPassword = (rule, value, callback) => {
		const { form } = this.props;
		if (value && this.state.confirmDirty) {
			form.validateFields(['confirm'], { force: true });
		}
		callback();
	};

	handleWebsiteChange = value => {
		let autoCompleteResult;
		if (!value) {
			autoCompleteResult = [];
		} else {
			autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
		}
		this.setState({ autoCompleteResult });
	};


	back = () => {
		router.push('/')
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const { autoCompleteResult } = this.state;
		const { loading } = this.props;
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 8 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 },
			},
		};
		const tailFormItemLayout = {
			wrapperCol: {
				xs: {
					span: 24,
					offset: 0,
				},
				sm: {
					span: 16,
					offset: 8,
				},
			},
		};
		const prefixSelector = getFieldDecorator('prefix', {
			initialValue: '86',
		})(
			<Select style={{ width: 70 }}>
				<Option value="86">+86</Option>
				<Option value="87">+87</Option>
			</Select>
		);

		const websiteOptions = autoCompleteResult.map(website => (
			<AutoCompleteOption key={website}>个人网站</AutoCompleteOption>
		));

		return (
			<div className={l.registerBox}>
				<h2>注册用户</h2>
				<Form className={l.register_form} {...formItemLayout} onSubmit={this.handleSubmit}>
					<Form.Item label="用户名">
						{getFieldDecorator('user_name', {
							rules: [
								{
									type: 'email',
									message: '这不是一个有效的邮箱',
								},
								{
									required: true,
									message: '请输入邮箱',
								},
							],
						})(<Input placeholder="请输入邮箱" />)}
					</Form.Item>
					<Form.Item label="密码" hasFeedback>
						{getFieldDecorator('password', {
							rules: [
								{
									required: true,
									message: '请填写密码',
								},
								{
									validator: this.validateToNextPassword,
								},
							],
						})(<Input.Password placeholder="请输入密码"/>)}
					</Form.Item>
					<Form.Item label="确认密码" hasFeedback>
						{getFieldDecorator('confirm', {
							rules: [
								{
									required: true,
									message: '请确认你的密码',
								},
								{
									validator: this.compareToFirstPassword,
								},
							],
						})(<Input.Password placeholder="请输入密码" onBlur={this.handleConfirmBlur} />)}
					</Form.Item>
					<Form.Item
						label={
							<span>
								昵称&nbsp;
								<Tooltip title="你想让别人怎么称呼你">
									<Icon type="question-circle-o" />
								</Tooltip>
							</span>
						}
					>
						{getFieldDecorator('nickname', {
							rules: [{ required: true, message: '请填写昵称', whitespace: true }],
						})(<Input placeholder="请输入昵称"/>)}
					</Form.Item>
					
					<Form.Item label="手机号">
						{getFieldDecorator('phone', {
							rules: [{ required: true, message: '请填写你的手机号' }],
						})(<Input addonBefore={prefixSelector} placeholder="请输入手机号" style={{ width: '100%' }} />)}
					</Form.Item>
					<Form.Item label="个人站">
						{getFieldDecorator('web_site', {
							rules: [{ required: false, message: '' }],
						})(
							<AutoComplete
								dataSource={websiteOptions}
								onChange={this.handleWebsiteChange}
								placeholder="个人网站"
							>
								<Input />
							</AutoComplete>
						)}
					</Form.Item>

					<Form.Item {...tailFormItemLayout}>
						{getFieldDecorator('agree', {
							rules: [{ required: true, message: '请勾选该选项' }],
							valuePropName: 'checked',
						})(
							<Checkbox>
								我同意<Link to="/register">《相关条款》</Link>
							</Checkbox>
						)}
					</Form.Item>
					<Form.Item {...tailFormItemLayout}>
						<Button type="primary" htmlType="submit" loading={loading}>
							注册
						</Button>
						<Button onClick={this.back} style={{marginLeft: 40}}>返回</Button>
					</Form.Item>
				</Form>
			</div>
		);
	}
}

export default Register;
