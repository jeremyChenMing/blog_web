import React from 'react';
import l from './Login.less';

import {
	Button,
	Form,
	Col,
	Row,
	Input,
	// notification,
} from 'antd';

const fieldLabels = {
	pre_password: '原密码',
	password: '新密码',
	again_password: '再次输入新密码',
};

@Form.create()
class Password extends React.Component {
	state = {
		submitting: false,
	};
	validate = () => {
		const {
			form: { validateFieldsAndScroll, setFields },
		} = this.props;
		validateFieldsAndScroll((error, values) => {
			if (!error) {
				if (values.password !== values.again_password) {
					setFields({
						again_password: {
							value: '',
							errors: [new Error('两次密码输入不一致，请重新输入！')],
						},
					});
				} else {
					console.log(values);
					this.requestFun({
						pre_password: values.pre_password,
						password: values.password,
					});
				}
			}
		});
	};
	requestFun = async para => {
		try {
			// const result = await resetPassword(para);
			// if (result && !result.code) {
			//   notification.success({
			//     message: '修改密码成功！',
			//   });
			//   this.props.form.resetFields();
			// }else{
			//   this.props.form.setFields({
			//     pre_password: {
			//       value: '',
			//       errors: [new Error(result.msg)],
			//     },
			//   });
			// }
		} catch (error) {
			console.log(error);
		}
	};

	render() {
		const {
			form: { getFieldDecorator },
		} = this.props;
		const { submitting } = this.state;
		return (
			<div className={l.passwordBox}>
				<Form hideRequiredMark>
					<Row gutter={16}>
						<Col lg={24} md={24} sm={24}>
							<Form.Item label={fieldLabels.pre_password}>
								{getFieldDecorator('pre_password', {
									rules: [{ required: true, message: '请输入' }],
								})(<Input type="password" style={{ width: '100%' }} placeholder="请输入" />)}
							</Form.Item>
						</Col>
						<Col lg={24} md={24} sm={24}>
							<Form.Item label={fieldLabels.password}>
								{getFieldDecorator('password', {
									rules: [{ required: true, message: '请输入' }],
								})(<Input type="password" style={{ width: '100%' }} placeholder="请输入" />)}
							</Form.Item>
						</Col>
						<Col lg={24} md={24} sm={24}>
							<Form.Item label={fieldLabels.again_password}>
								{getFieldDecorator('again_password', {
									rules: [{ required: true, message: '请输入' }],
								})(<Input type="password" style={{ width: '100%' }} placeholder="请输入" />)}
							</Form.Item>
						</Col>
					</Row>
				</Form>
				<Row>
					<Col lg={24} md={24} sm={24}>
						<Button type="primary" onClick={this.validate} loading={submitting}>
							提交
						</Button>
					</Col>
				</Row>
			</div>
		);
	}
}

export default Password;
