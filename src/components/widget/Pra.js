import React, { useState, useEffect, useContext, memo, useMemo, useRef } from 'react';
import l from './Pra.less';
import { Button, Input, Form, Icon } from 'antd';

class NewReactComponent extends React.Component {
  state = {
    age: 0,
    name: '',
    bool: true,
  };
  static getDerivedStateFromProps(props, state) {
    // 组件每次被rerender的时候，包括在组件构建之后(虚拟dom之后，实际dom挂载之前)，每次获取新的props或state之后；;每次接收新的props之后都会返回一个对象作为新的state，返回null则说明不需要更新state
    // console.log('getDerivedStateFromProps', props, state, '0000')

    return { ...state, ...props.source };
  }
  componentDidCatch(error, info) {
    // 获取到javascript错误
    console.log('componentDidCatch');
  }
  changeValue = (type, e) => {
    console.log(e.target.value);
    this.setState({
      [type]: e.target.value,
    });
  };
  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    return (
      <div>
        <h2>New React.Component</h2>
        <Form onSubmit={this.props.handleSubmit}>
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('age', {
              rules: [{ required: true, message: 'Please input your age!' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username"
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Log in
            </Button>
          </Form.Item>
        </Form>
        <Input onChange={this.changeValue.bind(null, 'age')} type="text" value={this.state.age} />
        <Input onChange={this.changeValue.bind(null, 'name')} type="text" value={this.state.name} />
      </div>
    );
  }
  componentDidMount() {
    // 挂载后
    console.log('DidMount');
  }
  shouldComponentUpdate(nextProps, nextState) {
    // 组件Props或者state改变时触发，true：更新，false：不更新
    console.log('shouldComponentUpdate');
    return true;
  }
  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 组件更新前触发
    console.log('getSnapshotBeforeUpdate');
    return {};
  }
  componentDidUpdate() {
    // 组件更新后触发
    console.log('DidUpdate');
  }
  componentWillUnmount() {
    // 组件卸载时触发
    console.log('WillUnmount');
  }
}

const MyContext = React.createContext();

function Timer(props) {
  const text = useContext(MyContext);
  const [count, setCount] = useState(60);
  const it = useRef(null);
  useEffect(() => {
    it.current = setInterval(() => {
      setCount(count => count - 1);
    }, 1000);
  }, []);

  useEffect(() => {
    if (count <= 50) {
      props.end();
      clearInterval(it.current);
    }
  });
  return `(${count})`;
}

@Form.create()
class Pra extends React.Component {
  state = {
    send: true,
    source: {},
  };
  father = () => {
    this.setState({
      send: !this.state.send,
    });
  };
  componentDidMount() {
    this.setState({
      source: {
        name: 'jeremy',
        age: 18,
      },
    });

    console.log(globalVariable)
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };
  sets = () => {
    const {
      form: { setFieldsValue, setFields },
    } = this.props;
    // setFieldsValue({
    //    username: 'jeremy',
    //    age: 18
    //   })
    setFields({
      username: {
        // value: values.user,
        errors: [new Error('forbid ha')],
      },
    });
  };
  render() {
    const { send, source } = this.state;
    return (
      <MyContext.Provider value={'dark'}>
        <div>
          <div>
            第一段落
            <Button type="danger" onClick={this.sets}>
              error
            </Button>
          </div>
          {/*
            send ? '获取验证码' : <Timer end={this.father}/>
          */}
          <NewReactComponent {...this.props} handleSubmit={this.handleSubmit} source={source} />
        </div>
      </MyContext.Provider>
    );
  }
}

export default Pra;
