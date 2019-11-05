import React, { useState, useEffect, useContext, Suspense } from 'react';
import l from './Tool.less';
import { getAPITest } from '@/services/api';
import Pra from '@/components/widget/Pra';
import cx from 'classnames';
import { connect } from 'dva';
import { Alert, Button, Table } from 'antd';

@connect(({ login }) => ({
  login,
}))
class Child extends React.Component {
  
  handle = () => {
    console.log('父亲调用我了')
  }
  render() {
    return (
      <div>
        我是子组件<Button>child</Button>
      </div>
    );
  }
}


class Tool extends React.Component {
  state = {
    loading: true,
  };
  componentDidMount() {
    console.log(React.version)
  }
  handleFather = () => {
    console.log(this.node)
    // this.node.handle()
  }
  render() {
    const { loading } = this.state;
    

    return (
      <div>
        父组件
        <Button onClick={this.handleFather} type="primary">父亲</Button>
        <Child ref={node => this.node = node} />
      </div>
    );
  }
}

// usestate useEffect的例子
let timer;
const MyCom = () => {
  const [counter, setCounter] = useState(60)
  useEffect(() => {
    timer = setInterval(function () {
      setCounter(count => count - 1);
    }, 1000)
    return () => {
      console.log('结束return')
      clearInterval(timer)
    }
  }, [])
  useEffect(() => {
    document.title = `${counter}页`
    if (counter <= 50) {
      clearInterval(timer)
    }
  })
  return(
    <div>
      hello world{counter}
      <Button onClick={() => setCounter(counter + 1)}>+</Button>
      <Button onClick={() => setCounter(counter - 1)}>-</Button>
    </div>
  )
}




// useContext的例子
const Son = () => {
  const val = useContext(MyContext)
  return(
    <div>
      Son
      --父组件传过来的值{val}
    </div>
  )
}
const Daughter = () => {
  return(
    <MyContext.Consumer>
      {
        item => {
          return <div>{item}</div>
        }
      }
    </MyContext.Consumer>
  )
}
const MyContext = React.createContext();
const Father = () => {
  const [talk, setTalk] = useState('my dear!')
  return(
    <MyContext.Provider value={talk}>
      <div>
        Father <Button onClick={() => setTalk('my dear darling')}>Say</Button>
        <Son />
        <Daughter />
      </div>
    </MyContext.Provider>

    
  )
}


// Suspense 例子
const Clock = React.lazy(() => {
  console.log("start importing Clock");
  return import("./Single");
});
class Example extends React.Component{
  state = {
    dom: null
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        dom: <span>哈哈哈哈</span>
      })
    }, 1000)
  }
  render() {
    return(
      <Suspense fallback={<div>{'loading'}</div>}>
        <Clock />
      </Suspense>
    )
  }
}


export default Tool;
