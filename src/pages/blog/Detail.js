import React from 'react';
import { connect } from 'dva';
import l from './Index.less';
import Link from 'umi/link';
import moment from 'moment';
import router from 'umi/router';
import QueueAnim from 'rc-queue-anim';
import { postFollow, getFollowed } from '@/services/api';
import 'braft-editor/dist/output.css'
import BraftEditor from 'braft-editor'
import { CLASSIFIYOBJS, AVATAR, DEFAULT } from '@/constants/Constants';
import { Input, Button, notification, Tag } from 'antd';
const { TextArea } = Input;


@connect(({ blog, login, comment, loading }) => ({
	blog,
	list: comment.list,
	message: login.message,
	submitting: loading.effects['blog/detail'],
}))
class Detail extends React.Component {
	state = {
		showId: undefined,
		word: undefined,
		replyValue: undefined,
		show: false,
		hasBeen: false
	};

	getFolloweds = async(follow) => {
		try{
			const result = await getFollowed({follower: follow});
			if (!result.code) {
				this.setState({
					hasBeen: result.follow
				})
			}
		}catch(err) {
			console.log(err)
		}
	}
	componentDidMount() {
		const {
			dispatch,
			location: { query },
			message
		} = this.props;
		console.log(query, '*')
		if (query.id) {
			dispatch({
				type: 'blog/details',
				payload: { 
					params: {artical_id: query.id} 
				},
				callback: (data) => {
					this.setState({
						show: true
					}, () => {
						this.getFolloweds(data.user.id)
					})
				},
			});

			dispatch({
				type: 'comment/list',
				payload: { artical_id: query.id },
				callback: () => {},
			});
		}
	}
	renderDetail = (str = '') => {
		const ok = BraftEditor.createEditorState(str).toHTML()
		return <div className="braft-output-content" dangerouslySetInnerHTML={{__html: ok}}></div>
	};

	goback = () => {
		router.goBack();
	};

	handleTextarea = e => {
		this.setState({
			word: e.target.value,
		});
	};
	handleComment = () => {
		const {
			message,
			blog: { detail },
			dispatch,
			location: { query },
		} = this.props;
		const { word } = this.state;
		if (!message.id) {
			// 没有登录，先去登陆
			router.push('/login');
			return;
		}
		dispatch({
			type: 'comment/create',
			payload: {
				word,
				belong_artical_id: detail.id,
				belong_user_id: message.id,
			},
			callback: data => {
				if (data && !data.code) {
					dispatch({
						type: 'comment/list',
						payload: { artical_id: query.id },
						callback: () => {},
					});
					this.setState({
						word: undefined
					})
				} else {
					notification.error({
						message: data.msg,
					});
				}
			},
		});
	};

	handleShow = id => {
		this.setState({
			showId: id,
			replyValue: undefined,
		});
	};

	changeReply = e => {
		this.setState({
			replyValue: e.target.value,
		});
	};

	handleReply = obj => {
		const {
			message,
			blog: { detail },
			dispatch,
			location: { query },
		} = this.props;
		const { replyValue } = this.state;
		// console.log(obj, replyValue);

		if (!message.id) {
			// 没有登录，先去登陆
			router.push('/login');
			return;
		}
		dispatch({
			type: 'comment/create',
			payload: {
				word: replyValue,
				belong_artical_id: detail.id,
				belong_user_id: message.id,
				to_comment: obj.id
			},
			callback: data => {
				if (data && !data.code) {
					dispatch({
						type: 'comment/list',
						payload: { artical_id: query.id },
						callback: () => {},
					});
					this.setState({
						showId: undefined
					})
				} else {
					notification.error({
						message: data.msg,
					});
				}
			},
		});
	};



	handleNice = (bool) => {
		const { dispatch, message, blog: { detail }, location: { query }, } = this.props;
		console.log(bool)
		dispatch({
			type: 'blog/nice',
			payload: {
				action: bool === '已赞' ? 'unlike' : 'like',
				// user_id: message.id,
				artical_id: detail.id,
			},
			callback: (data) => {
				if (data && !data.code) {
					dispatch({
						type: 'blog/details',
						payload: { 
							params: {artical_id: query.id} 
						},
						callback: () => {},
					});
				}
			}
		})
	}
	renderNice = (objs) => {
		const {message} = this.props;
		const arr = objs.user_like || [];
		const has = arr.map( item => item.id === message.id)
		return has[0] ? '已赞' : '赞'
	}


