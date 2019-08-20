import React from 'react';
import { connect } from 'dva';
import l from './Index.less';
// import Link from 'umi/link'
// import moment from 'moment'
import router from 'umi/router';
import { CLASSIFIY } from '@/constants/Constants'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import 'braft-editor/dist/output.css'
// 引入编辑器组件
import BraftEditor from 'braft-editor'


import { Form, Input, Button, notification, Select } from 'antd';
const { Option } = Select;
const { TextArea } = Input;
const formItemLayout = {
	labelCol: { span: 4 },
	wrapperCol: { span: 20 },
};
const buttonItemLayout = {
	wrapperCol: { span: 14, offset: 4 },
};
@connect(({login}) =>({
	message: login.message
}))
@Form.create()
class Add extends React.Component {

	state = {
		fields: [
			{label: '标题', key: 'title', type: 'text', must: true},
			{label: '分类', key: 'classify', type: 'select', must: true, data: CLASSIFIY},
			{label: '内容', key: 'content', type: 'editor', must: true},
		],
	}

	componentDidMount() {
		const {
			dispatch,
			location: { query },
			form: { setFieldsValue }
		} = this.props;
		if (query.id) {
			dispatch({
				type: 'blog/details',
				payload: {id: query.id},
				callback: (data) => {
					setFieldsValue({
						title: data.title,
						content: BraftEditor.createEditorState(data.content),
						classify: data.classify
					})
				}	
			})
		}
	}

	
	handleSubmit = e => {
		const { dispatch, location: { query }, } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        values.user_id = this.props.message.id;
        // values.content = values.content.toHTML()
        values.content = values.content.toRAW()
        if (query.id) {
        	dispatch({
        		type: 'blog/edit',
        		payload: values,
        		id: query.id,
        		callback: (data) => {
        			if (data && !data.code) {
	        			notification.success({
	        				message: '更新文章成功！'
	        			})
	        			// setTimeout(function () {
	        			// 	router.push('/')
	        			// },1500)
	        		}else{
	        			notification.error({
	        				message: data.msg
	        			})
	        		}
        		}
        	})
        	return
        }
        dispatch({
        	type: 'blog/add',
        	payload: values,
        	callback: (data) => {
        		if (data && !data.code) {
        			notification.success({
        				message: '发表文章成功！'
        			})
        			setTimeout(function () {
        				router.push('/')
        			},1500)
        		}else{
        			notification.error({
        				message: data.msg
        			})
        		}
        	}
        })
      }
    });
  };

  goback = () => {
		router.goBack();
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const { fields } = this.state;
		const {
			location: { query },
		} = this.props;
		const renderCell = (obj) => {
			if (obj.type === 'textarea') {
				return <TextArea rows={4} placeholder="请填写"/>
			}else if (obj.type === 'select') {
				return <Select style={{ width: '100%' }} placeholder="请选择">
			      {
			      	obj.data.map( item => {
			      		if (item.nones) {
			      			return null
			      		}else{
			      			return <Option key={item.value}>{item.label}</Option>
			      		}
			      	})
			      }
			    </Select>
			}else if (obj.type === 'editor') {
				return <BraftEditor
                className="my-editor"
                // controls={controls}
                placeholder="请输入正文内容"
              />
			}
			else{
				return <Input placeholder="请填写"/>
			}
		}

		return (
			<div className={l.blogBox}>
				<h1>
					{query.id ? '更新' : '发布'}
					<img onClick={this.goback} src="/img/ic_order_back@2x.png" alt="back" />
				</h1>
				<div className={l.formBox}>
					<Form onSubmit={this.handleSubmit}>
						{
							fields.map( (item,index) => {
								return(
									<Form.Item key={item.key} label={item.label} {...formItemLayout}>
										{getFieldDecorator(item.key, {
					            rules: [{ 
					            	required: item.must, 
					            	message: '必填项' ,
					            }],
					          })(
					          	renderCell(item)
					          )}
									</Form.Item>	
								)
							})
						}
						<Form.Item {...buttonItemLayout}>
							<Button type="primary" htmlType="submit">提交</Button>
						</Form.Item>
					</Form>
				</div>
			</div>
		);
	}
}

export default Add;
