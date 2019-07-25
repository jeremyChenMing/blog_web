import React from 'react';
import { connect } from 'dva'
import l from './Layout.less';
import cx from 'classnames'
import router from 'umi/router';
import Link from 'umi/link'
import { AVATAR, DEFAULT } from '@/constants/Constants';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { 
	Layout,
	// Spin,
	Icon,
	AutoComplete,
	Input,
} from 'antd';

// const Option = AutoComplete.Option;
// const OptGroup = AutoComplete.OptGroup;
// function renderTitle(title) {
//   return (
//     <span>
//       {title}
//       <a
//         style={{ float: 'right' }}
//         href="https://www.google.com/search?q=antd"
//         target="_blank"
//         rel="noopener noreferrer"
//       >更多
//       </a>
//     </span>
//   );
// }
// const dataSource = [{
//   title: '话题',
//   children: [{
//     title: 'AntDesign',
//     count: 10000,
//   }, {
//     title: 'AntDesign UI',
//     count: 10600,
//   }],
// }, {
//   title: '问题',
//   children: [{
//     title: 'AntDesign UI 有多好',
//     count: 60100,
//   }, {
//     title: 'AntDesign 是啥',
//     count: 30010,
//   }],
// }, {
//   title: '文章',
//   children: [{
//     title: 'AntDesign 是一个设计语言',
//     count: 100000,
//   }],
// }];

// const options = dataSource.map(group => (
//   <OptGroup
//     key={group.title}
//     label={renderTitle(group.title)}
//   >
//     {group.children.map(opt => (
//       <Option key={opt.title} value={opt.title}>
//         {opt.title}
//       </Option>
//     ))}
//   </OptGroup>
// )).concat([
//   <Option disabled key="all">
//     <a
//       href="https://www.google.com/search?q=antd"
//       target="_blank"
//       rel="noopener noreferrer"
//     >
//       查看所有结果
//     </a>
//   </Option>,
// ]);


@connect(({login, blog}) => ({
	message: login.message,
  blog
}))
class BasicLayout extends React.Component {
	state = {
		searchMode: false,
		value: undefined,
	}
	componentDidMount() {
		const { dispatch } = this.props;
    dispatch({
      type: 'login/fetchCurrent',
    });
	}

	quite = () => {
		const { dispatch } = this.props;
		dispatch({
			type: 'login/logout'
		})
	}

	// search
	enterSearchMode = () => {
    this.setState({ 
    	searchMode: true 
    }, () => {
      const { searchMode } = this.state;
      if (searchMode) {
        this.input.focus();
      }
    });
	}

	leaveSearchMode = () => {
    this.setState({
      searchMode: false,
      value: '',
    });
  };

  onKeyDown = e => {
    if (e.key === 'Enter') {
      const { value } = this.state;
      this.timeout = setTimeout(() => {
        this.onPressEnter(value); // Fix duplicate onPressEnter
      }, 0);
    }
  };

  onChange = value => {
    this.setState({ value });
  };

  onPressEnter = (value) => {
    const {
      dispatch,
      // location,
      blog: { list: {query} },
    } = this.props;
    dispatch({
      type: 'blog/list',
      payload: {
        ...query,
        page: 1,
        word: value
      },
    });  	
  }

  addNews = () => {
    const {
      message
    } = this.props;
    if (message.id) {
      router.push('/add')
    }else{
      router.push('/login')
    }
  }
	render() {
		const {
			searchMode
		} = this.state;
    const {
      message,
      location
    } = this.props;
		// if (this.props.location.pathname === '/') {
		// 	return <div>
		// 		{this.props.children}
		// 	</div>
		// }
		return (
      <LocaleProvider local={zh_CN}>
			<React.Fragment>
				<Layout>
					<div className={l.header}>
						<div className={l.inner}>
				      <Link className={l.img} to="/"><img src="/img/krhr.png" alt="logo" /></Link>
              <div className={l.middle}>
                <Link to="/game">小游戏</Link>
              </div>
				      <div className={l.right}>
				      	{location.pathname === '/' && 
                <span className={l.searchBox}>
				      		<Icon type="search" key="Icon" className={l.searchIcon} onClick={this.enterSearchMode} />
				      		<AutoComplete
					          key="AutoComplete"
					          dataSource={[]}
					          className={cx(l.input, l[searchMode ? 'show' : null])}
					          onChange={this.onChange}
					        >
					          <Input
					            ref={node => {this.input = node;}}
					            onKeyDown={this.onKeyDown}
					            onBlur={this.leaveSearchMode}
					          />
					        </AutoComplete>
				      	</span>
                }
                {
                  message.id 
                  ? <span className={l.rightCell}>
                      <Link to="/person">
                        <img
                          src={message.avatar ? `${AVATAR}${message.avatar}` : DEFAULT}
                          alt="auth"
                        />
                      </Link>
                      &nbsp;&nbsp;
                      <span className={l.idname}>{message.nickname}</span>
                      <img src="/img/tuichu.png" alt="out" className={l.out} onClick={this.quite} />
                  </span>
                  : <span className={l.rightCell}>
                    <Link to="/login">登录</Link>
                    <Link to="/register">注册</Link>
                  </span>
                }
                <Icon onClick={this.addNews} className={l.icons} type="plus-circle" />
				      </div>
				    </div>
					</div>
					<div className={l.container}>
						{this.props.children}
					</div>
				</Layout>
			</React.Fragment>
      </LocaleProvider>
		);
	}
}


export default BasicLayout;