	handleFollow = (followed, follower) => {
		const para = {
			follower: followed.user.id,
		}
		postFollow(para).then( data => {
			if (data && !data.code) {
				this.getFolloweds(followed.user.id)
			}
		}).catch(err => {
			console.log(err)
		})
	}

	render() {
		const { show, hasBeen } = this.state;
		const {
			blog: { detail },
			list,
			message
		} = this.props;
		const selfe = detail.user && detail.user.id !== message.id ? true : false;
		return (
			<QueueAnim type="top">
			{
				show ?
				<div className={l.blogBox} key="detail">
					<h1>
						{detail.title}
						<img onClick={this.goback} src="/img/ic_order_back@2x.png" alt="back" />
					</h1>
					<div className={l.header}>
						<div className={l.left}>
							<span>
								创建时间：
								{detail.created_at ? moment(detail.created_at).format('YYYY-MM-DD HH:mm') : ''}
							</span>
							&nbsp;&nbsp;&nbsp;&nbsp;
							<span>
								类别：
								{CLASSIFIYOBJS[detail.classify]}
							</span>
							&nbsp;&nbsp;&nbsp;&nbsp;
							<span>
								点赞数：
								{detail.nices}
							</span>
							&nbsp;&nbsp;&nbsp;&nbsp;
							<span>
								阅读数：
								{detail.hots}
							</span>
							
						</div>
						<div className={l.right}>
							<img
								src={detail.user && detail.user.avatar ? `${AVATAR}${detail.user.avatar}` : DEFAULT}
								alt="auth"
							/>
							<span><Link to={`/people/${detail.user ? detail.user.id : ''}`}> {detail.user ? detail.user.nickname : ''}</Link></span>
							
							{selfe ? <Tag onClick={this.handleFollow.bind(null, detail, message)} className={l.tags} color={hasBeen ? 'blue' : ''}>{hasBeen ? '取关' : '关注'}</Tag> : null}
						</div>
					</div>
					<div className={l.content}>{this.renderDetail(detail.content)}</div>
					<div className={l.funBox}>
						<Button onClick={this.handleNice.bind(null, this.renderNice(detail))}>{this.renderNice(detail)} | {detail.user_like ? detail.user_like.length : 0}</Button>
					</div>
					<div className={l.commentBox}>
						<TextArea
							onChange={this.handleTextarea}
							value={this.state.word}
							placeholder="请输入评论内容"
							autosize={{ minRows: 4, maxRows: 6 }}
						/>
						<div className={l.btns}>
							<Button disabled={!this.state.word} onClick={this.handleComment} type="primary">
								发布评论
							</Button>
						</div>
						<div className={l.commentList}>
							<ul>
								{list.map(item => {
									return (
										<li key={item.id}>
											<div className={l.left}>
												<img
													src={
														item.belong_user && item.belong_user.avatar
															? `${AVATAR}${item.belong_user.avatar}`
															: DEFAULT
													}
													alt="auth"
												/>
											</div>
											<div className={l.right}>
												<p>
													{item.belong_user ? item.belong_user.nickname : ''}{' '}
													<span>
														{item.created_at
															? moment(item.created_at).format('YYYY-MM-DD HH:mm')
															: ''}
													</span>
												</p>
												<p>{item.word}</p>
												<span onClick={this.handleShow.bind(null, item.id)} className={l.replyAction}>
													回复
												</span>
												{
													item.comment_children && item.comment_children.length > 0
													? <div className={l.secComments}>
														{
															item.comment_children.map( k => {
																return <div className={l.li} key={k.id}>
																	<p>
																		{k.belong_user ? k.belong_user.nickname : ''}{' '}
																		<span>
																			{k.created_at
																				? moment(k.created_at).format('YYYY-MM-DD HH:mm')
																				: ''}
																		</span>
																	</p>
																	<p>{k.word}</p>
																</div>
															})
														}
													</div>
													: null
												}
												{item.id === this.state.showId && (
													<div className={l.replyBox}>
														<TextArea
															value={this.state.replyValue}
															onChange={this.changeReply}
															className={l.text}
															placeholder="请输入回复内容"
															autosize={{ minRows: 2, maxRows: 4 }}
														/>
														<Button
															onClick={this.handleReply.bind(null, item)}
															size="small"
															className={l.acs}
															type="primary"
														>
															添加回复
														</Button>
													</div>
												)}
											</div>
										</li>
									);
								})}
							</ul>
						</div>
					</div>
				</div>
				: null
			}
			</QueueAnim>
		);
	}
}

export default Detail;
