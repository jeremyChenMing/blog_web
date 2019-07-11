import React from 'react';
import Link from 'umi/link'
import l from './Login.less'
import { connect } from 'dva';
import { Form, Icon, Input, Button, Checkbox } from 'antd';

@connect(({ login, loading }) => ({
	login,
	loading: loading.effects['login/login'],
}))
@Form.create()
class Login extends React.Component {
	componentDidMount() {
		const { form: {setFieldsValue} } = this.props;
		setFieldsValue({
			username: '361196961@qq.com',
			password: '123456'
		})
	}
  handleSubmit = e => {
  	const { dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        dispatch({
        	type: 'login/login',
        	payload: values,
        	callback: (error) => {
        		this.props.form.setFields({
	            password: {
	              // value: undefined,
	              errors: [new Error(error.msg)],
	            },
	          });
        	}
        })
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.props;
    return (
	    <div className={l.loginBox}>

	      <Form onSubmit={this.handleSubmit} className={l.login_form}>
	      	<h1>登录</h1>
	        <Form.Item>
	          {getFieldDecorator('username', {
	            rules: [{ required: true, message: '请输入用户名' }],
	          })(
	            <Input
	              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
	              placeholder="请输入用户名"
	            />,
	          )}
	        </Form.Item>
	        <Form.Item>
	          {getFieldDecorator('password', {
	            rules: [{ required: true, message: '请输入密码' }],
	          })(
	            <Input
	              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
	              type="password"
	              placeholder="请输入密码"
	            />,
	          )}
	        </Form.Item>
	        <Form.Item>
	          {getFieldDecorator('remember', {
	            valuePropName: 'checked',
	            initialValue: true,
	          })(
	          	<Checkbox>记住登录</Checkbox>
	          )}
	          <Link to="/login" className={l.login_form_forgot}>
	            忘记密码
	          </Link>
	          <Button type="primary" htmlType="submit" loading={loading} className={l.login_form_button}>
	           登录
	          </Button>
	          <Link to="/register">立即注册</Link>
	        </Form.Item>
	      </Form>
	    </div>
    );
  }
}
export default Login
